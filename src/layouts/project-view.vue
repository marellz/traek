<template>
  <div class="flex min-h-screen dark:bg-slate-900 dark:text-white overflow h-screen relative">
    <projects-nav />
    <div class="overflow-auto flex-auto">
      <div class="container mx-auto h-full">
        <div class="flex-auto flex flex-col">
          <partials-header />
          <main class="flex-auto">
            <layout-container class="py-10">
              <slot :key="id" />
            </layout-container>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PartialsHeader from '@/components/partials/default-layout/header.vue'
import ProjectsNav from '@/components/project/nav.vue'
import { useProjectStore } from '@/stores/project'
import { computed, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = computed(() => route.params.id as string)
const projectStore = useProjectStore()

watch(() => id.value, async (v) => {
  await projectStore.setCurrentProject(v)
}, { immediate: true })

onUnmounted(() => {
  projectStore.setCurrentProject(null)
})


</script>
