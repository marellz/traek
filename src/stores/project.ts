import { useProjectService } from '@/services/projects'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useErrorStore } from './errors'
import type { Models } from 'appwrite'
import { ref } from 'vue'
import { useAuthStore, type User } from '@/stores/auth'

export interface Project extends Models.Document {
  name: string
  description: string
  creator: User
  closed_at?: string | null
}

export interface ProjectForm {
  name: string
  description?: string | null
  creator?: string | null
  closed_at?: string | null
}

export type PartialProjectForm = Partial<Record<keyof ProjectForm, any>>

export const useProjectStore = defineStore(
  'projects',
  () => {
    const projects = ref<Project[]>([])
    const service = useProjectService()
    const auth = useAuthStore()
    const { handleError } = useErrorStore()

    //loading states
    const fetching = ref(false)
    const getting = ref(false)
    const creating = ref(false)
    const updating = ref(false)
    const closing = ref(false)

    const getUserProjects = async () => {
      fetching.value = true
      projects.value = []
      try {
        const { documents } = await service.list()
        if (documents) {
          projects.value = [...(documents as Project[])]
        }
      } catch (error) {
        handleError('Getting user projects', error)
      } finally {
        fetching.value = false
      }
    }

    const getProject = async (id: string) => {
      getting.value = true
      try {
        const response = await service.get(id)
        if (response) {
          return response
        }
        return null
      } catch (error) {
        handleError('Getting project', error)
      } finally {
        getting.value = false
      }
    }

    const sendJoinRequest = async () => {}

    const createProject = async (form: ProjectForm) => {
      if (!auth.user) {
        handleError('Forbidden', "You're not allowed to perform this action")
        return null
      }

      try {
        form.creator = auth.user.$id

        creating.value = true

        const response = await service.create(form)
        if (response) {
          // todo: know what to do depending on origin/purpose
          return response
        }

        return null
      } catch (error) {
        handleError('Creating project', error)
      } finally {
        creating.value = false
      }
    }

    const updateProject = async (id: string, form: ProjectForm) => {
      if (!auth.user || form.creator !== auth.user.$id) {
        handleError('Forbidden', "You're not allowed to perform this action")
        return false
      }

      updating.value = true

      try {
        const response = await service.update(id, form)
        if (response) {
          return true
        }

        return false
      } catch (error) {
        handleError('Updating project', error)
      } finally {
        updating.value = false
      }
    }

    const closeProject = async (id: string) => {
      const form = projects.value.find((p) => p.$id === id)

      if (!form) {
        handleError('Not found', 'Project is invalid or does not exist')
        return null
      }

      if (!auth.user || form.creator.$id !== auth.user.$id) {
        handleError('Forbidden', "You're not allowed to perform this action")
        return false
      }

      closing.value = true

      try {
        const closed_at = new Date().toISOString()
        const response = await service.update(id, {
          closed_at,
        })

        if (response) form.closed_at = closed_at
      } catch (error) {
        handleError('Closing project', error)
      } finally {
        closing.value = false
      }
    }

    const init = async () => {
      // await getUserProjects()
    }

    return {
      projects,
      init,

      getUserProjects,
      getProject,
      sendJoinRequest,
      createProject,
      updateProject,
      closeProject,

      // loading
      fetching,
      getting,
      creating,
      updating,
      closing,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectStore, import.meta.hot))
}
