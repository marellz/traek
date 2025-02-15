export default [
  {
    path: '/projects/',
    name: 'projects',
    // default projects page is tasks
    component: () => import('@/views/projects/index.vue'),
  },

  {
    path: '/projects/:id',
    // default projects page is tasks
    component: () => import('@/views/projects/[id].vue'),
    children: [
      {
        path: '', // overview -> default
        name: 'project',
        component: () => import('@/views/projects/[id]/index.vue'),
      },
      {
        path: 'tasks',
        name: 'project-tasks',
        component: () => import('@/views/projects/[id]/tasks.vue'),
      },
      {
        path: 'members',
        name: 'project-members',
        component: () => import('@/views/projects/[id]/members.vue'),
      },
      {
        path: 'events',
        name: 'project-events',
        component: () => import('@/views/projects/[id]/events.vue'),
      },
      {
        path: 'about',
        name: 'project-about',
        component: () => import('@/views/projects/[id]/about.vue'),
      },
    ],
  },
]
