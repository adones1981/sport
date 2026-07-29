import { useActivityStore } from '@/store/useActivityStore';
import { useEffect } from 'react';

export function useActivities({ category, searchQuery = '' }: { category: string, searchQuery?: string }) {
  const allActivities = useActivityStore(state => state.activities);
  const isLoading = useActivityStore(state => state.isLoading);
  const fetchActivities = useActivityStore(state => state.fetchActivities);

  useEffect(() => {
    // Solo descargar si el arreglo está vacío para no machacar la UI continuamente
    if (allActivities.length === 0) {
      fetchActivities();
    }
  }, [fetchActivities, allActivities.length]);

  let filtered = allActivities;

  if (category !== 'all') {
    filtered = filtered.filter(act => act.category === category);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(act => 
      act.locationName?.toLowerCase().includes(q) ||
      (act.exactAddress && act.exactAddress.toLowerCase().includes(q)) ||
      act.title?.toLowerCase().includes(q)
    );
  }

  return {
    activities: filtered,
    isLoading,
    error: null
  };
}
