<template>
  <div>
    <div class="flex items-center space-x-2">
      <h1 class="text-4xl font-light">Project notes</h1>
      <base-button class="!ml-auto" @click="showNoteFormModal = true">
        <span>Add note</span>
      </base-button>
    </div>
    <base-loader v-if="loading.gettingNotes" class="py-20" />
    <div
      v-else-if="notes.length"
      class="mt-10 items-start gap-4 space-y-4 md:columns-2 xl:columns-3"
    >
      <notes-item
        v-for="item in notes"
        :key="item.id"
        :item
        @edit-note="editNote"
        @delete-note="deleteNote"
      />
    </div>
    <common-empty v-else class="mt-10" />
    <base-modal v-model:show="showNoteFormModal" title="Add note">
      <note-form :edit :loading="loading.creating || loading.updating" @submit="handleSubmit" />
    </base-modal>
  </div>
</template>
<script lang="ts" setup>
import NoteForm from '@/components/object-forms/note-form.vue'
import { NotesLoading, useNotesStore, type ProjectNote, type ProjectNoteForm } from '@/stores/notes'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const notesStore = useNotesStore()
const route = useRoute()

const id = computed(() => route.params.id as string)

const edit = ref<string | null>(null)

const loading = computed(() => ({
  gettingNotes: notesStore.isLoading(NotesLoading.GETTING),
  creating: notesStore.isLoading(NotesLoading.CREATING),
  updating: notesStore.isLoading(NotesLoading.UPDATING),
}))

const showNoteFormModal = ref(false)

const notes = ref<ProjectNote[]>([])

const getNotes = async () => {
  const _notes = await notesStore.list(id.value)
  if (_notes) {
    notes.value = _notes
  }
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
