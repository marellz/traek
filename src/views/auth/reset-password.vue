<template>
  <div>
    <div class="mb-8 text-center space-y-2">
      <auth-title>Reset Your Password</auth-title>
      <auth-subtitle>
        Create a new password to regain access to your account. Make it strong
        and memorable!
      </auth-subtitle>
    </div>
    <!-- <template v-if="params?.error">
      <base-alert variant="error" title="Invalid link">
        {{ params.error_description }}
      </base-alert>
      <div class="mt-4">
        <router-link to="/forgot-password">
          <base-button>
            <span>Request another link</span>
            <MoveRight />
          </base-button>
        </router-link>
      </div>
    </template>

<template v-else-if="loadingSession">
      <div class="py-10 text-center">
        <base-loader></base-loader>
      </div>
    </template>

<template v-else-if="validSession"> -->
    <Form @submit="updatePassword()">
      <div class="space-y-4">
        <form-input label="New password" v-model="password" type="password" :error="errors.password"
          allow-password-toggle required></form-input>
        <form-input label="Confirm password" v-model="confirmPassword" type="password"
          :error="errors.password_confirmation" required></form-input>
        <base-button type="submit" class="w-full" :loading="auth.loading">
          <span>Update password</span>
        </base-button>
      </div>
    </Form>
    <!-- </template> -->

    <!-- <template v-else>
      <div class="space-y-8">
        <div class="flex items-start space-x-3">
          <AlertCircle :size="32" />
          <p class="text-lg">
            Seems like you're riding on an invalid session. Not to worry.
          </p>
        </div>
        <router-link to="/forgot-password" class="inline-block">
          <base-button>
            <span>Request another link</span>
            <MoveRight />
          </base-button>
        </router-link>
      </div>
    </template> -->
  </div>
</template>
<script lang="ts" setup>
import AuthTitle from '@/components/auth/title.vue'
import AuthSubtitle from '@/components/auth/subtitle.vue'
import FormInput from "@/components/form/input.vue"
import BaseButton from "@/components/base/button.vue"
// import BaseAlert from "@/components/base/alert.vue"
// import BaseLoader from "@/components/base/loader.vue"
import { useAuthStore } from "@/stores/auth"
import { Form, useForm } from "vee-validate"
import * as yup from "yup"
import { computed, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
// import { AlertCircle, MoveRight } from "lucide-vue-next"

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const userId = computed(() => route.params.userId as string)
const resetToken = computed(() => route.params.secret as string)

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
// const loadingSession = ref(false)

const updatePassword = handleSubmit(async (values) => {
  if (!validSession.value) {
    return
  }

  const success = await auth.updatePassword(userId.value, resetToken.value, values.password)
  if (success) {
    router.push("/login")
  }
})
</script>
