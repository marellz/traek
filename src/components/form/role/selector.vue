<template>
  <div class="relative min-w-[150px]" ref="selector">
    <button type="button" @click="active = !active" :disabled
      class="inline-flex items-center justify-between space-x-2 w-full border py-1 px-4 rounded-lg border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-100 disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:border-slate-700 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
      :class="{
        'border-b-0 rounded-b-none bg-slate-100 dark:bg-slate-700': active,
        '!text-slate-500 dark:!text-slate-400': !model && !disabled
      }">
      <span>
        {{ display }}
      </span>
      <ChevronDown :size="16" />
    </button>
    <div v-if="active"
      class="absolute rounded-xl right-0 top-full border border-slate-200 dark:border-slate-600 bg-slate-200 dark:bg-slate-700 z-20 w-full"
      :class="{ 'rounded-t-none': active }">
      <ul>
        <li v-for="item in roleOptions" :key="item.key" class="relative py-1 px-4 dark:hover:bg-slate-500/50">
          <input type="radio" :name :id="`${item.key}`" :value="item.key" @change="onChange(item.key)" v-model="model"
            class="h-0 w-0 absolute -z-10" :disabled>
          <label :for="`${item.key}`" class="flex-auto flex space-x-2 items-center text-sm ">
            <span class="flex-auto">{{ item.label }}</span>
            <Check v-if="model === item.key" :size="16" />
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import useCustomId from '@/composables/useCustomId';
import { userRoles, UserRolesEnum, type UserRole } from '@/data/users.data';
import { onClickOutside } from '@vueuse/core';
import { Check, ChevronDown } from 'lucide-vue-next';
import { computed, ref, useTemplateRef } from 'vue';

defineProps<{
  disabled?: boolean;
}>()
const emit = defineEmits(['change'])

const onChange = (value: UserRole) => {
  emit('change', value)
  hide()
}

const roleOptions = computed(() => Object.values(UserRolesEnum).map(r => ({
  key: r,
  label: userRoles[r]
})))

const display = computed(() => model.value ? userRoles[model.value] : 'Select')
const name = computed(() => useCustomId())

const model = defineModel<UserRole | null>({ default: null })

// hide/show]
const target = useTemplateRef('selector')
const active = ref(false)
const hide = () => {
  active.value = false
}

onClickOutside(target, hide)
</script>
