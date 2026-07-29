import { X, Calendar, Clock, MapPin, Users, Star, MessageSquare, Send, Heart, Share2, Info, UserPlus, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { getCategoryEmoji } from './ActivityCard';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useActivityStore } from '@/store/useActivityStore';

export function ActivityDetailModal({ activity, onClose }: { activity: any, onClose: () => void }) {
  const { user, setIsLoginModalOpen, setPendingActivityId, joinActivity, leaveActivity } = useAuthStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const fetchActivities = useActivityStore(state => state.fetchActivities);
  
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const isJoined = user && activity.participantIds?.includes(user.id);
  const favorite = isFavorite(activity.id);

  // Fetch chats on open
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
  }, [activity.id]);

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`¡Únete a ${activity.title} en SportSquad! ${window.location.href}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`¡Únete a ${activity.title} en SportSquad!`)}&url=${encodeURIComponent(window.location.href)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
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
    }
    setIsSending(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 flex flex-col max-h-[85dvh]">
        <div className="relative h-40 shrink-0 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
          <span className="text-6xl absolute opacity-20">
            {getCategoryEmoji(activity.category)}
          </span>
          <button onClick={onClose} className="absolute right-4 top-4 text-white/80 hover:text-white bg-black/20 p-1.5 rounded-full backdrop-blur-md transition-colors">
            <X size={20} />
          </button>
          
          <button onClick={handleShare} className="absolute right-14 top-4 text-white/80 hover:text-white bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1 text-sm font-medium transition-colors">
            <Share2 size={16} /> Compartir
          </button>
          
          {showShareMenu && (
            <div className="absolute right-4 top-14 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 flex flex-col gap-1 z-50">
              <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="px-4 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 font-bold rounded-lg text-sm text-center">WhatsApp</a>
              <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 font-bold rounded-lg text-sm text-center">Twitter</a>
              <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 font-bold rounded-lg text-sm text-center">Facebook</a>
              <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Enlace copiado'); setShowShareMenu(false); }} className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-sm text-center border-t border-slate-100 dark:border-slate-700 mt-1 pt-2">Copiar link</button>
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{activity.title}</h2>
          
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
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Organizer Note */}
          {activity.organizerNote && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl flex gap-3 text-blue-900 dark:text-blue-200">
              <Info className="shrink-0 text-blue-500 mt-0.5" size={20} />
              <div className="text-sm">
                <span className="font-bold block mb-1">Nota del organizador:</span>
                {activity.organizerNote}
              </div>
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
          
          {/* Sección de Comentarios */}
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
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          {isJoined ? (
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
                      alert('Como invitado solo puedes unirte a 1 actividad. Debes salir de tu actividad actual o iniciar sesión con Google para unirte a otra.');
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
                      // If it failed, give the guest their token back
                      if (user.type === 'guest') leaveActivity(activity.id);
                    }
                  } else {
                    alert('¡Te has unido con éxito!');
                    // Refresh global activities to update participants count on the card
                    fetchActivities();
                    onClose();
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
  );
}
