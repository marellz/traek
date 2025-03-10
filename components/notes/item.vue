<template>
  <div class="break-inside-avoid-column rounded-xl border border-slate-300 p-4">
    <div class="flex justify-between">
      <h1 class="text-2xl font-medium">{{ item.title }}</h1>
      <div class="flex items-center space-x-2">
        <base-action @click="editNote">
          <span>Edit</span>
        </base-action>
        <base-action @click="deleteNote">
          <span>Delete</span>
        </base-action>
      </div>
    </div>
    <p
      class="mt-2 line-clamp-4 text-sm"
      :class="{ 'line-clamp-none': showAll }"
      :title="item.content"
    >
      {{ item.content }}
    </p>
    <div class="mt-10">
      <p>
        by
        <span class="font-medium"> {{ item.created_by.name }}</span>
      </p>
      <p class="text-xs">
        {{ item.updated_at === null ? 'Created' : 'Updated' }}
        {{ moment(item.created_at).format('Mo MMM YYYY, h:mm A') }}
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { ProjectNote } from '@/stores/notes'
import moment from 'moment'
import { ref } from 'vue'

const props = defineProps<{
  item: ProjectNote
}>()
const emit = defineEmits(['edit-note', 'delete-note'])
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
