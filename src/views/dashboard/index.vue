<template>
  <layout-banner class="py-4">
    <layout-banner-title>Welcome, User!</layout-banner-title>
  </layout-banner>
  <div class="mt-10">
    <layout-container>
      <div class="flex items-center">
        <h1 class="text-3xl">My projects</h1>
        <div class="ml-auto">
          <base-button>
            <span>Create project</span>
          </base-button>
        </div>
      </div>
      <div class="mt-10">
        <base-alert title="Empty">You have no projects</base-alert>
      </div>
    </layout-container>
  </div>
</template>
<script lang="ts" setup>

</script>
