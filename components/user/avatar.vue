<template>
  <img
    v-if="avatar"
    class="rounded-full border-2 object-cover object-center"
    :class="sizes[size]"
    :src="avatar"
    alt=""
  >
  <span
    v-else
    class="inline-flex items-center justify-center rounded-full border-2 border-white/10 bg-white/20"
    :class="sizes[size]"
  >
    <User2 :size="30" :stroke-width="1" />
  </span>
</template>
<script lang="ts" setup>
import { User2 } from 'lucide-vue-next'
type sizes = 'lg' | 'md' | 'sm'
type sizeClasses = Record<sizes, string>
withDefaults(
  defineProps<{
    avatar: string | null | undefined
    size?: sizes
  }>(),
  {
    size: 'md',
  },
)

const sizes: sizeClasses = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}
</script>
