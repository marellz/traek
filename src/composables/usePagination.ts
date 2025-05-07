import { ref } from 'vue'

export const usePagination = () => {
  const range = ref({ start: 0, end: 9 })
  const rangeLimit = ref(false)

  const markRangeLimit = (limit: boolean) => {
    rangeLimit.value = limit
  }

  const resetRange = () => {
    range.value = { start: 0, end: 9 }
    rangeLimit.value = false
  }

  const nextRange = (callback: () => any) => {
    if (rangeLimit.value) return
    const { end } = range.value
    range.value = {
      start: end + 1,
      end: end + 10,
    }

    callback()
  }

  const previousRange = (callback: () => any) => {
    if (range.value.start === 0) return
    const { start } = range.value
    range.value = {
      start: start - 10,
      end: start - 1,
    }

    callback()
  }

  return {
    range,
    markRangeLimit,
    resetRange,
    nextRange,
    previousRange,

    rangeLimit,
  }
}
