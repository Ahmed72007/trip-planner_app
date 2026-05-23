import { Mission, Rank } from '../types/trip';

// ─── Rank System ────────────────────────────────────────────────────────────

export const RANKS: Rank[] = [
  { name: 'Wanderer', minExp: 0, icon: '🚶', color: '#8E8E93' },
  { name: 'Explorer', minExp: 100, icon: '🧭', color: '#64B5F6' },
  { name: 'Adventurer', minExp: 300, icon: '⛰️', color: '#4ECDC4' },
  { name: 'Voyager', minExp: 500, icon: '🚀', color: '#AED581' },
  { name: 'Conquerer', minExp: 800, icon: '⚔️', color: '#FFB74D' },
  { name: 'Globetrotter', minExp: 1200, icon: '🌍', color: '#F48FB1' },
  { name: 'The Batoota', minExp: 1800, icon: '👑', color: '#7C6EF6' },
  { name: 'Legend', minExp: 2500, icon: '🏆', color: '#FF6B6B' },
  { name: 'Mythic Traveler', minExp: 4000, icon: '✨', color: '#FFD700' },
];

export function getCurrentRank(exp: number): Rank {
  let currentRank = RANKS[0];
  for (const rank of RANKS) {
    if (exp >= rank.minExp) {
      currentRank = rank;
    } else {
      break;
    }
  }
  return currentRank;
}

export function getNextRank(exp: number): Rank | null {
  for (const rank of RANKS) {
    if (exp < rank.minExp) {
      return rank;
    }
  }
  return null;
}

export function getRankProgress(exp: number): number {
  const current = getCurrentRank(exp);
  const next = getNextRank(exp);
  if (!next) return 1; // Max rank reached

  const progressInLevel = exp - current.minExp;
  const levelRange = next.minExp - current.minExp;
  return progressInLevel / levelRange;
}

// ─── Mission Definitions ────────────────────────────────────────────────────

export const DEFAULT_MISSIONS: Mission[] = [
  {
    id: 'mission_create_trip',
    title: 'First Steps',
    description: 'Create your first trip plan',
    expReward: 20,
    completed: false,
    icon: '✈️',
    type: 'one-time',
    requirement: { action: 'create_trip', count: 1 },
  },
  {
    id: 'mission_3_trips',
    title: 'Frequent Flyer',
    description: 'Create 3 trip plans',
    expReward: 50,
    completed: false,
    icon: '🛫',
    type: 'one-time',
    requirement: { action: 'create_trip', count: 3 },
  },
  {
    id: 'mission_add_expense',
    title: 'Budget Keeper',
    description: 'Track your first expense',
    expReward: 15,
    completed: false,
    icon: '💰',
    type: 'one-time',
    requirement: { action: 'add_expense', count: 1 },
  },
  {
    id: 'mission_journal',
    title: 'Memory Maker',
    description: 'Write your first journal entry',
    expReward: 15,
    completed: false,
    icon: '📝',
    type: 'one-time',
    requirement: { action: 'add_journal', count: 1 },
  },
  {
    id: 'mission_checklist',
    title: 'Organized Traveler',
    description: 'Create a packing checklist',
    expReward: 10,
    completed: false,
    icon: '✅',
    type: 'one-time',
    requirement: { action: 'add_checklist', count: 1 },
  },
  {
    id: 'mission_5_places',
    title: 'Place Hunter',
    description: 'Visit 5 different places',
    expReward: 30,
    completed: false,
    icon: '📍',
    type: 'one-time',
    requirement: { action: 'visit_places', count: 5 },
  },
  {
    id: 'mission_complete_checklist',
    title: 'All Packed!',
    description: 'Complete an entire checklist',
    expReward: 25,
    completed: false,
    icon: '🎒',
    type: 'one-time',
    requirement: { action: 'complete_checklist', count: 1 },
  },
  {
    id: 'mission_share',
    title: 'Social Butterfly',
    description: 'Add 3 members to a group trip',
    expReward: 20,
    completed: false,
    icon: '🤝',
    type: 'one-time',
    requirement: { action: 'share_trip', count: 3 },
  },
  {
    id: 'mission_10_expenses',
    title: 'Penny Pincher',
    description: 'Track 10 expenses across trips',
    expReward: 40,
    completed: false,
    icon: '🧾',
    type: 'one-time',
    requirement: { action: 'add_expense', count: 10 },
  },
  {
    id: 'mission_5_journals',
    title: 'Storyteller',
    description: 'Write 5 journal entries',
    expReward: 35,
    completed: false,
    icon: '📖',
    type: 'one-time',
    requirement: { action: 'add_journal', count: 5 },
  },
];
