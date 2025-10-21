<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 space-y-4 sm:space-y-0">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            @click="$emit('open-camera')"
            type="button"
            class="bg-salon-accent1 hover:bg-salon-accent2 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 9a2 2 0 012-2h1.586A2 2 0 008.172 6l.707-.707A2 2 0 0110.293 5h3.414a2 2 0 011.414.586L16.828 6A2 2 0 0018.414 7H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span class="hidden sm:inline">Scan QR</span>
            <span class="sm:hidden">QR</span>
          </button>

          <button
            @click="$emit('logout')"
            type="button"
            class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium w-full sm:w-auto"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AdminDashboardHeader',
  emits: ['open-camera', 'logout']
}
</script>
