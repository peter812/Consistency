export interface UserConfig {
  name: string;
  pin: string;
  apiEnabled: boolean;
  apiKey: string;
  isSetupComplete: boolean;
}

export interface Habit {
  uuid: string;
  title: string;
  description: string;
  color: string;
  createdAt: string;
}

export interface HabitDayStatus {
  habitUuid: string;
  date: string; // ISO Date string YYYY-MM-DD
  onTrack: boolean;
  note: string;
}

export enum AppState {
  SETUP = 'SETUP',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  LOADING = 'LOADING'
}

export interface HabitColor {
  id: string;
  name: string;
  value: string; // Tailwind class equivalent hex or class name
  hex: string;
}
