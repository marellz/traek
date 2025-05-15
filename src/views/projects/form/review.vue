<template>
  <form-fieldset legend="Project review">
    <template v-if="project">
      <div>
        <div class="border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="font-medium">Basic information</h2>
            <router-link :to="{ name: 'edit-project' }">
              <button type="button" class="p-1 text-slate-500 hover:text-black dark:hover:text-white">
                <Edit />
              </button>

            </router-link>
          </div>
          <div class="space-y-4">
            <div>
              <h4 class="text-sm text-slate-500">Name</h4>
              <p class="font-medium">{{ project.name }}</p>
            </div>
            <div>
              <h4 class="text-sm text-slate-500">Category</h4>
              <p class="font-medium">{{ project.category }}</p>
            </div>
            <div>
              <h4 class="text-sm text-slate-500">Priority</h4>
              <base-tag class="text-sm text-black dark:text-white">{{ project.priority }}</base-tag>
            </div>
            <div>
              <h4 class="text-sm text-slate-500">Description</h4>
              <p class="font-medium">{{ project.description }}</p>
            </div>
          </div>

        </div>
      </div>
      <div class="border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="font-medium">Goals</h2>
          <router-link :to="{ name: 'project-form-about' }">
            <button type="button" class="p-1 text-slate-500 hover:text-black dark:hover:text-white">
              <Edit />
            </button>
          </router-link>
        </div>
        <div>
          <ul class="space-y-4">
            <li v-for="(goal, index) in goals" :key="index">
              <div class="flex items-center space-x-2">
                <h1 class="font-medium">{{ goal.title }}</h1>
                <base-tag class="text-xs">{{ goal.status }}</base-tag>

              </div>
              <p class="text-slate-500 text-sm">{{ goal.description }}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="font-medium">Team</h2>
          <router-link :to="{ name: 'project-form-team' }">
            <button type="button" class="p-1 text-slate-500 hover:text-black dark:hover:text-white">
              <Edit />
            </button>
          </router-link>
        </div>
        <div>
          <div v-if="loadingCurrentMembers" class="flex justify-center py-4">
            <base-tag></base-tag>
          </div>
          <ul v-else class="space-y-4">
            <li v-for="(user, index) in project.members" :key="index">
              <div class="flex items-start space-x-4">
                <Avatar :avatar="user.avatar" size="h-12 w-12" />
                <div>
                  <div class="flex items-center space-x-2">
                    <h1 class="font-medium">{{ user.name || 'No name' }}</h1>
                    <base-tag class="text-xs">{{ userRoles[user.role as UserRole] }}</base-tag>
                  </div>
                  <p class="text-slate-500 text-sm">{{ user.email }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <base-button @click="approve">
          <span>Approve</span>
          <BadgeCheck />
        </base-button>
      </div>
    </template>
    <template v-else>
      <div>
        <h3>Error</h3>
        <p>Problem displaying the project information</p>
      </div>
    </template>
  </form-fieldset>
</template>
<script lang="ts" setup>
import FormFieldset from '@/components/form/fieldset.vue';
import Avatar from '@/components/user/avatar.vue';
import { userRoles, type UserRole } from '@/data/users.data';
import { ProjectLoading, useProjectStore, type ProjectGoal } from '@/stores/project';
import { useProjectFormStore } from '@/stores/project.form';
import { BadgeCheck, Edit } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const projectFormStore = useProjectFormStore()
const projectStore = useProjectStore()
const project = computed(() => projectFormStore.project)
const router = useRouter()
const route = useRoute()
const id = computed(() => route.params.id as string)
const approve = () => {
  const _id = projectFormStore.id
  projectFormStore.setId(null)
  router.push({ name: 'project', params: { id: _id } })
}

const loadingCurrentMembers = computed(() => projectStore.isLoading(ProjectLoading.GETTING_MEMBERS))
const goals = ref<ProjectGoal[]>([])
const getGoals = async () => {
  if (!id.value) return
  const _goals = await projectStore.getGoals(id.value)
  if (_goals) goals.value = _goals
}

onMounted(getGoals)
</script>
