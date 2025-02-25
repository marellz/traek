<template>
  <div class="mb-8 space-y-2 text-center">
    <auth-title>Join Our Platform</auth-title>
    <auth-subtitle>
      Create an account to start uploading, organizing, and sharing your documents securely. Forgot
      Password Page
    </auth-subtitle>
  </div>
  <Form @submit="register()" @invalid-submit="handleInvalidSubmit">
    <div class="space-y-4">
      <!-- <form-input label="Name" v-model="name" required :error="errors.name" v-bind="nameAttrs"></form-input> -->

      <form-input
        label="Email"
        :error="errors.email"
        v-model="email"
        type="email"
        required
      ></form-input>

      <form-input
        label="Password"
        v-model="password"
        type="password"
        required
        :error="errors.password"
        allow-password-toggle
      ></form-input>

      <form-input
        label="Confirm password"
        v-model="confirmPassword"
        type="password"
        required
        :error="errors.password_confirmation"
      ></form-input>

      <div>
        <base-button class="w-full" :loading>
          <span>Register</span>
        </base-button>
      </div>
      <base-alert v-if="auth.errors" variant="error" title="Authentication error">
        <div class="space-y-2">
          <p v-for="(err, key) in auth.errors" :key>
            <span>{{ err }}</span>
          </p>
        </div>
      </base-alert>
      <div>
        <p class="text-center text-gray-600">
          Already have an account?
          <router-link class="font-medium text-primary" to="/login">Login</router-link>
        </p>
      </div>
    </div>
  </Form>
</template>
<script lang="ts" setup>
import AuthTitle from '@/components/auth/title.vue'
import AuthSubtitle from '@/components/auth/subtitle.vue'
import { Form, useForm } from 'vee-validate'
import FormInput from '@/components/form/input.vue'
import BaseButton from '@/components/base/button.vue'
import BaseAlert from '@/components/base/alert.vue'
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

import * as yup from 'yup'
import { useRouter } from 'vue-router'

const schema = yup.object({
  email: yup.string().email().required('Email is required'),
  password: yup.string().min(8).required('Password is required'),
  password_confirmation: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
})

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: schema,
})

const auth = useAuthStore()
const router = useRouter()

const loading = computed(() => auth.loading)

const [email] = defineField('email')
const [password] = defineField('password')
const [confirmPassword] = defineField('password_confirmation')

const register = handleSubmit(async (values) => {
  const _user = await auth.register({
    email: values.email,
    password: values.password,
  })

  if (_user) {
    router.push({ name: 'user-profile', params: { id: _user.id } })
  }

  router.push({ name: 'home' })
})

const handleInvalidSubmit = () => {
  if (Object.keys(errors).length) {
    alert('Errors!')
    return null
  }
}

onMounted(() => {
  auth.resetErrors()
})
</script>
