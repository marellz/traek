<template>
  <Form @submit="update()">
    <div class="space-y-4">
      <form-input label="Name" :error="errors.name" v-model="name" required></form-input>
      <form-input
        v-if="!auth.user?.email"
        label="Email"
        :error="errors.email"
        v-model="email"
        required
      ></form-input>
      <form-input
        label="Username"
        :error="errors.username"
        v-model="username"
        required
      ></form-input>
      <form-input label="Phone" :error="errors.phone" v-model="phone"></form-input>
      <div>
        <base-button class="w-full" :loading>
          <span>Save user info</span>
        </base-button>
      </div>
      <base-alert v-if="auth.errors" variant="error" title="Authentication error">
        <div class="space-y-2">
          <p v-for="(err, key) in auth.errors" :key>
            <span>{{ err }}</span>
          </p>
        </div>
      </base-alert>
    </div>
  </Form>
</template>
<script lang="ts" setup>
import FormInput from '@/components/form/input.vue'
import BaseAlert from '@/components/base/alert.vue'
import BaseButton from '@/components/base/button.vue'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, ref, watch } from 'vue'
import * as yup from 'yup'
import { Form, useForm } from 'vee-validate'

const auth = useAuthStore()
const emit = defineEmits(['complete'])

const loading = computed(() => auth.loading)
const user = computed(() => auth.user)
const error = ref('')

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().required('Email is required'),
  username: yup.string().min(6).required('Username is required'),
  phone: yup.string().nullable(),
})

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
})

const [name] = defineField('name')
const [username] = defineField('username')
const [phone] = defineField('phone')
const [email] = defineField('email')

const update = handleSubmit(async (values) => {
  if (!user.value) {
    error.value = 'No user in store'
    return
  }

  const { created_at, id } = user.value

  const success = await auth.updateProfile({
    name: values.name,
    username: values.username,
    phone: values.phone,
    email: values.email,
    created_at,
    id,
  })

  if (success) {
    emit('complete')

    console.log('updated!')
  }
})

watch(
  () => auth.profile,
  (v) => {
    if (!v) {
      return
    }
    resetForm({
      values: {
        email: v.email,
        phone: v.phone,
        name: v.name,
        username: v.username,
      },
    })
  },
)

onMounted(() => {
  auth.getProfile()
})
</script>
