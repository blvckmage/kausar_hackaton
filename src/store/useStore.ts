import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'admin' | 'user';
  xp?: number;
  completed_modules?: number;
  telegram_chat_id?: string | null;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => Promise<void>;
  initializeAuth: () => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;

  // PWA
  deferredPrompt: any | null;
  setDeferredPrompt: (prompt: any | null) => void;
}

export const useStore = create<AppState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },

  // Notifications logic
  notifications: [
    {
      id: '1',
      title: 'Добро пожаловать в Mentoria Hub!',
      message: 'Платформа готова к использованию. Присоединяйтесь к курсам.',
      date: new Date().toISOString(),
      read: false
    }
  ],
  addNotification: (notification) => set((state) => ({
    notifications: [{
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString(),
      read: false,
      ...notification
    }, ...state.notifications]
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  clearNotifications: () => set({ notifications: [] }),

  // PWA logic
  deferredPrompt: null,
  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),

  initializeAuth: () => {
    // Initial fetch of session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Fetch profile
        supabase.from('profiles').select('*').eq('id', session.user.id).single().then(({ data: profile }) => {
          set({ 
            user: {
              id: session.user.id,
              email: session.user.email || '',
              full_name: profile?.full_name || session.user.user_metadata?.full_name,
              role: profile?.role || 'user',
              xp: profile?.xp || 0,
              completed_modules: profile?.completed_modules || 0,
              telegram_chat_id: profile?.telegram_chat_id || null
            },
            isLoading: false 
          });
        });
      } else {
        set({ user: null, isLoading: false });
      }
    });

    // Listen to auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        set({ 
          user: {
            id: session.user.id,
            email: session.user.email || '',
            full_name: profile?.full_name || session.user.user_metadata?.full_name,
            role: profile?.role || 'user',
            xp: profile?.xp || 0,
            completed_modules: profile?.completed_modules || 0,
            telegram_chat_id: profile?.telegram_chat_id || null
          }
        });
      } else if (event === 'SIGNED_OUT') {
        set({ user: null });
      }
    });
  }
}));
