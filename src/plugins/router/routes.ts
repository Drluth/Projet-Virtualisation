export const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'home',
        component: () => import('@/pages/account-settings.vue'),
      },
      // {
      //   path: 'typography',
      //   component: () => import('@/pages/typography.vue'),
      // },
      // {
      //   path: 'icons',
      //   component: () => import('@/pages/icons.vue'),
      // },
      // {
      //   path: 'cards',
      //   component: () => import('@/pages/cards.vue'),
      // },
      // {
      //   path: 'tables',
      //   component: () => import('@/pages/tables.vue'),
      // },
      // {
      //   path: 'form-layouts',
      //   component: () => import('@/pages/form-layouts.vue'),
      // },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
      },
      {
        path: 'forgot',
        component: () => import('@/pages/forgot.vue'),
      },
      {
        path: 'opt',
        component: () => import('@/pages/opt.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
