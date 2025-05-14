<template>
  <div>
    <div class="flex items-center space-x-2">
      <h1 class="text-4xl font-light">Project members</h1>
      <base-button class="!ml-auto" @click="showAddMemberModal = true">
        <span>Add member</span>
      </base-button>
      <base-button>
        <span>Send invitation</span>
      </base-button>
    </div>
    <base-loader class="py-20" v-if="loading.gettingTasks"></base-loader>
    <table class="mt-10 member-table">
      <!-- <thead>
        <tr class="border-b border-b-slate-200 text-left font-medium">
          <th class="font-medium" v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
      </thead> -->
      <tbody>
        <tr v-for="user in members" :key="user.id" :class="{ 'disabled': project?.creator.id === user.id }">
          <td class="py-4">
            <div class="flex items-center space-x-2">
              <user-avatar size="h-12 w-12" :avatar="user.avatar"></user-avatar>
              <div>
                <p>
                  {{ user.name }}
                  <span class="text-sm text-slate-400">@{{ user.username }}</span>
                </p>
                <div class="flex space-x-2 items-center text-slate-400">
                  <Mail :size="12" />
                  <p class="text-sm ">
                    {{ user.email }}
                  </p>
                </div>
              </div>
            </div>
          </td>
          <td>
            <base-tag class="text-xs"><span>{{ user.role }}</span></base-tag>
          </td>
          <td class="py-4">
            <p>
              {{ parseDate(user.joined_at) }}
            </p>
            <p class="text-xs text-slate-400">Member since</p>
          </td>
          <td class="py-4">
            <base-action v-if="project?.creator.id !== user.id" @click="removeMember(user.id)">
              <span>Remove</span>
            </base-action>
          </td>
        </tr>
      </tbody>
    </table>

    <base-modal title="Add members" v-model:show="showAddMemberModal">
      <form @submit.prevent="addMembers">
        <div class="space-y-4">
          <form-user-selector label="Search users" v-model="newMembers"
            :exclude="members.map(m => m.id)"></form-user-selector>
          <base-button :disabled="!newMembers.length || addingNewMembers"> <span> Add Members </span></base-button>
        </div>
      </form>
    </base-modal>
  </div>
</template>
<script lang="ts" setup>
import UserAvatar from '@/components/user/avatar.vue'
import FormUserSelector from '@/components/form/user-selector.vue'
import { ProjectLoading, useProjectStore, type Project, type ProjectMember } from '@/stores/project'
import { Mail } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { parseDate } from '@/utils/parseDate'
import type { UserRole } from '@/data/users.data'

const route = useRoute()
const id = computed(() => route.params.id as string)
const projectStore = useProjectStore()
const loading = computed(() => ({
  gettingTasks: projectStore.isLoading('getting-tasks'),
}))

const project = ref<Project>()
const members = ref<ProjectMember[]>([])
const getMembers = async () => {
  const _users = await projectStore.getMembers(id.value)
  if (_users) {
    members.value = _users
  }
}

const showAddMemberModal = ref(false)

const newMembers = ref<{ user_id: string, role: UserRole }[]>([])
const addingNewMembers = computed(() => projectStore.isLoading(ProjectLoading.ADDING_MEMBERS))
const addMembers = async () => {
  const payload = newMembers.value.map(({ user_id, role }) => ({ user_id, role, project_id: id.value }))
  const success = await projectStore.addMembers(id.value, payload)
  if (success) {
    showAddMemberModal.value = false
    newMembers.value = []

    getMembers()

    // todo: toast
  }
}


const removeMember = async (userId: string) => {
  if (!confirm('Remove member?')) {
    return
  }

  const success = await projectStore.removeMember(userId, id.value)
  if (success) {
    const _members = [...members.value]
    _members.splice(
      _members.findIndex((m) => m.id === userId),
      1,
    )
    members.value = _members

    // todo: toast
  }
}

onMounted(async () => {
  getMembers()

  const _project = await projectStore.getProject(id.value)
  if (_project) {
    project.value = _project
  }
})

// const headers = ['Name', 'Email', 'Member since', 'Actions']
</script>
