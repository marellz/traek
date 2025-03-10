<template>
  <!-- dashboard -->
  <div class="flex h-full min-h-screen flex-col">
    <div class="bg-sidebar-bg fixed left-0 h-full w-1/5 max-w-64 z-1" />
    <div class="container mx-auto flex flex-auto space-x-2">
      <partials-nav />
      <div class="flex flex-auto flex-col">
        <partials-header />
        <main class="flex-auto">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PartialsNav from '@/components/partials/default-layout/nav.vue'
import PartialsHeader from '@/components/partials/default-layout/header.vue'
</script>
