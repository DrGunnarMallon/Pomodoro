// app/activeTimer.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useSettings } from '@/contexts/SettingsContext';
import { useTasks } from '@/contexts/TaskContext';
import { SessionType } from '@/types/timer.types';
import { Task } from '@/types/task.types';
import { DEFAULT_TIMER_SETTINGS } from '@/types/settings.types'; // For fallback
import { theme } from '@/styles/theme'; // Import the theme

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function ActiveTimerScreen() {
  const { settings, isLoadingSettings } = useSettings();
  const { tasks, updateTask, isLoadingTasks } = useTasks();

  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true); // Auto-start
  const [currentIteration, setCurrentIteration] = useState(1);
  const [currentSelectedTaskIndex, setCurrentSelectedTaskIndex] = useState(0);
  const [showCompletionModalForTask, setShowCompletionModalForTask] = useState<Task | null>(null);

  // Derived state (memoized or recalculated on settings/tasks change)
  const S = isLoadingSettings ? DEFAULT_TIMER_SETTINGS : settings; // Use defaults if settings are loading
  const totalIterations = S.iterations;
  const workDurationSeconds = S.workDuration * 60;
  const breakDurationSeconds = S.breakDuration * 60;

  const currentTask = S.selectedTaskIds.length > 0 && !isLoadingTasks
    ? tasks.find(t => t.id === S.selectedTaskIds[currentSelectedTaskIndex])
    : null;

  // Timer countdown effect
  useEffect(() => {
    if (!isRunning || currentSeconds <= 0) {
      if (currentSeconds <= 0) {
        handleSessionEnd();
      }
      return;
    }
    const interval = setInterval(() => {
      setCurrentSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, currentSeconds]);

  // Initial setup effect
  useEffect(() => {
    if (!isLoadingSettings) {
      setCurrentSeconds(S.workDuration * 60);
      setSessionType('work');
      setCurrentIteration(1);
      setCurrentSelectedTaskIndex(0);
      setIsRunning(true); // Auto-start timer
    }
  }, [isLoadingSettings, S.workDuration]); // Depend on S.workDuration to reset if settings change fundamentally

  const handleSessionEnd = useCallback(() => {
    setIsRunning(false); // Stop timer before transitioning

    if (sessionType === 'work') {
      console.log("Notification: Work session ended. Break starting.");
      setSessionType('break');
      setCurrentSeconds(breakDurationSeconds);
      if (currentTask) {
        setShowCompletionModalForTask(currentTask);
      }
      // Check for session completion only if it's the last iteration AND last task (if tasks are selected)
      if (currentIteration >= totalIterations &&
          (S.selectedTaskIds.length === 0 || currentSelectedTaskIndex >= S.selectedTaskIds.length -1)
         ) {
        // This specific condition for session end might need refinement based on desired behavior
        // For now, let's assume session completion after the last work iteration's break.
      }
      setIsRunning(true); // Auto-start break
    } else { // sessionType === 'break'
      setShowCompletionModalForTask(null); // Close modal if open
      console.log("Notification: Break ended. Work session starting.");

      if (currentIteration >= totalIterations &&
          (S.selectedTaskIds.length === 0 || currentSelectedTaskIndex >= S.selectedTaskIds.length -1)
         ) {
        console.log("Notification: Pomodoro session complete!");
        Alert.alert("Session Complete!", "Great job!", [{ text: "OK", onPress: () => router.replace('/') }]);
        return;
      }

      let nextTaskIndex = currentSelectedTaskIndex;
      let nextIteration = currentIteration;

      if (S.selectedTaskIds.length > 0) {
        nextTaskIndex = (currentSelectedTaskIndex + 1);
        if (nextTaskIndex >= S.selectedTaskIds.length) {
          nextTaskIndex = 0; // Cycle tasks
          nextIteration = currentIteration + 1; // Increment iteration only after a full cycle of tasks
        }
      } else {
         nextIteration = currentIteration + 1; // Increment iteration if no tasks
      }

      if (nextIteration > totalIterations) {
         console.log("Notification: Pomodoro session complete (after final break)!");
        Alert.alert("Session Complete!", "Great job!", [{ text: "OK", onPress: () => router.replace('/') }]);
        return;
      }


      setCurrentSelectedTaskIndex(nextTaskIndex);
      setCurrentIteration(nextIteration);
      setSessionType('work');
      setCurrentSeconds(workDurationSeconds);
      setIsRunning(true); // Auto-start next work session
    }
  }, [sessionType, currentTask, currentIteration, totalIterations, S.selectedTaskIds, workDurationSeconds, breakDurationSeconds, currentSelectedTaskIndex]);

  const handlePlayPauseToggle = () => {
    setIsRunning(prev => !prev);
  };

  const handleEndSessionConfirm = () => {
    Alert.alert(
      "End Session?",
      "Are you sure you want to end the current session and return home?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "End Session", style: "destructive", onPress: () => router.replace('/') }
      ]
    );
  };

  const handleTaskCompletionUpdate = (markAsDone: boolean) => {
    if (showCompletionModalForTask) {
      if (markAsDone) {
        updateTask({ ...showCompletionModalForTask, status: 'done' });
      }
      setShowCompletionModalForTask(null);
    }
  };

  const screenStyle = sessionType === 'work' ? styles.workContainer : styles.breakContainer;
  const timerTextStyle = sessionType === 'work' ? styles.workTimerText : styles.breakTimerText;

  if (isLoadingSettings || isLoadingTasks && S.selectedTaskIds.length > 0) {
    return <View style={screenStyle}><Text style={styles.loadingText}>Loading session...</Text></View>;
  }

  return (
    <View style={[styles.container, screenStyle]}>
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.headerButton} onPress={handleEndSessionConfirm}>
          <FontAwesome name="home" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push({ pathname: '/timerSetup', params: { from: 'activeTimer' } })}
        >
          <FontAwesome name="cog" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.timerDisplaySection}>
        <Text style={styles.sessionTitleText}>
          {sessionType === 'work' ? 'Work Session' : 'Quick Break'}
        </Text>
        <Text style={[styles.timerText, timerTextStyle]}>{formatTime(currentSeconds)}</Text>
        {sessionType === 'work' && currentTask && (
          <Text style={styles.currentTaskText}>Task: {currentTask.title}</Text>
        )}
        {sessionType === 'break' && showCompletionModalForTask && (
             <Text style={styles.currentTaskText}>Worked on: {showCompletionModalForTask.title}</Text>
        )}
        <Text style={styles.iterationText}>
          Iteration: {currentIteration} / {totalIterations}
          {S.selectedTaskIds.length > 0 && ` (Task ${currentSelectedTaskIndex + 1} of ${S.selectedTaskIds.length})`}
        </Text>
      </View>

      <View style={styles.controlsSection}>
        <TouchableOpacity style={styles.controlButton} onPress={handlePlayPauseToggle}>
          <FontAwesome name={isRunning ? 'pause' : 'play'} size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Task Completion Modal */}
      <Modal
        transparent={true}
        visible={showCompletionModalForTask !== null}
        animationType="fade"
        onRequestClose={() => handleTaskCompletionUpdate(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Task: {showCompletionModalForTask?.title}</Text>
            <Text style={styles.modalQuestion}>Did you complete this task during the work session?</Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalDoneButton]}
              onPress={() => handleTaskCompletionUpdate(true)}
            >
              <Text style={styles.modalButtonText}>Mark as Done</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalKeepTodoButton]}
              onPress={() => handleTaskCompletionUpdate(false)}
            >
              <Text style={styles.modalButtonText}>Keep as To-Do / In Progress</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? theme.spacing.xlarge : theme.spacing.large + theme.spacing.small,
    paddingBottom: theme.spacing.large,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  workContainer: {
    backgroundColor: theme.colors.primaryBackground,
  },
  breakContainer: {
    backgroundColor: theme.colors.breakBackground,
  },
  loadingText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.mediumPlus,
    color: theme.colors.textSecondary, // Adjusted for visibility on either bg
    textAlign: 'center',
    marginTop: '50%',
  },
  headerButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.medium,
    position: 'absolute',
    top: Platform.OS === 'android' ? theme.spacing.xlarge : theme.spacing.large + theme.spacing.small,
  },
  headerButton: {
    backgroundColor: 'rgba(0,0,0,0.2)', // Semi-transparent black
    padding: theme.spacing.small,
    borderRadius: 20,
  },
  timerDisplaySection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  sessionTitleText: {
    fontFamily: theme.fonts.title,
    fontSize: theme.fontSizes.xlarge,
    fontWeight: 'bold',
    color: theme.colors.textPrimary, // Darker for work, consider lighter for break if bg is dark green
    marginBottom: theme.spacing.medium,
  },
  timerText: {
    fontFamily: theme.fonts.title, // SpaceMono for timer
    fontSize: 90, // Kept large size
    fontWeight: 'bold', // SpaceMono might not have weights
    marginVertical: theme.spacing.medium,
  },
  workTimerText: {
    color: theme.colors.timerWorkText,
  },
  breakTimerText: {
    color: theme.colors.timerBreakText,
  },
  currentTaskText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textSecondary, // Slightly lighter for less emphasis than timer
    marginTop: theme.spacing.small,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.large,
  },
  iterationText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.gray, // Neutral gray for iteration count
    marginTop: theme.spacing.medium,
  },
  controlsSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: theme.spacing.medium,
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.3)', // Darker semi-transparent
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.medium,
    borderRadius: 30,
    marginHorizontal: theme.spacing.small,
    ...theme.SHADOWS.light,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 15,
    padding: theme.spacing.large,
    width: '85%',
    alignItems: 'center',
    ...theme.SHADOWS.medium,
  },
  modalTitle: {
    fontFamily: theme.fonts.title,
    fontSize: theme.fontSizes.large,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.medium,
    textAlign: 'center',
  },
  modalQuestion: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textParagraph,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
  },
  modalButton: {
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    borderRadius: 25,
    minWidth: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
    ...theme.SHADOWS.light,
  },
  modalButtonText: {
    fontFamily: theme.fonts.body, // Or title for bold buttons
    color: theme.colors.textOnPrimaryButton,
    fontSize: theme.fontSizes.regular,
    fontWeight: 'bold',
  },
  modalDoneButton: {
    backgroundColor: theme.colors.statusDone,
  },
  modalKeepTodoButton: {
    backgroundColor: theme.colors.statusKeepTodo,
  },
});
