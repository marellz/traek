<template>
  <div class="flex items-start space-x-2 group">
    <span class="border border-slate-200 dark:border-slate-600 p-3 rounded-full flex-none">
      <component :is="icon" :size="20"></component>
    </span>
    <div>
      <div class="pt-1">
        <p v-if="item.content">{{ item.content }}</p>
        <p v-else>{{ title }}</p>
        <div class="text-xs">
          <p v-if="projectActivity">Project: <code>{{ item.project_id }}</code> </p>
          <p v-else-if="taskActivity">Task: <code>{{ item.task_id }}</code> </p>
        </div>
      </div>
      <p class="text-xs text-slate-400 dark:text-slate-500">{{ parseDate(item.created_at, 'Mo MMM YYYY, hh:mm A') }}</p>
      <div v-if="item.target_ids.length" class="mt-4 flex">
        <span class="text-xs">Members:</span>
        <ul class="ml-1">
          <li v-for="targetItem in item.target_ids" :key="targetItem">
            <p class="text-xs">
              {{ targetItem }}
            </p>
          </li>
        </ul>
      </div>
      <div
        class="absolute invisible group-hover:visible border rounded-lg p-4 border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-800">
        <code>
          <pre class="text-[10px]">{{ item }}</pre>
        </code>
      </div>
    </div>

  </div>
</template>
<script lang="ts" setup>
import { ActivityTypes, type Activity, type ActivityType } from '@/stores/activity';
import { parseDate } from '@/utils/parseDate';
import { CalendarPlus, FolderPen, FolderPlus, FolderX, ListPlus, ListTodo, NotebookPen, UserPlus, type LucideIcon, } from 'lucide-vue-next'
import { computed } from 'vue';

const activityIcons: Record<ActivityType, LucideIcon> = {
  [ActivityTypes.TASK_CREATED]: ListPlus,
  [ActivityTypes.TASK_STATUS_UPDATED]: ListTodo,

  [ActivityTypes.PROJECT_CREATED]: FolderPlus,
  [ActivityTypes.PROJECT_UPDATED]: FolderPen,
  [ActivityTypes.PROJECT_CLOSED]: FolderX,
  [ActivityTypes.MEMBERS_ADDED]: UserPlus,

  [ActivityTypes.NOTE_CREATED]: NotebookPen,
  [ActivityTypes.EVENT_CREATED]: CalendarPlus,
}

const props = defineProps<{
  item: Activity
}>()

const icon = computed(() => activityIcons[props.item.type as ActivityType])

const activityTitle = computed(() => ({
  [ActivityTypes.TASK_CREATED]: () => `Task created`,
  [ActivityTypes.TASK_STATUS_UPDATED]: () => `Task updated by ${props.item.user_id}`,

  [ActivityTypes.PROJECT_CREATED]: () => `Project was created`,
  [ActivityTypes.PROJECT_UPDATED]: () => `Project was updated`,
  [ActivityTypes.PROJECT_CLOSED]: () => `Project was closed`,
  [ActivityTypes.MEMBERS_ADDED]: () => `Added members`,

  [ActivityTypes.NOTE_CREATED]: () => ``,
  [ActivityTypes.EVENT_CREATED]: () => ``,
}))

const projectActivity = computed(() => [
  ActivityTypes.PROJECT_CREATED,
  ActivityTypes.PROJECT_UPDATED,
  ActivityTypes.PROJECT_CLOSED
].find(_t => _t === props.item.type))

const taskActivity = computed(() => [ActivityTypes.TASK_CREATED, ActivityTypes.TASK_STATUS_UPDATED].find(_t => _t === props.item.type))
const title = computed(() => activityTitle.value[props.item.type as ActivityType]())

</script>
