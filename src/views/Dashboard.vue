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
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="progress in progressData" :key="progress.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden w-24">
                        <div :class="getProgressBarClass(progress.status)" class="h-full rounded-full transition-all duration-500" :style="{ width: getProgressWidth(progress.status) }"></div>
                      </div>
                      <span class="ml-3 text-xs text-gray-500">{{ getProgressText(progress.status) }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ progress.customerName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ progress.time }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(progress.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {{ formatStatus(progress.status) }}
                    </span>
                  </td>
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
      :employees="employees"
      :orders="orders"
      @close="closeBookingModal"
      @confirm="handleBookingConfirm"
    />
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import ServiceBookingModal from '../components/ServiceBookingModal.vue'
import DashboardHeader from '../components/DashboardHeader.vue'
import ServiceCard from '../components/ServiceCard.vue'
import { showSuccess, showError } from '../utils/sweetAlert'
import { fetchServices, fetchProgress, fetchOrders, fetchUsers, fetchEmployees } from '../services/apiService'

export default {
  name: 'DashboardView',
  components: {
    ServiceBookingModal,
    DashboardHeader,
    ServiceCard
  },
  data() {
    return {
      services: [],
      servicesLoading: false,
      progressData: [],
      progressLoading: false,
      users: [],
      employees: [],
      orders: [],
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
    this.loadDashboardData()
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
    async loadDashboardData() {
      this.servicesLoading = true
      this.progressLoading = true
      try {
        const [services, progressRaw, ordersRaw, users, employees] = await Promise.all([
          fetchServices(),
          fetchProgress(),
          fetchOrders(),
          fetchUsers(),
          fetchEmployees()
        ])

        this.services = services || []
        this.users = users || []
        this.employees = employees || []
        this.orders = ordersRaw || []

        const servicesMap = new Map((services || []).map(s => [s.id, s]))
        const usersMap = new Map((users || []).map(u => [u.id, u]))
        const employeesMap = new Map((employees || []).map(e => [e.id, e]))
        const ordersMap = new Map((ordersRaw || []).map(o => [o.id, o]))

        const todayLocal = this.getTodayDate()
        console.log('Progress Raw:', progressRaw)
        console.log('Orders Raw:', ordersRaw)
        
        this.progressData = (progressRaw || [])
          .map(item => {
            const relatedOrder = ordersMap.get(item.order_id)
            console.log('Item:', item, 'Related Order:', relatedOrder)
            if (!relatedOrder) return null
            const orderDate = (relatedOrder.order_date || relatedOrder.date || '').toString().substring(0, 10)
            if (orderDate !== todayLocal) return null
            const service = servicesMap.get(relatedOrder?.service_id)
            const userFromOrder = relatedOrder?.user_id ? usersMap.get(relatedOrder.user_id) : null
            const employeeName = relatedOrder?.employee_id ? (employeesMap.get(relatedOrder.employee_id)?.name || `Staff #${relatedOrder.employee_id}`) : '-'
            
            // Use order time (time chosen by customer)
            const orderTime = relatedOrder?.order_time || relatedOrder?.time || item.created_at || '-'
            const progressTime = this.extractTime(orderTime)
            
            // Use order status_id to get status text
            const statusId = relatedOrder?.status_id || 1
            const statusMap = {
              1: 'pending',
              2: 'confirmed',
              3: 'checked_in',
              4: 'in_progress',
              5: 'completed',
              6: 'cancelled'
            }
            const normalizedStatus = statusMap[statusId] || 'pending'
            
            // Get customer name from multiple sources
            const customerName = relatedOrder?.customer_name || 
                                 relatedOrder?.user_name || 
                                 userFromOrder?.name || 
                                 `Customer #${relatedOrder?.user_id}` ||
                                 'Customer'
            
            return {
              id: item.id,
              time: progressTime,
              customerName: customerName,
              serviceType: service?.name || 'Service',
              staff: employeeName,
              status: normalizedStatus
            }
          })
          .filter(Boolean)
      } catch (error) {
        console.error('Failed to load dashboard data from API', error)
        showError('Gagal memuat data', 'Silakan coba lagi nanti.')
      } finally {
        this.servicesLoading = false
        this.progressLoading = false
      }
    },
    extractTime(raw) {
      if (!raw || raw === '-') return '-'
      // Handle ISO strings or "YYYY-MM-DD HH:MM:SS"
      if (typeof raw === 'string') {
        const isoMatch = raw.match(/T(\d{2}:\d{2})(?::\d{2})?/)
        if (isoMatch) return isoMatch[1]
        if (raw.includes(' ')) return raw.split(' ')[1].slice(0, 5)
        if (/^\d{2}:\d{2}/.test(raw)) return raw.slice(0, 5)
      }
      try {
        const d = new Date(raw)
        if (!isNaN(d)) {
          const hh = `${d.getHours()}`.padStart(2, '0')
          const mm = `${d.getMinutes()}`.padStart(2, '0')
          return `${hh}:${mm}`
        }
      } catch (e) {
        // ignore parsing errors
      }
      return raw
    },
    getStatusClass(status) {
      const normalized = (status || '').toLowerCase()
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        checked_in: 'bg-green-100 text-green-800',
        in_progress: 'bg-indigo-100 text-indigo-800',
        completed: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800'
      }
      return classes[normalized] || 'bg-gray-100 text-gray-800'
    },
    getProgressBarClass(status) {
      const normalized = (status || '').toLowerCase()
      const classes = {
        pending: 'bg-yellow-500',
        confirmed: 'bg-blue-400',
        checked_in: 'bg-blue-500',
        in_progress: 'bg-indigo-500',
        completed: 'bg-green-500',
        cancelled: 'bg-red-500'
      }
      return classes[normalized] || 'bg-gray-400'
    },
    getProgressWidth(status) {
      const normalized = (status || '').toLowerCase()
      const widths = {
        pending: '20%',
        confirmed: '40%',
        checked_in: '60%',
        in_progress: '80%',
        completed: '100%',
        cancelled: '0%'
      }
      return widths[normalized] || '10%'
    },
    getProgressText(status) {
      const normalized = (status || '').toLowerCase()
      const texts = {
        pending: 'Menunggu',
        confirmed: 'Dikonfirmasi',
        checked_in: 'Check In',
        in_progress: 'Sedang Dikerjakan',
        completed: 'Selesai',
        cancelled: 'Dibatalkan'
      }
      return texts[normalized] || 'Menunggu'
    },
    loadCart() {
      const cart = JSON.parse(localStorage.getItem('salon-cart') || '[]')
      this.cartItems = cart
    },
    getCartItemQuantity(itemId, type) {
      const item = this.cartItems.find(cartItem => cartItem.id === itemId && cartItem.type === type)
      return item ? item.quantity : 0
    },
    addToCart(item) {
      // For services, open booking modal
      this.openBookingModal(item)
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
        showError('Error: Service data is missing. Please try again.')
        return
      }

      if (quantity === 1) {
        const cartItem = {
          id: `${service.id}-${Date.now()}`,
          serviceId: service.id,
          name: service.name,
          price: service.price,
          image: service.image_url || service.image,
          type: 'service',
          quantity: 1,
          date,
          time,
          staff,
          employeeId: this.getEmployeeIdByName(staff)
        }
        this.cartItems.push(cartItem)
      } else {
        for (let i = 0; i < quantity; i++) {
          const cartItem = {
            id: `${service.id}-${Date.now()}-${i}`,
            serviceId: service.id,
            name: service.name,
            price: service.price,
            image: service.image_url || service.image,
            type: 'service',
            quantity: 1,
            date,
            time,
            staff: selectedStaff[i],
            employeeId: this.getEmployeeIdByName(selectedStaff[i])
          }
          this.cartItems.push(cartItem)
        }
      }

      localStorage.setItem('salon-cart', JSON.stringify(this.cartItems))
      showSuccess('Layanan Ditambahkan!', 'Layanan berhasil ditambahkan ke keranjang!')
    },
    getEmployeeIdByName(name) {
      if (!name || !this.employees || !this.employees.length) return null
      const found = this.employees.find(emp => emp.name === name)
      return found ? found.id : null
    },
    formatStatus(status) {
      if (!status) return '-'
      return status
        .toString()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
    },
    getTodayDate() {
      return new Date().toLocaleDateString('sv-SE')
    }
  }
}
</script>
