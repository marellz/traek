<template>
  <Form @submit="submitForm()">
    <form-fieldset legend="Basic information">
      <div class="space-y-4">
        <form-input label="Name" required v-model="name" :error="errors.name" />
        <form-group label='Category'>
          <div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            <form-radio v-for="(option, index) in categories" :key="index" :value="option" v-model="category" class="block"
              name="project-category">
              <div>
                <h5 class="text-base font-medium">
                  {{ projectCategoryLabels[option] }}
                </h5>
                <p class="text-sm text-slate-500">{{ projectCategoryDescription[option] }}</p>
              </div>
            </form-radio>
          </div>
        </form-group>
        <form-group label='Priority'>
          <div class="flex flex-wrap gap-4">
            <form-radio name="priority" v-model="priority" :value="item" v-for="item in priorities" :key="item">
              <div>
                <h3 class="capitalize font-medium">{{ item }} priority</h3>
              </div>
            </form-radio>
          </div>
        </form-group>
        <form-file label="Add an image"></form-file>
        <div>
          <base-button>
            <span>Next</span>
            <ArrowRight :size="20" />
          </base-button>
        </div>
      </div>
    </form-fieldset>
  </Form>
</template>
<script lang="ts" setup>
import FormFieldset from '@/components/form/fieldset.vue'
import FormInput from '@/components/form/input.vue'
import FormRadio from '@/components/form/radio.vue'
import FormGroup from '@/components/form/group.vue'
import FormFile from '@/components/form/file.vue'
import { useProjectStore, type ProjectForm } from '@/stores/project'
import { computed, onMounted } from 'vue'
import { Form, useForm } from 'vee-validate'
import * as yup from 'yup'
import { ProjectCategories, projectCategoryDescription, projectCategoryLabels, ProjectPriorities } from '@/data/projects.data'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import { useProjectFormStore } from '@/stores/project.form'
import { watch } from 'vue'

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
const projectFormStore = useProjectFormStore()

const project = computed(() => projectFormStore.project)
watch(project, (v) => {
  if (v) {
    setFormValues()
  }
})


const setFormValues = () => {
  if (!project.value) throw new Error('Project does not exist.')
  const {
    name,
    category,
    priority,
  } = project.value!

  resetForm({
    values: {
      name, priority, category
    }
  })
}
// submission
const submitForm = handleSubmit(async (values) => {
  const form = values as ProjectForm
  // create or update
  let _id = id.value
  if (id.value) { // update
    projectStore.updateProject(id.value, form)
  } else { // create new
    const _project = await projectStore.createProject(form)
    if (!_project) return
    _id = _project.id
    projectFormStore.setId(_id)
    projectFormStore.setProject({ ..._project })
  }

  router.push({ name: 'project-form-about', params: { id: _id } })
})

onMounted(() => {

  if (project.value) {
    setFormValues()
    if (id.value) projectFormStore.getProject()
  } else {
    // new identity
    resetForm({
      values: {
        priority: ProjectPriorities.MEDIUM,
        category: ProjectCategories.GENERAL
      }
    })
  }
})
</script>
