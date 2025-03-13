<template>
  <!-- <Teleport to="body"> -->
  <div v-if="show" class="fixed inset-0 bg-black/20 z-20 p-4 flex items-start justify-center"
  :class="{
    '!visible !opacity-full': show
  }">
    <layout-card ref="wrapper" class="max-w-lg">
      <div class="space-y-2">
        <div class="flex justify-between">
          <h1 class="text-xl font-medium">{{ title }}</h1>
          <button type="button" class="p-1" @click="close">
            <X />
          </button>
        </div>
        <p>{{ text }}</p>
        <div class="!mt-4 flex items-center space-x-2">
          <base-action @click="close">
            <span>Cancel</span>
          </base-action>
          <base-action @click="confirm">
            <span>Confirm</span>
          </base-action>
        </div>
      </div>
    </layout-card>
  </div>
  <!-- </Teleport> -->
</template>
<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import { X } from 'lucide-vue-next';
import { useTemplateRef } from 'vue';
import LayoutCard from '@/components/layout/card.vue'

withDefaults(defineProps<{
  title?: string;
  text?: string
}>(), {
  title: 'Confirm action',
  text: 'Are you sure you want to confirm this action?'
})

const show = defineModel<boolean>({ required: true })
const emit = defineEmits(['confirm', 'cancel'])

const close = () => {
  emit('cancel')
  show.value = false
}

const confirm = () => {
  emit('confirm')
  show.value = false
}

const wrapper = useTemplateRef('wrapper')
onClickOutside(wrapper, close)
</script>