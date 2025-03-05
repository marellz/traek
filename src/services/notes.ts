import { supabase } from "@/database/supabase"
import type { ProjectNote, ProjectNoteForm } from "@/stores/notes"

export const useNotesService = () => {
  const list = async (project:string) => {
    return await supabase.from('notes').select().eq('project_id', project)
  }

  const get = async (id: string) => {
    return await supabase.from('notes').select().eq('id', id)
  }

  const create = async (form: ProjectNoteForm) => {
    return await supabase.from('notes').insert(form)
  }

  const update = async (id: string, form: ProjectNote) => {
    return await supabase.from('notes').update(form).eq('id', id)
  }

  const destroy = async (id: string) => {
    return await supabase.from('notes').delete().eq('id', id)
  }

  return {
    list,
    get,
    create,
    update,
    destroy
  }
}
