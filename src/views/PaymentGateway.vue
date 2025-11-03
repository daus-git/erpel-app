<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
          <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Payment Gateway
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Bayar deposit 40% untuk layanan salon
        </p>
      </div>

      <div class="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
        <div class="space-y-6">
          <!-- Order Summary -->
          <div class="border-b border-gray-200 pb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Ringkasan Pesanan</h3>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Deposit Layanan (40%)</span>
                <span class="font-medium">Rp {{ depositAmount.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Sisa Bayar di Toko</span>
                <span class="font-medium">Rp {{ remainingAmount.toLocaleString() }}</span>
              </div>
              <div class="border-t border-gray-200 pt-2">
                <div class="flex justify-between text-lg font-bold">
                  <span>Total Bayar Sekarang</span>
                  <span class="text-blue-600">Rp {{ depositAmount.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Form -->
          <form @submit.prevent="processPayment" class="space-y-6">
            <div>
              <label for="cardNumber" class="block text-sm font-medium text-gray-700">
                Nomor Kartu
              </label>
              <div class="mt-1 relative">
                <input
                  id="cardNumber"
                  v-model="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4h16v16H4z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="expiryDate" class="block text-sm font-medium text-gray-700">
                  Tanggal Kadaluarsa
                </label>
                <input
                  id="expiryDate"
                  v-model="expiryDate"
                  type="text"
                  placeholder="MM/YY"
                  class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label for="cvv" class="block text-sm font-medium text-gray-700">
                  CVV
                </label>
                <input
                  id="cvv"
                  v-model="cvv"
                  type="text"
                  placeholder="123"
                  class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label for="cardHolder" class="block text-sm font-medium text-gray-700">
                Nama Pemegang Kartu
              </label>
              <input
                id="cardHolder"
                v-model="cardHolder"
                type="text"
                placeholder="JOHN DOE"
                class="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div class="flex items-center">
              <input
                id="saveCard"
                v-model="saveCard"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="saveCard" class="ml-2 block text-sm text-gray-900">
                Simpan informasi kartu untuk pembayaran selanjutnya
              </label>
            </div>

            <button
              type="submit"
              :disabled="isProcessing"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isProcessing" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </span>
              <span v-else>
                Bayar Rp {{ depositAmount.toLocaleString() }}
              </span>
            </button>
          </form>

          <div class="text-center">
            <button @click="$router.go(-1)" class="text-sm text-gray-600 hover:text-gray-900">
              ← Kembali ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { showSuccess, showError } from '@/utils/sweetAlert'

export default {
  name: 'PaymentGateway',
  data() {
    return {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolder: '',
      saveCard: false,
      isProcessing: false,
      depositAmount: 0,
      remainingAmount: 0
    }
  },
  mounted() {
    // Get payment data from localStorage or route params
    const paymentData = JSON.parse(localStorage.getItem('salon-payment-data') || '{}')
    this.depositAmount = paymentData.depositAmount || 0
    this.remainingAmount = paymentData.remainingAmount || 0

    // If no payment data, redirect back to cart
    if (!paymentData.cartItems || paymentData.cartItems.length === 0) {
      this.$router.push('/cart')
      return
    }

    // Calculate total for products-only carts
    if (!this.depositAmount) {
      const total = paymentData.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      this.depositAmount = total
      this.remainingAmount = 0
    }
  },
  methods: {
    async processPayment() {
      this.isProcessing = true

      // Simulate payment processing
      try {
        // Fake API call delay
        await new Promise(resolve => setTimeout(resolve, 3000))

        // Simulate success (90% success rate)
        const isSuccess = Math.random() > 0.1

        if (isSuccess) {
          // Payment successful
          showSuccess(`Pembayaran Berhasil!`, `Deposit Rp ${this.depositAmount.toLocaleString()} telah dibayar. Sisa pembayaran Rp ${this.remainingAmount.toLocaleString()} akan dibayar di toko.`)

          // Clear cart and redirect
          localStorage.removeItem('salon-cart')
          localStorage.removeItem('salon-payment-data')
          this.$router.push('/dashboard')
        } else {
          // Payment failed
          showError('Pembayaran Gagal', 'Pembayaran gagal. Silakan coba lagi atau gunakan kartu lain.')
        }
      } catch (error) {
        showError('Terjadi Kesalahan', 'Terjadi kesalahan. Silakan coba lagi.')
      } finally {
        this.isProcessing = false
      }
    }
  }
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
