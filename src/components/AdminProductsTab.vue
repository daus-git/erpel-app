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
            <button @click="openEditModal(product)" class="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
            <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-800 text-sm">Delete</button>
          </div>
        </div>
      </div>

      <!-- Edit Product Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Edit Product</h3>
            <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveEditProduct" class="space-y-4">
            <div>
              <label for="editProductName" class="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                id="editProductName"
                v-model="editProduct.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                placeholder="Enter product name"
              >
            </div>

            <div>
              <label for="editProductDescription" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                id="editProductDescription"
                v-model="editProduct.description"
                rows="3"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                placeholder="Enter product description"
              ></textarea>
            </div>

            <div>
              <label for="editProductPrice" class="block text-sm font-medium text-gray-700 mb-2">Price (Rp)</label>
              <input
                id="editProductPrice"
                v-model.number="editProduct.price"
                type="number"
                required
                min="0"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                placeholder="Enter price"
              >
            </div>

            <div>
              <label for="editProductImage" class="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
              <input
                id="editProductImage"
                type="file"
                accept="image/*"
                @change="handleEditImageUpload"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
              >
              <div v-if="editProduct.image" class="mt-3">
                <img :src="editProduct.image" alt="Product preview" class="w-24 h-24 object-cover rounded-md shadow-sm" />
              </div>
            </div>

            <div class="flex space-x-3 mt-6">
              <button type="button" @click="closeEditModal" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" class="flex-1 px-4 py-2 bg-salon-accent1 text-white rounded-md hover:bg-salon-accent1/80">
                Update Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { generatePDF } from '@/utils/pdfGenerator.js'
import { productsStorage } from '@/utils/localStorage.js'

export default {
  name: 'AdminProductsTab',
  props: { products: Array },
  emits: ['add-product', 'edit-product', 'delete-product'],
  data() {
    return {
      showEditModal: false,
      editProduct: {
        id: null,
        name: '',
        description: '',
        price: '',
        image: ''
      }
    }
  },
  watch: {
    products: {
      handler(newProducts) {
        productsStorage.set(newProducts)
      },
      deep: true
    }
  },
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
    },
    openEditModal(product) {
      this.editProduct = { ...product }
      this.showEditModal = true
    },
    closeEditModal() {
      this.showEditModal = false
      this.editProduct = {
        id: null,
        name: '',
        description: '',
        price: '',
        image: ''
      }
    },
    saveEditProduct() {
      if (!this.editProduct.name || !this.editProduct.description || !this.editProduct.price) {
        alert('Please fill all required fields')
        return
      }

      // Update product
      this.$emit('edit-product', { ...this.editProduct })
      this.closeEditModal()
      alert('Product updated successfully!')
    },
    deleteProduct(productId) {
      if (confirm('Are you sure you want to delete this product?')) {
        this.$emit('delete-product', { id: productId })
      }
    },
    handleEditImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          alert('File size must be less than 5MB')
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          this.editProduct.image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>
