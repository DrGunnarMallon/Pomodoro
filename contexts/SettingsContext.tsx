// contexts/SettingsContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimerSettings, DEFAULT_TIMER_SETTINGS, NotificationPreferences } from '@/types/settings.types';

interface SettingsContextType {
  settings: TimerSettings;
  saveSettings: (newSettings: Partial<TimerSettings>) => Promise<void>;
  loadSettings: () => Promise<void>; // Exposed for potential manual reload
  isLoadingSettings: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'timerSettings';

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_TIMER_SETTINGS);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  const loadSettings = async () => {
    setIsLoadingSettings(true);
    try {
      const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        // Merge with defaults to ensure all keys are present, especially if new settings are added later
        setSettings(prev => ({ ...DEFAULT_TIMER_SETTINGS, ...prev, ...parsedSettings }));
      } else {
        setSettings(DEFAULT_TIMER_SETTINGS); // Set defaults if nothing is stored
      }
    } catch (error) {
      console.error("Failed to load settings from storage", error);
      setSettings(DEFAULT_TIMER_SETTINGS); // Fallback to defaults on error
    } finally {
      setIsLoadingSettings(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const saveSettings = async (newSettings: Partial<TimerSettings>) => {
    try {
      const mergedSettings = { ...settings, ...newSettings };
      // Ensure nested objects like notificationPreferences are also merged correctly
      if (newSettings.notificationPreferences) {
        mergedSettings.notificationPreferences = {
          ...settings.notificationPreferences,
          ...newSettings.notificationPreferences,
        };
      }
      setSettings(mergedSettings);
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(mergedSettings));
    } catch (error) {
      console.error("Failed to save settings to storage", error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, saveSettings, loadSettings, isLoadingSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
