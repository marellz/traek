import { acceptHMRUpdate, defineStore } from 'pinia'
import AuthService, { type AuthPayload } from '@/services/auth'
import { computed, ref } from 'vue'
import { useErrorStore } from './errors'
import type { Models } from 'appwrite'

export interface User extends Models.User<Models.Preferences> {
  name: string;
}

export type UserProfile = {
  $id: string
  email: string
  username: string
  name: string | null
  phone: string | null
  avatar: string | null
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const profile = ref<UserProfile | null>(null)
    const loading = ref(false)
    const errors = ref<any[]>([])
    const errorStore = useErrorStore()

    const isAuthenticated = computed(() => user.value !== null)

    const init = async () => {
      try {
        const response = await AuthService.init()
        if (response) {
          user.value = response
        } else {
          user.value = null
        }
      } catch {
        user.value = null
      }
    }

    const login = async (payload: AuthPayload) => {
      try {
        const response = await AuthService.login(payload)
        if (response) {
          await getUser()
          return true
        }
        return false
      } catch (error) {
        errorStore.handleError('Login error', error)
        return false
      }
    }

    const getUser = async () => {
      try {
        const response = await AuthService.getUser()
        if (response) {
          user.value = response
        }
      } catch (error) {
        errorStore.handleError('Getting user error', error)
      }
    }

    const register = async (payload: AuthPayload) => {
      try {
        const response = await AuthService.register(payload)
        if (response) {
          await login(payload)
        }
      } catch (error) {
        errorStore.handleError('Registration error', error)
      }
    }

    const logout = async () => {
      try {
        await AuthService.logout()
      } catch (error) {
        errorStore.handleError('Logout error', error)
      } finally {
        user.value = null
      }
    }

    const resetPassword = async (email: string) => {
      const token = await AuthService.resetPassword(email)
      if (token) {
        return true
      }

      return false
    }

    const updatePassword = async (userId: string, secret: string, password: string) => {
      const token = await AuthService.updatePassword(userId, secret, password)
      if (token) {
        return true
      }

      return false
    }

    /**
     * PROFILE
     */

    const getProfiles = async (params: { name?: string; email?: string } = {}) => {
      console.log(params)
    }

    const getProfile = async (id: string) => {
      console.log(id)
    }

    const updateProfile = async (form: UserProfile) => {
      if (!(user.value !== null && form.$id === user.value?.$id)) {
        return null // todo: forbidden
      }

      // update
    }

    const resetErrors = () => {
      errors.value = []
    }

    return {
      isAuthenticated,
      user,
      profile,
      loading,
      errors,
      init,
      login,
      register,
      logout,
      resetErrors,
      resetPassword,
      updatePassword,

      // profile
      getProfile,
      getProfiles,
      updateProfile,
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
