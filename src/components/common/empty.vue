<template>
  <div class="py-10 text-center border border-slate-300 rounded-xl">
    <div class="space-y-2">
      <h1 class="text-4xl font-medium">Empty</h1>
      <p class="text-xl">{{ text }}</p>
    </div>
    <div class="flex justify-center">
      <slot />
    </div>
  </div>
</template>
<script lang="ts" setup>
withDefaults(defineProps<{
  text?: string
}>(), {
  text: 'Nothing in db. Nothing to show'
})
</script>
