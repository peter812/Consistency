import { HabitColor } from './types';

export const HABIT_COLORS: HabitColor[] = [
  { id: 'slate', name: 'Slate', value: 'bg-slate-800', hex: '#1e293b' },
  { id: 'zinc', name: 'Zinc', value: 'bg-zinc-800', hex: '#27272a' },
  { id: 'red', name: 'Crimson', value: 'bg-red-900', hex: '#7f1d1d' },
  { id: 'orange', name: 'Burnt Orange', value: 'bg-orange-900', hex: '#7c2d12' },
  { id: 'green', name: 'Forest', value: 'bg-green-900', hex: '#14532d' },
  { id: 'teal', name: 'Teal', value: 'bg-teal-900', hex: '#134e4a' },
  { id: 'blue', name: 'Midnight Blue', value: 'bg-blue-900', hex: '#1e3a8a' },
  { id: 'indigo', name: 'Indigo', value: 'bg-indigo-900', hex: '#312e81' },
  { id: 'violet', name: 'Violet', value: 'bg-violet-900', hex: '#4c1d95' },
];

export const DEFAULT_HABIT_COLOR = HABIT_COLORS[1]; // Zinc

export const STORAGE_KEYS = {
  USER_CONFIG: 'consistency_user_config',
  HABITS: 'consistency_habits',
  HABIT_STATUSES: 'consistency_habit_statuses',
};
