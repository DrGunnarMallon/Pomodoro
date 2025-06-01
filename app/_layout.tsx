// app/_layout.tsx
import { Tabs } from "expo-router"; // Import Tabs
import React, { useEffect } from 'react'; // Import React for JSX
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome for icons
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import TabBarIcon from '@/components/TabBarIcon'; // Will create this component
import { TaskProvider } from '@/contexts/TaskContext'; // Import TaskProvider
import { SettingsProvider } from '@/contexts/SettingsContext'; // Import SettingsProvider

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null; // Return null or a loading indicator while fonts are loading
  }

  // Optionally, log font error to console if it occurs
  if (fontError) {
    console.error("Font loading error:", fontError);
  }

  return (
    <SettingsProvider>
      <TaskProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#C21807', // Shade of red
            tabBarInactiveTintColor: '#D3D3D3', // Lighter gray
            headerShown: false, // Hide headers for all tab screens
            // Consider adding a general tab bar style if needed, e.g., background color
            // tabBarStyle: { backgroundColor: '#fff0f0' },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => <TabBarIcon name="home" color={color} />,
            }}
          />
          <Tabs.Screen
            name="taskList"
            options={{
              title: 'Tasks',
              tabBarIcon: ({ color, size }) => <TabBarIcon name="list" color={color} />,
            }}
          />
          <Tabs.Screen
            name="timerSetup"
            options={{
              title: 'Setup',
              tabBarIcon: ({ color, size }) => <TabBarIcon name="cog" color={color} />,
            }}
          />
          <Tabs.Screen
            name="about"
            options={{
              title: 'About',
              tabBarIcon: ({ color, size }) => <TabBarIcon name="info-circle" color={color} />,
            }}
          />
          {/* Keep the timer screen accessible but hidden from tabs */}
        {/* This setup means navigating to 'activeTimer' will still work programmatically */}
          <Tabs.Screen
          name="activeTimer"
            options={{
              href: null, // This hides the tab
            }}
          />
        </Tabs>
      </TaskProvider>
    </SettingsProvider>
  );
}
