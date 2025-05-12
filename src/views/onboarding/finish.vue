<template>
  <div class="py-6 space-y-1">
    <h1 class="text-2xl font-medium">Welcome to Traek.</h1>
    <p>May this app fulfill all your needs. Or at least most of them.</p>
  </div>
  <div>
    <base-button @click="onComplete">
      <span>Go to Dash</span>
    </base-button>
  </div>
</template>
<script lang="ts" setup>
import { useOnboardingStore } from '@/stores/onboarding'

const onboardingStore = useOnboardingStore()
const onComplete = () => {
  onboardingStore.nextStage()
}
</script>
