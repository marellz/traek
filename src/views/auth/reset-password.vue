<template>
  <div>
    <div class="mb-8 text-center space-y-2">
      <auth-title>Reset Your Password</auth-title>
      <auth-subtitle>
        Create a new password to regain access to your account. Make it strong
        and memorable!
      </auth-subtitle>
    </div>

    <Form @submit="updatePassword()">
      <div class="space-y-4">
        <form-input label="New password" v-model="password" type="password" :error="errors.password"
          allow-password-toggle required></form-input>
        <form-input label="Confirm password" v-model="confirmPassword" type="password"
          :error="errors.password_confirmation" required></form-input>
        <base-button type="submit" class="w-full" :loading>
          <span>Update password</span>
        </base-button>
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
import { computed, ref } from "vue"
import { useRouter } from "vue-router"

const auth = useAuthStore()
const router = useRouter()
const loading = computed(() => auth.isLoading(AuthLoading.UPDATING_PASSWORD))
const schema = yup.object({
  password: yup.string().min(6).required("Password is required"),
  password_confirmation: yup
    .string()
    .required("Password confirmation is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
})

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: schema,
})

const [password] = defineField("password")
const [confirmPassword] = defineField("password_confirmation")

const validSession = ref<boolean>(false)

const updatePassword = handleSubmit(async (values) => {
  if (!validSession.value) {
    return
  }

  const success = await auth.updatePassword(values.password)
  if (success) {
    router.push("/login")
  }
})
</script>
