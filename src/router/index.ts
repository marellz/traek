import { createRouter, createWebHistory, type RouteRecordNameGeneric } from 'vue-router'
import Home from '@/views/index.vue'
import dashboardRoutes from './routes/dashboard'
import authRoutes from './routes/auth'
import projectRoutes from './routes/projects'
import userRoutes from './routes/user'
import homeRoutes from './routes/home'
import testRoutes from './routes/test'

import { useAuthStore } from '@/stores/auth'

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
    ...projectRoutes,
    ...userRoutes,

    // other
    ...homeRoutes,
    ...testRoutes
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const guestOnlyRoutes: RouteRecordNameGeneric[] = [
    'login',
    'register',
    'forgot-password',
    'update-password',
  ]
  const noAuthRoutes: RouteRecordNameGeneric[] = ['home', ...guestOnlyRoutes]

  if (!noAuthRoutes.includes(to.name) && !auth.isAuthenticated) next({ name: 'login' })
  else if (guestOnlyRoutes.includes(to.name) && auth.isAuthenticated) next({ name: 'home' })
  else next()
})

export default router
