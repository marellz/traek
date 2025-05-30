<template>
  <div>
    <div class="flex items-center space-x-2">
      <h1 class="text-4xl font-light">Project events</h1>
      <router-link :to="{ name: 'create-event', params: { project: id } }" class="!ml-auto">
        <base-button>
          <span>Create event</span>
          <CalendarPlus :size="20" />
        </base-button>
      </router-link>
    </div>
    <base-loader class="py-20" v-if="loading.gettingEvents"></base-loader>
    <div v-else-if="filteredEvents.length" class="mt-10 space-y-4">
      <div class="mb-4">
        <form-checkbox v-model="showCancelled" label="Show cancelled"></form-checkbox>
      </div>
      <event-item v-for="item in filteredEvents" :key="item.id" :item
        :cancelling="loading.cancelling && cancelId === item.id"></event-item>
    </div>
    <Empty class="mt-10" text="No events created in the project" v-else />
  </div>
</template>
<script lang="ts" setup>
import EventItem from '@/components/event/item.vue'
import FormCheckbox from '@/components/form/checkbox.vue'
import {
  EventLoading,
  useEventStore,
  type ProjectEvent,
} from '@/stores/event'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Empty from '@/components/common/empty.vue'
import { CalendarPlus } from 'lucide-vue-next'

const route = useRoute()
const id = computed(() => route.params.id as string)
const eventStore = useEventStore()
const events = ref<ProjectEvent[]>([])
const loading = computed(() => ({
  gettingEvents: eventStore.isLoading(EventLoading.GETTING),
  cancelling: eventStore.isLoading(EventLoading.CANCELLING),
}))

const cancelId = ref<string | null>(null)

const getEvents = async () => {
  const _events = await eventStore.getEvents(id.value)
  if (_events) {
    events.value = _events
  }
}

const showCancelled = ref(false)
const filteredEvents = computed(() => showCancelled.value ? events.value : events.value.filter(e => e.cancelled_at === null))

onMounted(() => {
  getEvents()
})
</script>
