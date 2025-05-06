<template>
  <layout-banner class="py-4">
    <layout-banner-title>Welcome, User!</layout-banner-title>
  </layout-banner>
  <div class="mt-10">
    <layout-container>
      <h1 class="text-3xl">My dashboard.</h1>
      <div class="mt-8 grid grid-cols-2">
        <div class="space-y-4">
          <h2 class="text-lg font-medium">Your pending tasks</h2>
          <ul>
            <li>Task</li>
          </ul>
        </div>
        <div class="space-y-4">
          <h2 class="text-lg font-medium">Your activity</h2>
          <base-loader v-if="loadingActivity"></base-loader>
          <ul v-else-if="activities.length" class="space-y-2">
            <li v-for="item in activities" :key="item.id">
              <activity-item :item></activity-item>
            </li>
          </ul>
          <div v-else>
            <h1 class="font-medium">Empty.</h1>
            <p class="text-slate-400 text-sm">No activity yet.</p>
          </div>
        </div>
      </div>
    </layout-container>
  </div>
</template>
<script lang="ts" setup>
import ActivityItem from '@/components/activity/item.vue';
import { ActivityLoading, useActivityStore, type Activity } from '@/stores/activity';
import { computed, onMounted, ref } from 'vue';

const activityStore = useActivityStore()
const activities = ref<Activity[]>([])
const loadingActivity = computed(() => activityStore.isLoading(ActivityLoading.GETTING_ACTIVITIES))
const getActivities = async () => {
  const _items = await activityStore.getUserProjectsActivities()
  if (_items) {
    activities.value = _items
  }
}

onMounted(() => {
  getActivities()
})
</script>
