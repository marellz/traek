<template>
  <transition-group
    tag="ul"
    name="toasts"
    class="fixed bottom-0 left-0 z-20 flex h-1 w-full flex-col-reverse items-end space-y-4"
  >
    <toast-item
      v-for="toast in toasts"
      :key="toast.id"
      :toast
      @close="toastStore.remove(toast.id)"
    />
  </transition-group>
</template>
<script lang="ts" setup>
import ToastItem from '@/components/toast/item.vue'
import { useToastsStore } from '@/stores/toasts'
import { computed } from 'vue'

const toastStore = useToastsStore()
const toasts = computed(() => toastStore.toasts)
</script>
<style>
.toasts-enter-to,
.toasts-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.toasts-enter-from,
.toasts-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.toasts-leave-to {
  transform: translateT(50%);
}

.toasts-leave-active,
.toasts-enter-active {
  transition: all 0.15s ease;
}

.toasts-move {
  transition-delay: 0.05s;
  position: absolute;
}
</style>
