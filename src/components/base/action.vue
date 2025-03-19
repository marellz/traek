<template>
  <button :type @click="onClick" ref="btn"
    :disabled="confirmed"
    class="relative inline-flex items-center space-x-2 rounded-lg border overflow-hidden border-slate-400 dark:border-slate-400 px-2 py-2 text-sm leading-none font-medium text-slate-800 dark:text-slate-400 hover:border-slate-800 dark:hover:bg-slate-800 dark:hover:border-slate-500 disabled:text-slate-400 disabled:bg-slate-100 disabled:border-slate-400 dark:disabled:bg-slate-700"
    :class="{'!border-red-500': confirmMode}">

    <div v-show="confirmMode" class="absolute inset-0 flex items-center justify-center mr-0" :class="[confirmColor]">
      <p>Confirm?</p>
    </div>
    <slot />
  </button>
</template>
<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import { ref, useTemplateRef } from 'vue';

const props = withDefaults(defineProps<{
  type?: 'submit' | 'button' | undefined
  confirm?: boolean
  confirmColor?: string
}>(), {
  confirmColor: 'bg-red-500 text-white'
})

const emit = defineEmits(['click', 'confirm'])
const confirmMode = ref(false)
const confirmed = ref(false)
const btn = useTemplateRef('btn')
const onClick = () => {
  if (props.confirm && confirmMode.value) {
    emit('confirm')
    showConfirmed()
  } else if (props.confirm) {
    confirmMode.value = true
  } else {
    emit('click')
  }
}

const showConfirmed = () => {
  confirmMode.value = false
  confirmed.value = true

  setTimeout(() => {
    confirmed.value = true
  }, 1000)
}

onClickOutside(btn, () => {
  if (props.confirm && confirmMode.value) {
    confirmMode.value = false
  }
})
</script>
