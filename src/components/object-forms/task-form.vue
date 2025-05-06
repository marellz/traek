<template>
  <div>
    <Form @submit="submitForm()">
      <base-loader v-if="loading.getting"></base-loader>
      <div v-else class="space-y-4">
        <form-input label="Task name" v-model="title" :error="errors.title"></form-input>
        <form-text label="Task description" v-model="description" :error="errors.description"></form-text>
        <div class="grid grid-cols-2 gap-4">
          <form-group label="Status" :error="errors.priority">
            <div class="mt-4 flex flex-col gap-4">
              <form-radio v-for="(label, key) in TaskStatusLabels" :key v-model="status" :value="key" :label
                name="status">
              </form-radio>
            </div>
          </form-group>
          <form-group label="Priority" :error="errors.priority">
            <div class="mt-4 flex flex-col gap-4">
              <form-radio v-for="(label, key) in TaskPriorityLabels" :key v-model="priority" :value="key" :label
                name="priority">
              </form-radio>
            </div>
          </form-group>
        </div>
        <form-datepicker label="Due date" v-model="due_date"></form-datepicker>
        <user-selector v-model="assignees" label="Assignees" :queriedUsers @search-users="searchUsers"
          @add-user="addAssignee" @remove-user="removeAssignee"></user-selector>
        <div>
          <base-button type="submit" :loading="loading.updating || loading.creating">
            <span>Save changes</span></base-button>
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
import UserSelector from '@/components/form/user-selector.vue'
import { computed, onMounted, ref } from 'vue'
import { TaskPriorityLabels, TaskStatusLabels } from '@/data/task-data'
import { useTaskStore, TaskLoading, type TaskForm } from '@/stores/task'
import { useProjectStore, type ProjectUser } from '@/stores/project'
import { Form, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useDebounceFn } from '@vueuse/core'

const projectStore = useProjectStore()

const props = defineProps<{
  edit?: string | null
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

const getForm = async () => {
  if (!props.edit) {
    return
  }

  // get task
  const _item = await tasksStore.get(props.edit as string)
  if (_item) {
    // task.created_by returns user
    const _task = { ..._item, created_by: _item.created_by.id }
    _form.value = _task

    resetForm({
      values: _task,
    })
  }

  // get assignees
  const _users = await tasksStore.getAssignees(props.edit)
  if (_users) {
    assignees.value = _users.map((u) => u.user_id)
  }

}

const projectMembers = ref<ProjectUser[]>([])
const getMembers = async () => {
  const _users = await projectStore.getMembers(props.projectId)
  if (_users) {
    projectMembers.value = _users
  }
}

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
    assignees.value.splice(assignees.value.findIndex(a => a == id), 1)
  }
}

onMounted(() => {
  getMembers()
  if (props.edit) {
    getForm()
  } else {
    resetForm({
      values: {
        status: 'pending',
        priority: 'medium',
      }
    })
  }
})

const queriedUsers = ref<ProjectUser[]>([])
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
