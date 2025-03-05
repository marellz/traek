import { acceptHMRUpdate, defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { useErrorStore } from './errors'
import { useEventService } from '@/services/events'
import { useLoadingState } from '@/composables/useLoading'

export enum EventLoading {
  GETTING = 'getting-events',
  GETTING_ONE = 'getting-event',
  CREATING = 'creating-event',
  UPDATING = 'updating-event',
  DELETING = 'deleting-event',
  ADDING_INVITEES ='adding-invitees',
  DELETING_INVITEE = 'deleting-invitee',
  GETTING_USER = 'getting-user-events',
}

export const useEventStore = defineStore(
  'project_events',
  () => {
    const service = useEventService()
    const auth = useAuthStore()
    const { handleError } = useErrorStore()
    const { begin, finish, isLoading } = useLoadingState()
    const getEvents = async (project: string) => {

      auth.ensureAuth()
      try {
        begin(EventLoading.GETTING)
        const { error, data } = await service.list(project)
        if (error) throw new Error(error.message)

        return data[0]
      } catch (error) {
        handleError('Fetching events', error)
      } finally {
        finish(EventLoading.GETTING)
      }
    }

    const getEvent = async (id: string) => {
      auth.ensureAuth()
      try {
        begin(EventLoading.GETTING_ONE)
        const { data, error } = await service.getEvent(id)
        if (error) throw new Error(error.message)

        return data[0]
      } catch (error) {
        handleError('Fetching event', error)
      } finally {
        finish(EventLoading.GETTING_ONE)
      }
    }

    const create = async (form: ProjectEventForm, invitees: string[]) => {
      auth.ensureAuth()
      try {
        begin(EventLoading.CREATING)
        const { data, error } = await service.create(form)
        if (error) throw new Error(error.message)

        if (data) {
          // add creator to invitees
          invitees.push(form.created_by)

          await addInvitees(data[0].id, invitees)
          return data[0]
        }

        return null
      } catch (error) {
        handleError('Creating event', error)
      } finally {
        finish(EventLoading.CREATING)
      }
    }

    const update = async (id: string, form: ProjectEventForm) => {
      auth.ensureAuth()
      try {
        begin(EventLoading.UPDATING)
        const { status, error } = await service.update(id, form)
        if (error) throw new Error(error.message)

        return status === 204
      } catch (error) {
        handleError('Updating event', error)
      } finally {
        finish(EventLoading.UPDATING)
      }
    }

    const destroy = async (id: string) => {
      auth.ensureAuth()
      try {
        begin(EventLoading.DELETING)
        const { status, error } = await service.destroy(id)
        if (error) throw new Error(error.message)

        return status === 204
      } catch (error) {
        handleError('Deleting event', error)
      } finally {
        finish(EventLoading.DELETING)
      }
    }

    /**
     * USER
     */

    const getUserEvents = async (user_id: string) => {
      try {
        begin(EventLoading.GETTING_USER)
        const { error, data } = await service.getUserEvents(user_id)
        if (error) throw new Error(error.message)
        return data
      } catch (error) {
        handleError('Fetching user events', error)
      } finally {
        finish(EventLoading.GETTING_USER)
      }
    }

    /**
     * INVITEES
     */

    const addInvitees = async (event_id: string, invitees: string[]) => {
      auth.ensureAuth()
      try {
        begin(EventLoading.ADDING_INVITEES)
        const payload = invitees.map((user_id) => ({
          event_id,
          user_id,
        }))

        const { error, status } = await service.addInvitees(payload)

        if (error) throw new Error(error.message)
        return status === 204
      } catch (error) {
        handleError('Adding invitees', error)
      }finally {
        finish(EventLoading.ADDING_INVITEES)
      }
    }

    const deleteInvitee = async (event_id: string, user_id: string) => {
      auth.ensureAuth()
      try {
        begin(EventLoading.DELETING_INVITEE)
        const { error, status } = await service.deleteInvitee(event_id, user_id)
        if (error) throw new Error(error.message)
        return status===204
      } catch (error) {
        handleError('Deleting invitee', error)
      }
      finally {
        finish(EventLoading.DELETING_INVITEE)
      }
    }

    return {
      create,
      getEvent,
      getEvents,
      update,
      destroy,

      getUserEvents,

      // invitees
      addInvitees,
      deleteInvitee,

      isLoading,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEventStore, import.meta.hot))
}

export interface ProjectEvent {
  id: string
  project_id: string
  title: string
  description: string | null
  created_at: string
  created_by: string
  url: string | null
  venue: string | null
  event_type: string
  status: string
  date: string
  time: string | null
  duration_hours: number | null
  updated_at: string | null
  closed_at: string | null
}

export interface ProjectEventForm {
  id?: string
  project_id: string
  title: string
  description?: string | null
  created_at: string
  created_by: string
  url: string | null
  venue?: string | null
  event_type: string
  status: string
  date: string
  time?: string | null
  duration_hours?: number | null
  updated_at?: string | null
  closed_at?: string | null
}
