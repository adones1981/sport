import { X, Star, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';

export function RatingModal({ activity, onClose, onSaved }: { activity: any, onClose: () => void, onSaved: () => void }) {
  const { user } = useAuthStore();
  const [ratingActivity, setRatingActivity] = useState<number>(0);
  const [ratingPlace, setRatingPlace] = useState<number>(0);
  const [ratingOrganizer, setRatingOrganizer] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (ratingActivity === 0 || ratingPlace === 0 || ratingOrganizer === 0) {
      alert('Por favor, asigna al menos 1 estrella a cada categoría.');
      return;
    }

    if (!user) {
      alert('Debes iniciar sesión para calificar.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('activity_ratings').insert([{
      activity_id: activity.id,
      user_id: user.id,
      user_name: user.name,
      rating_activity: ratingActivity,
      rating_place: ratingPlace,
      rating_organizer: ratingOrganizer,
      comment: comment
    }]);

    setIsSubmitting(false);

    if (error) {
      console.error(error);
      if (error.code === '23505') {
        alert('Ya has enviado una calificación para esta actividad.');
      } else {
        alert(`Hubo un error al guardar tu calificación. Detalle: ${error.message}`);
      }
    } else {
      onSaved();
    }
  };

  const StarSelector = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => (
    <div className="mb-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <span className="font-bold text-slate-700 dark:text-slate-300">{label}</span>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(star => (
          <button 
            key={star} 
            onClick={() => onChange(star)} 
            className={`transition-transform hover:scale-110 ${value >= star ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
          >
            <Star size={28} fill={value >= star ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-yellow-50 dark:bg-yellow-900/20">
          <div>
            <h2 className="font-bold text-lg text-yellow-800 dark:text-yellow-500 flex items-center gap-2">
              <Star size={20} fill="currentColor" /> Calificar Evento
            </h2>
            <p className="text-xs text-yellow-600 dark:text-yellow-400/70 font-medium truncate max-w-[250px]">{activity.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-white/50 dark:bg-slate-800 p-2 rounded-full"><X size={20} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 text-center">
            ¡Tu opinión es muy valiosa! Ayuda a otros deportistas contando tu experiencia en esta actividad.
          </p>
          
          <StarSelector label="¿Qué tal estuvo la Actividad?" value={ratingActivity} onChange={setRatingActivity} />
          <StarSelector label="¿Cómo estuvo el Lugar/Cancha?" value={ratingPlace} onChange={setRatingPlace} />
          <StarSelector label="¿Qué nota le pones al Organizador?" value={ratingOrganizer} onChange={setRatingOrganizer} />
          
          <div className="mt-6">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">Comentario (Opcional)</label>
            <textarea 
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Ej: La cancha estaba excelente, pero empezamos 15 min tarde..."
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none min-h-[100px]"
            ></textarea>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <button 
            onClick={handleSave} 
            disabled={isSubmitting} 
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            Enviar Calificación
          </button>
        </div>
      </div>
    </div>
  );
}
