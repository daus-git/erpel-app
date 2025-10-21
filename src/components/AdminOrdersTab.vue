<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Orders Management</h3>

      <div class="overflow-x-auto -mx-4 sm:mx-0">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">User</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order.id">
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-900 whitespace-nowrap">#{{ order.id }}</td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                <div class="max-w-[14rem] truncate">{{ order.userName }}</div>
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-900">
                <div class="max-w-[16rem] truncate">{{ order.serviceName }}</div>
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm">
                <span :class="['px-2 py-1 rounded-full text-xs font-medium', statusBadgeClass(order.status)]">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden md:table-cell whitespace-nowrap">
                {{ formatDate(order.date) }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm">
                <div class="flex flex-wrap gap-2">
                  <button @click="$emit('view-order', order)" class="text-indigo-600 hover:text-indigo-900">View</button>
                  <button @click="$emit('edit-order', order)" class="text-green-600 hover:text-green-800">Edit</button>
                  <button @click="$emit('delete-order', order)" class="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminOrdersTab',
  props: { orders: Array },
  emits: ['view-order', 'edit-order', 'delete-order'],
  methods: {
    statusBadgeClass(status) {
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
      return new Date(dateString).toLocaleDateString()
    }
  }
}
</script>
