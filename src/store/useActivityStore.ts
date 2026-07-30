import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface ChatMessage {
  id: string;
  user_name: string;
  text: string;
  created_at: string;
  user_id: string;
}

export interface ActivityItem {
  id: string;
  activity_id: string;
  item_name: string;
  created_at: string;
  contributions: ItemContribution[];
}

export interface ItemContribution {
  id: string;
  item_id: string;
  user_id: string;
  user_name: string;
}

interface ActivityStoreState {
  activities: any[];
  chats: Record<string, ChatMessage[]>;
  activityItems: Record<string, ActivityItem[]>;
  isLoading: boolean;
  isRealtimeSetup: boolean;
  setActivities: (activities: any[]) => void;
  setupRealtime: () => void;
  fetchActivities: () => Promise<void>;
  fetchActivityItems: (activityId: string) => Promise<void>;
  addActivityItem: (activityId: string, itemName: string) => Promise<void>;
  removeActivityItem: (itemId: string, activityId: string) => Promise<void>;
  addContribution: (itemId: string, activityId: string, userId: string, userName: string) => Promise<void>;
  removeContribution: (itemId: string, activityId: string, userId: string) => Promise<void>;
  updateActivity: (id: string, data: any) => void;
  addActivity: (data: any) => void;
  setChats: (activityId: string, messages: ChatMessage[]) => void;
}

export const useActivityStore = create<ActivityStoreState>((set, get) => ({
  activities: [],
  chats: {},
  activityItems: {},
  isLoading: true,
  isRealtimeSetup: false,
  
  setActivities: (activities) => set({ activities }),
  
  setupRealtime: () => {
    if (get().isRealtimeSetup) return;
    
    set({ isRealtimeSetup: true });
    
    const channel = supabase.channel('global-activities')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activities' }, () => {
        get().fetchActivities();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'activity_participants' }, () => {
        get().fetchActivities();
      })
      .subscribe();
  },

  fetchActivities: async () => {
    if (get().activities.length === 0) {
      set({ isLoading: true });
    }
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        participants:activity_participants(user_id, user_name, attendance_status, check_in_photo, admin_rating)
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
        isBenefit: act.is_benefit,
        participants: act.participants?.map((p: any) => p.user_name) || [],
        participantIds: act.participants?.map((p: any) => p.user_id) || [],
        participantData: act.participants || [],
        pendingTransferId: act.pending_transfer_id
      }));
      set({ activities: formattedData, isLoading: false });
    } else {
      console.error("Error fetching activities:", error);
      set({ isLoading: false });
    }
  },

  fetchActivityItems: async (activityId: string) => {
    const { data, error } = await supabase
      .from('activity_items')
      .select(`*, contributions:item_contributions(*)`)
      .eq('activity_id', activityId)
      .order('created_at', { ascending: true });
    
    if (!error && data) {
      set(state => ({
        activityItems: { ...state.activityItems, [activityId]: data as ActivityItem[] }
      }));
    }
  },

  addActivityItem: async (activityId: string, itemName: string) => {
    const { data, error } = await supabase
      .from('activity_items')
      .insert([{ activity_id: activityId, item_name: itemName }])
      .select(`*, contributions:item_contributions(*)`)
      .single();
    
    if (!error && data) {
      set(state => ({
        activityItems: {
          ...state.activityItems,
          [activityId]: [...(state.activityItems[activityId] || []), data as ActivityItem]
        }
      }));
    }
  },

  removeActivityItem: async (itemId: string, activityId: string) => {
    await supabase.from('activity_items').delete().eq('id', itemId);
    set(state => ({
      activityItems: {
        ...state.activityItems,
        [activityId]: (state.activityItems[activityId] || []).filter(i => i.id !== itemId)
      }
    }));
  },

  addContribution: async (itemId: string, activityId: string, userId: string, userName: string) => {
    const { data, error } = await supabase
      .from('item_contributions')
      .insert([{ item_id: itemId, user_id: userId, user_name: userName }])
      .select()
      .single();
    
    if (!error && data) {
      set(state => ({
        activityItems: {
          ...state.activityItems,
          [activityId]: (state.activityItems[activityId] || []).map(item =>
            item.id === itemId
              ? { ...item, contributions: [...item.contributions, data as ItemContribution] }
              : item
          )
        }
      }));
    }
  },

  removeContribution: async (itemId: string, activityId: string, userId: string) => {
    const state = get();
    const item = (state.activityItems[activityId] || []).find(i => i.id === itemId);
    const contrib = item?.contributions?.find(c => c.user_id === userId);
    if (!contrib) return;

    await supabase.from('item_contributions').delete().eq('id', contrib.id);
    
    set(state => ({
      activityItems: {
        ...state.activityItems,
        [activityId]: (state.activityItems[activityId] || []).map(item =>
          item.id === itemId
            ? { ...item, contributions: item.contributions.filter(c => c.user_id !== userId) }
            : item
        )
      }
    }));
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
