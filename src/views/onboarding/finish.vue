<template>
  <div class="mb-10">
    <h1 class="mb-4 text-4xl">Finished!</h1>
    <p class="text-slate-600">Welcome on board. You're ready to be part of projects.</p>
  </div>
  <base-button @click="onComplete">
    <span>Go to Dash</span>
  </base-button>
</template>
<script lang="ts" setup>
import { useOnboardingStore } from '@/stores/onboarding'

const onboardingStore = useOnboardingStore()
const onComplete = () => {
  onboardingStore.nextStage()
}
</script>
