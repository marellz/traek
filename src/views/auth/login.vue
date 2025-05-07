<template>
  <div>
    <div class="mb-8 text-center space-y-2">
      <auth-title>Welcome Back!</auth-title>
      <auth-subtitle>
        Log in to access your account and manage your projects effortlessly.
      </auth-subtitle>
    </div>
    <Form @submit="login()">
      <div class="space-y-4">
        <form-input label="Email address" v-model="email" :error="errors.email" autocomplete="email" type="email"
          required></form-input>
        <form-input label="Password" v-model="password" autocomplete="password" :error="errors.password"
          allow-password-toggle type="password" required></form-input>
        <div class="flex flex-col items-start md:flex-row md:items-center space-y-4 md:space-y-0 justify-between">
          <form-checkbox v-model="rememberMe" label="Remember me" />
          <router-link class="text-primary dark:text-indigo-400 font-medium" to="/forgot-password">Forgot password?
          </router-link>
        </div>
        <base-button class="w-full" :loading>
          <span>Login</span>
        </base-button>
        <base-alert v-if="auth.errors" variant="error" title="Authentication error">
          <p v-for="(err, key) in auth.errors" :key>
            <span>{{ err }}</span>
          </p>
        </base-alert>
        <div class="space-y-2">
          <p class="text-gray-600 text-center">
            Dont have an account?
            <router-link class="text-primary dark:text-indigo-400 font-medium" to="/onboarding">Register</router-link>
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
import FormCheckbox from "@/components/form/checkbox.vue"
import BaseButton from "@/components/base/button.vue"
import BaseAlert from "@/components/base/alert.vue"
import { computed, onMounted, ref } from "vue"
import { AuthLoading, useAuthStore } from "@/stores/auth"
import { Form, useForm } from "vee-validate"
import * as yup from "yup"
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const loading = computed(() => auth.isLoading(AuthLoading.LOGGING_IN))

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(6).required("Password is required"),
  }),
})

const [email] = defineField("email")
const [password] = defineField("password")

const rememberMe = ref(false)
const router = useRouter()

const stack = ref('')

const login = handleSubmit(async (values) => {
  stack.value = 'Logging you in'
  const success = await auth.login({
    email: values.email,
    password: values.password,
  })

  if (!success) {
    return false;
    // show error
  }

  await getProfile()
})

const getProfile = async () => {
  const _profile = await auth.getProfile()

   if (_profile && auth.hasProfile) {
    router.push({ name: "dashboard" })
  } else {
    if (auth.user)
      router.push({ name: "user-profile", params: { id: auth.user.id } })
  }
}

onMounted(() => {
  auth.resetErrors()

  const email = import.meta.env.VITE_TEST_EMAIL
  const password = import.meta.env.VITE_TEST_PASSWORD

  if (!(email && password)) {
    return
  }

  resetForm({
    values: {
      email,
      password,
    }
  })

})

</script>
<style></style>
