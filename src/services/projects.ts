import type { ProjectForm } from '@/stores/project'
import { supabase } from '@/database/supabase'

export const useProjectService = () => {
  const list = async (user: string) => {
    const { data, error } = await supabase.from('project_members').select('*').eq('user_id', user)
    if (error) {
      throw 'Error on fetching projects'
    }
    const ids = data.map((d) => d.project_id)
    return await supabase.from('projects').select().in('id', ids)
  }

  const get = async (id: string) => {
    return await supabase.from('projects').select().eq('id', id)
  }

  const create = async (form: ProjectForm) => {
    return await supabase.from('projects').insert(form).select()
  }

  const update = async (id: string, form: ProjectForm) => {
    return await supabase.from('projects').insert(form).eq('id', id)
  }

  return {
    get,
    list,
    create,
    update,
  }
}
