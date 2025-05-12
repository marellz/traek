<template>

  <div class="py-6 space-y-1">
    <h1 class="text-2xl font-medium">It's not you, it's me.</h1>
    <p>This part is under development. Feel free to skip it.</p>
  </div>
  <div>
    <base-button @click="nextStage">
      <span>Skip step for now</span>
    </base-button>
  </div>

</template>
<script lang="ts" setup>
import { useOnboardingStore } from '@/stores/onboarding';

const onboardingStore = useOnboardingStore()
const nextStage = () => {
  onboardingStore.nextStage()
}

</script>
