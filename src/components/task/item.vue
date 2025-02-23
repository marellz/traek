<template>
  <div class="flex rounded-lg border border-slate-300 p-4">
    <div>
      <h1 class="font-medium">
        {{ task.title }}
      </h1>
      <p v-if="task.description">{{ task.description }}</p>
    </div>
    <div class="ml-auto flex space-x-2 items-center">
      <button
        type="button"
        class="rounded border border-slate-300 px-4 py-1 font-medium hover:border-black"
      >
        <span>Edit</span>
      </button>
      <button
        type="button"
        class="rounded border border-slate-300 px-4 py-1 font-medium hover:border-black"
      >
        <span>Delete</span>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Task } from '@/stores/task'

defineProps<{
  task: Task
}>()
</script>
