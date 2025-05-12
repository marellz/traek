<template>
  <div v-if="profileComplete && !canEdit"
    class="flex items-center space-x-2 p-4 border rounded-xl border-green-500/15 bg-green-500/10">
    <Check class="text-green-500" />
    <h1 class="flex-auto font-medium">Profile is complete!</h1>
    <div>
      <base-action @click="canEdit = true">
      <Pencil :size="16" stroke-width="2" />
      <span>Edit</span>
      </base-action>
    </div>
  </div>
  <div>
  </div>
  <Form @submit="update()">
    <div class="space-y-4">
      <form-input label="Name" :error="errors.name" v-model="name" required :disabled="!canEdit"></form-input>
      <form-input v-if="!auth.user?.email" label="Email" :error="errors.email" v-model="email" required></form-input>
      <form-input label="Username" :error="errors.username" v-model="username" required
        :disabled="!canEdit"></form-input>
      <form-input label="Phone" :error="errors.phone" v-model="phone" :disabled="!canEdit"></form-input>
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
import { AuthLoading, useAuthStore } from '@/stores/auth'
import { computed, onMounted, ref, watch } from 'vue'
import { useOnboardingStore } from '@/stores/onboarding'
import { Form, useForm } from 'vee-validate'
import * as yup from 'yup'
import { Check, Pencil } from 'lucide-vue-next'

const auth = useAuthStore()

const user = computed(() => auth.user)

const loading = computed(() => auth.isLoading(AuthLoading.UPDATING_PROFILE))
const profileComplete = computed(() => auth.profile?.name !== null && auth.profile?.phone !== '' && auth.profile?.username !== null)
const canEdit = ref(false)
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


const onboardingStore = useOnboardingStore()

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
    canEdit.value = false
    onboardingStore.nextStage()
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
  if (!profileComplete.value) {
    canEdit.value = true
  }
  auth.getProfile()
})
</script>
