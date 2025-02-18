<template>
  <nav class="w-64 flex-none space-y-10 border-r border-r-slate-300 p-4 pt-10">
    <ul class="space-y-1.5" v-for="(item, index) in menu" :key="index">
      <li v-if="item.title" class="mb-4 px-2">
        <p class="font-bold text-slate-300 uppercase">{{ item.title }}</p>
      </li>
      <li v-for="(link, index) in item.links" :key="index">
        <router-link
          class="block rounded px-2 py-1.5 font-medium hover:bg-slate-200"
          active-class="bg-primary text-white hover:!bg-primary"
          :to="link.path"
        >
          {{ link.label }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const menu = ref({
  home: {
    title: 'Links',
    links: [
      { label: 'Home', path: { name: 'dashboard' } },
      { label: 'Tasks', path: { name: 'tasks' } },
      { label: 'Projects', path: { name: 'projects' } },
      { label: 'Calendar', path: { name: 'calendar' } },
      // { label: "Members", path: "/members" },
    ],
  },
  projects: {
    title: 'My projects',
    links: [{ label: 'Project 1', path: { name: 'project', params: {id: "abcd"} }}],
  },
})
</script>
