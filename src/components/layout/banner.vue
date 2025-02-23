<template>
  <div class="border-b border-b-slate-300 py-6">
    <layout-container>
      <slot />
    </layout-container>
  </div>
</template>
<script lang="ts" setup>
import LayoutContainer from '@/components/layout/container.vue'
</script>
