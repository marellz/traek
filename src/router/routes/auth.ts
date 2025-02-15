export default [
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
]
