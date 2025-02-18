<template>
  <!-- dashboard -->
  <div class="flex h-full min-h-screen bg-sd">
    <partials-nav />
    <div class="flex-auto flex flex-col">
      <partials-header />
      <main class="flex-auto">
        <slot />
      </main>
      <footer class="border-t border-t-slate-300 py-4">
        <layout-container>
          <ul class="flex space-x-2">
            <li>
              <router-link :to="{ 'name': 'home' }">Go to homepage</router-link>
            </li>
          </ul>
        </layout-container>
      </footer>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PartialsNav from '@/components/partials/default-layout/nav.vue'
import PartialsHeader from '@/components/partials/default-layout/header.vue'
import { onMounted } from 'vue';
import { useProjectStore } from '@/stores/project';

const projectStore = useProjectStore()
onMounted(async () => {
  await projectStore.init()
})
</script>
