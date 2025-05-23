import type { PaginationRange } from '@/composables/usePagination'
import { supabase } from '@/database/supabase'
import type { Activity, ActivityQuery, NewActivity } from '@/stores/activity'

export const useActivityService = () => {
  // get activity for a single project
  const getProjectActivity = async (
    project: string,
    { start, end }: PaginationRange = { start: 0, end: 9 },
  ) => {
    return await supabase
      .from('activities')
      .select(
        `
        *,
        user: users(id,name, avatar),
        task: tasks(id, title, status),
        note: notes(id, title),
        event: events(id, title, datetime),
        project: projects(id, name)
        `,
      )
      .eq('project_id', project)
      .order('created_at', { ascending: false })
      .range(start, end)
  }

  // get activity from a users projects
  const getUserProjectsActivities = async (
    user: string,
    { start, end }: PaginationRange = { start: 0, end: 9 },
  ) => {
    const { data, error } = await supabase
      .from('project_members')
      .select('project_id')
      .eq('user_id', user)
    if (error) throw new Error(error.message)
    if(data.length === 0) return { data: [], error: null }
    const projects = data.map((project) => project.project_id)
    return await supabase
      .from('activities')
      .select(
        `
        *,
        user: users(id,name, avatar),
        task: tasks(id, title, status),
        note: notes(id, title),
        event: events(id, title, datetime),
        project: projects(id, name)
        `,
      )
      .in('project_id', projects)
      .order('created_at', { ascending: false })
      .range(start, end)
  }

  // get activity triggered by one single user
  const getUserActivity = async (
    user: string,
    { start, end }: PaginationRange = { start: 0, end: 9 },
  ) => {
    return await supabase
      .from('activities')
      .select(
        `
        *,
        user: users(id,name, avatar),
        task: tasks(id, title, status),
        note: notes(id, title),
        event: events(id, title, datetime),
        project: projects(id, name)
        `,
      )
      .eq('user_id', user)
      .order('created_at', { ascending: false })
      .range(start, end)
  }

  const getActivity = async (
    { task_id, note_id, event_id, type }: ActivityQuery,
    recent: boolean,
  ) => {
    const query = supabase.from('activities').select('*')

    if (task_id) query.eq('task_id', task_id)
    if (note_id) query.eq('note_id', note_id)
    if (event_id) query.eq('event_id', event_id)

    query.eq('type', type)

    // the activity happened in the last 4 hours
    if (recent) {
      const now = new Date()
      const yesterday = new Date(now.getTime() - 4 * 60 * 60 * 1000)
      query.gte('created_at', yesterday.toISOString())
      query.lte('created_at', now.toISOString()).limit(1).single()
    }

    query.order('created_at', { ascending: false })

    return await query
  }

  const updateActivity = async (id: string, _activity: Activity) => {
    return supabase.from('activities').update(_activity).eq('id', id)
  }

  // create a new activity based on other actions
  const logActivity = async (_activity: NewActivity) => {
    const activity = _activity
    // anticipated changes to activity
    return await supabase.from('activities').insert(activity).select('*')
  }

  return {
    getProjectActivity,
    getUserProjectsActivities,
    getUserActivity,
    updateActivity,
    logActivity,
    getActivity,
  }
}
