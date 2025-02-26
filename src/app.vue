<template>
  <component :is="layout">
    <router-view />
  </component>
  <toasts-wrapper />
</template>
<script lang="ts" setup>
import ToastsWrapper from '@/components/toast/wrapper.vue'
import { computed, onMounted, type Component } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '@/layouts/default.vue'
import AuthLayout from '@/layouts/auth.vue'
import HomeLayout from '@/layouts/home.vue'
import BlankLayout from '@/layouts/blank.vue'
import { useAuthStore } from './stores/auth';

type LayoutNames = "default" | "auth" | "home" | "blank"

const layouts: {
  [key in LayoutNames]: Component
} = {
  default: DefaultLayout,
  auth: AuthLayout,
  home: HomeLayout,
  blank: BlankLayout
}

const route = useRoute()
const preferredLayout = computed(() => route.meta.layout || "default")
const layout = computed(() => layouts[preferredLayout.value as LayoutNames])
const auth = useAuthStore()
onMounted(async () => {
  await auth.init()
})
</script>
