'use client';

import { PlusCircle, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ActivityFilters } from '@/components/activities/ActivityFilters';
import { ActivityCard } from '@/components/activities/ActivityCard';
import { EmptyState } from '@/components/activities/EmptyState';
import { SearchHero } from '@/components/layout/SearchHero';
import { useActivities } from '@/hooks/useActivities';
import { ActivityDetailModal } from '@/components/activities/ActivityDetailModal';
import { CreateActivityModal } from '@/components/activities/CreateActivityModal';
import { useAuthStore } from '@/store/useAuthStore';

const MapView = dynamic(() => import('@/components/map/MapView').then(mod => mod.MapView), { ssr: false, loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl" /> });

export default function Home() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchedLocation, setSearchedLocation] = useState<any>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createInitialData, setCreateInitialData] = useState<any>(null);
  
  const { user, pendingActivityId, setPendingActivityId, initializeSupabaseAuth } = useAuthStore();
  const { activities, isLoading, error } = useActivities({ category: activeCategory, searchQuery });

  // Initialize Supabase Auth listener
  useEffect(() => {
    initializeSupabaseAuth();
  }, [initializeSupabaseAuth]);

  // Post-login redirect flow
  useEffect(() => {
    if (user && pendingActivityId) {
      const act = activities.find(a => a.id === pendingActivityId);
      if (act) {
        setSelectedActivity(act);
      }
      setPendingActivityId(null);
    }
  }, [user, pendingActivityId, activities, setPendingActivityId]);

  const handleCreateOpen = (initialLoc?: any) => {
    if (!user) {
      useAuthStore.getState().setIsLoginModalOpen(true);
    } else if (user.type === 'guest') {
      alert('¡Los invitados no pueden crear actividades! Registrate con tu correo para poder hacerlo.');
    } else {
      setCreateInitialData(initialLoc ? { 
        locationName: initialLoc.display_name?.split(',')[0] || 'Mi ubicación',
        exactAddress: initialLoc.display_name || '',
        lat: initialLoc.lat,
        lon: initialLoc.lon 
      } : null);
      setIsCreateOpen(true);
    }
  };

  const handleCercaDeMi = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchedLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            display_name: "Tu Ubicación Actual",
            isUserLocation: true
          });
        },
        () => alert('No pudimos acceder a tu ubicación. Asegúrate de dar los permisos.')
      );
    } else {
      alert('Tu navegador no soporta geolocalización.');
    }
  };

  return (
    <main className="h-[100dvh] max-h-[100dvh] bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden">
      <div className="bg-slate-900 z-40 shadow-xl shrink-0">
        <SearchHero onLocationSelect={setSearchedLocation} />
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-3 flex-1 flex flex-col overflow-hidden max-w-7xl">
        <ActivityFilters 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="mt-3 flex-1 relative flex flex-col overflow-hidden rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800">
          {isLoading ? (
            <div className="flex items-center justify-center h-full flex-1">
              <span className="text-slate-500 animate-pulse">Cargando actividades...</span>
            </div>
          ) : viewMode === 'map' ? (
            <div className="flex-1 relative flex flex-col overflow-hidden bg-white w-full h-full">
               <MapView 
                 activities={activities} 
                 onActivityClick={setSelectedActivity} 
                 selectedActivityId={selectedActivity?.id} 
                 searchedLocation={searchedLocation}
                 onCreateAtLocation={(loc) => handleCreateOpen(loc)}
               />
               {activities.length === 0 && !searchedLocation && (
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-6 py-3 rounded-xl shadow-xl z-[400] font-bold text-sm border border-slate-200 dark:border-slate-700 pointer-events-none text-center">
                   No hay actividades aquí.<br/><span className="font-normal text-slate-500">¡Sé el primero en crear una!</span>
                 </div>
               )}
              <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-[400]">
                <button 
                  onClick={handleCercaDeMi}
                  className="bg-slate-800 text-white px-5 py-3 rounded-full font-bold shadow-xl hover:bg-slate-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <MapPin size={20} /> <span className="hidden sm:inline">Cerca de mí</span>
                </button>
                <button 
                  onClick={() => handleCreateOpen()} 
                  className="bg-green-600 text-white px-5 py-3 rounded-full font-bold shadow-xl shadow-green-500/20 hover:bg-green-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle size={20} /> <span className="hidden sm:inline">Crear Actividad</span>
                </button>
              </div>
            </div>
          ) : activities.length === 0 ? (
            <div className="flex-1 flex flex-col overflow-y-auto">
               <EmptyState />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 content-start">
              {activities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedActivity && <ActivityDetailModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />}
      {isCreateOpen && <CreateActivityModal initialData={createInitialData} onClose={() => { setIsCreateOpen(false); setSearchedLocation(null); }} />}
    </main>
  );
}
