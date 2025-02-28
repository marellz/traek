import { supabase } from '@/database/supabase'
import type { TaskForm } from '@/stores/task'
export type TasksListCriteria = 'project_id' | 'creator' | 'assigned'

export const useTaskService = () => {

  const getMyTasks = async (user: string) => {
    return await supabase.from('tasks').select('*').eq('created_by', user)
  }

  const getAssignedTasks = async (user: string) => {
    return await supabase.from('task_assignees').select('*').eq('user_id', user)
  }

  const getProjectTasks = async (project: string) => {
    return await supabase.from('tasks').select('*').eq('project_id', project)
  }

  const create = async (form: TaskForm) => {
    return await supabase.from('tasks').insert(form).select()
  }

  const get = async (id: string) => {
    return await supabase.from('tasks').select().eq('id', id)
  }

  const update = async (id: string, form: TaskForm) => {
    return await supabase.from('tasks').update(form).eq('id', id)
  }

  const destroy = async (id: string) => {
    return await supabase.from('tasks').delete().eq('id', id)
  }

  return {
    create,
    getMyTasks,
    getAssignedTasks,
    getProjectTasks,
    get,
    update,
    destroy,
  }
}
