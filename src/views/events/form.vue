<template>
  <layout-container class="py-10">
    <h1 class="text-4xl">{{ isEdit ? 'Update event' : 'Create event' }}</h1>
    <div class="mt-10">
      <event-form :project-id="id" :edit="id" @submit="handleSubmit"></event-form>
    </div>
  </layout-container>
</template>
<script lang="ts" setup>
import EventForm from '@/components/object-forms/event-form.vue'
import { useEventStore, type EventFormPayload, type ProjectEventForm } from '@/stores/event'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const eventStore = useEventStore()
const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)
const project = computed(() => route.params.project as string | null)
const isEdit = computed(() => !!id.value && !project.value)
const handleSubmit = (payload: EventFormPayload) => {
  if (id.value) {
    updateEvent(payload.form)
  } else {
    createEvent(payload)
  }
}

const updateEvent = async (form: ProjectEventForm) => {
  if (!id.value) {
    return
  }

  const payload = {
    ...form,
    event_invitees: undefined,
    created_by: form.created_by
  }

  const success = await eventStore.update(id.value, payload)
  if (success) {
    // redirect
    router.push({
      name: "project-events",
      params: {
        id: form.project_id
      }
    })
  }
}

const createEvent = async ({ form, invitees = [] }: EventFormPayload) => {
  if (!project.value) throw new Error('Project ID missing')
  const payload = { ...form, project_id: project.value }
  const success = await eventStore.create(payload, invitees)
  if (success) {
    router.push({
      name: "project-events",
      params: {
        id: project.value
      }
    })
  }
}
</script>