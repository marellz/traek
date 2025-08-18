<template>
  <li>
    <div class="flex p-2 items-center space-x-4 border rounded-xl border-slate-200 dark:border-slate-700">
      <Avatar :avatar="user.avatar" class="flex-none" size="w-8 h-8" />
      <div class="flex-auto">
        <h1 class="font-medium">{{ user.name || 'No name' }}</h1>
        <p class="text-sm text-slate-500">{{ user.email }}</p>
      </div>
      <div v-if="excluded">
        <role-selector v-model="role" @change="addUser"></role-selector>
      </div>
      <div v-else class="pr-4">
        <base-tag class="text-xs">Current member</base-tag>
      </div>
    </div>
  </li>
</template>
<script lang="ts" setup>
import RoleSelector from '@/components/form/role/selector.vue'
import type { UserRole } from '@/data/users.data';
import type { UserProfile } from '@/stores/auth';
import { ref } from 'vue';

defineProps<{
  user: UserProfile
  excluded?: boolean
}>()

const role = ref<UserRole>()
const emit = defineEmits(['add-user'])
const addUser = (user: UserProfile, role: UserRole) => {
  emit("add-user", user, role)
}

</script>
