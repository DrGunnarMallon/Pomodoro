// types/task.types.ts
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskUrgency = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  urgency: TaskUrgency;
  dueDate?: string; // ISO string or a simple date string
  createdAt: string; // ISO string
}
