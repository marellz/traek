<template>
  <layout-container>

    <base-loader v-if="loading.getting"></base-loader>
    <template v-else-if="task">
      <div class="mt-6">
        <base-link v-if="task" :to="{
          name: 'project-tasks',
          params: { id: task.project_id }
        }">
          <ArrowLeft :size="20" />
          <span>Project tasks</span>
        </base-link>
      </div>

      <div class="space-y-4 mt-6">
        <div class="flex items-center space-x-4">
          <h1 class="font-bold text-4xl">{{ task.title }}</h1>
          <span v-if="isOverdue" class="text-red-500 bg-red-500/10 rounded-lg px-2 py-1 flex items-center space-x-2">
            <p class="font-medium">Overdue</p>
            <AlertCircle />
          </span>
        </div>
        <div class="flex space-x-2 items-center">
          <p class="inline-block px-2 py-0.5 rounded-full font-medium dark:bg-slate-800 text-sm"
            :class="TaskPriorityColors[task.priority as TaskPriority]">
            {{ TaskPriorityLabels[task.priority as TaskPriority] }}
          </p>
          <base-tag :class="TaskStatusColors[task.status]">{{ TaskStatusLabels[task.status] }}</base-tag>
        </div>
        <div class="flex space-x-3 p-4 border rounded-xl border-slate-200">
          <Calendar :size="24" :stroke-width="1.5"></Calendar>
          <div class="space-y-1 text-sm text-slate-500">
            <p>
              {{ task.updated_at ? 'Updated at' : 'Created on' }} {{ parseDate(task.updated_at ?? task.created_at, 'Do MMM YYYY, h:mm A') }}
            </p>
            <template v-if="task.start_date">
              <p>Started on {{ parseDate(task.start_date, 'Do MMM YYYY, h:mm A') }} </p>
              <p v-if="task.end_date">Completed on {{ parseDate(task.end_date, 'Do MMM YYYY, h:mm A') }}</p>
              <p v-else>in progress...</p>
            </template>
            <p v-if="task.due_date && inComplete" :class="{ 'text-red-500 font-medium': isOverdue }">
              Due on {{ parseDate(task.due_date, 'Do MMM YYYY, h:mm A') }}
            </p>
          </div>
          <div v-if="task.created_by.id === auth.userId" class="ml-auto flex items-center space-x-2">
            <task-status-switch v-model="task.status" @switch="updateTaskStatus"></task-status-switch>
            <base-action class="!border-amber-600 !text-amber-600" @click="editTask">
              <span>
                Edit task
              </span>
            </base-action>
            <base-action class="!border-red-500 !text-red-500" confirm @confirm="deleteTask">
              <span>
                Delete task
              </span>
            </base-action>
          </div>
        </div>

        <div>
          <p class="font-medium text-sm text-slate-500 mb-2">Description</p>
          <p>{{ task.description ?? 'No description' }}</p>
        </div>

        <div>
          <p class="font-medium text-sm text-slate-500 mb-2">Created by</p>
          <div class="flex space-x-2 items-center">
            <user-avatar size="h-10 w-10" :avatar="task.created_by.avatar"></user-avatar>
            <span class="font-medium">
              {{ task.created_by.name }} {{ task.created_by.id === auth.userId ? `(you)` : '' }}
            </span>
            <span>/</span>
            <span class="flex items-center space-x-1 text-slate-600">
              <Mail :size="16" /> <span>{{ task.created_by.email }}</span>
            </span>
          </div>
        </div>
        <div>
          <p class="font-medium text-sm text-slate-500 mb-2">Assigned to</p>
          <p v-if="!task.task_assignees.length" class="italic">No assignees</p>
          <div v-else class="space-y-2">
            <div v-for="user in task.task_assignees" :key="user.id" class="flex space-x-2 items-center">
              <user-avatar size="h-10 w-10" :avatar="user.avatar"></user-avatar>
              <span class="font-medium">
                {{ user.name }} {{ user.id === auth.userId ? `(you)` : '' }}
              </span>
              <span>/</span>
              <span class="flex items-center space-x-1 text-slate-600">
                <Mail :size="16" /> <span>{{ user.email }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </layout-container>
</template>
<script lang="ts" setup>
import UserAvatar from '@/components/user/avatar.vue'
import { useAuthStore } from '@/stores/auth';
import { TaskLoading, useTaskStore, type Task, type TaskPriority, type TaskStatus } from '@/stores/task';
import { AlertCircle, ArrowLeft, Calendar } from 'lucide-vue-next';
import moment from 'moment';
import { computed, onMounted, ref, watch } from 'vue';
import { Mail } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router';
import { TaskPriorityColors, TaskPriorityLabels, TaskStatusColors, TaskStatusLabels } from '@/data/task-data';
import TaskStatusSwitch from '@/components/task/status-switch.vue'
import { parseDate } from '@/utils/parseDate';

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)
const auth = useAuthStore()
const task = ref<Task>()
const taskStore = useTaskStore()

const getTask = async () => {
  const _item = await taskStore.get(id.value)
  if (_item) {
    task.value = _item
  }
}

watch(id, getTask)

const loading = computed(() => ({
  getting: taskStore.isLoading(TaskLoading.GETTING_ONE)
}))

const inComplete = computed(() => task.value && task.value.status !== 'completed')

const isOverdue = computed(() => {
  if (!(task.value && task.value.due_date)) return false
  return moment(task.value.due_date).isAfter(moment()) && inComplete.value
})

const editTask = async () => {
  if (!task.value?.id) {
    return
  }
}
const deleteTask = async () => {
  if (!task.value?.id) {
    return
  }

  const success = await taskStore.destroy(task.value.id)
  if (success) {
    router.push({
      name: 'project-tasks',
      params: { id: task.value.project_id }
    })
  }
}

const updateTaskStatus = async (status: TaskStatus) => {
  const success = await taskStore.updateStatus(id.value, status)
  if(success && task.value){
    task.value = {...task.value, ...success}
  }
}

onMounted(() => {
  getTask()
})

</script>
