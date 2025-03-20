<template>
  <div
    class="break-inside-avoid-column rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800/50 p-4">
    <div class="flex justify-between">
      <a class="flex-auto" href="#" @click.prevent="emit('open-note', item.id)">
        <h1 class="text-2xl font-bold">{{ item.title }}</h1>
      </a>
      <div class="flex items-center space-x-2">
        <base-action @click="editNote">
          <span>Edit</span>
        </base-action>
        <base-action confirm @confirm="deleteNote">
          <span>Delete</span>
        </base-action>
      </div>
    </div>
    <a class="block" href="#" @click.prevent="emit('open-note', item.id)">
      <div class="mt-2 line-clamp-4 text-sm text-slate-500" :class="{ 'line-clamp-none': showAll }">
        <p v-html="item.content"></p>
      </div>
      <div class="mt-10">
        <div class="flex items-center space-x-2">
          <user-avatar size="h-10 w-10" :avatar="item.created_by.avatar"></user-avatar>
          <div>
            <span class="font-medium"> {{ item.created_by.name }}</span>
            <p class="text-xs text-slate-500">{{ item.updated_at === null ? 'Created' : 'Updated' }} {{
              parseDate(item.updated_at ?? item.created_at, 'Do MMM YYYY, h:mm A') }}</p>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>
<script lang="ts" setup>
import UserAvatar from '@/components/user/avatar.vue'
import type { ProjectNote } from '@/stores/notes'
import { parseDate } from '@/utils/parseDate';
import { ref } from 'vue'

const props = defineProps<{
  item: ProjectNote
}>()

const emit = defineEmits(['open-note', 'edit-note', 'delete-note'])

const showAll = ref(false)

const editNote = () => {
  emit('edit-note', props.item.id)
}

const deleteNote = () => {
  if (!confirm('Delete note?')) {
    return
  }

  emit('delete-note', props.item.id)
}
</script>
