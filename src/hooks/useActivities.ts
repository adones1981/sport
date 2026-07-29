import { useActivityStore } from '@/store/useActivityStore';

export function useActivities({ category, searchQuery = '' }: { category: string, searchQuery?: string }) {
  const allActivities = useActivityStore(state => state.activities);

  let filtered = allActivities;

  if (category !== 'all') {
    filtered = filtered.filter(act => act.category === category);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(act => 
      act.locationName.toLowerCase().includes(q) ||
      (act.exactAddress && act.exactAddress.toLowerCase().includes(q)) ||
      act.title.toLowerCase().includes(q)
    );
  }

  return {
    activities: filtered,
    isLoading: false,
    error: null
  };
}
