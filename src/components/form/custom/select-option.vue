<template>
  <div class="relative">
    <input type="radio" class="invisible h-0 w-0 absolute -z-10" :name :id v-model="model" :value :disabled />
    <label :for="id" class="p-2 flex dark:text-white text-sm hover:bg-slate-100 dark:hover:bg-slate-700">
      <slot />
      <span class="!ml-auto">
        <Check :size="16" v-if="model === value" />
      </span>
    </label>
  </div>
</template>
<script lang="ts" setup>
import useCustomId from '@/composables/useCustomId';
import { Check } from 'lucide-vue-next';
import { inject, onMounted, ref } from 'vue';

defineProps<{
  value: string | number | null
  name: string,
  disabled?: boolean
}>()

const id = ref()
const model = inject('model')

onMounted(() => {
  id.value = useCustomId()
})
</script>
