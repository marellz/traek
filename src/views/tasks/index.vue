<template>
  <layout-container class="py-10">
    <div class="space-y-4">
      <h1 class="text-4xl">My task board</h1>
      <div class="flex justify-end">
        <base-action @click="getTasks">
          <span>Refresh</span>
        </base-action>
      </div>
    </div>
    <base-loader v-if="loading.getting"></base-loader>
    <div v-else class="grid grid-cols-3 gap-4">
      <div v-for="({ tasks: items }, key) in tasks" :key class="h-full flex flex-col">
        <h1 class="font-bold mb-4">
          {{ TaskStatusLabels[key] }}
        </h1>
        <PerfectScrollbar v-if="items.length" class="h-full flex-auto max-h-[70vh] p-2 pr-5 rounded-xl">
          <div class="space-y-4">
            <TaskKanbanCard v-for="task in items" :task :key="task.id"></TaskKanbanCard>
          </div>
        </PerfectScrollbar>
        <template v-else>
          <div class="rounded-xl p-4">
            <h1 class="text-xl font-medium">Empty</h1>
            <p class=" text-slate-600">
              No tasks in "{{ TaskStatusLabels[key] }}" board
            </p>
          </div>
        </template>
      </div>
    </div>
  </layout-container>
</template>
<script lang="ts" setup>
import TaskKanbanCard from '@/components/task/kanban-card.vue'
import { TaskStatusLabels } from '@/data/task-data';
import { useTaskStore, type Task, type TaskUser, type TaskStatus, TaskLoading } from '@/stores/task';
import { computed, onMounted, ref } from 'vue';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/style.css'

export type AssignedTask = Omit<Task, 'task_assignees' | 'created_by'> & {
  project: {
    id: string;
    name: string;
  },
  created_by: string,
  creator: TaskUser,
  assignees: TaskUser[]
}

type Kanban = Record<TaskStatus, {
  tasks: AssignedTask[]
}>

const tasks = ref<Kanban>()

const taskStore = useTaskStore()
const loading = computed(() => ({
  getting: taskStore.isLoading(TaskLoading.GETTING_USER_TASKS)
}))
const mapTasks = (items: AssignedTask[]) => {
  const columns = Object.keys(TaskStatusLabels)
  tasks.value = columns.reduce((acc: Kanban, status: TaskStatus) => {
    if (!acc[status]) {
      acc[status] = {
        tasks: []
      }
    }

    acc[status].tasks = items.filter(t => t.status === status)

    return acc
  }, {})
}

const getTasks = async () => {
  const _tasks = await taskStore.getUserTasks()
  if (_tasks) {
    mapTasks(_tasks)
  }
}

onMounted(() => {
  getTasks()
})
</script>
