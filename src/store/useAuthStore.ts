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
  guestCreatedCount: number; // Track created activities for guests
  isLoginModalOpen: boolean;
  pendingActivityId: number | null;
  isAuthLoading: boolean; // true while Supabase checks session on mount
  loginAsGuest: (name: string) => void;
  joinActivity: (activityId: number) => boolean; // Returns false if guest limit reached
  incrementGuestCreated: () => boolean;
  decrementGuestCreated: () => void;
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
  guestCreatedCount: 0,
  isLoginModalOpen: false,
  isAuthLoading: true,
  pendingActivityId: null,
  
  loginAsGuest: (name) => set({ user: { id: crypto.randomUUID(), name, type: 'guest' }, guestJoinedActivities: [], guestCreatedCount: 0 }),
  
  leaveActivity: (activityId) => set((state) => ({ 
    guestJoinedActivities: state.guestJoinedActivities.filter(id => id !== activityId) 
  })),

  joinActivity: (activityId) => {
    const { user, guestJoinedActivities } = get();
    if (!user) return false;
    
    if (user.type === 'guest') {
      if (guestJoinedActivities.length >= 5 && !guestJoinedActivities.includes(activityId)) {
        return false; // Limit reached
      }
      if (!guestJoinedActivities.includes(activityId)) {
        set({ guestJoinedActivities: [...guestJoinedActivities, activityId] });
      }
      return true;
    }
    return true; // Registered users have no limit
  },

  decrementGuestCreated: () => set(state => ({
    guestCreatedCount: Math.max(0, state.guestCreatedCount - 1)
  })),
  incrementGuestCreated: () => {
    const { user, guestCreatedCount } = get();
    if (!user) return false;
    if (user.type === 'guest') {
      if (guestCreatedCount >= 3) return false;
      set({ guestCreatedCount: guestCreatedCount + 1 });
      return true;
    }
    return true;
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
        set({ 
          user: { 
            ...currentUser,
            id: session.user.id, 
            email: session.user.email,
            name: currentUser?.name || session.user.email?.split('@')[0] || 'Usuario', 
            type: 'registered' 
          },
          isLoginModalOpen: false 
        });
      }
      // Auth check complete — hide the loading veil
      set({ isAuthLoading: false });
    });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const currentUser = get().user;
        set({ 
          user: { 
            ...currentUser,
            id: session.user.id, 
            email: session.user.email,
            name: currentUser?.name || session.user.email?.split('@')[0] || 'Usuario', 
            type: 'registered' 
          },
          isLoginModalOpen: false
        });
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
  partialize: (state) => ({ ...state, isLoginModalOpen: false }),
}
));
