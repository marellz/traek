import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ProjectLoading, useProjectStore, type Project } from './project'
import { formPages as pages } from '@/data/projects.data'

export const useProjectFormStore = defineStore(
  'projectForm',
  () => {
    const projectStore = useProjectStore()

    const id = ref<string | null>()
    const setId = (value: string | null) => {
      id.value = value
    }

    const route = useRoute()
    const nextPage = computed(() => {
      const currentIndex = pages.findIndex((p) => p.routeName === route.name)
      if (currentIndex === pages.length - 1 || id.value === null) return null
      return pages[currentIndex + 1].routeName
    })

    const project = ref<Project | null>(null)
    const setProject = (value: Project | null) => {
      project.value = value
    }

    const loading = computed(() => {
      return {
        getting: projectStore.isLoading(ProjectLoading.GETTING_ONE),
        updating: projectStore.isLoading(ProjectLoading.UPDATING),
        creating: projectStore.isLoading(ProjectLoading.CREATING),
      }
    })

    const getProject = async () => {
      if(!id.value) throw new Error('ID not defined')
      const _project = await projectStore.getProject(id.value)
      if (_project) setProject(_project)
    }

    watch(id, async (v) => {
      if (!v) {
        setProject(null)
      } else {
        getProject()
      }
    })

    return {
      id,
      setId,
      nextPage,

      //project
      project,
      setProject,
      getProject,

      //
      loading,
    }
  },
  {
    persist: {
      pick: ['id', 'project'],
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProjectFormStore, import.meta.hot))
}
