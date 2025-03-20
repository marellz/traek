<template>
  <router-link class="block" :to="{ name: 'project', params: { id: item.id } }">
    <div class="h-full space-y-2 rounded-xl border border-slate-300 p-4">
      <base-tag :class="{'bg-blue-500 !border-blue-500 text-white': isActive}">
        <span>{{ isActive? 'Active' : 'Closed' }}</span>
      </base-tag>
      <h1 class="text-2xl font-bold">
        {{ item.name }}
      </h1>
      <p v-if="item.description" class="line-clamp-2 text-slate-300" :title="item.description">{{ item.description }}
      </p>
      <div class="text-sm text-slate-600 flex space-x-1">
        <span>
          Created {{ parseDate(item.created_at) }}
        </span>
      </div>
      <div class="flex space-x-1 mt-auto">
        <div v-for="member in item.members" :key="member.id">
          <base-popover popover-class="whitespace-nowrap" :text="member.name ?? `email: ${member.email}`">
            <user-avatar size="h-9 w-9" :border-class="member.id === item.created_by ? '!border-green-500': ''"
              :avatar="member.avatar"></user-avatar>
          </base-popover>
        </div>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts" setup>
import UserAvatar from '@/components/user/avatar.vue'
import type { Project } from '@/stores/project'
import { parseDate } from '@/utils/parseDate';
import { computed } from 'vue';

const props = defineProps<{
  item: Project
}>()

const isActive = computed(() => props.item.closed_at === null)
</script>
