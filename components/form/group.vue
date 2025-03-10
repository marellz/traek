<template>
  <div>
    <form-label v-if="label">
      {{ label }}
    </form-label>
    <div>
      <slot />
    </div>
    <form-error v-if="error" class="mt-1">{{ error }}</form-error>
  </div>
</template>
<script lang="ts" setup>
withDefaults(
  defineProps<{
    label: string
    error?: string
  }>(),
  {},
)
</script>
