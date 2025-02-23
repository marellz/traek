export default [
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
]
