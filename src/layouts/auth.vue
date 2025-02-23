<template>
  <div class="h-screen bg-slate-100 flex items-center justify-center py-20">
    <div class="mx-auto max-w-lg -translate-y-20">
      <layout-card>
        <slot />
      </layout-card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import LayoutCard from '@/components/layout/card.vue'
</script>
