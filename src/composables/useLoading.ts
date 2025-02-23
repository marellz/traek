import { ref, watch } from 'vue'

export const useLoadingState = () => {
  const loading = ref<string[]>([])

  const begin = (key: string) => {
    loading.value.push(key)
  }

  const finish = (key: string) => {
    const i = loading.value.indexOf(key)
    if (i !== -1) {
      loading.value.splice(i, 1)
    }
  }

  const isLoading = (key: string) => {
    return loading.value.includes(key)
  }

  watch(loading,(v)=>console.log(v))

  return {
    loading,
    begin,
    finish,
    isLoading,
  }
}
