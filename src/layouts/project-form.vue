<template>
  <div class="flex justify-center gap-10 h-screen">
    <nav class="sticky top-20 w-64 xl:w-96 flex-none rounded-xl p-4 mt-12">
      <ul class="space-y-4">
        <li v-for="({ to, label, description }, index) in pages" :key="index">
          <button type="button"
            class="text-left rounded-lg w-full hover:bg-slate-100 p-2 disabled:text-slate-300 disabled:hover:bg-transparent"
            @click="goTo(to)" :disabled="to === null" :class="{
              'bg-slate-100': to === route.path
            }">
            <div class="flex items-start space-x-2">
              <span
                class="h-6 w-6 text-center text-xs font-bold transform translate-y-0.5 leading-6 rounded-full flex-none bg-slate-100"
                :class="{ '!bg-black text-white': to === route.path }">{{ index + 1 }}</span>
              <div class="space-y-0.5">
                <h2 class="text-sm xl:text-base font-medium">{{ label }}</h2>
                <p class="text-xs xl:text-sm text-slate-500">{{ description }}</p>
              </div>
            </div>
          </button>
        </li>
      </ul>
      <p>id: {{ id || 'null'}}</p>
    </nav>
    <main class="overflow-auto py-10 max-w-4xl">
      <layout-banner>
        <div class="flex items-center justify-between">
          <layout-banner-title>Create new project</layout-banner-title>
          <a href="#" @click="router.back">
            <base-button variant="secondary-outline">Cancel</base-button>
          </a>
        </div>
      </layout-banner>
      <div class="mt-10">
        <slot :project :loading/>
      </div>
    </main>
  </div>
</template>
<script lang="ts" setup>
import { ProjectLoading, useProjectStore, type Project } from '@/stores/project';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const loading = computed(() => {
  return {
    updating: projectStore.isLoading(ProjectLoading.UPDATING),
    creating: projectStore.isLoading(ProjectLoading.CREATING),
  }
})

const route = useRoute()
const id = computed(() => route.params.id as string)
const project = ref<Project>()
const pages = computed(() => ([
  {
    to: id.value ? `/project/form/${id.value}/basic` : '/project/create',
    label: "Basic Info",
    description: "Simple intro to the project.",
  },
  {
    to: id.value ? `/project/form/${id.value}/about` : null,
    label: "About & Goals",
    description: "Define the intent and targets of the project.",
  },
  {
    to: id.value ? `/project/form/${id.value}/team` : null,
    label: "Team",
    description: "Decide who’s in and what roles they might play.",
  },
  {
    to: id.value ? `/project/form/${id.value}/review` : null,
    label: "Review & Create",
    description: "Recap entries and confirm before submission.",
  },
]))

const router = useRouter()
const goTo = (target: string | null) => {
  if (!target) return
  router.push(target)
}

const projectStore = useProjectStore()
onMounted(async () => {
  if(!id.value) return null
  const _form = await projectStore.getProject(id.value)
  if(_form){
    project.value = _form
  }
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
