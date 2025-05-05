<template>
  <button type="button" class="p-1" @click="active = !active">
    <User />
  </button>
  <div ref="target" class="relative !mx-0">
    <div v-show="active"
      class="absolute top-full right-0 w-auto min-w-40 overflow-hidden rounded-md border border-slate-300 bg-white dark:bg-slate-700 dark:border-slate-600 z-10">
      <div class="flex flex-col">
        <div
          class="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 p-2 border-b border-b-slate-200 dark:border-b-slate-600">
          <user-avatar size="h-10 w-10" :avatar="auth.profile?.avatar"></user-avatar>
          <div>
            <p class="font-medium text-sm">
              {{ auth.profile?.name || 'User name' }}
            </p>
          </div>
        </div>

        <div v-if="auth.userId" class="text-sm">
          <router-link :to="{ name: 'view-profile', params: { id: auth.userId } }"
            class="block p-2 hover:bg-slate-100 dark:hover:bg-slate-600">
            Profile
          </router-link>
          <a href="#logout" class="block p-2 hover:bg-slate-100 dark:hover:bg-slate-600" @click.prevent="logout"> Logout
          </a>
        </div>

      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import UserAvatar from '@/components/user/avatar.vue'
import { useAuthStore } from '@/stores/auth'
import { onClickOutside } from '@vueuse/core'
import { User } from 'lucide-vue-next'
import { ref, useTemplateRef, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const logout = async () => {
  if (confirm('Are you sure you want to log out?')) {
    await auth.logout()
    router.push({ name: 'home' })
  }
}

const active = ref(false)
const wrapper = useTemplateRef('target')
onClickOutside(wrapper, () => {
  active.value = false
})

watch(() => route.path, () => {
  active.value = false
})
</script>
