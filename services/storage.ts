import { STORAGE_KEYS } from '../constants';
import { UserConfig, Habit, HabitDayStatus } from '../types';

/**
 * NOTE: In a production environment with the Docker setup, 
 * these functions would fetch() to the backend API connected to Postgres.
 * For this standalone frontend demonstration, we use localStorage.
 */

export const getStoredUserConfig = (): UserConfig | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_CONFIG);
  return data ? JSON.parse(data) : null;
};

export const saveUserConfig = (config: UserConfig): void => {
  localStorage.setItem(STORAGE_KEYS.USER_CONFIG, JSON.stringify(config));
};

export const getHabits = (): Habit[] => {
  const data = localStorage.getItem(STORAGE_KEYS.HABITS);
  return data ? JSON.parse(data) : [];
};

export const saveHabit = (habit: Habit): void => {
  const habits = getHabits();
  // Check if exists
  const existingIndex = habits.findIndex(h => h.uuid === habit.uuid);
  if (existingIndex >= 0) {
    habits[existingIndex] = habit;
  } else {
    habits.push(habit);
  }
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
};

export const deleteHabit = (uuid: string): void => {
  const habits = getHabits();
  const filtered = habits.filter(h => h.uuid !== uuid);
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(filtered));
  
  // Cleanup statuses
  const allStatuses = getAllHabitStatuses();
  const cleanStatuses = allStatuses.filter(s => s.habitUuid !== uuid);
  localStorage.setItem(STORAGE_KEYS.HABIT_STATUSES, JSON.stringify(cleanStatuses));
};

export const getAllHabitStatuses = (): HabitDayStatus[] => {
  const data = localStorage.getItem(STORAGE_KEYS.HABIT_STATUSES);
  return data ? JSON.parse(data) : [];
};

export const getHabitStatusesForHabit = (habitUuid: string): HabitDayStatus[] => {
  const all = getAllHabitStatuses();
  return all.filter(s => s.habitUuid === habitUuid);
};

export const saveHabitDayStatus = (status: HabitDayStatus): void => {
  const all = getAllHabitStatuses();
  const index = all.findIndex(s => s.habitUuid === status.habitUuid && s.date === status.date);
  
  if (index >= 0) {
    all[index] = status;
  } else {
    all.push(status);
  }
  
  localStorage.setItem(STORAGE_KEYS.HABIT_STATUSES, JSON.stringify(all));
};
