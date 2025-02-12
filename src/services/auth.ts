import { account } from '@/database/appwrite'
import { ID } from 'appwrite'

export interface AuthPayload {
  email: string
  password: string
}

const init = async () => {
  return await account.get()
}

const login = async ({ email, password }: AuthPayload) => {
  return await account.createEmailPasswordSession(email, password)
}

const register = async ({ email, password }: AuthPayload) => {
  return account.create(ID.unique(), email, password)
}

const logout = async () => {
  return await account.deleteSession('current')
}

const resetPassword = async (email: string) => {
  console.log(email)
}

const updatePassword = async (password: string) => {
  console.log('updating password', password)
}

export default {
  init,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
}
