<template>
  <RouterLink :to="{ name: 'task', params: { id: task.id } }" class="block">
    <div class="border border-slate-300 rounded-xl hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
      <div class="p-4">
        <div class="flex mb-2">
          <span class="font-medium text-sm rounded-full px-2"
            :class="TaskPriorityColors[task.priority as TaskPriority]">{{ TaskPriorityLabels[task.priority as
            TaskPriority] }}</span>
        </div>
        <h1 class="font-medium text-xl">
          {{ task.title }}
        </h1>
        <p v-if="task.description" class="line-clamp-3 text-slate-800 dark:text-slate-400 mt-1 text-sm">
          {{ task.description }}
        </p>
      </div>
      <div class="space-y-2 border-t border-inherit p-4">
        <div class="flex space-x-2 items-center">
          <FolderKanban :size="20" />
          <p class="text-sm">{{ task.project.name }}</p>
        </div>
        <div class="flex space-x-2 items-center text-slate-600 dark:text-slate-500 text-sm"
          :class="{ '!text-red-500': isOverdue }">
          <template v-if="isCompleted && task.end_date">
            <CalendarCheck :size="20" />
            <p>
              {{ moment(task.end_date).format('Do MMMM YYYY, h:mm A') }}
            </p>
          </template>
          <template v-else-if="!isCompleted">
            <Calendar :size="20" />
            <p>
              Due {{ dueDate }}
            </p>
          </template>
        </div>
        <div class="flex space-x-2 items-center text-slate-600 dark:text-slate-500">
          <Users :size="20" />
          <p class="text-sm">{{new Set(task.assignees.map(t => t.email)).size}} assignees</p>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
<script lang="ts" setup>
import { TaskPriorityColors, TaskPriorityLabels } from '@/data/task-data';
import type { TaskPriority } from '@/stores/task';
import type { AssignedTask } from '@/views/tasks/index.vue';
import { Calendar, CalendarCheck, FolderKanban, Users } from 'lucide-vue-next';

import moment from 'moment';
import { computed } from 'vue';

const props = defineProps<{
  task: AssignedTask
}>()

const isCompleted = computed(() => props.task.status === 'completed')

const isOverdue = computed(() => {
  return moment().isAfter(moment(props.task.due_date)) && !isCompleted.value
})

const dueDate = computed(() => {
  const dd = moment(props.task.due_date)
  const now = moment()
  const diff = moment.duration(dd.diff(now)).humanize()
  if(now.isBefore(dd)) return `in ${diff}`
  return `${diff} ago`

})
</script>
