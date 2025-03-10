<template>
  <nuxt-link
    :to
    class="relative block rounded px-2 py-2 before:absolute before:left-0 before:top-1/2 before:block before:h-4 before:w-1 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-transparent hover:bg-slate-200"
    active-class="before:!bg-primary text-primary bg-primary/10">
    <slot />
  </nuxt-link>
</template>
<script lang="ts" setup>
defineProps<{
  to: string;
}>()
</script>
