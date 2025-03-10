<template>
  <!-- dashboard -->
  <div class="h-full flex flex-col min-h-screen">
  <div class="bg-sidebar-bg fixed h-full left-0 w-1/5"></div>
    <div class="container flex-auto mx-auto flex space-x-2">
      <partials-nav />
      <div class="flex-auto flex flex-col">
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
