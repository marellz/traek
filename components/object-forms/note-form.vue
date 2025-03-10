<template>
  <base-loader v-if="loading.getting" />
  <Form v-else @submit="submitForm()">
    <div class="space-y-4">
      <form-input v-model="title" label="Title" :error="errors.title" />
      <form-text v-model="content" label="Content" :error="errors.content" />
      <base-button :loading="loading.creating || loading.updating">
        <span>Save changes</span></base-button
      >
    </div>
  </Form>
</template>
<script lang="ts" setup>
import { NotesLoading, useNotesStore, type ProjectNote } from '@/stores/notes'
import { Form, useForm } from 'vee-validate'
import { computed, onMounted, ref, watch } from 'vue'
import * as yup from 'yup'

const props = defineProps<{
  edit?: string | null
}>()

const notesStore = useNotesStore()
const loading = computed(() => ({
  getting: notesStore.isLoading(NotesLoading.GETTING_ONE),
  creating: notesStore.isLoading(NotesLoading.CREATING),
  updating: notesStore.isLoading(NotesLoading.UPDATING),
}))

const validationSchema = yup.object({
  title: yup.string().required('Note title is required'),
  content: yup.string().required('Note content is required'),
})

const { errors, defineField, resetForm, handleSubmit } = useForm({
  validationSchema,
})

const [title] = defineField('title')
const [content] = defineField('content')

const emit = defineEmits(['submit'])
const submitForm = handleSubmit((values) => {
  emit('submit', values)
})

const reset = () => {
  resetForm({
    values: {},
  })
}

watch(
  () => props.edit,
  (v) => {
    if (v) {
      getNote()
    } else {
      reset()
    }
  },
)

const noteData = ref<ProjectNote | null>(null)
const getNote = async () => {
  if (!props.edit) return
  const _data = await notesStore.get(props.edit)
  if (_data) {
    noteData.value = _data
    const { title, content } = _data
    resetForm({
      values: {
        title,
        content,
      },
    })
  }
}

onMounted(() => {
  if (props.edit) {
    getNote()
  } else {
    reset()
  }
})
</script>
