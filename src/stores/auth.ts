import { acceptHMRUpdate, defineStore } from 'pinia'
import AuthService, { type AuthPayload } from '@/services/auth'
import { computed, ref, watch } from 'vue'
import { useErrorStore } from './errors'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const { handleError } = useErrorStore()

    const user = ref<User | null>(null)
    const loading = ref(false)
    const errors = ref<Record<string, string> | null>(null)
    const isAuthenticated = computed(() => user.value !== null)
    const userId = computed(() => (user.value ? user.value.id : null))

    const init = async () => {
      try {
        const {
          data: { user: sessionUser },
        } = await AuthService.getUser()

        if (sessionUser) {
          user.value = sessionUser
        } else {
          user.value = null
        }
      } catch {
        handleError('Auth initialization', 'Error occurred initializing user')
      }
    }

    const login = async (payload: AuthPayload) => {
      loading.value = true
      resetErrors()
      try {
        const {
          data: { user: _user },
          error,
        } = await AuthService.login(payload)
        if (error) {
          errors.value = {
            Login: error.message,
          }
        }

        if (_user) {
          user.value = _user
          return user
        }

        return null
      } catch (error) {
        handleError('Login error', error)
        return false
      } finally {
        loading.value = false
      }
    }

    const getUser = async () => {
      try {
        const { data, error } = await AuthService.getUser()
        if (error) {
          handleError('Getting user', error.message)
        }
        if (data.user) {
          user.value = data.user
          return data.user
        }

        return null
      } catch (error) {
        handleError('Getting user error', error)
      }
    }

    const register = async (payload: AuthPayload) => {
      resetErrors()
      loading.value = true
      try {
        const { data, error } = await AuthService.register(payload)
        if (error) {
          handleError('Registering user', error.message)
        }

        if (data.user) {
          user.value = data.user

          return data.user
        }

        return null
      } catch (error) {
        handleError('Registration error', error)
      } finally {
        loading.value = false
      }
    }

    const logout = async () => {
      loading.value = true
      try {
        const { error } = await AuthService.logout()
        if (error) {
          handleError('Logging out', error.message)
          return false
        }

        return true
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
    })

    //

    const ensureAuth = () => {
      if (isAuthenticated.value) {
        return true
      }

      throw new Error('User not authenticated')
    }

    /**
     * PROFILE
     */

    const profile = ref<UserProfile | null>(null)
    const hasProfile = computed(
      () => profile.value !== null && profile.value.name && profile.value.username,
    )

    const getProfile = async () => {
      if (!userId.value) {
        return null
      }
      try {
        loading.value = true
        const { data, error } = await AuthService.getProfile(userId.value)
        if (error) {
          handleError('Getting profile', error)
          return false
        }

        if (data) {
          profile.value = data[0]
          return data[0]
        }

        return false
      } catch (error) {
        handleError('Getting profile', error)
      } finally {
        loading.value = false
      }
    }

    const updateProfile = async (form: UserProfileForm) => {
      if (!userId.value) {
        return
      }
      // update
      try {
        loading.value =  true
        const { status } = await AuthService.updateProfile(userId.value, form)
        if (status === 204) {
          profile.value = { ...profile.value, ...form }

          return true
        }

        return false
      } catch (error) {
        handleError('Updating profile', error)
      } finally {
        loading.value =  true
      }
    }

    const resetErrors = () => {
      errors.value = null
    }

    return {
      isAuthenticated,
      user,
      userId,
      loading,
      errors,
      init,
      login,
      register,
      logout,
      resetErrors,
      resetPassword,
      updatePassword,
      getUser,

      // profile
      profile,
      hasProfile,
      getProfile,
      updateProfile,
      //
      ensureAuth,
    }
  },
  {
    persist: {
      storage: localStorage,
      pick: ['user', 'profile'],
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}

export type UserProfile = {
  id: string
  email?: string
  username: string | null
  name: string | null
  phone?: string | null
  avatar?: string | null
  avatar_url?: string | null
  created_at: string
}

export type UserProfileForm = {
  id: string
  name: string
  email?: string
  username: string
  phone?: string | null
  avatar?: string | null
  avatar_url?: string | null
  created_at: string
}
