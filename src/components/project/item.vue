<template>
  <router-link class="block" :to="{ name: 'project', params: { id: item.id } }">
    <div class="h-full space-y-2 rounded-xl border border-slate-300 p-4">
      <h1 class="text-2xl font-medium">
        {{ item.name }}
      </h1>
      <!-- <p v-if="item.description">{{ item.description }}</p> -->
      <p class="text-sm text-slate-600">
        Created on {{ parseDate(item.created_at) }}
        <span v-if="item.created_by">by {{ item.created_by.name }}</span>
      </p>
    </div>
  </router-link>
</template>
<script lang="ts" setup>
import type { Project } from '@/stores/project'
import moment from 'moment'

defineProps<{
  item: Project
}>()

const parseDate = (str: string) => {
  return moment(str).format('d/m/Y')
}
</script>
