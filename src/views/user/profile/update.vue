<template>
  <layout-banner>
    <layout-banner-title> User profile </layout-banner-title>
  </layout-banner>
  <layout-container class="m-10">
    <div class="grid grid-cols-3 gap-10">
      <div class="py-10">
        <form-file></form-file>
      </div>
      <div class="col-span-2">
        <Form @submit="submit()">
          <div class="space-y-4">
            <form-input v-model="name" label="Name" required :error="errors.name"></form-input>
            <form-input type="email" v-model="email" label="Email" :disabled="email !== null"
              :error="errors.email"></form-input>
            <form-input v-model="username" label="Username" required :error="errors.username"></form-input>
            <form-input v-model="phone" label="Phone number" :error="errors.phone"></form-input>
            <base-button :loading="loading.updating">
              <span>Update changes</span>
            </base-button>
          </div>
        </Form>
      </div>

    </div>
  </layout-container>
</template>
<script lang="ts" setup>
import FormInput from '@/components/form/input.vue'
import FormFile from '@/components/form/avatar.vue'
import { AuthLoading, useAuthStore, type UserProfile, type UserProfileForm } from '@/stores/auth'
import { watchDebounced } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'

import { Form, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useUserStore } from '@/stores/user'

const auth = useAuthStore()
const userStore = useUserStore()
const loading = computed(() => ({
  updating: auth.isLoading(AuthLoading.UPDATING_PROFILE)
}))
const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: yup.object({
    id: yup.string().required('ID is required'),
    email: yup.string().email().required('Email is required'),
    name: yup.string().required('Name is required'),
    username: yup.string().required('Username is required'),
    phone: yup.string().nullable(),
  }),
})

const [name] = defineField('name')
const [email] = defineField('email')
const [username] = defineField('username')
const [phone] = defineField('phone')

const profile = ref<UserProfile | null>(null)

type ProfileFormValues = Pick<UserProfileForm, 'name' | 'email' | 'username' | 'phone'>

const submit = handleSubmit(async (values) => {
  if (!auth.user) {
    throw new Error('No authentication')
  }

  const form = {
    ...(values as ProfileFormValues),
    id: auth.user.id,
    email: values.email as string,
    created_at: profile.value?.created_at || auth.user.created_at,
  }

  await auth.updateProfile(form)
})

const getProfile = async () => {
  if (!auth.user) {
    throw new Error('No authentication')
  }

  const _profile = await auth.getProfile()
  if (_profile) {
    profile.value = _profile
    resetForm({
      values: _profile,
    })
  } else {
    const { id, email, created_at } = auth.user
    resetForm({
      values: {
        id,
        name: '',
        email,
        username: '',
        phone: '',
        avatar: '',
        created_at,
      },
    })
  }
}

const checkUsername = async (username: string) => {
  delete errors.value.username
  const isUnique = await userStore.checkUsername(username)
  if (isUnique) {
    errors.value.username = 'Username already taken'
  }
}

watchDebounced(username, checkUsername, { debounce: 500, maxWait: 1000 })

onMounted(getProfile)
</script>
