<template>
  <form-group :label>
    <div v-if="model.length" class="flex flex-wrap gap-4 py-4">
      <div
        v-for="(user, i) in profiles"
        :key="user.id"
        class="flex rounded-xl border border-slate-300 p-2"
      >
        <div class="flex-auto pr-4">
          <p class="font-medium">
            {{ user.name || user.username || 'Unknown' }}
          </p>
          <p class="text-xs">
            {{ user.email }}
          </p>
        </div>
        <button type="button" class="p-1" @click="removeUser(i, user.id)">
          <Trash2 :size="20" />
        </button>
      </div>
    </div>
    <!-- <div v-else>
      <p>No users selected</p>
    </div> -->
    <form-dropdown
      @query="searchUsers"
      @change="onChange"
      v-model="model"
      :options="queriedUsers"
      label-key="name"
      value-key="id"
      :placeholder="model.length === 0 ? `Add users` : `Added ${model.length}`"
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
</template>
<script lang="ts" setup>
import FormGroup from '@/components/form/group.vue'
import FormDropdown from '@/components/form/dropdown.vue'
import { watchDebounced } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Trash2 } from 'lucide-vue-next'
import type { ProjectUser } from '@/stores/project'

const auth = useAuthStore()

defineProps<{
  label: string
  queriedUsers: ProjectUser[]
}>()

const model = defineModel<string[]>({ default: [] })
const emit = defineEmits(['search-users', 'remove-user', 'add-user'])

const profiles = ref<ProjectUser[]>([])
const getProfiles = async () => {
  const _users = await auth.getProfiles(model.value, 'id')
  if (_users) {
    profiles.value = _users
  }
}

watchDebounced(
  model,
  async (n, o) => {
    // don't repeat requests for removed users
    if (o.length > n.length) {
      profiles.value = profiles.value.filter((mP) => model.value.includes(mP.id))
      return
    }

    await getProfiles()
  },
  { debounce: 1000, maxWait: 1500 },
)

const onChange = (value: string, isAdded: boolean) => {
  if (isAdded) {
    emit('add-user', value)
  } else {
    emit('remove-user', value)
  }
}

const removeUser = (i: number, id: string) => {
  const _m = [...model.value]
  _m.splice(i, 1)
  model.value = _m

  emit('remove-user', id)
}

const searchUsers = (q: string) => {
  emit('search-users', q)
}

onMounted(() => {
  getProfiles()
})
</script>
