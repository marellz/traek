<template>
  <div
    class="user-select-none absolute top-full z-10 mt-2 rounded-xl border border-slate-300 bg-white p-4"
  >
    <div class="flex items-center space-x-2 border-b border-slate-300 pb-2">
      <button type="button" class="btn rounded p-1 hover:bg-slate-100" @click="lastMonth">
        <ArrowLeft></ArrowLeft>
      </button>
      <div class="flex flex-auto justify-center space-x-2 font-medium">
        <p>{{ _months[month] }}</p>
        <p>{{ year }}</p>
      </div>
      <button type="button" class="btn rounded p-1 hover:bg-slate-100" @click="nextMonth">
        <ArrowRight></ArrowRight>
      </button>
    </div>
    <table v-if="calendar" class="mt-4">
      <thead>
        <tr>
          <th v-for="d in weekDays" :key="d">
            <span class="user-select-none block h-10 w-10 text-slate-300">
              {{ d }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, i) in calendar" :key="i">
          <td v-for="(day, i2) in week.days" :key="`${i}-${i2}`">
            <button
              type="button"
              class="hover:bg-slate user-select-none h-8 w-8 rounded-lg bg-transparent text-sm font-medium text-black hover:bg-primary/10 disabled:text-gray-300"
              :class="{
                '!bg-primary !text-white': isSelectedDay(day.dateString),
                'bg-red-500': disableOlder && day.isBeforeToday,
              }"
              :disabled="disableOlder && day.isBeforeToday"
              @click="selectDate(day.dateString)"
            >
              {{ day.date }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts" setup>
import moment from 'moment'
import { computed, onMounted, ref, watch } from 'vue'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
defineProps<{
  disableOlder: boolean
}>()

type Day = {
  dateString: string // iso date
  date: number
  isBeforeToday: boolean
  isOnADifferentMonth: boolean
}

type Calendar = { days: Day[] }[]

/**
 * CALENDAR LOGIC
 */

const _months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const weekDays = computed(() => 'MTWTFSS'.split(''))

// reference point
const today = moment()

// number: calendar display month, will change as user moves back and forth
const month = ref(today.month())
const year = ref(today.year())

// model : string(iso) -> what the calendar emits as value
const model = defineModel<string>({})

// calendar: array of week arrays
const calendar = ref<Calendar>([])

const buildCalendar = () => {
  const currentMonth = month.value
  const currentYear = year.value
  const startDate = moment().month(currentMonth).year(currentYear).startOf('month').startOf('week')
  const endDate = moment().month(currentMonth).year(currentYear).endOf('month').startOf('week')
  const date = startDate.clone().subtract(1, 'day')

  calendar.value = []
  while (date.isBefore(endDate, 'day')) {
    calendar.value.push({
      days: Array(7)
        .fill({})
        .map(() => {
          date.add(1, 'day')
          return {
            date: date.date(),
            isBeforeToday: date.isBefore(today, 'day'),
            isOnADifferentMonth: date.month() !== today.month(),
            dateString: date.toISOString(),
          }
        }),
    })
  }
}

// user action to select a date
const selectDate = (dateString: string) => {
  model.value = dateString
}

const isSelectedDay = (dateString: string) => {
  return moment(dateString).isSame(moment(model.value), 'day')
}

const lastMonth = () => {
  let _m = (month.value -= 1)
  if (_m < 0) {
    _m = 11
    year.value -= 1
  }

  month.value = _m
}

const nextMonth = () => {
  let _m = (month.value += 1)
  if (_m > 11) {
    _m = 0
    year.value += 1
  }
  month.value = _m
}

watch(month, buildCalendar)
onMounted(buildCalendar)
onMounted(() => {
  if (!model.value) {
    model.value = moment().add(1, 'hour').startOf('hour').toISOString()
  }
})
</script>
