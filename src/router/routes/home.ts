export default [
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('@/views/tasks/index.vue'),
  },
  // {
  //   path: "/members",
  //   name:"members",
  //   component: () => import('@/views/members/index.vue')
  // },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('@/views/calendar/index.vue'),
  },
]
