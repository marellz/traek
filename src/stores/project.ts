import { useProjectService } from '@/services/projects'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useErrorStore } from './errors'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

export type Project = {
  id: string
  name: string
  created_by: string
  created_at: string
  updated_at: string | null
  description: string
  closed_at?: string | null
}

export interface ProjectForm {
  id?: string
  name: string
  description: string
  created_by: string
  created_at: string
  updated_at?: string | null
  closed_at?: string | null
}

export interface ProjectMember {
  id: number
  project_id: string
  user_id: string
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
      if (!auth.user) {
        return forbiddenAction()
      }

      fetching.value = true
      projects.value = []
      try {
        const { data, error } = await service.list(auth.user.id)

        if (error) {
          handleError('Getting user projects', error.message)
        }

        if (data) {
          projects.value = data
          return true
        }

        return false
      } catch (error) {
        handleError('Getting user projects', error)
      } finally {
        fetching.value = false
      }
    }


    const getProject = async (id: string) => {
      getting.value = true
      try {
        const { data, error } = await service.get(id)
        if (error) {
          handleError('Getting project', error.message)
        }
        if (data) {
          return data[0]
        }
        return null
      } catch (error) {
        handleError('Getting project', error)
      } finally {
        getting.value = false
      }
    }

    const getProjectStats = async (project: string) => {
      try {
        const { error, data } = await service.getStats(project)
        if (error) {
          handleError('Getting project stats', error.message)
        }

        if (data) {
          return data
        }

        return null
      } catch (error) {
        handleError('Getting project stats', error)
      }
    }


    const sendJoinRequest = async () => {}

    const createProject = async (form: ProjectForm) => {
      if (!auth.userId) {
        handleError('Forbidden', "You're not allowed to perform this action")
        return null
      }

      try {
        form.created_by = auth.userId
        form.created_at = new Date().toISOString()

        creating.value = true

        const { data, error } = await service.create(form)
        if (error) {
          handleError('Creating project', error.message)
        }

        if (data && data.length) {
          // todo: know what to do depending on origin/purpose
          projects.value = [...projects.value, data[0]]

          await addMemberById(auth.userId, data[0].id)

          return data

        }

        return null
      } catch (error) {
        handleError('Creating project', error)
      } finally {
        creating.value = false
      }
    }

    const addMemberById = async (user: string, project: string) => {
      try {
        const {status, error} = await service.createProjectMember(user, project)
        if(error){
          handleError("Adding member to project", error.message)
        }

        if(status===204){

        }

        return false
      } catch (error) {
        handleError("Adding member to project", error)
      }
    }

    const updateProject = async (id: string, form: ProjectForm) => {
      if (!auth.user || form.created_by !== auth.user.id) {
        return forbiddenAction()
      }

      updating.value = true

      try {
        form.updated_at = new Date().toISOString()
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
      const form = projects.value.find((p) => p.id === id)

      if (!form) {
        handleError('Not found', 'Project is invalid or does not exist')
        return null
      }

      if (!auth.user || form.created_by !== auth.user.id) {
        return forbiddenAction()
      }

      closing.value = true
      const _project = await getProject(id)
      if (!_project) {
        return
      }

      try {
        const closed_at = new Date().toISOString()
        const response = await service.update(id, {
          ..._project,
          closed_at,
          updated_at: closed_at,
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

    const forbiddenAction = () => {
      handleError(
        'Forbiddden action',
        ' You need to be properly authorized/authenticated to perform this action.',
      )
      return false
    }

    return {
      projects,
      init,

      getUserProjects,
      getProject,
      getProjectStats,
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
