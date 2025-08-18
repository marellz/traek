<template>
  <li>
    <div class="flex p-2 items-center space-x-4 border rounded-xl border-slate-200 dark:border-slate-700">
      <Avatar :avatar="user.avatar" class="flex-none" size="w-8 h-8" />
      <div class="flex-auto">
        <h1 class="font-medium">{{ user.name || 'No name' }}</h1>
        <p class="text-sm text-slate-500">{{ user.email }}</p>
      </div>
      <div class="px-4">
        <base-tag class="text-xs">{{ selectedRole }}</base-tag>
      </div>
      <button type="button" class="hover:text-red-500" @click="$emit('remove-selected', user.id)">
        <X />
      </button>
    </div>
  </li>
</template>
<script lang="ts" setup>
import type { UserProfile } from '@/stores/auth';
import Avatar from '@/components/user/avatar.vue';

defineProps<{
  user: UserProfile
  selectedRole: string;
}>()

defineEmits(['remove-selected'])
</script>
