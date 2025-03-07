import { supabase } from '@/database/supabase'
import type { ProjectNoteForm } from '@/stores/notes'

export const useNotesService = () => {
  const list = async (project: string) => {
    return await supabase.from('notes').select('*, created_by(*)').eq('project_id', project).order('created_at', { ascending: false})
  }

  const get = async (id: string) => {
    return await supabase.from('notes').select('*, created_by(*)').eq('id', id)
  }

  const create = async (form: ProjectNoteForm) => {
    return await supabase.from('notes').insert(form).select('*, created_by(*)')
  }

  const update = async (id: string, form: ProjectNoteForm) => {
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
    destroy,
  }
}
