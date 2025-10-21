<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
    <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
      <svg class="h-5 w-5 mr-2 text-salon-accent1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3"></path>
      </svg>
      Keranjang Belanja
    </h3>

    <!-- Cart Items Preview -->
    <div v-if="cartItems.length > 0" class="space-y-3 mb-4">
      <div v-for="item in cartItems.slice(0, 3)" :key="item.id" class="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
        <img :src="item.image" :alt="item.name" class="w-10 h-10 rounded-lg object-cover">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
          <p class="text-xs text-gray-600">{{ item.quantity }}x Rp {{ item.price.toLocaleString() }}</p>
        </div>
        <span class="text-sm font-bold text-salon-accent1">Rp {{ (item.price * item.quantity).toLocaleString() }}</span>
      </div>

      <div v-if="cartItems.length > 3" class="text-center">
        <span class="text-sm text-gray-500">+{{ cartItems.length - 3 }} item lainnya</span>
      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else class="text-center py-6">
      <svg class="h-12 w-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3"></path>
      </svg>
      <p class="text-sm text-gray-500">Keranjang kosong</p>
    </div>

    <!-- Cart Summary -->
    <div v-if="cartItems.length > 0" class="border-t border-gray-200 pt-4 space-y-2">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Subtotal</span>
        <span class="font-medium">Rp {{ subtotal.toLocaleString() }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Biaya Layanan</span>
        <span class="font-medium">Rp {{ serviceFee.toLocaleString() }}</span>
      </div>
      <div class="border-t border-gray-200 pt-2">
        <div class="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span class="text-salon-accent1">Rp {{ total.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 space-y-2">
      <router-link to="/cart" class="w-full bg-salon-accent1 hover:bg-salon-accent1/80 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg block text-center">
        Lihat Keranjang ({{ totalItems }})
      </router-link>
      <button v-if="cartItems.length > 0" class="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
        Checkout Sekarang
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartSummary',
  computed: {
    cartItems() {
      return JSON.parse(localStorage.getItem('salon-cart') || '[]')
    },
    subtotal() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    serviceFee() {
      return Math.round(this.subtotal * 0.05) // 5% service fee
    },
    total() {
      return this.subtotal + this.serviceFee
    },
    totalItems() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0)
    }
  }
}
</script>
