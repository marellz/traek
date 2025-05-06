import { supabase } from '@/database/supabase'
import type { NewActivity } from '@/stores/activity'

export const useActivityService = () => {
  // get activity for a single project
  const getProjectActivity = async (project: string) => {
    return await supabase
      .from('activities')
      .select('*')
      .eq('project_id', project)
      .order('created_at', { ascending: false })
      .limit(10)
  }

  // get activity from a users projects
  const getUserProjectsActivities = async (user: string) => {
    return await supabase.from('activities').select('*').eq('user_id', user).range(0,9)
  }

  // get activity triggered by one single user
  const getUserActivity = async (user: string) => {
    return await supabase.from('activities').select('*').eq('user_id', user).range(0,9)
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
    logActivity,
  }
}
