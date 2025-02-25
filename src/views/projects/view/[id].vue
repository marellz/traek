<template>
  <div>
    <layout-banner class="!py-0">
      <!-- <h1 class="font-bold text-2xl px-4 mt-4">-p</h1> -->
      <ul class="mt-4 flex">
        <li v-for="({ name, label }, index) in links" :key="index">
          <router-link
            :to="{ name, params: { id } }"
            class="-mb-px block border-b border-b-transparent px-4 py-2"
            exact-active-class="!border-b-slate-800"
          >
            {{ label }}
          </router-link>
        </li>
      </ul>
    </layout-banner>
    <div>
      <layout-container class="py-10">
        <router-view :key="id" />
      </layout-container>
    </div>
  </div>
</template>
<script lang="ts" setup>
import LayoutContainer from '@/components/layout/container.vue'
import LayoutBanner from '@/components/layout/banner.vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const links = ref([
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
    label: 'About',
    name: 'project-about',
  },
])

const route = useRoute()
const id = computed(() => route.params.id as string)

</script>
