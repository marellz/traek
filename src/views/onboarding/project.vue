<template>
  <div class="mb-10">
    <h1 class="mb-4 text-4xl">Get into a project</h1>
    <p class="text-slate-600">Welcome on board. You're ready to be part of projects.</p>
  </div>
  <h1>Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci beatae voluptatibus consequatur, sapiente totam,
    perspiciatis quam maiores optio ut deleniti rerum facilis asperiores nobis nisi dolores, nesciunt reiciendis neque!
    Maxime!</h1>

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
