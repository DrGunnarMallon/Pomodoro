// app/timerSetup.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  Switch, FlatList, Platform, Alert, Dimensions
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSettings } from '@/contexts/SettingsContext';
import { useTasks } from '@/contexts/TaskContext';
import { Task } from '@/types/task.types';
import { TimerSettings, NotificationPreferences } from '@/types/settings.types';
import { theme } from '@/styles/theme'; // Import the theme

const screenWidth = Dimensions.get('window').width;

export default function TimerSetupScreen() {
  const { settings: initialSettings, saveSettings, isLoadingSettings } = useSettings();
  const { tasks: availableTasks, isLoadingTasks } = useTasks();
  const params = useLocalSearchParams<{ from?: string }>();

  // Local state for form inputs, initialized from global settings
  const [localWorkDuration, setLocalWorkDuration] = useState(initialSettings.workDuration.toString());
  const [localBreakDuration, setLocalBreakDuration] = useState(initialSettings.breakDuration.toString());
  const [localIterations, setLocalIterations] = useState(initialSettings.iterations.toString());
  const [localNotifications, setLocalNotifications] = useState<NotificationPreferences>(initialSettings.notificationPreferences);
  const [localSelectedTaskIds, setLocalSelectedTaskIds] = useState<string[]>(initialSettings.selectedTaskIds);

  // Update local state if global settings change (e.g., loaded from AsyncStorage)
  useEffect(() => {
    if (!isLoadingSettings) {
      setLocalWorkDuration(initialSettings.workDuration.toString());
      setLocalBreakDuration(initialSettings.breakDuration.toString());
      setLocalIterations(initialSettings.iterations.toString());
      setLocalNotifications(initialSettings.notificationPreferences);
      setLocalSelectedTaskIds(initialSettings.selectedTaskIds);
    }
  }, [initialSettings, isLoadingSettings]);


  const handlePredefinedTiming = (work: number, brk: number) => {
    setLocalWorkDuration(work.toString());
    setLocalBreakDuration(brk.toString());
    // Optionally save immediately or wait for explicit save button
  };

  const handleSave = async () => {
    const work = parseInt(localWorkDuration, 10);
    const brk = parseInt(localBreakDuration, 10);
    const iter = parseInt(localIterations, 10);

    if (isNaN(work) || work <= 0 || isNaN(brk) || brk <= 0 || isNaN(iter) || iter <= 0) {
      Alert.alert("Invalid Input", "Please ensure all durations and iterations are positive numbers.");
      return;
    }

    const newSettings: Partial<TimerSettings> = {
      workDuration: work,
      breakDuration: brk,
      iterations: iter,
      notificationPreferences: localNotifications,
      selectedTaskIds: localSelectedTaskIds,
    };
    await saveSettings(newSettings);
    Alert.alert("Settings Saved", "Your timer preferences have been updated.");
    // if (params.from === 'activeTimer') {
    //   router.back(); // Or push to timer if preferred
    // }
  };

  const toggleTaskSelection = (taskId: string) => {
    setLocalSelectedTaskIds(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const renderTaskSelectItem = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={styles.taskSelectItem}
      onPress={() => toggleTaskSelection(item.id)}
    >
      <Switch
        value={localSelectedTaskIds.includes(item.id)}
        onValueChange={() => toggleTaskSelection(item.id)}
        trackColor={{ false: "#767577", true: "#C21807" }}
        thumbColor={localSelectedTaskIds.includes(item.id) ? "#f4f3f4" : "#f4f3f4"}
      />
      <Text style={styles.taskSelectTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (isLoadingSettings || isLoadingTasks) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>Timer Setup</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Predefined Timings</Text>
        <View style={styles.predefinedButtons}>
          {[[25, 5], [45, 10], [60, 15], [1, 1]].map(([work, brk], index) => ( // Example 1/1 for testing
            <TouchableOpacity
              key={index}
              style={styles.predefinedButton}
              onPress={() => handlePredefinedTiming(work, brk)}
            >
              <Text style={styles.predefinedButtonText}>{`${work}/${brk}`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Timings</Text>
        <Text style={styles.label}>Work Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          value={localWorkDuration}
          onChangeText={setLocalWorkDuration}
          keyboardType="numeric"
          placeholder="e.g., 25"
        />
        <Text style={styles.label}>Break Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          value={localBreakDuration}
          onChangeText={setLocalBreakDuration}
          keyboardType="numeric"
          placeholder="e.g., 5"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Iterations</Text>
        <Text style={styles.label}>Number of Work/Break Cycles</Text>
        <TextInput
          style={styles.input}
          value={localIterations}
          onChangeText={setLocalIterations}
          keyboardType="numeric"
          placeholder="e.g., 4"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Preferences</Text>
        {Object.keys(localNotifications).map(key => (
          <View key={key} style={styles.switchRow}>
            <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            <Switch
              value={localNotifications[key as keyof NotificationPreferences]}
              onValueChange={value =>
                setLocalNotifications(prev => ({ ...prev, [key]: value }))
              }
              trackColor={{ false: "#767577", true: "#C21807" }}
              thumbColor={"#f4f3f4"}
            />
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Tasks for this Session</Text>
        {availableTasks.length === 0 ? (
          <Text style={styles.infoText}>No tasks available. Create some in the Task List tab.</Text>
        ) : (
          <FlatList
            data={availableTasks}
            renderItem={renderTaskSelectItem}
            keyExtractor={item => item.id}
            style={styles.taskList}
            scrollEnabled={false} // IMPORTANT: To ensure ScrollView handles overall scrolling
          />
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>

      {params.from === 'activeTimer' && (
        <TouchableOpacity style={styles.resumeButton} onPress={() => router.back()}>
          <Text style={styles.resumeButtonText}>Resume Work</Text>
        </TouchableOpacity>
      )}
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
    paddingBottom: theme.spacing.xlarge, // Ensure space for buttons
  },
  loadingText: {
    fontFamily: theme.fonts.body,
    textAlign: 'center',
    marginTop: theme.spacing.xlarge,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textPrimary,
  },
  headerTitle: {
    fontFamily: theme.fonts.title,
    fontSize: theme.fontSizes.xlarge,
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
    fontSize: theme.fontSizes.large, // Adjusted for better hierarchy
    fontWeight: '600', // Semibold for section titles
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.medium,
  },
  label: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textPrimary, // Darker for better readability on cardBackground
    marginBottom: theme.spacing.small,
    marginTop: theme.spacing.small,
  },
  input: {
    fontFamily: theme.fonts.body,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.cardBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: theme.spacing.medium,
    fontSize: theme.fontSizes.regular,
    marginBottom: theme.spacing.medium,
    color: theme.colors.textParagraph,
  },
  predefinedButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // Or 'flex-start' and add margin
  },
  predefinedButton: {
    backgroundColor: theme.colors.accentRed,
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
    borderRadius: 20,
    margin: theme.spacing.xsmall,
    minWidth: screenWidth > 380 ? 70 : 60, // Keep responsive sizing
    alignItems: 'center',
    ...theme.SHADOWS.light,
  },
  predefinedButtonText: {
    fontFamily: theme.fonts.body,
    color: theme.colors.textOnAccent,
    fontSize: screenWidth > 380 ? theme.fontSizes.regular : theme.fontSizes.small,
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.small,
  },
  infoText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: theme.spacing.medium,
  },
  taskList: {
    maxHeight: 200,
    borderColor: theme.colors.cardBorder,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: theme.colors.white, // Background for the list itself
  },
  taskSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.small,
    backgroundColor: theme.colors.white, // Ensure items have bg for consistency
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.cardBorder,
  },
  taskSelectTitle: {
    fontFamily: theme.fonts.body,
    marginLeft: theme.spacing.small,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textParagraph,
  },
  saveButton: {
    backgroundColor: theme.colors.buttonPrimary,
    paddingVertical: theme.spacing.medium,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    ...theme.SHADOWS.medium,
  },
  saveButtonText: {
    fontFamily: theme.fonts.title, // Or body with bold
    color: theme.colors.textOnPrimaryButton,
    fontSize: theme.fontSizes.mediumPlus,
    fontWeight: 'bold',
  },
  resumeButton: {
    backgroundColor: theme.colors.buttonSecondary,
    paddingVertical: theme.spacing.medium,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
    ...theme.SHADOWS.medium,
  },
  resumeButtonText: {
    fontFamily: theme.fonts.title, // Or body with bold
    color: theme.colors.textOnPrimaryButton,
    fontSize: theme.fontSizes.mediumPlus,
    fontWeight: 'bold',
  },
});
