import { acceptHMRUpdate, defineStore } from 'pinia'

export const useTaskStore = defineStore('project_tasks', () => {}, {
  persist: false,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTaskStore, import.meta.hot))
}
