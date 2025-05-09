<template>
  <header class="py-4" ref="header">
    <layout-container>
      <div class="flex space-x-4">
        <div class="relative flex-auto">
          <form @submit.prevent="
            () => {
              console.log('Search')
            }
          ">
            <Search class="pointer-events-none absolute top-2 left-2 opacity-20" />
            <input type="search"
              class="rounded border border-slate-400 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 p-2 pl-10 outline-none w-full max-w-xl"
              placeholder="Search" />
            <!-- <button class="border p-1 border-slate-300 ml-2 rounded font-medium text-slate-500">Search</button> -->
          </form>
        </div>
        <span class="border-l border-slate-200"></span>
        <div class="flex items-centers space-x-4">
          <user-menu></user-menu>
          <notification-wrapper></notification-wrapper>
          <button type="button" class="p-1">
            <Settings />
          </button>
          <dark-mode></dark-mode>
        </div>
      </div>
    </layout-container>
  </header>
</template>
<script lang="ts" setup>
import NotificationWrapper from '@/components/notifications/wrapper.vue'
import UserMenu from '@/components/user/menu.vue'
import { Search, Settings } from 'lucide-vue-next'
import { ref, useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'
import DarkMode from '@/components/app/dark-mode.vue'
const showUserMenu = ref(false)
const headerRef = useTemplateRef('header')
onClickOutside(headerRef, () => {
  showUserMenu.value = false
})

</script>
