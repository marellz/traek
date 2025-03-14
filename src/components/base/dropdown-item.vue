<template>
  <li>
    <button type="button" @click.prevent="onClick"
      class="text-left whitespace-nowrap flex space-x-2 items-center text-sm font-medium px-4 py-1 hover:bg-slate-100 dark:hover:bg-slate-600 w-full">
      <slot />
    </button>
  </li>
</template>
<script lang="ts" setup>
import { inject } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  to?: string
}>()
const close = inject<() => void>('close')
const emit = defineEmits(['click'])
const router = useRouter()
const onClick = () => {
  if (props.to) {
    router.push(props.to)
  } else {
    emit('click')
  }

  if(close){
    close()
  }

}
</script>
