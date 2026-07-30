import { useActivityStore } from '@/store/useActivityStore';
import { useEffect } from 'react';
import { CATEGORY_GROUPS } from '@/lib/categories';

export function useActivities({ category, searchQuery = '', dateFilter = 'all' }: { category: string, searchQuery?: string, dateFilter?: string }) {
  const allActivities = useActivityStore(state => state.activities);
  const isLoading = useActivityStore(state => state.isLoading);
  const fetchActivities = useActivityStore(state => state.fetchActivities);

  useEffect(() => {
    // Descargar inicial
    if (allActivities.length === 0) {
      fetchActivities();
    }
    
    // Polling robusto: actualizar silenciosamente cada 10 segundos
    // por si Supabase Realtime no está activado en el servidor
    const interval = setInterval(() => {
      fetchActivities();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchActivities, allActivities.length]);

  let filtered = allActivities;

  if (category !== 'all') {
    if (category.startsWith('group:')) {
      const groupName = category.replace('group:', '');
      const group = CATEGORY_GROUPS[groupName];
      if (group) {
        const categoryNamesInGroup = group.categories.map(c => c.name);
        filtered = filtered.filter(act => categoryNamesInGroup.includes(act.category));
      }
    } else {
      filtered = filtered.filter(act => act.category === category);
    }
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(act => 
      act.locationName?.toLowerCase().includes(q) ||
      (act.exactAddress && act.exactAddress.toLowerCase().includes(q)) ||
      act.title?.toLowerCase().includes(q)
    );
  }

  if (dateFilter !== 'all') {
    const now = new Date();
    filtered = filtered.filter(act => {
      if (!act.date) return true;
      const actDate = new Date(act.date);
      if (dateFilter === 'today') {
        return actDate.toDateString() === now.toDateString();
      }
      if (dateFilter === 'weekend') {
        const day = actDate.getDay();
        // 0 = Sunday, 6 = Saturday
        // Also ensure it's this upcoming weekend or next few days, not past. But for simplicity, just check if it's Sat/Sun.
        return day === 0 || day === 6;
      }
      return true;
    });
  }

  return {
    activities: filtered,
    isLoading,
    error: null
  };
}
