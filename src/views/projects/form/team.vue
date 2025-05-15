<template>
  <form-fieldset legend="Project users">
    <div class="space-y-4">
      <h2 class="font-medium">Current members</h2>
      <!-- todo: creatively limit this list to 5, and a search for it only -->
      <ul class="space-y-2">
        <li v-for="(user, index) in currentMembers" :key="index">
          <div class="flex space-x-2 items-center">
            <Avatar :avatar="user.avatar" size="h-8 w-8"></Avatar>
            <div class="flex-auto">
              <div class="flex items-center space-x-2">
                <h1 class="font-medium">{{ user.name || 'No name' }}</h1>
                <base-tag class="text-xs">
                  {{ user.role }}
                </base-tag>
              </div>
              <p class="text-sm text-slate-500">{{ user.email }}</p>
            </div>
            <button type="button" class="p-1 hover:text-red-500" @click="removeMember(user.user_id)">
              <X />
            </button>
          </div>
        </li>
      </ul>
    </div>
    <div class="space-y-4">
      <form-user-selector :label="userSelectorLabel" v-model="members" :exclude></form-user-selector>
    </div>
    <div class="flex justify-end">
      <base-button @click="submit">
        <span>Add members</span>
        <Plus />
      </base-button>
    </div>
  </form-fieldset>
</template>
<script lang="ts" setup>
import FormFieldset from '@/components/form/fieldset.vue'
import { useProjectStore, type ProjectMember } from '@/stores/project'
import FormUserSelector from '@/components/form/user-selector.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus, X } from 'lucide-vue-next'
import { useProjectFormStore } from '@/stores/project.form'
import type { UserRole } from '@/data/users.data'
import Avatar from '@/components/user/avatar.vue'
const route = useRoute()
const id = computed(() => route.params.id as string)
const members = ref<{ user_id: string, role: UserRole }[]>([])
const currentMembers = ref<ProjectMember[]>([])
const exclude = computed(() => currentMembers.value.map(m => m.id))

const projectStore = useProjectStore()
const projectFormStore = useProjectFormStore()

const userSelectorLabel = computed(() => currentMembers.value.length > 0 ? 'Add more team members' : 'Add your team members')

const getCurrentMembers = async () => {
  const _members = await projectStore.getMembers(id.value)

  if (_members) {
    currentMembers.value = _members
  }
}

const removeMember = async (user_id: string) => {
  if (!confirm('Are you sure you want to remove this member?')) return
  const _deleted = await projectStore.removeMember(user_id, id.value)
  if (_deleted) {
    const _index = currentMembers.value.findIndex(m => m.user_id === user_id)
    if (_index !== -1) currentMembers.value.splice(_index, 1)
  }

}

onMounted(getCurrentMembers)

const router = useRouter()
const submit = async () => {
  const success = await projectStore.addMembers(id.value, members.value)
  if (success) {
    await projectFormStore.getProject()
    members.value = []
    router.push({ name: 'project-form-review', params: { id: id.value } })
  }
}
</script>
