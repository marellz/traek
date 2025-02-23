<template>
  <div
    v-show="display"
    class="flex items-start space-x-2 rounded-xl border border-slate-600/10 px-4 py-2"
    :class="themes[variant].bg"
  >
    <!-- <icon-component /> -->
    <div class="flex-none pt-1.5 pl-0">
      <span class="block rounded-full p-1" :class="themes[variant].color">
        <component :size="32" :stroke-width="1.5" :is="icons[variant]" />
      </span>
    </div>
    <div class="flex-auto space-y-1 pt-2 pb-2">
      <h1 class="font-secondary text-xl leading-snug font-medium" :class="themes[variant].color">
        {{ title }}
      </h1>
      <div>
        <slot></slot>
      </div>
    </div>
    <div class="pt-2" v-if="dismissible">
      <button
        type="button"
        @click="dismiss"
        class="rounded-full p-2 hover:bg-slate-900/20"
      >
        <X />
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { AlertCircle, CircleCheck, Info, X } from 'lucide-vue-next'
import { ref, type Component } from 'vue'

export type AlertVariants = 'success' | 'info' | 'error'
type VariantThemes = {
  [key in AlertVariants]: {
    bg: string
    color: string
  }
}
type VariantIcons = {
  [key in AlertVariants]: Component
}
withDefaults(
  defineProps<{
    variant?: AlertVariants
    dismissible?: boolean
    title?: string
  }>(),
  {
    variant: 'info',
    title: 'Alert',
  },
)

const emit = defineEmits(['dismiss'])

const icons: VariantIcons = {
  error: AlertCircle,
  info: Info,
  success: CircleCheck,
}

const themes: VariantThemes = {
  error: {
    bg: 'bg-red-100/50',
    color: 'text-red-500',
  },
  info: { bg: 'bg-blue-100/50', color: 'text-blue-500' },
  success: {
    bg: 'bg-green-100/50',
    color: 'text-green-500',
  },
}

const display = ref(true)
const dismiss = () => {
  emit('dismiss')
  display.value = false
}
</script>
