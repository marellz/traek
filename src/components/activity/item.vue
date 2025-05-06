<template>
  <div class="flex items-start space-x-2 relative">
    <span class="border bg-white border-slate-200 dark:border-slate-600 p-3 rounded-full flex-none relative z-[2]">
      <component :is="icon" :size="20"></component>
    </span>
    <div
      class="group-last:before:hidden before:block before:h-full before:absolute before:w-0 before:border-l before:border-l-slate-200 before:left-0 before:top-0 before:translate-x-5.5 before:translate-y-5">
      <div class="pt-1">
        <!-- <p v-if="item.content">{{ item.content }}</p> -->
        <p v-html="title"></p>
      </div>
      <p v-if="item.created_at" class="text-xs text-slate-400 dark:text-slate-500">{{
        parseDate(item.created_at, `Mo MMMYYYY, hh: mm A`) }}</p>
      <div v-if="item.target_user_ids.length">
        <ul class="mt-1 flex space-x-2">
          <li v-for="user in item.target_users" :key="user.id">
            <div class="flex items-center space-x-2">
              <!-- todo: use popovers for name/email -->
              <UserAvatar :avatar="user.avatar" size="md" :title="`${user.name ?? '[no name]'} | ${user.email}`" />
            </div>
          </li>
        </ul>
      </div>
      <div
        class="hidden absolute z-10 invisible group-hover:visible border rounded-lg p-4 border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800">
        <code>
          <pre class="text-[10px]">{{ item }}</pre>
        </code>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { activityIcons } from '@/data/activity.data';
import { ActivityTypes, type Activity, type ActivityType } from '@/stores/activity';
import { useAuthStore } from '@/stores/auth';
import { parseDate } from '@/utils/parseDate';
import { computed } from 'vue';
import UserAvatar from '../user/avatar.vue';

const props = defineProps<{
  item: Activity
}>()
const auth = useAuthStore()
const icon = computed(() => activityIcons[props.item.type as ActivityType])
const user = computed(() => props.item.user.id === auth.userId ? 'you' : props.item.user.name)

const activityTitle = computed(() => ({
  [ActivityTypes.TASK_CREATED]: () => `<strong class="capitalize">${user.value}</strong> added a new task: <strong>${props.item.task?.title || '[deleted]'}</strong>`,
  [ActivityTypes.TASK_STATUS_UPDATED]: () => `<strong class="capitalize">${user.value}</strong> added updated task:<strong>${props.item.task?.title || '[deleted]'}</strong>`,

  [ActivityTypes.PROJECT_CREATED]: () => `Project was created`,
  [ActivityTypes.PROJECT_UPDATED]: () => `Project was updated`,
  [ActivityTypes.PROJECT_CLOSED]: () => `Project was closed`,
  [ActivityTypes.MEMBERS_ADDED]: () => `<strong class="capitalize">${user.value}</strong> added <strong>${props.item.target_user_ids ? props.item.target_user_ids.length : ''} members</strong> to the project`,

  [ActivityTypes.NOTE_CREATED]: () => `<strong class="capitalize">${user.value}</strong> added a note: <strong> ${props.item.note?.title || '[deleted]'} </strong>`,
  [ActivityTypes.EVENT_CREATED]: () => `<strong class="capitalize">${user.value}</strong> scheduled a new event: <strong> ${props.item.event?.title || '[deleted]'} </strong> for <strong> ${props.item.event ? parseDate(props.item.event.datetime) : '[unknown]'}</strong>`
}))

//
const title = computed(() => activityTitle.value[props.item.type as ActivityType]())
</script>
