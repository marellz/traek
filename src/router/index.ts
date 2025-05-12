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
     * ONBOARDING
     *
     *
     */

    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/views/onboarding/register.vue'),
      meta: {
        layout: 'onboarding',
      },
    },
    {
      path: '/onboarding/profile',
      name: 'onboarding-profile',
      component: () => import('@/views/onboarding/profile.vue'),
      meta: {
        layout: 'onboarding',
      },
    },
    {
      path: '/onboarding/projects',
      name: 'onboarding-projects',
      component: () => import('@/views/onboarding/project.vue'),
      meta: {
        layout: 'onboarding',
      },
    },
    {
      path: '/onboarding/finish',
      name: 'onboarding-finish',
      component: () => import('@/views/onboarding/finish.vue'),
      meta: {
        layout: 'onboarding',
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
          path: 'notes',
          name: 'project-notes',
          component: () => import('@/views/projects/view/[id]/notes.vue'),
        },
      ],
    },

    /**
     *
     *
     *
     * PROJECT FORM
     *
     *
     *
     */

    // new project
    {
      path: '/project/create',
      name: 'create-project',
      component: () => import('@/views/projects/form/basic.vue'),
      meta: {
        layout: 'project-form'
      }
    },

    // updated project: same component
    {
      path: "/project/form/:id/basic",
      name: "edit-project",
      component: () => import('@/views/projects/form/basic.vue'),
      meta: {
        layout: 'project-form'
      }
    },
    {
      path: '/projects/form/:id/about',
      name: 'project-form-about',
      component: () => import('@/views/projects/form/about.vue'),
    },
    {
      path: '/projects/form/:id/team',
      name: 'project-form-team',
      component: () => import('@/views/projects/form/team.vue'),
    },
    {
      path: '/projects/form/:id/review',
      name: 'project-form-review',
      component: () => import('@/views/projects/form/review.vue'),
    },

    /**
     *
     *
     * TASK
     *
     *
     */

    {
      path: '/tasks/view/:id',
      name: 'task',
      component: () => import('@/views/tasks/view.vue'),
    },
    {
      path: '/tasks/edit/:id',
      name: 'edit-task',
      component: () => import('@/views/tasks/form.vue'),
    },
    {
      path: '/tasks/new/:project',
      name: 'create-task',
      component: () => import('@/views/tasks/form.vue'),
    },

    /**
     *
     *
     * EVENT
     *
     *
     */
    {
      path: '/event/view/:id',
      name: 'event',
      component: () => import('@/views/events/view.vue'),
    },
    {
      path: '/event/edit/:id',
      name: 'edit-event',
      component: () => import('@/views/events/form.vue'),
    },
    {
      path: '/event/create/:project',
      name: 'create-event',
      component: () => import('@/views/events/form.vue'),
    },

    /**
     *
     *
     * USER PROFILE/SETTING ROUTES
     *
     *
     */

    {
      name: 'view-profile',
      path: '/user/:id',
      component: () => import('@/views/user/profile/id.vue'),
    },
    {
      name: 'edit-profile',
      path: '/update-profile',
      component: () => import('@/views/user/profile/update.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const guestOnlyRoutes: RouteRecordNameGeneric[] = [
    'login',
    'forgot-password',
    'reset-password',
    'onboarding',
  ]
  const noAuthRoutes: RouteRecordNameGeneric[] = ['home', 'register', ...guestOnlyRoutes]

  if (!noAuthRoutes.includes(to.name) && !auth.isAuthenticated) next({ name: 'login' })
  else if (guestOnlyRoutes.includes(to.name) && auth.isAuthenticated) next({ name: 'home' })
  else next()
})

export default router
