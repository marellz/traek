<template>
  <div>
    <base-loader v-if="loading"></base-loader>
    <template v-if="project">
      <h1 class="text-4xl font-light">Project overview</h1>
      <layout-card class="mt-5">
        <div class="flex items-center space-x-2">
          <p class="text-3xl font-bold">{{ project.name }}</p>
          <p class="rounded-full border border-slate-300 px-2 py-0.5 text-sm font-medium">
            <span v-if="project.closed_at">closed</span>
            <span v-else>Active</span>
          </p>
        </div>
        <p class="text-sm mt-1">
          Created by
          <strong>
            {{ project.created_by }}
          </strong>
        </p>

        <p class="mt-5">{{ project.description ?? 'No description' }}</p>
      </layout-card>
      <div class="mt-5 grid grid-cols-4 gap-5">
        <router-link to="" v-for="section in sections" :key="section.key">
          <layout-card>
            <p class="text-2xl font-medium">
              {{ section.label }}
            </p>
            <div class="mt-4 text-4xl">
              0
            </div>
          </layout-card>
        </router-link>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { useProjectStore, type Project } from '@/stores/project'
import { onMounted, ref } from 'vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const id = computed(() => route.params.id as string)
const project = ref<Project|null>(null)
const sections = [
  { key: 'tasks', label: 'Tasks' },
  { key: 'events', label: 'Events' },
  { key: 'users', label: 'Members' },
]

const projectStore = useProjectStore()
const loading = computed(() => projectStore.getting)
const getProject = async () => {
  const _d = await projectStore.getProject(id.value)
  if (_d) {
    project.value = _d
  }
}

onMounted(() => {
  getProject()
})
</script>
