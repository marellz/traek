import { acceptHMRUpdate, defineStore } from 'pinia'
import { useToastsStore } from './toasts'
import { ref } from 'vue'

export const useErrorStore = defineStore(
  'errors',
  () => {
    const error = ref<any>(null)
    const toasts = useToastsStore()
    const handleError = (message: string, description: any) => {
      error.value = {
        message,
        description,
      }

      toasts.addError(message, description)

      console.error({
        message,
        error: description,
      })
    }
    const resetError = () => {
      error.value = null
    }

    return {
      error,
      handleError,
      resetError,
    }
  },
  {
    persist: false,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useErrorStore, import.meta.hot))
}
