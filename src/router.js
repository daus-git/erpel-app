import { createRouter, createWebHistory } from 'vue-router'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Dashboard from './views/Dashboard.vue'
import Cart from './views/Cart.vue'
import PaymentGateway from './views/PaymentGateway.vue'
import Account from './views/Account.vue'
import History from './views/History.vue'
import CheckIn from './views/CheckIn.vue'
import AdminDashboard from './views/AdminDashboard.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/payment-gateway',
    name: 'PaymentGateway',
    component: PaymentGateway
  },
  {
    path: '/account',
    name: 'Account',
    component: Account
  },
  {
    path: '/history',
    name: 'History',
    component: History
  },
  {
    path: '/checkin',
    name: 'CheckIn',
    component: CheckIn
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
