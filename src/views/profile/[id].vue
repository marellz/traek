<template>
  <layout-banner>
    <layout-banner-title>
      User profile
    </layout-banner-title>
  </layout-banner>
  <layout-container class="m-10">
    <div>
      <form @submit.prevent="submit">
        <div class="space-y-4">
          <form-input v-model="form.name" label="Name" required></form-input>
          <form-input type="email" v-model="form.email" label="Email" disabled></form-input>
          <form-input v-model="form.username" label="Username" required></form-input>
          <form-input v-model="form.phone" label="Phone number"></form-input>
          <base-button>
            <span>Update changes</span>
          </base-button>
        </div>
      </form>
    </div>
  </layout-container>

</template>
<script lang="ts" setup>
import FormInput from '@/components/form/input.vue'
import { useAuthStore, type UserProfileForm } from '@/stores/auth';
import { watchDebounced } from '@vueuse/core';
import { onMounted, ref } from 'vue';

const auth = useAuthStore()
const form = ref<Omit<UserProfileForm, 'created_at'> | null>(null)

const errors = ref<Record<string, string>>({})


const submit = async () => {
  if (!auth.user) {
    console.error('NO authentication')
    return
  }
  await auth.updateProfile(form.value)
}

const getProfile = async () => {
  if (!auth.user) {
    //fail
    return null
  }

  const _profile = await auth.getProfile()
  if (_profile) {
    form.value = { ..._profile as UserProfileForm }
  } else {
    const { id, email } = auth.user.email
    form.value = {
      id,
      name: "",
      email,
      username: "",
      phone: "",
      avatar: "",
      avatar_url: "",
    }
  }
}

const checkUsername = async (username: string) => {
  delete errors.value.username
  const isUnique = await auth.checkUsername(username)
  if (isUnique) {
    errors.value.username = 'Username already taken'
  }
}

watchDebounced(() => form.value.username,
  checkUsername,
  { debounce: 500, maxWait: 1000 },)

onMounted(getProfile)
</script>
