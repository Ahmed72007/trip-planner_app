// ─── Core Data Models ───────────────────────────────────────────────────────

export interface Location {
  lat: number;
  lng: number;
}

export interface TripMember {
  id: string;
  name: string;
  avatar?: string;
}

export interface Trip {
  id: string;
  title: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  days: number;
  preferences: TripPreference[];
  members: TripMember[];
  places: Place[];
  expenses: Expense[];
  arrangements: Arrangement[];
  journalEntries: JournalEntry[];
  coverImage?: string;
  createdAt: string;
}

export type TripPreference =
  | 'adventure'
  | 'food'
  | 'culture'
  | 'nature'
  | 'nightlife'
  | 'shopping'
  | 'relaxation'
  | 'photography'
  | 'history'
  | 'art';

export interface Place {
  id: string;
  name: string;
  description?: string;
  location: Location;
  address?: string;
  dayIndex: number; // 0-based day index
  time: string; // "09:00"
  duration?: number; // minutes
  notes?: string;
  cost: number;
  category?: PlaceCategory;
  addedBy: 'user' | 'ai';
  image?: string;
}

export type PlaceCategory =
  | 'restaurant'
  | 'attraction'
  | 'museum'
  | 'park'
  | 'shopping'
  | 'nightlife'
  | 'transport'
  | 'hotel'
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  paidBy: string; // member id
  splitBetween: string[]; // member ids
  date: string;
  note: string;
  linkedPlaceId?: string;
}

export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'accommodation'
  | 'activities'
  | 'shopping'
  | 'other';

export interface Arrangement {
  id: string;
  type: 'flight' | 'hotel' | 'food' | 'transport' | 'other';
  title: string;
  date: string;
  endDate?: string;
  notes: string;
  cost?: number;
  confirmed: boolean;
}

export interface JournalEntry {
  id: string;
  text: string;
  images: string[];
  date: string;
  mood?: 'amazing' | 'good' | 'okay' | 'bad';
}

// ─── Checklist Models ───────────────────────────────────────────────────────

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
  icon?: string;
  createdAt: string;
}

// ─── Gamification Models ────────────────────────────────────────────────────

export interface Mission {
  id: string;
  title: string;
  description: string;
  expReward: number;
  completed: boolean;
  icon: string;
  type: 'one-time' | 'daily' | 'weekly';
  requirement: MissionRequirement;
}

export interface MissionRequirement {
  action: 'create_trip' | 'login_streak' | 'share_trip' | 'add_expense' | 'add_journal' | 'add_checklist' | 'visit_places' | 'complete_checklist';
  count: number;
}

export interface Rank {
  name: string;
  minExp: number;
  icon: string;
  color: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  exp: number;
  interests: TripPreference[];
  darkMode: boolean;
  joinedDate: string;
}
