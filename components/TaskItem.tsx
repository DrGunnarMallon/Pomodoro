// components/TaskItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Task } from '@/types/task.types';
import { theme } from '@/styles/theme'; // Import the theme

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  const getUrgencyColor = () => {
    switch (task.urgency) {
      case 'high':
        return theme.colors.urgencyHigh;
      case 'medium':
        return theme.colors.urgencyMedium;
      case 'low':
        return theme.colors.urgencyLow;
      default:
        return theme.colors.gray;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{task.title}</Text>
        {task.description && <Text style={styles.description}>{task.description}</Text>}
        <View style={styles.detailsRow}>
          <Text style={styles.status}>Status: {task.status}</Text>
          <Text style={[styles.urgency, { color: getUrgencyColor() }]}>
            Urgency: {task.urgency.charAt(0).toUpperCase() + task.urgency.slice(1)}
          </Text>
        </View>
        {task.dueDate && <Text style={styles.dueDate}>Due: {task.dueDate}</Text>}
        <Text style={styles.createdAt}>Created: {new Date(task.createdAt).toLocaleDateString()}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => onEdit(task)} style={styles.actionButton}>
          <FontAwesome name="pencil" size={20} color={theme.colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.actionButton}>
          <FontAwesome name="trash" size={20} color={theme.colors.accentRed} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.medium,
    marginVertical: theme.spacing.small,
    marginHorizontal: theme.spacing.medium,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.SHADOWS.light,
    // Consider a dynamic borderLeftColor based on urgency in the component's direct style prop
    // For example: style={[styles.container, { borderLeftColor: getUrgencyColor() }]}
    // Default border shown here:
    borderLeftWidth: 5,
    borderLeftColor: theme.colors.lightGray, // Default or a neutral color
  },
  infoContainer: {
    flex: 1,
    marginRight: theme.spacing.small, // Ensure space before action buttons
  },
  title: {
    fontFamily: theme.fonts.title,
    fontSize: theme.fontSizes.medium, // Using medium for item title
    fontWeight: 'bold', // SpaceMono might ignore this, check appearance
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xsmall,
  },
  description: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.small,
    color: theme.colors.textParagraph,
    marginBottom: theme.spacing.small,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center', // Align items in the row
    flexWrap: 'wrap', // Allow wrapping if content is too long
    marginBottom: theme.spacing.xsmall,
  },
  status: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.xsmall,
    color: theme.colors.gray,
    fontStyle: 'italic',
    marginRight: theme.spacing.medium, // Space between status and urgency
  },
  urgency: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.xsmall,
    fontWeight: 'bold',
    // Color is applied inline via getUrgencyColor() in the Text component
  },
  dueDate: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.xsmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xsmall, // Add some top margin if description is short or absent
  },
  createdAt: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes.xsmall,
    color: theme.colors.gray,
    marginTop: theme.spacing.xsmall,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: theme.spacing.medium, // Space between buttons if multiple, or from info container
    padding: theme.spacing.xsmall,
  },
});
