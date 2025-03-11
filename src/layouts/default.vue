<template>
  <!-- dashboard -->
  <div class="h-full flex flex-col min-h-screen dark:bg-slate-900 dark:text-white">
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
