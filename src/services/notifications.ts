import { supabase } from '@/database/supabase'
import type { NotificationAction, NotificationForm, NotificationType } from '@/stores/notifications'

export const useNotificationBuilder = (type: NotificationType, id: string) => {
  const data: {
    actions: NotificationAction[]
    message: string
    related_project_id: string | null
    related_task_id: string | null
    related_event_id: string | null
  } = {
    actions: [],
    message: '',
    related_project_id: null,
    related_task_id: null,
    related_event_id: null,
  }
  switch (type) {
    case 'project_member_added':
      data.actions = [{ label: 'View project', path: { name: 'project', params: { id } } }]
      data.message = 'You have been assigned to <project> project'
      data.related_project_id = id
      break

    case 'task_assigned':
      data.actions = [{ label: 'View task', path: { name: 'task', params: { id } } }]
      data.message = 'You have been assigned to task <task>'
      data.related_task_id = id
      break

    case 'task_overdue':
      data.actions = [{ label: 'View task', path: { name: 'task', params: { id } } }]
      data.message = 'Task <task> is overdue'
      data.related_task_id = id
      break

    case 'task_completed':
      data.actions = [{ label: 'View task', path: { name: 'task', params: { id } } }]
      data.message = 'Task <task> has been marked as completed'
      data.related_task_id = id
      break

    case 'task_status_update':
      data.actions = [
        {
          label: 'View task',
          path: { name: 'task', params: { id } },
        },
      ]
      data.message = 'Task status updated from <before> to <current>'
      data.related_task_id = id
      break

    case 'event_invited':
      data.actions = [
        {
          label: 'View event',
          path: { name: 'event', params: { id } },
        },
      ]
      data.message = "You've been invited to an event <event>"
      data.related_event_id = id
      break

    case 'event_cancelled':
      data.actions = [
        {
          label: 'View event',
          path: { name: 'event', params: { id } },
        },
      ]
      data.message = 'Event <event> has been cancelled'
      data.related_event_id = id

      break

    case 'event_upcoming':
      data.actions = [
        {
          label: 'View event',
          path: { name: 'event', params: { id } },
        },
      ]
      data.message = 'Event <event> is upcoming'
      data.related_event_id = id
      break

    default:
      data.actions = []
      data.message = 'Unkown notification type'
      break
  }

  return data
}

export const useNotificationsService = () => {
  const list = async (userId: string) => {
    return await supabase
      .from('notifications')
      .select(
        '*, related_project_id(id, name), related_task_id(id, title), related_event_id(id, title)',
      )
      .eq('recipient', userId)
  }

  const create = async (form: NotificationForm[]) => {
    return await supabase.from('notifications').insert(form)
  }

  const update = async (id: string, form: { read_at: string | null }) => {
    return await supabase.from('notifications').update(form).eq('id', id)
  }

  return {
    list,
    create,
    update,
  }
}
