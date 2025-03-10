<template>
  <div v-if="loading" class="py-4 text-center">
    <base-loader />
  </div>
  <div v-else ref="dropdown" class="relative">
    <div class="relative">
      <input
        v-model="query"
        type="text"
        :placeholder
        :disabled="loading"
        class="form-input pr-10 placeholder:text-sm"
        :class="{
          'border-primary bg-primary-lighter/50 placeholder:text-primary placeholder:text-':
            hasValues,
        }"
        @focus="active = true"
      >
      <div class="absolute right-2 top-1/2 -translate-y-1/2">
        <button
          type="button"
          class="transform rounded p-2 transition-all"
          @click="active = !active"
        >
          <ChevronDown :class="{ 'text-primary rotate-180': active }" />
        </button>
      </div>
    </div>

    <div
      v-show="active"
      class="absolute top-full z-10 mt-2 max-h-56 w-full overflow-auto rounded-xl border bg-white p-2"
    >
      <ul v-if="options.length" class="space-y-1">
        <li v-for="(option, index) in options" :key="index">
          <div class="flex items-center" :class="{ 'space-x-2': !hideInput }">
            <input
              :id="`${id}-${index}`"
              v-model="model"
              class="flex-none"
              :class="{ 'absolute -z-20 h-0 w-0': hideInput }"
              type="checkbox"
              :name="`dropdown-${id}`"
              :value="option[valueKey] || ''"
              @change="onChange(option[valueKey])"
            >
            <label
              class="hover:bg-primary-lighter/25 flex flex-auto items-center space-x-2 rounded-lg p-2"
              :class="[
                {
                  'bg-primary-lighter/50 text-primary': model.includes(option[valueKey]),
                },
                labelClass,
              ]"
              :for="`${id}-${index}`"
            >
              <slot name="item" :item="option">
                <div class="font-secondary text-sm font-medium">
                  <p>
                    {{ option[labelKey] || 'Unknown' }}
                  </p>
                </div>
              </slot>
              <div v-if="model.includes(option[valueKey])" class="!ml-auto">
                <Check :size="20" />
              </div>
            </label>
          </div>
        </li>
      </ul>
      <div v-else>
        <div class="hover:bg-primary-lighter/25 rounded-lg bg-slate-100 p-2 text-sm text-slate-500">
          <span class="font-medium text-slate-700">No options.</span>
          <span> Weird parameters or there is an error somewhere... </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import useCustomId from '@/composables/useCustomId'
import { computed, onMounted, ref, watch } from 'vue'
import { Check, ChevronDown } from 'lucide-vue-next'
import { onClickOutside } from '@vueuse/core'

type Option = Record<string, any>
type Options = Option[]
withDefaults(
  defineProps<{
    options: Options
    valueKey?: string
    labelKey?: string
    placeholder?: string
    loading?: boolean
    hideInput?: boolean
    labelClass?: string
  }>(),
  {
    valueKey: 'key',
    labelKey: 'label',
  },
)
const id = ref()
const query = ref('')
const dropdown = ref()
const active = ref(false)
const emit = defineEmits(['query', 'change'])
const model = defineModel<any[]>({ default: [] })

const hasValues = computed(() => model.value.length > 0)

watch(query, () => {
  emit('query', query.value)
})

const onChange = (value: string) => {
  const isAdded = model.value.includes(value)
  emit('change', value, isAdded)
}

onMounted(() => {
  id.value = useCustomId()
})

onClickOutside(dropdown, () => {
  active.value = false
})
</script>
