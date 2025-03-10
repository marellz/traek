<template>
  <div>
    <base-loader v-if="loading" />
    <template v-if="project">
      <div class="flex">
        <h1 class="text-4xl font-light">Project overview</h1>
        <div class="ml-auto">
          <base-button v-if="createdByMe">
            <span>Edit</span>
          </base-button>
        </div>
      </div>

      <layout-card class="mt-5 space-y-2">
        <div class="flex items-center space-x-2">
          <p class="text-3xl font-bold">{{ project.name }}</p>
          <p class="rounded-full border border-slate-300 px-2 py-0.5 text-sm font-medium">
            <span v-if="project.closed_at">closed</span>
            <span v-else>Active</span>
          </p>
        </div>
        <p class="mt-1 text-sm">
          Created by
          <strong> {{ project.created_by.name }} (@{{ project.created_by.username }}) </strong>
          on
          <strong>
            {{ moment(project.created_at).format('Mo MMM YYYY') }}
          </strong>
        </p>

        <p class="mt-5">{{ project.description ?? 'No description' }}</p>
      </layout-card>
      <div class="mt-5">
        <layout-card class="grid grid-cols-8 !p-4">
          <router-link
            v-for="section in sections"
            :key="section.key"
            :to="{ name: section.pathName, params: { id } }"
          >
            <div class="hover:bg-midnight-green/10 border-r border-r-slate-300 px-4 py-2 pl-4">
              <div class="mt-4 text-4xl font-medium">
                {{ project[section.key][0].count }}
              </div>
              <p class="text-xl text-slate-400">
                {{ section.label }}
              </p>
            </div>
          </router-link>
        </layout-card>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import {
  ProjectLoading,
  useProjectStore,
  type ProjectInfo,
  type ProjectStats,
} from '@/stores/project'
import moment from 'moment'
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const auth = useAuthStore()
const id = computed(() => route.params.id as string)
const project = ref<ProjectInfo | null>(null)
const sections: { key: keyof ProjectStats; label: string; pathName: string }[] = [
  { key: 'tasks', label: 'Tasks', pathName: 'project-tasks' },
  { key: 'events', label: 'Events', pathName: 'project-events' },
  { key: 'project_members', label: 'Members', pathName: 'project-members' },
  { key: 'notes', label: 'Notes', pathName: 'project-notes' },
]

const projectStore = useProjectStore()
const loading = computed(() => projectStore.isLoading(ProjectLoading.GETTING_ONE))
const createdByMe = computed(() => project.value?.created_by.id === auth.userId)
const getProject = async () => {
  const _d = await projectStore.getProjectStats(id.value)
  if (_d) {
    project.value = _d
  }
}

onMounted(() => {
  getProject()
})
</script>
