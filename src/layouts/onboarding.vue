<template>
  <div class="h-screen min-h-screen flex dark:bg-black dark:text-white">
    <header class="w-96 flex-none p-4">
      <div class="space-y-8 pt-8 px-4 bg-gray-900/5 dark:bg-white/5 h-full flex flex-col rounded-lg">
        <div class="py-4">
          <Logo class="h-8" />
        </div>
        <nav class="flex flex-col space-y-4">
          <button type="button" v-for="item in steps" @click="setStage(item)" :key="item"
            :disabled="item === OnboardingSteps.REGISTER && auth.isAuthenticated || item !== OnboardingSteps.REGISTER && !auth.isAuthenticated"
            class="group py-1 disabled:text-slate-400 dark:disabled:text-slate-600 w-full text-left text-slate-400 dark:text-slate-600 relative before:absolute before:h-full before:w-0 before:border-l-2 before:border-l-slate-200 before:left-0 before:top-0 before:translate-x-4.5 before:translate-y-6 last:before:hidden before:z-[-1]"
            :class="{ '!text-black dark:!text-white': stage === item }">
            <div class="flex space-x-2 items-start">
              <span
                class="p-2 border border-slate-200 dark:border-slate-800 rounded bg-white shadow dark:bg-black group-disabled:bg-gray-100 dark:group-disabled:bg-black dark:group-disabled:text-slate-600">
                <component :is="onboardingIcons[item]" :size="20" stroke-width="1.5"></component>
              </span>
              <div>
                <h4 class="font-medium text-inherit">{{ onboardingText[item].title }}</h4>
                <p class="text-xs" :class="{ '!text-slate-600': stage === item }">{{ onboardingText[item].text }}</p>
              </div>
            </div>
          </button>
        </nav>
        <div class="mt-auto">
          <div class="flex py-4">
            <router-link :to="{ name: 'home' }"
              class="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-black">
              <ArrowLeft :size="20" />
              <span>Back to home</span>
            </router-link>
            <router-link v-if="!auth.isAuthenticated" :to="{ name: 'login' }"
              class="ml-auto text-sm font-medium text-gray-500 hover:text-black">
              <span>Login</span>
            </router-link>
          </div>
        </div>
      </div>
    </header>
    <main class="overflow-auto flex-auto max-w-4xl xl:max-w-2/3 flex flex-col">
      <div class="flex justify-end py-4">
        <dark-mode></dark-mode>
      </div>
      <div class="container mx-auto max-w-md py-8 space-y-8 flex-auto flex flex-col">
        <div class="py-4 space-y-1 tutext-center">
          <auth-title>{{ bannerText.title }}</auth-title>
          <auth-subtitle>{{ bannerText.text }}</auth-subtitle>
        </div>
        <div class="space-y-4">
          <slot />
        </div>
        <div class="flex space-x-4 !mt-auto">
          <span v-for="(item, index) in steps" :key="item" class="h-2 rounded-full w-full bg-gray-200"
            :class="{ 'bg-green-500': indexOfCurrentStep >= index }"></span>
        </div>
      </div>
    </main>
    <footer></footer>
  </div>
</template>
<script lang="ts" setup>
import AuthTitle from '@/components/auth/title.vue'
import AuthSubtitle from '@/components/auth/subtitle.vue'
import { useAuthStore } from '@/stores/auth';
import { onboardingLinks, OnboardingSteps, useOnboardingStore, type OnboardingStep } from '@/stores/onboarding';
import { ArrowLeft, Contact, FolderPlus, UserCheck, UserPlus } from 'lucide-vue-next';
import { computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import DarkMode from '@/components/app/dark-mode.vue';
import Logo from '@/assets/images/logo.vue';

const onboardingIcons = {
  [OnboardingSteps.REGISTER]: UserPlus,
  [OnboardingSteps.PROFILE]: Contact,
  [OnboardingSteps.PROJECTS]: FolderPlus,
  [OnboardingSteps.FINISH]: UserCheck
}

const onboardingText = {
  [OnboardingSteps.REGISTER]: {
    title: 'Create Account',
    text: 'Sign up with email and password.'
  },
  [OnboardingSteps.PROFILE]: {
    title: 'Complete Profile',
    text: 'Add your name and username.'
  },
  [OnboardingSteps.PROJECTS]: {
    title: 'Join or Create',
    text: 'Pick or set up a project.'
  },
  [OnboardingSteps.FINISH]: {
    title: 'All Set!',
    text: 'Let’s get you started now.'
  },
}

const auth = useAuthStore()
const onboardingStore = useOnboardingStore()
const steps = computed(() => Object.values(OnboardingSteps))
const stage = computed(() => onboardingStore.stage)
const indexOfCurrentStep = computed(() => steps.value.indexOf(stage.value as OnboardingSteps))
const bannerText = computed(() => {
  const _stage = stage.value !== null ? stage.value : OnboardingSteps.REGISTER
  return onboardingText[_stage]
})

const router = useRouter()

const setStage = (_step: OnboardingStep) => {
  onboardingStore.setStage(_step)
  router.push(onboardingLinks[_step])
}

onMounted(async () => {
  await onboardingStore.evaluateCompletion()

  if (stage.value) {
    router.push(onboardingLinks[stage.value])
  }

})

watch(() => stage.value, (value) => {
  if (!auth.isAuthenticated) return
  if (!value) {
    router.push({ name: 'dashboard' })
  } else {
    router.push(onboardingLinks[value])
  }
})
</script>
