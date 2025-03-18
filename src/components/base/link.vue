<template>
  <router-link :to class="inline-flex items-center space-x-2 text-sm py-1 px-2 font-medium hover:bg-slate-100 dark:hover:bg-slate-600 rounded">
    <slot />
  </router-link>
</template>
<script lang="ts" setup>
import type { RouterLinkProps } from 'vue-router';

defineProps<{
  to: RouterLinkProps
}>()
</script>
