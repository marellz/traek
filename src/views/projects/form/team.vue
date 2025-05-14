<template>
  <fieldset>
    <legend>Project users</legend>
    <div class="space-y-8">
      <div class="space-y-4">
        <form-user-selector label="Members" v-model="members" :queried-users
          @search-users="searchUsers"></form-user-selector>
      </div>
      <div class="flex justify-end">
        <base-button @click="submit">
          <span>Next</span>
          <ArrowRight :size="20" />
        </base-button>
      </div>
    </div>
  </fieldset>
</template>
<script lang="ts" setup>
import { useProjectStore, type ProjectUser } from '@/stores/project'
import FormUserSelector from '@/components/form/user-selector.vue'
import { useUserStore } from '@/stores/user'
import { useDebounceFn } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import { useProjectFormStore } from '@/stores/project.form'
const userStore = useUserStore()
const route = useRoute()
const id = computed(() => route.params.id as string)
const members = ref<string[]>([])
const oldMembers = ref<string[]>([])
const newMembers = computed(() => members.value.filter(m => !oldMembers.value.includes(m)))
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
const projectFormStore = useProjectFormStore()
onMounted(async () => {
  const _members = await projectStore.getMembers(id.value)

  if (_members) {
    members.value = _members.map((m) => m.id)
    oldMembers.value = members.value
  }

})

const router = useRouter()
const submit = async () => {
  const success = await projectStore.addMembers(id.value, newMembers.value)
  if (success) {

    // todo: add these members manually.
    await projectFormStore.getProject()
    router.push({ name: 'project-form-review', params: { id: id.value } })
  }
}
</script>
