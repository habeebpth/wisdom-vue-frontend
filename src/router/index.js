import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import DonateForm from '@/views/DonateForm.vue'
import OfferForm from '@/views/OfferForm.vue'
import PaymentResponse from '@/views/PaymentResponse.vue'
import PaymentHistory from '@/views/PaymentHistory.vue'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/donate',
    name: 'Donate',
    component: DonateForm
  },
  {
    path: '/offer',
    name: 'Offer',
    component: OfferForm
  },
  {
    path: '/payment-response',
    name: 'PaymentResponse',
    component: PaymentResponse,
    props: route => ({ 
      status: route.query.status,
      transactionId: route.query.transactionId,
      amount: route.query.amount,
      date: route.query.date
    })
  },
  {
    path: '/payment-history',
    name: 'PaymentHistory',
    component: PaymentHistory
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Global navigation guard
router.beforeEach((to, from, next) => {
  // If user doesn't have info and trying to navigate away from home
  if (!store.state.user.hasUserInfo && to.name !== 'Home') {
    // Redirect to home with a query parameter indicating they need to enter info
    next({ name: 'Home', query: { showUserInfoModal: 'true' } })
  } else {
    next()
  }
})

export default router