export default [
  {
    name: 'user-profile',
    path: '/profile/:id',
    component: () => import('@/views/profile/[id].vue'),
  },
]
