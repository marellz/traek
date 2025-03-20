<template>
  <div>
    <div class="flex items-center space-x-2">
      <h1 class="text-4xl font-light">Project notes</h1>
      <base-button class="!ml-auto" @click="showNoteFormModal = true">
        <span>Add note</span>
      </base-button>
    </div>
    <base-loader class="py-20" v-if="loading.gettingNotes"></base-loader>
    <div v-else-if="notes.length" class="mt-10 md:columns-2 xl:columns-3 space-y-4 gap-4 items-start">
      <note-item v-for="item in notes" :item :key="item.id" @edit-note="editNote" @delete-note="deleteNote"
        @open-note="openNote"></note-item>
    </div>
    <common-empty class="mt-10" v-else />
    <base-modal title="Add note" v-model:show="showNoteFormModal">
      <note-form :edit @submit="handleSubmit" :loading="loading.creating || loading.updating"></note-form>
    </base-modal>
    <base-modal title="View note" v-model:show="showNoteViewModal">
      <base-loader v-if="loading.gettingNote"></base-loader>
      <div v-else-if="noteDisplay" class="space-y-2">
        <h1 class="text-4xl font-bold">{{ noteDisplay.title }}</h1>
        <p v-html="noteDisplay.content"></p>

        <div class="mt-10">
          <div class="flex items-center space-x-2">
            <user-avatar size="h-12 w-12" :avatar="noteDisplay.created_by.avatar"></user-avatar>
            <div>
              <span class="font-medium"> {{ noteDisplay.created_by.name }}</span>
              <p class="text-xs text-slate-500">{{ noteDisplay.updated_at === null ? 'Created' : 'Updated' }} {{
                parseDate(noteDisplay.updated_at ?? noteDisplay.created_at, 'Do MMM YYYY, h:mm A') }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center">
        <h1 class="text-2xl font-medium">Problem.</h1>
        <p class="text-sm text-slate-500">Error occurred or note does not exist</p>
      </div>
    </base-modal>
  </div>
</template>
<script lang="ts" setup>
import UserAvatar from '@/components/user/avatar.vue'
import NoteForm from '@/components/object-forms/note-form.vue'
import NoteItem from '@/components/notes/item.vue'
import CommonEmpty from '@/components/common/empty.vue'
import { NotesLoading, useNotesStore, type ProjectNote, type ProjectNoteForm } from '@/stores/notes'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { parseDate } from '@/utils/parseDate'
const notesStore = useNotesStore()
const route = useRoute()

const id = computed(() => route.params.id as string)

const edit = ref<string | null>(null)
const show = ref<string | null>(null)

const loading = computed(() => ({
  gettingNotes: notesStore.isLoading(NotesLoading.GETTING),
  gettingNote: notesStore.isLoading(NotesLoading.GETTING_ONE),
  creating: notesStore.isLoading(NotesLoading.CREATING),
  updating: notesStore.isLoading(NotesLoading.UPDATING),
}))

const showNoteFormModal = ref(false)
const showNoteViewModal = ref(false)
const notes = ref<ProjectNote[]>([])
const noteDisplay = ref<ProjectNote | null>(null)

const getNotes = async () => {
  const _notes = await notesStore.list(id.value)
  if (_notes) {
    notes.value = _notes
  }
}

const getNote = async (id: string) => {
  const _note = await notesStore.get(id)
  if (_note) {
    noteDisplay.value = _note
  }
}

const openNote = (id: string) => {
  show.value = id
  getNote(id)
  showNoteViewModal.value = true
}

const editNote = (id: string) => {
  edit.value = id
  showNoteFormModal.value = true
}

const deleteNote = async (id: string) => {
  const success = await notesStore.destroy(id)
  if (success) {
    getNotes()
  }
}

const updateNote = async (form: ProjectNoteForm) => {
  if (!edit.value) {
    return
  }

  const success = await notesStore.update(edit.value, form)

  if (success) {
    edit.value = null
    showNoteFormModal.value = false
    getNotes()
  }
}

const createNote = async (form: ProjectNoteForm) => {
  const payload = { ...form, project_id: id.value }
  const success = await notesStore.create(payload)
  if (success) {
    showNoteFormModal.value = false
    getNotes()
  }
}

const handleSubmit = (form: ProjectNoteForm) => {
  if (edit.value) {
    updateNote(form)
  } else {
    createNote(form)
  }
}

onMounted(() => {
  getNotes()
})
</script>
