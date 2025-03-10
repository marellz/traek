<template>
  <div>
    <input
      :id="`tag-${id}`"
      v-model="model"
      type="checkbox"
      :name
      class="absolute -z-10 h-0 w-0"
      :value
    >
    <label
      :for="`tag-${id}`"
      class="font-secondary !ml-0 inline-flex cursor-pointer select-none items-center space-x-2 rounded-full border border-slate-500 px-4 py-1.5 text-sm font-medium text-slate-500 transition-all hover:border-slate-800 hover:text-slate-800"
      :class="{
        '!border-primary bg-primary hover:!border-primary !px-2 text-white hover:!text-white':
          checked,
      }"
    >
      <span>
        {{ label }}
      </span>
      <Check v-show="checked" :size="16" :class="{ 'invisible w-0': !checked }" />
    </label>
  </div>
</template>
<script lang="ts" setup>
import useCustomId from '@/composables/useCustomId'
import { Check } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  label: string
  name: string
  value: string
}>()

const id = ref()
const model = defineModel<string[]>({ default: [] })

const checked = computed(() => model.value.includes(props.value))

onMounted(() => {
  id.value = useCustomId()
})
</script>
