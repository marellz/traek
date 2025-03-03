<template>
  <div>
    <form-label v-if="label" :for="id">
      {{ label }}
      <span v-if="required">&ast;</span>
    </form-label>
    <div>
      <textarea
        class="form-input min-h-16"
        :class="[{ 'is-invalid': error }, inputClass]"
        v-model="model"
        :id
        :resize
        :disabled
        :required
        :placeholder
        :rows
        ref="input"
      ></textarea>
    </div>
    <form-error v-if="error" class="mt-1">{{ error }}</form-error>
  </div>
</template>
<script setup lang="ts">
import FormLabel from '@/components/form/label.vue'
import FormError from '@/components/form/error.vue'
import useCustomId from '@/composables/useCustomId'
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string | undefined
    error?: string | undefined
    type?: string | undefined
    placeholder?: string | undefined
    resize?: boolean
    required?: boolean
    disabled?: boolean
    rows?: number | string
    inputClass?: string
    noAutoResize?: boolean
  }>(),
  {
    type: 'text',
  },
)

const id = ref()
type SelectInput = string | number | readonly string[] | null | undefined
const model = defineModel<SelectInput | undefined>()

const input = ref()

const setHeight = () => {
  if(props.noAutoResize){
    return
  }
  if (input.value) {
    input.value.style = `height: ${input.value.scrollHeight}px`
  } else {
    setTimeout(setHeight, 250)
  }
}

watch(model, setHeight, {
  immediate: true
})

onMounted(() => {
  if (input.value?.hasAttribute('autofocus')) {
    input.value?.focus()
  }

  id.value = useCustomId()
})

defineExpose({ focus: () => input.value?.focus() })
</script>
