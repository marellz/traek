import { acceptHMRUpdate, defineStore } from 'pinia'

export const useEventStore = defineStore('project_events', () => {}, {
  persist: false,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEventStore, import.meta.hot))
}
