// app/taskList.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { useTasks } from '@/contexts/TaskContext';
import TaskItem from '@/components/TaskItem';
import { Task, TaskStatus, TaskUrgency } from '@/types/task.types';
import { theme } from '@/styles/theme'; // Import the theme

export default function TaskListScreen() {
  const { tasks, addTask, updateTask, deleteTask, isLoadingTasks } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [urgency, setUrgency] = useState<TaskUrgency>('medium');
  const [dueDate, setDueDate] = useState('');

  const openModalToAddTask = () => {
    setCurrentTask(null);
    setTitle('');
    setDescription('');
    setStatus('todo');
    setUrgency('medium');
    setDueDate('');
    setModalVisible(true);
  };

  const openModalToEditTask = (task: Task) => {
    setCurrentTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
    setUrgency(task.urgency);
    setDueDate(task.dueDate || '');
    setModalVisible(true);
  };

  const handleSaveTask = () => {
    if (!title.trim()) {
      Alert.alert("Validation Error", "Title is required.");
      return;
    }
    const taskData = { title, description, status, urgency, dueDate };
    if (currentTask) {
      updateTask({ ...currentTask, ...taskData });
    } else {
      addTask(taskData);
    }
    setModalVisible(false);
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteTask(id) }
      ]
    );
  };

  if (isLoadingTasks) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Tasks</Text>
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No tasks yet. Add some!</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem task={item} onEdit={openModalToEditTask} onDelete={handleDeleteTask} />
          )}
          contentContainerStyle={styles.listContentContainer}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={openModalToAddTask}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent} contentContainerStyle={{ paddingBottom: 50 }}>
            <Text style={styles.modalTitle}>{currentTask ? 'Edit Task' : 'Add New Task'}</Text>

            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Finish report"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Optional details about the task"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={status}
                onValueChange={(itemValue) => setStatus(itemValue as TaskStatus)}
                style={styles.picker}
              >
                <Picker.Item label="To Do" value="todo" />
                <Picker.Item label="In Progress" value="in-progress" />
                <Picker.Item label="Done" value="done" />
              </Picker>
            </View>

            <Text style={styles.label}>Urgency</Text>
             <View style={styles.pickerContainer}>
              <Picker
                selectedValue={urgency}
                onValueChange={(itemValue) => setUrgency(itemValue as TaskUrgency)}
                style={styles.picker}
              >
                <Picker.Item label="Low" value="low" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="High" value="high" />
              </Picker>
            </View>

            <Text style={styles.label}>Due Date (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., YYYY-MM-DD"
              value={dueDate}
              onChangeText={setDueDate}
            />
            {/* Consider adding a DateTimePicker here for better UX */}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveTask}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primaryBackground,
    paddingTop: Platform.OS === 'android' ? theme.spacing.large : theme.spacing.small,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: theme.spacing.xlarge,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.body,
  },
  headerTitle: {
    fontFamily: theme.fonts.title,
    fontSize: theme.fontSizes.xlarge,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginVertical: theme.spacing.medium,
  },
  listContentContainer: {
    paddingBottom: 80, // Ensure FAB doesn't overlap last item
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
  },
  emptyText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.large,
    bottom: theme.spacing.large,
    backgroundColor: theme.colors.accentRed,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.SHADOWS.medium,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 15,
    padding: theme.spacing.large,
    width: '90%',
    maxHeight: '85%',
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
  label: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.small,
    marginTop: theme.spacing.medium,
  },
  input: {
    fontFamily: theme.fonts.body,
    backgroundColor: theme.colors.white, // Or a very light shade from theme
    borderColor: theme.colors.cardBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: theme.spacing.medium,
    fontSize: theme.fontSizes.regular,
    marginBottom: theme.spacing.medium,
    color: theme.colors.textParagraph,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderColor: theme.colors.cardBorder,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: theme.spacing.medium,
    backgroundColor: theme.colors.white,
  },
  picker: {
    color: Platform.OS === 'ios' ? theme.colors.textParagraph : undefined,
    fontFamily: theme.fonts.body, // This might not apply on all platforms for Picker items
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.large,
  },
  modalButton: {
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
    ...theme.SHADOWS.light,
  },
  modalButtonText: {
    fontFamily: theme.fonts.body,
    color: theme.colors.textOnPrimaryButton,
    fontSize: theme.fontSizes.regular,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: theme.colors.buttonPrimary,
  },
  cancelButton: {
    backgroundColor: theme.colors.gray,
  },
});
