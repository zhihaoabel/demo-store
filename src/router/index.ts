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
        path: '/standard-checkout',
        name: 'standard-checkout',
        component: () => import('../views/checkout/CheckoutPaymentView.vue')
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
        path: '/order',
        name: 'order',
        component: () => import('@/views/OrderView.vue')
      },
      {
        path: '/sdk-checkout',
        name: 'sdk-checkout',
        component: () => import('@/views/js-sdk/SDKCheckOutView.vue')
      },
      {
        path: '/sdk-token',
        name: 'sdk-token',
        component: () => import('@/views/js-sdk/SDKTokenView.vue')
      },
      {
        path: '/sdk-subscription',
        name: 'sdk-subscription',
        component: () => import('@/views/js-sdk/SDKSubscriptionView.vue')
      },
      {
        path: '/local-payment',
        name: 'local-payment',
        component: () => import('@/views/direct-payment/LocalPaymentView.vue')
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
