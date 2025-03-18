<template>
  <div class="py-10 text-center border border-slate-300 dark:border-slate-400 rounded-xl">
    <div class="space-y-2">
      <h1 class="text-4xl font-bold">{{ title }}</h1>
      <p class="text-xl text-slate-600 dark:text-slate-400">{{ text }}</p>
    </div>
    <div class="flex justify-center">
      <slot />
    </div>
  </div>
</template>
<script lang="ts" setup>
withDefaults(defineProps<{
  title?: string
  text?: string
}>(), {
  title: 'Empty',
  text: 'Nothing in db. Nothing to show'
})
</script>
