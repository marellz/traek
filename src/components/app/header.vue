<template>
  <header class="py-4">
    <layout-container>
      <ul class="flex items-center justify-center space-x-2">
        <li>
          <header-link to="/">Home</header-link>
        </li>
        <template v-if="auth.isAuthenticated">
          <li>
            <header-link :to="{ name: 'dashboard' }">
              Dashboard
            </header-link>
          </li>
          <li>
            <header-link to="#logout" @click.prevent="onLogout">Logout</header-link>
          </li>
        </template>
        <template v-else>
          <li>
            <header-link :to="{ name: 'login' }">
              Login
            </header-link>
          </li>
          <li>
            <router-link :to="{ name: 'register' }">
              <base-button>Get started</base-button>
            </router-link>
          </li>
        </template>
      </ul>
    </layout-container>
  </header>
</template>
<script lang="ts" setup>
import HeaderLink from '@/components/partials/header/link.vue'
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

<style scoped>
.link {
  @apply flex;
}
</style>
