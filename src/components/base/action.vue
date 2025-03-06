<template>
  <button
    :type
    class="hover rounded-lg border border-slate-400 px-2 py-2 text-sm leading-none font-medium text-slate-800 hover:border-slate-800 disabled:text-slate-400 disabled:bg-slate-100 disabled:border-slate-400"
  >
    <slot />
  </button>
</template>
<script lang="ts" setup>
defineProps<{
  type?: 'submit' | 'button' | undefined
}>()
</script>
