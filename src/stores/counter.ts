import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {}, {
  persist: true,
})
