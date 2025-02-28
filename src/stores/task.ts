import { acceptHMRUpdate, defineStore } from 'pinia'
import { useErrorStore } from './errors'
import { useTaskService } from '@/services/tasks'
import { useLoadingState } from '@/composables/useLoading'
import { useAuthStore } from './auth'

export enum TASK_LOADING {
  CREATING = 'creating-task',
  UPDATING = 'updating-task',
  DELETING = 'deleting-task',
  GETTING_ONE = 'getting-task',
  GETTING_ALL = 'getting-tasks',
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  project_id: string
  title: string
  description: string | null
  priority: string
  status: string
  created_by: string
  created_at: string
  due_date?: string | null
  end_date?: string | null
  start_date?: string | null
  updated_at?: string | null
  closed_at?: string | null
}

export interface TaskForm {
  id?: string
  project_id: string
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  created_by: string
  created_at?: string
  due_date?: string
  start_date?: string
  end_date?: string
  updated_at?: string
  closed_at?: string
}

export const useTaskStore = defineStore(
  'project_tasks',
  () => {
    const service = useTaskService()
    const { handleError } = useErrorStore()
    const { begin, finish, isLoading } = useLoadingState()
    const auth = useAuthStore()

    const list = async (project: string) => {
      begin(TASK_LOADING.GETTING_ALL)

      try {
        const { error, data } = await service.getProjectTasks(project)
        if (error) {
          handleError('Getting tasks', error.message)
        }

        if (data) {
          return data
        }
        return null
      } catch (error) {
        handleError('Getting tasks', error)
      } finally {
        finish(TASK_LOADING.GETTING_ALL)
      }
    }

    const get = async (id: string) => {
      begin(TASK_LOADING.GETTING_ONE)
      try {
        const { data, error } = await service.get(id)
        if (error) {
          handleError('Getting task', error.message)
        }

        if (data && data.length) {
          return data[0]
        }

        return null
      } catch (error) {
        handleError('Getting task', error)
      } finally {
        finish(TASK_LOADING.GETTING_ONE)
      }
    }

    const create = async (form: Omit<TaskForm, 'created_by'>) => {
      begin(TASK_LOADING.CREATING)
      if (!auth.userId) {
        handleError('Forbidden', 'Action not authorized')
        return
      }
      try {
        const { data, error } = await service.create({ ...form, created_by: auth.userId })
        if (error) {
          handleError('Getting tasks', error.message)
        }
        if (data && data.length) {
          return data[0]
        }

        return null
      } catch (error) {
        handleError('Creating task', error)
      } finally {
        finish(TASK_LOADING.CREATING)
      }
    }

    const update = async (id: string, form: TaskForm) => {
      begin(TASK_LOADING.UPDATING)
      try {
        const { status, error } = await service.update(id, form)

        if (error) {
          handleError('Updating task', error)
        }

        if (status === 204) {
          return true
        }

        return false
      } catch (error) {
        handleError('Updating task', error)
      } finally {
        finish(TASK_LOADING.UPDATING)
      }
    }

    const destroy = async (id: string) => {
      begin(TASK_LOADING.DELETING)
      try {
        const { status, error } = await service.destroy(id)

        if (error) {
          handleError('Deleting task', error.message)
        }
        if (status === 204) {
          return true
        }

        return false
      } catch (error) {
        handleError('Deleting task', error)
      } finally {
        finish(TASK_LOADING.DELETING)
      }
    }

    return {
      // tasks,
      list,
      get,
      create,
      update,
      destroy,
      isLoading,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTaskStore, import.meta.hot))
}
