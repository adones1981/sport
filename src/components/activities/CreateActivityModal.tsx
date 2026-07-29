import { X, Search, MapPin, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useActivityStore } from '@/store/useActivityStore';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';

export function CreateActivityModal({ onClose, initialData }: { onClose: () => void, initialData?: any }) {
  const { updateActivity, addActivity } = useActivityStore();
  const { user } = useAuthStore();
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Set initial state based on initialData
  const [selectedPlace, setSelectedPlace] = useState<any>(
    initialData ? { 
      display_name: initialData.exactAddress || initialData.locationName,
      lat: initialData.lat,
      lon: initialData.lon
    } : null
  );
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || 'Fútbol');
  const [date, setDate] = useState(initialData?.date || '');
  const [time, setTime] = useState(initialData?.time || '');
  const [organizerNote, setOrganizerNote] = useState(initialData?.organizerNote || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchPlaces = async () => {
    if(!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=cl`);
      const data = await res.json();
      setPlaces(data);
    } catch(e) {
      console.error(e);
    }
    setIsSearching(false);
  };

  const handleSave = async () => {
    if (!title || !date || !time) {
      alert('Por favor completa el título, fecha y hora.');
      return;
    }
    
    setIsSubmitting(true);
    const data = {
      title,
      category,
      date,
      time,
      location_name: selectedPlace?.display_name?.split(',')[0] || 'Por definir',
      exact_address: selectedPlace?.display_name || '',
      organizer_note: organizerNote,
      lat: selectedPlace ? parseFloat(selectedPlace.lat) : -33.4489 + (Math.random() - 0.5) * 0.01,
      lng: selectedPlace ? parseFloat(selectedPlace.lon) : -70.6693 + (Math.random() - 0.5) * 0.01,
      max_participants: 10,
      creator_id: user?.id,
      rating: 5.0
    };
    
    if (initialData && initialData.id) {
      const { data: updatedDbData, error } = await supabase
        .from('activities')
        .update(data)
        .eq('id', initialData.id)
        .select();
        
      if (error) {
        console.error('Error updating activity:', error);
        alert(`Error al guardar en la nube: ${error.message}`);
      } else {
        // Formatear para el store local (camelCase)
        updateActivity(initialData.id, {
          ...data,
          locationName: data.location_name,
          exactAddress: data.exact_address,
          organizerNote: data.organizer_note,
          maxParticipants: data.max_participants,
          creatorId: data.creator_id
        });
        alert('¡Cambios guardados con éxito!');
      }
      setIsSubmitting(false);
      onClose();
    } else {
      const { data: newActivity, error } = await supabase
        .from('activities')
        .insert([data])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating activity:', error);
        alert('Hubo un error al crear la actividad.');
      } else {
        // Al crearla, el creador también debería unirse como participante automáticamente
        if (user) {
           await supabase.from('activity_participants').insert([{
             activity_id: newActivity.id,
             user_id: user.id,
             user_name: user.name
           }]);
        }
        // Agregamos al store para verlo sin recargar
        addActivity({
          ...newActivity,
          locationName: newActivity.location_name,
          exactAddress: newActivity.exact_address,
          organizerNote: newActivity.organizer_note,
          maxParticipants: newActivity.max_participants,
          creatorId: newActivity.creator_id,
          participants: [user?.name || 'Organizador'],
          participantIds: [user?.id]
        });
      }
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">
            {initialData ? 'Editar Actividad' : 'Crear Nueva Actividad'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 text-slate-900 dark:text-white">
           <div className="mb-4">
             <label className="block text-sm font-medium mb-1">Título de la actividad</label>
             <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ej. Fútbol 7, Café de tarde..." className="w-full border p-3 rounded-lg dark:bg-slate-800 dark:border-slate-700 bg-transparent" />
           </div>

           <div className="mb-4">
             <label className="block text-sm font-medium mb-2">Categoría</label>
             <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
               {[
                 { name: 'Fútbol', emoji: '⚽' },
                 { name: 'Tenis', emoji: '🎾' },
                 { name: 'Pádel', emoji: '🎾' },
                 { name: 'Básquet', emoji: '🏀' },
                 { name: 'Ciclismo', emoji: '🚴' },
                 { name: 'Running', emoji: '🏃' },
                 { name: 'Gym', emoji: '🏋️' },
                 { name: 'Café', emoji: '☕' },
                 { name: 'Comer', emoji: '🍽️' },
                 { name: 'Cerveza', emoji: '🍺' },
                 { name: 'Cine', emoji: '🎬' },
                 { name: 'Paseo', emoji: '🚶' }
               ].map(cat => (
                 <button
                   key={cat.name}
                   type="button"
                   onClick={() => setCategory(cat.name)}
                   className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${category === cat.name ? 'bg-green-100 border-green-500 shadow-sm dark:bg-green-900/40 dark:border-green-500 scale-105' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                 >
                   <span className="text-xl mb-1">{cat.emoji}</span>
                   <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">{cat.name}</span>
                 </button>
               ))}
             </div>
           </div>

           <div className="mb-4 relative">
             <label className="block text-sm font-medium mb-1">Ubicación</label>
             <div className="flex gap-2 mb-2">
               <input 
                 type="text" 
                 value={query}
                 onChange={e => setQuery(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && searchPlaces()}
                 placeholder="Buscar lugar (ej. Parque Araucano)..." 
                 className="flex-1 border p-3 rounded-lg dark:bg-slate-800 dark:border-slate-700 bg-transparent"
               />
               <button onClick={searchPlaces} className="bg-slate-900 dark:bg-slate-700 text-white p-3 rounded-lg hover:bg-slate-800 transition-colors">
                 <Search size={20} />
               </button>
             </div>
             
             {places.length > 0 && (
               <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                 {places.map(place => (
                   <button 
                     key={place.place_id} 
                     onClick={() => { setSelectedPlace(place); setPlaces([]); setQuery(''); }}
                     className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-700 border-b last:border-0 dark:border-slate-700 text-sm flex items-start gap-2"
                   >
                     <MapPin size={16} className="text-red-500 mt-1 shrink-0"/>
                     <span>{place.display_name}</span>
                   </button>
                 ))}
               </div>
             )}
             
             {selectedPlace && (
               <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg flex justify-between items-center mt-2">
                 <p className="text-sm font-medium text-green-800 dark:text-green-400 line-clamp-1 flex-1 pr-4">{selectedPlace.display_name}</p>
                 <button onClick={() => setSelectedPlace(null)} className="text-green-600 dark:text-green-400"><X size={16} /></button>
               </div>
             )}
           </div>
           
           <div className="grid grid-cols-2 gap-4 mb-2">
             <div>
               <label className="block text-sm font-medium mb-1">Fecha</label>
               <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border p-3 rounded-lg dark:bg-slate-800 dark:border-slate-700 bg-transparent text-sm" />
             </div>
             <div>
               <label className="block text-sm font-medium mb-1">Hora</label>
               <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full border p-3 rounded-lg dark:bg-slate-800 dark:border-slate-700 bg-transparent text-sm" />
             </div>
           </div>

           <div className="mt-4">
             <label className="block text-sm font-medium mb-1">Comentarios / Notas para los jugadores</label>
             <textarea 
               value={organizerNote} 
               onChange={e => setOrganizerNote(e.target.value)} 
               placeholder="Ej: Hay que llevar cuota de $3.000, nos juntamos en la entrada sur..." 
               rows={3} 
               className="w-full border p-3 rounded-lg dark:bg-slate-800 dark:border-slate-700 bg-transparent text-sm resize-none"
             ></textarea>
           </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
           <button onClick={handleSave} disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2">
             {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : null}
             {initialData ? 'Guardar Cambios' : 'Publicar Actividad en el Mapa'}
           </button>
        </div>
      </div>
    </div>
  );
}
