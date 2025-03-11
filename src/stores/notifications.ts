import { useLoadingState } from '@/composables/useLoading'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useErrorStore } from './errors'
import { v4 } from 'uuid'
import { useRouter } from 'vue-router'

export type NotificationType =
  | 'project_member_added' // + _invited/_request
  | 'task_assigned'
  | 'task_status_update'
  | 'task_completed'
  | 'task_overdue'
  | 'event_invited'
  | 'event_upcoming'
  | 'event_cancelled'

export type NotificationAction = {
  path: string
  label: string
}

export interface Notification {
  id: string
  type: NotificationType
  // related
  related_project_id?: string | null
  related_task_id?: string | null
  related_event_id?: string | null

  sender: string
  recipient: string
  message: string

  created_at: string
  read_at: string | null
  actions: NotificationAction[]
}

/*
const useNotificationActions = (id: string) => {
  'project_member_added'
  'task_assigned'
  'task_status_update'
  'task_completed'
  'task_overdue'
  'event_invited'
  'event_upcoming'
  'event_cancelled'
}
*/

const notificationBuilder = (type: NotificationType, id: string) => {
  const router = useRouter()
  let actions: NotificationAction[] = [],
    message: string = ''
  switch (type) {
    case 'project_member_added':
      actions = [
        { label: 'View project', path: router.resolve({ name: 'project', params: { id } }).href },
      ]
      message = 'You have been assigned to <project> project'
      break

    case 'task_assigned':
      actions = [
        { label: 'View task', path: router.resolve({ name: 'task', params: { id } }).href },
      ]
      message = 'You have been assigned to task <task>'
      break

    case 'task_overdue':
      actions = [
        { label: 'View task', path: router.resolve({ name: 'task', params: { id } }).href },
      ]
      message = 'Task <task> is overdue'
      break

    case 'task_completed':
      actions = [
        { label: 'View task', path: router.resolve({ name: 'task', params: { id } }).href },
      ]
      message = 'Task <task> has been marked as completed'
      break

    case 'task_status_update':
      actions = [
        {
          label: 'View task',
          path: router.resolve({ name: 'task', params: { id } }).href,
        },
      ]
      message = 'Task status updated from <before> to <current>'
      break

    case 'event_invited':
      actions = [
        {
          label: 'View event',
          path: router.resolve({ name: 'event', params: { id } }).href,
        },
      ]
      message = "You've been invited to an event <event>"
      break

    case 'event_cancelled':
      actions = [
        {
          label: 'View event',
          path: router.resolve({ name: 'event', params: { id } }).href,
        },
      ]
      message = 'Event <event> has been cancelled'

      break

    case 'event_upcoming':
      actions = [
        {
          label: 'View event',
          path: router.resolve({ name: 'event', params: { id } }).href,
        },
      ]
      message = 'Event <event> is upcoming'
      break

    default:
      actions = []
      message = 'Unkown notification type'
      break
  }

  return {
    actions,
    message,
  }
}

export const useNotificationStore = defineStore(
  'notifications',
  () => {
    const { isLoading /*begin, finish */ } = useLoadingState()
    const auth = useAuthStore()
    const { handleError } = useErrorStore()

    const createNotification = (type: NotificationType, id: string, recipient: string) => {
      auth.ensureAuth()
      try {
        // const message = type
        // const actions = actions
        const { message, actions } = notificationBuilder(type, id)
        const _notification: Notification = {
          id: v4(),
          recipient,
          type,
          sender: auth.userId!,
          created_at: new Date().toISOString(),
          read_at: null,
          message,
          actions,
        }

        return _notification
      } catch (error) {
        handleError('Creating notification', error)
      }
    }

    return {
      isLoading,
      createNotification,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationStore, import.meta.hot))
}
