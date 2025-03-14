<template>
  <div ref="dropdown" class="relative">
    <button type="button" :class="triggerClass"  @click.prevent="active = !active">
      <slot name="trigger" />
    </button>
    <ul v-show="active"
      class="absolute top-full transform translate-y-1 z-10 border border-slate-300 bg-white dark:bg-slate-800 rounded-xl py-2 right-0">
      <slot />
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import { provide, ref, useTemplateRef } from 'vue';
const active = ref(false)
const wrapper = useTemplateRef('dropdown')
withDefaults(defineProps<{
  triggerClass?: string
}>(), {
  triggerClass: 'py-1 px-2 border border-slate-400 rounded-lg text-sm font-medium inline-flex items-center space-x-2 text-slate-700 dark:text-slate-300'
})
provide('close', () => {
  active.value = false
})

onClickOutside(wrapper, () => {
  active.value = false
})
</script>
