<template>
  <div>
    <layout-banner class="!py-0">
      <ul class="mt-4 flex border-b border-b-slate-200">
        <li v-for="({ name, label }, index) in links" :key="index">
          <router-link
            :to="`/project/${id}/${name}`"
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
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const links = ref([
  {
    label: 'Overview',
    name: '',
  },
  {
    label: 'Tasks',
    name: 'tasks',
  },
  {
    label: 'Events',
    name: 'events',
  },
  {
    label: 'Members',
    name: 'members',
  },
  {
    label: 'Notes',
    name: 'notes',
  },
])

const route = useRoute()
const id = computed(() => route.params.id as string)
</script>
