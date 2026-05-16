<template>
  <nav class="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 w-full z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <!-- Logo -->
            <img src="@/assets/logo.png" alt="SalonApp Logo" class="h-12 w-12 mr-4 rounded-lg" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Account, Cart, History, Check-in buttons -->
          <router-link to="/account" class="p-2 text-gray-600 hover:text-salon-accent1 transition-colors duration-200">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </router-link>
          <router-link to="/cart" class="p-2 text-gray-600 hover:text-salon-accent1 transition-colors duration-200 relative">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3"></path>
            </svg>
            <span v-if="cartItemCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{{ cartItemCount }}</span>
          </router-link>
          <router-link to="/history" class="p-2 text-gray-600 hover:text-salon-accent1 transition-colors duration-200">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'DashboardHeader',

  computed: {
    currentUser() {
      const user = localStorage.getItem('currentUser')
      return user ? JSON.parse(user) : {}
    },
    userInitial() {
      return this.currentUser && this.currentUser.name ? this.currentUser.name.charAt(0).toUpperCase() : 'U'
    },
    cartItemCount() {
      const cart = JSON.parse(localStorage.getItem('salon-cart') || '[]')
      return cart.reduce((total, item) => total + item.quantity, 0)
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('currentUser')
      this.$router.push('/login')
    }
  }
}
</script>
