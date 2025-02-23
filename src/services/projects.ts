import type { ProjectForm, PartialProjectForm } from '@/stores/project'
import collectionService from './collection'
import { Permission, Role } from 'appwrite'

export const useProjectService = () => {
  const collectionId = import.meta.env.VITE_APPWRITE_PROJECTS
  const projectsCollection = new collectionService(collectionId)

  const list = async () => {
    return await projectsCollection.list()
  }

  const get = async (id: string) => {
    return await projectsCollection.get(id)
  }

  const create = async (form: ProjectForm) => {
    let permissions = [
      Permission.read(Role.any()),
      Permission.write(Role.any()),
    ]

    if(form.creator){
      permissions = [
        ...permissions,
        Permission.update(Role.user(form.creator)),
        Permission.delete(Role.user(form.creator)),
      ]
    }

    return await projectsCollection.create(form, permissions)
  }

  const update = async (id: string, form: PartialProjectForm) => {
    return await projectsCollection.update(id, form)
  }

  return {
    get,
    list,
    create,
    update,
  }
}
