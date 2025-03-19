<template>
  <img v-if="url" class="object-center object-cover rounded-full border-2" :class="size" :src="url" alt="" />
  <span v-else class="rounded-full border-2 border-white/10 bg-white/20 inline-flex items-center justify-center"
    :class="size">
    <User :size="iconSize" :stroke-width="1" />
  </span>
</template>
<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import { User } from "lucide-vue-next"
import { onMounted, ref, watch } from "vue";
const props = withDefaults(
  defineProps<{
    avatar: string | null | undefined
    size?: string
    iconSize?: number
  }>(),
  {
    iconSize: 24,
    size: "h-6 w-6",
  },
)
const url = ref<string | null>(null)
const userStore = useUserStore()
const getAvatar = async () => {
  if (!props.avatar) return
  const _url = await userStore.getAvatarLink(props.avatar)
  if (_url) {
    url.value = _url
  }
}

onMounted(getAvatar)

watch(() => props.avatar, getAvatar)
</script>
