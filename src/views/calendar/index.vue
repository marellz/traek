<template>
  <layout-container>
    <div class="mt-10">
      <div class="flex items-center justify-between">
        <h1 class="text-4xl">Calendar</h1>
        <base-button @click="getActivities" :loading>
          <span>Refresh</span>
        </base-button>
      </div>
      <div class="grid grid-cols-4 gap-10 mt-10">
        <div>
          <!-- months -->
          <form-select v-model="month">
            <custom-select-option name="months" v-for="v in months" :key="v" :value="v">{{ v }}</custom-select-option>
          </form-select>
        </div>
        <div>
          <!-- years -->
          <form-select v-model="year">
            <custom-select-option name="years" v-for="v in years" :key="v" :value="v">{{ v }}</custom-select-option>
          </form-select>
        </div>
        <div class="flex items-center">
          <form-checkbox v-model="showCancelled" label="Show cancelled"></form-checkbox>
        </div>
      </div>
      <table class="calendar mt-10">
        <thead>
          <tr>
            <th v-for="(wD, index) in 'MTWTFSS'.split('')" :key="index">{{ wD }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, w) in calendar" :key="w">
            <td :width="`${100 / week.length}%`" v-for="(day, d) in week" :key="`${d}-${w}`" class="relative align-top group">
              <div class="flex items-center top-2 left-2 absolute">
                <p class="text-slate-400 dark:text-slate-600 text-xs font-black">
                  {{ day.date }}
                </p>
                <dropdown trigger-class="p-0.5 border-none mt-1 invisible group-hover:visible">
                  <template #trigger >
                    <Plus :size="16" />
                  </template>
                  <dropdown-item>
                    <span>New event</span>
                  </dropdown-item>
                </dropdown>
              </div>

              <div>
                <ul class="space-y-1 mt-4">
                  <li v-for="item in day.activity" :key="item.id">
                    <router-link :to="{ name: item.type, params: { id: item.id } }">
                      <div
                        class="flex items-center border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded p-1">

                        <p class="text-xs">{{ item.title }}</p>
                        <div class="ml-auto" v-if="item.completed">
                          <Check :size="16" class="text-green-500" />
                        </div>
                        <div class="ml-auto" v-if="item.cancelled">
                          <CalendarX :size="16" class="text-orange-500" />
                        </div>
                      </div>
                    </router-link>
                  </li>
                  <li v-if="day.showMore">
                    <a href="#view_more"
                      class="border flex border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded p-1">
                      <p class="text-xs">+ {{ day.allActivity.length - 2 }} more</p>
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </layout-container>
</template>
<script lang="ts" setup>
import FormSelect from '@/components/form/custom/select.vue'
import FormCheckbox from '@/components/form/checkbox.vue'
import CustomSelectOption from '@/components/form/custom/select-option.vue'
import { EventLoading, EventStatusEnum, useEventStore } from '@/stores/event';
import { TaskLoading, TaskStatusEnum, useTaskStore } from '@/stores/task';
import { onMounted, ref, computed, watch } from 'vue';
import moment from 'moment';
import { CalendarX, Check, Plus } from 'lucide-vue-next';

type ActivityType = 'event' | 'task'
interface Activity {
  id: string
  type: ActivityType
  title: string;
  time: string;
  completed?: boolean;
  cancelled?: boolean;
}

interface Day {
  date: number,
  showMore?: boolean,
  allActivity: Activity[],
  activity: Activity[]
}
const tasksStore = useTaskStore()
const eventStore = useEventStore()

const months: string[] = moment.months()
const month = ref<string | number>(months[moment().month()])
const year = ref<number>(moment().year())
const years = computed(() => Array.from({ length: 10 }, (_, c) => moment().year() - c))
const calendar = ref<Day[][]>([])
const loading = computed(() => tasksStore.isLoading(TaskLoading.GETTING_USER_TASKS) && eventStore.isLoading(EventLoading.GETTING_USER))
const dateRange = computed(() => {
  const m = moment().month(month.value).year(year.value)
  return {
    start_date: m.clone().startOf('month').startOf('week'),
    end_date: m.clone().endOf('month').endOf('week'),
  }
})

const buildCalendar = () => {
  const counter = moment(dateRange.value.start_date).clone()
  let days: Day[] = []
  let cal: Day[][] = []

  while (!counter.isAfter(dateRange.value.end_date, 'date')) {
    counter.add(1, 'day')
    const activity = activities.value.filter(a => counter.isSame(moment(a.time), 'day'))
    const limit = 2
    const day = {
      date: counter.date(),
      activity: [...activity].slice(0,limit),
      allActivity: activity,
      showMore: activity.length > limit
    }
    days = [
      ...days,
      day
    ]
  }

  // chunk
  while (days.length > 1) {
    cal = [...cal, days.splice(0, 7)]
  }

  calendar.value = cal
}


const activities = ref<Activity[]>([])
const showCancelled = ref(false)

export interface DateRange {
  start_date: string,
  end_date: string
}

const dateRangeString = computed(() => {
  const { end_date, start_date } = dateRange.value
  return {
    start_date: start_date.toISOString(),
    end_date: end_date.toISOString(),
  }
})

const loadingTasks = ref(false)

const getTasks = async () => {
  loadingTasks.value = true
  // for this one month
  const _tasks = await tasksStore.getUserTasks(dateRangeString.value)
  if (_tasks) {
    activities.value =
      [
        ...activities.value,
        ..._tasks.filter(t => t.due_date !== null).map(t => ({
          id: t.id,
          type: 'task' as ActivityType,
          title: t.title,
          time: t.due_date!,
          // overdue:
          completed: t.status === TaskStatusEnum.COMPLETED
        }))
      ]
  }
}

const getEvents = async () => {
  // for this one month
  const events = await eventStore.getUserEvents(dateRangeString.value)
  if (events) {
    activities.value =
      [
        ...activities.value,
        ...events.map(ev => ({
          id: ev.id,
          type: 'event' as ActivityType,
          title: ev.title,
          time: ev.datetime,
          cancelled: ev.status === EventStatusEnum.CANCELLED,
        }))
      ]
  }
}

const getActivities = async () => {
  activities.value = []
  await Promise.all([getTasks(), getEvents()])
  buildCalendar()
}

watch(dateRange, () => {
  getActivities()
})

onMounted(getActivities)
onMounted(buildCalendar)


</script>
