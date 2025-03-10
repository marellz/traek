<template>
  <header class="py-4">
    <layout-container>
      <ul class="flex space-x-2">
        <li>
          <router-link class="inline-block p-2 hover:underline" to="/">Home</router-link>
        </li>
        <template v-if="isAuthenticated">
          <li>
            <router-link to="/dashboard" class="inline-block p-2 hover:underline">
              Dashboard
            </router-link>
          </li>
          <li class="!ml-auto">
            <a class="inline-block p-2 hover:underline" href="#logout" @click.prevent="onLogout"
              >Logout</a
            >
          </li>
        </template>
        <template v-else>
          <li class="!ml-auto">
            <router-link class="inline-block p-2 hover:underline" to="/auth/login"
              >Login</router-link
            >
          </li>
          <li>
            <router-link class="inline-block p-2 hover:underline" to="/auth/register"
              >Register</router-link
            >
          </li>
        </template>
      </ul>
    </layout-container>
  </header>
</template>
<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
const auth = useAuthStore()
const isAuthenticated = computed(()=> auth.isAuthenticated ?? false)
const router = useRouter()
const onLogout = async () => {
  await auth.logout()
  router.push('/')
}
</script>
