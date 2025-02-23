import { acceptHMRUpdate, defineStore } from 'pinia'
import AuthService, { type AuthPayload } from '@/services/auth'
import { computed, ref, watch } from 'vue'
import { useErrorStore } from './errors'
import type { AuthUser } from '@supabase/supabase-js'

export type User = AuthUser

export type UserProfile = {
  id: string
  email: string
  username: string
  name: string | null
  phone: string | null
  avatar: string | null
  avatar_url: string | null
  created_at: string
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const loading = ref(false)
    const errors = ref<Record<string, string> | null>(null)
    const { handleError } = useErrorStore()
    const isAuthenticated = computed(() => user.value !== null)

    const init = async () => {
      try {
        const response = await AuthService.init()
        if (response) {
          getUser()
        } else {
          user.value = null
        }
      } catch {
        user.value = null
      }
    }

    const login = async (payload: AuthPayload) => {
      loading.value = true
      resetErrors()
      try {
        const {
          data: { user },
          error,
        } = await AuthService.login(payload)
        if (error) {
          errors.value = {
            Login: error.message,
          }
          return
        }
        if (user) {
          await getUser()
          return true
        }
        return false
      } catch (error) {
        handleError('Login error', error)
        return false
      } finally {
        loading.value = false
      }
    }

    const getUser = async () => {
      try {
        const { data } = await AuthService.getUser()
        if (data.user) {
          user.value = data.user
        }
      } catch (error) {
        handleError('Getting user error', error)
      }
    }

    const register = async (payload: AuthPayload) => {
      resetErrors()
      loading.value = true
      try {
        const response = await AuthService.register(payload)
        if (response) {
          await login(payload)
        }
      } catch (error) {
        handleError('Registration error', error)
      } finally {
        loading.value = false
      }
    }

    const logout = async () => {
      loading.value = true
      try {
        await AuthService.logout()
      } catch (error) {
        handleError('Logout error', error)
      } finally {
        user.value = null
        loading.value = false
      }
    }

    const resetPassword = async (email: string) => {
      loading.value = true
      try {
        const { data, error } = await AuthService.resetPassword(email)
        if (error) {
          handleError('Resetting password', error.message)
        }
        if (data) {
          return true
        }

        return false
      } catch (err) {
        handleError('Resetting password', err)
      } finally {
        loading.value = false
      }

      return false
    }

    const updatePassword = async (password: string) => {
      loading.value = true
      try {
        const token = await AuthService.updatePassword(password)
        if (token) {
          return true
        }
        return false
      } catch (error) {
        handleError('Updating password', error)
      } finally {
        loading.value = false
      }
    }

    watch(user, async (v) => {
      if (!v) {
        profile.value = null
        return
      }

      getProfile()
    })

    /**
     * PROFILE
     */

    const profile = ref<UserProfile | null>(null)

    const getProfiles = async (params: { name?: string; email?: string } = {}) => {
      console.log(params)
    }

    const getProfile = async () => {
      if (!user.value) {
        return null
      }
      try {
        const { data, error } = await AuthService.getProfile(user.value.id)
        if (error) {
          handleError('Getting profile', error)
          return false
        }

        if (data) {
          profile.value = data[0]
          return true
        }

        return false
      } catch (error) {
        handleError('Getting profile', error)
      }
    }

    const updateProfile = async (form: UserProfile) => {
      if (!user.value) {
        return
      }
      // update
      try {
        const { status } = await AuthService.updateProfile(user.value.id, form)
        if (status === 204) {
          profile.value = { ...profile, ...form }
        }

        return false
      } catch (error) {
        handleError('Updating profile', error)
      }
    }

    const resetErrors = () => {
      errors.value = null
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
    persist: {
      storage: sessionStorage,
      pick: ['user', 'profile'],
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
