<template>
  <div v-if="loading" class="py-4 text-center">
    <base-loader></base-loader>
  </div>
  <div v-else ref="dropdown" class="relative">
    <div class="relative">
      <input type="text" :placeholder v-model="query" :disabled="loading" @focus="active = true"
        class="form-input outline-none pr-10 placeholder:text-sm" :class="{
          'border-primary bg-primary-lighter/50 placeholder:text-primary placeholder:text-':
            hasValues,
        }" />
      <div class="absolute right-2 top-1/2 -translate-y-1/2">
        <button type="button" class="p-2 rounded transform transition-all" @click="active = !active">
          <ChevronDown :class="{ 'rotate-180': active }" />
        </button>
      </div>
    </div>

    <div v-show="active" class="py-2 border border-slate-200 dark:border-slate-500 rounded-xl mt-2 absolute top-full w-full bg-white dark:bg-slate-800 z-10">
      <PerfectScrollbar v-if="options.length" class="max-h-56 ">
        <ul class="space-y-1">
          <li v-for="(option, index) in options" :key="index">
            <div class="flex items-center" :class="{ 'space-x-2': showInput }">
              <input class="flex-none" :class="{ 'absolute h-0 w-0 -z-20': !showInput }"
                :type="multiselect ? 'checkbox' : 'radio'" :name="`dropdown-${id}`" :id="`${id}-${index}`"
                :value="option[valueKey] || ''" v-model="model" @change="onChange(option[valueKey])" />
              <label class="flex-auto flex items-center space-x-2 hover:bg-slate-200 dark:hover:bg-slate-600/25 p-2" :class="[
                {
                  'bg-slate-800 hover:!bg-slate-800 text-white dark:bg-slate-500 dark:hover:!bg-slate-600': isSelected(
                    option[valueKey],
                  ),
                },
                labelClass,
              ]" :for="`${id}-${index}`">
                <slot name="item" :item="option">
                  <div class="text-sm font-medium font-secondary">
                    <p>
                      {{ option[labelKey] || "Unknown" }}
                    </p>
                  </div>
                </slot>
                <div v-if="isSelected(option[valueKey])" class="!ml-auto">
                  <Check :size="20" />
                </div>
              </label>
            </div>
          </li>
        </ul>
      </PerfectScrollbar>
      <div v-else>
        <div class="text-slate-500 p-2 text-sm rounded-lg bg-slate-100 hover:bg-primary-lighter/25">
          <span class="font-medium text-slate-700">No options.</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import useCustomId from "@/composables/useCustomId"
import BaseLoader from "@/components/base/loader.vue"
import { computed, onMounted, ref, watch } from "vue"
import { Check, ChevronDown } from "lucide-vue-next"
import { onClickOutside } from "@vueuse/core"
import { PerfectScrollbar } from "vue3-perfect-scrollbar"
import 'vue3-perfect-scrollbar'

type Option = Record<string, any>
type Options = Option[]
const props = withDefaults(
  defineProps<{
    options: Options
    valueKey?: string
    labelKey?: string
    placeholder?: string
    loading?: boolean
    showInput?: boolean
    multiselect?: boolean
    labelClass?: string
  }>(),
  {
    valueKey: "key",
    showInput: false,
    multiselect: true,
    labelKey: "label",
  },
)
const id = ref()
const query = ref("")
const dropdown = ref()
const active = ref(false)
const emit = defineEmits(["query", 'change'])
const model = defineModel<any>({ default: [] })

const hasValues = computed(() => model.value.length > 0)

watch(query, () => {
  emit("query", query.value)
})

const isSelected = (value: string | number) => {
  return props.multiselect ? model.value.includes(value) : model.value === value
}

const onChange = (value: string) => {
  const isAdded = isSelected(value)
  emit('change', value, isAdded)
}


onMounted(() => {
  id.value = useCustomId()
})

onClickOutside(dropdown, () => {
  active.value = false
})
</script>
