<template>
  <button
    class="px-3 py-2 md:px-6 leading-normal text-xs md:text-sm font-medium font-secondary rounded-lg transition-colors border inline-flex items-start space-x-2 justify-center relative focus:ring disabled:cursor-not-allowed focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
    :type :class="themes[variant]" :disabled="loading || disabled">
    <slot />
    <base-loader class="absolute right-2 top-1/2 -translate-y-1/2 !py-0" loader-class="!h-3 !w-3" v-if="loading" />
  </button>
</template>
<script lang="ts" setup>
import BaseLoader from "@/components/base/loader.vue"
export type BtnVariants =
  | "primary"
  | "secondary"
  | "primary-outline"
  | "secondary-outline"
  | "danger"
  | "white-outline"
type VariantThemes = {
  [key in BtnVariants]: string
}

withDefaults(
  defineProps<{
    loading?: boolean
    disabled?: boolean
    type?: "submit" | "button" | "reset" | undefined
    variant?: BtnVariants
  }>(),
  {
    variant: "primary",
  },
)

const themes: VariantThemes = {
  primary:
    "text-white border-primary bg-primary hover:bg-primary-darker disabled:bg-primary/40 disabled:border-primary/10 focus:ring-primary-lighter",
  "primary-outline":
    "border-current text-primary hover:bg-primary hover:text-white hover:border-primary disabled:text-primary-darker/4 0 disabled:hover:bg-transparent disabled:border-primary-darker/30 focus:ring-primary-lighter",
  secondary:
    "text-white border-gray-800 bg-gray-800 hover:bg-gray-700 hover:border-gray-700 disabled:bg-gray-500/50 disabled:border-gray-500/10 focus:ring-slate-400",
  "secondary-outline":
    "border-current text-slate-800 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-800 disabled:hover:bg-transparent disabled:text-gray-400 disabled:opacity-50 focus:ring-slate-400",
  danger:
    "border-red-100 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 disabled:border-red-500/50 disabled:text-red-500/50 disabled:hover:bg-transparent focus:ring-red-200",
  "white-outline":
    "border-white text-white hover:text-black hover:bg-white hover:border-white disabled:border-white/50 disabled:text-white/50 disabled:hover:bg-transparent focus:ring-white/50 focus:ring-offset-0",
}
</script>
