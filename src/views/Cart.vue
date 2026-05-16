<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <button @click="$router.go(-1)" class="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 class="text-xl font-bold text-gray-900">Keranjang Belanja</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">{{ cartItems.length }} item{{ cartItems.length !== 1 ? 's' : '' }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style="padding-top: 80px;">
      <!-- Empty Cart -->
      <div v-if="cartItems.length === 0" class="text-center py-16">
        <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Keranjang Kosong</h2>
        <p class="text-gray-600 mb-6">Belum ada item di keranjang Anda</p>
        <router-link to="/dashboard" class="bg-salon-accent1 hover:bg-salon-accent1/80 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          Mulai Belanja
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="space-y-6">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="divide-y divide-gray-200">
            <div v-for="(item, index) in cartItems" :key="item.id" class="p-6">
              <div class="flex items-center space-x-4">
                <img :src="item.image" :alt="item.name" class="w-16 h-16 rounded-lg object-cover flex-shrink-0">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900">{{ item.name }}</h3>
                  <p class="text-sm text-gray-600">{{ item.type === 'service' ? item.duration : item.category }}</p>

                  <!-- Service Booking Details -->
                  <div v-if="item.type === 'service' && (item.date || item.time || item.staff)" class="mt-2 p-3 bg-salon-accent1/10 rounded-lg border border-salon-accent1/20">
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <div v-if="item.date" class="flex items-center space-x-1">
                        <svg class="h-4 w-4 text-salon-accent1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <span class="text-salon-accent1 font-medium">{{ formatDate(item.date) }}</span>
                      </div>
                      <div v-if="item.time" class="flex items-center space-x-1">
                        <svg class="h-4 w-4 text-salon-accent1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="text-salon-accent1 font-medium">{{ item.time }}</span>
                      </div>
                      <div v-if="item.staff" class="flex items-center space-x-1">
                        <svg class="h-4 w-4 text-salon-accent1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span class="text-salon-accent1 font-medium">{{ item.staff }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between mt-2">
                    <span class="text-salon-accent1 font-bold text-lg">Rp {{ item.price.toLocaleString() }}</span>
                    <div class="flex items-center space-x-2">
                      <button @click="updateQuantity(index, item.quantity - 1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <svg class="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                      </button>
                      <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                      <button @click="updateQuantity(index, item.quantity + 1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                        <svg class="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <button @click="removeItem(index)" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pesanan</h3>
          <div class="space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal ({{ totalItems }} item{{ totalItems !== 1 ? 's' : '' }})</span>
              <span class="font-medium">Rp {{ subtotal.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Biaya Layanan</span>
              <span class="font-medium">Rp {{ serviceFee.toLocaleString() }}</span>
            </div>
            <div v-if="hasServices" class="flex justify-between text-sm">
               <span class="text-gray-600">Deposit Layanan ({{ cartItems[0]?.deposit_percentage || 30 }}%)</span>
              <span class="font-medium text-blue-600">Rp {{ depositAmount.toLocaleString() }}</span>
            </div>
            <div v-if="hasServices" class="flex justify-between text-sm">
              <span class="text-gray-600">Sisa Bayar di Toko</span>
              <span class="font-medium text-orange-600">Rp {{ remainingAmount.toLocaleString() }}</span>
            </div>
            <div class="border-t border-gray-200 pt-3">
              <div class="flex justify-between text-lg font-bold">
                <span>Total Bayar Sekarang</span>
                <span class="text-salon-accent1">Rp {{ (hasServices ? depositAmount : total).toLocaleString() }}</span>
              </div>
            </div>
          </div>
          <div class="mt-6 space-y-3">
            <div v-if="hasServices" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div class="flex items-start space-x-3">
                <svg class="h-5 w-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="text-sm">
                  <p class="font-medium text-blue-900">Sistem Deposit untuk Layanan</p>
                  <p class="text-blue-700 mt-1">
                     Bayar deposit {{ cartItems[0]?.deposit_percentage || 30 }}% sekarang, sisanya bayar di toko saat layanan dilakukan.
                  </p>
                </div>
              </div>
            </div>
            <button @click="showPaymentOptions = true" class="w-full bg-salon-accent1 hover:bg-salon-accent1/80 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
              Lanjutkan ke Pembayaran
            </button>
          </div>

          <!-- Payment Options Modal -->
          <div v-if="showPaymentOptions" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Pilih Metode Pembayaran</h3>
              <!-- Delivery/Pickup Options for Products Only -->
              <div v-if="!hasServices" class="mb-4">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Opsi Pengiriman</h4>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="deliveryOption"
                      type="radio"
                      value="delivery"
                      class="h-4 w-4 text-salon-accent1 focus:ring-salon-accent1 border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">Pengiriman ke Alamat</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="deliveryOption"
                      type="radio"
                      value="pickup"
                      class="h-4 w-4 text-salon-accent1 focus:ring-salon-accent1 border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">Ambil di Toko</span>
                  </label>
                </div>

                <!-- Pickup Date/Time Selection -->
                <div v-if="deliveryOption === 'pickup'" class="mt-3 space-y-3">
                  <div>
                    <label for="pickupDate" class="block text-sm font-medium text-gray-700">Tanggal Pengambilan</label>
                    <input
                      id="pickupDate"
                      v-model="pickupDate"
                      type="date"
                      :min="minDate"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-salon-accent1 focus:border-salon-accent1"
                      required
                    />
                  </div>
                  <div>
                    <label for="pickupTime" class="block text-sm font-medium text-gray-700">Waktu Pengambilan</label>
                    <select
                      id="pickupTime"
                      v-model="pickupTime"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-salon-accent1 focus:border-salon-accent1"
                      required
                    >
                      <option value="">Pilih waktu</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <button @click="selectPaymentMethod('gateway')" class="w-full p-4 border border-gray-300 rounded-lg hover:border-salon-accent1 hover:bg-salon-accent1/5 transition-colors text-left">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">Payment Gateway</p>
                       <p class="text-sm text-gray-600" v-if="hasServices">Bayar deposit {{ cartItems[0]?.deposit_percentage || 30 }}% online, sisanya di toko</p>
                      <p class="text-sm text-gray-600" v-else>Bayar online dengan kartu kredit/debit</p>
                    </div>
                  </div>
                </button>
                <button v-if="!hasServices" @click="selectPaymentMethod('store')" class="w-full p-4 border border-gray-300 rounded-lg hover:border-salon-accent1 hover:bg-salon-accent1/5 transition-colors text-left">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">Bayar di Toko</p>
                      <p class="text-sm text-gray-600">Bayar langsung saat datang ke salon</p>
                    </div>
                  </div>
                </button>
              </div>
              <div class="flex space-x-2 mt-6">
                <button @click="showPaymentOptions = false" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-medium">
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { showSuccess, showError } from '@/utils/sweetAlert'
import { requestSnapPayment } from '@/api/midtrans'
import { createOrder, fetchCurrentUser, createProgress } from '@/services/apiService'

export default {
  name: 'CartView',
  data() {
    return {
      cartItems: [],
      showPaymentOptions: false,
      deliveryOption: 'pickup', // default to pickup
      pickupDate: '',
      pickupTime: '',
      minDate: new Date().toISOString().split('T')[0] // today's date
    }
  },
  computed: {
    subtotal() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    serviceFee() {
      return 0 // No service fee - deposit calculated from service deposit_percentage
    },
    total() {
      return this.subtotal
    },
    totalItems() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0)
    },
    hasServices() {
      return this.cartItems.some(item => item.type === 'service')
    },
    depositAmount() {
      return this.cartItems
        .filter(item => item.type === 'service')
        .reduce((total, item) => {
          const depositPercent = item.deposit_percentage || 30
          return total + Math.round(item.price * (depositPercent / 100) * item.quantity)
        }, 0)
    },
    remainingAmount() {
      return this.cartItems
        .filter(item => item.type === 'service')
        .reduce((total, item) => {
          const depositPercent = item.deposit_percentage || 30
          const deposit = Math.round(item.price * (depositPercent / 100))
          return total + (item.price - deposit) * item.quantity
        }, 0) +
        this.cartItems
          .filter(item => item.type === 'product')
          .reduce((total, item) => total + (item.price * item.quantity), 0)
    }
  },
  mounted() {
    this.loadCart()
  },
  methods: {
    loadCart() {
      const cart = JSON.parse(localStorage.getItem('salon-cart') || '[]')
      this.cartItems = cart
    },
    getTodayDate() {
      return new Date().toLocaleDateString('sv-SE') // YYYY-MM-DD in local timezone
    },
    updateQuantity(index, newQuantity) {
      if (newQuantity <= 0) {
        this.removeItem(index)
        return
      }
      this.cartItems[index].quantity = newQuantity
      this.saveCart()
    },
    removeItem(index) {
      this.cartItems.splice(index, 1)
      this.saveCart()
    },
    saveCart() {
      localStorage.setItem('salon-cart', JSON.stringify(this.cartItems))
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    async selectPaymentMethod(method) {
      if (!this.cartItems.length) {
        showError('Keranjang kosong', 'Tidak ada item untuk dibayar.')
        return
      }

      if (method === 'gateway') {
        try {
          let orderId = null
          const createdOrders = await this.createOrdersAfterMidtransLink()
          if (createdOrders?.length) {
            const firstOrder = createdOrders[0]
            orderId = firstOrder?.id || firstOrder?.order_id
          }

          // Calculate total deposit for payment
          const totalDeposit = createdOrders.reduce((sum, order) => sum + (order.deposit_amount || 0), 0)
          
          const response = await requestSnapPayment({
            order_id: orderId,
            amount: totalDeposit, // Send deposit amount, not total
            token: localStorage.getItem('authToken')
          })
          console.log('Midtrans snap response:', response)
          if (response?.redirect_url) {
            // Open payment page immediately to avoid popup blockers
            const newTab = window.open(response.redirect_url, '_blank')
            if (!newTab) {
              window.location.href = response.redirect_url
            }

            // Clear cart after initiating payment
            this.cartItems = []
            localStorage.removeItem('salon-cart')
          } else {
            showError('Pembayaran gagal', 'redirect_url tidak diterima dari server.')
          }
        } catch (error) {
          console.error('Midtrans snap error:', error)
          const message = error?.body?.message || error.message || 'Gagal memproses pembayaran.'
          showError('Pembayaran gagal', message)
        }
      } else if (method === 'store') {
        // Pay at store - mark order as pending payment
        this.completeOrder('store')
      }
      this.showPaymentOptions = false
    },
    getServiceTotal(order) {
      return order.items
        .filter(item => item.type === 'service')
        .reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    completeOrder(paymentMethod) {
      // Calculate deposit and remaining payment
      let totalDeposit = 0
      let totalRemaining = 0

      const itemsWithPayment = this.cartItems.map(item => {
        if (item.type === 'service') {
          const depositPercent = item.deposit_percentage || 30
          const deposit = Math.round(item.price * (depositPercent / 100))
          const remaining = item.price - deposit
        totalDeposit += deposit
        totalRemaining += remaining
          return {
            type: item.type,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            deposit: deposit,
            remaining: remaining,
            staff: item.staff || null,
            date: item.date || null,
            time: item.time || null
          }
        } else {
          // Products: full price, no deposit
          totalRemaining += item.price * item.quantity
          return {
            type: item.type,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            deposit: 0,
            remaining: item.price,
            staff: item.staff || null,
            date: item.date || null,
            time: item.time || null
          }
        }
      })

      // Create order record
      const order = {
        id: `order-${Date.now()}`,
        userId: JSON.parse(localStorage.getItem('currentUser')).email,
        userName: JSON.parse(localStorage.getItem('currentUser')).name,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: paymentMethod === 'store' ? 'Pending Payment' : 'Processing',
        total: this.total,
        deposit: totalDeposit,
        remainingPayment: totalRemaining,
        paymentMethod: paymentMethod,
        deliveryOption: this.deliveryOption,
        pickupDate: this.pickupDate,
        pickupTime: this.pickupTime,
        items: itemsWithPayment
      }

      // Save to history (in a real app, this would be an API call)
      const history = JSON.parse(localStorage.getItem('order-history') || '[]')
      history.push(order)
      localStorage.setItem('order-history', JSON.stringify(history))

      // Clear cart
      this.cartItems = []
      localStorage.removeItem('salon-cart')

      // Show success message
      const methodText = paymentMethod === 'store' ? 'di toko' : 'melalui gateway pembayaran'
      if (this.hasServices) {
        const depositText = `Deposit: Rp ${totalDeposit.toLocaleString()}, Sisa bayar di toko: Rp ${totalRemaining.toLocaleString()}`
        showSuccess(`Pesanan Berhasil Dibuat!`, `Pesanan berhasil dibuat! ${depositText}. Silakan bayar ${methodText}.`)
      } else {
        showSuccess(`Pesanan Berhasil Dibuat!`, `Pesanan berhasil dibuat! Silakan bayar ${methodText}.`)
      }

      // Redirect to dashboard
      this.$router.push('/dashboard')
    },
    extractServiceId(rawId) {
      if (!rawId) return null
      const numericPart = parseInt(String(rawId).split('-')[0], 10)
      return Number.isNaN(numericPart) ? null : numericPart
    },
    async createOrdersAfterMidtransLink() {
      const serviceItems = this.cartItems.filter(item => item.type === 'service')
      if (!serviceItems.length) return

      const token = localStorage.getItem('authToken')
      let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
      const fallbackDate = this.getTodayDate()
      const fallbackTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

      // Fetch full user data from API to get phone number
      if (token) {
        try {
          const apiUser = await fetchCurrentUser(token)
          console.log('API User response:', apiUser)
          if (apiUser) {
            const userData = apiUser.data || apiUser.user || apiUser
            currentUser = {
              ...currentUser,
              id: userData.id || currentUser.id,
              name: userData.name || currentUser.name,
              email: userData.email || currentUser.email,
              phone: userData.phone || userData.telephone || ''
            }
            localStorage.setItem('currentUser', JSON.stringify(currentUser))
            console.log('Updated currentUser with phone:', currentUser)
          }
        } catch (err) {
          console.warn('Failed to fetch current user from API', err)
        }
      }

      const payloads = serviceItems
        .map(item => {
          const serviceId = item.serviceId || this.extractServiceId(item.id)
          if (!serviceId) return null
          
          // Calculate deposit from service deposit_percentage (default 30%)
          const totalPrice = item.price || 0
          const depositPercent = item.deposit_percentage || 30
          const depositAmount = Math.round(totalPrice * (depositPercent / 100))
          
           return {
             user_id: currentUser.id,
             user_name: currentUser.name || '',
             user_phone: currentUser.phone || currentUser.user_phone || '',
             service_id: serviceId,
             employee_id: item.employeeId || null,
             order_date: item.date || fallbackDate,
             order_time: item.time || fallbackTime,
             status_id: 1,
             notes: item.notes || null,
             price: totalPrice,
             deposit_percentage: depositPercent,
             deposit_amount: depositAmount,
             total_price: totalPrice,
             remaining_payment: totalPrice - depositAmount
           }
        })
        .filter(Boolean)

      if (!payloads.length) return

      console.log('Order payloads to /orders:', payloads)

      const createdOrders = []
      for (const payload of payloads) {
        try {
          const response = await createOrder(payload, token)
          createdOrders.push(response?.data || response)
        } catch (err) {
          console.error('Create order failed for payload', payload, err)
        }
      }

      // Auto-create progress for today's orders with status pending
      const progressPayloads = createdOrders
        .filter(order => {
          const orderDate = (order?.order_date || order?.date || '').toString().substring(0, 10)
          return orderDate === this.getTodayDate()
        })
        .map(order => ({
          order_id: order.id,
          status: 'pending'
        }))

      if (progressPayloads.length && token) {
        console.log('Progress payloads to /progress:', progressPayloads)
        await Promise.all(progressPayloads.map(p => createProgress(p, token)))
      }

// Send email reminders (non-blocking) - now handled by backend
      // this.sendEmailReminders(createdOrders, serviceItems).catch(err => {
      //   console.warn('Failed to send email reminders', err)
      // })

      return createdOrders
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
.divide-y > :not([hidden]) ~ :not([hidden]) {
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
}
</style>
