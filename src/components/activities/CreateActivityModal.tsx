import { X, Search, MapPin, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useActivityStore } from '@/store/useActivityStore';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/lib/supabase';
import { CATEGORY_GROUPS } from '@/lib/categories';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export function CreateActivityModal({ onClose, initialData }: { onClose: () => void, initialData?: any }) {
  const { updateActivity, addActivity } = useActivityStore();
  const { user } = useAuthStore();
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerInstanceRef = useRef<L.Marker | null>(null);
  
  
  // Set initial state based on initialData
  const [selectedPlace, setSelectedPlace] = useState<any>(
    initialData ? { 
      display_name: initialData.exactAddress || initialData.locationName,
      lat: initialData.lat,
      lon: initialData.lng || initialData.lon
    } : null
  );
  
  useEffect(() => {
    if (!initialData && navigator.geolocation && !selectedPlace) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const newLoc = {
          display_name: 'Tu Ubicación Actual',
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        };
        setSelectedPlace(newLoc);
      }, () => {});
    }
  }, [initialData]);

  // Inicializar Mapa
  useEffect(() => {
    if (typeof window !== 'undefined' && mapContainerRef.current && !mapInstanceRef.current) {
      const defaultLat = selectedPlace ? parseFloat(selectedPlace.lat) : -33.4489;
      const defaultLon = selectedPlace ? parseFloat(selectedPlace.lon) : -70.6693;
      
      mapInstanceRef.current = L.map(mapContainerRef.current, { zoomControl: false }).setView([defaultLat, defaultLon], 15);
      L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapInstanceRef.current);
      
      const icon = L.divIcon({
        html: `<div style="font-size: 28px; transform: translate(-14px, -28px); text-shadow: 0 2px 4px rgba(0,0,0,0.4);">📍</div>`,
        className: 'custom-pin'
      });

      markerInstanceRef.current = L.marker([defaultLat, defaultLon], { draggable: true, icon }).addTo(mapInstanceRef.current);
      
      markerInstanceRef.current.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        setSelectedPlace((prev: any) => ({
          ...prev,
          lat: pos.lat,
          lon: pos.lng,
          display_name: prev?.display_name || 'Ubicación seleccionada en el mapa'
        }));
      });
      
      mapInstanceRef.current.on('click', (e) => {
        const pos = e.latlng;
        markerInstanceRef.current?.setLatLng(pos);
        setSelectedPlace((prev: any) => ({
          ...prev,
          lat: pos.lat,
          lon: pos.lng,
          display_name: prev?.display_name || 'Ubicación seleccionada en el mapa'
        }));
      });
    }
  }, []);

  // Volar al punto cuando selectedPlace cambia
  useEffect(() => {
    if (mapInstanceRef.current && markerInstanceRef.current && selectedPlace) {
      const lat = parseFloat(selectedPlace.lat);
      const lon = parseFloat(selectedPlace.lon);
      if (!isNaN(lat) && !isNaN(lon)) {
        mapInstanceRef.current.flyTo([lat, lon], 16);
        markerInstanceRef.current.setLatLng([lat, lon]);
      }
    }
  }, [selectedPlace?.lat, selectedPlace?.lon]);

  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || 'Fútbol');
  const [date, setDate] = useState(initialData?.date || '');
  const [time, setTime] = useState(initialData?.time || '');
  const [organizerNote, setOrganizerNote] = useState(initialData?.organizerNote || '');
  const [isBenefit, setIsBenefit] = useState(initialData?.is_benefit || false);
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
    try {
      const data = {
        title,
        category,
        date,
        time,
        location_name: selectedPlace?.display_name?.split(',')[0] || 'Por definir',
        exact_address: selectedPlace?.display_name || '',
        organizer_note: organizerNote,
        lat: selectedPlace ? parseFloat(selectedPlace.lat) : -33.4489,
        lng: selectedPlace ? parseFloat(selectedPlace.lon) : -70.6693,
        max_participants: 10,
        creator_id: user?.id,
        rating: 5.0,
        is_benefit: category === 'Completada' ? isBenefit : false
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
          updateActivity(initialData.id, {
            ...data,
            locationName: data.location_name,
            exactAddress: data.exact_address,
            organizerNote: data.organizer_note,
            maxParticipants: data.max_participants,
            creatorId: data.creator_id
          });
          alert('¡Cambios guardados con éxito!');
          onClose();
        }
      } else {
        const { data: newActivity, error } = await supabase
          .from('activities')
          .insert([data])
          .select()
          .single();
          
        if (error) {
          console.error('Error creating activity:', error);
          alert(`Hubo un error al crear la actividad: ${error.message}`);
        } else {
          if (user) {
             await supabase.from('activity_participants').insert([{
               activity_id: newActivity.id,
               user_id: user.id,
               user_name: user.name
             }]);
          }

          if (data.is_benefit) {
             const defaultItems = ['Tomate', 'Palta', 'Ketchup', 'Mayonesa', 'Pan de completo', 'Vienesas', 'Servilletas'].map(item => ({
               activity_id: newActivity.id,
               item_name: item,
             }));
             await supabase.from('activity_items').insert(defaultItems);
          }

          addActivity({
            ...newActivity,
            locationName: newActivity.location_name,
            exactAddress: newActivity.exact_address,
            organizerNote: newActivity.organizer_note,
            maxParticipants: newActivity.max_participants,
            creatorId: newActivity.creator_id,
            participants: [user?.name || 'Organizador'],
            participantIds: [user?.id],
            isBenefit: newActivity.is_benefit
          });
          
          if (user?.type === 'guest') {
            useAuthStore.getState().incrementGuestCreated();
          }
          onClose();
        }
      }
    } catch (e: any) {
      console.error("Excepción en handleSave:", e);
      alert(`Ocurrió un error inesperado: ${e.message || 'Inténtalo de nuevo.'}`);
    } finally {
      setIsSubmitting(false);
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
             <div className="space-y-4">
               {Object.values(CATEGORY_GROUPS).map(group => (
                 <div key={group.name}>
                   <p className="text-xs font-bold text-slate-500 mb-2 uppercase flex items-center gap-1"><span>{group.emoji}</span> {group.name}</p>
                   <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                     {group.categories.map(cat => (
                       <button
                         key={cat.name}
                         type="button"
                         onClick={() => setCategory(cat.name)}
                         className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${category === cat.name ? 'bg-green-100 border-green-500 shadow-sm dark:bg-green-900/40 dark:border-green-500 scale-105' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                       >
                         <span className="text-xl mb-1">{cat.emoji}</span>
                         <span className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 text-center">{cat.name}</span>
                       </button>
                     ))}
                   </div>
                 </div>
               ))}
             </div>
             
             {category === 'Completada' && (
               <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 rounded-xl flex items-center justify-between">
                 <div>
                   <p className="text-sm font-bold text-orange-800 dark:text-orange-400">Es a beneficio / Activar Aportes</p>
                   <p className="text-xs text-orange-600 dark:text-orange-500">Permite que los participantes se anoten para llevar ingredientes.</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input type="checkbox" checked={isBenefit} onChange={e => setIsBenefit(e.target.checked)} className="sr-only peer" />
                   <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                 </label>
               </div>
             )}
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
               </div>
             )}
             
             <div className="mt-2 text-xs text-slate-500 font-medium mb-1 flex items-center justify-between">
               <span>Punto exacto del evento:</span>
               <span className="text-green-600">Puedes arrastrar el pin 📍</span>
             </div>
             <div 
               ref={mapContainerRef} 
               className="w-full h-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 z-0 relative overflow-hidden"
             />
           </div>
           
           <div className="grid grid-cols-2 gap-4 mb-2">
             <div>
               <label className="block text-sm font-medium mb-1">Fecha</label>
               <input 
                 type="date" 
                 value={date} 
                 min={new Date().toISOString().split('T')[0]}
                 onChange={e => setDate(e.target.value)} 
                 className="w-full border p-3 rounded-lg dark:bg-slate-800 dark:border-slate-700 bg-transparent text-sm" 
               />
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
