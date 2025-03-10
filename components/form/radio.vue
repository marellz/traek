<template>
  <label :for="id" class="flex items-center">
    <input
      :id
      v-model="model"
      class="text-primary focus:ring-primary rounded-full border-gray-300"
      type="radio"
      :value
      :disabled
      :required
      :name
    >
    <slot>
      <p class="ml-2 text-sm text-gray-600">{{ label }}</p>
    </slot>
  </label>
</template>
<script setup lang="ts">
import useCustomId from '@/composables/useCustomId'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  checked?: boolean
  value?: boolean | string | number
  required?: boolean
  disabled?: boolean
  label?: string
  name?: string
}>()

const id = ref()

const model = defineModel<boolean|string|number|object>()

onMounted(() => {
  id.value = useCustomId()
  if (props.value) {
    model.value = props.value
  }
})
</script>
