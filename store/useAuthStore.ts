import { create } from 'zustand';
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
  } | null;
  guestJoinedActivities: number[]; // Track joined activities for guests
  isLoginModalOpen: boolean;
  pendingActivityId: number | null;
  loginAsGuest: (name: string) => void;
  joinActivity: (activityId: number) => boolean; // Returns false if guest limit reached
  logout: () => void;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  setPendingActivityId: (id: number | null) => void;
  updateProfile: (data: Partial<AuthState['user']>) => void;
  initializeSupabaseAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  guestJoinedActivities: [],
  isLoginModalOpen: false,
  pendingActivityId: null,
  
  loginAsGuest: (name) => set({ user: { name, type: 'guest' }, guestJoinedActivities: [] }),
  
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
  updateProfile: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
  
  initializeSupabaseAuth: () => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        set({ user: { 
          id: session.user.id, 
          email: session.user.email,
          name: session.user.email?.split('@')[0] || 'Usuario', 
          type: 'registered' 
        }});
      }
    });

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        set({ user: { 
          id: session.user.id, 
          email: session.user.email,
          name: session.user.email?.split('@')[0] || 'Usuario', 
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
}));
