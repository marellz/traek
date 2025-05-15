<template>
  <form-fieldset legend="About & goals">
    <Form @submit="submitForm()">
      <div class="space-y-4">
        <form-text label="What is this project about?" v-model="description" :error="errors.description"></form-text>

        <div class="mt-4">
          <base-button>
            <span>Save changes</span>
          </base-button>
        </div>
      </div>
    </Form>

    <div class="space-y-4">
      <div class="flex space-x-4 items-center">
        <h1 class="text-xl font-medium">Project goals</h1>
        <button type="button" class="p-1" @click="goalFormActive = true">
          <Plus />
        </button>

      </div>
      <ul class="space-y-2">
        <li v-if="loadingGoals" class="text-center py-4">
          <base-loader></base-loader>
        </li>
        <template v-else-if="goals.length">
          <li class="border border-slate-100 rounded-xl hover:bg-slate-100 flex space-x-2 items-center p-2"
            v-for="goal in goals" :key="goal.id">
            <div class="flex-auto">
              <div class="flex items-center space-x-2">
                <h1 class="font-medium text-lg">
                  {{ goal.title }}
                </h1>
                <base-tag>{{ goal.status }}</base-tag>
              </div>
              <p class="flex-auto text-sm text-slate-500">
                {{ goal.description }}
              </p>
            </div>
            <base-action type="button" class="p-1 rounded hover:text-red-500" @click="editGoal(goal.id)">
              <Edit2 :size="20" />
              <span>Edit</span>
            </base-action>
            <base-action type="button" class="p-1 rounded hover:text-red-500" @click="deleteGoal(goal.id)">
              <Trash :size="20" />
              <span>Delete</span>
            </base-action>
          </li>
        </template>
        <li v-else>
          <div class="border p-4 rounded-xl border-slate-200 flex items-start space-x-2">
            <div class="pt-1">
              <FileX2 />
            </div>
            <div>
              <h2 class="font-medium">No records</h2>
              <p class="text-slate-500 text-sm">You have not added any goals yet for this project.</p>
            </div>
          </div>
        </li>
      </ul>
      <GoalForm v-model:show="goalFormActive" ref="goal-form" :selected="selectedGoal" @create="createGoal"
        @update="updateGoal" @cancel="hideGoalForm">
      </GoalForm>
    </div>
    <div class="flex justify-end">
      <base-button @click="goToNext">
        <span>Next</span>
        <ArrowRight :size="20" />
      </base-button>
    </div>
  </form-fieldset>
</template>
<script lang="ts" setup>
import FormFieldset from '@/components/form/fieldset.vue'
import { ProjectLoading, useProjectStore, type Project, type ProjectGoal } from '@/stores/project'
import GoalForm from '@/components/object-forms/goal.form.vue'
import FormText from '@/components/form/text.vue'
import { ArrowRight, Edit2, FileX2, Plus, Trash } from 'lucide-vue-next'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Form, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useProjectFormStore } from '@/stores/project.form'

// stores
const projectStore = useProjectStore()
const projectFormStore = useProjectFormStore()

const route = useRoute()
const id = computed(() => route.params.id as string)

const validationSchema = yup.object({
  description: yup.string().required('Please provide some information about this project'),
})

const { errors, defineField, resetForm, handleSubmit } = useForm({
  validationSchema,
})

const [description] = defineField('description')

// goals
const loadingGoals = computed(() => projectStore.isLoading(ProjectLoading.GETTING_GOALS))
const goals = ref<ProjectGoal[]>([])
const goalForm = useTemplateRef('goal-form')
const selectedGoal = ref<ProjectGoal | null>(null)
interface GoalFormSubmission { title: string, description: string, status: string }
const goalFormActive = ref(false)

const hideGoalForm = () => {
  goalFormActive.value = false
  selectedGoal.value = null
}

const createGoal = async (form: GoalFormSubmission) => {
  const payload = {
    ...form,
    project_id: id.value
  }

  const _goal = await projectStore.createGoal(payload)
  if (!_goal) {
    throw new Error('Failure creating new goal')
  }

  goals.value = [...goals.value, _goal]
  goalForm.value?.resetFormValues()
  hideGoalForm()

}

const editGoal = async (id: string) => {
  const _selected = await projectStore.getGoal(id)
  if (!_selected) throw new Error('Failure getting goal')
  selectedGoal.value = _selected
  goalFormActive.value = true
}

const updateGoal = async (form: { title: string, description?: string | null, status: string }) => {
  if (!selectedGoal.value) throw new Error('No selected goal')
  const _updated = await projectStore.updateGoal(selectedGoal.value.id, form)
  if (!_updated) throw new Error('Failure updating a goal')
  const _index = goals.value.findIndex(g => g.id === selectedGoal.value!.id)
  if (_index !== -1) {
    const _goals = [...goals.value] as any[]
    _goals[_index] = { ..._goals[_index], ...form }
    goals.value = _goals

    selectedGoal.value = null
    goalForm.value?.resetFormValues()
  }

}

const deleteGoal = async (id: string) => {
  const deleted = await projectStore.deleteGoal(id)
  if (!deleted) throw new Error('Failed to delete goal')
  const _goals = [...goals.value]
  const index = _goals.findIndex(g => g.id === id)
  _goals.splice(index, 1)
  goals.value = _goals
}

// submission
const submitForm = handleSubmit(async (values) => {
  const updated = await projectStore.updateProject(id.value, values)
  if (updated) {
    const updatedProject = { ...project.value, ...values } as Project
    projectFormStore.setProject(updatedProject)
  }
})

const project = computed(() => projectFormStore.project)

// form initiation
const setFormValues = async () => {
  if (!project.value) return
  const { description } = project.value
  resetForm({
    values: {
      description,
    }
  })

  const _goals = await projectStore.getGoals(id.value)
  if (_goals) goals.value = _goals
}

onMounted(async () => {
  setFormValues()

  // get project
  if (!projectFormStore.project) projectFormStore.getProject()
})

const router = useRouter()
const goToNext = () => {
  router.push({ name: 'project-form-team', params: { id: id.value } })
}

</script>
