<template>
  <div class="fixed inset-0 bg-gray-50 flex items-center justify-center overflow-hidden">
    <div class="max-w-md w-full mx-4">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 text-center mb-6">Check-in QR Code</h1>
        <div class="flex justify-center mb-6">
          <div class="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            <!-- Dummy QR Code - in real app, use a QR code library -->
            <div class="text-center">
              <svg class="h-32 w-32 text-gray-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm5-2h6v6h-6V3zm2 2v2h2V5H12zm5-2h6v6h-6V3zm2 2v2h2V5h-2zM3 12h6v6H3v-6zm2 2v2h2v-2H5zm5-2h6v6h-6v-6zm2 2v2h2v-2h-2zm5-2h6v6h-6v-6zm2 2v2h2v-2h-2z"/>
              </svg>
              <p class="text-xs text-gray-500">QR Code</p>
            </div>
          </div>
        </div>
        <div class="text-center mb-6">
          <p class="text-sm text-gray-600 mb-4">Scan QR ini di counter salon</p>
          <div class="bg-gray-50 p-4 rounded-lg text-xs text-gray-800">
            <p><strong>Nama:</strong> {{ currentUser.name }}</p>
            <p><strong>Email:</strong> {{ currentUser.email }}</p>
            <p><strong>Order ID:</strong> {{ incompleteOrderId }}</p>
          </div>
        </div>
        <button @click="$router.push('/dashboard')" class="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-medium">
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckIn',
  computed: {
    currentUser() {
      const user = localStorage.getItem('currentUser')
      return user ? JSON.parse(user) : {}
    },
    incompleteOrderId() {
      if (!this.currentUser.email) return null

      const history = JSON.parse(localStorage.getItem('order-history') || '[]')
      const incompleteOrders = history.filter(order =>
        order.userId === this.currentUser.email &&
        (order.status === 'Pending Payment' || order.status === 'Processing' || order.status === 'Scheduled')
      )

      return incompleteOrders.length > 0 ? incompleteOrders[0].id : null
    }
  },
  mounted() {
    if (!this.currentUser.email) {
      this.$router.push('/login')
      return
    }

    if (!this.incompleteOrderId) {
      alert('Maaf, Anda belum memiliki pesanan yang belum selesai. Silakan buat pesanan terlebih dahulu.')
      this.$router.push('/dashboard')
    }
  }
}
</script>
