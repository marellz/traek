<template>
  <div class="px-4 py-2 text-sm border-b border-b-gray-200 dark:border-b-slate-600 last:border-b-0 hover:bg-slate">
    {{ item.content }}
  </div>
</template>
<script lang="ts" setup>
import type { Notification } from '@/stores/notifications';

defineProps<{ item: Notification }>()
</script>