<template>
  <div class="mb-6">
    <!-- wrapper untuk scroll horizontal -->
    <div class="overflow-x-auto">
      <nav
        class="flex flex-nowrap sm:flex-row space-x-2 sm:space-x-2 lg:space-x-4 bg-white rounded-lg shadow-sm p-1 whitespace-nowrap"
        aria-label="Tabs"
      >
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="$emit('tab-change', tab.key)"
          :class="[
            'inline-flex items-center justify-center flex-shrink-0 py-2 px-4 rounded-md font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salon-accent1',
            activeTab === tab.key ? 'bg-salon-accent1 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          ]"
          type="button"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminTabs',
  props: {
    activeTab: String,
    tabs: Array
  },
  emits: ['tab-change']
}
</script>
