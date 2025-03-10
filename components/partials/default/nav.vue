<template>
  <nav class="z-2 bg-sidebar-bg w-64 flex-none space-y-10 border-r border-r-slate-200 p-4 pt-10">
    <ul v-for="(item, index) in menu" :key="index" class="space-y-1.5">
      <li v-if="item.title" class="mb-2 px-2">
        <p class="font-medium uppercase tracking-widest text-slate-400">{{ item.title }}</p>
      </li>
      <li v-for="(link, i) in item.links" :key="`${index}-${i}`">
        <sidebar-nav-item :to="link.path">
          <span>
            {{ link.label }}
          </span>
        </sidebar-nav-item>
      </li>
    </ul>
  </nav>
</template>
<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/project'
import { onMounted, ref, watch } from 'vue'
type NavSection = 'home' | 'projects'
type Nav = Record<
  NavSection,
  {
    title: string
    links: Array<{
      label: string
      path: string;
    }>
  }
>

const menu = ref<Nav>({
  home: {
    title: 'Menu',
    links: [
      { label: 'Home', path: '/dashboard' },
      { label: 'Tasks', path: '/tasks' },
      { label: 'Projects', path: '/projects' },
      { label: 'Calendar', path: '/calendar' },
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
        path: `/project/${item.id}`
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
