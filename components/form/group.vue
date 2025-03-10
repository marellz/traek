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
import FormLabel from '@/components/form/label.vue'
import FormError from '@/components/form/error.vue'
withDefaults(
  defineProps<{
    label: string
    error?: string
  }>(),
  {},
)
</script>
