<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Stock Management</h3>
          <p class="text-gray-500 text-sm">Monitor and manage product stock levels</p>
        </div>
        <button
          @click="generateStockPDF"
          class="bg-salon-accent1 hover:bg-salon-accent2 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
        >
          Print Stock PDF
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto -mx-4 sm:mx-0">
        <table id="stock-table" class="min-w-full divide-y divide-gray-200">
          <thead class="bg-salon-accent1 text-white">
            <tr>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Product Name</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Category</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Current Stock</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Min Stock</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Max Stock</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Unit</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="item in stock"
              :key="item.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                #{{ item.id }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-900 truncate max-w-[12rem]">
                {{ item.productName }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                {{ item.category }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-900 font-medium">
                {{ item.currentStock }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                {{ item.minStock }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                {{ item.maxStock }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500">
                {{ item.unit }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm">
                <span
                  :class="['px-2 py-1 rounded-full text-xs font-medium', stockStatusClass(item)]"
                >
                  {{ stockStatusText(item) }}
                </span>
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500">
                <div class="flex space-x-2">
                  <button
                    @click="editStock(item)"
                    class="text-salon-accent1 hover:text-salon-accent2 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteStock(item.id)"
                    class="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="stock.length === 0">
              <td colspan="9" class="text-center py-6 text-gray-500">
                No stock items found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import productsData from '@/data/products.json'
import { generatePDF } from '@/utils/pdfGenerator.js'

export default {
  name: 'AdminStockTab',
  data() {
    return {
      stock: productsData.map(product => ({
        id: product.id,
        productName: product.name,
        category: product.category,
        currentStock: product.stock,
        minStock: Math.floor(product.stock * 0.2), // 20% of current stock as min
        maxStock: Math.floor(product.stock * 1.5), // 150% of current stock as max
        unit: 'pcs'
      }))
    }
  },
  methods: {
    stockStatusClass(item) {
      if (item.currentStock <= item.minStock) {
        return 'bg-red-100 text-red-800' // Low stock
      } else if (item.currentStock >= item.maxStock) {
        return 'bg-blue-100 text-blue-800' // Overstock
      } else {
        return 'bg-green-100 text-green-800' // Normal stock
      }
    },
    stockStatusText(item) {
      if (item.currentStock <= item.minStock) {
        return 'Low Stock'
      } else if (item.currentStock >= item.maxStock) {
        return 'Overstock'
      } else {
        return 'Normal'
      }
    },
    generateStockPDF() {
      const tableElement = document.getElementById('stock-table')
      if (tableElement) {
        generatePDF(tableElement, 'Stock Report')
      } else {
        alert('Table not found. Please try again.')
      }
    },
    deleteStock(stockId) {
      if (confirm('Are you sure you want to delete this stock item?')) {
        this.stock = this.stock.filter(item => item.id !== stockId)
        // In a real app, you would save to backend
      }
    },
    editStock(item) {
      // Implement edit stock functionality
      console.log('Editing stock item:', item)
      alert('Edit stock functionality to be implemented')
    }
  }
}
</script>

<style scoped>
/* Responsiveness tweak for smaller screens */
@media (max-width: 640px) {
  table th, table td {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>
