// types/settings.types.ts
export interface NotificationPreferences {
  popup: boolean;
  audio: boolean;
  vibration: boolean;
}

export interface TimerSettings {
  workDuration: number; // minutes
  breakDuration: number; // minutes
  iterations: number;
  notificationPreferences: NotificationPreferences;
  selectedTaskIds: string[]; // IDs of tasks selected for the session
}

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  workDuration: 25,
  breakDuration: 5,
  iterations: 4,
  notificationPreferences: {
    popup: true,
    audio: true,
    vibration: false,
  },
  selectedTaskIds: [],
};
