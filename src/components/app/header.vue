<template>
  <header class="py-4">
    <layout-container>
      <ul class="flex space-x-2">
        <li>
          <router-link class="p-2 inline-block hover:underline" to="/">Home</router-link>
        </li>
        <template v-if="auth.isAuthenticated">
          <li>
            <router-link :to="{ name: 'dashboard' }" class="p-2 inline-block hover:underline">
              Dashboard
            </router-link>
          </li>
          <li class="!ml-auto">
            <a class="p-2 inline-block hover:underline" href="#logout" @click.prevent="onLogout">Logout</a>
          </li>
        </template>
        <template v-else>
          <li class="!ml-auto">
            <router-link class="p-2 inline-block hover:underline" to="/login">Login</router-link>
          </li>
          <li>
            <router-link class="p-2 inline-block hover:underline" to="/register">Register</router-link>
          </li>
        </template>
      </ul>
    </layout-container>
  </header>
</template>
<script lang="ts" setup>
import LayoutContainer from '@/components/layout/container.vue'
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore()
const router = useRouter()
const onLogout = async () => {
  await auth.logout()
  router.push('/')
}

</script>
