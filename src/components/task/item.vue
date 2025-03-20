<template>
  <router-link :to="{ name: 'task', params: { id: task.id } }">
    <div class="rounded-lg border border-slate-300 hover:bg-slate-600/10 dark:border-slate-800 p-4"
      :class="{ '!border-red-500 dark:!border-red-400 bg-red-50 dark:bg-red-500/10': isOverdue, 'bg-slate-200 dark:bg-slate-700': isComplete }">
      <!-- header -->

      <div class="flex space-x-3">
        <div v-if="dueDate.length" class="rounded-lg bg-primary/20 p-3 self-start text-center" :class="{'!bg-slate-500/20': isComplete}">
          <h1 class="text-4xl font-bold">
            {{ dueDate[0] }}
          </h1>
          <p>
            {{ dueDate[1] }}
          </p>
        </div>
        <div class="flex-auto space-y-1.5">
          <div class="flex items-center space-x-2">
            <h1 class="font-medium text-xl">
              {{ task.title }}
            </h1>
            <div class="ml-auto flex items-center space-x-2">
              <template v-if="isOverdue">
                <span class="bg-red-500 text-white rounded-full px-2 text-sm font-medium py-0.5">Overdue</span>
              </template>
              <span class="font-medium rounded-full py-0.5 text-sm px-2"
                :class="TaskPriorityColors[task.priority as TaskPriority]">
                {{ TaskPriorityLabels[task.priority as TaskPriority] }}
              </span>
              <base-tag :class="TaskStatusColors[task.status]">
                <span>
                  {{ TaskStatusLabels[task.status as TaskStatus] }}
                </span>
              </base-tag>

              <dropdown trigger-class="!border-transparent p-1 hover:bg-slate-200 rounded">
                <template #trigger>
                  <span>
                    <EllipsisVertical :size="16" />
                  </span>
                </template>
                <dropdown-item @click="editTask">Edit task</dropdown-item>
                <dropdown-item @click="deleteTask">Delete task</dropdown-item>
              </dropdown>
            </div>
          </div>
          <p v-if="task.description" class="text-sm text-slate-600">{{ task.description }}</p>
          <div class="flex space-x-2 mt-4">
            <div v-for="assignee in task.task_assignees" :key="assignee.id">
              <base-popover popover-class="whitespace-nowrap" :text="assignee.name ?? `email: ${assignee.email}`">
                <user-avatar size="h-8 w-8" :avatar="assignee.avatar"></user-avatar>
              </base-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts" setup>
import UserAvatar from '@/components/user/avatar.vue'
import {
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '@/stores/task'
import { TaskPriorityColors, TaskPriorityLabels, TaskStatusColors, TaskStatusLabels } from '@/data/task-data'
import { computed } from 'vue'
import moment from 'moment';
import { EllipsisVertical } from 'lucide-vue-next';

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits(['delete-task', 'edit-task'])

const dueDate = computed(() => {
  if (!props.task.due_date) return []
  return moment(props.task.due_date).format('DD MMM').split(' ')
})

const isComplete = computed(() => props.task.status === 'completed')

const isOverdue = computed(() => {
  if (!props.task.due_date) return false
  return moment(props.task.due_date).isBefore(moment(), 'date') && !isComplete.value
})

const deleteTask = () => {
  emit('delete-task', props.task.id)
}

const editTask = () => {
  emit('edit-task', props.task.id)
}

</script>
