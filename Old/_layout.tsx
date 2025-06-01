import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("#ff0000");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#fe9a8a",
          },
          headerShadowVisible: false,
          headerTintColor: "#333",
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "Pomodoro Timer", headerTitleAlign: "center" }}
        />
      </Stack>
    </>
  );
}
