<template>
  <div>
    <Form @submit="submitForm()">
      <div class="space-y-4">
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
          <form-input type="date" label="Due date" v-model="due_date"></form-input>
        </div>
        <div>
          <base-button type="submit" :loading> <span>Save changes</span></base-button>
        </div>
      </div>
    </Form>
  </div>
</template>
<script lang="ts" setup>
import FormInput from '@/components/form/input.vue'
import FormText from '@/components/form/text.vue'
// import FormSelect from '@/components/form/select.vue'
import FormGroup from '@/components/form/group.vue'
import FormRadio from '@/components/form/radio.vue'
import * as yup from 'yup'
import { Form, useForm } from 'vee-validate'
import { computed, onMounted } from 'vue'
import type { TaskForm, TaskPriority, TaskStatus } from '@/stores/task'
import { useLoadingState } from '@/composables/useLoading'

const props = defineProps<{
  form?: TaskForm
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
  end_date: yup.date(),
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

const submitForm = handleSubmit(async (values) => {
  emit('submit', values as TaskForm)
})

const loadingState = useLoadingState()

const loading = computed(() => loadingState.loading.value.includes('create-task'))

onMounted(() => {
  if (props.form) {
    resetForm({
      values: props.form,
    })
  } else {
    resetForm({
      values: {
        status: 'pending',
        priority: 'medium',
      },
    })
  }
})
</script>
