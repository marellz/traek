<template>
  <base-modal v-model:show="show">
    <Form @submit="submitForm()">
      <div class="space-y-4">
        <form-input label="Goal name" class="flex-auto" v-model="title" :error="errors.title"></form-input>
        <form-text label="Goal description" class="flex-auto" v-model="description"
          :error="errors.description"></form-text>
        <form-group label='Goal status' :error="errors.status">
          <div class="flex flex-wrap gap-4">
            <form-radio name="status" v-model="status" :value="item.value" v-for="item in statuses" :key="item.value">
              <div>
                <h3 class="capitalize font-medium">{{ item.label }}</h3>
              </div>
            </form-radio>
          </div>
        </form-group>
        <div class="flex space-x-4 items-center">
          <base-button class="!items-center" variant="primary-outline">
            <span v-if="selected">Update goal</span>
            <span v-else>Add goal</span>
          </base-button>
          <base-button variant="secondary" type="button" @click="$emit('cancel')">
            <span>Cancel</span>
          </base-button>
        </div>
      </div>
    </Form>
  </base-modal>
</template>
<script lang="ts" setup>
import FormInput from '@/components/form/input.vue'
import FormText from '@/components/form/text.vue'
import FormGroup from '@/components/form/group.vue'
import FormRadio from '@/components/form/radio.vue'
import { Form, useForm } from 'vee-validate'
import * as yup from 'yup'
import { computed, onMounted } from 'vue';
import { watch } from 'vue';
import type { ProjectGoal } from '@/stores/project';
import { ProjectGoalStatusEnum, projectGoalStatuses } from '@/data/projects.data'

const props = defineProps<{
  selected: ProjectGoal | null
}>()

const { errors, defineField, resetForm, handleSubmit } = useForm({
  validationSchema: yup.object({
    title: yup.string().required('Your goal needs to have a name'),
    description: yup.string().nullable(),
    status: yup.string().required('You need to set a status for your project')
  })
})

const emit = defineEmits(['update', 'create', 'cancel'])
const show = defineModel<boolean>({ default: false })
const [title] = defineField('title')
const [description] = defineField('description')
const [status] = defineField('status')

const submitForm = handleSubmit((values) => {
  emit(props.selected ? 'update' : 'create', values)
})

const statuses = computed(() => Object.values(ProjectGoalStatusEnum).map(g => ({
  label: projectGoalStatuses[g],
  value: g,
})))

interface ProjectGoalFormValues {
  title: string,
  description: string | null;
  status: string;
}

const setFormValues = (values: ProjectGoalFormValues) => {
  resetForm({ values })
}

watch(() => props.selected, (v) => {
  if (v) {
    const {
      title, description, status
    } = v

    setFormValues({
      title,
      description,
      status
    })
  }
})

onMounted(() => {
  resetFormValues()
})

const resetFormValues = () => {
  resetForm({
    values: {
      title: '',
      description: '',
      status: 'pending'
    }
  })
}

defineExpose({
  resetFormValues
})
</script>
