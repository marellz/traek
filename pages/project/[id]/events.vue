<template>
  <div>
    <div class="flex items-center space-x-2">
      <h1 class="text-4xl font-light">Project events</h1>
      <base-button class="!ml-auto" @click="showEventFormModal = true">
        <span>Create event</span>
      </base-button>
    </div>
    <base-loader v-if="loading.gettingEvents" class="py-20" />
    <div v-else-if="filteredEvents.length" class="mt-10 space-y-4">
      <div class="mb-4">
        <form-checkbox v-model="showCancelled" label="Show cancelled" />
      </div>
      <event-item
        v-for="item in filteredEvents"
        :key="item.id"
        :item
        :cancelling="loading.cancelling && cancelId === item.id"
        @cancel-event="cancelEvent"
        @edit-event="editEvent"
      />
    </div>
    <Empty v-else class="mt-10" text="No events created in the project" />
    <base-modal v-model:show="showEventFormModal" :title="edit ? 'Update event' : 'Create event'">
      <event-form :project-id="id" :edit @submit="handleSubmit" />
    </base-modal>
  </div>
</template>
<script lang="ts" setup>
import EventForm from '@/components/object-forms/event.vue'
import {
  EventLoading,
  useEventStore,
  type ProjectEvent,
  type ProjectEventForm,
} from '@/stores/event'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Empty from '@/components/common/empty.vue'

const route = useRoute()
const id = computed(() => route.params.id as string)
const eventStore = useEventStore()
const events = ref<ProjectEvent[]>([])
const loading = computed(() => ({
  gettingEvents: eventStore.isLoading(EventLoading.GETTING),
  cancelling: eventStore.isLoading(EventLoading.CANCELLING),
}))

const cancelId = ref<string | null>(null)
const edit = ref<string | null>(null)

watch(edit, (v) => {
  if (v) {
    showEventFormModal.value = true
  }
})

const getEvents = async () => {
  const _events = await eventStore.getEvents(id.value)
  if (_events) {
    events.value = _events
  }
}
interface EventFormPayload {
  form: ProjectEventForm
  invitees: string[]
}

const handleSubmit = (payload: EventFormPayload) => {
  if (edit.value) {
    updateEvent(payload.form)
  } else {
    createEvent(payload)
  }
}

const editEvent = (id: string) => {
  edit.value = id
  showEventFormModal.value = true
}

const updateEvent = async (form: ProjectEventForm) => {
  if (!edit.value) {
    return
  }

  const success = await eventStore.update(edit.value, form)
  if (success) {
    edit.value = null
    showEventFormModal.value = false

    getEvents()
  }
}

const createEvent = async ({ form, invitees = [] }: EventFormPayload) => {
  const payload = { ...form, project_id: id.value }
  const success = await eventStore.create(payload, invitees)
  if (success) {
    showEventFormModal.value = false
    getEvents()
  }
}

const cancelEvent = async (id: string) => {
  const _event = events.value.find((e) => e.id === id)
  if (!_event) {
    return
  }

  cancelId.value = id
  // reset creator
  const payload = {
    ..._event,
    created_by: _event.created_by.id,
  }

  const success = await eventStore.cancelEvent(payload)
  if (success) {
    cancelId.value = null
    getEvents()
  }
}
const showCancelled = ref(false)
const filteredEvents = computed(() =>
  showCancelled.value ? events.value : events.value.filter((e) => e.cancelled_at === null),
)
const showEventFormModal = ref(false)

onMounted(() => {
  getEvents()
})
</script>
