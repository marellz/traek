import type { ProjectForm } from '@/stores/project'
import { supabase } from '@/database/supabase'

export const useProjectService = () => {
  const list = async (user: string) => {
    return await supabase
      .from('project_members')
      .select(
        `*,
        ...projects(
            *,
            creator: created_by(id, name, email, username, avatar_url),
            members: project_members(...users(id, name, email, username, avatar_url))
          )`,
      )
      .eq('user_id', user)
  }

  const get = async (id: string) => {
    return await supabase
      .from('projects')
      .select(`*,
         creator: created_by(id, name, email, username, avatar_url),
         members: project_members(...users(id, name, email, username, avatar_url))`,
      )
      .eq('id', id)
  }

  const create = async (form: ProjectForm) => {
    return await supabase.from('projects').insert(form).select(`*, creator: created_by(id, name, email, username, avatar_url)`)
  }

  const update = async (id: string, form: ProjectForm) => {
    return await supabase.from('projects').update(form).eq('id', id)
  }

  /**
   * CUSTOM
   */

  const getStats = async (id: string) => {
    return await supabase
      .from('projects')
      .select(
        `*,
        creator: created_by(id, name, email, username, avatar_url),
        tasks(count),
        events(count),
        project_members(count),
        notes(count)`,
      )
      .eq('id', id)
  }

  /**
   * MEMBERS
   */

  const addMembers = async (payload: { user_id: string; project_id: string }[]) => {
    return await supabase.from('project_members').insert(payload)
  }

  const getMembers = async (project: string) => {
    return await supabase
      .from('project_members')
      .select('joined_at: created_at, ...users(id, name, email, username, avatar_url) ')
      .eq('project_id', project)
  }

  const removeMember = async (user_id: string, project_id: string) => {
    return await supabase
      .from('project_members')
      .delete()
      .eq('user_id', user_id)
      .eq('project_id', project_id)
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
    removeMember,
  }
}
