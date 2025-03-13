import type { TaskPriority, TaskStatus } from '@/stores/task'
import { CircleDashed, Check, CirclePause } from 'lucide-vue-next'
import type { Component } from 'vue'

export const TaskStatusLabels: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  completed: 'Completed',
}

export const TaskStatusIcons: Record<TaskStatus, Component> = {
  pending: CirclePause,
  in_progress: CircleDashed,
  completed: Check,
}

export const TaskStatusColors: Record<TaskStatus, string> = {
  pending: 'bg-amber-100 text-amber-600',
  in_progress: 'bg-blue-100 bg-blue-500',
  completed: 'bg-green-100 text-green-500',
}

export const TaskPriorityLabels: Record<TaskPriority, string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
}

export const TaskPriorityColors: Record<TaskPriority, string> = {
  high: 'text-red-500 bg-red-50',
  medium: 'text-amber-600 bg-amber-100',
  low: 'text-blue-500 bg-blue-100',
}
