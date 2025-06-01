// app/about.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { theme } from '@/styles/theme'; // Import the theme

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.mainTitle}>About Pomodoro Go!</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What is the Pomodoro Technique?</Text>
        <Text style={styles.paragraph}>
          The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s.
          It uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks.
          Each interval is known as a pomodoro, from the Italian word for 'tomato', after the tomato-shaped kitchen timer that Cirillo used as a university student.
        </Text>
        <Text style={styles.paragraph}>
          Typically, after four pomodoros (work intervals), you take a longer break. This method aims to improve focus and reduce mental fatigue.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Use This App</Text>

        <Text style={styles.subSectionTitle}>Managing Tasks</Text>
        <Text style={styles.paragraph}>
          Go to the 'Tasks' tab to create, view, edit, and delete your to-do items. Tasks have a title, description, status (To Do, In Progress, Done), urgency (Low, Medium, High), and an optional due date. This helps you organize what you need to work on.
        </Text>

        <Text style={styles.subSectionTitle}>Setting Up Your Timer</Text>
        <Text style={styles.paragraph}>
          In the 'Setup' tab, you can customize your Pomodoro session. Choose from predefined timings (like 25 min work / 5 min break) or set your own custom work and break durations. You can also select the number of work iterations (pomodoros) you aim to complete before a longer break or session end. Additionally, you can pick specific tasks from your list to focus on during the upcoming session.
        </Text>

        <Text style={styles.subSectionTitle}>Starting a Session</Text>
        <Text style={styles.paragraph}>
          From the 'Home' tab, simply tap the 'Start Work' button to begin your focused session. The timer will start with your configured work duration.
        </Text>

        <Text style={styles.subSectionTitle}>During a Session</Text>
        <Text style={styles.paragraph}>
          The timer screen will clearly display your remaining time for the current work or break segment. The screen color also changes – red-themed for work, and green-themed for breaks. If you've selected tasks, the current task will be shown. During breaks, you'll be prompted to update the status of the task you just worked on (e.g., mark it as 'Done'). Keep an eye on your progress with the iteration counter.
        </Text>

        <Text style={styles.subSectionTitle}>Notifications</Text>
        <Text style={styles.paragraph}>
          The app will (soon) provide notifications for session events (this feature is under development). Currently, console logs indicate when work/break sessions end.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tips for Success</Text>
        <Text style={styles.listItem}>• Minimize distractions during your work intervals. Turn off notifications if possible.</Text>
        <Text style={styles.listItem}>• Use your short breaks to actually rest – step away from your screen, stretch, or grab a drink.</Text>
        <Text style={styles.listItem}>• Don't be afraid to adjust timings. The standard 25/5 might not be perfect for everyone or every task.</Text>
        <Text style={styles.listItem}>• If you finish a task mid-pomodoro, use the remaining time for overlearning or start a related small task.</Text>
      </View>

      <View style={styles.footerSection}>
        <Text style={styles.footerText}>
          Made with Expo and React Native.
        </Text>
        <Text style={styles.footerText}>
          Happy Focusing!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primaryBackground,
  },
  contentContainer: {
    padding: theme.spacing.medium,
    paddingTop: Platform.OS === 'android' ? theme.spacing.large : theme.spacing.medium,
  },
  mainTitle: {
    fontFamily: theme.fonts.title,
    fontSize: theme.fontSizes.xlarge, // Consistent with other main titles
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
  },
  section: {
    marginBottom: theme.spacing.large,
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.medium,
    borderRadius: 10,
    ...theme.SHADOWS.light,
  },
  sectionTitle: {
    fontFamily: theme.fonts.title,
    fontSize: theme.fontSizes.large, // Consistent section title size
    fontWeight: '600', // Semibold
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.medium,
  },
  subSectionTitle: {
    fontFamily: theme.fonts.title, // Or body with bold
    fontSize: theme.fontSizes.mediumPlus,
    fontWeight: '600',
    color: theme.colors.accentRed,
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.small,
  },
  paragraph: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.regular,
    lineHeight: theme.fontSizes.regular * 1.5, // Improve readability
    color: theme.colors.textParagraph,
    marginBottom: theme.spacing.small,
  },
  listItem: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.regular,
    lineHeight: theme.fontSizes.regular * 1.5,
    color: theme.colors.textParagraph,
    marginBottom: theme.spacing.small,
    marginLeft: theme.spacing.small, // Indent list items slightly
  },
  footerSection: {
    marginTop: theme.spacing.large,
    paddingTop: theme.spacing.medium,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xsmall,
  },
});
