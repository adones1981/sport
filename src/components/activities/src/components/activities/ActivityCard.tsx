import { MapPin, Calendar, Clock, Users, Star, Heart } from 'lucide-react';
import { useFavoritesStore } from '@/store/useFavoritesStore';

export const getCategoryEmoji = (category: string) => {
  const map: Record<string, string> = {
    'Fútbol': '⚽', 'Tenis': '🎾', 'Pádel': '🎾', 'Básquet': '🏀',
    'Ciclismo': '🚴', 'Running': '🏃', 'Gym': '🏋️', 'Café': '☕',
    'Comer': '🍽️', 'Cerveza': '🍺', 'Cine': '🎬', 'Paseo': '🚶'
  };
  return map[category] || '📍';
};

export function ActivityCard({ activity }: { activity: any }) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(activity.id);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700 relative">
      <div className="h-32 bg-green-100 dark:bg-green-900/30 relative flex items-center justify-center overflow-hidden">
        <span className="text-4xl absolute opacity-20">
          {getCategoryEmoji(activity.category)}
        </span>
        <div className="absolute bottom-3 left-3 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-green-700 dark:text-green-400 shadow-sm flex items-center gap-1.5">
          <span>{getCategoryEmoji(activity.category)}</span> {activity.category}
        </div>
        
        <button 
          onClick={() => toggleFavorite(activity.id)} 
          className={`absolute top-3 right-3 p-1.5 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-md transition-colors ${favorite ? 'text-red-500' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{activity.title}</h3>
          {activity.rating && (
            <span className="flex items-center gap-1 text-yellow-500 text-xs font-bold shrink-0 ml-2">
              <Star size={12} fill="currentColor" /> {activity.rating}
            </span>
          )}
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <MapPin size={16} className="text-red-400 shrink-0" />
            <span className="line-clamp-1">{activity.locationName}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <Calendar size={16} className="text-blue-400 shrink-0" />
            <span>{new Date(activity.date).toLocaleDateString()}</span>
            <Clock size={16} className="ml-2 text-orange-400 shrink-0" />
            <span>{activity.time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Users size={16} className="text-yellow-500" />
            <span>{activity.participants?.length || 0} / {activity.maxParticipants}</span>
          </div>
          <button className="text-green-600 dark:text-green-400 text-sm font-bold hover:underline">
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
}
