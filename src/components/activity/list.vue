<template>
  <div class="mt-5 space-y-4">
    <div class="flex">
      <h2 class="text-2xl">{{ title }}</h2>
      <base-action class="ml-4" @click="fetch"><span>Refresh</span></base-action>
    </div>
    <div v-if="loadingActivity" class="flex pl-16 py-4">
      <base-loader></base-loader>
    </div>
    <ul v-else-if="activities.length" class="space-y-2">
      <li>
        <div class="pl-12">
          <button v-if="!rangeIsAtStart" type="button"
            class="inline-flex justify-center items-center space-x-2 text-sm font-medium rounded py-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-800"
            @click="prevPage">
            <ListStart :size="16" />
            <span>Load newer</span>
          </button>
        </div>
      </li>
      <li v-for="item in activities" :key="item.id" class="group">
        <project-activity :item :multiple-projects="props.type === ActivityListTypes.USER_PROJECTS" />
      </li>
      <li>
        <div class="pl-12 py-4">
          <button type="button"
            class="inline-flex justify-center items-center space-x-2 text-sm font-medium rounded py-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-800"
            v-if="!rangeIsAtLimit" @click="nextPage">
            <ListEnd :size="16" />
            <span>Load older</span>
          </button>
          <button type="button"
            class="inline-flex justify-center items-center space-x-2 text-sm font-medium rounded py-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-800"
            v-else @click="resetRange">
            <RefreshCcwDot :size="16" />
            <span>Reset</span>
          </button>
        </div>
      </li>
    </ul>
    <div v-else>
      <h1 class="font-medium">Empty.</h1>
      <p class="text-slate-400 text-sm">No activity yet.</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ActivityListTypes, ActivityLoading, useActivityStore, type Activity } from '@/stores/activity'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ProjectActivity from '@/components/activity/item.vue'
import { ListEnd, ListStart, RefreshCcwDot } from 'lucide-vue-next';

type ActivityType = `${ActivityListTypes}`
const props = withDefaults(defineProps<{
  project?: string;
  title: string;
  type?: ActivityType
}>(), {
  type: ActivityListTypes.PROJECT
})
const activityStore = useActivityStore()
const activities = ref<Array<Activity & {}>>([])
const loadingActivity = computed(() => activityStore.isLoading(ActivityLoading.GETTING_ACTIVITIES))
const fetch = async () => {
  let _items: Activity[] | null | undefined
  switch (props.type) {
    case ActivityListTypes.USER:
      _items = await activityStore.getUserActivity()
      break;

    case ActivityListTypes.PROJECT:
      _items = props.project ? await activityStore.getProjectActivity(props.project) : []
      break;

    case ActivityListTypes.USER_PROJECTS:
      _items = await activityStore.getUserProjectsActivities()
      break;

    default:
      _items = props.project ? await activityStore.getProjectActivity(props.project) : []
      break;
  }

  if (_items) {
    if (_items.length) {
      const users = _items.flatMap(item => item.target_user_ids)
      const profiles = await activityStore.getUserInformation(users)
      _items = _items.map(item => ({
        ...item,
        target_users: profiles?.filter(u => users.includes(u.id)) || []
      }))

      activities.value = [..._items]
    } else {
      activityStore.markRangeLimit(true)
      activityStore.previousRange(() => { })
    }
  }
}

const nextPage = async () => {
  activityStore.nextRange(fetch)

  if (activities.value.length < 10) {
    activityStore.markRangeLimit(true)
  }
}

const prevPage = async () => {
  activityStore.previousRange(fetch)

  if (activities.value.length >= 10) {
    activityStore.markRangeLimit(false)
  }
}

const resetRange = async () => {
  activityStore.resetRange()
  activities.value = []
  await fetch()
}

const rangeIsAtStart = computed(() => activityStore.range.start === 0)
const rangeIsAtLimit = computed(() => activityStore.rangeLimit)

onMounted(() => {
  fetch()
})

onUnmounted(() => {
  activityStore.resetRange()
})
</script>
