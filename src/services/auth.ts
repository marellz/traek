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
  // profile
  return await supabase.from('users').select('*').eq('id', id)
}

const init = async () => {
  const {
    data: { user },
  } = await getUser()
  if (user) {
    // todo: get profile.
    getProfile(user.id)
  } else {
    return null
  }
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
  return await supabase
    .from('users')
    .upsert(form, {
      ignoreDuplicates: false,
      onConflict: 'id',
    })
    .select()
}

const checkUsername = async (username: string) => {
  return await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('username', username)
}

export default {
  init,
  getUser,
  getProfile,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
  updateProfile,
  checkUsername,
}
