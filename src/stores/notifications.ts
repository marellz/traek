import { useLoadingState } from '@/composables/useLoading'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useErrorStore } from '@/stores/errors'
import { useNotificationsService, useNotificationBuilder } from '@/services/notifications'
import { computed, ref } from 'vue'

export enum NotificationTypes {
  PROJECT_MEMBER_ADDED = 'project_member_added',
  TASK_ASSIGNED = 'task_assigned',
  TASK_STATUS_UPDATE = 'task_status_update',
  TAST_COMPLETED = 'task_completed',
  TASK_OVERDUE = 'task_overdue',
  EVENT_INVITED = 'event_invited',
  EVENT_UPCOMING = 'event_upcoming',
  EVENT_CANCELLED = 'event_cancelled',
}

export type NotificationType = NotificationTypes

export type NotificationAction = {
  path: {
    name: string
    params?: Record<string, string>
  }
  label: string
}

export interface Notification {
  id: string
  type: string
  related_project_id: { id: string; name: string } | null
  related_task_id: { id: string; title: string } | null
  related_event_id: { id: string; title: string } | null

  sender: string
  recipient: string
  message: string

  created_at: string
  read_at: string | null
  actions: any
}

export interface NotificationForm {
  id?: string
  type: string
  related_project_id: string | null
  related_task_id: string | null
  related_event_id: string | null

  sender: string
  recipient: string
  message: string

  created_at: string
  read_at?: string | null
  actions: any
}

export type NotificationItem = Omit<NotificationForm, 'actions' | 'type'> & {
  type: NotificationType
  actions: NotificationAction[]
}

export enum NotificationLoading {
  GETTING = 'getting-notification',
  CREATING = 'creating-notification',
  UPDATING = 'updating-notification',
}

export const useNotificationStore = defineStore(
  'notifications',
  () => {
    const { isLoading, begin, finish } = useLoadingState()
    const auth = useAuthStore()
    const { handleError } = useErrorStore()
    const service = useNotificationsService()

    const notifications = ref<Notification[]>([])

    const unreadNotifications = computed(() =>
      notifications.value.filter((n) => n.read_at === null),
    )

    const get = async () => {
      auth.ensureAuth()
      try {
        begin(NotificationLoading.GETTING)
        const { data, error } = await service.list(auth.userId!)
        if (error) throw new Error(error.message)
        if (data) {
          notifications.value = data
          return true
        }
        return false
      } catch (error) {
        handleError('Getting notifications', error)
      } finally {
        finish(NotificationLoading.GETTING)
      }
    }

    const create = async (type: NotificationType, id: string, recipients: string[]) => {
      auth.ensureAuth()
      try {
        finish(NotificationLoading.CREATING)
        const _data = useNotificationBuilder(type, id)
        const sender = auth.userId!
        const _notifications: NotificationItem[] = recipients
          .filter((r) => r !== sender)
          .map((r) => ({
            recipient: r,
            type,
            sender,
            created_at: new Date().toISOString(),
            read_at: null,
            ..._data,
          }))

        const { status, error } = await service.create(_notifications)
        if (error) throw new Error(error.message)
        return status === 201
      } catch (error) {
        handleError('Creating notification', error)
      } finally {
        finish(NotificationLoading.CREATING)
      }
    }

    const markAsRead = async (id: string, read: boolean = true) => {
      try {
        begin(NotificationLoading.UPDATING)
        const read_at = read ? new Date().toISOString() : null
        const { status, error } = await service.update(id, {
          read_at,
        })

        if (error) throw new Error(error.message)
        if (status === 204) {
          const _notifications = [...notifications.value]
          const _n = _notifications.findIndex((n) => n.id === id)
          if (_n !== -1) {
            _notifications[_n].read_at = read_at
            notifications.value = _notifications
          }
          return true
        }

        return
      } catch (error) {
        handleError('Updating notification', error)
      } finally {
        finish(NotificationLoading.UPDATING)
      }
    }

    return {
      isLoading,
      get,
      create,
      notifications,
      unreadNotifications,
      markAsRead,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationStore, import.meta.hot))
}
