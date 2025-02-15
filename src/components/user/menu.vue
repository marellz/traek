<template>
  <div ref="target" class="relative">
    <button type="button" class="p-1" @click="active = !active">
      <User />
    </button>
    <div v-show="active"
      class="absolute top-full right-0 min-w-40 w-auto bg-white border border-slate-300 rounded-md overflow-hidden">
      <div class="flex flex-col">

        <div class="flex items-center space-x-2 p-2 bg-slate-100">
          <user-avatar size="sm" :avatar="auth.profile?.avatar"></user-avatar>
          <div>
            <p class="font-medium">
              {{ auth.profile?.name || 'User name' }}
            </p>
          </div>
        </div>

        <router-link to="/profile/user-id" class="p-2 block hover:bg-slate-100">
          Profile
        </router-link>
        <a href="#logout" class="p-2 block hover:bg-slate-100" @click.prevent="logout">
          Logout
        </a>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import UserAvatar from "@/components/user/avatar.vue"
import { useAuthStore } from "@/stores/auth"
import { onClickOutside } from "@vueuse/core"
import { User } from "lucide-vue-next"
import { ref, useTemplateRef } from "vue"

const auth = useAuthStore()

const logout = async () => {
  if (confirm("Are you sure you want to log out?")) await auth.logout()
}

const active = ref(false)
const wrapper = useTemplateRef('target')
onClickOutside(wrapper, () => {
  active.value = false
})

</script>
