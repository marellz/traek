<template>
  <div>
    <Form @submit="submitForm()">
      <div class="div space-y-4">
        <form-input label="Project name" required v-model="name" :error="errors.name" />
        <form-text label="Project description" v-model="description"></form-text>

        <form-group label="Members">
          <div v-if="members.length" class="flex flex-wrap gap-4 py-4">
            <div
              v-for="member in memberProfiles"
              :key="member.id"
              class="flex rounded-xl border border-slate-300 p-2"
            >
              <div class="flex-auto pr-4">
                <p class="font-medium">
                  {{ member.name || member.username || 'Unknown' }}
                </p>
                <p class="text-xs">
                  {{ member.email }}
                </p>
              </div>
              <button type="button" class="p-1">
                <Trash2 :size="20" />
              </button>
            </div>
          </div>
          <form-dropdown
            @query="searchUsers"
            v-model="members"
            :options="queriedUsers"
            label-key="name"
            value-key="id"
            :placeholder="members.length === 0 ? `Add members` : `Added ${members.length}`"
          >
            <template #item="{ item }">
              <div>
                <p class="font-bold">
                  {{ item.name }} <span class="text-slate-500">@{{ item.username }}</span>
                </p>
                <p class="text-sm">{{ item.email }}</p>
              </div>
            </template>
          </form-dropdown>
        </form-group>
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
import { Form, useForm } from 'vee-validate'
import FormInput from '@/components/form/input.vue'
import FormGroup from '@/components/form/group.vue'
import FormText from '@/components/form/text.vue'
import FormDropdown from '@/components/form/dropdown.vue'
import * as yup from 'yup'
import { ProjectLoading, useProjectStore, type ProjectForm } from '@/stores/project'
import { computed, onUnmounted, ref } from 'vue'
import { useAuthStore, type UserProfile } from '@/stores/auth'
import { watchDebounced } from '@vueuse/core'
import { Trash2 } from 'lucide-vue-next'

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
const memberProfiles = ref<UserProfile[]>([])

watchDebounced(
  members,
  async (n, o) => {
    // don't repeat requests for removed users
    if (o.length > n.length) {
      memberProfiles.value = memberProfiles.value.filter((mP) => members.value.includes(mP.id))
      return
    }

    const _users = await auth.getProfiles(members.value, 'id')
    if (_users) {
      memberProfiles.value = _users
    }
  },
  { debounce: 1000, maxWait: 1500 },
)

const queriedUsers = ref<UserProfile[]>([])

const searchUsers = async (q: string) => {
  if (q == '') {
    queriedUsers.value = []
    return
  }
  const _users = await auth.queryUsers(q)
  if (_users && _users.length) {
    queriedUsers.value = _users
  }
}

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
