import { acceptHMRUpdate, defineStore } from 'pinia'
import { useErrorStore } from '@/stores/errors'
import { useUserService } from '@/services/user'
import { useAuthStore } from '@/stores/auth'
import { useLoadingState } from '@/composables/useLoading'
import { useAvatarService } from '@/services/avatars'

export enum UserLoading {
  GETTING_ONE = 'getting-user-profile',
  GETTING_MANY = 'getting-user-profiles',
  QUERYING_USERS = 'querying-users',
  GETTING_LINK = 'getting-avatar-link',
  CHECKING_USERNAME = 'checking-username',
}

export interface AvatarTransform {
  size:number
}

export const useUserStore = defineStore(
  'users',
  () => {
    const { handleError } = useErrorStore()
    const service = useUserService()
    const avatarService = useAvatarService()
    const auth = useAuthStore()
    const { isLoading, finish, begin } = useLoadingState()

    const getProfile = async (q: string, column: 'id' | 'username' = 'id') => {
      auth.ensureAuth()

      try {
        begin(UserLoading.GETTING_ONE)
        const { error, data } = await service.getProfile(q, column)
        if (error) {
          handleError('Getting profiles', error.message)
        }

        if (data) {
          return data
        }

        return null
      } catch (error) {
        handleError('Getting profiles', error)
      } finally {
        finish(UserLoading.GETTING_ONE)
      }
    }

    const getProfiles = async (list: string[], column: 'id' | 'username' = 'id') => {
      auth.ensureAuth()

      try {
        begin(UserLoading.GETTING_MANY)
        const { error, data } = await service.getProfiles(list, column)
        if (error) {
          handleError('Getting profiles', error.message)
        }

        if (data) {
          return data
        }

        return null
      } catch (error) {
        handleError('Getting profiles', error)
      } finally {
        finish(UserLoading.GETTING_MANY)
      }
    }

    const queryUsers = async (query: string) => {
      auth.ensureAuth()

      try {
        begin(UserLoading.QUERYING_USERS)
        const { data, error } = await service.queryUsers({ query })
        if (error) {
          handleError('Querying users', error.message)
        }

        if (data) {
          return data.filter((u) => u.id !== auth.userId! && u.username !== null)
        }

        return null
      } catch (error) {
        handleError('Querying users', error)
      } finally {
        finish(UserLoading.QUERYING_USERS)
      }
    }

    const getAvatarLink = async (path: string) => {
      try {
        begin(UserLoading.GETTING_LINK)
        const { data } = await avatarService.getAvatarLink(path)
        if (!data.publicUrl) throw new Error('Invalid/not found')
        return data.publicUrl
      } catch (error) {
        handleError('Getting avatar link', error)
      } finally {
        finish(UserLoading.GETTING_LINK)
      }
    }

    const checkUsername = async (username: string) => {
      try {
        begin(UserLoading.CHECKING_USERNAME)
        const { count, status } = await service.checkUsername(username)
        if (status !== 200) {
          handleError('Checking username', 'Unknown error')
        }

        if (count && count === 0) {
          return true
        }

        return false
      } catch (error) {
        handleError('Checking username', error)
      } finally {
        finish(UserLoading.CHECKING_USERNAME)
      }
    }

    return {
      getProfile,
      getProfiles,
      queryUsers,
      checkUsername,
      getAvatarLink,

      //
      isLoading,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
