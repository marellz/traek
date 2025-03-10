<template>
  <div
    class="relative z-10 m-4 mb-0 flex max-w-sm items-start rounded-xl bg-black text-white first:!mb-10"
    :class="[toastTheme.shadow]"
  >
    <span
      class="m-3 block w-1 flex-none self-stretch rounded-full bg-current"
      :class="[toastTheme.color]"
    />
    <div class="flex-auto p-2">
      <h1 class="font-secondary font-medium" :class="[toastTheme['color']]">
        {{ toast.title }}
      </h1>
      <p
        v-if="toast.description"
        class="line-clamp-3 text-xs font-light md:text-sm"
        :title="toast.description"
      >
        {{ toast.description }}
      </p>
    </div>
    <button
      type="button"
      class="m-2 rounded-full p-2 hover:bg-white/20"
      @click="$emit('close', toast.id)"
    >
      <x :size="20" />
    </button>
  </div>
</template>
<script lang="ts" setup>
import type { Toast, ToastVariant } from '@/stores/toasts'
import { X } from 'lucide-vue-next'
import { computed } from 'vue'
const props = defineProps<{
  toast: Toast
}>()

defineEmits(['close'])

const defaultVariant: ToastVariant = 'info'

interface Theme {
  bg: string
  color: string
  shadow: string
}

interface Themes {
  success: Theme
  info: Theme
  error: Theme
}

const themes: Themes = {
  success: {
    bg: 'bg-green-100',
    color: 'text-green-500',
    shadow: 'border-green-200',
  },
  info: {
    bg: 'bg-blue-100',
    color: 'text-blue-500',
    shadow: 'border-blue-200',
  },
  error: { bg: 'bg-red-100', color: 'text-red-500', shadow: 'border-red-200' },
}

const toastTheme = computed(() => {
  const v = props.toast.variant || defaultVariant
  return themes[v as keyof Themes]
})
</script>
