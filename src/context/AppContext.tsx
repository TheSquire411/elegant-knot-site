import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GalleryImage, StyleProfile } from '../types';

interface User {
  id: string;
  email: string;
  name: string;
  styleProfile?: StyleProfile;
  weddingDate?: string;
  isPro?: boolean;
}

interface AppState {
  user: User | null;
  isLoading: boolean;
  inspirationImages: GalleryImage[];
}

type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_INSPIRATION_IMAGE'; payload: GalleryImage }
  | { type: 'UPDATE_INSPIRATION_IMAGE'; payload: { id: string; updates: Partial<GalleryImage> } }
  | { type: 'DELETE_INSPIRATION_IMAGE'; payload: string }
  | { type: 'UPGRADE_USER_TIER' };

const initialState: AppState = {
  user: null,
  isLoading: false,
  inspirationImages: [],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
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
      return { ...state, user: state.user ? { ...state.user, isPro: true } : null };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
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