<template>
  <layout-banner>
    <layout-banner-title>My projects</layout-banner-title>
  </layout-banner>
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
        <base-loader v-if="fetching"></base-loader>
        <div v-else-if="projects.length" class="grid grid-cols-2 gap-10">
          <router-link
            v-for="project in projects"
            :key="project.id"
            :to="{ name: 'project', params: { id: project.id } }"
          >
            <div class="space-y-2 rounded-xl border border-slate-300 p-4">
              <h1 class="text-2xl font-light">
                {{ project.name }}
              </h1>
              <p v-if="project.description">{{ project.description }}</p>
              <p class="text-sm text-slate-600">
                Created on {{ parseDate(project.created_at) }}
                <span v-if="project.created_by">by {{ project.created_by }}</span>
              </p>
            </div>
          </router-link>
        </div>
        <div v-else class="mt-10">
          <base-alert title="Empty">You have no projects</base-alert>
        </div>
      </div>
    </layout-container>
  </div>
</template>
<script lang="ts" setup>
import { ProjectLoading, useProjectStore } from '@/stores/project'
import { computed, onMounted } from 'vue'
import moment from 'moment'

const projectStore = useProjectStore()

const projects = computed(() => projectStore.projects)
const fetching = computed(() => projectStore.isLoading(ProjectLoading.GETTING_ALL))
const parseDate = (str: string) => {
  return moment(str).format('d/m/Y')
}

onMounted(async () => {
  await projectStore.getUserProjects()
})
</script>
