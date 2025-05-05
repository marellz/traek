<template>
  <div class="h-screen bg-slate-100 flex items-center justify-center py-20 dark:bg-slate-900 dark:text-white">
    <div class="mx-auto max-w-lg -translate-y-40">
      <layout-card class="mx-2">
        <slot />
      </layout-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import LayoutCard from '@/components/layout/card.vue'
</script>
