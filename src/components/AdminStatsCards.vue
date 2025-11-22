<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
    <!-- Total Users -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <!-- 👤 Users -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Total Users</p>
          <p class="text-2xl font-bold text-gray-900">{{ users.length }}</p>
        </div>
      </div>
    </div>

    <!-- Total Orders -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <!-- 📦 Orders -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Total Orders</p>
          <p class="text-2xl font-bold text-gray-900">{{ orders.length }}</p>
        </div>
      </div>
    </div>

    <!-- Services -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <!-- 🧾 Services -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Services</p>
          <p class="text-2xl font-bold text-gray-900">{{ services.length }}</p>
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <!-- 🔔 Notifications -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div class="ml-4">
          <p class="text-sm font-medium text-gray-600">Notifications</p>
          <p class="text-2xl font-bold text-gray-900">{{ (notifications || []).length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminStatsCards',
  props: {
    users: Array,
    orders: Array,
    services: Array,
    notifications: Array
  }
}
</script>
