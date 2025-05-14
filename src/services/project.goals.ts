import { supabase } from '@/database/supabase'
import type { ProjectGoal, ProjectGoalForm } from '@/stores/project'
/**
 * GOALS
 */

export const useGoalService = () => {
  const getGoals = async (project: string) => {
    return await supabase.from('project_goals').select('*').eq('project_id', project)
  }

  const getGoal = async (id: string) => {
    return await supabase.from('project_goals').select('*').eq('id', id)
  }

  const createGoal = async (form: ProjectGoalForm) => {
    return await supabase.from('project_goals').insert(form).select()
  }

  const updateGoal = async (id: string, form: Partial<ProjectGoal>) => {
    return await supabase.from('project_goals').update(form).eq('id', id)
  }

  const deleteGoal = async (id: string) => {
    return await supabase.from('project_goals').delete().eq('id', id)
  }
  //

  return {
    getGoals,
    getGoal,
    createGoal,
    updateGoal,
    deleteGoal,
  }
}
