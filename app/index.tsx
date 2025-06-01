// app/index.tsx (Home Screen)
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { theme } from '@/styles/theme'; // Import the theme

export default function HomeScreen() {
  const handleStartPomodoro = () => {
    router.push("/activeTimer"); // Updated route
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/icon.png')} // Assuming icon.png is the logo
        style={styles.logo}
      />
      <Text style={styles.title}>Pomodoro Timer</Text>
      <Text style={styles.subtitle}>Stay focused and productive. Achieve more.</Text>
      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartPomodoro}
      >
        <Text style={styles.startButtonText}>Start Work</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primaryBackground,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.large,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.large,
  },
  title: {
    fontFamily: theme.fonts.title, // Apply SpaceMono font
    fontSize: theme.fontSizes.xxlarge,
    fontWeight: "bold", // SpaceMono might not have conventional weights, adjust if needed
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.medium,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: theme.fonts.body, // Use system font for body
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xlarge,
    textAlign: "center",
    paddingHorizontal: theme.spacing.medium,
  },
  startButton: {
    backgroundColor: theme.colors.buttonPrimary,
    paddingHorizontal: theme.spacing.xlarge,
    paddingVertical: theme.spacing.medium,
    borderRadius: 30, // Keep it nicely rounded
    ...theme.SHADOWS.medium, // Apply medium shadow from theme
  },
  startButtonText: {
    fontFamily: theme.fonts.body, // Or theme.fonts.title if bold look desired
    color: theme.colors.textOnPrimaryButton,
    fontSize: theme.fontSizes.mediumPlus,
    fontWeight: "bold",
  },
});
