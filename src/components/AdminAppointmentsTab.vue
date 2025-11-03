<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
      <p class="text-sm text-gray-600">Orders with pending payments and upcoming appointments</p>
    </div>

    <div class="p-6">
      <div v-if="filteredOrders.length === 0" class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No upcoming appointments</h3>
        <p class="mt-1 text-sm text-gray-500">All orders are completed or no pending payments.</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="order in filteredOrders" :key="order.id" class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <h3 class="text-lg font-semibold text-gray-900">{{ order.userName }}</h3>
                <span :class="getStatusColor(order.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ order.status }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Services with remaining payment -->
                <div v-if="getServiceItems(order).length > 0">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Services (Remaining Payment)</h4>
                  <div class="space-y-1">
                    <div v-for="item in getServiceItems(order)" :key="item.name" class="flex justify-between items-center text-sm">
                      <span class="text-gray-600">{{ item.name }}</span>
                      <span class="font-medium text-salon-accent1">Rp {{ (item.remaining || 0).toLocaleString() }}</span>
                    </div>
                  </div>
                </div>

                <!-- Products to pay at store -->
                <div v-if="getProductItems(order).length > 0">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Products (Pay at Store)</h4>
                  <div class="space-y-1">
                    <div v-for="item in getProductItems(order)" :key="item.name" class="flex justify-between items-center text-sm">
                      <span class="text-gray-600">{{ item.name }} (x{{ item.quantity }})</span>
                      <span class="font-medium text-gray-900">Rp {{ item.price.toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center space-x-1">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>{{ formatDate(order.date) }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>{{ order.time }}</span>
                  </div>
                  <!-- Pickup Date/Time for products -->
                  <div v-if="order.deliveryOption === 'pickup' && order.pickupDate" class="flex items-center space-x-1">
                    <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    <span class="text-blue-600 font-medium">Pickup: {{ formatDate(order.pickupDate) }} {{ order.pickupTime }}</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <div class="text-gray-500">Deposit Paid</div>
                      <div class="font-semibold text-green-600">Rp {{ (order.deposit || 0).toLocaleString() }}</div>
                    </div>
                    <div>
                      <div class="text-gray-500">Remaining</div>
                      <div class="font-semibold text-salon-accent1">Rp {{ (getServiceTotal(order) - (order.deposit || 0)).toLocaleString() }}</div>
                    </div>
                    <div>
                      <div class="text-gray-500">Service Total</div>
                      <div class="font-semibold text-gray-900">Rp {{ getServiceTotal(order).toLocaleString() }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminAppointmentsTab',
  props: {
    orders: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    filteredOrders() {
      const today = new Date().toISOString().split('T')[0]
      return this.orders.filter(order =>
        order.status === 'Pending Payment' ||
        order.status === 'Scheduled' ||
        order.status === 'In Progress' ||
        (order.date && order.date >= today)
      ).sort((a, b) => {
        // Sort by date, then by status priority
        const statusPriority = {
          'Pending Payment': 1,
          'Scheduled': 2,
          'In Progress': 3
        }
        const priorityA = statusPriority[a.status] || 4
        const priorityB = statusPriority[b.status] || 4

        if (priorityA !== priorityB) {
          return priorityA - priorityB
        }
        return new Date(a.date) - new Date(b.date)
      })
    }
  },
  methods: {
    getServiceItems(order) {
      if (!order || !order.items) return []
      return order.items.filter(item => item.type === 'service')
    },
    getProductItems(order) {
      if (!order || !order.items) return []
      return order.items.filter(item => item.type === 'product')
    },
    getServiceTotal(order) {
      if (!order || !order.items) return 0
      return order.items
        .filter(item => item.type === 'service')
        .reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    getStatusColor(status) {
      const colors = {
        'Pending Payment': 'bg-yellow-100 text-yellow-800',
        'Processing': 'bg-blue-100 text-blue-800',
        'Scheduled': 'bg-purple-100 text-purple-800',
        'Completed': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800'
      }
      return colors[status] || 'bg-gray-100 text-gray-800'
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
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}
</style>
