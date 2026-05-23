import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Trip, Place, Expense, Arrangement, JournalEntry, TripMember } from '../types/trip';

// ─── Guide Types ─────────────────────────────────────────────────────────────
export interface GuidePlace {
  id: string;
  name: string;
  category: 'eat' | 'stay' | 'visit';
  notes: string;
}

export interface Guide {
  id: string;
  title: string;
  city: string;
  description: string;
  places: GuidePlace[];
}

// Use localStorage on web (sync) to avoid hydration deadlock; AsyncStorage on native
const storage = Platform.OS === 'web'
  ? createJSONStorage(() => localStorage)
  : createJSONStorage(() => AsyncStorage);

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const SAMPLE_TRIP: Trip = {
  id: 'sample_trip_1',
  title: 'Paris Adventure',
  city: 'Paris',
  country: 'France',
  startDate: '2026-04-10',
  endDate: '2026-04-13',
  days: 3,
  preferences: ['culture', 'food', 'art'],
  members: [{ id: 'user_1', name: 'You' }],
  places: [
    { id: 'p1', name: 'Eiffel Tower', description: 'Iconic iron lattice tower', location: { lat: 48.8584, lng: 2.2945 }, dayIndex: 0, time: '09:00', duration: 120, cost: 26, category: 'attraction', addedBy: 'ai', image: '🗼' },
    { id: 'p2', name: 'Louvre Museum', description: 'World\'s largest art museum', location: { lat: 48.8606, lng: 2.3376 }, dayIndex: 0, time: '13:00', duration: 180, cost: 17, category: 'museum', addedBy: 'ai', image: '🎨' },
    { id: 'p3', name: 'Montmartre', description: 'Charming hilltop neighborhood', location: { lat: 48.8867, lng: 2.3431 }, dayIndex: 1, time: '09:00', duration: 150, cost: 0, category: 'attraction', addedBy: 'ai', image: '⛪' },
    { id: 'p4', name: 'Seine River Cruise', description: 'Evening cruise with views', location: { lat: 48.8589, lng: 2.2938 }, dayIndex: 1, time: '19:00', duration: 75, cost: 15, category: 'attraction', addedBy: 'ai', image: '🚢' },
    { id: 'p5', name: 'Le Marais District', description: 'Trendy neighborhood', location: { lat: 48.8566, lng: 2.3621 }, dayIndex: 2, time: '12:00', duration: 180, cost: 20, category: 'shopping', addedBy: 'ai', image: '🛍️' },
  ],
  expenses: [
    { id: 'e1', amount: 26, currency: 'EUR', category: 'activities', paidBy: 'user_1', splitBetween: ['user_1'], date: '2026-04-10', note: 'Eiffel Tower tickets' },
    { id: 'e2', amount: 45, currency: 'EUR', category: 'food', paidBy: 'user_1', splitBetween: ['user_1'], date: '2026-04-10', note: 'Dinner at bistro' },
    { id: 'e3', amount: 17, currency: 'EUR', category: 'activities', paidBy: 'user_1', splitBetween: ['user_1'], date: '2026-04-11', note: 'Louvre entry' },
  ],
  arrangements: [
    { id: 'a1', type: 'flight', title: 'Air France CDG → Paris', date: '2026-04-10', notes: 'Flight AF123, Terminal 2E', cost: 350, confirmed: true },
    { id: 'a2', type: 'hotel', title: 'Hotel Le Marais', date: '2026-04-10', endDate: '2026-04-13', notes: 'Confirmation #HLM2345, Breakfast included', cost: 180, confirmed: true },
  ],
  journalEntries: [
    { id: 'j1', text: 'Arrived in Paris! The city is absolutely stunning. The Eiffel Tower at sunset was breathtaking 🗼', images: [], date: '2026-04-10', mood: 'amazing' },
  ],
  createdAt: new Date().toISOString(),
};

// ─── Store Types ─────────────────────────────────────────────────────────────

interface TripState {

  trips: Trip[];
  currentTripId: string | null;
  guides: Guide[]; // NEW: Added guides to state

  // Trip CRUD
  addTrip: (tripData: Omit<Trip, "id" | "createdAt" | "places" | "expenses" | "arrangements" | "journalEntries"> & Partial<Trip>) => string;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  setCurrentTrip: (id: string | null) => void;
  getCurrentTrip: () => Trip | null;

  // Guide CRUD
  addGuide: (guide: Omit<Guide, 'id'>) => string;
  deleteGuide: (id: string) => void;

  // Places
  addPlace: (tripId: string, place: Omit<Place, 'id'>) => void;
  updatePlace: (tripId: string, placeId: string, updates: Partial<Place>) => void;
  removePlace: (tripId: string, placeId: string) => void;
  addPlaces: (tripId: string, places: Omit<Place, 'id'>[]) => void;

  // Expenses
  addExpense: (tripId: string, expense: Omit<Expense, 'id'>) => void;
  updateExpense: (tripId: string, expenseId: string, updates: Partial<Expense>) => void;
  removeExpense: (tripId: string, expenseId: string) => void;

  // Arrangements
  addArrangement: (tripId: string, arrangement: Omit<Arrangement, 'id'>) => void;
  updateArrangement: (tripId: string, arrangementId: string, updates: Partial<Arrangement>) => void;
  removeArrangement: (tripId: string, arrangementId: string) => void;

  // Journal
  addJournalEntry: (tripId: string, entry: Omit<JournalEntry, 'id'>) => void;
  updateJournalEntry: (tripId: string, entryId: string, updates: Partial<JournalEntry>) => void;
  removeJournalEntry: (tripId: string, entryId: string) => void;

  // Members
  addMember: (tripId: string, member: TripMember) => void;
  removeMember: (tripId: string, memberId: string) => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      trips: [SAMPLE_TRIP],
      currentTripId: null,
      guides: [], // NEW: Initialize empty guides array

      // ── Trip CRUD ──
      addTrip: (tripData) => {
        // 🚨 THE MAGIC FIX: Use the ID if we gave it one, otherwise generate a new one!
        const id = tripData.id || generateId();

        const newTrip: Trip = {
          ...tripData,
          id: id, // <-- Now it respects our Supabase ID!

          // Use the arrays from tripData if they exist, otherwise default to empty []
          places: tripData.places || [],
          expenses: tripData.expenses || [],
          arrangements: tripData.arrangements || [],
          journalEntries: tripData.journalEntries || [],
          createdAt: tripData.createdAt || new Date().toISOString(),
        };

        set(state => ({ trips: [newTrip, ...state.trips] }));

        return id; // It hands the correct ID back to the router!
      }, updateTrip: (id, updates) => {
        set(state => ({
          trips: state.trips.map(t => t.id === id ? { ...t, ...updates } : t),
        }));
      },

      deleteTrip: (id) => {
        set(state => ({
          trips: state.trips.filter(t => t.id !== id),
          currentTripId: state.currentTripId === id ? null : state.currentTripId,
        }));
      },

      setCurrentTrip: (id) => set({ currentTripId: id }),

      getCurrentTrip: () => {
        const { trips, currentTripId } = get();
        return trips.find(t => t.id === currentTripId) ?? null;
      },

      // ── Guide CRUD ──
      addGuide: (guideData) => {
        const id = `guide_${generateId()}`;
        const newGuide: Guide = {
          ...guideData,
          id,
        };
        set(state => ({ guides: [newGuide, ...state.guides] }));
        return id;
      },

      deleteGuide: (id) => {
        set(state => ({
          guides: state.guides.filter(g => g.id !== id),
        }));
      },

      // ── Places ──
      addPlace: (tripId, place) => {
        const newPlace: Place = { ...place, id: generateId() };
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId ? { ...t, places: [...t.places, newPlace] } : t
          ),
        }));
      },

      updatePlace: (tripId, placeId, updates) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? { ...t, places: t.places.map(p => p.id === placeId ? { ...p, ...updates } : p) }
              : t
          ),
        }));
      },

      removePlace: (tripId, placeId) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? { ...t, places: t.places.filter(p => p.id !== placeId) }
              : t
          ),
        }));
      },

      addPlaces: (tripId, places) => {
        const newPlaces: Place[] = places.map(p => ({ ...p, id: generateId() }));
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId ? { ...t, places: [...t.places, ...newPlaces] } : t
          ),
        }));
      },

      // ── Expenses ──
      addExpense: (tripId, expense) => {
        const newExpense: Expense = { ...expense, id: generateId() };
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId ? { ...t, expenses: [...t.expenses, newExpense] } : t
          ),
        }));
      },

      updateExpense: (tripId, expenseId, updates) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? { ...t, expenses: t.expenses.map(e => e.id === expenseId ? { ...e, ...updates } : e) }
              : t
          ),
        }));
      },

      removeExpense: (tripId, expenseId) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? { ...t, expenses: t.expenses.filter(e => e.id !== expenseId) }
              : t
          ),
        }));
      },

      // ── Arrangements ──
      addArrangement: (tripId, arrangement) => {
        const newArr: Arrangement = { ...arrangement, id: generateId() };
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId ? { ...t, arrangements: [...t.arrangements, newArr] } : t
          ),
        }));
      },

      updateArrangement: (tripId, arrangementId, updates) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? { ...t, arrangements: t.arrangements.map(a => a.id === arrangementId ? { ...a, ...updates } : a) }
              : t
          ),
        }));
      },

      removeArrangement: (tripId, arrangementId) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? { ...t, arrangements: t.arrangements.filter(a => a.id !== arrangementId) }
              : t
          ),
        }));
      },

      // ── Journal ──
      addJournalEntry: (tripId, entry) => {
        const newEntry: JournalEntry = { ...entry, id: generateId() };
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId ? { ...t, journalEntries: [...t.journalEntries, newEntry] } : t
          ),
        }));
      },

      updateJournalEntry: (tripId, entryId, updates) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? { ...t, journalEntries: t.journalEntries.map(j => j.id === entryId ? { ...j, ...updates } : j) }
              : t
          ),
        }));
      },

      removeJournalEntry: (tripId, entryId) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? { ...t, journalEntries: t.journalEntries.filter(j => j.id !== entryId) }
              : t
          ),
        }));
      },

      // ── Members ──
      addMember: (tripId, member) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId ? { ...t, members: [...t.members, member] } : t
          ),
        }));
      },

      removeMember: (tripId, memberId) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? { ...t, members: t.members.filter(m => m.id !== memberId) }
              : t
          ),
        }));
      },
    }),
    {
      name: 'travelapp-trips',
      storage,
    }
  )
);