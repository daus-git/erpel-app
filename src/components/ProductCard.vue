<template>
  <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
    <div class="relative">
      <img :src="product.image" :alt="product.name" class="w-full h-48 object-cover">
      <div class="absolute top-4 right-4">
        <span class="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
          {{ product.category }}
        </span>
      </div>
    </div>
    <div class="p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-2">{{ product.name }}</h3>
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ product.description }}</p>
      <div class="flex items-center justify-between mb-4">
        <span class="text-2xl font-bold text-salon-accent1">Rp {{ product.price.toLocaleString() }}</span>
        <div class="flex items-center space-x-1">
          <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span class="text-sm text-gray-600">{{ product.rating }}</span>
        </div>
      </div>
      <div v-if="showQuantityControls" class="flex items-center space-x-2 mb-3">
        <button @click="decreaseQuantity" class="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" :disabled="displayQuantity === 0">
          <svg class="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
          </svg>
        </button>
        <span class="flex-1 text-center font-medium text-lg">{{ displayQuantity }}</span>
        <button @click="increaseQuantity" class="w-10 h-10 rounded-lg bg-salon-accent1 hover:bg-salon-accent1/80 text-white flex items-center justify-center transition-colors">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>
      </div>
      <button v-if="!showQuantityControls" @click="handleAddToCart" class="w-full bg-salon-accent1 hover:bg-salon-accent1/80 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
        Tambah ke Keranjang
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    },
    cartItems: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    currentCartQuantity() {
      return this.cartItems
        .filter(item => item.id === this.product.id && item.type === 'product')
        .reduce((total, item) => total + item.quantity, 0)
    },
    showQuantityControls() {
      return this.currentCartQuantity > 0
    },
    displayQuantity() {
      return this.currentCartQuantity || 0
    }
  },
  data() {
    return {
      quantity: 0
    }
  },
  methods: {
    increaseQuantity() {
      const newQuantity = this.displayQuantity + 1
      this.$emit('add-to-cart', this.product, newQuantity)
    },
    decreaseQuantity() {
      if (this.displayQuantity > 1) {
        const newQuantity = this.displayQuantity - 1
        this.$emit('add-to-cart', this.product, newQuantity)
      } else if (this.displayQuantity === 1) {
        this.$emit('add-to-cart', this.product, 0)
      }
    },
    handleAddToCart() {
      this.$emit('add-to-cart', this.product, 1)
    }
  }
}
</script>
