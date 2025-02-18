<template>
  <div>
    <layout-banner>
      <ul class="flex mt-4">
        <li v-for="({ name, label }, index) in links" :key="index">
          <router-link :to="{ name, params: { id } }" class="py-2 px-4 block border-b -mb-px border-b-transparent"
            exact-active-class="!border-b-slate-800">
            {{ label }}
          </router-link>
        </li>
      </ul>
    </layout-banner>
    <div>
      <layout-container class="py-10">
        <router-view />
      </layout-container>
    </div>
  </div>
</template>
<script lang="ts" setup>
import LayoutContainer from '@/components/layout/container.vue'
import LayoutBanner from '@/components/layout/banner.vue'
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()
const id = computed(() => route.params.id as string)
const links = ref([
  {
    label: "Overview",
    name: "project",
  },
  {
    label: "Tasks",
    name: "project-tasks",
  },
  {
    label: "Events",
    name: "project-events",
  },
  {
    label: "Members",
    name: "project-members",
  },
  {
    label: "About",
    name: "project-about",
  },
])
</script>
