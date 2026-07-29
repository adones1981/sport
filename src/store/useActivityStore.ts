import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface ChatMessage {
  id: string;
  user_name: string;
  text: string;
  created_at: string;
  user_id: string;
}

interface ActivityStoreState {
  activities: any[];
  chats: Record<string, ChatMessage[]>;
  isLoading: boolean;
  setActivities: (activities: any[]) => void;
  fetchActivities: () => Promise<void>;
  updateActivity: (id: string, data: any) => void;
  addActivity: (data: any) => void;
  setChats: (activityId: string, messages: ChatMessage[]) => void;
}

export const useActivityStore = create<ActivityStoreState>((set) => ({
  activities: [],
  chats: {},
  isLoading: false,
  
  setActivities: (activities) => set({ activities }),
  
  fetchActivities: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        participants:activity_participants(user_id, user_name)
      `)
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      const formattedData = data.map(act => ({
        ...act,
        locationName: act.location_name,
        exactAddress: act.exact_address,
        organizerNote: act.organizer_note,
        maxParticipants: act.max_participants,
        creatorId: act.creator_id,
        participants: act.participants?.map((p: any) => p.user_name) || [],
        participantIds: act.participants?.map((p: any) => p.user_id) || []
      }));
      set({ activities: formattedData, isLoading: false });
    } else {
      console.error("Error fetching activities:", error);
      set({ isLoading: false });
    }
  },

  updateActivity: (id, data) => set((state) => ({
    activities: state.activities.map(act => act.id === id ? { ...act, ...data } : act)
  })),
  
  addActivity: (data) => set((state) => ({
    activities: [data, ...state.activities]
  })),
  
  setChats: (activityId, messages) => set((state) => ({
    chats: {
      ...state.chats,
      [activityId]: messages
    }
  }))
}));
