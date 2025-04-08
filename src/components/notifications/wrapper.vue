<template>
  <div class="self-center flex items-center relative" ref="wrapper">
    <button type="button" class="p-1" @click="toggleView">
      <Bell />
    </button>
    <div v-show="showNotifications"
      class="absolute top-full border border-slate-300 rounded-xl min-w-96 right-0 overflow-hidden transform translate-y-2 shadow bg-white dark:bg-slate-700 dark:border-slate-500 z-10">
      <div class="space-y-3">
        <div class="px-4 py-2 flex space-x-2 items-center">
          <p class="font-medium">Notifications</p>
          <base-loader v-if="loading" loader-class="!h-4 !w-4"></base-loader>
        </div>
        <div class="mt-3 px-4 flex items-center space-x-2">
          <base-action v-if="notifications.length">Clear</base-action>
          <base-action @click="getNotifications" :disabled="loading">Refresh</base-action>
        </div>
        <template v-if="notifications.length">
          <PerfectScrollbar class="max-h-96">
            <notification-item v-for="item in notifications" :item :key="item.id" @mark-as-read="markAsRead"
              @execute-action="executeAction" @mark-as-unread="markAsUnread"></notification-item>
          </PerfectScrollbar>
        </template>
        <div class="p-4" v-else>
          <p class="text-sm font-medium text-slate-500">No notifications</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, useTemplateRef } from 'vue';

import NotificationItem from '@/components/notifications/item.vue'
import { Bell } from 'lucide-vue-next';
import { onClickOutside } from '@vueuse/core';
import { NotificationLoading, useNotificationStore, type NotificationAction } from '@/stores/notifications';
import { useRouter } from 'vue-router';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import moment from 'moment';
import 'vue3-perfect-scrollbar/style.css'

const showNotifications = ref(false)
const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.notifications)
const loading = computed(() => notificationStore.isLoading(NotificationLoading.GETTING))
const nextFetchAt = ref<string | null>(null)
const wrapper = useTemplateRef('wrapper')

const getNotifications = async () => {
  await notificationStore.get()
  nextFetchAt.value = moment().add(10, 'minutes').toISOString()
}

const toggleView = () => {
  if (showNotifications.value) {
    showNotifications.value = false
  } else {
    showNotifications.value = true
    if (moment(nextFetchAt.value).isAfter(moment())) {
      return
    }
    getNotifications()
  }
}

const markAsRead = (id: string) => {
  notificationStore.markAsRead(id)
}

const markAsUnread = (id: string) => {
  notificationStore.markAsRead(id, false)
}

const router = useRouter()
const executeAction = (action: NotificationAction, id: string) => {
  router.push(action.path)
  showNotifications.value = false
  markAsRead(id)
}


onClickOutside(wrapper, () => {
  showNotifications.value = false
})
</script>
