<template>
  <fieldset>
    <legend>Project users</legend>
    <div class="space-y-4">
      <form-user-selector label="Members" v-model="members" :queried-users
        @search-users="searchUsers"></form-user-selector>
    </div>
  </fieldset>
</template>
<script lang="ts" setup>
import { useProjectStore, type ProjectUser } from '@/stores/project'
import { useUserStore } from '@/stores/user'
import { useDebounceFn } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const userStore = useUserStore()
const route = useRoute()
const id = computed(() => route.params.id as string)
const members = ref<string[]>([])

const queriedUsers = ref<ProjectUser[]>([])

const searchUsers = useDebounceFn(async (q: string) => {
  if (q == '') {
    queriedUsers.value = []
    return
  }
  const _users = await userStore.queryUsers(q)
  if (_users && _users.length) {
    queriedUsers.value = _users
  }
}, 1000)

const projectStore = useProjectStore()
onMounted(async () => {
  const _members = await projectStore.getMembers(id.value)

  if (_members) {
    members.value = _members.map((m) => m.id)
  }

})
</script>
