import { supabase } from '@/database/supabase'
import type { UserProfile } from '@/stores/auth'

export interface AuthPayload {
  email: string
  password: string
}

const getUser = async () => {
  return await supabase.auth.getUser()
}

const getProfile = async (id: string) => {
  return await supabase.from('users').select('*').eq('id', id)
}

const login = async (credentials: AuthPayload) => {
  return await supabase.auth.signInWithPassword(credentials)
}

const register = async (credentials: AuthPayload) => {
  return await supabase.auth.signUp(credentials)
}

const logout = async () => {
  return await supabase.auth.signOut()
}

const resetPassword = async (email: string) => {
  const url = import.meta.env.VITE_APP_URL
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${url}/update-password`,
  })
}

const updatePassword = async (password: string) => {
  return await supabase.auth.updateUser({
    password,
  })
}

const updateProfile = async (id: string, form: UserProfile) => {
  return await supabase.from('users').update(form).eq('id', id)
}

const checkUsername = async (username: string) => {
  return await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('username', username)
}

const queryUsers = async (params: { query: string }) => {
  const { query } = params
  const matchesQuery = ['name', 'email', 'username'].map((c) => `${c}.ilike.%${query}%`).join(',')
  return await supabase.from('users').select().or(matchesQuery)
}

const getProfiles = async (list: string[], column: string = 'id') => {
  return await supabase.from('users').select().in(column, list)
}

export default {
  getUser,
  getProfile,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
  updateProfile,
  checkUsername,
  queryUsers,
  getProfiles,
}
