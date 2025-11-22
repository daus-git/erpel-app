<template>
  <div class="min-h-screen bg-salon-base flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
          <img src="@/assets/logo.png" alt="SalonApp Logo" class="h-12 w-12 rounded-lg" />
        </div>
        <h2 class="text-3xl font-bold text-salon-text mb-2 font-heading">
          Lupa Password
        </h2>
        <p class="text-salon-accent2 font-body">Masukkan email untuk menerima link reset password</p>
      </div>

      <form class="space-y-6" @submit.prevent="submit">
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
              placeholder="Masukkan email kamu"
              v-model="email"
            >
            <svg class="absolute right-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
            </svg>
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
          <span v-if="!isLoading">Kirim Link Reset</span>
          <span v-else class="opacity-0">Kirim Link Reset</span>
        </button>
      </form>

      <div class="text-center">
        <router-link to="/login" class="text-sm text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
          Kembali ke Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { requestPasswordReset } from '../services/apiService'
import { showError, showSuccess, showWarning } from '../utils/sweetAlert'

export default {
  name: 'ForgotPasswordView',
  data() {
    return {
      email: '',
      isLoading: false
    }
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  methods: {
    async submit() {
      if (!this.email) {
        showWarning('Email wajib diisi', 'Silakan masukkan email yang terdaftar.')
        return
      }

      this.isLoading = true
      try {
        await requestPasswordReset(this.email)
        showSuccess('Berhasil', 'Link reset password telah dikirim ke email Anda.')
        this.router.push('/login')
      } catch (error) {
        const message = error?.body?.message || error.message || 'Gagal mengirim link reset password.'
        showError('Gagal', message)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
