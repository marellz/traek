<template>
  <div class="relative">
    <base-loader v-if="loading.getting || loading.uploading"></base-loader>
    <template v-else-if="!avatar">
      <div class="flex justify-center">
        <input class="w-0 h-0 absolute -z-10" type="file" accept="image/*" @change="handleChange" :id />
        <label :for="id">
          <div
            class="flex flex-col items-center space-y-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 p-4 rounded-xl">
            <span
              class="h-48 w-48 rounded-full border-4 flex items-center justify-center border-slate-200 dark:border-slate-500 bg-slate-50 dark:bg-slate-700">
              <User :size="96" :stroke-width="1" class="text-color-2" />
            </span>
            <p class="flex items-center space-x-2 font-medium text-slate-500 dark:text-slate-500">
              <Edit :size="16" />
              <span>Add Avatar</span>
            </p>
          </div>
        </label>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col items-center space-y-4">
        <img class="h-48 w-48 rounded-full object-cover border-4 border-slate-200 dark:border-slate-500" :src="avatar"
          alt="" loading="eager" />
        <div class="flex space-x-2 justify-center">
          <input class="w-0 h-0 absolute -z-10" type="file" accept="image/*" @change="handleChange" :id />
          <label :for="id">
            <span
              class="text-sm inline-flex items-center space-x-2 p-2 font-medium rounded-lg hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              type="button">
              <Edit :size="16" />
              <span>Update</span>
            </span>
          </label>
          <base-action confirm @confirm="deleteAvatar" v-if="!loading.deleting">
            <Trash :size="16" />
            <span>
              Delete
            </span>
          </base-action>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import useCustomId from "@/composables/useCustomId"
import { Edit, Trash, User } from "lucide-vue-next"
import { AuthLoading, useAuthStore } from "@/stores/auth"
import { UserLoading, useUserStore } from "@/stores/user"
import { computed, onMounted, ref } from "vue"

defineProps<{
  disabled?: boolean
  required?: boolean
}>()


const auth = useAuthStore()
const userStore = useUserStore()
const avatar = ref<string | null>(null)

const loading = computed(() => ({
  uploading: auth.isLoading(AuthLoading.UPLOADING),
  getting: userStore.isLoading(UserLoading.GETTING_LINK),
  deleting: auth.isLoading(AuthLoading.DELETING),
}))

const file = ref<File | null>(null)
const id = ref()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    file.value = target.files[0]
    uploadAvatar(target.files[0])
  }
}

const deleteAvatar = async () => {
  const success = await auth.deleteAvatar()
  if (success) {
    avatar.value = null
  }
}

const uploadAvatar = async (file: File) => {
  const _url = await auth.uploadAvatar(file)
  if (_url) {
    avatar.value = _url
    return
  }
}

const getAvatarLink = async () => {
  if (!(auth.profile && auth.profile.avatar)) {
    return
  }

  const _link = await userStore.getAvatarLink(auth.profile.avatar)
  if (_link) {
    avatar.value = _link
  }
}

onMounted(() => {
  id.value = useCustomId()

  getAvatarLink()
})
</script>
