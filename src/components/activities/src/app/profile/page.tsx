'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActivities } from '@/hooks/useActivities';
import { ArrowLeft, User, Activity, Calendar, Zap, CheckCircle, Save, Loader2, Camera, MessageCircle, MapPin, XCircle, Settings, Edit3, Users, Star } from 'lucide-react';
import { CreateActivityModal } from '@/components/activities/CreateActivityModal';
import { ActivityDetailModal } from '@/components/activities/ActivityDetailModal';
import { AdminModal } from '@/components/activities/AdminModal';
import { RatingModal } from '@/components/activities/RatingModal';
import { supabase } from '@/lib/supabase';

function ProfileContent() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const { activities } = useActivities({ category: 'all' });
  
  // States for modals
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [chattingActivity, setChattingActivity] = useState<any>(null);
  const [adminActivity, setAdminActivity] = useState<any>(null);
  const [ratingActivityObj, setRatingActivityObj] = useState<any>(null);
  const [ratedActivityIds, setRatedActivityIds] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const initialTab = searchParams?.get('tab') === 'activities' ? 'activities' : 'edit';
  const [activeTab, setActiveTab] = useState<'edit' | 'activities'>(initialTab);
  
  useEffect(() => {
    if (searchParams) {
      if (searchParams.get('tab') === 'activities') {
        setActiveTab('activities');
      } else {
        setActiveTab('edit');
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      supabase.from('activity_ratings')
        .select('activity_id')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) setRatedActivityIds(data.map(r => r.activity_id));
        });
    }
  }, [user]);

  const [activitySubTab, setActivitySubTab] = useState<'upcoming' | 'created' | 'history'>('upcoming');
  
  const sportsList = ['Fútbol', 'Tenis', 'Pádel', 'Básquet', 'Ciclismo', 'Running', 'Gym', 'Café', 'Comer', 'Cine', 'Paseo'];
  
  const [formData, setFormData] = useState({
     name: user?.name || '',
     phone: user?.phone || '',
     instagram: user?.instagram || '',
     bio: user?.bio || '',
     favoriteSports: user?.favoriteSports || [],
     avatarUrl: user?.avatarUrl || ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (!user) {
    return (
      <div className="min-h-[100dvh] bg-slate-900 flex items-center justify-center flex-col gap-4 text-white">
        <p className="text-xl font-bold">Debes iniciar sesión para ver tu perfil.</p>
        <button onClick={() => router.push('/')} className="bg-green-600 px-6 py-2 rounded-lg font-bold hover:bg-green-500 transition-colors">Volver al inicio</button>
      </div>
    );
  }

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateProfile(formData);
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  const toggleSport = (sport: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteSports: prev.favoriteSports?.includes(sport) 
        ? prev.favoriteSports.filter(s => s !== sport)
        : [...(prev.favoriteSports || []), sport]
    }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen es muy grande. Máximo 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Dynamic logic for activities
  const now = new Date();
  const upcomingActivities = activities.filter(a => a.participants?.includes(user?.name) && a.creatorId !== user?.id && new Date(`${a.date}T${a.time}`) >= now);
  const createdActivities = activities.filter(a => a.creatorId === user?.id);
  const historyActivities = activities.filter(a => a.participants?.includes(user?.name) && new Date(`${a.date}T${a.time}`) < now);

  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white pb-20">
      {/* Header */}
      <div className="bg-green-600 text-white pt-6 pb-6 px-4 shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Mi Dashboard</h1>
          </div>
          <button onClick={() => router.push('/')} className="px-3 sm:px-4 py-2 bg-white text-green-700 rounded-lg font-bold hover:bg-green-50 transition-colors flex items-center gap-2 shadow-sm text-sm sm:text-base">
            <ArrowLeft size={20} /> <span>Volver al Mapa</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-6 px-4 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
           <button 
             onClick={() => setActiveTab('edit')} 
             className={`flex items-center gap-3 p-4 rounded-xl font-bold transition-all ${activeTab === 'edit' ? 'bg-green-600 text-white shadow-lg scale-[1.02]' : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
           >
             <User size={20} /> Editar Perfil
           </button>
           <button 
             onClick={() => setActiveTab('activities')} 
             className={`flex items-center gap-3 p-4 rounded-xl font-bold transition-all ${activeTab === 'activities' ? 'bg-green-600 text-white shadow-lg scale-[1.02]' : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
           >
             <Activity size={20} /> Mis Actividades
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'edit' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Settings className="text-slate-400" /> Configuración de Perfil</h2>
                
                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <img src={formData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&size=100`} className="w-24 h-24 rounded-full border-4 border-green-500 shadow-md object-cover" alt="Avatar" />
                    <label className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition-colors border-2 border-white dark:border-slate-800 cursor-pointer">
                      <Camera size={16} />
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{formData.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Usuario {user.type === 'guest' ? 'Invitado' : 'Registrado'}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nombre Completo / Apodo</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Teléfono / WhatsApp</label>
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+569..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Instagram (Opcional)</label>
                      <input type="text" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} placeholder="@usuario" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">🔒 Tus datos de contacto solo serán visibles para los integrantes de las actividades a las que te hayas unido.</p>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Biografía / Intereses</label>
                    <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value.substring(0,200)})} rows={3} placeholder="Busco jugar pádel categoría 4ta los fines de semana..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"></textarea>
                    <div className="text-right text-xs text-slate-400 mt-1">{formData.bio.length}/200</div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Deportes Favoritos</label>
                    <div className="flex flex-wrap gap-2">
                      {sportsList.map(sport => {
                        const isSelected = formData.favoriteSports?.includes(sport);
                        return (
                          <button 
                            key={sport}
                            onClick={() => toggleSport(sport)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${isSelected ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/40 dark:border-green-500 dark:text-green-300 scale-105' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500'}`}
                          >
                            {sport}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                  <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-70"
                  >
                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 min-h-[600px]">
              {/* Subtabs */}
              <div className="flex overflow-x-auto border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <button onClick={() => setActivitySubTab('upcoming')} className={`flex-1 py-4 px-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors flex items-center justify-center gap-2 ${activitySubTab === 'upcoming' ? 'border-green-500 text-green-600 dark:text-green-400 bg-white dark:bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}><Calendar size={18}/> Próximas (Inscrito)</button>
                <button onClick={() => setActivitySubTab('created')} className={`flex-1 py-4 px-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors flex items-center justify-center gap-2 ${activitySubTab === 'created' ? 'border-green-500 text-green-600 dark:text-green-400 bg-white dark:bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}><Zap size={18}/> Creadas por mí</button>
                <button onClick={() => setActivitySubTab('history')} className={`flex-1 py-4 px-4 font-bold text-sm whitespace-nowrap border-b-2 transition-colors flex items-center justify-center gap-2 ${activitySubTab === 'history' ? 'border-green-500 text-green-600 dark:text-green-400 bg-white dark:bg-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}><CheckCircle size={18}/> Historial</button>
              </div>

              <div className="p-6">
                {activitySubTab === 'upcoming' && (
                  <div className="space-y-4">
                    {upcomingActivities.map(act => (
                      <div key={act.id} className="border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-slate-50 dark:bg-slate-900/50 hover:shadow-md transition-shadow">
                         <div>
                           <span className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded mb-2 inline-block border border-green-200 dark:border-green-800/50">{act.category}</span>
                           <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">{act.title}</h3>
                           <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Calendar size={14} className="text-blue-500"/> {new Date(act.date).toLocaleDateString()} a las {act.time}</p>
                           <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1.5"><MapPin size={14} className="text-red-500"/> {act.locationName}</p>
                         </div>
                         <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
                           <button onClick={() => setChattingActivity(act)} className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"><MessageCircle size={16} className="text-green-500"/> Chat</button>
                           <button onClick={() => alert('Se ha cancelado tu inscripción en: ' + act.title)} className="flex-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"><XCircle size={16}/> Cancelar</button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {activitySubTab === 'created' && (
                  <div className="space-y-4">
                    {createdActivities.map(act => (
                      <div key={act.id} className="border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-blue-50/50 dark:bg-blue-900/10 hover:shadow-md transition-shadow">
                         <div className="flex-1">
                           <span className="text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded mb-2 inline-block border border-blue-200 dark:border-blue-800/50">Organizador</span>
                           <h3 className="font-bold text-lg mb-1 text-slate-900 dark:text-white">{act.title}</h3>
                           
                           <div className="flex flex-col gap-1.5 mt-2">
                             <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Calendar size={14} className="text-blue-500"/> {new Date(act.date).toLocaleDateString()} a las {act.time}</p>
                             <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><MapPin size={14} className="text-red-500"/> {act.locationName}</p>
                             <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-1.5"><Users size={16} className="text-yellow-500"/> Cupos: {act.participants?.length || 0} de {act.maxParticipants} Confirmados</p>
                           </div>
                         </div>
                         <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-2 md:mt-0 flex-wrap justify-end">
                           <button onClick={() => setChattingActivity(act)} className="flex-1 sm:flex-none bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"><MessageCircle size={16} className="text-green-500"/> Chat</button>
                           <button onClick={() => setAdminActivity(act)} className="flex-1 sm:flex-none bg-slate-900 dark:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"><Users size={16}/> Admin</button>
                           <button onClick={() => setEditingActivity(act)} className="flex-1 sm:flex-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200"><Edit3 size={16} className="text-blue-500"/> Editar</button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}

                {activitySubTab === 'history' && (
                  <div className="space-y-4">
                    {historyActivities.map(act => (
                      <div key={act.id} className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-slate-50 dark:bg-slate-900/30 opacity-80 hover:opacity-100 transition-opacity">
                         <div>
                           <h3 className="font-bold text-lg mb-1 text-slate-600 dark:text-slate-300">{act.title}</h3>
                           <p className="text-sm text-slate-400 dark:text-slate-500 flex items-center gap-1.5"><CheckCircle size={14} className="text-green-500"/> {new Date(act.date).toLocaleDateString()} - Completada</p>
                         </div>
                         {ratedActivityIds.includes(act.id) ? (
                           <button disabled className="bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 w-full md:w-auto"><CheckCircle size={16}/> Ya calificada</button>
                         ) : (
                           <button onClick={() => setRatingActivityObj(act)} className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border border-yellow-200 dark:border-yellow-900/50 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors w-full md:w-auto"><Star size={16}/> Calificar Evento</button>
                         )}
                      </div>
                    ))}
                    {historyActivities.length === 0 && (
                      <div className="text-center py-10">
                        <CheckCircle size={40} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500">Aún no tienes actividades pasadas.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in z-[100] font-bold border border-slate-700 dark:border-slate-200">
          <CheckCircle className="text-green-400 dark:text-green-500" size={24} />
          Perfil actualizado correctamente
        </div>
      )}
      {editingActivity && <CreateActivityModal initialData={editingActivity} onClose={() => setEditingActivity(null)} />}
      {chattingActivity && <ActivityDetailModal activity={chattingActivity} onClose={() => setChattingActivity(null)} />}
      {adminActivity && <AdminModal activity={adminActivity} onClose={() => setAdminActivity(null)} />}
      {ratingActivityObj && (
        <RatingModal 
          activity={ratingActivityObj} 
          onClose={() => setRatingActivityObj(null)} 
          onSaved={() => {
            setRatedActivityIds([...ratedActivityIds, ratingActivityObj.id]);
            setRatingActivityObj(null);
          }} 
        />
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Cargando perfil...</div>}>
      <ProfileContent />
    </React.Suspense>
  );
}
