import { acceptHMRUpdate, defineStore } from 'pinia'
import { useErrorStore } from './errors'
import { useTaskService } from '@/services/tasks'
import { useLoadingState } from '@/composables/useLoading'
import { useAuthStore, type UserProfile } from './auth'
import { NotificationTypes, useNotificationStore } from './notifications'

export enum TaskLoading {
  CREATING = 'creating-task',
  UPDATING = 'updating-task',
  DELETING = 'deleting-task',
  GETTING_ONE = 'getting-task',
  GETTING_ALL = 'getting-tasks',
  GETTING_INFO = 'getting-task-info',
  ADDING_ASSIGNEES = 'adding-assignees',
  REMOVING_ASSIGNEE = 'removing assignee',
  GETTING_ASSIGNEES = 'getting-assignees',
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  project_id: string
  title: string
  description: string | null
  priority: string
  status: TaskStatus
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

export type TaskUser = Pick<UserProfile, 'id' | 'name' | 'username' | 'email' | 'avatar_url'>

export interface TaskInfo {
  created_by: TaskUser
  task_assignees: TaskUser[]
}

export const useTaskStore = defineStore(
  'project_tasks',
  () => {
    const service = useTaskService()
    const { handleError } = useErrorStore()
    const { begin, finish, isLoading } = useLoadingState()
    const auth = useAuthStore()
    const notificationStore = useNotificationStore()

    const list = async (project: string) => {
      begin(TaskLoading.GETTING_ALL)

      try {
        const { error, data } = await service.getProjectTasks(project)
        if (error) throw new Error(error.message)
        if (data) return data
        return null
      } catch (error) {
        handleError('Getting tasks', error)
      } finally {
        finish(TaskLoading.GETTING_ALL)
      }
    }

    const get = async (id: string) => {
      auth.ensureAuth()
      try {
        begin(TaskLoading.GETTING_ONE)
        const { data, error } = await service.get(id)
        if (error) throw new Error(error.message)

        if (data) return data[0]

        return null
      } catch (error) {
        handleError('Getting task', error)
      } finally {
        finish(TaskLoading.GETTING_ONE)
      }
    }

    const create = async (form: TaskForm, assignees: string[]) => {
      auth.ensureAuth()
      try {
        begin(TaskLoading.CREATING)
        const { data, error } = await service.create({ ...form, created_by: auth.userId! })
        if (error) throw new Error(error.message)
        if (data && data.length) {
          await addAssignees(data[0].id, assignees)
          return data[0]
        }

        return null
      } catch (error) {
        handleError('Creating task', error)
      } finally {
        finish(TaskLoading.CREATING)
      }
    }

    const update = async (id: string, form: TaskForm) => {
      auth.ensureAuth()
      try {
        begin(TaskLoading.UPDATING)
        const { status, error } = await service.update(id, form)

        if (error) throw new Error(error.message)

        return status === 204
      } catch (error) {
        handleError('Updating task', error)
      } finally {
        finish(TaskLoading.UPDATING)
      }
    }

    const updateStatus = async (id: string, status: TaskStatus) => {
      try {
        const { status: responseStatus, error } = await service.updateStatus(id, status)
        if (error) throw new Error(error.message)
        if (responseStatus === 204) {
          if (status === 'completed') {
            notifyComplete(id)
          } else {
            notifyStatusUpdate(id)
          }
          return true
        }

        return false
      } catch (error) {
        handleError('Updating status', error)
      }
    }

    const destroy = async (id: string) => {
      auth.ensureAuth()
      try {
        begin(TaskLoading.DELETING)
        const { status, error } = await service.destroy(id)

        if (error) throw new Error(error.message)
        return status === 204
      } catch (error) {
        handleError('Deleting task', error)
      } finally {
        finish(TaskLoading.DELETING)
      }
    }

    /**
     * ASSIGNEES
     */

    const addAssignees = async (task: string, assignees: string[]) => {
      try {
        begin(TaskLoading.ADDING_ASSIGNEES)
        const payload = assignees.map((user_id) => ({ task_id: task, user_id }))
        const { status, error } = await service.addAssignees(payload)
        if (error) throw new Error(error.message)
        if (status === 201) {
          notifyAssignees(assignees, task)
          return true
        }
        return true
      } catch (error) {
        handleError('Adding assignee', error)
      } finally {
        finish(TaskLoading.ADDING_ASSIGNEES)
      }
    }

    const getAssignees = async (task: string) => {
      try {
        begin(TaskLoading.GETTING_ASSIGNEES)
        const { data, error } = await service.getAssignees(task)
        if (error) throw new Error(error.message)
        if (data) return data
        return null
      } catch (error) {
        handleError('Getting assignees', error)
      } finally {
        finish(TaskLoading.GETTING_ASSIGNEES)
      }
    }

    const removeAssignee = async (task: string, userId: string) => {
      try {
        begin(TaskLoading.REMOVING_ASSIGNEE)
        const { status, error } = await service.removeAssignee(task, userId)
        if (error) throw new Error(error.message)
        return status === 204
      } catch (error) {
        handleError('Removing assignee', error)
      } finally {
        finish(TaskLoading.REMOVING_ASSIGNEE)
      }
    }

    /**
     * INFO
     */

    const getTaskInfo = async (task: string) => {
      try {
        begin(TaskLoading.GETTING_INFO)
        const { data, error } = await service.getTaskInfo(task)
        if (error) throw new Error(error.message)
        if (data) return data[0]
        return null
      } catch (error) {
        handleError('Getting task info', error)
      } finally {
        finish(TaskLoading.GETTING_INFO)
      }
    }

    /**
     * NOTIFICATIONS
     */

    const notifyAssignees = (users: string[] = [], task: string) => {
      notificationStore.create(NotificationTypes.TASK_ASSIGNED, task, users)
    }

    const notifyStatusUpdate = async (task: string) => {
      const _users = await getAssignees(task)
      if (_users) {
        const users = _users.map((u) => u.user_id)
        notificationStore.create(NotificationTypes.TASK_STATUS_UPDATE, task, users)
      }
    }

    const notifyComplete = async (task: string) => {
      const _users = await getAssignees(task)
      if (_users) {
        const users = _users.map((u) => u.user_id)
        notificationStore.create(NotificationTypes.TAST_COMPLETED, task, users)
      }
    }

    // todo: to be used later as hook
    const notifyOverdue = async (task: string) => {
      const _users = await getAssignees(task)
      if (_users) {
        const users = _users.map((u) => u.user_id)
        notificationStore.create(NotificationTypes.TASK_OVERDUE, task, users)
      }
    }

    return {
      // tasks,
      list,
      get,
      create,
      update,
      updateStatus,
      destroy,
      isLoading,

      //assignees
      addAssignees,
      getAssignees,
      removeAssignee,

      //info
      getTaskInfo,

      // notifications
      notifyOverdue,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTaskStore, import.meta.hot))
}
