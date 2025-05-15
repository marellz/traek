<template>
  <fieldset class="block border border-slate-100 dark:border-slate-800 rounded-xl p-8">
    <legend class="ml-2 text-sm font-medium text-slate-500 px-2">{{ legend }}</legend>
    <div :class="[wrapperClass]">
      <slot />
    </div>
  </fieldset>
</template>
<script lang="ts" setup>
withDefaults(defineProps<{
  legend: string;
  wrapperClass?: string
}>(), {
  wrapperClass: 'space-y-8'
})
</script>
