<template>
  <div>
    <Form @submit="submitForm()">
      <div class="div space-y-4">
        <form-input label="Project name" required v-model="name" :error="errors.name" />
        <form-text label="Project description" v-model="description"></form-text>
        <div>
          <base-button type="submit" :loading> <span>Save changes</span></base-button>
        </div>
      </div>
    </Form>
  </div>
</template>
<script lang="ts" setup>
import { Form, useForm } from 'vee-validate'
import FormInput from '@/components/form/input.vue'
import FormText from '@/components/form/text.vue'
import * as yup from 'yup'
import { useProjectStore, type ProjectForm } from '@/stores/project'
import { computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  form?: ProjectForm
}>()

const emit = defineEmits(['submit'])
const projectStore = useProjectStore()
const loading = computed(() => projectStore.creating)
const validationSchema = yup.object({
  name: yup.string().required('Project name is required'),
  description: yup.string().nullable()
})

const { errors, defineField, resetForm, handleSubmit } = useForm({
  validationSchema,
})

const [name] = defineField('name')
const [description] = defineField('description')

const submitForm = handleSubmit(async (values) => {
  emit('submit', values as ProjectForm)
})

onMounted(() => {
  if (props.form) {
    resetForm({
      values: props.form,
    })
  }
})

onUnmounted(() => {
  resetForm({
    values: {},
  })
})
</script>
