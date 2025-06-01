import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#333",
        headerStyle: {
          backgroundColor: "#fe9a8a",
        },
        headerShadowVisible: false,
        headerTintColor: "#333",
        tabBarStyle: {
          backgroundColor: "#fe9a8a",
        },
      }}
    >
      <Tabs.Screen
        name="timers"
        options={{ title: "Pomodoro Timer", headerTitleAlign: "center" }}
      />
    </Tabs>
  );
}
