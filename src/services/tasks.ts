import { supabase } from '@/database/supabase'
import type { TaskForm, TaskStatusForm } from '@/stores/task'
export type TasksListCriteria = 'project_id' | 'creator' | 'assigned'

export const useTaskService = () => {
  const getMyTasks = async (user: string) => {
    return await supabase.from('tasks').select('*').eq('created_by', user)
  }

  const getProjectTasks = async (project: string) => {
    return await supabase
      .from('tasks')
      .select(
        `*,
        created_by: users (id, name, email, username, avatar_url),
        task_assignees(...users(id, name, email, username, avatar_url))`,
      )
      .eq('project_id', project)
      .order('due_date', { ascending: true })
  }

  const create = async (form: TaskForm) => {
    return await supabase.from('tasks').insert(form).select()
  }

  const get = async (id: string) => {
    return await supabase
      .from('tasks')
      .select(
        `*,
        created_by: users (id, name, email, username, avatar_url),
        task_assignees(...users(id, name, email, username, avatar_url))`,
      )
      .eq('id', id)
  }

  const update = async (id: string, form: TaskForm) => {
    return await supabase.from('tasks').update(form).eq('id', id)
  }

  const updateStatus = async (id: string, payload: TaskStatusForm) => {
    return await supabase.from('tasks').update(payload).eq('id', id)
  }

  const destroy = async (id: string) => {
    return await supabase.from('tasks').delete().eq('id', id)
  }

  /**
   * ASSIGNEES
   */

  const getAssignees = async (task: string) => {
    return await supabase.from('task_assignees').select('*').eq('task_id', task)
  }

  const addAssignees = async (payload: { user_id: string; task_id: string }[]) => {
    return await supabase.from('task_assignees').insert(payload).select()
  }

  const removeAssignee = async (task: string, user_id: string) => {
    return await supabase.from('task_assignees').delete().eq('task_id', task).eq('user_id', user_id)
  }

  return {
    create,
    getMyTasks,
    getProjectTasks,
    get,
    update,
    updateStatus,
    destroy,

    //
    getAssignees,
    addAssignees,
    removeAssignee,
  }
}
