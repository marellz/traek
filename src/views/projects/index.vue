<template>
  <!-- <layout-banner>
    <layout-banner-title>My projects</layout-banner-title>
  </layout-banner> -->
  <div class="mt-10">
    <layout-container>
      <div class="flex items-center">
        <h1 class="text-3xl">My projects</h1>
        <div class="ml-auto">
          <router-link :to="{ name: 'create-project' }">
            <base-button>
              <span>Create project</span>
            </base-button>
          </router-link>
        </div>
      </div>
      <div class="mt-10">
        <base-loader v-if="loading.getting"></base-loader>
        <div v-else-if="projects.length" class="grid grid-cols-3 gap-4">
          <project-item v-for="item in projects" :key="item.id" :item></project-item>
        </div>
        <Empty v-else />
      </div>
    </layout-container>
  </div>
</template>
<script lang="ts" setup>
import ProjectItem from '@/components/project/item.vue'
import { ProjectLoading, useProjectStore } from '@/stores/project'
import { computed, onMounted } from 'vue'
import Empty from '@/components/common/empty.vue'

const projectStore = useProjectStore()

const projects = computed(() => projectStore.projects)

const loading = computed(() => ({
  getting: projectStore.isLoading(ProjectLoading.GETTING_USER),
}))

onMounted(async () => {
  await projectStore.getUserProjects()
})
</script>
