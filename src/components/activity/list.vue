<template>
  <div class="mt-5 space-y-4">
    <div class="flex">
      <h2 class="text-2xl">{{ title }}</h2>
      <base-action class="ml-4" @click="fetch"><span>Refresh</span></base-action>
    </div>
    <base-loader v-if="loadingActivity"></base-loader>
    <ul v-else-if="activities.length" class="space-y-2">
      <li v-for="item in activities" :key="item.id" class="group">
        <project-activity :item />
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
import { computed, onMounted, ref } from 'vue'
import ProjectActivity from '@/components/activity/item.vue'
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

    activities.value = [..._items]
  }
}
onMounted(() => {
  fetch()
})
</script>
