import { createRouter, createWebHistory } from 'vue-router'
import IndexProductsView from '@/views/IndexProductsView.vue'
import HomeView from '@/views/HomeView.vue'

export const routes = [
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
        path: '/afterpay',
        name: 'afterpay',
        component: () => import('../views/AfterpayView.vue')
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
      },
      {
        path: '/failure',
        name: 'failure',
        component: () => import('../views/FailureView.vue')
      },
      {
        path: '/cart',
        name: 'cart',
        component: () => import('../views/CartView.vue')
      },
      {
        path: '/ga',
        name: 'google-apple-pay',
        component: () => import('@/views/GoogleApplePayView.vue')
      },
      {
        path: '/order',
        name: 'order',
        component: () => import('@/views/OrderView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    return {  top: 0 }
  }
})

export default router
