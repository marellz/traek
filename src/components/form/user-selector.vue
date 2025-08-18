<template>
  <div class="space-y-8">
    <form-group :label>
      <div class="form-input !flex space-x-2">
        <Search />
        <input type="text" class="flex-auto outline-0" v-model="query" @input="debounceSearch" :placeholder />
        <button v-show="!!query" type="button" @click="resetQuery" class="hover:text-red-500">
          <X />
        </button>
      </div>
    </form-group>

    <div v-if="query" class="space-y-4">
      <h3 class="font-medium">Search results for "{{ query }}"</h3>
      <div v-if="loadingResults" class="flex justify-center py-4">
        <base-loader></base-loader>
      </div>
      <ul v-else-if="results.length" class="space-y-2">
        <user-result-item @add-user="addUser" v-for="(user, index) in results" :user :key="index" />
      </ul>
    </div>

    <div v-if="selected.length" class="space-y-4">
      <h3 class="font-medium">Selected users</h3>
      <ul class="space-y-2">
        <user-selected-item v-for="({ user, role }, index) in selected" :key="index" :user :selected-role="userRoles[role]"></user-selected-item>
      </ul>

    </div>
  </div>
</template>
<script lang="ts" setup>
import { userRoles } from '@/data/users.data';
import UserSelectedItem from '@/components/user/selector/selected-item.vue'
import UserResultItem from '@/components/user/selector/result-item.vue'
import { UserLoading, useUserStore } from '@/stores/user';
import { Search, X } from 'lucide-vue-next';
import { computed, onUnmounted, } from 'vue';
import FormGroup from '@/components/form/group.vue'
import { watch } from 'vue';
import { useUserSelector } from '@/composables/useUserSelector';
import type { ProjectMemberForm } from '@/stores/project';

withDefaults(defineProps<{
  label?: string
  placeholder?: string
  exclude?: string[]
}>(), {
  label: 'Add users',
  placeholder: 'Search users...'
})

const userStore = useUserStore()

const queryUsers = async () => {
  return await userStore.queryUsers(query.value)
}

const { selected, query, roles, results, addUser, debounceSearch, resetQuery, /*removeSelected*/ } = useUserSelector(queryUsers)

const loadingResults = computed(() => userStore.isLoading(UserLoading.QUERYING_USERS))
const model = defineModel<Omit<ProjectMemberForm, 'project_id'>[]>({ default: [] })
watch(
  roles,
  (v) => {
    // add to model
    model.value = Object.keys(v).map((k) => ({
      user_id: k,
      role: v[k],
    }))
  },
  { deep: true },
)


onUnmounted(() => {
  resetQuery()
})
</script>
