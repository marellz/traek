<template>
  <div class="rounded-lg border border-slate-300 p-4">
    <!-- header -->

    <div class="flex">
      <div class="flex-auto">
        <div class="flex items-center space-x-2">
          <h1 class="font-medium">
            {{ task.title }}
          </h1>
          <span> | </span>
          <span class="text-sm">{{ TaskPriorityLabels[task.priority as TaskPriority] }}</span>
          <span> | </span>
          <span class="text-sm">{{ TaskStatusLabels[task.status as TaskStatus] }}</span>
        </div>
        <p v-if="task.description" class="text-sm text-slate-600">{{ task.description }}</p>
      </div>
      <div class="ml-auto flex items-center space-x-2">
        <button
          type="button"
          class="rounded border border-slate-300 px-4 py-1 font-medium hover:border-black"
          @click="toggleShowMore"
        >
          <span v-if="isShowingMore">Hide</span>
          <span v-else>More</span>
        </button>
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

    <template v-if="isShowingMore && info">
      <div>
        <div class="mt-4 flex space-x-4 border-t border-t-slate-300 py-4">
          <div>
            <h1 class="text-sm font-medium">Created by</h1>
            <p>{{ info.created_by.name }}</p>
          </div>
          <span class="border-l border-slate-300" />
          <div>
            <h1 class="text-sm font-medium">Assigned to</h1>
            <div>
              <template v-if="info.task_assignees.length">
                <p v-for="user in info.task_assignees" :key="user.id">
                  {{ user.name ?? user.email }}
                </p>
              </template>
              <p v-else class="italic">No assignees</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import {
  useTaskStore,
  type Task,
  type TaskInfo,
  type TaskPriority,
  type TaskStatus,
} from '@/stores/task'
import { TaskPriorityLabels, TaskStatusLabels } from '@/data/task-data'
import { ref } from 'vue'

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

const isShowingMore = ref(false)
const taskStore = useTaskStore()
const info = ref<TaskInfo>()
const toggleShowMore = () => {
  if (isShowingMore.value) {
    isShowingMore.value = false
  } else {
    showMore()
  }
}

const showMore = async () => {
  const _t = await taskStore.getTaskInfo(props.task.id)
  if (_t) {
    isShowingMore.value = true
    info.value = _t
  }
}
</script>
