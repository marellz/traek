import { useProjectService } from '@/services/projects'
import { useGoalService } from '@/services/project.goals'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { useErrorStore } from '@/stores/errors'
import { useAuthStore } from '@/stores/auth'
import { useLoadingState } from '@/composables/useLoading'
import { NotificationTypes, useNotificationStore } from '@/stores/notifications'
import { ActivityTypes, useActivityStore } from '@/stores/activity'
import { ref } from 'vue'
import { UserRolesEnum, type UserRole } from '@/data/users.data'

export interface ProjectUser {
  id: string
  email: string
  name: string | null
  username: string | null
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
  description: string | null
  closed_at?: string | null
  priority: string
  category: string
  progress: number | null
  settings: any
  start_date: string | null
  end_date: string | null
  archived_at?: string | null
  status: string
  image: string | null
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
  description: string | null
  created_by: string
  created_at: string
  updated_at?: string | null

  priority: string
  category: string
  progress?: number | null
  settings: Record<any, any>
  start_date?: string | null
  end_date?: string | null
  archived_at?: string | null
  status: string
  image?: string | null
}

export interface ProjectMember extends ProjectUser {
  joined_at: string
  role: string;
  settings: any,
  special_permissions: any,
}

export type PartialProjectForm = Partial<Record<keyof ProjectForm, any>>

export interface ProjectMemberForm {
  project_id: string
  user_id: string
  role: UserRole
}

export interface ProjectGoalForm {
  project_id: string
  status: string
  title: string
  description: string | null
  added_by: string
  created_at: string
}

export interface ProjectGoal extends ProjectGoalForm {
  id: string
  updated_at: string | null
  completed_at: string | null
}


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

  //
  GETTING_GOALS = 'getting-project-goals',
  GETTING_GOAL = 'getting-project-goal',
  CREATING_GOAL = 'creating-project-goal',
  UPDATING_GOAL = 'updating-project-goal',
  DELETING_GOAL = 'deleting-project-goal',
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
    const activityService = useActivityStore()

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

    const createProject = async (form: ProjectForm) => {
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

          const id = data[0].id

          await activityService.logActivity({
            project_id: id,
            type: ActivityTypes.PROJECT_CREATED,
            content: 'Project was created',
            is_private: false,
          })

          await addMembers(id, [
            {
              role: UserRolesEnum.CREATOR,
              project_id: id,
              user_id: auth.userId!,
            },
          ])

          await getUserProjects()

          return data[0]
        }

        return null
      } catch (error) {
        handleError('Creating project', error)
      } finally {
        finish(ProjectLoading.CREATING)
      }
    }

    const updateProject = async (id: string, form: Partial<Project>) => {
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

    /*
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
          await activityService.logActivity({
            project_id: id,
            type: ActivityTypes.PROJECT_CLOSED,
            content: 'Project was closed.',
            is_private: false,
          })
          return true
        }

        return false
      } catch (error) {
        handleError('Closing project', error)
      } finally {
        finish(ProjectLoading.CLOSING)
      }
    }

    */

    /**
     * GOALS
     */

    const goalService = useGoalService()
    const getGoals = async (project: string) => {
      try {
        begin(ProjectLoading.GETTING_GOALS)
        const { data, error } = await goalService.getGoals(project)
        if (error) throw new Error(error.message)
        if (data) return data
        return null
      } catch (error) {
        handleError('Getting project goals', error)
        return null
      } finally {
        finish(ProjectLoading.GETTING_GOALS)
      }
    }

    const getGoal = async (id: string) => {
      try {
        finish(ProjectLoading.GETTING_GOAL)
        const { data, error } = await goalService.getGoal(id)
        if (error) throw new Error(error.message)
        if (data) return data[0]
        return null
      } catch (error) {
        handleError('Getting project goals', error)
        return null
      } finally {
        finish(ProjectLoading.GETTING_GOAL)
      }
    }

    const createGoal = async (form: Omit<ProjectGoalForm, 'added_by' | 'created_at'>) => {
      ensureAuth()
      try {
        begin(ProjectLoading.CREATING_GOAL)
        const payload: ProjectGoalForm = {
          ...form,
          created_at: new Date().toISOString(),
          added_by: auth.userId!,
        }
        const { data, error } = await goalService.createGoal(payload)
        if (error) throw new Error(error.message)
        if (data) return data[0]
      } catch (error) {
        handleError('Getting project goals', error)
      } finally {
        finish(ProjectLoading.CREATING_GOAL)
      }
    }

    const updateGoal = async (id: string, form: Partial<ProjectGoal>) => {
      try {
        begin(ProjectLoading.UPDATING_GOAL)
        const payload = { ...form, updated_at: new Date().toISOString() }
        const { status, error } = await goalService.updateGoal(id, payload)
        if (error) throw new Error(error.message)
        if (status === 204) return true

        return false
      } catch (error) {
        handleError('Getting project goals', error)
        return false
      } finally {
        finish(ProjectLoading.UPDATING_GOAL)
      }
    }

    const deleteGoal = async (id: string) => {
      try {
        begin(ProjectLoading.DELETING_GOAL)
        const { status, error } = await goalService.deleteGoal(id)
        if (error) throw new Error(error.message)
        if (status === 204) return true
      } catch (error) {
        handleError('Getting project goals', error)
        return false
      } finally {
        finish(ProjectLoading.DELETING_GOAL)
      }
    }

    /**
     * MEMBERS
     */

    const addMembers = async (project: string, members: ProjectMemberForm[]) => {
      try {
        begin(ProjectLoading.ADDING_MEMBERS)
        const { status, error } = await service.addMembers(members)
        const memberIds = members.map((m) => m.user_id)
        if (error) throw new Error(error.message)
        if (status === 201) {
          notifyMemberAddition(project, memberIds)

          await activityService.logActivity({
            project_id: project,
            type: ActivityTypes.MEMBERS_ADDED,
            content: `Added ${members.length} member${members.length > 1 ? 's' : ''}`,
            is_private: false,
            target_user_ids: memberIds,
          })

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
      // closeProject,

      addMembers,
      getMembers,
      removeMember,
      isLoading,

      getGoals,
      getGoal,
      createGoal,
      updateGoal,
      deleteGoal,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectStore, import.meta.hot))
}
