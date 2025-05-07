<template>
  <div>
    <div class="mb-8 text-center space-y-2">
      <auth-title>Forgot Your Password?</auth-title>
      <auth-subtitle>
        No worries! Enter your email, and we’ll send you a link to reset it.
        Update Password Page
      </auth-subtitle>
    </div>
    <Form @submit="resetPassword()">
      <div class="space-y-4">
        <form-input label="Email address" v-model="email" type="email" :error="errors.email" :disabled="sent"
          required></form-input>
        <base-button class="w-full" :loading :disabled="sent">
          <template v-if="sent">
            <span>Sent!</span>
            <MailCheck />
          </template>
          <template v-else>
            <span>Send recovery email</span>
            <SendHorizonal />
          </template>
        </base-button>
        <div v-if="sent" class="flex items-start space-x-2">
          <p class="text-sm font-secondary text-slate-700">
            Recovery link sent. This link will expire in 1 hour. Please request
            a new link if it doesn't work.
          </p>
        </div>
      </div>
    </Form>
  </div>
</template>
<script lang="ts" setup>
import AuthTitle from '@/components/auth/title.vue'
import AuthSubtitle from '@/components/auth/subtitle.vue'
import FormInput from "@/components/form/input.vue"
import BaseButton from "@/components/base/button.vue"
import { AuthLoading, useAuthStore } from "@/stores/auth"
import { Form, useForm } from "vee-validate"
import * as yup from "yup"
import { computed, onMounted, ref } from "vue"
import { MailCheck, SendHorizonal } from "lucide-vue-next"
const auth = useAuthStore()
const loading = computed(() => auth.isLoading(AuthLoading.RESETTING_PASSWORD))
const schema = yup.object({
  email: yup.string().email().required("Email is required"),
})

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: schema,
})

const sent = ref(false)

const [email] = defineField("email")

const resetPassword = handleSubmit(async (values) => {
  const success = await auth.resetPassword(values.email)
  if (success) {
    sent.value = true
  }
})

onMounted(() => {
  auth.resetErrors()
})
</script>
