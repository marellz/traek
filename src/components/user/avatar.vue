<template>
  <img v-if="avatar" class="object-center object-cover rounded-full border-2" :class="size" :src="avatar" alt="" />
  <span v-else class="rounded-full border-2 border-white/10 bg-white/20 inline-flex items-center justify-center"
    :class="size">
    <User :size="iconSize" :stroke-width="1" />
  </span>
</template>
<script lang="ts" setup>
import { User } from "lucide-vue-next"
withDefaults(
  defineProps<{
    avatar: string | null | undefined
    size?: string
    iconSize?: number
  }>(),
  {
    iconSize: 24,
    size: "h-6 w-6",
  },
)
</script>
