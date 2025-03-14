import { TaskStatusEnum, TaskPriorityEnum, type TaskPriority, type TaskStatus } from '@/stores/task'
import { CircleDashed, Check, CirclePause } from 'lucide-vue-next'
import type { Component } from 'vue'
export const TaskStatusLabels: Record<TaskStatus, string> = {
  [TaskStatusEnum.PENDING]: 'Pending',
  [TaskStatusEnum.IN_PROGRESS]: 'In progress',
  [TaskStatusEnum.COMPLETED]: 'Completed',
}

export const TaskStatusIcons: Record<TaskStatus, Component> = {
  [TaskStatusEnum.PENDING]: CirclePause,
  [TaskStatusEnum.IN_PROGRESS]: CircleDashed,
  [TaskStatusEnum.COMPLETED]: Check,
}

export const TaskStatusColors: Record<TaskStatus, string> = {
  [TaskStatusEnum.PENDING]: 'bg-amber-500 text-white !border-amber-500',
  [TaskStatusEnum.IN_PROGRESS]: 'text-white bg-blue-500 !border-blue-500',
  [TaskStatusEnum.COMPLETED]: 'bg-green-500 text-white border-green-500',
}

export const TaskPriorityLabels: Record<TaskPriority, string> = {
  [TaskPriorityEnum.HIGH]: 'High priority',
  [TaskPriorityEnum.MEDIUM]: 'Medium priority',
  [TaskPriorityEnum.LOW]: 'Low priority',
}

export const TaskPriorityColors: Record<TaskPriority, string> = {
  [TaskPriorityEnum.HIGH]: 'text-red-500 bg-red-50',
  [TaskPriorityEnum.MEDIUM]: 'text-amber-600 bg-amber-100',
  [TaskPriorityEnum.LOW]: 'text-blue-500 bg-blue-100',
}
