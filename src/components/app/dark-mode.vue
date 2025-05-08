<template>
  <button type="button" class="p-1" @click="toggleDarkMode()">
    <Sun v-if="isDark" class="text-white" />
    <Moon v-else />
  </button>
</template>
<script lang="ts" setup>
import { Sun, Moon } from 'lucide-vue-next'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDarkMode = useToggle(isDark)
</script>
