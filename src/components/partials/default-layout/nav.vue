<template>
  <nav class="pt-10 w-64 flex-none space-y-10 p-4 border-r border-r-slate-300">
    <ul v-for="(item, index) in menu" :key="index">
      <li v-if="item.title" class="mb-4 px-2">
        <p class="uppercase font-bold text-slate-300">{{ item.title }}</p>
      </li>
      <li v-for="(link, index) in item.links" :key="index">
        <router-link class="px-2 py-1.5 block rounded hover:bg-slate-200 font-medium" active-class="bg-slate-200"
          :to="link.path">
          {{ link.label }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const menu = ref({
  home: {
    title: "Links",
    links: [
      { label: "Home", path: "/dashboard" },
      { label: "Tasks", path: "/tasks" },
      { label: "Projects", path: "/projects" },
      { label: "Calendar", path: "/calendar" },
      // { label: "Members", path: "/members" },
    ]
  },
  projects: {
    title: "My projects",
    links: [
      { label: 'Project 1', path: "/projects/abcd" }
    ]
  }
})
</script>
