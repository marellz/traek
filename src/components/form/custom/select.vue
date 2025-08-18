<template>
  <div>
    <form-label v-if="label" :for="id">
      {{ label }}
      <span v-if="required">&ast;</span>
    </form-label>
    <div ref="wrapper" class="relative border border-slate-200 dark:border-slate-600 rounded-lg">
      <button type="button" class="flex items-center space-x-2 w-full text-left" @click="active = !active">
        <p class="dark:text-white p-2 flex-auto">{{ model || placeholder }}</p>
        <span>
          <ChevronsUpDown :size="16" />
        </span>
      </button>
      <div v-show="active"
        class="border rounded-lg py-2 absolute top-full bg-white border-slate-200 dark:border-slate-500 mt-1 dark:bg-slate-800 w-full z-10">
        <PerfectScrollbar class="max-h-64">
          <slot>
            <custom-select-option v-for="(option, index) in options" :key="index" :value="option[valueKey]" :name>
              <p>
                {{ option[labelKey] }}
              </p>
              <slot />
            </custom-select-option>
          </slot>
          <slot />
        </PerfectScrollbar>
      </div>
    </div>
    <form-error v-if="error" class="mt-1">{{ error }}</form-error>
  </div>
</template>
<script setup lang="ts">
import CustomSelectOption from '@/components/form/custom/select-option.vue'
import FormLabel from "@/components/form/label.vue"
import FormError from "@/components/form/error.vue"
import useCustomId from "@/composables/useCustomId"
import { onMounted, provide, ref, useTemplateRef } from "vue"
import { ChevronsUpDown } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/style.css'

withDefaults(
  defineProps<{
    label?: string | undefined
    error?: string | undefined
    type?: string | undefined
    placeholder?: string
    disabled?: boolean
    required?: boolean
    inputClass?: string
    options?: any[]
    valueKey?: string | number
    labelKey?: string | number
  }>(),
  {
    type: "text",
    valueKey: 'value',
    labelKey: 'label',
    placeholder: "Select option",
  },
)

const id = ref()
const name = ref()
const active = ref(false)
const model = defineModel<string | number | null | undefined>({
  required: true,
  default: null,
})

provide('model', model)

const input = ref<HTMLInputElement | null>(null)
const wrapper = useTemplateRef('wrapper')
onClickOutside(wrapper, () => {
  if (active.value) active.value = false
})
onMounted(() => {
  if (input.value?.hasAttribute("autofocus")) {
    input.value?.focus()
  }

  id.value = useCustomId()
  name.value = useCustomId()
})

defineExpose({ focus: () => input.value?.focus() })
</script>
