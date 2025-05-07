<template>
  <div class="flex items-start space-x-2 relative">
    <span class="border bg-white border-slate-200 dark:border-slate-600 p-3 rounded-full flex-none relative z-[2]">
      <component :is="icon" :size="20"></component>
    </span>
    <div
      class="group-last:before:hidden before:block before:h-full before:absolute before:w-0 before:border-l before:border-l-slate-200 before:left-0 before:top-0 before:translate-x-5.5 before:translate-y-5">
      <div>
        <router-link v-if="multipleProjects" :to="{ name: 'project', params: { id: item.project_id } }"
          class="bg-slate-100 inline-block rounded px-2 text-xs font-medium py-1 mb-1">{{
            item.project.name }}</router-link>
        <div class=" pt-1">
          <p v-html="title"></p>
          <!-- <p v-if="item.content">{{ item.content }}</p> -->
        </div>
        <p v-if="item.created_at" class="text-xs text-slate-400 dark:text-slate-500 mt-1">{{
          parseDate(item.created_at, `Mo MMMYYYY, hh: mm A`) }}</p>
        <div class="mt-1" v-if="item.target_user_ids.length">
          <ul class="flex space-x-2">
            <li v-for="user in item.target_users" :key="user.id">
              <div class="flex items-center space-x-2">
                <!-- todo: use popovers for name/email -->
                <UserAvatar :avatar="user.avatar" size="w-12 h-12"
                  :title="`${user.name ?? '[no name]'} | ${user.email}`" />
              </div>
            </li>
          </ul>
        </div>
        <div v-if="props.item.meta" class="mt-1 text-xs">
          <div v-if="props.item.type === ActivityTypes.TASK_STATUS_UPDATED" class="flex items-center space-x-2">
            <base-tag :class="TaskStatusColors[props.item.meta.from]">{{ TaskStatusLabels[props.item.meta.from]
            }}</base-tag>
            <MoveRight :size="20" />
            <base-tag :class="TaskStatusColors[props.item.meta.to]">
              {{ TaskStatusLabels[props.item.meta.to] }}</base-tag>
          </div>
        </div>
        <div
          class="hidden absolute z-10 invisible group-hover:visible border rounded-lg p-4 border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800">
          <code>
            <pre class="text-[10px]">{{ item }}</pre>
          </code>
        </div>

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
import { TaskStatusColors, TaskStatusLabels } from '@/data/task-data';
import { MoveRight } from 'lucide-vue-next';

const props = defineProps<{
  item: Activity
  multipleProjects?: boolean
}>()
const auth = useAuthStore()
const icon = computed(() => activityIcons[props.item.type as ActivityType])
const user = computed(() => props.item.user.id === auth.userId ? 'you' : props.item.user.name)

const activityTitle = computed(() => ({
  [ActivityTypes.TASK_CREATED]: () => `<strong class="capitalize">${user.value}</strong> added a new task: <strong>${props.item.task?.title || '[deleted]'}</strong>`,
  [ActivityTypes.TASK_STATUS_UPDATED]: () => `<strong class="capitalize">${user.value}</strong> updated status for task:<strong>${props.item.task?.title || '[deleted]'}</strong> `,

  [ActivityTypes.PROJECT_CREATED]: () => `Project ${props.multipleProjects ? `<strong>${props.item.project.name}</strong> ` : ''}was created`,
  [ActivityTypes.PROJECT_UPDATED]: () => `Project ${props.multipleProjects ? `<strong>${props.item.project.name}</strong> ` : ''}was updated`,
  [ActivityTypes.PROJECT_CLOSED]: () => `Project ${props.multipleProjects ? `<strong>${props.item.project.name}</strong> ` : ''}was closed`,
  [ActivityTypes.MEMBERS_ADDED]: () => `<strong class="capitalize">${user.value}</strong> added <strong>${props.item.target_user_ids ? props.item.target_user_ids.length : ''} member${props.item.target_user_ids.length > 1 ? 's' : ''}</strong> to the project`,

  [ActivityTypes.NOTE_CREATED]: () => `<strong class="capitalize">${user.value}</strong> added a note: <strong> ${props.item.note?.title || '[deleted]'} </strong>`,
  [ActivityTypes.EVENT_CREATED]: () => `<strong class="capitalize">${user.value}</strong> scheduled a new event: <strong> ${props.item.event?.title || '[deleted]'} </strong> for <strong> ${props.item.event ? parseDate(props.item.event.datetime) : '[unknown]'}</strong>`
}))

//
const title = computed(() => activityTitle.value[props.item.type as ActivityType]())
</script>
