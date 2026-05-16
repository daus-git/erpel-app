<template>
  <div class="min-h-screen bg-salon-base">
    <!-- Navigation -->
    <DashboardHeader />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" style="padding-top: 80px;">
      <div class="px-4 py-6 sm:px-0">
        <!-- Back Button -->
        <div class="mb-6">
          <router-link to="/dashboard" class="inline-flex items-center text-salon-accent1 hover:text-salon-accent1/80 transition-colors duration-200">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Dashboard
          </router-link>
        </div>

        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Riwayat Pesanan</h1>
          <p class="text-gray-600">Lihat semua pesanan Anda sebelumnya</p>
        </div>

        <!-- History List -->
        <div v-if="userHistory.length > 0" class="space-y-6">
          <div v-for="order in userHistory" :key="order.id" class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <!-- Order Header -->
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-bold text-gray-900">Order #{{ order.id }}</h3>
                <p class="text-sm text-gray-600">{{ order.date }} at {{ order.time }}</p>
              </div>
              <div class="text-right">
                <div :class="order.status_id ? getStatusClassById(order.status_id) : getStatusClass(order.status)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                  {{ order.status_id ? getStatusText(order.status_id) : order.status }}
                </div>
                <p class="text-lg font-bold text-salon-accent1 mt-1">Rp {{ order.total.toLocaleString() }}</p>
                <p v-if="order.remainingPayment > 0" class="text-sm text-red-500 font-medium">
                  Sisa bayar: Rp {{ order.remainingPayment.toLocaleString() }}
                </p>
              </div>
            </div>

            <!-- Order Items -->
            <div class="space-y-3 mb-4">
              <div v-for="item in order.items" :key="item.name" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div class="flex items-center space-x-3">
                  <div :class="item.type === 'service' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'" class="px-2 py-1 rounded text-xs font-medium">
                    {{ item.type === 'service' ? 'Layanan' : 'Produk' }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ item.name }}</p>
                    <p v-if="item.staff" class="text-sm text-gray-600">Staff: {{ item.staff }}</p>
                    <p v-if="item.quantity" class="text-sm text-gray-600">Qty: {{ item.quantity }}</p>
                  </div>
                </div>
                <span class="font-medium text-gray-900">Rp {{ item.price.toLocaleString() }}</span>
              </div>
            </div>

            <!-- Order Actions -->
            <div class="flex space-x-3 pt-4 border-t border-gray-100">
              <button @click="reorder(order)" class="flex-1 bg-salon-accent1 hover:bg-salon-accent1/80 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                Pesan Lagi
              </button>
               <button @click="openOrderDetailModal(order)" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors">
                 Detail
               </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Belum ada riwayat pesanan</h3>
          <p class="text-gray-600 mb-6">Mulai pesan layanan atau produk untuk melihat riwayat di sini</p>
          <router-link to="/" class="bg-salon-accent1 hover:bg-salon-accent1/80 text-white py-3 px-6 rounded-lg font-medium transition-colors">
            Mulai Pesan
          </router-link>
        </div>
      </div>

      <!-- Order Detail Modal -->
      <OrderDetailModal
        :show="showOrderDetailModal"
        :order="selectedOrder"
        :services="services"
        :employees="employees"
        @close="closeOrderDetailModal"
      />
    </main>
  </div>
</template>

<script>
import DashboardHeader from '../components/DashboardHeader.vue'
import OrderDetailModal from '../components/OrderDetailModal.vue'
import { fetchOrders, fetchServices, fetchEmployees } from '../services/apiService'
import { showSuccess, showWarning } from '../utils/sweetAlert'

export default {
  name: 'HistoryView',
  components: {
    DashboardHeader,
    OrderDetailModal
  },
  data() {
    return {
      orders: [],
      services: [],
      employees: [],
      loading: false,
      showOrderDetailModal: false,
      selectedOrder: null
    }
  },
  computed: {
    currentUser() {
      const user = localStorage.getItem('currentUser')
      return user ? JSON.parse(user) : null
    },
    userHistory() {
      if (!this.currentUser) return []

      const servicesMap = new Map((this.services || []).map(s => [s.id, s]))
      const employeesMap = new Map((this.employees || []).map(e => [e.id, e]))

      const normalizedOrders = (this.orders || []).map(order => {
        const service = servicesMap.get(order.service_id)
        const employee = employeesMap.get(order.employee_id)
        const items = service ? [{
          name: service.name,
          type: 'service',
          price: Number(service.price) || 0,
          quantity: 1,
          staff: employee ? employee.name : null,
          image: service.image || null
        }] : []

        const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
        const date = order.order_date || order.date || (order.created_at ? order.created_at.split('T')[0] : '-')
        const time = order.order_time || order.time || this.extractTime(order.created_at)

        return {
          id: order.id,
          date,
          time,
          status: order.status || 'Pending',
          status_id: order.status_id,
          total,
          remainingPayment: order.remaining_payment || (total - (order.deposit_amount || 0)),
          items
        }
      })

      return normalizedOrders.sort((a, b) => new Date(`${b.date} ${b.time || '00:00'}`) - new Date(`${a.date} ${a.time || '00:00'}`))
    }
  },
  mounted() {
    this.loadHistory()
  },
  methods: {
    async loadHistory() {
      if (!this.currentUser) return
      this.loading = true
      try {
        const token = localStorage.getItem('authToken')
        const [ordersRaw, services, employees] = await Promise.all([
          fetchOrders(token, this.currentUser?.id),
          fetchServices(),
          fetchEmployees()
        ])

        console.log('History: currentUser', this.currentUser)
        console.log('History: ordersRaw', ordersRaw)
        console.log('History: services', services)

        this.services = services || []
        this.employees = employees || []

        console.log('History: ordersRaw', ordersRaw)
        this.orders = ordersRaw || []
      } catch (error) {
        console.error('Failed to load order history', error)
      } finally {
        this.loading = false
      }
    },
    extractTime(raw) {
      if (!raw || raw === '-') return '-'
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
      switch (status) {
        case 'Completed':
          return 'bg-green-100 text-green-800'
        case 'In Progress':
          return 'bg-blue-100 text-blue-800'
        case 'Scheduled':
          return 'bg-gray-100 text-gray-800'
        case 'Cancelled':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    },
    getStatusText(statusId) {
      const statusMap = {
        1: 'Pending',
        2: 'Confirmed',
        3: 'Checked In',
        4: 'In Progress',
        5: 'Completed',
        6: 'Cancelled'
      }
      return statusMap[statusId] || 'Pending'
    },
    getStatusClassById(statusId) {
      const classMap = {
        1: 'bg-yellow-100 text-yellow-800',
        2: 'bg-blue-100 text-blue-800',
        3: 'bg-green-100 text-green-800',
        4: 'bg-purple-100 text-purple-800',
        5: 'bg-gray-100 text-gray-800',
        6: 'bg-red-100 text-red-800'
      }
      return classMap[statusId] || 'bg-gray-100 text-gray-800'
    },
    openOrderDetailModal(order) {
      this.selectedOrder = order
      this.showOrderDetailModal = true
    },
    closeOrderDetailModal() {
      this.showOrderDetailModal = false
      this.selectedOrder = null
    },
    reorder(order) {
      // Add order items to cart
      const cart = JSON.parse(localStorage.getItem('salon-cart') || '[]')
      
      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          const cartItem = {
            id: `service-${item.id || Date.now()}-${Math.random()}`,
            type: item.type || 'service',
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1,
            staff: item.staff || null,
            image: item.image || null,
            date: order.date || null,
            time: order.time || null
          }
          cart.push(cartItem)
        })
        
        localStorage.setItem('salon-cart', JSON.stringify(cart))
        showSuccess('Ditambahkan ke Keranjang', `${order.items.length} item berhasil ditambahkan ke keranjang`)
        
        // Redirect to dashboard to continue booking
        this.$router.push('/dashboard')
      } else {
        showWarning('Tidak dapat pesan ulang', 'Item pesanan tidak ditemukan')
      }
    }
  }
}
</script>
