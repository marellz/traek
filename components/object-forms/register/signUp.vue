<template>
  <div class="mb-10">
    <base-button @click="byPass">
      <span>Generate user</span>
    </base-button>
  </div>
  <Form @submit="register()">
    <div class="space-y-4">
      <!-- <form-input label="Name" v-model="name" required :error="errors.name" v-bind="nameAttrs"></form-input> -->
      <form-input v-model="email" label="Email" :error="errors.email" type="email" required />

      <form-input
        v-model="password"
        label="Password"
        type="password"
        required
        :error="errors.password"
        allow-password-toggle
      />

      <form-input
        v-model="confirmPassword"
        label="Confirm password"
        type="password"
        required
        :error="errors.password_confirmation"
      />
      <div v-if="error">
        <p class="text-red-500">
          {{ error }}
        </p>
      </div>
      <div>
        <base-button class="w-full" :loading>
          <span>Register</span>
        </base-button>
      </div>
      <div />
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
          <router-link class="text-primary font-medium" to="/auth/login">Login</router-link>
        </p>
      </div>
    </div>
  </Form>
</template>
<script lang="ts" setup>
import * as yup from 'yup'
import { Form, useForm } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { faker } from '@faker-js/faker'

const loading = computed(() => auth.loading)

const auth = useAuthStore()

const schema = yup.object({
  email: yup.string().email().required('Email is required'),
  password: yup.string().min(8).required('Password is required'),
  password_confirmation: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
})

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
})

const [email] = defineField('email')
const [password] = defineField('password')
const [confirmPassword] = defineField('password_confirmation')
const emit = defineEmits(['complete'])
const error = ref('')

const byPass = () => {
  resetForm({
    values: {
      email: faker.internet.email({ provider: 'traek.com' }).toLowerCase(),
      password: 'secret22',
      password_confirmation: 'secret22',
    },
  })
}

const register = handleSubmit(async (values) => {
  error.value = ''
  const _user = await auth.register({
    email: values.email,
    password: values.password,
  })

  if (_user) {
    emit('complete')
  } else {
    error.value = 'Error registering user'
  }
})

onMounted(() => {
  auth.resetErrors()
})
</script>
