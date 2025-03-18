<template>
  <span
    class="inline-flex items-center justify-center border rounded-full text-sm font-medium border-current text-slate-500 px-2"
    :class="[variants[variant]]">
    <slot />
  </span>
</template>
<script lang="ts" setup>
type TagVariant = 'blue' | 'red' | 'green' | 'slate'
withDefaults(defineProps<{
  variant?: TagVariant
}>(), {
  variant: 'slate'
})

const variants: Record<TagVariant, string> = {
  blue: "border border-current text-blue-500",
  green: "border border-current text-blue-500",
  red: "border border-current text-blue-500",
  slate: "border border-current text-slate-600"
}
</script>