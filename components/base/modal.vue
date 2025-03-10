<template>
  <div
    class="fixed inset-0 z-20 flex items-start justify-center overflow-auto bg-black/10 p-4 backdrop-blur-sm"
    :class="{ 'hidden opacity-0': !show }"
  >
    <layout-card ref="modal" class="w-full" :class="width">
      <div class="flex items-center">
        <slot name="header">
          <div>
            <h1 class="font-secondary text-2xl font-semibold">{{ title }}</h1>
          </div>
        </slot>
        <button type="button" class="ml-auto rounded-full p-2 hover:bg-black/10" @click="close">
          <X :size="24" />
        </button>
      </div>
      <div class="py-5">
        <slot />
      </div>
    </layout-card>
  </div>
</template>
<script lang="ts" setup>
import LayoutCard from '@/components/layout/card.vue'
import { onClickOutside } from '@vueuse/core'
import { X } from 'lucide-vue-next'
import { ref, watch } from 'vue'
const emit = defineEmits(['close'])
withDefaults(
  defineProps<{
    title?: string
    width?: string
  }>(),
  {
    width: 'max-w-2xl',
  },
)

const show = defineModel<boolean>('show', { default: false })
const close = () => {
  show.value = false
  emit('close')
}

const modal = ref()

onClickOutside(modal, close)

watch(show, (v) => {
  const w = document.body.classList
  if (v) {
    w.add('md:!overflow-hidden')
  } else {
    w.remove('md:!overflow-hidden')
  }
})
</script>
