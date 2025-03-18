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
          Created on {{ parseDate(item.created_at) }}
        </span>
        <span v-if="item.created_by">by {{ item.creator.name }}</span>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts" setup>
import type { Project } from '@/stores/project'
import moment from 'moment'
import { computed } from 'vue';

const props = defineProps<{
  item: Project
}>()

const isActive = computed(() => props.item.closed_at === null)

const parseDate = (str: string) => {
  return moment(str).format('Do MMM YYYY')
}
</script>
