<template>
  <div>
    <div class="mt-10">
      <div class="flex items-center space-x-2">
        <h1 class="text-4xl font-light">Project tasks</h1>
        <base-button class="!ml-auto" @click="showCreateTaskModal = true">
          <span>Create task</span>
        </base-button>
        <base-button variant="secondary-outline" @click="getTasks">
          <span>Refresh</span></base-button
        >
        <base-button variant="secondary-outline" @click="testPost">
          <span>Test post</span></base-button
        >
      </div>
      <base-loader v-if="loading.includes('list-tasks')"></base-loader>
      <template v-else>
        <ul class="mt-10 space-y-2">
          <li v-for="task in tasks" :key="task.$id">
            <task-item :task />
          </li>
        </ul>
      </template>
      <base-modal title="Create new task" v-model:show="showCreateTaskModal">
        <task-form @submit="createTask"></task-form>
      </base-modal>
    </div>
  </div>
</template>
<script lang="ts" setup>
import TaskItem from '@/components/task/item.vue'
import TaskForm from '@/components/object-forms/task.vue'
// import { type Project } from '@/stores/project'
import { useTaskStore, type TaskForm as TaskFormType } from '@/stores/task'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useLoadingState } from '@/composables/useLoading'

const route = useRoute()
const id = computed(() => route.params.id as string)
// const projectStore = useProjectStore()
const tasksStore = useTaskStore()
const loadingState = useLoadingState()
const loading = computed(() => loadingState.loading.value)
// const project = ref<Project | null>(null)
const tasks = computed(() => tasksStore.tasks)
const showCreateTaskModal = ref(false)

const createTask = async (form: TaskFormType) => {
  form.project = id.value
  const success = await tasksStore.create(form)
  if (success) {
  }
}
const getTasks = async () => {
  await tasksStore.list(id.value)
}

const testPost = async () => {
  const form : Omit<TaskFormType, 'creator'> = {
    title: 'Test task',
    description: 'This is meant to test the current setup',
    status: 'in_progress',
    priority: 'high',
    project: id.value,
  }

  await tasksStore.create(form)
}

onMounted(async () => {
  await getTasks()
})
</script>
