<template>
  <div class="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-3 md:space-y-0">
    <ul class="flex max-w-full space-x-2 overflow-auto rounded-lg py-1.5 md:p-2">
      <li v-for="{ label, key } in tabs" :key="key">
        <a
          :href="`#${key}`"
          class="font-secondary whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-medium text-white/25 hover:bg-slate-200/20 hover:text-white md:px-3 md:text-sm"
          :class="{ 'bg-black !text-white hover:bg-black': active === key }"
          @click.prevent="active = key"
        >
          {{ label }}
        </a>
      </li>
    </ul>
    <slot name="nav" />
  </div>
  <div class="mt-4">
    <slot :name="active" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'

interface Tab {
  key: string
  label: string
}

const props = defineProps<{
  tabs: Tab[]
  default?: string
}>()

const active = ref<string>(props.default ?? props.tabs[0].key)

const emit = defineEmits(['change'])

watch(active, (v) => {
  emit('change', v)
})

onMounted(() => {
  if (!props.default && props.tabs.length) {
    active.value = props.tabs[0].key
  }
})
</script>
