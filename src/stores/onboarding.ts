import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useAuthStore } from './auth'
import { useProjectStore } from './project'

export enum OnboardingSteps {
  REGISTER = 'register',
  PROFILE = 'profile',
  PROJECTS = 'projects',
  FINISH = 'finish',
}

export const onboardingLinks = {
  [OnboardingSteps.REGISTER]: '/onboarding/',
  [OnboardingSteps.PROFILE]: '/onboarding/profile',
  [OnboardingSteps.PROJECTS]: '/onboarding/projects',
  [OnboardingSteps.FINISH]: '/onboarding/finish',
}

export type OnboardingStep = `${OnboardingSteps}`

export const useOnboardingStore = defineStore(
  'onboarding',
  () => {
    const auth = useAuthStore()
    const projectStore = useProjectStore()
    const stage = ref<OnboardingStep | null>(OnboardingSteps.PROFILE)
    const setStage = (newStage: OnboardingStep) => {
      stage.value = newStage
    }

    const nextStage = () => {
      const steps = ['register', 'profile', 'projects', 'finish'] as OnboardingStep[]
      const maxIndex = steps.length - 1
      const currentIndex = stage.value ? steps.indexOf(stage.value) : 0

      if (currentIndex === -1 || currentIndex >= maxIndex) {
        stage.value = null
        return null
      }

      setStage(steps[currentIndex + 1])
    }

    const evaluateCompletion = async () => {
      // 1. if user is not authenticated, send to register
      const isAuthenticated = auth.isAuthenticated

      if (!isAuthenticated) {
        stage.value = OnboardingSteps.REGISTER
        return
      }

      await projectStore.getUserProjects()

      // 2. Authenticated but profile is incomplete
      const userHasNameAndUserName =
        isAuthenticated && auth.profile?.username !== null && auth.profile?.name !== null
      //3. Profile complete but no projects.
      const userBelongsToAProject = projectStore.projects.length > 0

      if (!userHasNameAndUserName) {
        stage.value = OnboardingSteps.PROFILE
      } else if (!userBelongsToAProject) {
        stage.value = OnboardingSteps.PROJECTS
      } else {
        stage.value = OnboardingSteps.FINISH
      }
    }

    watch(
      () => auth.isAuthenticated,
      (hasAuth) => {
        // if user logs out their onboarding status is returned to null
        if (!hasAuth) {
          stage.value = null
        }
      },
    )

    return {
      stage,
      setStage,
      nextStage,

      evaluateCompletion,
    }
  },
  {
    persist: {
      storage: localStorage,
      pick: ['stage'],
    },
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOnboardingStore, import.meta.hot))
}
