<template>
  <div>
    <div class="flex items-center space-x-2">
      <h1 class="text-4xl font-light">Project tasks</h1>
      <div class="flex items-center !ml-auto space-x-2">
        <router-link :to="{
          name: 'create-task', params: {
            project: id
          }
        }">
          <base-button>
            <span>Create task</span>
          </base-button>
        </router-link>
        <base-button variant="secondary-outline" @click="getTasks" :loading="loading.gettingTasks">
          <span>Refresh</span>
        </base-button>
      </div>
    </div>
    <base-loader class="py-20" v-if="loading.gettingTasks"></base-loader>
    <template v-else-if="tasks.length">
      <div class="mt-10">
        <checkbox label="Show completed" v-model="showCompleted" />
      </div>
      <ul class="mt-10 space-y-2">
        <li v-for="task in filteredTasks" :key="task.id">
          <task-item :task @delete-task="deleteTask" @edit-task="editTask" />
        </li>
      </ul>
    </template>
    <Empty v-else class="mt-10"></Empty>
  </div>
</template>
<script lang="ts" setup>
import checkbox from '@/components/form/checkbox.vue'
import Empty from '@/components/common/empty.vue'
import TaskItem from '@/components/task/item.vue'
import { TaskStatusEnum, useTaskStore, type Task } from '@/stores/task'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const id = computed(() => route.params.id as string)
const tasksStore = useTaskStore()
const tasks = ref<Task[]>([])
const showCompleted = ref(false)
const filteredTasks = computed(() => showCompleted.value? tasks.value : tasks.value.filter(t=>t.status !== TaskStatusEnum.COMPLETED))

const loading = computed(() => ({
  gettingTasks: tasksStore.isLoading('getting-tasks'),
}))

const getTasks = async () => {
  const _tasks = await tasksStore.list(id.value)
  if (_tasks) {
    tasks.value = _tasks
  }
}

const deleteTask = async (id: string) => {
  const success = await tasksStore.destroy(id)
  if (success) {
    const _tasks = tasks.value.filter((t) => t.id !== id)
    tasks.value = _tasks
  }
}

const router = useRouter()
const editTask = (id: string) => {
  router.push({
    name: "edit-task",
    params: {
      id,
    }
  })
}


onMounted(async () => {
  await getTasks()
})
</script>
