<template>
  <template v-if="layout">
    <component :is="layout" :class="{ 'dark': isDark }">
      <router-view />
    </component>
  </template>
  <div class="h-screen flex justify-center items-center" v-else>
    <base-loader></base-loader>
  </div>
  <toasts-wrapper />
</template>
<script lang="ts" setup>
import BaseLoader from '@/components/base/loader.vue'
import ToastsWrapper from '@/components/toast/wrapper.vue'
import DefaultLayout from '@/layouts/default.vue'
import AuthLayout from '@/layouts/auth.vue'
import HomeLayout from '@/layouts/home.vue'
import BlankLayout from '@/layouts/blank.vue'
import OnboardingLayout from '@/layouts/onboarding.vue';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { useDark } from '@vueuse/core';
import { computed, onMounted, type Component } from 'vue';

type LayoutNames = "default" | "auth" | "home" | "blank" | "onboarding"

const layouts: {
  [key in LayoutNames]: Component
} = {
  default: DefaultLayout,
  auth: AuthLayout,
  home: HomeLayout,
  blank: BlankLayout,
  onboarding: OnboardingLayout
}

const route = useRoute()
const preferredLayout = computed(() => route.meta.layout || "default")
const layout = computed(() => layouts[preferredLayout.value as LayoutNames])
const auth = useAuthStore()

const isDark = useDark()

onMounted(async () => {
  await auth.init()
})
</script>
