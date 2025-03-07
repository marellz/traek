import type { TaskPriority, TaskStatus } from "@/stores/task";

export const TaskStatusLabels : Record<TaskStatus, string> = {
  in_progress: 'In Progress',
  pending: 'Pending',
  completed: 'Completed',
}
export const TaskPriorityLabels : Record<TaskPriority, string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
}
