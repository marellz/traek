<template>
  <router-link :to="{ name: 'task', params: { id: task.id } }">
    <div class="rounded-lg border border-slate-300 hover:bg-slate-600/10 dark:border-slate-800 p-4" :class="{ '!border-red-500 dark:!border-red-400 bg-red-50 dark:bg-red-500/10': isOverdue }">
      <!-- header -->

      <div class="flex space-x-3">
        <div v-if="dueDate.length" class="rounded-lg bg-primary/20 p-3 self-start text-center">
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
            <span>|</span>
            <div>
              <span>
                {{ TaskPriorityLabels[task.priority as TaskPriority] }}
              </span>
            </div>
            <div class="ml-auto flex items-center space-x-2">
              <template v-if="isOverdue">
                <span class="bg-red-500 text-white rounded-full px-2 text-sm font-medium py-0.5">Overdue</span>
              </template>
              <base-tag :variant="`task.${task.status}`">
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
          <div>
            <span class="inline-flex items-center space-x-1">
              <User2 :size="20" :stroke-width="1.5" />
              <span class="text-sm">{{ task.task_assignees.length }} assignee{{ task.task_assignees.length !== 1 ? 's' :
                '' }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts" setup>
import {
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '@/stores/task'
import { TaskPriorityLabels, TaskStatusLabels } from '@/data/task-data'
import { computed } from 'vue'
import moment from 'moment';
import { EllipsisVertical, User2 } from 'lucide-vue-next';

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
