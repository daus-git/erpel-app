<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Products Management</h3>
        <div class="flex gap-2">
          <button
            @click="printPDF"
            class="bg-salon-accent1 hover:bg-salon-accent2 text-white px-4 py-2 rounded-lg font-medium"
          >
            Print PDF
          </button>
          <button
            @click="$emit('add-product')"
            class="bg-salon-accent1 hover:bg-salon-accent2 text-white px-4 py-2 rounded-lg font-medium"
          >
            Add Product
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div v-for="product in products" :key="product.id" class="border rounded-lg p-4">
          <img :src="product.image" :alt="product.name" class="w-full h-32 object-cover rounded-lg mb-4">
          <h4 class="font-medium text-gray-900">{{ product.name }}</h4>
          <p class="text-sm text-gray-500 mt-1">{{ product.description }}</p>
          <p class="text-lg font-bold text-green-600 mt-2">Rp {{ product.price.toLocaleString() }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <button @click="$emit('edit-product', product)" class="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
            <button @click="$emit('delete-product', product)" class="text-red-600 hover:text-red-800 text-sm">Delete</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { generatePDF } from '@/utils/pdfGenerator.js'

export default {
  name: 'AdminProductsTab',
  props: { products: Array },
  emits: ['add-product', 'edit-product', 'delete-product'],
  methods: {
    async printPDF() {
      // For products, we need to create a temporary table since it's displayed as cards
      const tempTable = document.createElement('table')
      tempTable.style.width = '100%'
      tempTable.style.borderCollapse = 'collapse'
      tempTable.innerHTML = `
        <thead style="background-color: #f3f4f6;">
          <tr>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Name</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Description</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${this.products.map(product => `
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${product.name}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${product.description}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">Rp ${product.price.toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      `
      document.body.appendChild(tempTable)
      await generatePDF(tempTable, 'Products Management')
      document.body.removeChild(tempTable)
    }
  }
}
</script>
