<template>
  <router-link
    class="relative block rounded px-2 py-2 before:absolute before:top-1/2 before:left-0 before:block before:h-4 before:w-1 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-transparent hover:bg-slate-200 dark:hover:bg-slate-900"
    active-class="before:!bg-primary text-primary bg-primary/10 dark:bg-primary/40 dark:hover:!bg-primary/60 dark:text-white" :to>
    <span>
      <slot />
    </span>
  </router-link>
</template>
<script lang="ts" setup>
import type { SidebarLink } from '../partials/default-layout/nav.vue';

defineProps<{
  to: SidebarLink
}>()
</script>
