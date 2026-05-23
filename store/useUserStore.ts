import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { UserProfile, Mission, Checklist, ChecklistItem, TripPreference } from '../types/trip';
import { DEFAULT_MISSIONS } from '../utils/missions';

// Use localStorage on web (sync) to avoid hydration deadlock
const storage = Platform.OS === 'web'
  ? createJSONStorage(() => localStorage)
  : createJSONStorage(() => AsyncStorage);

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'user_1',
  name: 'Traveler',
  exp: 20,
  interests: ['adventure', 'food', 'culture'],
  darkMode: true,
  joinedDate: new Date().toISOString(),
};

const DEFAULT_CHECKLISTS: Checklist[] = [
  {
    id: 'cl_1',
    title: 'Packing List',
    icon: '🎒',
    createdAt: new Date().toISOString(),
    items: [
      { id: 'cli_1', text: 'Passport & Travel Documents', completed: true },
      { id: 'cli_2', text: 'Phone & Charger', completed: true },
      { id: 'cli_3', text: 'Travel Adapter', completed: false },
      { id: 'cli_4', text: 'Medications', completed: false },
      { id: 'cli_5', text: 'Sunscreen & Toiletries', completed: false },
      { id: 'cli_6', text: 'Travel Insurance Documents', completed: false },
    ],
  },
  {
    id: 'cl_2',
    title: 'Pre-Trip Tasks',
    icon: '📋',
    createdAt: new Date().toISOString(),
    items: [
      { id: 'cli_7', text: 'Book flights', completed: true },
      { id: 'cli_8', text: 'Book accommodation', completed: true },
      { id: 'cli_9', text: 'Get travel insurance', completed: false },
      { id: 'cli_10', text: 'Notify bank of travel', completed: false },
      { id: 'cli_11', text: 'Download offline maps', completed: false },
    ],
  },
];

interface UserState {
  profile: UserProfile;
  missions: Mission[];
  checklists: Checklist[];
  loginStreak: number;
  lastLoginDate: string | null;

  // Profile
  updateProfile: (updates: Partial<UserProfile>) => void;
  setAvatar: (uri: string) => void;
  toggleDarkMode: () => void;

  // Gamification
  addExp: (amount: number) => void;
  completeMission: (missionId: string) => void;
  checkAndCompleteMissions: (action: Mission['requirement']['action'], count?: number) => void;

  // Checklists
  addChecklist: (title: string, icon?: string) => string;
  deleteChecklist: (id: string) => void;
  updateChecklistTitle: (id: string, title: string) => void;
  addChecklistItem: (checklistId: string, text: string) => void;
  toggleChecklistItem: (checklistId: string, itemId: string) => void;
  deleteChecklistItem: (checklistId: string, itemId: string) => void;
  updateChecklistItem: (checklistId: string, itemId: string, text: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      missions: DEFAULT_MISSIONS,
      checklists: DEFAULT_CHECKLISTS,
      loginStreak: 1,
      lastLoginDate: new Date().toISOString().split('T')[0],

      // ── Profile ──
      updateProfile: (updates) => {
        set(state => ({ profile: { ...state.profile, ...updates } }));
      },

      setAvatar: (uri) => {
        set(state => ({ profile: { ...state.profile, avatar: uri } }));
      },

      toggleDarkMode: () => {
        set(state => ({
          profile: { ...state.profile, darkMode: !state.profile.darkMode },
        }));
      },

      // ── Gamification ──
      addExp: (amount) => {
        set(state => ({
          profile: { ...state.profile, exp: state.profile.exp + amount },
        }));
      },

      completeMission: (missionId) => {
        const { missions, addExp } = get();
        const mission = missions.find(m => m.id === missionId);
        if (mission && !mission.completed) {
          set(state => ({
            missions: state.missions.map(m =>
              m.id === missionId ? { ...m, completed: true } : m
            ),
          }));
          addExp(mission.expReward);
        }
      },

      checkAndCompleteMissions: (action, count = 1) => {
        const { missions, completeMission } = get();
        missions.forEach(mission => {
          if (!mission.completed && mission.requirement.action === action) {
            if (count >= mission.requirement.count) {
              completeMission(mission.id);
            }
          }
        });
      },

      // ── Checklists ──
      addChecklist: (title, icon = '📋') => {
        const id = generateId();
        const newChecklist: Checklist = {
          id,
          title,
          icon,
          items: [],
          createdAt: new Date().toISOString(),
        };
        set(state => ({ checklists: [...state.checklists, newChecklist] }));
        return id;
      },

      deleteChecklist: (id) => {
        set(state => ({ checklists: state.checklists.filter(c => c.id !== id) }));
      },

      updateChecklistTitle: (id, title) => {
        set(state => ({
          checklists: state.checklists.map(c => c.id === id ? { ...c, title } : c),
        }));
      },

      addChecklistItem: (checklistId, text) => {
        const newItem: ChecklistItem = {
          id: generateId(),
          text,
          completed: false,
        };
        set(state => ({
          checklists: state.checklists.map(c =>
            c.id === checklistId ? { ...c, items: [...c.items, newItem] } : c
          ),
        }));
      },

      toggleChecklistItem: (checklistId, itemId) => {
        set(state => ({
          checklists: state.checklists.map(c =>
            c.id === checklistId
              ? {
                  ...c,
                  items: c.items.map(item =>
                    item.id === itemId ? { ...item, completed: !item.completed } : item
                  ),
                }
              : c
          ),
        }));
      },

      deleteChecklistItem: (checklistId, itemId) => {
        set(state => ({
          checklists: state.checklists.map(c =>
            c.id === checklistId
              ? { ...c, items: c.items.filter(item => item.id !== itemId) }
              : c
          ),
        }));
      },

      updateChecklistItem: (checklistId, itemId, text) => {
        set(state => ({
          checklists: state.checklists.map(c =>
            c.id === checklistId
              ? {
                  ...c,
                  items: c.items.map(item =>
                    item.id === itemId ? { ...item, text } : item
                  ),
                }
              : c
          ),
        }));
      },
    }),
    {
      name: 'travelapp-user',
      storage,
    }
  )
);
