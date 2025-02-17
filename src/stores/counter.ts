import { acceptHMRUpdate, defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {}, {
  persist: false,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCounterStore, import.meta.hot))
}
