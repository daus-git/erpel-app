<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50 backdrop-blur-sm sm:p-6 transition-opacity">
    <div 
      class="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 transform scale-100"
      role="dialog"
      aria-modal="true"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 bg-opacity-50">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-salon-primary bg-opacity-10 rounded-lg text-salon-primary">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900">Detail Pesanan</h2>
            <p class="text-xs text-gray-500 font-medium">ID: {{ displayOrder?.id }}</p>
          </div>
        </div>
        <button 
          @click="$emit('close')"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-salon-primary mb-4"></div>
          <p class="text-gray-500 font-medium">Memuat detail pesanan...</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="flex flex-col items-center justify-center py-12 text-center">
          <svg class="w-12 h-12 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-gray-900 font-medium mb-4">{{ error }}</p>
          <button 
            @click="loadOrderDetails"
            class="px-4 py-2 bg-salon-primary text-white rounded-lg hover:bg-salon-text font-medium"
          >
            Coba Lagi
          </button>
        </div>
        
        <!-- Content -->
        <div v-else class="space-y-8">
          
          <!-- Top Section: Status & QR -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-6 bg-salon-primary bg-opacity-5 rounded-xl border border-salon-primary border-opacity-20">
            <div class="space-y-3 flex-1">
              <div class="flex items-center gap-3">
                <h3 class="text-2xl font-black text-gray-900 tracking-tight">
                  {{ displayOrder?.booking_code || `#${displayOrder?.id}` }}
                </h3>
                <span :class="statusBadgeClasses" class="px-3 py-1 text-xs font-semibold rounded-full border">
                  {{ statusLabel }}
                </span>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                <span class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-salon-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(displayOrder?.order_date) }}
                </span>
                <span class="hidden sm:inline text-gray-300">•</span>
                <span class="flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-salon-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatTime(displayOrder?.order_time) }} WIB
                </span>
              </div>
            </div>
            
            <!-- QR Code Generated via API -->
            <div class="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 w-full sm:w-auto">
              <div class="w-full max-w-[250px] sm:max-w-[200px] aspect-square">
                <img 
                  :src="qrCodeUrl" 
                  :alt="`QR Code ${displayOrder?.booking_code}`"
                  class="w-full h-full object-contain"
                />
              </div>
              <span class="mt-3 text-xs text-gray-400 font-medium uppercase tracking-wider flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Pindai Disini
              </span>
            </div>
          </div>

          <!-- Customer Info -->
          <div>
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Informasi Pelanggan
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-5 border border-gray-100">
              <div>
                <p class="text-xs text-gray-500 mb-1">Nama Lengkap</p>
                <p class="font-semibold text-gray-900">{{ displayOrder?.user_name || '-' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">No. WhatsApp / Telepon</p>
                <p class="font-medium text-gray-900 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {{ displayOrder?.user_phone || '-' }}
                </p>
              </div>
              <div v-if="displayOrder?.user_email">
                <p class="text-xs text-gray-500 mb-1">Email</p>
                <p class="font-medium text-gray-900">{{ displayOrder?.user_email }}</p>
              </div>
              <div v-if="displayOrder?.notes">
                <p class="text-xs text-gray-500 mb-1">Catatan Tambahan</p>
                <p class="text-sm text-gray-700 italic bg-white p-3 rounded-lg border border-gray-100">
                  "{{ displayOrder?.notes }}"
                </p>
              </div>
            </div>
          </div>

          <!-- Services / Items -->
          <div>
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Daftar Layanan
            </h4>
            <div class="border border-gray-200 rounded-xl overflow-hidden">
              <table class="w-full text-left border-collapse">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-3 text-xs font-semibold text-gray-600">Layanan</th>
                    <th class="px-4 py-3 text-xs font-semibold text-gray-600 hidden sm:table-cell">Staff</th>
                    <th class="px-4 py-3 text-xs font-semibold text-gray-600">Durasi</th>
                    <th class="px-4 py-3 text-xs font-semibold text-gray-600 text-right">Harga</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="item in orderItems" :key="item.id" class="bg-white hover:bg-gray-50 transition-colors">
                    <td class="px-4 py-3">
                      <p class="font-semibold text-gray-900 text-sm">{{ item.service_name }}</p>
                      <p class="text-xs text-gray-500 sm:hidden mt-0.5">Staff: {{ item.employee_name }}</p>
                    </td>
                    <td class="px-4 py-3 hidden sm:table-cell">
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-salon-primary bg-opacity-10 text-salon-primary text-xs font-medium">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {{ item.employee_name }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-600">{{ item.duration_minutes }} Min</td>
                    <td class="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                      {{ formatCurrency(item.price) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Payment Summary -->
          <div class="flex flex-col sm:flex-row justify-end gap-6">
            <div class="w-full sm:w-1/2 lg:w-1/3 space-y-3 bg-gray-50 p-5 rounded-xl border border-gray-100">
              <div class="flex justify-between items-center text-sm">
                <span class="text-gray-500">Subtotal</span>
                <span class="font-medium text-gray-900">{{ formatCurrency(subtotal) }}</span>
              </div>
              <div class="flex justify-between items-center text-sm border-b border-gray-200 pb-3">
                <span class="text-gray-500 flex items-center gap-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Deposit
                </span>
                <span class="font-medium text-red-500">- {{ formatCurrency(depositAmount) }}</span>
              </div>
               <div class="flex justify-between items-center text-sm font-bold">
                <span class="text-gray-900">Sisa Tagihan</span>
                <span class="text-lg text-salon-primary">{{ formatCurrency(remainingPayment) }}</span>
              </div>
            </div>
          </div>
        </div> <!-- end content -->
      </div> <!-- end body -->

      <!-- Footer Actions -->
      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
        <button 
          class="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-salon-primary flex items-center justify-center gap-2 transition-all"
          @click="printReceipt"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Cetak Struk
        </button>
        
        <div class="flex gap-3 w-full sm:w-auto">
          <button 
            @click="$emit('close')"
            class="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { fetchOrder } from '@/services/apiService'

export default {
  name: 'OrderDetailModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    order: {
      type: Object,
      default: () => ({})
    },
    services: {
      type: Array,
      default: () => []
    },
    employees: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close'],
  data() {
    return {
      orderData: null,
      isLoading: false,
      error: null
    }
  },
  computed: {
    displayOrder() {
      // Use fetched orderData if available, otherwise fall back to prop order
      return this.orderData || this.order
    },
    statusLabel() {
      const statusMap = {
        1: 'Pending',
        2: 'Confirmed',
        3: 'Checked In',
        4: 'In Progress',
        5: 'Completed',
        6: 'Cancelled'
      }
      return statusMap[this.displayOrder?.status_id] || 'Unknown'
    },
    statusBadgeClasses() {
      const classesMap = {
        1: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        2: 'bg-blue-100 text-blue-800 border-blue-200',
        3: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        4: 'bg-purple-100 text-purple-800 border-purple-200',
        5: 'bg-green-100 text-green-800 border-green-200',
        6: 'bg-red-100 text-red-800 border-red-200'
      }
      return classesMap[this.displayOrder?.status_id] || 'bg-gray-100 text-gray-800 border-gray-200'
    },
    qrCodeUrl() {
      const bookingCode = this.displayOrder?.booking_code || `ORDER-${this.displayOrder?.id}`
      return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(bookingCode)}&margin=0`
    },
    subtotal() {
      // Calculate total from items or use price field
      if (this.orderItems.length > 0) {
        return this.orderItems.reduce((sum, item) => sum + (item.price || 0), 0)
      }
      return this.displayOrder?.price || this.displayOrder?.total_price || 0
    },
    remainingPayment() {
      // Use remaining_payment from order if available
      if (this.displayOrder?.remaining_payment !== undefined) {
        return this.displayOrder.remaining_payment
      }
      // Calculate: total - deposit
      return this.subtotal - this.depositAmount
    },
    depositAmount() {
      // First try deposit_amount from order
      const orderDeposit = this.displayOrder?.deposit_amount || 
             this.displayOrder?.deposit || 
             this.displayOrder?.dp || 
             this.displayOrder?.down_payment || 
             this.displayOrder?.paid_amount || 0
      
      // If order has deposit, use it
      if (orderDeposit > 0) return orderDeposit
      
      // Calculate from service deposit_percentage (default 30%)
      let depositPercent = 30 // Default 30%
      if (this.orderItems.length > 0) {
        for (const item of this.orderItems) {
          const service = this.services?.find(s => s.id === item.service_id)
          if (service?.deposit_percentage) {
            depositPercent = service.deposit_percentage
            break
          }
        }
      }
      
      return Math.round(this.subtotal * (depositPercent / 100))
    },
    orderItems() {
      // Use order items if available
      let items = this.displayOrder?.items || this.displayOrder?.order_items || []
      
      // If no items array but has service_id, create item from order data
      if ((!items || items.length === 0) && this.displayOrder?.service_id) {
        items = [{
          id: 1,
          service_id: this.displayOrder.service_id,
          employee_id: this.displayOrder.employee_id,
          price: this.displayOrder?.price || this.displayOrder?.total_price || 0,
          duration_minutes: this.displayOrder?.duration_minutes || 60,
          service_name: this.displayOrder?.service?.name || this.displayOrder?.service_name,
          employee_name: this.displayOrder?.employee?.name || this.displayOrder?.employee_name
        }]
      }
      
      // Map service_id to service name from services prop
      return items.map(item => {
        const service = this.services?.find(s => s.id === item.service_id)
        const employee = this.employees?.find(e => e.id === item.employee_id)
        return {
          id: item.id,
          service_name: item.service?.name || service?.name || item.service_name || `Service #${item.service_id}`,
          employee_name: item.employee?.name || employee?.name || item.employee_name || `Staff #${item.employee_id}`,
          price: item.price || 0,
          duration_minutes: item.duration_minutes || service?.duration || 30
        }
      })
    }
  },
  watch: {
    show(newVal) {
      if (newVal && this.displayOrder?.id) {
        this.loadOrderDetails()
      }
    }
  },
  methods: {
    async loadOrderDetails() {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetchOrder(this.order.id)
        // API response structure: { message: string, data: {...} }
        this.orderData = response.data || response
        console.log('Order detail loaded:', this.orderData)
        console.log('Price fields:', {
          total_price: this.orderData?.total_price,
          price: this.orderData?.price,
          deposit_amount: this.orderData?.deposit_amount,
          deposit: this.orderData?.deposit,
          items: this.orderData?.items
        })
      } catch (err) {
        console.error('Failed to load order details:', err)
        this.error = 'Gagal memuat detail pesanan. Silakan coba lagi.'
        // Fallback to prop order
        this.orderData = this.order
      } finally {
        this.isLoading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      try {
        return new Date(dateString).toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch {
        return dateString
      }
    },
    formatTime(timeString) {
      if (!timeString) return '-'
      // If timeString is in HH:MM:SS format, extract HH:MM
      if (typeof timeString === 'string' && timeString.includes(':')) {
        return timeString.substring(0, 5)
      }
      return timeString
    },
    formatCurrency(amount) {
      if (amount === null || amount === undefined || isNaN(amount)) {
        return 'Rp 0'
      }
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount)
    },
    printReceipt() {
      window.print()
    }
  }
}
</script>

<style scoped>
/* Print styles */
@media print {
  .fixed {
    position: static !important;
    background: none !important;
  }
  .backdrop-blur-sm {
    backdrop-filter: none !important;
  }
  .shadow-2xl {
    box-shadow: none !important;
  }
  .max-h-\[90vh\] {
    max-height: none !important;
  }
}
</style>