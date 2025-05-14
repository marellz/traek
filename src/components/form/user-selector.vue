<template>
  <div class="space-y-8">
    <form-group :label>
      <div class="form-input !flex space-x-2">
        <Search />
        <input type="text" class="flex-auto outline-0" v-model="query" @input="debounceSearch" :placeholder />
        <button v-show="!!query" type="button" @click="resetQuery" class="hover:text-red-500">
          <X />
        </button>
      </div>
    </form-group>

    <div v-if="query" class="space-y-4">
      <h3 class="font-medium">Search results for "{{ query }}"</h3>
      <div v-if="loadingResults" class="flex justify-center py-4">
        <base-loader></base-loader>
      </div>
      <ul v-else-if="results.length" class="space-y-2">
        <li v-for="(user, index) in results" :key="index">
          <div class="flex p-2 items-center space-x-4 border rounded-xl border-slate-200 dark:border-slate-700">
            <Avatar :avatar="user.avatar" class="flex-none" size="w-8 h-8" />
            <div class="flex-auto">
              <h1 class="font-medium">{{ user.name || 'No name' }}</h1>
              <p class="text-sm text-slate-500">{{ user.email }}</p>
            </div>
            <div v-if="!exclude?.includes(user.id)">
              <role-selector v-model="roles[user.id]" @change="(role) => addUser(user, role)"></role-selector>
            </div>
            <div v-else class="pr-4">
              <base-tag class="text-xs">Current member</base-tag>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div v-if="selected.length" class="space-y-4">
      <h3 class="font-medium">Selected users</h3>
      <ul class="space-y-2">
        <li v-for="({ user, role }, index) in selected" :key="index">
          <div class="flex p-2 items-center space-x-4 border rounded-xl border-slate-200 dark:border-slate-700">
            <Avatar :avatar="user.avatar" class="flex-none" size="w-8 h-8" />
            <div class="flex-auto">
              <h1 class="font-medium">{{ user.name || 'No name' }}</h1>
              <p class="text-sm text-slate-500">{{ user.email }}</p>
            </div>
            <div class="px-4">
              <base-tag class="text-xs">{{ userRoles[role] }}</base-tag>
            </div>
            <button type="button" class="hover:text-red-500" @click="removeSelected(user.id)">
              <X />
            </button>
          </div>
        </li>
      </ul>

    </div>
  </div>
</template>
<script lang="ts" setup>
import { userRoles, type UserRole } from '@/data/users.data';
import type { UserProfile } from '@/stores/auth';
import type { ProjectMemberForm } from '@/stores/project';
import { UserLoading, useUserStore } from '@/stores/user';
import { Search, X } from 'lucide-vue-next';
import { computed, onUnmounted, ref } from 'vue';
import Avatar from '@/components/user/avatar.vue';
import FormGroup from '@/components/form/group.vue'
import RoleSelector from '@/components/form/role/selector.vue'
import { watch } from 'vue';

withDefaults(defineProps<{
  label?: string
  placeholder?: string
  exclude?: string[]
}>(), {
  label: 'Add users',
  placeholder: 'Search users...'
})

const userStore = useUserStore()

const model = defineModel<Omit<ProjectMemberForm, 'project_id'>[]>({ default: [] })
const query = ref('')
const results = ref<UserProfile[]>([])

const roles = ref<Record<string, UserRole>>({})
const selected = ref<{ user: UserProfile, role: UserRole }[]>([])

const loadingResults = computed(() => userStore.isLoading(UserLoading.QUERYING_USERS))
const searchUsers = async () => {
  const _users = await userStore.queryUsers(query.value, { limit: 5 })
  if (_users) results.value = _users
}

watch(roles, (v) => {
  // add to model
  model.value = Object.keys(v).map(k => ({
    user_id: k,
    role: v[k]
  }))
}, { deep: true })

const addUser = (user: UserProfile, role: UserRole) => {
  const _index = selected.value.findIndex(m => m.user.id === user.id)
  const payload = { user, role }
  if (_index !== -1) { // contains
    selected.value[_index] = payload
  } else { // add new
    selected.value = [...selected.value, payload]
  }
}

type Timeout = ReturnType<typeof setTimeout>
const debouncer = ref<Timeout | null>(null)
const debounceSearch = () => {
  if (debouncer.value) {
    clearTimeout(debouncer.value)
  }

  debouncer.value = setTimeout(searchUsers, 500)
}

const resetQuery = () => {
  query.value = ''
  results.value = []
}

const removeSelected = (id: string) => {
  const _index = selected.value.findIndex(u=>u.user.id === id)
  if(_index !== -1) selected.value.splice(_index,1)
  delete roles.value[id]
}

onUnmounted(() => {
  resetQuery()
})
</script>
