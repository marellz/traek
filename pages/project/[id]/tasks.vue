<template>
  <div>
    <div class="flex items-center space-x-2">
      <h1 class="text-4xl font-light">Project tasks</h1>
      <base-button class="!ml-auto" @click="showCreateTaskModal = true">
        <span>Create task</span>
      </base-button>
      <base-button variant="secondary-outline" :disabled="loading.gettingTasks" @click="getTasks">
        <span>Refresh</span></base-button
      >
    </div>
    <base-loader v-if="loading.gettingTasks" class="py-20" />
    <template v-else>
      <div />
      <ul class="mt-10 space-y-2">
        <li v-for="task in tasks" :key="task.id">
          <task-item :task @delete-task="deleteTask" @edit-task="editTask" />
        </li>
      </ul>
    </template>
    <base-modal
      v-model:show="showCreateTaskModal"
      :title="edit ? `Edit task` : `Create new task`"
      @close="cancelTaskForm"
    >
      <task-form :edit :active="showCreateTaskModal" :project-id="id" @submit="createTask" />
    </base-modal>
  </div>
</template>
<script lang="ts" setup>
import TaskForm from '@/components/object-forms/task-form.vue'
import { useTaskStore, type Task, type TaskForm as TaskFormType } from '@/stores/task'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = computed(() => route.params.id as string)
const tasksStore = useTaskStore()
const tasks = ref<Task[]>([])
const edit = ref<string | null>(null)
const showCreateTaskModal = ref(false)

const loading = computed(() => ({
  gettingTasks: tasksStore.isLoading('getting-tasks'),
}))

const getTasks = async () => {
  const _tasks = await tasksStore.list(id.value)
  if (_tasks) {
    tasks.value = _tasks
  }
}

const createTask = async (form: TaskFormType, assignees: string[] = []) => {
  if (edit.value) {
    updateTask(edit.value, form)
    return
  }

  form.project_id = id.value
  const _task = await tasksStore.create(form, assignees)
  if (_task) {
    showCreateTaskModal.value = false
    tasks.value = [...tasks.value, _task]
  }
}

const deleteTask = async (id: string) => {
  const success = await tasksStore.destroy(id)
  if (success) {
    const _tasks = tasks.value.filter((t) => t.id !== id)
    tasks.value = _tasks
  }
}

const editTask = (id: string) => {
  edit.value = id
  showCreateTaskModal.value = true
}

const updateTask = async (id: string, form: TaskFormType) => {
  const _success = await tasksStore.update(id, form)
  if (!_success) {
    // todo: throw
    return
  }

  const _tasks = [...tasks.value]
  const _index = _tasks.findIndex((t) => t.id === id)
  if (_index !== -1) {
    _tasks[_index] = { ..._tasks[_index], ...form }
  }

  tasks.value = _tasks

  edit.value = null
  showCreateTaskModal.value = false
}

const cancelTaskForm = () => {
  edit.value = null
}

onMounted(async () => {
  await getTasks()
})
</script>
