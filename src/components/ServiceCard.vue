<template>
  <div class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
    <div class="relative">
      <img :src="imageUrl" :alt="service.name" @error="onImageError" class="w-full h-48 object-cover" :key="imageUrl">
      <div class="absolute top-4 right-4">
        <span class="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
          {{ formatDuration(service.duration_minutes) }}
        </span>
      </div>
    </div>
    <div class="p-6">
      <h3 class="text-xl font-bold text-gray-900 mb-2">{{ service.name }}</h3>
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ service.description }}</p>
      <div class="flex items-center justify-between mb-4">
        <span class="text-2xl font-bold text-salon-accent1">Rp {{ service.price.toLocaleString() }}</span>
      <!-- Rating removed, not in API data -->
      <!-- <div class="flex items-center space-x-1">
        <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span class="text-sm text-gray-600">{{ service.rating }}</span>
      </div> -->
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
      <button v-if="!showQuantityControls" @click="handleBookService" class="w-full bg-salon-accent1 hover:bg-salon-accent1/80 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
        Pesan Sekarang
      </button>

      <!-- Removal Modal -->
      <div v-if="showRemovalModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Pilih Booking untuk Dihapus</h3>
          <select v-model="selectedRemoval" class="w-full p-2 border border-gray-300 rounded-lg mb-4">
            <option value="">Pilih booking...</option>
            <option v-for="option in removalOptions" :key="option.id" :value="option.id">
              {{ option.label }}
            </option>
          </select>
          <div class="flex space-x-2">
            <button @click="confirmRemoval" :disabled="!selectedRemoval" class="flex-1 bg-salon-accent1 hover:bg-salon-accent1/80 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50">
              Hapus
            </button>
            <button @click="closeRemovalModal" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-medium">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServiceCard',
  props: {
    service: {
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
        .filter(item => typeof item.id === 'string' && item.id.startsWith(`${this.service.id}-`) && item.type === 'service')
        .reduce((total, item) => total + item.quantity, 0)
    },
    imageUrl() {
      // Handle backend image_url (absolute → proxy path) or legacy image
      let url = this.service.image_url || this.service.image || ''
      
      // Convert absolute backend URLs to Vue proxy paths (/storage/* → backend:8000)
      if (url) {
        url = url.replace(/^https?:\/\/[^/]+/, '')
        console.log(`ServiceCard ${this.service.name} image:`, url)
      }
      
      // Legacy image handling (if relative path)
      if (!url.startsWith('http') && url) {
        if (url.startsWith('/storage') || url.startsWith('/images')) {
          url = `/storage${url.startsWith('/storage') ? '' : '/images/' + url}`
        } else {
          url = `/storage/${url}`
        }
      }
      
      // Smart defaults based on service name if no image
      if (!url) {
        const name = this.service.name?.toLowerCase() || ''
        if (name.includes('hair') || name.includes('cut')) url = '/images/haircut&styling.jpg'
        else if (name.includes('facial')) url = '/images/facialtreatment.jpg'
        else if (name.includes('massage')) url = '/images/bodymassage.jpg'
        else if (name.includes('color')) url = '/images/haircoloring.jpg'
        else if (name.includes('nail')) url = '/images/manicurepedicure.jpg'
        else url = '/images/facialtreatment.jpg'
        console.log(`ServiceCard ${this.service.name} default:`, url)
      }
      
      return url
    },
    showQuantityControls() {
      // For services, show quantity controls if already in cart
      return this.currentCartQuantity > 0
    },
    displayQuantity() {
      return this.currentCartQuantity || 0
    }
  },
  data() {
    return {
      quantity: 0,
      showRemovalModal: false,
      removalOptions: [],
      selectedRemoval: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      console.log('ServiceCard mounted:', this.service.name, 'imageUrl:', this.imageUrl)
    })
  },
  methods: {
    formatDuration(minutes) {
      if (!minutes) return ''
      if (minutes >= 60) {
        const h = Math.floor(minutes / 60)
        const m = minutes % 60
        return m ? `${h}j ${m}m` : `${h} jam`
      }
      return `${minutes} menit`
    },
    increaseQuantity() {
      // For services, adding more means opening booking modal again
      this.handleBookService()
    },
    decreaseQuantity() {
      const serviceItems = this.cartItems.filter(item =>
        typeof item.id === 'string' && item.id.startsWith(`${this.service.id}-`) && item.type === 'service'
      )
      if (serviceItems.length > 1) {
        // Show removal modal to select which booking to remove
        this.removalOptions = serviceItems.map((item, index) => ({
          id: item.id,
          label: `${item.date} ${item.time} - ${item.staff}`,
          index
        }))
        this.showRemovalModal = true
      } else if (serviceItems.length === 1) {
        // Remove the single booking
        this.$emit('book-service', { ...this.service, quantity: 0, removeId: serviceItems[0].id })
      }
    },
    confirmRemoval() {
      if (this.selectedRemoval) {
        this.$emit('book-service', { ...this.service, quantity: this.displayQuantity - 1, removeId: this.selectedRemoval })
        this.closeRemovalModal()
      }
    },
    closeRemovalModal() {
      this.showRemovalModal = false
      this.selectedRemoval = null
      this.removalOptions = []
    },
    handleBookService() {
      this.$emit('book-service', this.service)
    },
    onImageError(event) {
      if (event.target.dataset.fallback) return
      event.target.dataset.fallback = 'true'
      console.error(`Failed to load image for ${this.service.name}:`, event.target.src)
      event.target.src = 'data:image/svg+xml,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
        '<rect fill="#f3f4f6" width="400" height="300"/>' +
        '<text fill="#9ca3af" font-family="sans-serif" font-size="16" text-anchor="middle" x="200" y="150">' +
        this.service.name.replace(/&/g, '&amp;').replace(/</g, '&lt;') +
        '</text></svg>'
      )
    }
  }
}
</script>
