import { useNotesService } from '@/services/notes'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useErrorStore } from './errors'
import { useLoadingState } from '@/composables/useLoading'
import { useAuthStore } from './auth'
export enum NotesLoading {
  GETTING = 'getting-notes',
  GETTING_ONE = 'getting-note',
  CREATING = 'creating-note',
  UPDATING = 'updating-note',
  DELETING = 'deleting-note',
}
export const useNotesStore = defineStore(
  'counter',
  () => {
    const service = useNotesService()
    const { handleError } = useErrorStore()
    const { begin, finish, isLoading } = useLoadingState()
    const auth = useAuthStore()

    //

    const list = async (project: string) => {
      try {
        begin(NotesLoading.GETTING)
        const { data, error } = await service.list(project)
        if (error) throw new Error(error.message)
        return data
      } catch (error) {
        handleError('Listing notes', error)
      } finally {
        finish(NotesLoading.GETTING)
      }
    }

    const get = async (id: string) => {
      try {
        begin(NotesLoading.GETTING_ONE)
        const { data, error } = await service.get(id)
        if (error) throw new Error(error.message)
        return data[0]
      } catch (error) {
        handleError('Getting note', error)
      } finally {
        finish(NotesLoading.GETTING_ONE)
      }
    }

    const create = async (form: ProjectNoteForm) => {
      auth.ensureAuth()
      try {
        begin(NotesLoading.CREATING)
        const payload = { ...form, created_by: auth.userId!, created_at: new Date().toISOString() }
        const { data, error } = await service.create(payload)
        if (error) throw new Error(error.message)
        if (data) return data[0]
        return null
      } catch (error) {
        handleError('Creating note', error)
      } finally {
        finish(NotesLoading.CREATING)
      }
    }

    const update = async (id: string, form: ProjectNote) => {
      try {
        begin(NotesLoading.UPDATING)
        const payload = { ...form, updated_at: new Date().toISOString() }
        const { status, error } = await service.update(id, payload)
        if (error) throw new Error(error.message)
        return status === 204
      } catch (error) {
        handleError('Updating note', error)
      } finally {
        finish(NotesLoading.UPDATING)
      }
    }

    const destroy = async (id: string) => {
      try {
        begin(NotesLoading.DELETING)
        const { status, error } = await service.destroy(id)
        if (error) throw new Error(error.message)
        return status === 204
      } catch (error) {
        handleError('Deleting note', error)
      } finally {
        finish(NotesLoading.DELETING)
      }
    }

    return {
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
  import.meta.hot.accept(acceptHMRUpdate(useNotesStore, import.meta.hot))
}

export interface ProjectNote {
  id: string
  title: string
  content: string
  project_id: string
  created_at: string
  created_by: string
  updated_at: string | null
}

export interface ProjectNoteForm {
  id?: string
  title: string
  content: string
  project_id: string
  created_at?: string
  created_by: string
  updated_at?: string | null
}
