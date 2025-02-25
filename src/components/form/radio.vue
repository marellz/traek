<template>
  <label :for="id" class="flex items-center">
    <input
      class="rounded-full border-gray-300 text-primary focus:ring-primary"
      type="radio"
      :value
      :disabled
      :required
      :name
      v-model="model"
      :id
    />
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

const model =defineModel()

onMounted(() => {
  id.value = useCustomId()
  if(props.value){
    model.value = props.value
  }
})
</script>
