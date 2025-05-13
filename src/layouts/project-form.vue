<template>
  <div class="flex justify-center gap-10 h-screen">
    <nav class="sticky top-20 w-64 xl:w-96 flex-none rounded-xl p-4 mt-12">
      <ul class="space-y-4">
        <li v-for="({ routeName, label, description }, index) in pages" :key="index">
          <button type="button"
            class="text-left rounded-lg w-full hover:bg-slate-100 p-2 disabled:text-slate-300 disabled:hover:bg-transparent"
            @click="goTo(routeName)" :disabled="routeName === null" :class="{
              'bg-slate-100': routeName === route.name
            }">
            <div class="flex items-start space-x-2">
              <span
                class="h-6 w-6 text-center text-xs font-bold transform translate-y-0.5 leading-6 rounded-full flex-none bg-slate-100"
                :class="{ '!bg-black text-white': routeName === route.name }">{{ index + 1 }}</span>
              <div class="space-y-0.5">
                <h2 class="text-sm xl:text-base font-medium">{{ label }}</h2>
                <p class="text-xs xl:text-sm text-slate-500">{{ description }}</p>
              </div>
            </div>
          </button>
        </li>
      </ul>
      <p>id: {{ id || 'null' }}</p>
    </nav>
    <main class="overflow-auto py-10 max-w-4xl w-full">
      <layout-banner>
        <div class="flex items-center justify-between">
          <layout-banner-title>Create new project</layout-banner-title>
          <!-- todo: prompt user to delete project or keep it as draft -->
          <router-link :to="{ name: 'projects' }">
            <base-button variant="secondary-outline">Cancel</base-button>
          </router-link>
        </div>
      </layout-banner>
      <div class="mt-10">
        <slot />
      </div>
    </main>
  </div>
</template>
<script lang="ts" setup>
import { useProjectFormStore } from '@/stores/project.form';
import { formPages as pages } from '@/data/projects.data';
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const projectFormStore = useProjectFormStore()
const route = useRoute()
const id = computed(() => route.params.id as string)

const router = useRouter()
const goTo = (target: string | null) => {
  if (!target) return
  router.push({ name: target, params: { id: id.value } })
}

watch(id, (v) => {
  if(v) projectFormStore.setId(v)
})

onMounted(() => {
  projectFormStore.setId(id.value)
})

onUnmounted(() => {
  projectFormStore.setId(null)
})


</script>
<style>
fieldset {
  display: block;
  border: 1px solid var(--color-slate-100);
  border-radius: var(--radius-lg);
  padding: 32px
}

fieldset legend {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-slate-500);

}
</style>
