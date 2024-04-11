import { createRouter, createWebHistory } from 'vue-router'
import IndexProductsView from '@/views/IndexProductsView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/empty',
      component: HomeView,
      children: [
        {
          path: '/',
          name: 'index',
          component: IndexProductsView
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue')
        },
        {
          path: '/detail/:id',
          name: 'product-detail',
          component: () => import('../views/ProductDetailView.vue')
        },
        {
          path: '/checkout',
          name: 'checkout',
          component: () => import('../views/CheckoutView.vue')
        },
        {
          path: '/success',
          name: 'success',
          component: () => import('../views/SuccessView.vue')
        }
      ]
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
