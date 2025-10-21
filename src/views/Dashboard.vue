;<template>
  <div class="min-h-screen bg-salon-base">
    <!-- Navigation -->
    <DashboardHeader />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" style="padding-top: 80px;">
      <div class="px-4 py-6 sm:px-0">
        <!-- Welcome Section -->
        <div class="mb-8 flex items-center space-x-2">
          <div class="w-12 h-12 bg-salon-accent1 rounded-full flex items-center justify-center overflow-hidden">
            <img v-if="currentUser.profilePhoto" :src="currentUser.profilePhoto" alt="Profile" class="w-full h-full object-cover">
            <span v-else class="text-white text-lg font-medium">{{ userInitial }}</span>
          </div>
          <span class="text-gray-700 font-medium text-xl">Welcome, {{ currentUser.name }}!</span>
        </div>

        <!-- Services Section -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Layanan Kami</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              v-for="service in services"
              :key="service.id"
              :service="service"
              :cart-items="cartItems"
              @book-service="setServiceQuantity"
            />
          </div>
        </div>

        <!-- Products Section -->
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Produk Kami</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              :cart-items="cartItems"
              @add-to-cart="setProductQuantity"
            />
          </div>
        </div>

        <!-- Customer Progress Table -->
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div class="flex items-center mb-6">
            <div class="bg-salon-accent1 rounded-lg p-3">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 ml-4">Customer Progress</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="progress in progressData" :key="progress.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ progress.customerName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ progress.time }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(progress.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ progress.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ progress.serviceType }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ progress.staff }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Service Booking Modal -->
    <ServiceBookingModal
      :showModal="showBookingModal"
      :selectedService="selectedServiceForBooking"
      @close="closeBookingModal"
      @confirm="handleBookingConfirm"
    />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import servicesData from '../data/services.json'
import productsData from '../data/products.json'
import progressData from '../data/progress.json'
import ServiceBookingModal from '../components/ServiceBookingModal.vue'
import DashboardHeader from '../components/DashboardHeader.vue'
import ServiceCard from '../components/ServiceCard.vue'
import ProductCard from '../components/ProductCard.vue'

export default {
  name: 'DashboardView',
  components: {
    ServiceBookingModal,
    DashboardHeader,
    ServiceCard,
    ProductCard
  },
  data() {
    return {
      services: servicesData,
      products: productsData,
      progressData: progressData,
      cartItems: [],
      showBookingModal: false,
      selectedServiceForBooking: null
    }
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  mounted() {
    // Load cart items
    this.loadCart()
  },
  computed: {
    currentUser() {
      const user = localStorage.getItem('currentUser')
      return user ? JSON.parse(user) : {}
    },
    userInitial() {
      return this.currentUser && this.currentUser.name ? this.currentUser.name.charAt(0).toUpperCase() : 'U'
    },
    cartItemCount() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0)
    }
  },
  methods: {
    getStatusClass(status) {
      switch (status) {
        case 'Completed':
          return 'bg-green-100 text-green-800'
        case 'In Progress':
          return 'bg-blue-100 text-blue-800'
        case 'Waiting':
          return 'bg-yellow-100 text-yellow-800'
        case 'Scheduled':
          return 'bg-gray-100 text-gray-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    },
    loadCart() {
      const cart = JSON.parse(localStorage.getItem('salon-cart') || '[]')
      this.cartItems = cart
    },
    getCartItemQuantity(itemId, type) {
      const item = this.cartItems.find(cartItem => cartItem.id === itemId && cartItem.type === type)
      return item ? item.quantity : 0
    },
    addToCart(item, type) {
      if (type === 'service') {
        // For services, open booking modal
        this.openBookingModal(item)
      } else {
        // For products, add directly to cart
        this.addProductToCart(item)
      }
    },
    setProductQuantity(item, quantity) {
      if (quantity <= 0) {
        // Remove item from cart
        const itemIndex = this.cartItems.findIndex(cartItem => cartItem.id === item.id && cartItem.type === 'product')
        if (itemIndex !== -1) {
          this.cartItems.splice(itemIndex, 1)
        }
      } else {
        // Check if item already exists in cart
        const existingItem = this.cartItems.find(cartItem => cartItem.id === item.id && cartItem.type === 'product')
        if (existingItem) {
          existingItem.quantity = quantity
        } else {
          const cartItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            type: 'product',
            quantity: quantity
          }
          this.cartItems.push(cartItem)
        }
      }

      // Save to localStorage
      localStorage.setItem('salon-cart', JSON.stringify(this.cartItems))
    },
    viewProductDetails(product) {
      // Placeholder for product details functionality
      alert(`Detail produk: ${product.name}\nDeskripsi: ${product.description}\nHarga: Rp ${product.price.toLocaleString()}`)
    },
    openBookingModal(service) {
      if (!service) {
        console.error('No service provided to openBookingModal')
        return
      }
      this.selectedServiceForBooking = service
      this.showBookingModal = true
    },
    closeBookingModal() {
      this.showBookingModal = false
      this.selectedServiceForBooking = null
    },
    setServiceQuantity(serviceData) {
      console.log('setServiceQuantity called with:', serviceData)
      const service = serviceData.service || serviceData
      const quantity = serviceData.quantity !== undefined ? serviceData.quantity : 1
      const removeId = serviceData.removeId

      if (!service) {
        console.error('Service data is missing in setServiceQuantity')
        return
      }

      if (removeId) {
        // Remove specific booking by ID
        this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== removeId)
      } else if (quantity <= 0) {
        // Remove all instances of this service from cart
        this.cartItems = this.cartItems.filter(cartItem =>
          !(typeof cartItem.id === 'string' && cartItem.id.startsWith(`${service.id}-`) && cartItem.type === 'service')
        )
      } else {
        // For services, always open booking modal to add new booking
        this.openBookingModal(service)
      }

      // Save to localStorage
      localStorage.setItem('salon-cart', JSON.stringify(this.cartItems))
    },
    increaseQuantity(itemId, type) {
      const item = this.cartItems.find(cartItem => cartItem.id === itemId && cartItem.type === type)
      if (item) {
        item.quantity += 1
        localStorage.setItem('salon-cart', JSON.stringify(this.cartItems))
      }
    },
    decreaseQuantity(itemId, type) {
      const itemIndex = this.cartItems.findIndex(cartItem => cartItem.id === itemId && cartItem.type === type)
      if (itemIndex !== -1) {
        const item = this.cartItems[itemIndex]
        item.quantity -= 1
        if (item.quantity <= 0) {
          this.cartItems.splice(itemIndex, 1)
        }
        localStorage.setItem('salon-cart', JSON.stringify(this.cartItems))
      }
    },
    handleBookingConfirm(bookingData) {
      const { service, date, time, staff, selectedStaff, quantity } = bookingData

      if (!service) {
        console.error('Service data is missing', bookingData)
        alert('Error: Service data is missing. Please try again.')
        return
      }

      if (quantity === 1) {
        const cartItem = {
          id: `${service.id}-${Date.now()}`,
          name: service.name,
          price: service.price,
          image: service.image,
          type: 'service',
          quantity: 1,
          date,
          time,
          staff
        }
        this.cartItems.push(cartItem)
      } else {
        for (let i = 0; i < quantity; i++) {
          const cartItem = {
            id: `${service.id}-${Date.now()}-${i}`,
            name: service.name,
            price: service.price,
            image: service.image,
            type: 'service',
            quantity: 1,
            date,
            time,
            staff: selectedStaff[i]
          }
          this.cartItems.push(cartItem)
        }
      }

      localStorage.setItem('salon-cart', JSON.stringify(this.cartItems))
      alert('Service added to cart!')
    }
  }
}
</script>
