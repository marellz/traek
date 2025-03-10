<template>
  <div ref="card" class="rounded-xl border border-slate-300 p-4" :class="[statusColor[status]]">
    <div class="flex space-x-3">
      <div
        class="bg-primary/20 self-start rounded-lg p-4"
        :class="{ 'bg-slate-800/10': item.cancelled_at !== null }"
      >
        <div class="text-center">
          <p class="text-4xl font-bold">
            {{ dateData.date }}
          </p>
          <p>{{ dateData.month }}</p>
        </div>
      </div>
      <div class="flex-auto" :class="{ 'space-y-2': showMore }">
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="text-2xl font-medium">{{ item.title }}</h1>
            <span
              class="rounded-full border border-slate-300 px-2 py-0.5 text-sm font-medium text-slate-700"
              >{{ eventStatuses[item.status as EventStatus] }}</span
            >

            <div class="ml-auto flex space-x-2">
              <base-action @click="toggleShowMore">
                <ChevronDown
                  class="rotate-0 transform transition ease-in-out"
                  :class="{ 'rotate-180': showMore }"
                />
              </base-action>
              <base-action @click="editEvent(item.id)">
                <span>Edit</span>
              </base-action>
              <base-action
                :disabled="cancelling || item.cancelled_at"
                @click="cancelEvent(item.id)"
              >
                <span v-if="item.cancelled_at">Cancelled</span>
                <span v-else>Cancel</span>
              </base-action>
            </div>
          </div>
          <p v-show="showMore" class="">{{ item.description }}</p>
        </div>
        <div class="flex items-center space-x-2 border-l-2 border-slate-200 p-2">
          <p class="text-sm">
            {{ eventTypes[item.event_type as EventTypes] }}
          </p>
          <span>|</span>
          <div class="flex items-center space-x-2 text-sm">
            <template v-if="item.event_type === 'online'">
              <Link :size="12" /> <span>{{ item.url ?? 'Invalid/no link' }}</span>
            </template>
            <template v-else>
              <MapPin :size="12" />
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
        <div v-show="showMore" class="flex space-x-2">
          <div>
            <h2 class="text-sm font-medium">Created by</h2>
            <p>
              {{ item.created_by.name }}
            </p>
          </div>
          <span class="border-l border-gray-200" />
          <template v-if="loading.gettingInvitees">
            <base-loader class="py-0" />
          </template>
          <div v-else>
            <h2 class="text-sm font-medium">Invitees</h2>
            <template v-if="invitees.length">
              <p v-for="user in invitees" :key="user.id">
                {{ user.name || user.email }}
              </p>
            </template>
            <template v-else>
              <p class="italic">No invitees</p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { eventStatuses, eventTypes, type EventStatus, type EventTypes } from '@/data/event-data'
import type { UserProfile } from '@/stores/auth'
import { EventLoading, useEventStore, type ProjectEvent } from '@/stores/event'
import { onClickOutside } from '@vueuse/core'
import { ChevronDown, Link, MapPin } from 'lucide-vue-next'
import moment from 'moment'
import { computed, ref, useTemplateRef } from 'vue'

const props = defineProps<{
  item: ProjectEvent
  cancelling?: boolean
}>()

const eventStore = useEventStore()
const loading = computed(() => ({
  gettingInvitees: eventStore.isLoading(EventLoading.GETTING_INVITEES),
}))

// invitees
const invitees = ref<UserProfile[]>([])
const getInvitees = async () => {
  const _users = await eventStore.getInvitees(props.item.id)
  if (_users) {
    invitees.value = _users
  }
}

// showMore
const showMore = ref(false)
const toggleShowMore = () => {
  if (showMore.value) {
    showMore.value = false
  } else {
    getInvitees()
    showMore.value = true
  }
}

const wrapper = useTemplateRef('card')
onClickOutside(wrapper, () => {
  showMore.value = false
})

// actions
const emit = defineEmits(['cancel-event', 'edit-event'])

const cancelEvent = (id: string) => {
  emit('cancel-event', id)
}

const editEvent = (id: string) => {
  emit('edit-event', id)
}

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

const status = computed<EventStatus>(() => {
  const startTime = moment(props.item.datetime)
  const endTime = startTime.clone().add(duration.value)
  const now = moment()
  if (props.item.cancelled_at !== null) return 'cancelled'
  if (now.isAfter(endTime)) return 'past'
  if (now.isAfter(startTime) && now.isBefore(endTime)) return 'in_progress'
  return 'upcoming'
})

const statusColor: Record<EventStatus, string> = {
  upcoming: '',
  past: '',
  in_progress: 'border-green-500',
  cancelled: 'bg-slate-100 opacity-80 text-slate-500',
}
</script>
