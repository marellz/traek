<template>
  <label :for="id" class="flex items-center relative">
    <input class="rounded-full border-gray-300 text-primary focus:ring-primary h-0 w-0 absolute -z-10" type="radio"
      :value :disabled :required :name v-model="model" :id />
    <div class="border border-slate-200 py-4 px-8 rounded-lg text-gray-600" :class="{ 'border-primary !text-primary': checked }">
      <CheckCircle2 :size="20" class="absolute top-1 left-1 fill-current stroke-white" :class="{'invisible': !checked}" />
      <slot>
        <p class="ml-2 text-sm" :class="labelClass">{{ label }}</p>
      </slot>
    </div>
  </label>
</template>
<script setup lang="ts">
import useCustomId from '@/composables/useCustomId'
import { CheckCircle2 } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  value?: boolean | string | number
  required?: boolean
  disabled?: boolean
  label?: string
  labelClass?: string
  name?: string
}>()

const id = ref()

const model = defineModel()
const checked = computed(() => props.value === model.value)

onMounted(() => {
  id.value = useCustomId()
  if (props.value) {
    model.value = props.value
  }
})
</script>
