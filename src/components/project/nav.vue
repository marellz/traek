<template>
  <Sidebar>
    <div v-if="loading" class="flex justify-center py-20">
      <base-loader />
    </div>
    <div v-else-if="project">
      <router-link :to="{ name: 'projects' }">
        <div class="inline-flex items-center space-x-2 text-sm hover:bg-slate-200 py-2 px-4 rounded-full">
          <ArrowLeft :size="16" />
          <span>
            Back to projects
          </span>
        </div>
      </router-link>
      <div ref="projects-dropdown" class="relative mt-4">
        <button type="button"
          class="border border-slate-200 w-full text-left flex items-center justify-between rounded-xl p-4"
          @click="projectsDropdownActive = !projectsDropdownActive">
          <h1 class="font-medium">
            {{ project.name }}
          </h1>
          <ChevronsUpDown :size="16" />
        </button>

        <div v-show="projectsDropdownActive"
          class="absolute w-full bg-white p-1 top-full overflow-hidden rounded-xl translate-y-2 shadow-xs border border-slate-200">
          <ul class="space-y-1">
            <li v-for="p in projects" :key="p.id">
              <button type="button" :disabled="project.id === p.id" @click="viewProject(p.id)"
                class="w-full p-2 text-left flex items-center justify-between hover:bg-slate-100 rounded-lg group/project-btn disabled:text-gray-500 disabled:bg-gray-100">
                <h3 class="font-medium text-sm">
                  {{ p.name }}
                </h3>
                <ArrowRight :size="16" class="invisible group-hover/project-btn:visible" />
              </button>
            </li>
          </ul>
        </div>
      </div>

      <ul>
        <li v-for="({ name, label }, index) in pages" :key="index">
          <RouterLink :to="{ name }" class="block px-4 py-2">
            {{ label }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </Sidebar>
</template>
<script lang="ts" setup>
import Sidebar from '@/components/app/sidebar.vue';
import { useAuthStore } from '@/stores/auth';
import { ProjectLoading, useProjectStore } from '@/stores/project';
import { onClickOutside } from '@vueuse/core';
import { ArrowLeft, ArrowRight, ChevronsUpDown } from 'lucide-vue-next';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const projectStore = useProjectStore()
const metaData = computed(() => projectStore.projectMetadata)
const project = computed(() => metaData.value.project)
const projects = computed(() => projectStore.projects)

const loading = computed(() => projectStore.isLoading(ProjectLoading.GETTING_ONE))
const projectsDropdownActive = ref(false)
const projectsDropdown = useTemplateRef('projects-dropdown')
const pages = [
  {
    label: 'Overview',
    name: 'project',
  },
  {
    label: 'Tasks',
    name: 'project-tasks',
  },
  {
    label: 'Events',
    name: 'project-events',
  },
  {
    label: 'Members',
    name: 'project-members',
  },
  {
    label: 'Notes',
    name: 'project-notes',
  },
]

const auth = useAuthStore()
onClickOutside(projectsDropdown, () => {
  projectsDropdownActive.value = false
})

const router = useRouter()
const viewProject = (id: string) => {
  router.push({ name: 'project', params: { id } })
}

const route = useRoute()

watch(() => route.path, () => {
  projectsDropdownActive.value = false
})

onMounted(async () => {
  if (auth.user) {
    await projectStore.getUserProjects()
  }
})
</script>
