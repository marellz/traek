<template>
  <div>
    <Form @submit="submitForm()">
      <base-loader v-if="loading.getting" />
      <div v-else class="space-y-4">
        <form-input v-model="title" label="Task name" :error="errors.title" />
        <form-text v-model="description" label="Task description" :error="errors.description" />
        <div class="grid grid-cols-2 gap-4">
          <form-group label="Status" :error="errors.priority">
            <div class="mt-4 flex flex-col gap-4">
              <form-radio
                v-for="(label, key) in TaskStatusLabels"
                :key
                v-model="status"
                :value="key"
                :label
                name="status"
              />
            </div>
          </form-group>
          <form-group label="Priority" :error="errors.priority">
            <div class="mt-4 flex flex-col gap-4">
              <form-radio
                v-for="(label, key) in TaskPriorityLabels"
                :key
                v-model="priority"
                :value="key"
                :label
                name="priority"
              />
            </div>
          </form-group>
        </div>
        <form-datepicker v-model="due_date" label="Due date" />
        <form-user-selector
          v-model="assignees"
          label="Assignees"
          :queried-users
          @search-users="searchUsers"
          @add-user="addAssignee"
          @remove-user="removeAssignee"
        />
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
import { computed, onMounted, ref, watch } from 'vue'
import { TaskPriorityLabels, TaskStatusLabels } from '@/data/task-data'
import { useTaskStore, TaskLoading, type TaskForm } from '@/stores/task'
import { useProjectStore } from '@/stores/project'
import type { UserProfile } from '@/stores/auth'
import { Form, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useDebounceFn } from '@vueuse/core'

const projectStore = useProjectStore()

const props = defineProps<{
  edit?: string | null
  active: boolean
  projectId: string
}>()
const emit = defineEmits(['submit'])

const validationSchema = yup.object({
  title: yup.string().required('Task title is required'),
  description: yup.string().nullable(),
  start_date: yup.date().nullable(),
  end_date: yup.date().nullable(),
  priority: yup
    .string()
    .required('Task priority is required')
    .oneOf(Object.keys(TaskPriorityLabels)),
  status: yup.string().required('Task status is required').oneOf(Object.keys(TaskStatusLabels)),
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
  emit('submit', values as TaskForm, assignees.value)
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
      getAssignees()
    }
  },
)

const getMembers = async () => {
  const _users = await projectStore.getMembers(props.projectId)
  if (_users) {
    projectMembers.value = _users
  }
}

const getAssignees = async () => {
  if (!props.edit) {
    return
  }

  const _users = await tasksStore.getAssignees(props.edit)
  if (_users) {
    assignees.value = _users.map((u) => u.user_id)
  }
}

/**
 * REFACTOR:
 *
 * current:
 * add/remove assignee if user-selector changes
 *
 *
 * ideal:
 * add-remove assignee by comparison every time there is a change?
 */

const addAssignee = async (userId: string) => {
  if (!props.edit) {
    return
  }

  const success = await tasksStore.addAssignees(props.edit, [userId])
  if (success) {
    // todo: toast
  }
}

const removeAssignee = async (id: string) => {
  if (!props.edit) {
    return
  }
  const success = await tasksStore.removeAssignee(props.edit, id)
  if (success) {
    // todo: toast
    assignees.value.splice(
      assignees.value.findIndex((a) => a == id),
      1,
    )
  }
}

onMounted(() => {
  getMembers()
  if (props.edit) {
    getForm()
  }
})

const projectMembers = ref<UserProfile[]>([])
const queriedUsers = ref<UserProfile[]>([])

const filterMembers = (q: string) => {
  if (!q) {
    queriedUsers.value = projectMembers.value
    return
  }
  queriedUsers.value = projectMembers.value.filter((m) => {
    return (
      m.name?.toLocaleLowerCase().includes(q.toLocaleLowerCase()) ||
      m.username?.toLocaleLowerCase().includes(q.toLocaleLowerCase()) ||
      m.email?.toLocaleLowerCase().includes(q.toLocaleLowerCase())
    )
  })
}

const searchUsers = useDebounceFn(filterMembers, 1000)
</script>
