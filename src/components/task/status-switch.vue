<template>
  <div>
    <dropdown>
      <template #trigger>
        <span class="flex items-center">
          <span>
            {{ TaskStatusLabels[model] }}
          </span>
          <ChevronDown :size="20" />
        </span>
      </template>
      <dropdown-item v-for="(status, key) in TaskStatusLabels" :key @click="promptSwitch(key)">
        <p class="flex">
          <span>
            {{ status }}
          </span>
          <Check v-if="key === model" :size="16"></Check>
        </p>
      </dropdown-item>
    </dropdown>
    <base-confirm v-model="confirmModalActive" @confirm="confirmSwitch"></base-confirm>
  </div>
</template>
<script lang="ts" setup>
import { TaskStatusLabels } from '@/data/task-data';
import type { TaskStatus } from '@/stores/task';
import { Check, ChevronDown } from 'lucide-vue-next';
import { ref } from 'vue';

const emit = defineEmits(['switch'])

const model = defineModel<TaskStatus>({ required: true })

const confirmModalActive = ref(false)

const promptStatus = ref<TaskStatus | null>(null)

const promptSwitch = (key: TaskStatus) => {
  if(key === model.value){
    return
  }

  promptStatus.value = key
  confirmModalActive.value = true
}

const confirmSwitch = () => {
  confirmModalActive.value = false
  emit('switch', promptStatus.value)
  model.value = promptStatus.value!
  promptStatus.value = null
}

</script>