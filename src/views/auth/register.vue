<template>
  <div class="mb-8 space-y-2 text-center">
    <auth-title>Join Our Platform</auth-title>
    <auth-subtitle>
      Create an account to start uploading, organizing, and sharing your documents securely. Forgot
      Password Page
    </auth-subtitle>
  </div>
  <FormStepper :name="register_stepper" v-if="steps.length" :steps ref="stepper" @update="updateSteps">
    <template #sign_up>
      <SignUp @complete="nextStep" />
    </template>
    <template #profile_info>
      <ProfileInfo @complete="nextStep" />
    </template>
    <template #completed>
      <div class="mb-10">
        <h1 class="mb-4 text-4xl">Finished!</h1>
        <p class="text-slate-600">Welcome on board. You're ready to start managing some projects.</p>
      </div>
      <base-button @click="onComplete">
        <span>Go to Dash</span>
      </base-button>
    </template>
  </FormStepper>
</template>
<script lang="ts" setup>
import FormStepper, { type Step } from '@/components/form/stepper.vue'
import AuthTitle from '@/components/auth/title.vue'
import BaseButton from '@/components/base/button.vue'
import AuthSubtitle from '@/components/auth/subtitle.vue'
import SignUp from '@/components/object-forms/register/signUp.vue'
import ProfileInfo from '@/components/object-forms/register/profileInfo.vue'
import { onMounted, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const stepper = useTemplateRef('stepper')
const initial_stepper = [
  {
    key: 'sign_up',
    label: 'Sign up',
    completed: false,
  },
  {
    key: 'profile_info',
    label: 'Profile info',
    completed: false,
  },
  {
    key: 'completed',
    label: 'Finish',
    completed: false,
  },
]
const steps = ref<Step[]>([])

const nextStep = () => {
  if(stepper.value) {
    stepper.value.nextStep()
  }
}

const updateSteps = (v: Step[]) => {
  steps.value = v
}

const register_stepper = 'register-stepper'

const router = useRouter()

const onComplete = () => {
  localStorage.removeItem(register_stepper)
  router.push({ name: 'dashboard' })
}

onMounted(() => {
  const saved = localStorage.getItem(register_stepper)
  if (saved) {
    steps.value = JSON.parse(saved)
  } else {
    steps.value = initial_stepper
  }

  console.log(auth.user)

  if (auth.user && stepper.value) {
    nextStep()
  }
})
</script>
