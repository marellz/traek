<template>
  <header class="border-b border-b-slate-300 py-4" ref="header">
    <layout-container>
      <div class="flex">
        <h1 class="font-bold text-2xl">
          Dashboard
        </h1>

        <div class="ml-auto flex space-x-4">
          <div class="relative">
            <form @submit.prevent="() => { console.log('Search') }">
              <Search class="absolute top-2 left-2 opacity-20 pointer-events-none" />
              <input type="search" class="p-2 pl-10 bg-slate-200 rounded" placeholder="Search" />
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
      </div>
    </layout-container>
  </header>
</template>
<script lang="ts" setup>
import UserMenu from '@/components/user/menu.vue'
import { Bell, Search, Settings } from 'lucide-vue-next';
import { ref, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';

const showUserMenu = ref(false)
const headerRef = useTemplateRef('header')

onClickOutside(headerRef, () => {
  showUserMenu.value = false
})
</script>
