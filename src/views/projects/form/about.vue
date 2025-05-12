<template>
  <Form @submit="submitForm()">
    <fieldset>
      <legend>About & goals</legend>
      <div class="space-y-4">
        <form-text label="What is this project about?" v-model="description"></form-text>

        <h1 class="text-xl font-medium">Project goals</h1>
        <div>
          <ul class="space-y-4">
            <li class="border border-slate-100 rounded-xl hover:bg-slate-100 flex space-x-2 items-center p-2"
              v-for="(goal, index) in goals" :key="index">
              <p class="flex-auto text-sm">
                {{ goal }}
              </p>
              <button type="button" class="p-1 rounded hover:bg-red-100" @click="deleteGoal(index)">
                <Trash :size="20" />
              </button>
            </li>
            <li>
              <div class="space-y-4">
                <form-group label="New goal">
                  <div class="flex space-x-2">
                    <form-input class="flex-auto" v-model="newGoal"></form-input>
                    <base-action type="button" @click="addNewGoal">
                      <span>Add goal</span>
                      <Plus :size="16" />
                    </base-action>
                  </div>
                </form-group>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </fieldset>
  </Form>
</template>
<script lang="ts" setup>
import FormText from '@/components/form/text.vue'
import { Plus, Trash } from 'lucide-vue-next'
import { Form, useForm } from 'vee-validate'
import * as yup from 'yup'
import { computed, onMounted, ref } from 'vue'
import { useProjectStore, type Project } from '@/stores/project'
import { useRoute } from 'vue-router'

const props = defineProps<{
  project: Project
}>()

const route = useRoute()
const id = computed(() => route.params.id as string)

const validationSchema = yup.object({
  description: yup.string().nullable(),
})

const { defineField, resetForm, handleSubmit } = useForm({
  validationSchema,
})

const [description] = defineField('description')

const goals = ref<string[]>([])
const newGoal = ref('')
const addNewGoal = () => {
  if (newGoal.value === '') return
  goals.value = [...goals.value, newGoal.value]
  newGoal.value = ''
}
const deleteGoal = (index: number) => {
  const _goals = [...goals.value]
  _goals.splice(index, 1)
  goals.value = _goals
}

const submitForm = handleSubmit((values) => {
  console.log({ step: 2, values })
})

const projectStore = useProjectStore()
onMounted(async () => {
  // get project
  const _project = props.project
  const _goals = await projectStore.getGoals(id.value)
  const { description } = _project
  resetForm({
    values: {
      description,
    }
  })

  if (_goals) goals.value = _goals

})

</script>
