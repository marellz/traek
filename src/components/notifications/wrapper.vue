<template>
  <div class="self-center flex items-center relative">
    <button type="button" class="p-1" @click="toggleView" ref="wrapper">
      <Bell />
    </button>
    <div v-show="showNotifications"
      class="absolute top-full border border-slate-300 rounded-xl min-w-64 left-1/5 transform -translate-x-1/2 translate-y-2 shadow bg-white dark:bg-slate-700 dark:border-slate-500 z-10">
      <base-loader v-if="loading"></base-loader>
      <template v-else-if="notifications.length">
        <div class="space-y-3">
          <div class="px-4 py-2">
            <p class="font-medium">Notifications</p>
          </div>
          <div class="mt-3 px-4 flex items-center space-x-2">
            <base-action>Clear</base-action>
            <base-action>View old</base-action>
          </div>
          <div>
            <notification-item v-for="item in notifications" :item :key="item.id"></notification-item>
          </div>

        </div>
      </template>
      <div v-else>
        <p>No notifications</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';

import NotificationItem from '@/components/notifications/item.vue'
import { Bell } from 'lucide-vue-next';
import { onClickOutside } from '@vueuse/core';
import { v4 } from 'uuid';
import type { Notification } from '@/stores/notifications';

const showNotifications = ref(false)
const loading = ref(false)
const notifications = ref<Notification[]>([])

const wrapper = useTemplateRef('wrapper')

const getNotifications = () => {
  loading.value = true
  setTimeout(() => {
    notifications.value = [
      {
        id: v4(),
        content: 'You have been added to a new project <Project name>',
        read: false,
      },
      {
        id: v4(),
        content: 'A new task has been assigned to you <Task name>',
        read: true,
      },
      {
        id: v4(),
        content: 'Task is due now <Task name>',
        read: false,
      },
    ]


    loading.value = false
  }, 500)
}

const toggleView = () => {
  if (showNotifications.value) {
    showNotifications.value = false
  } else {
    showNotifications.value = true
    getNotifications()
  }
}


onClickOutside(wrapper, () => {
  showNotifications.value = false
})
</script>
