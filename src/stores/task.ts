import type { Models } from 'appwrite'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import { useErrorStore } from './errors'
import { useTaskService } from '@/services/tasks'
import type { Project } from './project'
import { useLoadingState } from '@/composables/useLoading'
import { useAuthStore } from './auth'

export interface Task extends Models.Document {
  title: string
  description?: string | null
  creator: string
  project: Project
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export type TaskPriority = 'high' | 'medium' | 'low'

export interface TaskForm {
  title: string
  description?: string | null
  creator: string
  project: string
  status: TaskStatus
  priority: TaskPriority
}

export const useTaskStore = defineStore(
  'project_tasks',
  () => {
    const tasks = ref<Task[]>([])
    const service = useTaskService()
    const { handleError } = useErrorStore()
    const { begin, finish } = useLoadingState()
    const auth = useAuthStore()

    const list = async (project: string) => {
      begin('list-tasks')
      try {
        const { documents } = await service.list(project)
        if (documents) {
          tasks.value = documents as Task[]
        }
      } catch (error) {
        handleError('Getting tasks', error)
      } finally {
        finish('list-tasks')
      }
    }

    const get = async (id: string) => {
      try {
        const response = await service.get(id)
        if (response) {
          return response
        }

        return null
      } catch (error) {
        handleError('Getting task', error)
      } finally {
      }
    }

    const create = async (form: Omit<TaskForm, "creator">) => {
      if (!auth.user) {
        handleError('Forbidden', 'Action not authorized')
        return
      }
      begin('create-task')
      try {
        const response = await service.create({ ...form, creator: auth.user.$id })
        if (response) {
          return response
        }

        return null
      } catch (error) {
        handleError('Creating task', error)
      } finally {
        finish('create-task')
      }
    }

    const update = async (id: string, form: TaskForm) => {
      try {
        const response = await service.update(id, form)
        if (response) {
          return true
        }

        return false
      } catch (error) {
        handleError('Updating task', error)
      } finally {
      }
    }

    const destroy = async (id: string) => {
      try {
        const response = await service.destroy(id)

        if (response) {
          return true
        }

        return false
      } catch (error) {
        handleError('Deleting task', error)
      } finally {
      }
    }

    return {
      tasks,
      list,
      get,
      create,
      update,
      destroy,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTaskStore, import.meta.hot))
}
