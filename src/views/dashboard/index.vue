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
        <activity-list title="Activity on your projects" :type="ActivityListTypes.USER_PROJECTS"></activity-list>
      </div>
    </layout-container>
  </div>
</template>
<script lang="ts" setup>
import ActivityList from '@/components/activity/list.vue';
import { ActivityListTypes } from '@/stores/activity';

</script>
