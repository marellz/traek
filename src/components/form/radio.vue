<template>
  <label :for="id" class="flex items-center">
    <input
      class="rounded-full border-gray-300 text-primary focus:ring-primary"
      type="radio"
      :value
      :disabled
      :required
      :name
      v-model="proxyChecked"
      :id
    />
    <slot>
      <p class="ml-2 text-sm text-gray-600">{{ label }}</p>
    </slot>
  </label>
</template>
<script setup lang="ts">
import useCustomId from '@/composables/useCustomId'
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits(['update:checked'])

const props = defineProps<{
  checked?: boolean
  value?: boolean | string | number
  required?: boolean
  disabled?: boolean
  label?: string
  name?: string
}>()

const id = ref()

const proxyChecked = computed({
  get() {
    return props.checked
  },

  set(val) {
    emit('update:checked', val)
  },
})

onMounted(() => {
  id.value = useCustomId()
})
</script>
