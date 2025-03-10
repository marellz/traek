<template>
  <nav
    class="z-2 w-64 flex-none space-y-10 border-r border-r-slate-200 bg-sidebar-bg dark:bg-slate-900 dark:border-r-slate-800 dark:text-white p-4 pt-10">
    <ul class="space-y-1.5" v-for="(item, index) in menu" :key="index">
      <li v-if="item.title" class="mb-2 px-2">
        <p class="font-medium tracking-widest text-slate-400 uppercase">{{ item.title }}</p>
      </li>
      <li v-for="(link, index) in item.links" :key="index">
        <nav-link :to="link.path">
          {{ link.label }}
        </nav-link>
      </li>
    </ul>
  </nav>
</template>
<script lang="ts" setup>
import navLink from '@/components/sidebar/nav-link.vue'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/project'
import { onMounted, ref, watch } from 'vue'
type NavSection = 'home' | 'projects'
export type SidebarLink = {
  name: string
  params?: Record<string, string>
}
type Nav = Record<
  NavSection,
  {
    title: string
    links: Array<{
      label: string
      path: SidebarLink
    }>
  }
>

const menu = ref<Nav>({
  home: {
    title: 'Menu',
    links: [
      { label: 'Home', path: { name: 'dashboard' } },
      { label: 'Tasks', path: { name: 'tasks' } },
      { label: 'Projects', path: { name: 'projects' } },
      { label: 'Calendar', path: { name: 'calendar' } },
    ],
  },
  projects: {
    title: 'My projects',
    links: [],
  },
})

const auth = useAuthStore()
const projectStore = useProjectStore()

watch(
  () => projectStore.projects,
  (v) => {
    if (v) {
      menu.value.projects.links = v.map((item) => ({
        label: item.name,
        path: {
          name: 'project',
          params: { id: item.id },
        },
      }))
    }
  },
)
onMounted(async () => {
  if (auth.user) {
    await projectStore.getUserProjects()
  }
})
</script>
