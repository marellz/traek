<template>
  <div>
    <quill-editor theme="snow" content-type="html" v-model:content="model"></quill-editor>
    <form-error v-if="error" class="mt-1">{{ error }}</form-error>
  </div>
</template>
<script lang="ts" setup>
import FormError from "@/components/form/error.vue"
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@/assets/style/components/quill.css'
defineProps<{
  error?: string
}>()

const model = defineModel<any>()

</script>
