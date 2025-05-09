<template>
  <div class="h-screen  dark:bg-black dark:text-white">
    <div class="grid grid-cols-2 gap-10">
      <div class="p-12 min-h-screen">
        <div class="bg-slate-100 dark:bg-slate-200/10 h-full rounded-xl flex flex-col">
          <div class="flex justify-left p-12">
            <Logo class="h-8" />
          </div>
          <div class="mt-auto pb-4">
            <ul class="px-8 relative overflow-hidden">
              <li v-for="(testimonial,i) in testimonials" :key="i">
                <div v-show="i === index" v-motion-fade-visible class="flex items-center space-x-2 p-2">
                  <img class="h-10 w-10 rounded-full" :src="testimonial.avatar" :alt="testimonial.user">
                  <div>
                    <h4 class="text-sm font-medium">{{ testimonial.user }}</h4>
                    <p class="text-xs text-slate-400">{{ testimonial.role }}</p>
                    <div class="mt-2">
                      <p class="text-sm">{{ testimonial.content }}</p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <div class="flex flex-col h-full pb-20 mx-auto max-w-lg">
          <div class="flex justify-end pt-12">
            <DarkMode></DarkMode>
          </div>
          <div class="mx-2 py-20">
            <slot />
          </div>
          <div class="mt-auto">
            <router-link :to="{ name: 'home' }"
              class="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-black">
              <ArrowLeft :size="20" />
              <span>Back to home</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Logo from '@/assets/images/logo.vue';
import DarkMode from '@/components/app/dark-mode.vue';
import { testimonials } from '@/data/home.test.data';
import { ArrowLeft } from 'lucide-vue-next';
import {  onMounted, ref } from 'vue';

const interval = ref()
const index = ref<number>(0)
onMounted(() => {
  interval.value = setInterval(() => {
    const len = testimonials.length
    if (index.value === (len - 1)) index.value = 0
    else index.value++
  }, 5000)
})

</script>
