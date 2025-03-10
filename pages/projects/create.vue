<template>
  <layout-banner>
    <div class="flex items-center justify-between">
      <layout-banner-title>Create new project</layout-banner-title>
      <a href="#" @click="router.back">
        <base-button variant="secondary-outline">Cancel</base-button>
      </a>
    </div>
  </layout-banner>
  <layout-container class="py-10">
    <project-form @submit="submit" />
  </layout-container>
</template>
<script lang="ts" setup>
import ProjectForm from '@/components/object-forms/project.vue'
import { useProjectStore, type ProjectForm as ProjectFormType } from '@/stores/project'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const projects = useProjectStore()

const submit = async ({ form, assignees = [] }: { form: ProjectFormType; assignees: string[] }) => {
  const success = await projects.createProject(form, assignees)
  if (success) {
    router.push('/projects')
  }
}
</script>
