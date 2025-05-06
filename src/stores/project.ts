import { useProjectService } from '@/services/projects'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useErrorStore } from './errors'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useLoadingState } from '@/composables/useLoading'
import { NotificationTypes, useNotificationStore } from './notifications'

export interface ProjectUser {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  avatar: string | null
}

export type Project = {
  id: string
  name: string
  created_by: string
  creator: ProjectUser
  members: ProjectUser[]
  created_at: string
  updated_at: string | null
  description: string
  closed_at?: string | null
}

export interface ProjectStats {
  project_members: { count: number }[]
  tasks: { count: number }[]
  events: { count: number }[]
  notes: { count: number }[]
}

export type ProjectInfo = Omit<Project, 'created_by' | 'members'> &
  ProjectStats & {
    creator: ProjectUser
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

export interface ProjectMember extends ProjectUser {
  joined_at: string
}

export type PartialProjectForm = Partial<Record<keyof ProjectForm, any>>

export enum ProjectLoading {
  GETTING_ALL = 'getting-projects',
  GETTING_ONE = 'getting-project',
  GETTING_INFO = 'getting-project-info',
  CREATING = 'creating-project',
  UPDATING = 'updating-project',
  CLOSING = 'closing-project',

  //
  GETTING_USER = 'getting-user-project',
  ADDING_MEMBERS = 'adding-members',
  REMOVING_MEMBER = 'removing-member',
  GETTING_MEMBERS = 'getting-members',
}

export const useProjectStore = defineStore(
  'projects',
  () => {
    const projects = ref<Project[]>([])
    const service = useProjectService()
    const auth = useAuthStore()
    const { handleError } = useErrorStore()
    const { begin, finish, isLoading } = useLoadingState()
    const notifyService = useNotificationStore()

    const ensureAuth = (user_id?: string) => {
      if (!(auth.user && (user_id ? auth.user.id !== user_id : true))) {
        throw new Error('Forbidden action')
      }

      return true
    }

    const getUserProjects = async () => {
      ensureAuth()
      projects.value = []

      try {
        begin(ProjectLoading.GETTING_USER)
        const { data, error } = await service.list(auth.userId!)

        if (error) throw new Error(error.message)

        if (data) {
          projects.value = data
          return true
        }

        return false
      } catch (error) {
        handleError('Getting user projects', error)
      } finally {
        finish(ProjectLoading.GETTING_USER)
      }
    }

    const getProject = async (id: string) => {
      try {
        begin(ProjectLoading.GETTING_ONE)
        const { data, error } = await service.get(id)
        if (error) throw new Error(error.message)
        return data[0]
      } catch (error) {
        handleError('Getting project', error)
      } finally {
        finish(ProjectLoading.GETTING_ONE)
      }
    }

    const getProjectStats = async (project: string) => {
      try {
        begin(ProjectLoading.GETTING_INFO)
        const { error, data } = await service.getStats(project)
        if (error) throw new Error(error.message)
        return data[0]
      } catch (error) {
        handleError('Getting project stats', error)
      } finally {
        finish(ProjectLoading.GETTING_INFO)
      }
    }

    const createProject = async (form: ProjectForm, members: string[]) => {
      ensureAuth()

      try {
        begin(ProjectLoading.CREATING)
        form.created_by = auth.userId!
        form.created_at = new Date().toISOString()
        const { data, error } = await service.create(form)
        if (error) throw new Error(error.message)
        if (data) {
          // todo: know what to do depending on origin/purpose
          // const _projects = [...projects.value]
          // projects.value = _projects
          // _projects.push(data[0])

          await addMembers(data[0].id, [...members, auth.userId!])

          await getUserProjects()

          return data
        }

        return null
      } catch (error) {
        handleError('Creating project', error)
      } finally {
        finish(ProjectLoading.CREATING)
      }
    }

    const updateProject = async (id: string, form: ProjectForm) => {
      ensureAuth(form.created_by)

      try {
        begin(ProjectLoading.UPDATING)
        form.updated_at = new Date().toISOString()
        const { status, error } = await service.update(id, form)
        if (error) throw new Error(error.message)

        return status === 204
      } catch (error) {
        handleError('Updating project', error)
      } finally {
        finish(ProjectLoading.UPDATING)
      }
    }

    const closeProject = async (id: string) => {
      try {
        begin(ProjectLoading.CLOSING)
        const form = projects.value.find((p) => p.id === id)

        if (!form) {
          throw new Error('Project not found')
        }

        ensureAuth(form.creator.id)
        const closed_at = new Date().toISOString()
        const { error, status } = await service.update(id, {
          ...form,
          created_by: form.creator.id,
          closed_at,
          updated_at: closed_at,
        })

        if (error) throw new Error(error.message)
        if (status === 204) {
          form.closed_at = closed_at
          return true
        }

        return false
      } catch (error) {
        handleError('Closing project', error)
      } finally {
        finish(ProjectLoading.CLOSING)
      }
    }

    /**
     * MEMBERS
     */

    const addMembers = async (project: string, members: string[]) => {
      try {
        begin(ProjectLoading.ADDING_MEMBERS)
        const payload = members.map((user_id) => ({ user_id, project_id: project }))
        const { status, error } = await service.addMembers(payload)
        if (error) throw new Error(error.message)
        if(status === 201){
          notifyMemberAddition(project, members)
          return true
        }
        return false
      } catch (error) {
        handleError('Adding member to project', error)
      } finally {
        finish(ProjectLoading.ADDING_MEMBERS)
      }
    }

    const getMembers = async (project: string) => {
      try {
        begin(ProjectLoading.GETTING_MEMBERS)
        const { error, data } = await service.getMembers(project)
        if (error) throw new Error(error.message)
        return data
      } catch (error) {
        handleError('Getting project members', error)
      } finally {
        finish(ProjectLoading.GETTING_MEMBERS)
      }
    }

    const removeMember = async (user_id: string, project_id: string) => {
      try {
        begin(ProjectLoading.REMOVING_MEMBER)
        const { status, error } = await service.removeMember(user_id, project_id)
        if (error) throw new Error(error.message)
        return status === 204
      } catch (error) {
        handleError('Removing member from project', error)
      } finally {
        finish(ProjectLoading.REMOVING_MEMBER)
      }
    }

    /**
     * NOTIFICATIONS
     */

    const notifyMemberAddition = (project: string, users: string[] = []) => {
      notifyService.create(NotificationTypes.PROJECT_MEMBER_ADDED, project, users)
    }

    return {
      projects,

      getUserProjects,
      getProject,
      getProjectStats,
      createProject,
      updateProject,
      closeProject,

      addMembers,
      getMembers,
      removeMember,
      isLoading,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectStore, import.meta.hot))
}
