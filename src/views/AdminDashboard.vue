<template>
  <div class="min-h-screen bg-gray-50">
    <AdminDashboardHeader @open-camera="openCamera" @logout="logout" />

    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <AdminStatsCards :users="users" :orders="orders" :services="services" :products="products" />

      <AdminTabs :active-tab="activeTab" :tabs="tabs" @tab-change="activeTab = $event" />

      <AdminUsersTab v-if="activeTab === 'users'" :users="users" @add-user="showAddUserModal = true" @edit-user="editUser" @delete-user="deleteUser" />
      <AdminOrdersTab v-if="activeTab === 'orders'" :orders="orders" />
      <AdminAppointmentsTab v-if="activeTab === 'appointments'" :orders="orders" />
      <AdminServicesTab v-if="activeTab === 'services'" :services="services" @add-service="addService" @edit-service="editService" @delete-service="deleteService" />
      <AdminProgressTab v-if="activeTab === 'progress'" :progress-data="progressData" @update-progress-status="updateProgressStatus" @delete-progress="deleteProgress" />
      <AdminProductsTab v-if="activeTab === 'products'" :products="products" @add-product="addProduct" @edit-product="editProduct" @delete-product="deleteProduct" />
      <AdminTemplatesTab v-if="activeTab === 'templates'" :templates="templates" @add-template="addTemplate" @edit-template="editTemplate" @delete-template="deleteTemplate" />
      <AdminTransactionsTab v-if="activeTab === 'transactions'" />
      <AdminStockTab v-if="activeTab === 'stock'" />
    </main>

    <AdminCameraModal :show-camera="showCamera" @close-camera="closeCamera" @capture-qr="captureQR" />

    <!-- Add User Modal -->
    <div v-if="showAddUserModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Add New User</h3>
          <button @click="closeAddUserModal" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveUser" class="space-y-4">
          <div>
            <label for="userName" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              id="userName"
              v-model="newUser.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
              placeholder="Enter full name"
            >
          </div>

          <div>
            <label for="userPhone" class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              id="userPhone"
              v-model="newUser.phone"
              type="tel"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
              placeholder="Enter phone number"
            >
          </div>

          <div>
            <label for="userEmail" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              id="userEmail"
              v-model="newUser.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
              placeholder="Enter email"
            >
          </div>

          <div>
            <label for="userPassword" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              id="userPassword"
              v-model="newUser.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
              placeholder="Enter password"
            >
          </div>

          <div>
            <label for="userLevel" class="block text-sm font-medium text-gray-700 mb-2">Account Level</label>
            <select
              id="userLevel"
              v-model="newUser.level"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
            >
              <option value="">Select level</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="flex space-x-3 mt-6">
            <button type="button" @click="closeAddUserModal" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" class="flex-1 px-4 py-2 bg-salon-accent1 text-white rounded-md hover:bg-salon-accent1/80">
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Product Modal -->
    <div v-if="showAddProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Add New Product</h3>
          <button @click="closeAddProductModal" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="space-y-4">
          <div>
            <label for="productName" class="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input
              id="productName"
              v-model="newProduct.name"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
              placeholder="Enter product name"
            >
          </div>

          <div>
            <label for="productDescription" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              id="productDescription"
              v-model="newProduct.description"
              rows="3"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
              placeholder="Enter product description"
            ></textarea>
          </div>

          <div>
            <label for="productPrice" class="block text-sm font-medium text-gray-700 mb-2">Price (Rp)</label>
            <input
              id="productPrice"
              v-model.number="newProduct.price"
              type="number"
              required
              min="0"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
              placeholder="Enter price"
            >
          </div>

          <div>
            <label for="productImage" class="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <input
              id="productImage"
              type="file"
              accept="image/*"
              @change="handleProductImageUpload"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
            >
            <div v-if="newProduct.image" class="mt-3">
              <img :src="newProduct.image" alt="Product preview" class="w-24 h-24 object-cover rounded-md shadow-sm" />
            </div>
          </div>

          <div class="flex space-x-3 mt-6">
            <button type="button" @click="closeAddProductModal" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" class="flex-1 px-4 py-2 bg-salon-accent1 text-white rounded-md hover:bg-salon-accent1/80">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import users from '../data/users.json'
import orders from '../data/order.json'
import services from '../data/services.json'
import products from '../data/products.json'
import progressData from '../data/progress.json'
import templates from '../data/templates.json'
import whatsappService from '../services/whatsappService.js'
import emailService from '../services/emailService.js'
import AdminDashboardHeader from '../components/AdminDashboardHeader.vue'
import AdminStatsCards from '../components/AdminStatsCards.vue'
import AdminTabs from '../components/AdminTabs.vue'
import AdminUsersTab from '../components/AdminUsersTab.vue'
import AdminOrdersTab from '../components/AdminOrdersTab.vue'
import AdminServicesTab from '../components/AdminServicesTab.vue'
import AdminProgressTab from '../components/AdminProgressTab.vue'
import AdminProductsTab from '../components/AdminProductsTab.vue'
import AdminCameraModal from '../components/AdminCameraModal.vue'
import AdminTemplatesTab from '../components/AdminTemplatesTab.vue'
import AdminTransactionsTab from '../components/AdminTransactionsTab.vue'
import AdminStockTab from '../components/AdminStockTab.vue'
import AdminAppointmentsTab from '../components/AdminAppointmentsTab.vue'

export default {
  name: 'AdminDashboard',
  components: {
    AdminDashboardHeader,
    AdminStatsCards,
    AdminTabs,
    AdminUsersTab,
    AdminOrdersTab,
    AdminServicesTab,
    AdminProgressTab,
    AdminProductsTab,
    AdminCameraModal,
    AdminTemplatesTab,
    AdminTransactionsTab,
    AdminStockTab,
    AdminAppointmentsTab
  },
  data() {
    return {
      activeTab: 'users',
      showCamera: false,
      showAddUserModal: false,
      showAddServiceModal: false,
      showAddProductModal: false,
      newUser: {
        name: '',
        phone: '',
        email: '',
        password: '',
        level: ''
      },
      newProduct: {
        name: '',
        description: '',
        price: '',
        image: ''
      },
      users: users,
      orders: orders,
      services: services,
      products: products,
      progressData: progressData,
      templates: templates,
      tabs: [
        { key: 'users', label: 'Users' },
        { key: 'orders', label: 'Orders' },
        { key: 'appointments', label: 'Appointments' },
        { key: 'services', label: 'Services' },
        { key: 'progress', label: 'Progress' },
        { key: 'products', label: 'Products' },
        { key: 'templates', label: 'Templates' },
        { key: 'transactions', label: 'Transactions' },
        { key: 'stock', label: 'Stock' }
      ],
      stream: null
    }
  },
  mounted() {
    // Check if user is admin
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (!currentUser.level || currentUser.level !== 'admin') {
      this.$router.push('/login')
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('currentUser')
      this.$router.push('/login')
    },
    openCamera() {
      this.showCamera = true
      this.startCamera()
    },
    async startCamera() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        this.$refs.video.srcObject = this.stream
      } catch (error) {
        console.error('Error accessing camera:', error)
        alert('Unable to access camera. Please check permissions.')
      }
    },
    closeCamera() {
      this.showCamera = false
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop())
      }
    },
    captureQR() {
      // In a real app, you would use a QR code scanning library here
      alert('QR Code scanning functionality would be implemented with a library like jsQR')
      this.closeCamera()
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
      return new Date(dateString).toLocaleDateString()
    },
    editUser(user) {
      // Implement edit user functionality
      console.log('Editing user:', user)
      alert('Edit user functionality to be implemented')
    },
    deleteUser(userId) {
      if (confirm('Are you sure you want to delete this user?')) {
        this.users = this.users.filter(user => user.id !== userId)
        // In a real app, you would save to backend
      }
    },
    updateOrderStatus(orderId, status) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = status
        // In a real app, you would save to backend
      }
    },
    deleteOrder(orderId) {
      if (confirm('Are you sure you want to delete this order?')) {
        this.orders = this.orders.filter(order => order.id !== orderId)
        // In a real app, you would save to backend
      }
    },
    editService(service) {
      // Implement edit service functionality
      console.log('Editing service:', service)
      alert('Edit service functionality to be implemented')
    },
    deleteService(serviceId) {
      if (confirm('Are you sure you want to delete this service?')) {
        this.services = this.services.filter(service => service.id !== serviceId)
        // In a real app, you would save to backend
      }
    },
    editProduct(product) {
      // Implement edit product functionality
      console.log('Editing product:', product)
      alert('Edit product functionality to be implemented')
    },
    deleteProduct(productId) {
      if (confirm('Are you sure you want to delete this product?')) {
        this.products = this.products.filter(product => product.id !== productId)
        // In a real app, you would save to backend
      }
    },
    updateProgressStatus(progressId, status) {
      const progress = this.progressData.find(p => p.id === progressId)
      if (progress) {
        progress.status = status
        // In a real app, you would save to backend
      }
    },
    deleteProgress(progressId) {
      if (confirm('Are you sure you want to delete this progress entry?')) {
        this.progressData = this.progressData.filter(progress => progress.id !== progressId)
        // In a real app, you would save to backend
      }
    },
    addService() {
      // Implement add service functionality
      alert('Add service functionality to be implemented')
    },
    addProduct() {
      this.showAddProductModal = true
    },
    closeAddUserModal() {
      this.showAddUserModal = false
      this.newUser = {
        name: '',
        phone: '',
        email: '',
        password: '',
        level: ''
      }
    },
    closeAddProductModal() {
      this.showAddProductModal = false
      this.newProduct = {
        name: '',
        description: '',
        price: '',
        image: ''
      }
    },
    saveUser() {
      if (!this.newUser.name || !this.newUser.phone || !this.newUser.email || !this.newUser.password || !this.newUser.level) {
        alert('Please fill in all fields')
        return
      }

      // Check if email already exists
      const existingUser = this.users.find(u => u.email === this.newUser.email)
      if (existingUser) {
        alert('Email already exists')
        return
      }

      // Create new user
      const user = {
        id: this.users.length + 1,
        name: this.newUser.name,
        phone: this.newUser.phone,
        email: this.newUser.email,
        password: this.newUser.password,
        level: this.newUser.level
      }

      this.users.push(user)
      this.closeAddUserModal()
      alert('User added successfully!')
    },
    saveProduct() {
      if (!this.newProduct.name || !this.newProduct.description || !this.newProduct.price) {
        alert('Please fill in all required fields')
        return
      }

      // Create new product
      const product = {
        id: this.products.length + 1,
        name: this.newProduct.name,
        description: this.newProduct.description,
        price: parseInt(this.newProduct.price),
        image: this.newProduct.image || 'https://via.placeholder.com/300x200?text=No+Image'
      }

      this.products.push(product)
      this.closeAddProductModal()
      alert('Product added successfully!')
    },
    handleProductImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          alert('File size must be less than 5MB')
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          this.newProduct.image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    sendNotification(order) {
      // Find customer details
      const customer = this.users.find(u => u.id === order.userId)
      if (!customer) {
        alert('Customer not found')
        return
      }

      // Send WhatsApp message
      whatsappService.sendStatusUpdate(customer.phone, order.id, order.status)
        .then(() => {
          alert('Notification sent successfully!')
        })
        .catch(error => {
          console.error('Error sending notification:', error)
          alert('Failed to send notification')
        })

      // Optionally send email as well
      if (customer.email) {
        emailService.sendStatusUpdate(customer.email, customer.name, order.id, order.status)
          .then(() => {
            console.log('Email notification sent successfully!')
          })
          .catch(error => {
            console.error('Error sending email notification:', error)
          })
      }
    },
    addTemplate(template) {
      this.templates.push(template)
      // In a real app, you would save to backend
    },
    editTemplate(template) {
      const index = this.templates.findIndex(t => t.id === template.id)
      if (index !== -1) {
        this.templates.splice(index, 1, template)
        // In a real app, you would save to backend
      }
    },
    deleteTemplate(templateId) {
      this.templates = this.templates.filter(t => t.id !== templateId)
      // In a real app, you would save to backend
    }
  }
}
</script>
