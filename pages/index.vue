<template>
  <layout-container class="py-10">
    <div class="shadow-xs space-y-6 rounded-xl bg-white p-8">
      <h1 class="text-4xl font-bold md:text-[80px]">
        Welcome to <span class="font-light">Traek!</span>
      </h1>
      <p class="max-w-3/4 text-2xl">
        A simple yet powerful project management tool for teams and individuals. Plan, collaborate,
        and track your progress—all in one place.
      </p>

      <div class="flex items-center space-x-2">
        <router-link v-if="!auth.isAuthenticated" to="/auth/register">
          <base-button>
            <span>Get started for free</span>
          </base-button>
        </router-link>
        <router-link v-else to="/dashboard">
          <base-button>
            <span>Go to my dashboard</span>
          </base-button>
        </router-link>
      </div>
    </div>
  </layout-container>
</template>
<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'

definePageMeta({
  layout: 'home',
})

const auth = useAuthStore()
</script>
