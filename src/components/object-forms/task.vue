<template>
  <div>
    <Form @submit="submitForm()">
      <base-loader v-if="loading.getting"></base-loader>
      <div v-else class="space-y-4">
        <form-input label="Task name" v-model="title" :error="errors.title"></form-input>
        <form-text
          label="Task description"
          v-model="description"
          :error="errors.description"
        ></form-text>
        <div class="grid grid-cols-2 gap-4">
          <form-group label="Status" :error="errors.priority">
            <div class="mt-4 flex flex-col gap-4">
              <form-radio
                v-for="{ value, label } in statuses"
                :key="value"
                v-model="status"
                :value
                :label
                name="status"
              >
              </form-radio>
            </div>
          </form-group>
          <form-group label="Priority" :error="errors.priority">
            <div class="mt-4 flex flex-col gap-4">
              <form-radio
                v-for="{ value, label } in priorities"
                :key="value"
                v-model="priority"
                :value
                :label
                name="priority"
              >
              </form-radio>
            </div>
          </form-group>
        </div>
        <form-datepicker label="Due date" v-model="due_date"></form-datepicker>
        <div>
          <base-button type="submit" :loading="loading.updating || loading.creating">
            <span>Save changes</span></base-button
          >
        </div>
        <!-- <div class="mt-10">{{ errors }}</div> -->
      </div>
    </Form>
  </div>
</template>
<script lang="ts" setup>
import FormInput from '@/components/form/input.vue'
import FormText from '@/components/form/text.vue'
import FormGroup from '@/components/form/group.vue'
import FormRadio from '@/components/form/radio.vue'
import FormDatepicker from '@/components/form/datepicker.vue'
import * as yup from 'yup'
import { Form, useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import {
  useTaskStore,
  TaskLoading,
  type TaskForm,
  type TaskPriority,
  type TaskStatus,
} from '@/stores/task'

const props = defineProps<{
  edit?: string | null
  active: boolean
}>()

const emit = defineEmits(['submit'])

const priorities: {
  label: string
  value: TaskPriority
}[] = [
  {
    label: 'High priority',
    value: 'high',
  },
  {
    label: 'Medium priority',
    value: 'medium',
  },
  {
    label: 'Low priority',
    value: 'low',
  },
]

const statuses: { label: string; value: TaskStatus }[] = [
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'In progress',
    value: 'in_progress',
  },
]

const validationSchema = yup.object({
  title: yup.string().required('Task title is required'),
  description: yup.string().nullable(),
  start_date: yup.date().nullable(),
  end_date: yup.date().nullable(),
  priority: yup
    .string()
    .required('Task priority is required')
    .oneOf(priorities.map((p) => p.value)),
  status: yup
    .string()
    .required('Task priority is status')
    .oneOf(statuses.map((s) => s.value)),
})

const { errors, defineField, resetForm, handleSubmit } = useForm({
  validationSchema,
})

const [title] = defineField('title')
const [description] = defineField('description')
const [due_date] = defineField('due_date')
const [status] = defineField('status')
const [priority] = defineField('priority')
const assignees = ref<string[]>([])

const submitForm = handleSubmit(async (values) => {
  emit('submit', values as TaskForm, assignees)
})

const tasksStore = useTaskStore()
const loading = computed(() => ({
  creating: tasksStore.isLoading(TaskLoading.CREATING),
  getting: tasksStore.isLoading(TaskLoading.GETTING_ONE),
  updating: tasksStore.isLoading(TaskLoading.UPDATING),
}))

const _form = ref()

const reset = () => {
  resetForm({
    values: {
      title: '',
      description: '',
      due_date: '',
      status: 'pending',
      priority: 'medium',
    },
  })
}

const getForm = async () => {
  if (!props.edit) {
    return
  }
  const _task = await tasksStore.get(props.edit as string)
  if (!_task) {
    return
  }
  _form.value = _task

  resetForm({
    values: _task,
  })
}

watch(
  () => props.active,
  () => {
    if (!props.active) {
      reset()
    }
  },
)

watch(
  () => props.edit,
  (v) => {
    if (v) {
      getForm()
    }
  },
)
</script>
