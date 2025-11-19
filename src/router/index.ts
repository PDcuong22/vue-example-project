import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import * as authService from '@/services/authService'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue'),
  },

  // tickets routes (không dùng Index.vue)
  {
    path: '/tickets',
    name: 'tickets.list',
    component: () => import('../views/tickets/TicketList.vue'),
  },
  {
    path: '/tickets/new',
    name: 'tickets.create',
    component: () => import('../views/tickets/TicketCreate.vue'),
  },
  {
    path: '/tickets/:id',
    name: 'tickets.detail',
    component: () => import('../views/tickets/TicketDetail.vue'),
    props: true,
  },
  {
    path: '/tickets/:id/edit',
    name: 'tickets.edit',
    component: () => import('../views/tickets/TicketEdit.vue'),
    props: true,
  },
  {
    path: '/login',
    name: 'auth.login',
    component: () => import('@/views/auth/AuthLogin.vue'),
    meta: { hideLayout: true },
  },
  {
    path: '/register',
    name: 'auth.register',
    component: () => import('@/views/auth/AuthRegister.vue'),
    meta: { hideLayout: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authService.isAuthenticated()) {
    return next({ name: 'auth.login' })
  }
  next()
})

export default router
