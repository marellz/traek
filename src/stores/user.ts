import { acceptHMRUpdate, defineStore } from 'pinia'
import { useErrorStore } from './errors'
import { useUserService } from '@/services/user'
import { useAuthStore } from './auth'
import { useLoadingState } from '@/composables/useLoading'

enum UserLoading {
  GETTING_ONE = 'getting-user-profile',
  GETTING_MANY = 'getting-user-profiles',
  QUERYING_USERS ='querying-users',
  CHECKING_USERNAME = 'checking-username'
}

export const useUserStore = defineStore(
  'counter',
  () => {
    const { handleError } = useErrorStore()
    const service = useUserService()
    const auth = useAuthStore()
    const {isLoading, finish, begin} = useLoadingState()

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

      //
      isLoading
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
