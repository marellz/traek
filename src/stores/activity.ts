import { useActivityService } from '@/services/activity'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useErrorStore } from './errors'
import { useLoadingState } from '@/composables/useLoading'
import { AuthErrors, useAuthStore } from '@/stores/auth'

export enum ActivityTypes {
  TASK_CREATED = 'task-created', // done ✅
  TASK_STATUS_UPDATED = 'task-status-change', // done ✅

  NOTE_CREATED = 'note-created',
  EVENT_CREATED = 'event-created',

  MEMBERS_ADDED = 'member-added', // done ✅

  PROJECT_CREATED = 'project-created', // done ✅
  PROJECT_CLOSED = 'project-closed', // done ✅
  PROJECT_UPDATED = 'project-updated',
}

export type ActivityType = `${ActivityTypes}`

export interface Activity {
  id: string
  user_id: string
  project_id: string
  task_id?: string | null
  note_id?: string | null
  event_id?: string | null
  content?: string | null
  created_at: string
  is_private: boolean
  target_ids: string[]
  type: string
}


export enum ActivityLoading {
  GETTING_ACTIVITIES = 'getting-activity',
  LOGGING_ACTIVITY = 'logging-activity',
}


export type NewActivity = Omit<
  Activity,
  'id' | 'created_at'
> /*& { id?: string } & { created_at?} */

export interface ActivityForm {
  project_id: string
  type: ActivityType
  content?: string
  is_private?: boolean
  task_id?: string
  note_id?: string
  event_id?: string
  target_ids?: string[]
}

export const useActivityStore = defineStore(
  'activities',
  () => {
    const { isLoading, begin, finish } = useLoadingState()
    const auth = useAuthStore()
    const { handleError } = useErrorStore()
    const service = useActivityService()

    const getProjectActivity = async (project_id: string) => {
      try {
        begin(ActivityLoading.GETTING_ACTIVITIES)
        const { data, error } = await service.getProjectActivity(project_id)
        if (error) throw new Error(error.message)
        if (data) return data
        return
      } catch (error) {
        handleError('Getting project activity', error)
      } finally {
        finish(ActivityLoading.GETTING_ACTIVITIES)
      }
    }

    const getUserProjectsActivities = async () => {
      try {
        begin(ActivityLoading.GETTING_ACTIVITIES)
        if (!auth.userId) throw new Error(AuthErrors.UNAUTHENCATED)
        const { data, error } = await service.getUserProjectsActivities(auth.userId)
        if (error) throw new Error(error.message)
        if (data) return data
        return null
      } catch (error) {
        handleError('Getting user project activities', error)
      } finally {
        finish(ActivityLoading.GETTING_ACTIVITIES)
      }
    }

    const getUserActivity = async () => {
      try {
        begin(ActivityLoading.GETTING_ACTIVITIES)
        if (!auth.userId) throw new Error(AuthErrors.UNAUTHENCATED)
        const { data, error } = await service.getUserActivity(auth.userId)
        if (error) throw new Error(error.message)
        if (data) return data
        return null
      } catch (error) {
        handleError('Getting user activity', error)
      } finally {
        finish(ActivityLoading.GETTING_ACTIVITIES)
      }
    }

    const logActivity = async (payload: ActivityForm) => {
      console.log(`logging ${payload}`)
      try {
        if (!auth.isAuthenticated || !auth.userId) throw new Error(AuthErrors.UNAUTHENCATED)
        begin(ActivityLoading.LOGGING_ACTIVITY)
        const {
          project_id,
          type,
          content = '',
          target_ids = [],
          is_private = false,
          task_id,
          note_id,
          event_id,
        } = payload
        const _activity: NewActivity = {
          project_id,
          type,
          content,
          is_private,
          user_id: auth.userId,
          target_ids,
          task_id,
          note_id,
          event_id,
        }

        const { data, error } = await service.logActivity(_activity)
        if (error) throw new Error(error.message)
        if (data) return data
        return null
      } catch (error) {
        handleError('Logging activity', error)
        console.log('failed to log')
        console.log(payload)
      } finally {
        finish(ActivityLoading.LOGGING_ACTIVITY)
      }
    }

    return {
      isLoading,
      getProjectActivity,
      getUserProjectsActivities,
      getUserActivity,
      logActivity,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useActivityStore, import.meta.hot))
}
