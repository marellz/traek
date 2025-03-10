<template>
  <div>
    <form-label v-if="label">
      {{ label }}
      <span v-if="required">&ast;</span>
    </form-label>
    <div class="relative">
      <div class="inline-flex rounded-lg border border-slate-300">
        <div ref="calendar-wrapper" class="flex space-x-2 px-4 py-2">
          <Calendar />
          <input
            type="text"
            class="max-w-32 flex-auto outline-none"
            :value="displayed"
            readonly
            placeholder="Selected date"
            @focus="showCalendar"
          >
          <date-calendar v-show="calendarActive" v-model="model" :disable-older />
        </div>
        <span class="mx-3 border-r border-r-slate-300" />
        <div ref="time-wrapper" class="flex flex-auto items-center space-x-2">
          <Clock9 />
          <input
            type="text"
            class="max-w-32 flex-auto outline-none"
            :value="displayTime"
            readonly
            placeholder="Select time"
            @focus="timeSelectActive = true"
          >
          <date-time v-show="timeSelectActive" v-model="model" />
        </div>
      </div>
    </div>
    <form-error v-if="error" class="mt-1">{{ error }}</form-error>
  </div>
</template>
<script lang="ts" setup>
import DateTime from '@/components/date/time.vue'
import DateCalendar from '@/components/date/calendar.vue'
import FormLabel from '@/components/form/label.vue'
import FormError from '@/components/form/error.vue'
import useCustomId from '@/composables/useCustomId'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { Calendar, Clock9 } from 'lucide-vue-next'
import moment from 'moment'

withDefaults(
  defineProps<{
    label?: string | undefined
    error?: string | undefined
    name?: string | undefined
    placeholder?: string | undefined
    disabled?: boolean
    required?: boolean
    inputClass?: string
    disableOlder?: boolean
  }>(),
  {
    disableOlder: true,
  },
)

const id = ref()

const model = defineModel<string>({})

// displayed : string -> what the calendar shows the user, formatted model
const displayed = computed(() => (model.value ? moment(model.value).format('D/MM/Y') : '')) // update format

const displayTime = computed(() => (model.value ? moment(model.value).format('h:mm A') : ''))

const calendarActive = ref(false)
const calendarWrapper = useTemplateRef('calendar-wrapper')
const showCalendar = () => {
  if (!calendarActive.value) calendarActive.value = true
}

onClickOutside(calendarWrapper, () => {
  if (calendarActive.value) calendarActive.value = false
})

const timeSelectActive = ref(false)
const timeWrapper = useTemplateRef('time-wrapper')

onClickOutside(timeWrapper, () => {
  if (timeSelectActive.value) timeSelectActive.value = false
})

onMounted(() => {
  moment.updateLocale('en', {
    week: {
      dow: 1,
    },
  })

  id.value = useCustomId()
})
</script>
