<template>
  <div>
    <layout-container class="space-y-10">
      <div class="flex justify-between items-center">
        <h1 class="text-4xl mt-10">User profile</h1>
        <router-link :to="{ name: 'edit-profile' }" v-if="isMe">
          <base-button>
            <span>Edit profile</span>
          </base-button>
        </router-link>
      </div>
      <base-loader class="py-10" v-if="loading"></base-loader>
      <div v-else-if="!user">
        <Empty title="User not found."
          text="Something went wrong loading this user. Or they don't exist?. Maybe try again.">
          <div class="flex justify-center mt-10">
            <base-action @click="getUser()">
              <span>Reload</span>
            </base-action>
          </div>
        </Empty>
      </div>
      <layout-card v-else>
        <div class="flex gap-10">
          <user-avatar :icon-size="60" size="h-40 w-40" :avatar="user.avatar"></user-avatar>
          <div class="col-span-2 space-y-2">
            <h1 class="text-2xl">{{ user.name }}</h1>
            <div class="text-sm space-y-3">
              <div class="flex items-center space-x-2">
                <AtSign :size="20" :stroke-width="1.5" />
                <p>{{ user.username }}</p>
              </div>
              <a :href="`mailto:${user.email}`" class="flex items-center space-x-2">
                <Mail :size="20" :stroke-width="1.5" />
                <p>{{ user.email }}</p>
              </a>
              <a :href="`tel:${user.phone}`" class="flex items-center space-x-2">
                <Phone :size="20" :stroke-width="1.5" />
                <p>{{ user.phone }}</p>
              </a>
            </div>
            <div class="mt-2 text-slate-500">
              <p class="text-sm">Member since {{ moment(user.created_at) }}</p>
            </div>
          </div>
        </div>
      </layout-card>
    </layout-container>
  </div>
</template>
<script lang="ts" setup>
import Empty from '@/components/common/empty.vue';
import UserAvatar from '@/components/user/avatar.vue'
import { AuthLoading, useAuthStore, type UserProfile } from '@/stores/auth';
import { AtSign, Mail, Phone } from 'lucide-vue-next';
import moment from 'moment';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const auth = useAuthStore()
const route = useRoute()

const isMe = computed(() => auth.userId === id.value)
const id = computed(() => route.params.id as string)
const loading = computed(() => auth.isLoading(AuthLoading.GETTING_PROFILE))
const user = ref<UserProfile>()
const getUser = async () => {
  const _user = await auth.getProfile()
  if (_user) {
    user.value = _user
  }
}
onMounted(() => {
  getUser()
})
</script>
