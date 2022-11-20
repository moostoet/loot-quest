import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: async () => { return await import('../views/Home.vue') }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
