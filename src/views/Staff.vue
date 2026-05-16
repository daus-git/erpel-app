<template>
  <div class="min-h-screen bg-salon-base">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <img src="@/assets/logo.png" alt="SalonApp Logo" class="h-8 w-8 mr-2" />
            <h1 class="text-xl font-bold text-gray-800">Staff Dashboard</h1>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-salon-accent1 rounded-full flex items-center justify-center mr-2">
                <span class="text-white text-sm font-medium">{{ (currentUser.name || currentUser.email || 'S').charAt(0).toUpperCase() }}</span>
              </div>
              <span class="text-gray-700 font-medium">{{ currentUser.name || currentUser.email || 'Staff' }}</span>
            </div>
            <button @click="logout" class="bg-salon-accent1 hover:bg-salon-highlight text-white px-4 py-2 rounded-lg">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8" style="padding-top: 80px;">
      <div class="px-4 py-6 sm:px-0">
        <!-- Progress Table -->
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="bg-salon-accent1 rounded-lg p-3">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-salon-text ml-4">Order Progress</h3>
            </div>
            <button @click="openQrScanner" class="bg-gradient-to-r from-salon-accent1 to-salon-accent2 hover:from-salon-highlight hover:to-salon-accent1 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              <svg class="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 4C23 2.34315 21.6569 1 20 1H16C15.4477 1 15 1.44772 15 2C15 2.55228 15.4477 3 16 3H20C20.5523 3 21 3.44772 21 4V8C21 8.55228 21.4477 9 22 9C22.5523 9 23 8.55228 23 8V4Z" fill="#ffffff"></path>
                <path d="M23 16C23 15.4477 22.5523 15 22 15C21.4477 15 21 15.4477 21 16V20C21 20.5523 20.5523 21 20 21H16C15.4477 21 15 21.4477 15 22C15 22.5523 15.4477 23 16 23H20C21.6569 23 23 21.6569 23 20V16Z" fill="#ffffff"></path>
                <path d="M4 21C3.44772 21 3 20.5523 3 20V16C3 15.4477 2.55228 15 2 15C1.44772 15 1 15.4477 1 16V20C1 21.6569 2.34315 23 4 23H8C8.55228 23 9 22.5523 9 22C9 21.4477 8.55228 21 8 21H4Z" fill="#ffffff"></path>
                <path d="M1 8C1 8.55228 1.44772 9 2 9C2.55228 9 3 8.55228 3 8V4C3 3.44772 3.44772 3 4 3H8C8.55228 3 9 2.55228 9 2C9 1.44772 8.55228 1 8 1H4C2.34315 1 1 2.34315 1 4V8Z" fill="#ffffff"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11 6C11 5.44772 10.5523 5 10 5H6C5.44772 5 5 5.44772 5 6V10C5 10.5523 5.44772 11 6 11H10C10.5523 11 11 10.5523 11 10V6ZM9 7.5C9 7.22386 8.77614 7 8.5 7H7.5C7.22386 7 7 7.22386 7 7.5V8.5C7 8.77614 7.22386 9 7.5 9H8.5C8.77614 9 9 8.77614 9 8.5V7.5Z" fill="#ffffff"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M18 13C18.5523 13 19 13.4477 19 14V18C19 18.5523 18.5523 19 18 19H14C13.4477 19 13 18.5523 13 18V14C13 13.4477 13.4477 13 14 13H18ZM15 15.5C15 15.2239 15.2239 15 15.5 15H16.5C16.7761 15 17 15.2239 17 15.5V16.5C17 16.7761 16.7761 17 16.5 17H15.5C15.2239 17 15 16.7761 15 16.5V15.5Z" fill="#ffffff"></path>
                <path d="M14 5C13.4477 5 13 5.44772 13 6C13 6.55229 13.4477 7 14 7H16.5C16.7761 7 17 7.22386 17 7.5V10C17 10.5523 17.4477 11 18 11C18.5523 11 19 10.5523 19 10V6C19 5.44772 18.5523 5 18 5H14Z" fill="#ffffff"></path>
                <path d="M14 8C13.4477 8 13 8.44771 13 9V10C13 10.5523 13.4477 11 14 11C14.5523 11 15 10.5523 15 10V9C15 8.44772 14.5523 8 14 8Z" fill="#ffffff"></path>
                <path d="M6 13C5.44772 13 5 13.4477 5 14V16C5 16.5523 5.44772 17 6 17C6.55229 17 7 16.5523 7 16V15.5C7 15.2239 7.22386 15 7.5 15H10C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13H6Z" fill="#ffffff"></path>
                <path d="M10 17C9.44771 17 9 17.4477 9 18C9 18.5523 9.44771 19 10 19C10.5523 19 11 18.5523 11 18C11 17.4477 10.5523 17 10 17Z" fill="#ffffff"></path>
              </svg>
              <span class="font-semibold">Scan QR Pelanggan</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Code</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="order in progressOrders" :key="order.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.booking_code }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.user_name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    <span v-if="order.service?.name">{{ order.service.name }}</span>
                    <span v-else-if="order.items && order.items.length">
                      <span v-for="item in order.items" :key="item.id" class="block mb-1">
                        {{ item.service_name || item.name }}
                      </span>
                    </span>
                    <span v-else>-</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span v-if="order.employee?.name">{{ order.employee.name }}</span>
                    <span v-else-if="order.employee_name">{{ order.employee_name }}</span>
                    <span v-else-if="order.employee_id && getEmployeeName(order.employee_id)">{{ getEmployeeName(order.employee_id) }}</span>
                    <span v-else>-</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ order.order_time || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClass(order.status_id)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getStatusText(order.status_id) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button v-if="order.status_id === 2" @click="checkInOrder(order.id)" class="text-blue-600 hover:text-blue-900 mr-2">Check In</button>
                    <button v-if="order.status_id === 3" @click="startOrder(order.id)" class="text-green-600 hover:text-green-900 mr-2">Start</button>
                    <button v-if="order.status_id === 4" @click="completeOrder(order.id)" class="text-purple-600 hover:text-purple-900">Complete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Progress Orders Cards -->
        <div v-if="progressOrders.length > 0" class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="bg-salon-accent1 rounded-lg p-3">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-salon-text ml-4">Active Orders</h3>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="order in progressOrders" :key="order.id" class="bg-salon-base rounded-lg shadow-md p-6 border border-gray-200">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h4 class="text-lg font-semibold text-salon-text">{{ order.booking_code }}</h4>
                  <p class="text-sm text-gray-600">{{ order.user_name }}</p>
                </div>
                <span :class="getStatusClass(order.status_id)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                  {{ getStatusText(order.status_id) }}
                </span>
              </div>

              <div class="mb-4 space-y-2">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ order.order_time || '-' }}
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  {{ order.employee?.name || '-' }}
                </div>
                <div class="mt-2">
                  <p class="text-sm font-medium text-salon-text">Services:</p>
                  <span v-if="order.service?.name" class="text-sm text-gray-700">{{ order.service.name }}</span>
                  <span v-else-if="order.items && order.items.length">
                    <span v-for="item in order.items" :key="item.id" class="text-sm text-gray-700 block">
                      {{ item.service_name || item.name }}
                    </span>
                  </span>
                  <span v-else class="text-sm text-gray-500">-</span>
                </div>
              </div>

              <div class="flex justify-end space-x-2">
                <button v-if="order.status_id === 2" @click="checkInOrder(order.id)" class="bg-salon-accent1 hover:bg-salon-highlight text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Check In
                </button>
                <button v-if="order.status_id === 3" @click="startOrder(order.id)" class="bg-salon-accent1 hover:bg-salon-highlight text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Start Service
                </button>
                <button v-if="order.status_id === 4" @click="completeOrder(order.id)" class="bg-salon-accent1 hover:bg-salon-highlight text-white px-4 py-2 rounded-lg text-sm font-medium">
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- QR Scanner Modal -->
    <div v-if="showQrScanner" class="fixed inset-0 bg-salon-base/90 flex items-center justify-center z-50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-salon-accent1/10 rounded-full mb-4">
            <svg class="h-8 w-8 text-salon-accent1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23 4C23 2.34315 21.6569 1 20 1H16C15.4477 1 15 1.44772 15 2C15 2.55228 15.4477 3 16 3H20C20.5523 3 21 3.44772 21 4V8C21 8.55228 21.4477 9 22 9C22.5523 9 23 8.55228 23 8V4Z" fill="currentColor"></path>
              <path d="M23 16C23 15.4477 22.5523 15 22 15C21.4477 15 21 15.4477 21 16V20C21 20.5523 20.5523 21 20 21H16C15.4477 21 15 21.4477 15 22C15 22.5523 15.4477 23 16 23H20C21.6569 23 23 21.6569 23 20V16Z" fill="currentColor"></path>
              <path d="M4 21C3.44772 21 3 20.5523 3 20V16C3 15.4477 2.55228 15 2 15C1.44772 15 1 15.4477 1 16V20C1 21.6569 2.34315 23 4 23H8C8.55228 23 9 22.5523 9 22C9 21.4477 8.55228 21 8 21H4Z" fill="currentColor"></path>
              <path d="M1 8C1 8.55228 1.44772 9 2 9C2.55228 9 3 8.55228 3 8V4C3 3.44772 3.44772 3 4 3H8C8.55228 3 9 2.55228 9 2C9 1.44772 8.55228 1 8 1H4C2.34315 1 1 2.34315 1 4V8Z" fill="currentColor"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11 6C11 5.44772 10.5523 5 10 5H6C5.44772 5 5 5.44772 5 6V10C5 10.5523 5.44772 11 6 11H10C10.5523 11 11 10.5523 11 10V6ZM9 7.5C9 7.22386 8.77614 7 8.5 7H7.5C7.22386 7 7 7.22386 7 7.5V8.5C7 8.77614 7.22386 9 7.5 9H8.5C8.77614 9 9 8.77614 9 8.5V7.5Z" fill="currentColor"></path>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M18 13C18.5523 13 19 13.4477 19 14V18C19 18.5523 18.5523 19 18 19H14C13.4477 19 13 18.5523 13 18V14C13 13.4477 13.4477 13 14 13H18ZM15 15.5C15 15.2239 15.2239 15 15.5 15H16.5C16.7761 15 17 15.2239 17 15.5V16.5C17 16.7761 16.7761 17 16.5 17H15.5C15.2239 17 15 16.7761 15 16.5V15.5Z" fill="currentColor"></path>
              <path d="M14 5C13.4477 5 13 5.44772 13 6C13 6.55229 13.4477 7 14 7H16.5C16.7761 7 17 7.22386 17 7.5V10C17 10.5523 17.4477 11 18 11C18.5523 11 19 10.5523 19 10V6C19 5.44772 18.5523 5 18 5H14Z" fill="currentColor"></path>
              <path d="M14 8C13.4477 8 13 8.44771 13 9V10C13 10.5523 13.4477 11 14 11C14.5523 11 15 10.5523 15 10V9C15 8.44772 14.5523 8 14 8Z" fill="currentColor"></path>
              <path d="M6 13C5.44772 13 5 13.4477 5 14V16C5 16.5523 5.44772 17 6 17C6.55229 17 7 16.5523 7 16V15.5C7 15.2239 7.22386 15 7.5 15H10C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13H6Z" fill="currentColor"></path>
              <path d="M10 17C9.44771 17 9 17.4477 9 18C9 18.5523 9.44771 19 10 19C10.5523 19 11 18.5523 11 18C11 17.4477 10.5523 17 10 17Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Scan QR Code Pelanggan</h2>
          <p class="text-gray-500">Arahkan kamera ke QR code pelanggan</p>
        </div>
        <div id="qr-reader" class="w-full rounded-xl overflow-hidden border-2 border-dashed border-salon-accent1/30 bg-gray-50"></div>
        <div class="mt-6 flex justify-center">
          <button @click="closeQrScanner" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium transition-colors flex items-center">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Tutup Scanner
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchOrders, fetchEmployees, updateOrderStatus, sendCustomerNotification } from '@/services/apiService'
import { showSuccess, showError, showWarning } from '@/utils/sweetAlert'
import { Html5Qrcode } from 'html5-qrcode'

export default {
  name: 'StaffView',
  data() {
    return {
      progressOrders: [],
      employees: [],
      showQrScanner: false,
      qrScanner: null,
      isScannerActive: false
    }
  },
  computed: {
    currentUser() {
      const user = localStorage.getItem('currentUser')
      return user ? JSON.parse(user) : {}
    },
    checkedInOrders() {
      return this.progressOrders.filter(order => order.status_id === 3)
    }
  },
  async mounted() {
    if (!this.currentUser.email) {
      this.$router.push('/login')
      return
    }
    const level = this.currentUser.level
    if (level !== 'staff' && level !== 'employee' && level !== 'admin') {
      this.$router.push('/dashboard')
      return
    }
    await this.loadProgressOrders()
  },
  methods: {
    async loadProgressOrders() {
      try {
        const token = localStorage.getItem('authToken')
        const [orders, employees] = await Promise.all([
          fetchOrders(token),
          fetchEmployees(token)
        ])
        this.employees = employees || []
        
        console.log('Employees loaded:', this.employees.length)
        console.log('Sample employee:', this.employees[0])
        console.log('Sample order:', orders[0])
        
        // Filter orders that are confirmed, checked_in, or in_progress
        // and map employee data
        this.progressOrders = orders
          .filter(order => [2, 3, 4].includes(order.status_id))
          .map(order => {
            // If employee object not present, find from employees list
            if (!order.employee && order.employee_id) {
              const emp = this.employees.find(e => e.id === order.employee_id)
              if (emp) {
                order.employee = emp
              }
            }
            return order
          })
      } catch (error) {
        console.error('Failed to load orders:', error)
        showError('Error', 'Failed to load progress orders')
      }
    },
    getEmployeeName(employeeId) {
      const emp = this.employees.find(e => e.id === employeeId)
      return emp ? emp.name : null
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
      return statusMap[statusId] || 'Unknown'
    },
    getStatusClass(statusId) {
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
    formatDateTime(date, time) {
      if (!date) return '-'
      const dateTime = new Date(`${date}T${time || '00:00'}`)
      return dateTime.toLocaleString()
    },
    async checkInOrder(orderId) {
      try {
        await updateOrderStatus(orderId, 3, localStorage.getItem('authToken'))
        showSuccess('Success', 'Order checked in successfully')
        await this.loadProgressOrders()
      } catch (error) {
        showError('Error', 'Failed to check in order')
      }
    },
    async startOrder(orderId) {
      try {
        await updateOrderStatus(orderId, 4, localStorage.getItem('authToken'))
        showSuccess('Success', 'Order started successfully')
        await this.loadProgressOrders()
      } catch (error) {
        showError('Error', 'Failed to start order')
      }
    },
    async completeOrder(orderId) {
      try {
        await updateOrderStatus(orderId, 5, localStorage.getItem('authToken'))
        // Send notification to customer
        const order = this.progressOrders.find(o => o.id === orderId)
        if (order && order.user_id) {
          await sendCustomerNotification({
            user_id: order.user_id,
            type: 'general',
            message: `Your order ${order.booking_code} has been completed. Thank you for choosing our salon!`
          }, localStorage.getItem('authToken'))
        }
        showSuccess('Success', 'Order completed and customer notified')
        await this.loadProgressOrders()
      } catch (error) {
        showError('Error', 'Failed to complete order')
      }
    },
    openQrScanner() {
      if (this.isScannerActive) {
        showWarning('Scanner Busy', 'Scanner sedang aktif. Tunggu sebentar.')
        return
      }

      this.showQrScanner = true
      this.isScannerActive = true
      this.$nextTick(() => {
        this.startQrScanner()
      })
    },
    closeQrScanner() {
      this.showQrScanner = false
      this.stopQrScanner()
      // Allow reopening after a short delay
      setTimeout(() => {
        this.isScannerActive = false
      }, 1000)
    },
    startQrScanner() {
      // Clear any existing scanner
      this.stopQrScanner()

      try {
        this.qrScanner = new Html5Qrcode('qr-reader')
        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        }
        
        // Start only camera scanning, no file upload
        this.qrScanner.start(
          { facingMode: 'environment' }, // Use rear camera
          config,
          (decodedText) => {
            this.handleQrResult(decodedText)
          },
          (error) => {
            // QR code detection errors are expected, only log critical errors
            console.log('QR scan error:', error)
          }
        ).catch((err) => {
          console.error('Failed to start camera:', err)
          showError('Camera Error', 'Gagal membuka kamera. Pastikan izin kamera diberikan.')
          this.closeQrScanner()
        })
      } catch (error) {
        console.error('Failed to initialize QR scanner:', error)
        showError('Scanner Error', 'Gagal menginisialisasi scanner QR')
        this.closeQrScanner()
      }
    },
    stopQrScanner() {
      if (this.qrScanner) {
        try {
          if (this.qrScanner.isScanning) {
            this.qrScanner.stop().then(() => {
              this.qrScanner.clear().catch(console.error)
            }).catch(console.error)
          } else {
            this.qrScanner.clear().catch(console.error)
          }
        } catch (error) {
          console.error('Error stopping QR scanner:', error)
        }
        this.qrScanner = null
      }
    },
    async handleQrResult(qrData) {
      // Immediately stop scanner to release camera
      this.stopQrScanner()
      this.showQrScanner = false
      this.isScannerActive = false

      try {
        // Find order by booking code
        const orders = await fetchOrders(localStorage.getItem('authToken'))
        const order = orders.find(o => o.booking_code === qrData)
        if (order) {
          if (order.status_id === 2) {
            await this.checkInOrder(order.id)
          } else {
            showWarning('Info', 'Order is not in confirmed status')
          }
        } else {
          showError('Error', 'Order not found')
        }
      } catch (error) {
        console.error('Error processing QR result:', error)
        showError('Error', 'Failed to process QR code')
      }
    },
    logout() {
      localStorage.removeItem('authToken')
      localStorage.removeItem('currentUser')
      this.$router.push('/login')
    },
    beforeUnmount() {
      this.stopQrScanner()
    }
  }
}
</script>

<style scoped>
#qr-reader {
  width: 100%;
  min-height: 300px;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

#qr-reader video {
  width: 100% !important;
  height: auto !important;
  object-fit: cover;
}
</style>