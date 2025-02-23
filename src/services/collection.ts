import { databases } from '@/database/appwrite'
import { ID } from 'appwrite'

class collectionService {
  readonly db: string
  collection: string

  constructor(collection: string) {
    this.db = import.meta.env.VITE_APPWRITE_DB
    this.collection = collection
  }

  list = async (queries: Array<string> = []) => {
    return await databases.listDocuments(this.db, this.collection, queries)
  }

  get = async (id: string, queries: string[] = []) => {
    return await databases.getDocument(this.db, this.collection, id, queries)
  }

  create = async (form: Record<string, any>, permissions: string[] = []) => {
    console.log(permissions)
    return await databases.createDocument(this.db, this.collection, ID.unique(), form, permissions)
  }

  update = async (id: string, form: Record<string, any>) => {
    return await databases.updateDocument(this.db, this.collection, id, form)
  }

  destroy = async (id: string) => {
    return await databases.deleteDocument(this.db, this.collection, id)
  }
}

export default collectionService
