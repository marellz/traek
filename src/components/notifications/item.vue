<template>
  <div
    class="px-4 py-2 text-sm space-y-1 border-b border-b-gray-200 dark:border-b-slate-600 last:border-b-0 hover:bg-slate cursor-pointer dark:text-white"
    :class="{ 'text-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500': !isRead, 'opacity-60 bg-transparent hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600': isRead }">
    <p v-html="message"></p>
    <p class="text-slate-500 dark:text-slate-400 italic">
      <span>{{ moment(item.created_at).format('Mo MMM h:mm A') }}</span>
    </p>
    <div class="flex items-center">
      <button type="button" class="p-1 text-xs font-medium hover:underline cursor-pointer"
        v-for="(link, i) in item.actions" :key="i" @click="notificationAction(link)">
        {{ link.label }}
      </button>
      <button v-if="isRead" type="button" class="p-1 text-xs font-medium hover:underline cursor-pointer"
        @click="markAsUnread">
        Unread
      </button>
      <button v-else type="button" class="p-1 text-xs font-medium hover:underline cursor-pointer" @click="markAsRead">
        Read
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Notification, NotificationAction } from '@/stores/notifications';
import moment from 'moment';
import { computed } from 'vue';

const props = defineProps<{ item: Notification }>()
const emit = defineEmits(['mark-as-read', 'execute-action', 'mark-as-unread'])

const markAsRead = () => {
  emit('mark-as-read', props.item.id)
}

const markAsUnread = () => {
  emit('mark-as-unread', props.item.id)
}

const isRead = computed(() => props.item.read_at !== null)
const message = computed(() => {
  const _type = props.item.type
  const text = props.item.message
  if (_type.match(/task_/)) {
    return text.replace(/<task>/, `<strong>${props.item.related_task_id?.title ?? 'Unknown task'}</strong>`)
  } else if (_type.match(/<event>/)) {
    return text.replace(/<event>/, props.item.related_event_id?.title ?? 'Unkmown event')
  } else if (_type.match(/<project>/)) {
    return text.replace(/<project>/, props.item.related_project_id?.name ?? 'Unkown project')
  }

  return text

})

const notificationAction = (action: NotificationAction) => {
  emit('execute-action', action, props.item.id)
}
</script>