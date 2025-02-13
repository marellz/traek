import { acceptHMRUpdate, defineStore } from 'pinia'
import AuthService, { type AuthPayload } from '@/services/auth'
import { computed, ref } from 'vue'
import { useErrorStore } from './errors'
import { useRouter } from 'vue-router'

export interface User {
  email: string
  name: string | null
  phone: string
  $id: string
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<User | null>(null)
    const profile = ref()
    const loading = ref(false)
    const errors = ref<any[]>([])
    const errorStore = useErrorStore()
    const router = useRouter()

    const isAuthenticated = computed(() => user.value !== null)

    const init = async () => {
      try {
        const response = await AuthService.init()
        if (response) {
          user.value = response
        } else {
          user.value = null
        }
      } catch (error) {
        user.value = null
        errorStore.handleError('Auth init', error)
      }
    }

    const login = async (payload: AuthPayload) => {
      try {
        const response = await AuthService.login(payload)
        if (response) {
          router.push('/dashboard')
        }
      } catch (error) {
        errorStore.handleError('Login error', error)
      }
    }

    const register = async (payload: AuthPayload) => {
      console.log('register!')
      try {
        const response = await AuthService.register(payload)
        console.log(response)
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
      await AuthService.resetPassword(email)
    }

    const updatePassword = async (password: string) => {
      await AuthService.resetPassword(password)
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
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
