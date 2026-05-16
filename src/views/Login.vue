<template>
  <div class="min-h-screen bg-salon-base flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
          <img src="@/assets/logo.png" alt="SalonApp Logo" class="h-12 w-12 rounded-lg" />
        </div>
        <h2 class="text-3xl font-bold text-salon-text mb-2 font-heading">
          Welcome Back
        </h2>
        <p class="text-salon-accent2 font-body">Sign in to your account to continue</p>
      </div>

      <form class="space-y-6" @submit.prevent="login">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div class="relative">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter your email"
                v-model="email"
              >
              <svg class="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
              </svg>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter your password"
                v-model="password"
              >
              <svg class="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <router-link to="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              Forgot password?
            </router-link>
          </div>
        </div>

          <button
            type="submit"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-salon-accent1 to-salon-highlight hover:from-salon-accent1/80 hover:to-salon-highlight/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salon-accent1 transform transition-all duration-200 hover:scale-105 font-body"
          >
          <span class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          <span v-if="!isLoading">Sign In</span>
          <span v-else class="opacity-0">Sign In</span>
        </button>
      </form>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            Sign up now
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { showWarning, showError, showSuccess } from '../utils/sweetAlert'
import { login as apiLogin } from '../services/apiService'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      isLoading: false
    }
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  methods: {
    async login() {
      if (!this.email || !this.password) {
        showWarning('Data Tidak Lengkap', 'Silakan masukkan email dan password')
        return
      }

      this.isLoading = true

      try {
        const result = await apiLogin({ email: this.email, password: this.password })
        const token = result.token || result?.data?.token

        // Simpan token dan user info minimal ke localStorage
        if (token) localStorage.setItem('authToken', token)
        const userPayload = result?.user || result?.data?.user || {}
        localStorage.setItem('currentUser', JSON.stringify({
          id: userPayload.id || userPayload.user_id || null,
          email: this.email,
          name: userPayload.name || this.email.split('@')[0],
          phone: userPayload.phone || '',
          level: userPayload.role || userPayload.level || 'user'
        }))

        showSuccess('Login Berhasil', 'Anda berhasil masuk.')

        // Redirect based on role
        const level = result?.user?.role || 'user'
        if (level === 'admin') {
          this.router.push('/admin')
        } else if (level === 'staff' || level === 'employee') {
          this.router.push('/staff')
        } else {
          this.router.push('/dashboard')
        }
      } catch (error) {
        const message = error?.body?.message || error.message || 'Email atau password salah'
        showError('Login Gagal', message)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
