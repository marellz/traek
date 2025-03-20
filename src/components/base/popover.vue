<template>
  <div class="relative group">
    <slot />
    <div
      class="absolute bottom-full p-2 rounded-xl text-sm mb-2 w-auto invisible group-hover:visible after:block after:w-4 after:h-4 after:bg-inherit after:absolute after:rounded-full after:bottom-0 after:translate-y-1/4" :class="[popoverClass, color]">
      <slot name="popover-content">
        <p>{{ text ?? 'No text' }}</p>
      </slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
withDefaults(defineProps<{
  text?: string;
  color?: string;
  popoverClass?: string
}>(), {
  color: 'bg-black text-white'
})
</script>
