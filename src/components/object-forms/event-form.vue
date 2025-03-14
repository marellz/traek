<template>
  <div>
    <base-loader v-if="loading.getting || loading.gettingInvitees"></base-loader>
    <Form v-else @submit="submitForm()">
      <div class="space-y-4">
        <form-input label="Event title" v-model="title" :error="errors.title"></form-input>
        <form-text
          label="Event description"
          v-model="description"
          :error="errors.description"
        ></form-text>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <form-group label="Event type">
              <div class="flex flex-wrap gap-4">
                <form-radio
                  v-for="(label, key) in eventTypes"
                  :key
                  :label
                  :value="key"
                  name="event_type"
                  v-model="event_type"
                ></form-radio>
              </div>
            </form-group>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <form-select label="Duration" v-model="duration_hours" :error="errors.duration_hours">
            <option v-for="(value, label) in eventDurations" :key="value" :value>
              {{ label }}
            </option>
          </form-select>
          <div>
            <form-input
              v-if="event_type === 'online'"
              label="URL"
              v-model="url"
              :error="errors.url"
            ></form-input>
            <form-input v-else label="Venue" v-model="venue" :error="errors.venue"></form-input>
          </div>
          <form-datepicker v-model="datetime" label="Date/time"></form-datepicker>
        </div>
        <user-selector
          v-model="invitees"
          label="Invitees"
          :queriedUsers
          @search-users="searchUsers"
          @add-user="addUser"
          @remove-user="removeUser"
        ></user-selector>
        <div>
          <base-button type="submit" :loading="loading.creating || loading.updating" :disabled="eventData && eventData?.cancelled_at !== null">
            <span v-if="editMode">Update event</span>
            <span v-else>Save event</span>
          </base-button>
        </div>
      </div>
    </Form>
  </div>
</template>
<script lang="ts" setup>
import FormInput from '@/components/form/input.vue'
import FormText from '@/components/form/text.vue'
import FormRadio from '@/components/form/radio.vue'
import FormGroup from '@/components/form/group.vue'
import FormSelect from '@/components/form/select.vue'
import userSelector from '@/components/form/user-selector.vue'
import FormDatepicker from '@/components/form/datepicker.vue'
import { eventDurations, eventTypes } from '@/data/event-data'
import { Form, useForm } from 'vee-validate'
import { computed, onMounted, watch, ref } from 'vue'
import * as yup from 'yup'
import { EventLoading, useEventStore, type ProjectEvent } from '@/stores/event'
import { useProjectStore, type ProjectMember } from '@/stores/project'
import { useDebounceFn } from '@vueuse/core'

const props = defineProps<{
  projectId: string
  edit?: string | null
}>()
const emit = defineEmits(['submit'])

const eventStore = useEventStore()
const projectStore = useProjectStore()

const editMode = computed(() => props.edit !== null || props.edit !== '')
const loading = computed(() => ({
  creating: eventStore.isLoading(EventLoading.CREATING),
  updating: eventStore.isLoading(EventLoading.UPDATING),
  getting: eventStore.isLoading(EventLoading.GETTING_ONE),
  gettingInvitees: eventStore.isLoading(EventLoading.GETTING_INVITEES),
}))

const validationSchema = yup.object({
  title: yup.string().required('Event name is required'),
  description: yup.string().required('Event description is required'),
  event_type: yup.string().required('Event description is required'),
  venue: yup.string().when('event_type', {
    is: (v: string) => v !== null && v !== 'online',
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.nullable(),
  }),
  url: yup.string().when('event_type', {
    is: (v: string) => v !== null && v !== 'online',
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.required(),
  }),
  // status: yup.string().required('Status is required'),
  duration_hours: yup.number().required('Duration is required'),

  datetime: yup.date().required('Date is required'),
})

const { errors, defineField, resetForm, handleSubmit } = useForm({
  validationSchema,
})

const [title] = defineField('title')
const [description] = defineField('description')
const [event_type] = defineField('event_type')
const [venue] = defineField('venue')
const [url] = defineField('url')
const [datetime] = defineField('datetime')
// const [status] = defineField('status')
const [duration_hours] = defineField('duration_hours')

const eventData = ref<ProjectEvent|null>(null)

const submitForm = handleSubmit((values) => {
  emit('submit', {
    form: {
      ...values,
    },
    invitees: invitees.value,
  })
})

const getEvent = async () => {
  if (!props.edit) {
    return
  }

  const _event = await eventStore.getEvent(props.edit)
  if (_event) {
    eventData.value = _event
    resetForm({
      values: {
        ..._event,
        created_by: _event.created_by.id,
      },
    })
  }
}

const reset = () => {
  eventData.value = null
  resetForm({
    values: {
      event_type: 'online',
      status: 'upcoming',
    },
  })
}

watch(
  () => props.edit,
  (v) => {
    if (v) {
      getEvent()
      getInvitees()
    } else {
      reset()
    }
  },
)

/**Members/Invitees */
const invitees = ref<string[]>([])
const projectMembers = ref<ProjectMember[]>([])
const queriedUsers = ref<ProjectMember[]>([])
const searchUsers = useDebounceFn((query: string) => {
  if (!query) {
    return []
  }

  queriedUsers.value = projectMembers.value.filter((m) => {
    return (
      m.name?.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
      m.username?.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
      m.email?.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    )
  })
}, 200)

const getMembers = async () => {
  const _users = await projectStore.getMembers(props.projectId)
  if (_users) {
    projectMembers.value = _users
  }
}

const getInvitees = async () => {
  if (!props.edit) {
    return
  }

  const _users = await eventStore.getInvitees(props.edit)
  if (_users) {
    invitees.value = _users.map((u) => u.id)
  }
}

const addUser = async (userId: string) => {
  if (!props.edit) {
    return
  }

  const success = await eventStore.addInvitees(props.edit, [userId])
  if (success) {
    // todo: toast
  }
}

const removeUser = async (id: string) => {
  if (!props.edit) {
    return
  }
  const success = await eventStore.deleteInvitee(props.edit, id)
  if (success) {
    // todo: toast
    invitees.value.splice(
      invitees.value.findIndex((i) => i == id),
      1,
    )
  }
}

onMounted(() => {
  getMembers()
  if (props.edit) {
    getEvent()
    getInvitees()
  } else {
    reset()
  }
})
</script>
