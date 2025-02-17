import { acceptHMRUpdate, defineStore } from 'pinia'

export const useProjectStore = defineStore('projects', () => {}, {
  persist: false,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectStore, import.meta.hot))
}
