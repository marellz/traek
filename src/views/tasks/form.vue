<template>
  <layout-container class="mt-10">
    <h1 class="text-4xl">{{ isEdit ? `Edit task` : `Create task` }}</h1>
    <div class="mt-10">
      <task-form :edit="id" @submit="handleSubmit" :project-id="id"></task-form>
    </div>
  </layout-container>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TaskForm from '@/components/object-forms/task-form.vue'
import { useTaskStore, type TaskForm as TaskFormType } from '@/stores/task';


const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)
const project = computed(() => route.params.project as string)
const isEdit = computed(() => id.value)
const tasksStore = useTaskStore()

const handleSubmit = (form: TaskFormType) => {
  if (isEdit.value) {
    update(form)
  } else {
    create(form)
  }
}

const update = async (form: TaskFormType) => {
  if (!id.value) throw new Error('Invalid ID')
  const success = await tasksStore.update(id.value, form)
  if (success) {
    // redirect
    router.push({
      name: "project-tasks", params: {
        id: form.project_id
      }
    })
  }
}

const create = async (form: TaskFormType, assignees: string[] = []) => {
  const payload = {
    ...form,
    project_id: project.value
  }

  const _task = await tasksStore.create(payload, assignees)

  if (_task) {
    // redirect
    router.push({
      name: "project-tasks", params: {
        id: project.value
      }
    })
  }
}
</script>
