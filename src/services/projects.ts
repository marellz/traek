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

  const getStats = async(id: string) => {
    return await supabase.from('projects').select().eq('id', id);
  }

  const create = async (form: ProjectForm) => {
    return await supabase.from('projects').insert(form).select()
  }

  const update = async (id: string, form: ProjectForm) => {
    return await supabase.from('projects').insert(form).eq('id', id)
  }

  /**
   * MEMBERS
   */

  const addMembers = async (payload: {user_id: string, project_id: string}[]) => {
    return await supabase.from('project_members').insert(payload)
  }

  const getMembers = async (project: string) => {
    return await supabase.from('project_members').select('').eq('project_id', project)
  }

  const removeMember = async (user_id: string, project_id: string) => {
    return await supabase.from('project_members').delete().eq('user_id', user_id).eq('project_id', project_id)
  }


  return {
    get,
    getStats,
    list,
    create,
    update,

    //
    addMembers,
    getMembers,
    removeMember
  }
}
