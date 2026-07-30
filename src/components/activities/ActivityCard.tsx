import { MapPin, Calendar, Clock, Users, Star, Heart, Settings, MessageCircle, UserPlus, LogOut, Info } from 'lucide-react';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { useAuthStore } from '@/store/useAuthStore';

import { getCategoryEmojiByName } from '@/lib/categories';

export const getCategoryEmoji = getCategoryEmojiByName;

export function ActivityCard({ activity, onClick }: { activity: any, onClick?: () => void }) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { user } = useAuthStore();
  const favorite = isFavorite(activity.id);

  // Determinar roles
  const isCreator = user && activity.creatorId === user.id;
  const isJoined = user && activity.participantIds?.includes(user.id);
  const isAdmin = user && activity.adminIds?.includes(user.id);
  const canEdit = isCreator || isAdmin;

  const handleAction = (e: React.MouseEvent) => {
    // Evitar que el click en botones dispare el onClick de la tarjeta
    e.stopPropagation();
    if (onClick) onClick(); // Por ahora abriremos el modal para mantener la lógica centralizada y robusta
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all border border-slate-200 dark:border-slate-700 cursor-pointer group flex flex-col h-full"
    >
      <div className="h-32 w-full bg-green-100 dark:bg-green-900/30 relative flex items-center justify-center overflow-hidden shrink-0">
        <span className="text-5xl absolute opacity-20 transform group-hover:scale-110 transition-transform">
          {getCategoryEmoji(activity.category)}
        </span>
        <div className="absolute bottom-3 left-3 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-green-700 dark:text-green-400 shadow-sm flex items-center gap-1.5 border border-slate-100 dark:border-slate-700">
          <span>{getCategoryEmoji(activity.category)}</span> {activity.category || 'Actividad'}
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); toggleFavorite(activity.id); }} 
          className={`absolute top-3 right-3 p-1.5 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md transition-colors border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 ${favorite ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{activity.title || 'Sin título'}</h3>
          {activity.rating && (
            <span className="flex items-center gap-1 text-yellow-500 text-xs font-bold shrink-0 ml-2 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full">
              <Star size={12} fill="currentColor" /> {activity.rating}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-xs mb-4 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activity.participants?.[0] || 'Organizador')}&background=random&size=32`} 
            alt="Organizador"
            className="w-6 h-6 rounded-full shadow-sm"
          />
          <span className="font-medium truncate flex-1">
            {activity.participants?.[0] ? `Organiza: ${activity.participants[0]}` : 'Organizador anónimo'}
          </span>
        </div>
        
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <MapPin size={16} className="text-red-400 shrink-0" />
            <span className="line-clamp-1">{activity.locationName || 'Por definir'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <Calendar size={16} className="text-blue-400 shrink-0" />
            <span>{activity.date ? new Date(activity.date).toLocaleDateString() : 'Sin fecha'}</span>
            <Clock size={16} className="ml-2 text-orange-400 shrink-0" />
            <span>{activity.time || 'Sin hora'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-300">
            <Users size={16} className="text-green-500" />
            <span>{activity.participantIds?.length || 0} / {activity.maxParticipants || '-'}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            {/* Quick action icons */}
            {canEdit && (
              <button onClick={handleAction} className="p-1.5 text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Editar">
                <Settings size={18} />
              </button>
            )}
            
            {isJoined && (
              <>
                <button onClick={handleAction} className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Chat">
                  <MessageCircle size={18} />
                </button>
                <button onClick={handleAction} className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Salir">
                  <LogOut size={18} />
                </button>
              </>
            )}

            {!isJoined && (
              <button onClick={handleAction} className="bg-slate-100 hover:bg-green-100 dark:bg-slate-800 dark:hover:bg-green-900/30 text-slate-600 hover:text-green-600 dark:text-slate-300 dark:hover:text-green-400 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700">
                <UserPlus size={14} /> Unirme
              </button>
            )}
            
            {/* Si ya está unido o es admin, muestra Detalles */}
            {isJoined && (
               <button onClick={handleAction} className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700 ml-1">
                 <Info size={14} /> Detalles
               </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
