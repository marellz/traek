<template>
  <label :for="id" class="items-cente flex">
    <input
      :id
      v-model="model"
      class="invisible absolute -z-10 h-0 w-0"
      type="checkbox"
      :value
      :required
      :disabled
      :name
    >

    <div
      class="flex flex-auto select-none items-start space-x-2 rounded-lg border border-gray-300 p-2"
      :class="{
        'border-primary': checked,
        'border-gray-200 bg-gray-200': disabled,
      }"
    >
      <span class="text-gray-300" :class="{ '!text-primary': checked, 'text-gray-500': disabled }">
        <CheckCircle2 :size="24" stroke-width="1.5" />
      </span>
      <div>
        <h1
          class="font-secondary font-medium"
          :class="{ 'text-primary': checked, 'text-gray-500': disabled }"
        >
          {{ label }}
        </h1>
        <p class="text-sm text-slate-500">{{ subtitle }}</p>
      </div>
    </div>
  </label>
</template>
<script lang="ts" setup>
import useCustomId from '@/composables/useCustomId'
import { CheckCircle2 } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
withDefaults(
  defineProps<{
    name?: string
    disabled?: boolean
    required?: boolean
    value?: string | number | boolean
    label: string
    subtitle?: string
  }>(),
  {
    value: true,
  },
)

const id = ref()
const model = defineModel<boolean|string|number>()
const checked = computed(() => model.value)
onMounted(() => {
  id.value = useCustomId()
})
</script>
