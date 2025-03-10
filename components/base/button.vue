<template>
  <button
    class="font-secondary relative inline-flex items-center justify-center space-x-2 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring focus:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed md:px-4 md:text-base"
    :type
    :class="themes[variant]"
    :disabled="loading || disabled"
  >
    <slot />
    <base-loader v-if="loading" class="absolute right-0" loader-class="h-4" />
  </button>
</template>
<script lang="ts" setup>
export type BtnVariants =
  | 'primary'
  | 'secondary'
  | 'primary-outline'
  | 'secondary-outline'
  | 'danger'
  | 'white-outline'
type VariantThemes = {
  [key in BtnVariants]: string
}

withDefaults(
  defineProps<{
    loading?: boolean
    disabled?: boolean
    type?: 'submit' | 'button' | 'reset' | undefined
    variant?: BtnVariants
  }>(),
  {
    variant: 'primary',
  },
)

const themes: VariantThemes = {
  primary:
    'text-white border-primary bg-primary hover:bg-primary-darker disabled:bg-primary/40 disabled:border-primary/10 focus:ring-primary-lighter',
  'primary-outline':
    'border-current text-primary hover:bg-primary hover:text-white hover:border-primary disabled:text-primary-darker/4 0 disabled:hover:bg-transparent disabled:border-primary-darker/30 focus:ring-primary-lighter',
  secondary:
    'text-white border-gray-800 bg-gray-800 hover:bg-gray-700 hover:border-gray-700 disabled:bg-gray-500/50 disabled:border-gray-500/10 focus:ring-slate-400',
  'secondary-outline':
    'border-current text-slate-800 hover:bg-slate-300 disabled:hover:bg-transparent disabled:text-gray-400 disabled:opacity-50 focus:ring-slate-400',
  danger:
    'border-red-100 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 disabled:border-red-500/50 disabled:text-red-500/50 disabled:hover:bg-transparent focus:ring-red-200',
  'white-outline':
    'border-white text-white hover:text-black hover:bg-white hover:border-white disabled:border-white/50 disabled:text-white/50 disabled:hover:bg-transparent focus:ring-white/50 focus:ring-offset-0',
}
</script>
