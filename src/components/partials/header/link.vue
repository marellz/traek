<template>
  <router-link class="px-4 py-2.5 hover:bg-black/5 rounded-full" :to>
    <slot />
  </router-link>
</template>
<script lang="ts" setup>
import type { RouterLinkProps } from 'vue-router';
type RouterLinkTo = RouterLinkProps["to"]
defineProps<{
  to: RouterLinkTo
}>()
</script>
