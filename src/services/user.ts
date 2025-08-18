import { supabase } from '@/database/supabase'

export const useUserService = () => {
  const getProfile = async (id: string, column: string) => {
    return await supabase.from('users').select().eq(column, id)
  }

  const getProfiles = async (list: string[], column: string = 'id') => {
    return await supabase.from('users').select().in(column, list)
  }

  const checkUsername = async (username: string) => {
    return await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('username', username)
  }

  const queryUsers = async (params: { query: string; limit: number }) => {
    const { query } = params
    const matchesQuery = ['name', 'email', 'username'].map((c) => `${c}.ilike.%${query}%`).join(',')
    return await supabase.from('users').select().or(matchesQuery).limit(params.limit)
  }

  return {
    getProfile,
    getProfiles,
    checkUsername,
    queryUsers,
  }
}
