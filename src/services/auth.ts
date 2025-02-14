import { account } from '@/database/appwrite'
import { ID } from 'appwrite'

export interface AuthPayload {
  email: string
  password: string
}

const getUser = async () => {
  return await account.get()
}

const init = async () => {
  const session = await account.getSession('current')
  if (session) {
    return await getUser()
  } else {
    return null
  }
}

const login = async ({ email, password }: AuthPayload) => {
  return await account.createEmailPasswordSession(email, password)
}

const register = async ({ email, password }: AuthPayload) => {
  return account.create(ID.unique(), email, password)
}

const logout = async () => {
  await account.deleteSession('current')
}

const resetPassword = async (email: string) => {
  const url = import.meta.env.VITE_APP_URL
  return await account.createRecovery(email, url)
}

const updatePassword = async (id: string, secret: string, password: string) => {
  return await account.updateRecovery(
    id, // userId
    secret,
    password,
  )
}

export default {
  init,
  getUser,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
}
