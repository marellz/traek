<template>
  <div class="flex rounded-lg border border-slate-300 p-4">
    <div>
      <h1 class="font-medium">
        {{ task.title }}
      </h1>
      <p v-if="task.description">{{ task.description }}</p>
    </div>
    <div class="ml-auto flex items-center space-x-2">
      <button
        type="button"
        class="rounded border border-slate-300 px-4 py-1 font-medium hover:border-black"
        @click="editTask"
      >
        <span>Edit</span>
      </button>
      <button
        type="button"
        class="rounded border border-slate-300 px-4 py-1 font-medium hover:border-black"
        @click="deleteTask"
      >
        <span>Delete</span>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Task } from '@/stores/task'

const props = defineProps<{
  task: Task
}>()
const emit = defineEmits(['delete-task', 'edit-task'])
const deleteTask = () => {
  emit('delete-task', props.task.id)
}
const editTask = () => {
  emit('edit-task', props.task.id)
}
</script>
