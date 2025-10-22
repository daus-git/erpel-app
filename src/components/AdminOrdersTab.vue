<template>
  <div class="bg-white shadow-md rounded-lg p-4 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">Orders Management</h2>
        <p class="text-gray-500 text-sm">Manage and track salon customer orders</p>
      </div>
    </div>

    <!-- Responsive Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-salon-accent1 text-white">
          <tr>
            <th class="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider">ID</th>
            <th class="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider hidden sm:table-cell">User</th>
            <th class="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider">Service</th>
            <th class="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider">Status</th>
            <th class="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider hidden md:table-cell">Date</th>
            <th class="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="order in orders"
            :key="order.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-3 sm:px-6 py-3 text-gray-800 whitespace-nowrap">#{{ order.id }}</td>
            <td class="px-3 sm:px-6 py-3 text-gray-600 hidden sm:table-cell">
              <div class="max-w-[12rem] truncate">{{ order.userName }}</div>
            </td>
            <td class="px-3 sm:px-6 py-3 text-gray-800">
              <div class="max-w-[14rem] truncate">
                {{ order.items.map(i => i.name).join(', ') }}
              </div>
            </td>
            <td class="px-3 sm:px-6 py-3">
              <span
                :class="['px-2 py-1 rounded-full text-xs font-medium', statusBadgeClass(order.status)]"
              >
                {{ order.status }}
              </span>
            </td>
            <td class="px-3 sm:px-6 py-3 text-gray-500 hidden md:table-cell whitespace-nowrap">
              {{ formatDate(order.date) }}
            </td>
            <td class="px-3 sm:px-6 py-3">
              <div class="flex flex-wrap gap-2">
                <button
                  @click="$emit('view-order', order)"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View
                </button>
                <button
                  @click="$emit('edit-order', order)"
                  class="text-green-600 hover:text-green-800 font-medium"
                >
                  Edit
                </button>
                <button
                  @click="$emit('delete-order', order)"
                  class="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="!orders.length" class="text-center py-10 text-gray-500">
      No orders available.
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminOrdersTab',
  props: {
    orders: {
      type: Array,
      default: () => []
    }
  },
  emits: ['view-order', 'edit-order', 'delete-order'],
  methods: {
    statusBadgeClass(status) {
      const colors = {
        'Pending Payment': 'bg-yellow-100 text-yellow-800',
        'Processing': 'bg-blue-100 text-blue-800',
        'In Progress': 'bg-blue-100 text-blue-800',
        'Scheduled': 'bg-purple-100 text-purple-800',
        'Completed': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800'
      }
      return colors[status] || 'bg-gray-100 text-gray-800'
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
/* Responsiveness fix for small devices */
@media (max-width: 640px) {
  table {
    font-size: 0.875rem;
  }
  th, td {
    padding: 0.5rem 0.75rem;
  }
}
</style>
