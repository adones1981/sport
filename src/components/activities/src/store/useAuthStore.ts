import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: { 
    id?: string;
    name: string; 
    type: 'guest' | 'registered';
    email?: string;
    phone?: string;
    instagram?: string;
    bio?: string;
    favoriteSports?: string[];
    avatarUrl?: string;
  } | null;
  guestJoinedActivities: number[]; // Track joined activities for guests
  isLoginModalOpen: boolean;
  pendingActivityId: number | null;
  loginAsGuest: (name: string) => void;
  joinActivity: (activityId: number) => boolean; // Returns false if guest limit reached
  leaveActivity: (activityId: number) => void;
  logout: () => void;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  setPendingActivityId: (id: number | null) => void;
  updateProfile: (data: Partial<NonNullable<AuthState['user']>>) => void;
  initializeSupabaseAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
  guestJoinedActivities: [],
  isLoginModalOpen: false,
  pendingActivityId: null,
  
  loginAsGuest: (name) => set({ user: { id: crypto.randomUUID(), name, type: 'guest' }, guestJoinedActivities: [] }),
  
  leaveActivity: (activityId) => set((state) => ({ 
    guestJoinedActivities: state.guestJoinedActivities.filter(id => id !== activityId) 
  })),

  joinActivity: (activityId) => {
    const { user, guestJoinedActivities } = get();
    if (!user) return false;
    
    if (user.type === 'guest') {
      if (guestJoinedActivities.length >= 1 && !guestJoinedActivities.includes(activityId)) {
        return false; // Limit reached
      }
      if (!guestJoinedActivities.includes(activityId)) {
        set({ guestJoinedActivities: [...guestJoinedActivities, activityId] });
      }
      return true;
    }
    return true; // Registered users have no limit
  },
  
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, guestJoinedActivities: [] });
  },
  
  setIsLoginModalOpen: (isOpen) => set({ isLoginModalOpen: isOpen }),
  setPendingActivityId: (id) => set({ pendingActivityId: id }),
  updateProfile: (data) => set((state) => {
    if (!state.user) return state;
    return { user: { ...state.user, ...data } };
  }),
  
  initializeSupabaseAuth: () => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const currentUser = get().user;
        set({ user: { 
          ...currentUser,
          id: session.user.id, 
          email: session.user.email,
          name: currentUser?.name || session.user.email?.split('@')[0] || 'Usuario', 
          type: 'registered' 
        }});
      }
    });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const currentUser = get().user;
        set({ user: { 
          ...currentUser,
          id: session.user.id, 
          email: session.user.email,
          name: currentUser?.name || session.user.email?.split('@')[0] || 'Usuario', 
          type: 'registered' 
        }});
      } else {
        // Only clear if they were registered (don't clear guest users randomly)
        const currentUser = get().user;
        if (currentUser?.type === 'registered') {
          set({ user: null });
        }
      }
    });
  }
}),
{
  name: 'auth-storage',
}
));
