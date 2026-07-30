import { X, MessageSquare, Edit2, Loader2, Check, Star, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';

export function PublicProfileModal({ 
  creatorId, 
  creatorName, 
  onClose,
  onMessage
}: { 
  creatorId: string;
  creatorName: string;
  onClose: () => void;
  onMessage?: () => void;
}) {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit State
  const [description, setDescription] = useState('');
  const [sports, setSports] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [adminRating, setAdminRating] = useState<number | null>(null);
  const [adminActivities, setAdminActivities] = useState<any[]>([]);

  const fetchProfile = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('profiles').select('*').eq('id', creatorId).single();
    if (data) {
      setProfile(data);
      setDescription(data.description || '');
      setSports(data.favorite_sports ? data.favorite_sports.join(', ') : '');
    }

    // Fetch activities created by this user
    const { data: acts } = await supabase.from('activities').select('*').eq('creator_id', creatorId);
    if (acts) {
      setAdminActivities(acts);
      // Fetch ratings for these activities to calculate admin rating
      const actIds = acts.map((a: any) => a.id);
      if (actIds.length > 0) {
        const { data: ratings } = await supabase.from('activity_ratings').select('rating_organizer').in('activity_id', actIds);
        if (ratings && ratings.length > 0) {
          const sum = ratings.reduce((acc: number, r: any) => acc + (r.rating_organizer || 0), 0);
          setAdminRating(sum / ratings.length);
        }
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [creatorId]);

  const handleSave = async () => {
    setIsSaving(true);
    const sportsArray = sports.split(',').map(s => s.trim()).filter(Boolean);
    const payload = {
      id: creatorId,
      name: creatorName,
      description,
      favorite_sports: sportsArray
    };
    
    // Upsert since it might be the first time editing
    await supabase.from('profiles').upsert(payload);
    
    setProfile(payload);
    setIsEditing(false);
    setIsSaving(false);
  };

  const isOwner = user?.id === creatorId;
  const avatarUrl = profile?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}&background=random&size=150`;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-colors z-10 backdrop-blur-md"
          >
            <X size={20} />
          </button>

          {/* Header Background */}
          <div className="h-32 bg-gradient-to-br from-green-500 to-blue-600 relative">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 rounded-full p-1 bg-white dark:bg-slate-900">
              <img 
                src={avatarUrl} 
                alt={creatorName} 
                className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 object-cover shadow-lg"
              />
            </div>
          </div>

          <div className="pt-16 pb-6 px-6 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
              {creatorName}
              {isOwner && !isEditing && (
                <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-green-500 transition-colors">
                  <Edit2 size={16} />
                </button>
              )}
            </h2>
            
            <div className="mt-6 text-left">
              {isLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-green-500" /></div>
              ) : isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sobre Mí</label>
                    <textarea 
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 resize-none h-24"
                      placeholder="Escribe algo sobre ti..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Deportes Favoritos (separados por coma)</label>
                    <input 
                      type="text"
                      value={sports}
                      onChange={e => setSports(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500"
                      placeholder="Fútbol, Pádel, Trekking"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg font-bold text-slate-700 dark:text-slate-300">Cancelar</button>
                    <button onClick={handleSave} disabled={isSaving} className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold flex items-center justify-center gap-2">
                      {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sobre Mí</h3>
                    <p className="text-slate-700 dark:text-slate-300 text-sm italic">
                      {profile?.description || "No hay descripción todavía."}
                    </p>
                  </div>
                  
                  {profile?.favorite_sports && profile.favorite_sports.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Deportes Favoritos</h3>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {profile.favorite_sports.map((sport: string) => (
                          <span key={sport} className="text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-3 py-1 rounded-full border border-green-200 dark:border-green-800/50">
                            {sport}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {adminRating !== null && (
                    <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-xl">
                      <h3 className="text-xs font-bold text-yellow-800 dark:text-yellow-500 uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
                        <Star size={14} fill="currentColor" /> Calificación como Organizador
                      </h3>
                      <div className="flex justify-center items-center gap-2">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{adminRating.toFixed(1)}</span>
                        <div className="flex text-yellow-400">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} size={20} fill={adminRating >= star ? "currentColor" : adminRating >= star - 0.5 ? "currentColor" : "none"} className={adminRating >= star - 0.5 && adminRating < star ? "opacity-50" : ""} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {adminActivities.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Otras Actividades Organizadas ({adminActivities.length})</h3>
                      <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2">
                        {adminActivities.map(act => (
                          <div key={act.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg text-sm">
                            <div className="truncate flex-1 font-medium text-slate-700 dark:text-slate-300">
                              {act.title}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500 shrink-0 ml-2">
                              <Calendar size={12} /> {act.date}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {!isOwner && onMessage && (
                    <button 
                      onClick={onMessage}
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-colors"
                    >
                      <MessageSquare size={18} /> Enviar Mensaje Directo
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
