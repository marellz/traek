<template>
  <ul class="test-sm flex space-x-2">
    <li v-for="{ label, key, completed, locked } in steps" :key>
      <a
        :href="`#${key}`"
        @click.prevent="goToStep(key)"
        class="flex flex-col text-sm"
        :class="{ 'font-medium': active === key }"
      >
        <div class="mb-2 flex items-center space-x-2 pr-8 pl-2" :class="{ 'opacity-50': locked }">
          <span class="">
            {{ label }}
          </span>
          <CheckCheck :size="16" v-if="completed" />
        </div>
        <span
          class="h-1 w-full rounded-full bg-slate-100"
          :class="{ '!bg-slate-900': completed, '!bg-slate-300': active === key }"
        ></span>
      </a>
    </li>
  </ul>
  <div class="mt-10">
    <template v-for="{ key } in steps" :key>
      <div v-show="active === key">
        <slot :name="key"></slot>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { CheckCheck } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export interface Step {
  key: string
  label: string
  locked?: boolean
  completed?: boolean
}

const props = defineProps<{
  steps: Step[]
  name: string
  default?: string
}>()

const emit = defineEmits(['update'])

const route = useRoute()
const router = useRouter()
const routeHash = computed(() => route.hash)
const active = ref(props.steps[0].key)

const model = ref(props.steps)


const currentStep = computed(() => props.steps.find((s) => s.key === active.value))

const goToStep = (key: string) => {
  // const nextStep = props.steps.find((s) => s.key == key)

  if (!currentStep.value?.completed) {
    return
  }

  active.value = key
}

const nextStep = () => {
  const currentIndex = props.steps.findIndex((p) => p.key === active.value)


  model.value[currentIndex].completed = true
  goToStep(props.steps[currentIndex + 1].key)
}

watch(model, () => {
  if (model.value) {
    localStorage.setItem(props.name, JSON.stringify(model.value))
  }
})

watch(
  active,
  (v) => {
    router.push(route.path+`#${v}`)

    emit('update', model.value)

    console.log('emitted update', model.value)
  },
  {
    deep: true,
    immediate: true,
  },
)

watch(
  routeHash,
  () => {
    const keys = props.steps.map((s) => s.key)
    if (keys.includes(routeHash.value)) {
      active.value = routeHash.value
    }
  },
  { immediate: true },
)

defineExpose({
  nextStep,
  goToStep,
})
</script>
