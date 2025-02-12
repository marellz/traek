import { Client, Account, Databases } from 'appwrite'

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID
const client = new Client()
client.setProject(projectId)
export const account = new Account(client)
export const databases = new Databases(client)
