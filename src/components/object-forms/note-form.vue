<template>
  <base-loader v-if="getting"></base-loader>
  <Form v-else @submit="submitForm()">
    <div class="space-y-4">
      <form-input label="Title" v-model="title" :error="errors.title"></form-input>
      <form-quill v-model="content" :error="errors.content"></form-quill>
      <base-button :loading>
        <span>Save changes</span></base-button>
    </div>
  </Form>
</template>
<script lang="ts" setup>
import FormInput from '@/components/form/input.vue'
import FormQuill from '@/components/form/quill.vue'
import { NotesLoading, useNotesStore, type ProjectNote } from '@/stores/notes'
import { Form, useForm } from 'vee-validate'
import { computed, onMounted, ref, watch } from 'vue'
import * as yup from 'yup'

const props = defineProps<{
  edit?: string | null
  loading?: boolean;
}>()

const notesStore = useNotesStore()
const getting = computed(() => notesStore.isLoading(NotesLoading.GETTING_ONE))

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
    values: {
      title: '',
      content: '<p></p>'
    },
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
