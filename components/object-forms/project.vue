<template>
  <div>
    <Form @submit="submitForm()">
      <div class="div space-y-4">
        <form-input v-model="name" label="Project name" required :error="errors.name" />
        <form-text v-model="description" label="Project description" />

        <form-user-selector
          v-model="members"
          label="Members"
          :queried-users
          @search-users="searchUsers"
        />
        <div>
          <base-button type="submit" :loading="loading.creating || loading.updating">
            <span>Save changes</span></base-button
          >
        </div>
      </div>
    </Form>
  </div>
</template>
<script lang="ts" setup>
import { ProjectLoading, useProjectStore, type ProjectForm } from '@/stores/project'
import { computed, onUnmounted, ref } from 'vue'
import { useAuthStore, type UserProfile } from '@/stores/auth'
import { useDebounceFn } from '@vueuse/core'
import { Form, useForm } from 'vee-validate'
import * as yup from 'yup'

const props = defineProps<{
  id?: string
}>()

const emit = defineEmits(['submit'])
const projectStore = useProjectStore()
const auth = useAuthStore()

const loading = computed(() => {
  return {
    updating: projectStore.isLoading(ProjectLoading.UPDATING),
    creating: projectStore.isLoading(ProjectLoading.CREATING),
  }
})

const validationSchema = yup.object({
  name: yup.string().required('Project name is required'),
  description: yup.string().nullable(),
})

const { errors, defineField, resetForm, handleSubmit } = useForm({
  validationSchema,
})

const [name] = defineField('name')
const [description] = defineField('description')

const members = ref<string[]>([])

const queriedUsers = ref<UserProfile[]>([])

const searchUsers = useDebounceFn(async (q: string) => {
  if (q == '') {
    queriedUsers.value = []
    return
  }
  const _users = await auth.queryUsers(q)
  if (_users && _users.length) {
    queriedUsers.value = _users
  }
}, 1000)

const submitForm = handleSubmit(async (values) => {
  const form = values as ProjectForm
  emit('submit', { form, members })
})

const init = async () => {
  if (props.id) {
    const _form = await projectStore.getProject(props.id)
    const _members = await projectStore.getMembers(props.id)
    if (_form) {
      resetForm({
        values: _form,
      })
    }

    if (_members) {
      members.value = _members.map((m) => m.id)
    }
  }
  resetForm({
    values: {},
  })
}

onUnmounted(init)
</script>
