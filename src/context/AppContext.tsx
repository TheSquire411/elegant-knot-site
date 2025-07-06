import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User as AuthUser, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { GalleryImage } from '../types';

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

interface AppState {
  user: AuthUser | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  inspirationImages: GalleryImage[];
}

type AppAction = 
  | { type: 'SET_AUTH'; payload: { user: AuthUser | null; session: Session | null } }
  | { type: 'SET_PROFILE'; payload: Profile | null }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_INSPIRATION_IMAGE'; payload: GalleryImage }
  | { type: 'UPDATE_INSPIRATION_IMAGE'; payload: { id: string; updates: Partial<GalleryImage> } }
  | { type: 'DELETE_INSPIRATION_IMAGE'; payload: string }
  | { type: 'UPGRADE_USER_TIER' };

const initialState: AppState = {
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  inspirationImages: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_AUTH':
      return { 
        ...state, 
        user: action.payload.user, 
        session: action.payload.session,
        isLoading: false 
      };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        profile: null, 
        session: null, 
        inspirationImages: [] 
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'ADD_INSPIRATION_IMAGE':
      return { ...state, inspirationImages: [...state.inspirationImages, action.payload] };
    case 'UPDATE_INSPIRATION_IMAGE':
      return {
        ...state,
        inspirationImages: state.inspirationImages.map(img =>
          img.id === action.payload.id ? { ...img, ...action.payload.updates } : img
        )
      };
    case 'DELETE_INSPIRATION_IMAGE':
      return {
        ...state,
        inspirationImages: state.inspirationImages.filter(img => img.id !== action.payload)
      };
    case 'UPGRADE_USER_TIER':
      return { 
        ...state, 
        profile: state.profile ? { ...state.profile, role: 'admin' } : state.profile 
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const signOut = async () => {
    try {
      // Clean up any auth state
      const cleanupAuthState = () => {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            localStorage.removeItem(key);
          }
        });
      };

      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      dispatch({ type: 'LOGOUT' });
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        dispatch({ 
          type: 'SET_AUTH', 
          payload: { user: session?.user ?? null, session } 
        });

        // Defer profile fetching to prevent deadlocks
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          dispatch({ type: 'SET_PROFILE', payload: null });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch({ 
        type: 'SET_AUTH', 
        payload: { user: session?.user ?? null, session } 
      });

      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('AppContext: Fetching profile for user:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      console.log('AppContext: Profile fetch result:', { profile, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else {
        console.log('AppContext: Setting profile in state:', profile);
        dispatch({ type: 'SET_PROFILE', payload: profile });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, signOut }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}