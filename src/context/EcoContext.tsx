import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type {
  ActivityEntry,
  ChatMessage,
  EcoState,
  Mission,
  Theme,
  UserProfile,
} from '../lib/types';
import { loadState, saveState } from '../lib/storage';

type Action =
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'ADD_ACTIVITY'; entry: ActivityEntry }
  | { type: 'DELETE_ACTIVITY'; id: string }
  | { type: 'TOGGLE_MISSION'; id: string }
  | { type: 'SET_MISSIONS'; missions: Mission[] }
  | { type: 'SET_PROFILE'; profile: Partial<UserProfile> }
  | { type: 'ADD_CHAT'; message: ChatMessage }
  | { type: 'CLEAR_CHAT' }
  | { type: 'BUMP_GARDEN'; xp: number }
  | { type: 'PLANT_TREE' }
  | { type: 'RESET' };

function reducer(state: EcoState, action: Action): EcoState {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    case 'ADD_ACTIVITY': {
      const activities = [action.entry, ...state.activities];
      const baselineTotal = 19.0;
      const dayCount = new Set(activities.map((a) => a.date)).size || 1;
      const emitted = activities.reduce((s, a) => s + a.co2, 0);
      const saved = Math.max(0, baselineTotal * dayCount - emitted);
      return { ...state, activities, totalCarbonSaved: saved, gardenXp: Math.floor(saved * 4) };
    }
    case 'DELETE_ACTIVITY':
      return { ...state, activities: state.activities.filter((a) => a.id !== action.id) };
    case 'TOGGLE_MISSION': {
      const missions = state.missions.map((m) =>
        m.id === action.id
          ? { ...m, completed: !m.completed, progress: !m.completed ? m.goal : 0 }
          : m
      );
      const justCompleted = missions.find((m) => m.id === action.id && m.completed);
      const gardenXp = justCompleted ? state.gardenXp + justCompleted.xp : state.gardenXp;
      return { ...state, missions, gardenXp };
    }
    case 'SET_MISSIONS':
      return { ...state, missions: action.missions };
    case 'SET_PROFILE':
      return { ...state, profile: { ...state.profile, ...action.profile } };
    case 'ADD_CHAT':
      return { ...state, chatHistory: [...state.chatHistory, action.message] };
    case 'CLEAR_CHAT':
      return { ...state, chatHistory: [] };
    case 'BUMP_GARDEN':
      return { ...state, gardenXp: state.gardenXp + action.xp };
    case 'PLANT_TREE':
      return {
        ...state,
        profile: { ...state.profile, treesPlanted: state.profile.treesPlanted + 1 },
        gardenXp: state.gardenXp + 150,
      };
    case 'RESET':
      return loadState();
    default:
      return state;
  }
}

interface EcoContextValue {
  state: EcoState;
  dispatch: React.Dispatch<Action>;
}

const EcoContext = createContext<EcoContextValue | null>(null);

export function EcoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [state.theme]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <EcoContext.Provider value={value}>{children}</EcoContext.Provider>;
}

export function useEco() {
  const ctx = useContext(EcoContext);
  if (!ctx) throw new Error('useEco must be used within EcoProvider');
  return ctx;
}
