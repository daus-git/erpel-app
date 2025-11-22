<template>
  <div class="min-h-screen bg-salon-base flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
          <img src="@/assets/logo.png" alt="SalonApp Logo" class="h-12 w-12 rounded-lg" />
        </div>
        <h2 class="text-3xl font-bold text-salon-text mb-2 font-heading">
          Reset Password
        </h2>
        <p class="text-salon-accent2 font-body">Masukkan password baru untuk akun Anda</p>
      </div>

      <form class="space-y-6" @submit.prevent="submit">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
            :value="email"
            disabled
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
          <input
            v-model="password"
            type="password"
            required
            autocomplete="new-password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
            placeholder="Masukkan password baru"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
          <input
            v-model="passwordConfirmation"
            type="password"
            required
            autocomplete="new-password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-gray-50 focus:bg-white"
            placeholder="Konfirmasi password baru"
          >
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
          <span v-if="!isLoading">Reset Password</span>
          <span v-else class="opacity-0">Reset Password</span>
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
import { useRouter, useRoute } from 'vue-router'
import { resetPassword } from '../services/apiService'
import { showError, showSuccess, showWarning } from '../utils/sweetAlert'

export default {
  name: 'ResetPasswordView',
  data() {
    return {
      email: '',
      token: '',
      password: '',
      passwordConfirmation: '',
      isLoading: false
    }
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    return { router, route }
  },
  mounted() {
    this.token = this.route.params.token
    this.email = this.route.query.email || ''
    if (!this.token || !this.email) {
      showWarning('Data tidak lengkap', 'Link reset password tidak valid.')
      this.router.push('/login')
    }
  },
  methods: {
    async submit() {
      if (!this.password || !this.passwordConfirmation) {
        showWarning('Data tidak lengkap', 'Masukkan password baru dan konfirmasi.')
        return
      }

      if (this.password !== this.passwordConfirmation) {
        showWarning('Password tidak sama', 'Konfirmasi password harus sama.')
        return
      }

      this.isLoading = true
      try {
        await resetPassword({
          token: this.token,
          email: this.email,
          password: this.password,
          passwordConfirmation: this.passwordConfirmation
        })
        showSuccess('Berhasil', 'Password berhasil direset. Silakan login.')
        this.router.push('/login')
      } catch (error) {
        const message = error?.body?.message || error.message || 'Gagal mereset password.'
        showError('Gagal', message)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
