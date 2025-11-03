<template>
  <div class="min-h-screen bg-salon-base flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
          <img src="@/assets/logo.png" alt="SalonApp Logo" class="h-12 w-12 rounded-lg" />
        </div>
        <h2 class="text-3xl font-bold text-salon-text mb-2 font-heading">
          Create Account
        </h2>
        <p class="text-salon-accent2 font-body">Join us and start your journey</p>
      </div>

      <form class="space-y-6" @submit.prevent="register">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div class="relative">
              <input
                id="name"
                name="name"
                type="text"
                autocomplete="name"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter your full name"
                v-model="name"
              >
              <svg class="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div class="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                autocomplete="tel"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
                placeholder="Enter your phone number"
                v-model="phone"
              >
              <svg class="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
          </div>

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
                autocomplete="new-password"
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

        <div class="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          >
          <label for="terms" class="ml-2 block text-sm text-gray-700">
            I agree to the <a href="#" class="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a>
          </label>
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
          <span v-if="!isLoading">Create Account</span>
          <span v-else class="opacity-0">Create Account</span>
        </button>
      </form>

      <div class="text-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            Sign in here
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import users from '../data/users.json'
import { showWarning, showSuccess } from '@/utils/sweetAlert'

export default {
  name: 'RegisterView',
  data() {
    return {
      name: '',
      phone: '',
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
    async register() {
      if (!this.name || !this.phone || !this.email || !this.password) {
        showWarning('Data Tidak Lengkap', 'Silakan isi semua field')
        return
      }

      // Check if email already exists
      const existingUser = users.find(u => u.email === this.email)
      if (existingUser) {
        showWarning('Email Sudah Terdaftar', 'Email sudah terdaftar')
        return
      }

      this.isLoading = true

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Create new user
      const newUser = {
        id: users.length + 1,
        name: this.name,
        phone: this.phone,
        email: this.email,
        password: this.password
      }

      // In a real app, this would be an API call
      users.push(newUser)

      this.isLoading = false

      showSuccess('Akun Berhasil Dibuat', 'Akun berhasil dibuat! Silakan login.')
      this.router.push('/login')
    }
  }
}
</script>
