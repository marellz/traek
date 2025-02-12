import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/index.vue'
import dashboardRoutes from './dashboard'
import authRoutes from './auth'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        layout: 'home',
      },
    },

    // auth
    ...authRoutes,

    // dashboard
    ...dashboardRoutes,

    // other
  ],
})

export default router
