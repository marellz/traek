<template>
  <header class="py-4" ref="header">
    <layout-container>
      <div class="flex space-x-4">
        <div class="relative flex-auto">
          <form
            @submit.prevent="
              () => {
                console.log('Search')
              }
            "
          >
            <Search class="pointer-events-none absolute top-2 left-2 opacity-20" />
            <input
              type="search"
              class="rounded border border-slate-400 bg-slate-50 p-2 pl-10 outline-none w-full max-w-xl"
              placeholder="Search"
            />
            <!-- <button class="border p-1 border-slate-300 ml-2 rounded font-medium text-slate-500">Search</button> -->
          </form>
        </div>
        <span class="border-l border-slate-200"></span>
        <user-menu></user-menu>
        <button type="button" class="p-1">
          <Bell />
        </button>
        <button type="button" class="p-1">
          <Settings />
        </button>
      </div>
    </layout-container>
  </header>
</template>
<script lang="ts" setup>
import UserMenu from '@/components/user/menu.vue'
import { Bell, Search, Settings } from 'lucide-vue-next'
import { ref, useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'

const showUserMenu = ref(false)
const headerRef = useTemplateRef('header')

onClickOutside(headerRef, () => {
  showUserMenu.value = false
})
</script>
