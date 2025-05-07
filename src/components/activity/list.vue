<template>
  <div class="mt-5 space-y-4">
    <div class="flex">
      <h2 class="text-2xl">{{ title }}</h2>
      <base-action class="ml-4" @click="fetch"><span>Refresh</span></base-action>
    </div>
    <base-loader v-if="loadingActivity"></base-loader>
    <ul v-else-if="activities.length" class="space-y-2">
      <li>
        <div class="pl-12">
          <button v-if="!rangeIsAtStart" type="button" class="inline-flex justify-center items-center space-x-2 text-sm font-medium rounded py-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-600"  @click="prevPage">
            <ListStart :size="16"/>
            <span>Load newer</span>
          </button>
        </div>
      </li>
      <li v-for="item in activities" :key="item.id" class="group">
        <project-activity :item />
      </li>
      <li>
        <div class="pl-12 py-4">
          <button type="button" class="inline-flex justify-center items-center space-x-2 text-sm font-medium rounded py-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-600"
            v-if="!rangeIsAtLimit" @click="nextPage">
            <ListEnd :size="16" />
            <span>Load older</span>
          </button>
          <button type="button" class="inline-flex justify-center items-center space-x-2 text-sm font-medium rounded py-2 px-4 hover:bg-slate-100 dark:hover:bg-slate-600" v-else
            @click="resetRange">
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
import { ActivityLoading, useActivityStore, type Activity } from '@/stores/activity'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ProjectActivity from '@/components/activity/item.vue'
import { ListEnd, ListStart, RefreshCcwDot } from 'lucide-vue-next';
enum ActivityTypes {
  PROJECT = 'project-activities',
  USER = 'user-activities'
}
type ActivityType = `${ActivityTypes}`
const props = withDefaults(defineProps<{
  project?: string;
  title: string;
  type?: ActivityType
}>(), {
  type: 'project-activities'
})
const activityStore = useActivityStore()
const activities = ref<Array<Activity & {}>>([])
const loadingActivity = computed(() => activityStore.isLoading(ActivityLoading.GETTING_ACTIVITIES))
const fetch = async () => {
  let _items: Activity[] | null | undefined
  switch (props.type) {
    case ActivityTypes.USER:
      _items = await activityStore.getUserActivity()
      break;

    case ActivityTypes.PROJECT:
      _items = props.project ? await activityStore.getProjectActivity(props.project) : []
      break;

    default:
      _items = props.project ? await activityStore.getProjectActivity(props.project) : []
      break;
  }

  if (_items) {
    const users = _items.flatMap(item => item.target_user_ids)
    const profiles = await activityStore.getUserInformation(users)
    _items = _items.map(item => ({
      ...item,
      target_users: profiles?.filter(u => users.includes(u.id)) || []
    }))

    if (_items.length) {
      activities.value = [..._items]
    } else {
      activityStore.markRangeLimit(true)
      activityStore.previousRange(() => {})
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
