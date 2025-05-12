<template>
  <Form @submit="submitForm()">
    <fieldset>
      <legend>Basic information</legend>
      <div class="grid grid-cols-3 gap-10">
        <form-file label="Add an image"></form-file>
        <div class="space-y-4 col-span-2">
          <form-input label="Name" required v-model="name" :error="errors.name" />
          <form-select label="Category" v-model="category" :options="categories" label-key="label" value-key="key">
            <form-select-option v-for="(option, index) in categories" :key="index" :value="option"
              name="project-category">
              <div>
                <h5 class="text-base font-medium">
                  {{ projectCategoryLabels[option] }}
                </h5>
                <p class="text-sm text-slate-500">{{ projectCategoryDescription[option] }}</p>
              </div>
            </form-select-option>
          </form-select>
          <form-group label='Priority'>
            <div class="flex flex-wrap gap-4">
              <form-radio name="priority" v-model="priority" :value="item" v-for="item in priorities" :key="item"
                :label="item" label-class="capitalize">
              </form-radio>
            </div>
          </form-group>
        </div>
      </div>
    </fieldset>
  </Form>
</template>
<script lang="ts" setup>
import FormInput from '@/components/form/input.vue'
import FormRadio from '@/components/form/radio.vue'
import FormSelect from '@/components/form/custom/select.vue'
import FormSelectOption from '@/components/form/custom/select-option.vue'
import FormGroup from '@/components/form/group.vue'
import FormFile from '@/components/form/file.vue'
import { useProjectStore, type ProjectForm } from '@/stores/project'
import { computed, onMounted } from 'vue'
import { Form, useForm } from 'vee-validate'
import * as yup from 'yup'
import { ProjectCategories, projectCategoryDescription, projectCategoryLabels, ProjectPriorities } from '@/data/projects.data'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)
const validationSchema = yup.object({
  name: yup.string().required('Project name is required'),
  description: yup.string().nullable(),
  category: yup.string().required('Project category name is required'),
  priority: yup.string().required('Project priority is required')
})

const { errors, defineField, resetForm, handleSubmit } = useForm({
  validationSchema,
})

const [name] = defineField('name')
const [category] = defineField('category')
const [priority] = defineField('priority')


const categories = computed(() => Object.values(ProjectCategories))
const priorities = computed(() => Object.values(ProjectPriorities))

const projectStore = useProjectStore()

const submitForm = handleSubmit(async (values) => {
  const form = values as ProjectForm
  // create or update
  let _id = id.value
  if (id.value) { // update
    projectStore.updateProject(id.value, form)
  } else { // create new
    const project = await projectStore.createProject(form)
    if (!project) return
    _id = project.id
  }

  router.push({ name: 'project-form-about', params: { id: _id } })
})

onMounted(() => {
  resetForm({
    values: {
      priority: ProjectPriorities.MEDIUM,
      categories: ProjectCategories.GENERAL
    }
  })
})
</script>
