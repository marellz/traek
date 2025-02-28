import { createRouter, createWebHistory, type RouteRecordNameGeneric } from 'vue-router'
import Home from '@/views/index.vue'

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

    /**
     *
     *
     * AUTHENTICATION
     *
     *
     */
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/login.vue'),
      meta: {
        layout: 'auth',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/register.vue'),
      meta: {
        layout: 'auth',
      },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/auth/forgot-password.vue'),
      meta: {
        layout: 'auth',
      },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/reset-password.vue'),
      meta: {
        layout: 'auth',
      },
    },

    /**
     *
     *
     * DASHBOARD
     *
     *
     */

    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index.vue'),
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/views/tasks/index.vue'),
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/views/calendar/index.vue'),
    },

    /**
     *
     *
     * PROJECT ROUTES
     *
     *
     */

    {
      path: '/projects/',
      name: 'projects',
      // default projects page is tasks
      component: () => import('@/views/projects/index.vue'),
    },
    {
      path: '/projects/view/:id',
      // default projects page is tasks
      component: () => import('@/views/projects/view/[id].vue'),
      children: [
        {
          path: '', // overview -> default
          name: 'project',
          component: () => import('@/views/projects/view/[id]/index.vue'),
        },
        {
          path: 'tasks',
          name: 'project-tasks',
          component: () => import('@/views/projects/view/[id]/tasks.vue'),
        },
        {
          path: 'members',
          name: 'project-members',
          component: () => import('@/views/projects/view/[id]/members.vue'),
        },
        {
          path: 'events',
          name: 'project-events',
          component: () => import('@/views/projects/view/[id]/events.vue'),
        },
        {
          path: 'about',
          name: 'project-about',
          component: () => import('@/views/projects/view/[id]/about.vue'),
        },
      ],
    },

    {
      path: '/projects/new',
      name: 'create-project',
      component: () => import('@/views/projects/create.vue'),
    },
    {
      path: '/projects/update/:id',
      name: 'update-project',
      component: () => import('@/views/projects/update.vue'),
    },

    /**
     *
     *
     * USER PROFILE/SETTING ROUTES
     *
     *
     */

    {
      name: 'user-profile',
      path: '/profile/:id',
      component: () => import('@/views/profile/[id].vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const guestOnlyRoutes: RouteRecordNameGeneric[] = [
    'login',
    'forgot-password',
    'update-password',
  ]
  const noAuthRoutes: RouteRecordNameGeneric[] = ['home', 'register', ...guestOnlyRoutes]

  if (!noAuthRoutes.includes(to.name) && !auth.isAuthenticated) next({ name: 'login' })
  else if (guestOnlyRoutes.includes(to.name) && auth.isAuthenticated) next({ name: 'home' })
  else next()
})

export default router
