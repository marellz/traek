import { useActivityService } from '@/services/activity'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useErrorStore } from '@/stores/errors'
import { useLoadingState } from '@/composables/useLoading'
import { AuthErrors, useAuthStore, type UserProfile } from '@/stores/auth'
import type { TaskStatus } from '@/stores/task'
import { useUserStore } from '@/stores/user'
import type { Json } from '@/types/supabase'
import { usePagination } from '@/composables/usePagination'

export enum ActivityTypes {
  TASK_CREATED = 'task-created', // done ✅
  TASK_STATUS_UPDATED = 'task-status-change', // done ✅

  NOTE_CREATED = 'note-created', // done ✅
  EVENT_CREATED = 'event-created', // done ✅

  MEMBERS_ADDED = 'member-added', // done ✅

  PROJECT_CREATED = 'project-created', // done ✅
  PROJECT_CLOSED = 'project-closed', // done ✅
  PROJECT_UPDATED = 'project-updated',
}

export enum ActivityListTypes {
  PROJECT = 'project-activities',
  USER_PROJECTS = 'user-projects',
  USER = 'user-activities',
}

export type ActivityType = `${ActivityTypes}`

export interface NewActivity {
  user_id: string
  project_id: string
  task_id?: string | null
  note_id?: string | null
  event_id?: string | null
  content?: string | null
  is_private: boolean
  target_user_ids: string[]
  meta: any
  type: string
}

export enum ActivityLoading {
  GETTING_ACTIVITIES = 'getting-activities',
  LOGGING_ACTIVITY = 'logging-activity',
  GETTING_USER_INFO = 'getting-activity-users',
  UPDATING_ACTIVITY = 'updating-activity',
  GETTING_ACTIVITY = 'getting-activity',
}

export type Activity = NewActivity & {
  id?: string
  created_at?: string // populated
  updated_at?: string | null
  user: {
    id: string
    name: string | null
    avatar: string | null
  }
  project: {
    id: string
    name: string
  }
  task: {
    id: string
    title: string
    status: TaskStatus
  } | null
  event: {
    id: string
    title: string
    datetime: string
  } | null
  note: {
    id: string
    title: string
  } | null
  target_users?: UserProfile[]
}

export interface ActivityForm {
  project_id: string
  type: ActivityType
  content?: string
  is_private?: boolean
  task_id?: string
  note_id?: string
  event_id?: string
  target_user_ids?: string[]
  meta?: Json | null
}

export interface ActivityQuery {
  task_id?: string | null
  note_id?: string | null
  event_id?: string | null
  type: ActivityType | string
}

export const useActivityStore = defineStore(
  'activities',
  () => {
    const { isLoading, begin, finish } = useLoadingState()
    const auth = useAuthStore()
    const { handleError } = useErrorStore()
    const service = useActivityService()
    const userStore = useUserStore()

    const { range, nextRange, previousRange, markRangeLimit, resetRange, rangeLimit } =
      usePagination()

    const getProjectActivity = async (project_id: string) => {
      try {
        begin(ActivityLoading.GETTING_ACTIVITIES)
        const { data, error } = await service.getProjectActivity(project_id, range.value)
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
        const { data, error } = await service.getUserProjectsActivities(auth.userId, range.value)
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
        const { data, error } = await service.getUserActivity(auth.userId, range.value)
        if (error) throw new Error(error.message)
        if (data) return data
        return null
      } catch (error) {
        handleError('Getting user activity', error)
      } finally {
        finish(ActivityLoading.GETTING_ACTIVITIES)
      }
    }

    const getUserInformation = async (users: string[]) => {
      try {
        begin(ActivityLoading.GETTING_USER_INFO)
        const data = await userStore.getProfiles(users)
        return data
      } catch (error) {
        handleError('Getting user information', error)
      } finally {
        finish(ActivityLoading.GETTING_USER_INFO)
      }
    }

    const updateIfAlreadyLogged = async (activity: Activity) => {
      try {
        begin(ActivityLoading.UPDATING_ACTIVITY)

        const { type, task_id, note_id, event_id } = activity
        const exists = await getActivity({ type, task_id, note_id, event_id }, true)

        if (exists) {
          if (!auth.isAuthenticated || !auth.userId) throw new Error(AuthErrors.UNAUTHENCATED)
          const { status, error } = await service.updateActivity(exists[0].id, activity)
          if (error || status !== 200) throw new Error(error?.message || 'Error updating activity')
          return true
        } else {
          return logActivity(activity as ActivityForm)
        }
      } catch (error) {
        handleError('Updating activity', error)
        return false
      } finally {
        finish(ActivityLoading.UPDATING_ACTIVITY)
      }
    }

    const getActivity = async (query: ActivityQuery, recent: boolean = true) => {
      try {
        begin(ActivityLoading.GETTING_ACTIVITY)
        const { data, error } = await service.getActivity(query, recent)
        if (error) throw new Error(error.message)
        if (data) return data
        return null
      } catch (error) {
        handleError('Getting activity', error)
        return null
      } finally {
        finish(ActivityLoading.GETTING_ACTIVITY)
      }
    }

    const logActivity = async (payload: ActivityForm) => {
      try {
        if (!auth.isAuthenticated || !auth.userId) throw new Error(AuthErrors.UNAUTHENCATED)
        begin(ActivityLoading.LOGGING_ACTIVITY)
        const {
          project_id,
          type,
          content = '',
          target_user_ids = [],
          is_private = false,
          task_id,
          note_id,
          event_id,
          meta = null,
        } = payload
        const _activity: NewActivity = {
          project_id,
          type,
          content,
          is_private,
          user_id: auth.userId,
          target_user_ids,
          task_id,
          note_id,
          event_id,
          meta,
        }

        const { data, error } = await service.logActivity(_activity)
        if (error) throw new Error(error.message)
        if (data) return data
        return null
      } catch (error) {
        handleError('Logging activity', error)
      } finally {
        finish(ActivityLoading.LOGGING_ACTIVITY)
      }
    }

    return {
      isLoading,
      getProjectActivity,
      getUserProjectsActivities,
      updateIfAlreadyLogged,
      getActivity,
      getUserActivity,
      getUserInformation,
      logActivity,

      //pagination
      range,
      nextRange,
      rangeLimit,
      previousRange,
      markRangeLimit,
      resetRange,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useActivityStore, import.meta.hot))
}
