<template>
  <router-link :to="{ name: 'event', params: { id: item.id } }" class="block">
    <div class="rounded-xl border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 p-4" ref="card">
      <div class="flex space-x-3">
        <div class="rounded-lg bg-primary/20 py-2 px-4 self-start" :class="{ 'bg-slate-800/10': isCancelled }">
          <div class="text-center">
            <p class="text-2xl font-bold">
              {{ dateData.date }}
            </p>
            <p class="text-sm">{{ dateData.month }}</p>
          </div>
        </div>
        <div class="flex-auto">
          <div>
            <div class="flex items-center space-x-2">
              <h1 class="text-2xl font-medium">{{ item.title }}</h1>
              <base-tag :class="eventStatusColors[item.status as EventStatus]">
                <span>
                  {{ eventStatuses[item.status as EventStatus] }}
                </span>
              </base-tag>
            </div>
            <p class="">{{ item.description }}</p>
          </div>
          <div class="flex items-center space-x-2 text-sm mt-2">
            <p class="text-sm">
              {{ eventTypes[item.event_type as EventTypes] }}
            </p>
            <span>|</span>
            <div class="flex items-center space-x-2">
              <template v-if="item.event_type === 'online'">
                <Link :size="16" /> <span>{{ item.url ?? 'Invalid/no link' }}</span>
              </template>
              <template v-else>
                <MapPin :size="16" />
                <span>
                  {{ item.venue }}
                </span>
              </template>
            </div>
            <span>|</span>
            <span>{{ dateData.time }}</span>
            <template v-if="duration">
              <span>|</span>
              <span>{{ duration }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts" setup>
import { eventStatusColors, eventStatuses, eventTypes, type EventStatus, type EventTypes } from '@/data/event-data'
import { type ProjectEvent } from '@/stores/event'
import { Link, MapPin } from 'lucide-vue-next'
import { computed } from 'vue'
import moment from 'moment'

const props = defineProps<{
  item: ProjectEvent
  cancelling?: boolean
}>()

// computations
const dateData = computed(() => {
  const _d = moment(props.item.datetime)

  return {
    date: _d.format('DD'),
    month: _d.format('MMM'),
    time: _d.format('h:mm A'),
  }
})

const duration = computed(() => {
  const dur = props.item.duration_hours
  if (!dur) {
    return null
  }

  return dur < 1 ? dur * 60 + 'min' : dur + 'h'
})

const isCancelled = computed(() => props.item.cancelled_at !== null)


// todo: implement in CRON

// const status = computed<EventStatus>(() => {
//   const startTime = moment(props.item.datetime)
//   const endTime = startTime.clone().add(duration.value)
//   const now = moment()
//   if (props.item.cancelled_at !== null) return 'cancelled'
//   if (now.isAfter(endTime)) return 'past'
//   if (now.isAfter(startTime) && now.isBefore(endTime)) return 'in_progress'
//   return 'upcoming'
// })

</script>
