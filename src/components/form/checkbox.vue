<template>
  <div>
    <label :for="id" class="flex items-center relative">
      <input class="invisible w-0 h-0 -z-10 absolute" type="checkbox" :value :required :disabled :name :id
        v-model="model">
      <span
        class="border flex-none border-slate-200 dark:border-slate-800 h-5 w-5 rounded inline-flex justify-center items-center"
        :class="{ '!border-black dark:!border-slate-500': isChecked }">
        <Check v-show="isChecked" :size="16" :stroke-width="2" class="border-inherit" />
      </span>
      <slot>
        <p class="ml-2 text-sm text-gray-600 dark:text-slate-500">
          {{ label }}
        </p>
      </slot>
    </label>
  </div>
</template>
<script lang="ts" setup>
import useCustomId from '@/composables/useCustomId';
import { Check } from 'lucide-vue-next';
import { computed, onMounted, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
  label?: string;
  name?: string;
  value?: boolean | string | number;
  required?: boolean;
  disabled?: boolean;
}>(), {
  value: true
});

const emit = defineEmits(['change'])

const model = defineModel()
const id = ref()
const isChecked = computed(() => props.value === model.value)

watch(model, (v) => {
  emit('change', v)
})

onMounted(() => {
  id.value = useCustomId()
})
</script>
