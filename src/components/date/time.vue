<template>
  <div
    class="user-select-none absolute top-full z-10 mt-2 rounded-xl border border-slate-300 bg-white p-4"
  >
    <div class="flex gap-4">
      <perfect-scrollbar class="max-h-20">
        <div class="space-y-1 border-r border-r-slate-200 pr-4">
          <div v-for="t in _times" :key="t.time">
            <input
              type="radio"
              class="invisible absolute -z-10 h-0 w-0"
              :name="timeId"
              :id="timeId + t.time"
              :value="t.time"
              v-model="_time.hours"
            />
            <label
              :for="timeId + t.time"
              :value="t.time"
              class="block rounded px-2 py-0.5 font-medium hover:bg-primary/10"
              :class="{
                'bg-primary text-white hover:!bg-primary': t.time === _time.hours,
              }"
            >
              <span>{{ t.label }}</span>
            </label>
          </div>
        </div>
      </perfect-scrollbar>
      <div class="space-y-1">
        <div v-for="m in _meridiems" :key="m">
          <input
            type="radio"
            class="invisible absolute -z-10 h-0 w-0"
            :name="meridiemId"
            :id="meridiemId + m"
            :value="m"
            v-model="_time.meridiem"
          />
          <label
            :for="meridiemId + m"
            class="block rounded px-2 py-0.5 font-medium hover:bg-primary/10"
            :class="{
              'bg-primary text-white hover:!bg-primary': m === _time.meridiem,
            }"
          >
            <span>{{ m }}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/style.css'
import useCustomId from '@/composables/useCustomId'
import { ref, watch } from 'vue'
import moment from 'moment'

/**
 * TIME LOGIC
 */

interface Time {
  hours?: number
  meridiem?: 'AM' | 'PM'
}
const timeId = useCustomId()
const meridiemId = useCustomId()
const _times = Array.from({ length: 11 }).map((t, i) => {
  const _time = i === 0 ? 12 : i
  return {
    time: _time,
    label: `${_time < 10 ? '0' : ''}${_time}:00`,
  }
})

const _meridiems = ['AM', 'PM']
const model = defineModel<string | undefined>()
const _time = ref<Time>({})
const setModel = () => {
  if (!_time.value || !_time.value.hours || !_time.value.meridiem) {
    return
  }
  const { hours, meridiem } = _time.value
  const _hours = meridiem === 'AM' ? hours : hours + 12
  const m: string | undefined = model.value
  if (m) {
    model.value = moment(m).hour(_hours).minutes(0).toISOString()
  }
}

watch(_time, setModel, { deep: true })
watch(model, setModel)
</script>
