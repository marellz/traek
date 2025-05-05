<template>
  <div class="py-4 md:py-10 mx-4 md:mx-10">
    <div class="rounded-4xl md:rounded-[60px] bg-primary/10 border-primary py-10 md:py-20">
      <div class="mx-auto max-w-4xl space-y-6 md:space-y-10 px-4">
        <div class="flex justify-center">
          <div class="bg-white rounded-full text-sm md:text-base p-2 md:p-4 flex items-center space-x-2"><span
              class="bg-primary h-4 w-4 rounded-full block"></span>
            <p>New updates in september</p>
            <Info :size="20" class="text-black/50" />
          </div>
        </div>
        <h1 class="text-2xl md:text-4xl font-semibold md:text-[80px] leading-tight text-center">
          Transform your Workflow with <span class="text-primary">Traek!</span>
        </h1>
        <p class="md:text-2xl text-black/50 text-center">
          A simple yet powerful project management tool for teams and individuals. Plan, collaborate,
          and track your progress—all in one place.
        </p>
        <div class="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-2 py-10">
          <template v-if="!auth.isAuthenticated">
            <router-link to="/register">
              <base-button class="md:!text-xl !font-normal !md:py-4 !md:px-8">
                <span>Get started for free</span>
                <MoveRight />
              </base-button>
            </router-link>
            <a href="#info"
              class="inline-flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-primary/10 hover:text-primary">
              <span> Learn more</span>
            </a>
          </template>
          <router-link v-else to="/dashboard">
            <base-button>
              <span>My projects</span>
            </base-button>
          </router-link>
        </div>

        <div class="border-2 border-primary/50 bg-white rounded-4xl p-8">
          <div class="grid md:grid-cols-2 gap-10">
            <div v-for="(item, index) in features" :key="index"
              class="flex flex-col items-center text-center md:border-r border-r-slate-200 last:border-r-0 nth-[2]:border-r-0 md:pr-10">
              <span class="px-10 py-4 border border-slate-200 rounded-full">
                <component :is="item.icon" />
              </span>
              <h1 class="font-bold mt-4">{{ item.title }}</h1>
              <p class="mt-2 text-black/50">{{ item.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container mx-auto">
      <div class="mt-20 grid md:grid-cols-3 gap-10 items-start">
        <div v-for="(item, index) in testimonials" :key="index" class="border border-primary/50 rounded-xl p-4 ">
          <p class="font-medium text-2xl md:text-4xl">"{{ item.title }}"</p>
          <p class="text-slate-500 mt-4 text-sm md:text-base">{{ item.content }}</p>
          <div class="flex items-center space-x-2 mt-4">
            <img :src="item.avatar" class="h-12 w-12 md:h-16 md:w-16 object-cover rounded-full border-2 border-black/30"
              alt="" />
            <div class="space-y-0.5">
              <p class="font-medium text-sm md:text-base "> {{ item.user }}</p>
              <p class="text-slate-500 text-xs md:text-sm"> {{ item.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { Blocks, Combine, ConciergeBell, Info, MoveRight, Route } from 'lucide-vue-next';

const auth = useAuthStore()

const features = [
  {
    icon: Blocks,
    title: 'Simple',
    content: 'Only what you need to keep the momentum going.'
  },
  {
    icon: Route,
    title: 'Minimal',
    content: 'Easy and straightforward to integrate with your teams.'
  },
  {
    icon: Combine,
    title: 'Cohesive',
    content: 'All tools in one place, no more scattered features.'
  },
  {
    icon: ConciergeBell,
    title: 'Practical',
    content: 'Designed for real teams, whatever your squad.'
  }
]


const testimonials = [
  {
    user: "Lena A.",
    avatar: 'https://i.pravatar.cc/100?img=38',
    role: "Product Designer, Creative Duo",
    title: "Traek made our side project feel like a real company.",
    content: "We started using it to plan weekly design sprints — now we track everything here. Tasks, notes, even the memes live inside Traek now.",
  },
  {
    user: "Derrick K.",
    avatar: 'https://i.pravatar.cc/100?img=59',
    role: "Community Organizer, CodeFor254",
    title: "My team actually uses it. Voluntarily.",
    content: "We’ve tried Trello, Asana, Notion… Traek’s the only one that didn’t get ghosted after a week. It’s simple, yet focused on what we actually need."
  },
  {
    user: "Meera S.",
    avatar: 'https://i.pravatar.cc/100?img=49',
    role: " Team Lead, Campus Dev Group",
    title: "One tool, one team, zero chaos.",
    content: "We run events, plan tasks, and share key notes without having to dig through endless chats. Traek keeps us grounded, especially when we’re juggling multiple projects.",
  },
]
</script>
