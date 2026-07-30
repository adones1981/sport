import { X, Calendar, Clock, MapPin, Users, Star, MessageSquare, Send, Heart, Share2, Info, UserPlus, Loader2, Camera, Check, Trash2, Edit, Plus, Filter } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { getCategoryEmoji } from './ActivityCard';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useActivityStore, ActivityItem } from '@/store/useActivityStore';
import { PublicProfileModal } from '../profile/PublicProfileModal';
import { DirectMessageModal } from '../chat/DirectMessageModal';
import dynamic from 'next/dynamic';

const CreateActivityModal = dynamic(() => import('./CreateActivityModal').then(mod => mod.CreateActivityModal), { ssr: false });

// Fórmula de Haversine para calcular distancia en metros
function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

export function ActivityDetailModal({ activity, onClose }: { activity: any, onClose: () => void }) {
  const { user, setIsLoginModalOpen, setPendingActivityId, joinActivity, leaveActivity, decrementGuestCreated } = useAuthStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const fetchActivities = useActivityStore(state => state.fetchActivities);
  
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // New States
  const [activeTab, setActiveTab] = useState<'info'|'admin'|'aportes'>('info');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  
  // Aportes state
  const { activityItems, fetchActivityItems, addActivityItem, removeActivityItem, addContribution, removeContribution } = useActivityStore();
  const [newItemName, setNewItemName] = useState('');
  const [itemsFilter, setItemsFilter] = useState<'all'|'mine'|'missing'|'least'>('all');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const isBenefit = activity.is_benefit || activity.isBenefit;
  const items: ActivityItem[] = activityItems[activity.id] || [];

  useEffect(() => {
    if (isBenefit) {
      fetchActivityItems(activity.id);
    }
  }, [activity.id, isBenefit]);
  
  // Modals for profile and DM
  const [selectedProfile, setSelectedProfile] = useState<{ id: string, name: string } | null>(null);
  const [messagingUser, setMessagingUser] = useState<{ id: string, name: string } | null>(null);
  
  const isJoined = user && activity.participantIds?.includes(user.id);
  const isCreator = user && activity.creatorId === user.id;
  const favorite = isFavorite(activity.id);

  const currentUserData = activity.participantData?.find((p: any) => p.user_id === user?.id);
  const hasArrived = currentUserData?.attendance_status === 'arrived' || currentUserData?.attendance_status === 'confirmed';
  const hasPendingConfirmation = currentUserData?.attendance_status === 'pending_confirmation';

  useEffect(() => {
    const fetchChats = async () => {
      const { data } = await supabase
        .from('activity_chats')
        .select('*')
        .eq('activity_id', activity.id)
        .order('created_at', { ascending: true });
      if (data) setComments(data);
    };
    fetchChats();

    const channel = supabase
      .channel(`chat_${activity.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_chats', filter: `activity_id=eq.${activity.id}` },
        (payload) => {
          setComments((current) => {
            const isDuplicate = current.length > 0 && 
                                current[current.length - 1].user_id === payload.new.user_id &&
                                current[current.length - 1].text === payload.new.text &&
                                new Date(payload.new.created_at).getTime() - new Date(current[current.length - 1].created_at).getTime() < 2000;
            if (isDuplicate) return current;
            return [...current, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activity.id]);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?activity=${activity.id}` : '';
  const shareText = `¡Únete a la actividad "${activity.title}"!\n📅 Fecha: ${new Date(activity.date).toLocaleDateString()}\n⏰ Hora: ${activity.time}\n📍 Lugar: ${activity.locationName}`;
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\nEnlace: ${shareUrl}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    setIsSending(true);
    
    const newChat = {
      activity_id: activity.id,
      user_id: user.id,
      user_name: user.name,
      text: newComment
    };
    
    const { error } = await supabase.from('activity_chats').insert([newChat]);
    if (!error) {
      setComments([...comments, { ...newChat, created_at: new Date().toISOString() }]);
      setNewComment('');
    } else {
      alert(`Error al guardar chat: ${error.message || JSON.stringify(error)}`);
    }
    setIsSending(false);
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer.')) {
      const { error } = await supabase.from('activities').delete().eq('id', activity.id);
      if (error) {
        alert('Error al eliminar: ' + error.message);
      } else {
        alert('Actividad eliminada con éxito');
        if (user?.type === 'guest') {
          decrementGuestCreated();
        }
        fetchActivities();
        onClose();
      }
    }
  };

  const handleCheckInClick = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }
    setIsCheckingIn(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const dist = getDistanceFromLatLonInM(
        position.coords.latitude, position.coords.longitude,
        activity.lat, activity.lng
      );
      
      // Permitimos margen de 200 metros
      if (dist > 200) {
        alert("Estás muy lejos. Acércate al lugar de la actividad para confirmar tu llegada.");
        setIsCheckingIn(false);
      } else {
        setShowCamera(true);
        setIsCheckingIn(false);
      }
    }, (error) => {
      alert("No se pudo obtener tu ubicación. Asegúrate de dar permisos de ubicación.");
      setIsCheckingIn(false);
    });
  };

    // TRANSFER LOGIC
    const [isTransferring, setIsTransferring] = useState(false);

    const handleProposeTransfer = async (targetUserId: string) => {
      if (confirm('¿Estás seguro de que deseas proponer a este usuario como el nuevo administrador de la actividad?')) {
        setIsTransferring(true);
        const { error } = await supabase.from('activities').update({ pending_transfer_id: targetUserId }).eq('id', activity.id);
        if (error) {
          alert('Error al proponer transferencia: ' + error.message);
        } else {
          alert('Propuesta de transferencia enviada. El usuario debe aceptarla.');
          fetchActivities();
        }
        setIsTransferring(false);
      }
    };

    const handleAcceptTransfer = async () => {
      setIsTransferring(true);
      const { error } = await supabase.from('activities').update({ creator_id: user?.id, pending_transfer_id: null }).eq('id', activity.id);
      if (error) {
        alert('Error al aceptar transferencia: ' + error.message);
      } else {
        alert('¡Ahora eres el administrador de esta actividad!');
        fetchActivities();
      }
      setIsTransferring(false);
    };

    const handleRejectTransfer = async () => {
      setIsTransferring(true);
      const { error } = await supabase.from('activities').update({ pending_transfer_id: null }).eq('id', activity.id);
      if (error) {
        alert('Error al rechazar transferencia: ' + error.message);
      } else {
        alert('Transferencia rechazada.');
        fetchActivities();
      }
      setIsTransferring(false);
    };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsCheckingIn(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.5); // Comprimir al 50%
        
        supabase.from('activity_participants')
          .update({ attendance_status: 'arrived', check_in_photo: dataUrl })
          .match({ activity_id: activity.id, user_id: user?.id })
          .then(({ error }) => {
            if (error) {
              alert("Error al subir foto: " + error.message);
            } else {
              alert("¡Llegada confirmada con éxito!");
              fetchActivities();
              setShowCamera(false);
            }
            setIsCheckingIn(false);
          });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAdminRate = async (participantId: string, status: string, rating: number) => {
    const { error } = await supabase.from('activity_participants')
      .update({ attendance_status: status, admin_rating: rating })
      .match({ activity_id: activity.id, user_id: participantId });
    if (!error) {
      alert("Calificación guardada.");
      fetchActivities();
    } else {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
    <div className="fixed inset-0 bg-black/50 z-[9998] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 flex flex-col max-h-[85dvh]">
        <div className="relative h-40 shrink-0 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
          <span className="text-6xl absolute opacity-20">
            {getCategoryEmoji(activity.category)}
          </span>
          <button onClick={onClose} className="absolute right-4 top-4 text-white/80 hover:text-white bg-black/20 p-1.5 rounded-full backdrop-blur-md transition-colors">
            <X size={20} />
          </button>
          
          <button onClick={() => setShowShareMenu(!showShareMenu)} className="absolute right-14 top-4 text-white/80 hover:text-white bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1 text-sm font-medium transition-colors">
            <Share2 size={16} /> Compartir
          </button>
          
          {showShareMenu && (
            <div className="absolute right-4 top-14 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 flex flex-col gap-1 z-50">
              <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 font-bold rounded-lg text-sm text-center">WhatsApp</a>
              <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 font-bold rounded-lg text-sm text-center">Twitter</a>
              <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 font-bold rounded-lg text-sm text-center">Facebook</a>
              <button onClick={() => { navigator.clipboard.writeText(`${shareText}\n\nEnlace: ${shareUrl}`); alert('Detalles y enlace copiados al portapapeles'); setShowShareMenu(false); }} className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-sm text-center border-t border-slate-100 dark:border-slate-700 mt-1 pt-2">Copiar invitación</button>
            </div>
          )}

          <button onClick={() => toggleFavorite(activity.id)} className={`absolute left-4 top-4 bg-black/20 p-1.5 rounded-full backdrop-blur-md transition-colors ${favorite ? 'text-red-500' : 'text-white/80 hover:text-white'}`}>
            <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
          </button>

          <div className="absolute -bottom-6 left-6 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-lg font-bold text-green-600 dark:text-green-400 border border-slate-100 dark:border-slate-700 flex items-center gap-2">
            <span>{getCategoryEmoji(activity.category)}</span> {activity.category}
            {activity.rating && (
              <span className="flex items-center gap-1 text-yellow-500 text-sm ml-2 font-medium bg-yellow-50 dark:bg-yellow-900/30 px-2 py-0.5 rounded-md">
                <Star size={14} fill="currentColor" /> {activity.rating}
              </span>
            )}
          </div>
        </div>
        
        <div className="p-6 pt-10 pb-12 overflow-y-auto flex-1">
          {(isCreator || isBenefit) && (
            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('info')}
                className={`pb-2 px-4 font-bold whitespace-nowrap ${activeTab === 'info' ? 'text-green-600 border-b-2 border-green-600' : 'text-slate-500'}`}
              >
                Detalles
              </button>
              {isBenefit && (
                <button 
                  onClick={() => setActiveTab('aportes')}
                  className={`pb-2 px-4 font-bold whitespace-nowrap ${activeTab === 'aportes' ? 'text-orange-500 border-b-2 border-orange-500' : 'text-slate-500'}`}
                >
                  🌭 Aportes
                </button>
              )}
              {isCreator && (
                <button 
                  onClick={() => setActiveTab('admin')}
                  className={`pb-2 px-4 font-bold whitespace-nowrap ${activeTab === 'admin' ? 'text-green-600 border-b-2 border-green-600' : 'text-slate-500'}`}
                >
                  Control Asistencia
                </button>
              )}
            </div>
          )}

          {activity.pendingTransferId === user?.id && activeTab === 'info' && (
            <div className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg border border-blue-400">
              <div className="flex gap-3">
                <Info className="shrink-0 mt-0.5" size={24} />
                <div>
                  <h4 className="font-bold text-lg mb-1">¡Propuesta de Administración!</h4>
                  <p className="text-sm text-blue-50 mb-3">El organizador actual quiere cederte la administración de esta actividad. ¿Aceptas el cargo?</p>
                  <div className="flex gap-2">
                    <button onClick={handleAcceptTransfer} disabled={isTransferring} className="bg-white text-blue-600 font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-blue-50 transition-colors text-sm flex items-center gap-1">
                      {isTransferring ? <Loader2 size={16} className="animate-spin"/> : <Check size={16} />} Aceptar
                    </button>
                    <button onClick={handleRejectTransfer} disabled={isTransferring} className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm border border-blue-500">
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'aportes' && isBenefit ? (
            <div>
              {/* Header Aportes */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 mb-4 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl">🌭</span>
                  <div>
                    <h3 className="font-bold text-lg">Lista de Aportes</h3>
                    <p className="text-orange-100 text-sm">¿Qué llevas a la completada?</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-bold">{items.filter(i => i.contributions.length > 0).length}/{items.length} cubiertos</span>
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-bold">{items.reduce((a, i) => a + i.contributions.length, 0)} personas aportando</span>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {([['all','Todos'],['mine','Mis aportes'],['missing','Sin cobertura'],['least','Menos aportados']] as const).map(([val, label]) => (
                  <button key={val} onClick={() => setItemsFilter(val)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${itemsFilter === val ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Lista de ítems */}
              <div className="space-y-3 mb-4">
                {(() => {
                  const FOOD_EMOJIS: Record<string, string> = {
                    'tomate': '🍅', 'tomates': '🍅',
                    'palta': '🥑', 'paltas': '🥑', 'aguacate': '🥑',
                    'pan': '🍞', 'pan de completo': '🌭', 'marraqueta': '🍞',
                    'vienesa': '🌭', 'vienesas': '🌭', 'salchicha': '🌭', 'salchichas': '🌭',
                    'ketchup': '🍅', 'mayonesa': '🫙', 'mostaza': '🫙', 'aderezo': '🫙',
                    'bebida': '🥤', 'bebidas': '🥤', 'jugo': '🥤',
                    'agua': '💧',
                    'servilleta': '🧻', 'servilletas': '🧻',
                    'plato': '🍽️', 'platos': '🍽️',
                    'cubiertos': '🍴',
                    'queso': '🧀',
                    'cebolla': '🧅', 'cebollas': '🧅',
                    'aji': '🌶️', 'ají': '🌶️', 'picante': '🌶️',
                    'carne': '🥩',
                    'pollo': '🍗',
                    'huevo': '🥚', 'huevos': '🥚',
                    'limón': '🍋', 'limon': '🍋',
                  };
                  const getEmoji = (name: string) => {
                    const lower = name.toLowerCase().trim();
                    return FOOD_EMOJIS[lower] || '🛒';
                  };

                  let filtered = [...items];
                  if (itemsFilter === 'mine') filtered = filtered.filter(i => i.contributions.some(c => c.user_id === user?.id));
                  if (itemsFilter === 'missing') filtered = filtered.filter(i => i.contributions.length === 0);
                  if (itemsFilter === 'least') filtered = [...filtered].sort((a, b) => a.contributions.length - b.contributions.length);

                  if (filtered.length === 0) return (
                    <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                      <span className="text-4xl block mb-2">🌭</span>
                      <p className="text-sm">No hay ítems que mostrar con ese filtro.</p>
                    </div>
                  );

                  return filtered.map(item => {
                    const iCarrying = item.contributions.some(c => c.user_id === user?.id);
                    const emoji = getEmoji(item.name || (item as any).item_name);
                    const itemName = item.name || (item as any).item_name;
                    return (
                      <div key={item.id} className={`rounded-2xl border p-4 transition-all ${iCarrying ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50'}`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-2xl shrink-0">{emoji}</span>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 dark:text-white capitalize">{itemName}</p>
                              {item.contributions.length > 0 ? (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.contributions.map(c => (
                                    <span key={c.id} className="text-xs bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                                      ✓ {c.user_name}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-400 mt-0.5">Nadie se apuntó aún</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {user && (
                              <button
                                onClick={() => iCarrying
                                  ? removeContribution(item.id, activity.id, user.id)
                                  : addContribution(item.id, activity.id, user.id, user.name)
                                }
                                className={`px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${iCarrying ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-600'}`}
                              >
                                {iCarrying ? <><Check size={14}/> Yo lo llevo</> : <>+ Yo lo llevo</>}
                              </button>
                            )}
                            {(isCreator) && (
                              <button onClick={() => removeActivityItem(item.id, activity.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                <Trash2 size={14}/>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Agregar nuevo ítem */}
              {(isJoined || isCreator) && (
                <div className="border-2 border-dashed border-orange-200 dark:border-orange-800/50 rounded-2xl p-4 bg-orange-50/50 dark:bg-orange-900/10">
                  <p className="text-sm font-bold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2">
                    <Plus size={16}/> Agregar algo que falta en la lista
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={e => setNewItemName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newItemName.trim()) {
                          setIsAddingItem(true);
                          addActivityItem(activity.id, newItemName.trim()).then(() => {
                            setNewItemName('');
                            setIsAddingItem(false);
                          });
                        }
                      }}
                      placeholder="Ej: Limones, mostaza, vasos..."
                      className="flex-1 border border-orange-200 dark:border-orange-800 rounded-xl p-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button
                      disabled={!newItemName.trim() || isAddingItem}
                      onClick={() => {
                        if (!newItemName.trim()) return;
                        setIsAddingItem(true);
                        addActivityItem(activity.id, newItemName.trim()).then(() => {
                          setNewItemName('');
                          setIsAddingItem(false);
                        });
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                      {isAddingItem ? <Loader2 size={16} className="animate-spin"/> : <Plus size={16}/>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'info' ? (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight pr-4">{activity.title}</h2>
                  <div className="flex items-center gap-3">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-800/50 shadow-sm flex items-center gap-1.5">
                      <span>{getCategoryEmoji(activity.category)}</span> {activity.category}
                    </span>
                    
                    <button 
                      onClick={() => {
                        if (activity.creatorId) {
                          setSelectedProfile({ id: activity.creatorId, name: activity.participants?.[0] || 'Organizador' });
                        }
                      }}
                      className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-xs bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors shadow-sm cursor-pointer group"
                    >
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activity.participants?.[0] || 'Organizador')}&background=random&size=32`} 
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="font-medium group-hover:underline">Organiza: {activity.participants?.[0] || 'Usuario anónimo'}</span>
                    </button>
                  </div>
                </div>
                {isCreator && (
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditModalOpen(true)} className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                      <Edit size={20} />
                    </button>
                    <button onClick={handleDelete} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                      <Trash2 size={20} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <MapPin className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{activity.locationName}</p>
                    <p className="text-sm">{activity.exactAddress || "Dirección por confirmar"}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Calendar className="text-blue-500 shrink-0" />
                  <p className="font-semibold">{new Date(activity.date).toLocaleDateString()} a las {activity.time}</p>
                </div>
                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                  <Users className="text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">{activity.participants?.length || 0} unidos de {activity.maxParticipants} máx.</p>
                    {activity.participants && activity.participants.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activity.participants.map((p: string, idx: number) => (
                          <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-xs pr-2.5 pl-1 py-1 rounded-full font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p)}&background=random&size=24`} alt={p} className="w-5 h-5 rounded-full" />
                            {p}
                            {(idx === 0 || activity.creatorId === activity.participantIds?.[idx]) && <span className="ml-1 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full shadow-sm">Organizador</span>}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {activity.organizerNote && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl flex gap-3 text-blue-900 dark:text-blue-200">
                  <Info className="shrink-0 text-blue-500 mt-0.5" size={20} />
                  <div className="text-sm">
                    <span className="font-bold block mb-1">Nota del organizador:</span>
                    {activity.organizerNote}
                  </div>
                </div>
              )}

              {/* Botón de Check-in para participantes que no son creadores */}
              {isJoined && !isCreator && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 rounded-xl">
                  <p className="font-bold text-green-800 dark:text-green-500 mb-2">Confirmar Asistencia en el lugar</p>
                  
                  {hasArrived ? (
                    <div className="flex items-center gap-2 text-green-600 font-bold bg-green-100 p-3 rounded-lg border border-green-200">
                      <Check size={20} /> ¡Llegada confirmada! Esperando al organizador.
                    </div>
                  ) : showCamera ? (
                     <div>
                       <label className="block bg-green-600 text-white text-center py-3 rounded-lg font-bold cursor-pointer hover:bg-green-500 transition-colors shadow-md">
                         <Camera size={20} className="inline mr-2 -mt-1"/> Tomar Foto del Lugar
                         <input 
                           type="file" 
                           accept="image/*" 
                           capture="environment" 
                           onChange={handlePhotoCapture}
                           className="hidden"
                         />
                       </label>
                       {isCheckingIn && <p className="text-sm mt-2 text-green-600 text-center font-medium flex justify-center items-center gap-1"><Loader2 size={16} className="animate-spin"/> Procesando foto...</p>}
                     </div>
                  ) : hasPendingConfirmation ? (
                    <div className="flex items-center gap-2 text-blue-600 font-bold bg-blue-100 p-3 rounded-lg border border-blue-200">
                      <Loader2 size={20} className="animate-spin" /> Esperando confirmación del administrador...
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button 
                        onClick={async () => {
                          setIsCheckingIn(true);
                          const { error } = await supabase.from('activity_participants').update({ attendance_status: 'pending_confirmation' }).match({ activity_id: activity.id, user_id: user.id });
                          if (!error) {
                            alert('Has marcado tu llegada. El administrador debe confirmarla.');
                            fetchActivities();
                          }
                          setIsCheckingIn(false);
                        }}
                        disabled={isCheckingIn}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg font-bold w-full flex items-center justify-center gap-2 shadow-sm transition-colors"
                      >
                        {isCheckingIn ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
                        Llegué (Manual)
                      </button>
                      <button 
                        onClick={handleCheckInClick}
                        disabled={isCheckingIn}
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-lg font-bold w-full flex items-center justify-center gap-2 shadow-sm transition-colors"
                      >
                        {isCheckingIn ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
                        Verificar GPS
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Calificar Actividad */}
              {user && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl">
                  <p className="text-sm font-bold text-yellow-800 dark:text-yellow-500 mb-2">Califica esta actividad</p>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} onClick={() => setRating(star)} className={`transition-transform hover:scale-110 ${rating && rating >= star ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}>
                        <Star size={24} fill={rating && rating >= star ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <MessageSquare size={18} /> Comentarios
                </h3>
                
                <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2">
                  {comments.map((c, idx) => (
                    <div key={idx} className={`p-3 rounded-lg text-sm border ${c.user_id === user?.id ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
                      <span className="font-bold text-slate-900 dark:text-white block mb-0.5">{c.user_name}</span>
                      <span className="text-slate-600 dark:text-slate-300">{c.text}</span>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-sm text-slate-500 italic text-center py-4">No hay mensajes aún. ¡Sé el primero en saludar!</p>
                  )}
                </div>

                {user ? (
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <input 
                      type="text" 
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      onFocus={(e) => setTimeout(() => e.target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300)}
                      placeholder="Escribe un comentario..." 
                      className="flex-1 border border-slate-200 p-2.5 rounded-lg text-sm dark:bg-slate-800 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-green-400 outline-none"
                    />
                    <button type="submit" disabled={isSending} className="bg-green-600 text-white p-2.5 rounded-lg hover:bg-green-500 transition-colors shadow-sm disabled:opacity-50">
                      {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                  </form>
                ) : (
                  <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-sm text-center text-slate-500 font-medium">
                    Inicia sesión para dejar un comentario
                  </div>
                )}
              </div>
            </>
          ) : (
            // Panel de Administrador
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 p-4 rounded-xl text-blue-800 dark:text-blue-200 text-sm">
                <Info size={16} className="inline mr-2 -mt-1" />
                Aquí puedes verificar quién asistió realmente viendo sus fotos y calificar su comportamiento.
              </div>
              
              <div className="space-y-4">
                {activity.participantData?.filter((p:any) => p.user_id !== activity.creatorId).map((p: any) => (
                  <div key={p.user_id} className="border border-slate-200 dark:border-slate-700 p-4 rounded-xl space-y-3 bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-3 cursor-pointer hover:underline"
                        onClick={() => setSelectedProfile({ id: p.user_id, name: p.user_name })}
                      >
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.user_name)}&background=random&size=40`} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{p.user_name}</p>
                          <p className="text-xs text-slate-500">Participante</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {activity.pendingTransferId === p.user_id ? (
                          <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-1 rounded-lg">Transferencia pendiente...</span>
                        ) : (
                          <button 
                            onClick={() => handleProposeTransfer(p.user_id)}
                            disabled={isTransferring || !!activity.pendingTransferId}
                            className="text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium border border-transparent hover:border-orange-200 dark:hover:border-orange-800 disabled:opacity-50"
                            title="Delegar administración"
                          >
                            <Users size={16} /> Delegar
                          </button>
                        )}
                        <button 
                          onClick={() => setMessagingUser({ id: p.user_id, name: p.user_name })}
                          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                        >
                          <MessageSquare size={16} /> Mensaje
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                       <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${p.attendance_status === 'confirmed' ? 'bg-green-100 text-green-700' : p.attendance_status === 'absent' ? 'bg-red-100 text-red-700' : p.attendance_status === 'arrived' ? 'bg-blue-100 text-blue-700' : p.attendance_status === 'pending_confirmation' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'}`}>
                         {p.attendance_status === 'confirmed' ? 'Confirmado' : p.attendance_status === 'absent' ? 'Ausente' : p.attendance_status === 'arrived' ? 'Esperando Revisión' : p.attendance_status === 'pending_confirmation' ? 'Revisar Llegada' : 'Pendiente'}
                       </span>
                    </div>
                    
                    {p.check_in_photo && (
                      <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
                        <img src={p.check_in_photo} alt="Foto Check-in" className="w-full max-h-48 object-cover" />
                        <div className="bg-slate-100 p-2 text-xs text-center font-medium text-slate-500 flex items-center justify-center gap-1">
                          <Check size={14} className="text-green-500"/> Foto tomada en el lugar
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 mt-2">
                       <button 
                         onClick={() => handleAdminRate(p.user_id, 'confirmed', 5)}
                         className={`py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 ${p.attendance_status === 'confirmed' ? 'bg-green-600 text-white' : p.attendance_status === 'pending_confirmation' ? 'bg-purple-600 text-white animate-pulse' : 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-200'}`}
                       > 
                         <Check size={16} /> {p.attendance_status === 'pending_confirmation' ? 'Confirmar Llegada' : 'Confirmar (5★)'} 
                       </button>
                       <button 
                         onClick={() => handleAdminRate(p.user_id, 'absent', 1)}
                         className={`py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 ${p.attendance_status === 'absent' ? 'bg-red-600 text-white' : 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-200'}`}
                       > 
                         <X size={16} /> Faltó (1★) 
                       </button>
                    </div>
                  </div>
                ))}
                
                {(!activity.participantData || activity.participantData.filter((p:any) => p.user_id !== activity.creatorId).length === 0) && (
                  <p className="text-center text-slate-500 italic py-8 bg-slate-100 dark:bg-slate-800 rounded-xl">Aún no hay participantes inscritos.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          {isJoined && !isCreator ? (
            <button 
              onClick={async () => {
                setIsLeaving(true);
                const { error } = await supabase.from('activity_participants').delete().match({ activity_id: activity.id, user_id: user.id });
                if (error) {
                  alert(`Error al salir: ${error.message || JSON.stringify(error)}`);
                } else {
                  if (user.type === 'guest') leaveActivity(activity.id);
                  alert('Has salido de la actividad.');
                  fetchActivities();
                  onClose();
                }
                setIsLeaving(false);
              }}
              disabled={isLeaving}
              className="w-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors shadow-sm disabled:opacity-70"
            >
              {isLeaving ? <Loader2 size={20} className="animate-spin" /> : <>Salir de la Actividad</>}
            </button>
          ) : isCreator ? (
            <button onClick={handleDelete} className="w-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors shadow-sm">
              <Trash2 size={20} /> Eliminar Actividad
            </button>
          ) : (
            <button 
              onClick={async () => {
                if (!user) {
                  setPendingActivityId(activity.id);
                  setIsLoginModalOpen(true);
                  onClose();
                } else {
                  if (user.type === 'guest') {
                    const canJoin = joinActivity(activity.id);
                    if (!canJoin) {
                      alert('Como invitado solo puedes unirte a 5 actividades. Debes salir de alguna o iniciar sesión con Google para unirte a más.');
                      return;
                    }
                  }
                  
                  setIsJoining(true);
                  const { error } = await supabase.from('activity_participants').insert([{
                    activity_id: activity.id,
                    user_id: user.id,
                    user_name: user.name
                  }]);
                  
                  if (error) {
                    if (error.code === '23505') {
                      alert('¡Ya estás unido a esta actividad!');
                    } else {
                      alert(`Hubo un error al unirse. Detalle: ${error.message || JSON.stringify(error)}`);
                      if (user.type === 'guest') leaveActivity(activity.id);
                    }
                  } else {
                    alert('¡Te has unido con éxito!');
                    fetchActivities();
                  }
                  setIsJoining(false);
                }
              }}
              disabled={isJoining}
              className="w-full bg-slate-900 dark:bg-green-600 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-slate-800 dark:hover:bg-green-500 transition-colors shadow-lg disabled:opacity-70"
            >
              {isJoining ? <Loader2 size={20} className="animate-spin" /> : user ? (
                 <>
                   <UserPlus size={20} /> Unirme a la Actividad
                 </>
              ) : (
                 "Inicia sesión para Unirte"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
    
    {isEditModalOpen && (
      <CreateActivityModal 
        onClose={() => setIsEditModalOpen(false)} 
        initialData={activity}
      />
    )}

    {selectedProfile && (
      <PublicProfileModal 
        creatorId={selectedProfile.id} 
        creatorName={selectedProfile.name} 
        onClose={() => setSelectedProfile(null)}
        onMessage={(isJoined && user?.id !== selectedProfile.id) ? () => {
          setMessagingUser(selectedProfile);
          setSelectedProfile(null);
        } : undefined}
      />
    )}

    {messagingUser && (
      <DirectMessageModal 
        otherUserId={messagingUser.id}
        otherUserName={messagingUser.name}
        onClose={() => setMessagingUser(null)}
      />
    )}
    </>
  );
}
