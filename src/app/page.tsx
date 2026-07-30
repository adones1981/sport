'use client';

import { PlusCircle, MapPin, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ActivityFilters } from '@/components/activities/ActivityFilters';
import { ActivityCard } from '@/components/activities/ActivityCard';
import { EmptyState } from '@/components/activities/EmptyState';
import { SearchHero } from '@/components/layout/SearchHero';
import { useActivities } from '@/hooks/useActivities';
import { ActivityDetailModal } from '@/components/activities/ActivityDetailModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useActivityStore } from '@/store/useActivityStore';

const MapView = dynamic(() => import('@/components/map/MapView').then(mod => mod.MapView), { ssr: false, loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl" /> });
const CreateActivityModal = dynamic(() => import('@/components/activities/CreateActivityModal').then(mod => mod.CreateActivityModal), { ssr: false });

export default function Home() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('map');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchedLocation, setSearchedLocation] = useState<any>(null);
  const [showSearchPrompt, setShowSearchPrompt] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createInitialData, setCreateInitialData] = useState<any>(null);
  
  const { user, pendingActivityId, setPendingActivityId, initializeSupabaseAuth, isAuthLoading } = useAuthStore();
  const { activities, isLoading, error } = useActivities({ category: activeCategory, searchQuery, dateFilter });

  // Initialize Supabase Auth and Realtime listeners
  useEffect(() => {
    initializeSupabaseAuth();
    useActivityStore.getState().setupRealtime();
  }, [initializeSupabaseAuth]);

  // Silently check for geolocation on load and center map if already granted
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setSearchedLocation({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                display_name: "Tu Ubicación Actual",
                isUserLocation: true
              });
            },
            () => {}
          );
        }
      });
    }
  }, []);

  // Post-login redirect flow
  useEffect(() => {
    // Priority 1: Pending activity after login
    if (user && pendingActivityId) {
      const act = useActivityStore.getState().activities.find(a => a.id === pendingActivityId);
      if (act) {
        setSelectedActivity(act);
      }
      setPendingActivityId(null);
    }
  }, [user, pendingActivityId, setPendingActivityId]);

  // URL share checking
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const sharedId = searchParams.get('activity');
    
    if (sharedId) {
      const checkAndSetActivity = (acts: any[]) => {
        const act = acts.find(a => a.id.toString() === sharedId);
        if (act) {
          setSelectedActivity(act);
          window.history.replaceState({}, '', window.location.pathname);
          return true;
        }
        return false;
      };

      // Try checking immediately
      const initialActs = useActivityStore.getState().activities;
      if (!checkAndSetActivity(initialActs)) {
        // If not found yet (still loading), subscribe to the store and wait for it
        const unsubscribe = useActivityStore.subscribe((state) => {
          if (checkAndSetActivity(state.activities)) {
            unsubscribe(); // Unsubscribe once we find and set it
          }
        });
        return () => unsubscribe();
      }
    }
  }, []); // Run only once on mount

  const handleCreateOpen = (initialLoc?: any) => {
    if (!user) {
      useAuthStore.getState().setIsLoginModalOpen(true);
    } else if (user.type === 'guest') {
      const { guestCreatedCount } = useAuthStore.getState();
      if (guestCreatedCount >= 3) {
        alert('Has alcanzado el límite de 3 actividades creadas como invitado. ¡Regístrate gratis para crear actividades ilimitadas!');
        return;
      }
      setCreateInitialData(initialLoc ? { 
        locationName: initialLoc.display_name?.split(',')[0] || 'Mi ubicación',
        exactAddress: initialLoc.display_name || '',
        lat: initialLoc.lat,
        lon: initialLoc.lon 
      } : null);
      setIsCreateOpen(true);
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
          setShowSearchPrompt(true);
        },
        () => alert('No pudimos acceder a tu ubicación. Asegúrate de dar los permisos.')
      );
    } else {
      alert('Tu navegador no soporta geolocalización.');
    }
  };

  return (
    <main className="h-[100dvh] max-h-[100dvh] bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden">
      {/* Auth loading veil — prevents flash of logged-out or empty state */}
      {isAuthLoading && (
        <div className="fixed inset-0 bg-white dark:bg-slate-950 flex items-center justify-center z-[99999]">
          <div className="flex flex-col items-center gap-4">
            <span className="text-5xl animate-bounce">⚽</span>
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm animate-pulse">Cargando SportSquad...</p>
          </div>
        </div>
      )}
      <div className="bg-slate-900 z-40 shadow-xl shrink-0">
        <SearchHero onLocationSelect={(loc) => { 
          if (loc.isActivity) {
            setSelectedActivity(loc.activity);
          } else {
            setSearchedLocation(loc); 
            setShowSearchPrompt(true); 
          }
        }} />
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-3 flex-1 flex flex-col overflow-hidden max-w-7xl">
        <ActivityFilters 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
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
               {activities.length === 0 && !isLoading && !searchedLocation && (
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-6 py-4 rounded-xl shadow-xl z-[400] text-sm border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center gap-3 w-11/12 max-w-sm">
                   <div>
                     <span className="font-bold">No hay actividades aquí.</span><br/>
                     <span className="text-slate-500">¡Sé el primero en crear una!</span>
                   </div>
                   <button onClick={() => handleCreateOpen()} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold w-full transition-colors shadow-sm">
                     Crear Actividad
                   </button>
                 </div>
               )}
               {showSearchPrompt && searchedLocation && (
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-6 py-4 rounded-xl shadow-xl z-[400] text-sm border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center gap-3 w-11/12 max-w-sm animate-in slide-in-from-top-4">
                   <button onClick={() => setShowSearchPrompt(false)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"><XCircle size={20}/></button>
                   <div className="mt-1">
                     <span className="font-bold text-base block mb-1">{searchedLocation.isUserLocation ? 'Tu Ubicación' : 'Ubicación Encontrada'}</span>
                     <span className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2">{searchedLocation.display_name}</span>
                   </div>
                   <button onClick={() => { setShowSearchPrompt(false); handleCreateOpen(searchedLocation); }} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-bold w-full transition-colors shadow-sm flex items-center justify-center gap-2">
                     <PlusCircle size={18} /> Crear Actividad Aquí
                   </button>
                 </div>
               )}
                <div className="absolute bottom-6 right-4 sm:right-6 flex flex-col gap-3 z-[1000] drop-shadow-2xl">
                  <button 
                    onClick={handleCercaDeMi}
                    className="bg-white text-slate-900 border-2 border-green-500 p-3 sm:px-5 sm:py-3 rounded-full font-bold shadow-xl hover:bg-slate-50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                  <MapPin size={24} /> <span className="hidden sm:inline">Cerca de mí</span>
                </button>
                <button 
                  onClick={() => handleCreateOpen()} 
                  className="bg-green-600 text-white p-3 sm:px-5 sm:py-3 rounded-full font-bold shadow-xl shadow-green-500/20 hover:bg-green-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle size={24} /> <span className="hidden sm:inline">Crear Actividad</span>
                </button>
              </div>
            </div>
          ) : activities.length === 0 && !isLoading ? (
            <div className="flex-1 flex flex-col overflow-y-auto">
               <EmptyState onCreate={() => handleCreateOpen()} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 content-start">
              {activities.slice().sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`).getTime();
                const dateB = new Date(`${b.date}T${b.time}`).getTime();
                if (isNaN(dateA)) return 1;
                if (isNaN(dateB)) return -1;
                return dateA - dateB;
              }).map(activity => (
                <ActivityCard key={activity.id} activity={activity} onClick={() => setSelectedActivity(activity)} />
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
