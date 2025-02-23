import type { TaskForm } from "@/stores/task"
import collectionService from "./collection"
import { ref } from "vue"
import { Permission, Role } from "appwrite"
export type TasksListCriteria = 'project_id' | 'creator' | 'assigned'
export const useTaskService = () => {
  const collectionId = import.meta.env.VITE_APPWRITE_TASKS
  const tasksCollection = new collectionService(collectionId)

  const list = async (id: string, criteria: TasksListCriteria ='project_id') => {
    const queries = ref([])
    switch (criteria) {
      case 'creator':
        queries.value.push(

        )
        break;
      case 'assigned':

        break;

      default:
        // project_idd
        break;
    }

    return await tasksCollection.list()
  }

  const create = async (form: TaskForm) => {
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
    return await tasksCollection.create(form, permissions)
  }

  const get = async (id: string) => {
    return await tasksCollection.get(id)
  }

  const update = async (id: string, form: TaskForm) => {
    return await tasksCollection.update(id, form)
  }

  const destroy = async (id: string) => {
    return await tasksCollection.destroy(id)
  }

  return {
    create,
    list,
    get,
    update,
    destroy
  }
}
