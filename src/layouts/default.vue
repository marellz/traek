<template>
  <!-- dashboard -->
  <div class="flex min-h-screen dark:bg-slate-900 dark:text-white overflow h-screen relative">
      <partials-nav class="sticky top-0" />
      <div class="overflow-auto flex-auto">
        <div class="container mx-auto h-full">
          <div class="flex-auto flex flex-col">
            <partials-header />
            <main class="flex-auto">
              <slot />
            </main>
          </div>
        </div>
      </div>
    </div>
</template>
<script lang="ts" setup>
import PartialsNav from '@/components/partials/default-layout/nav.vue'
import PartialsHeader from '@/components/partials/default-layout/header.vue'

</script>
