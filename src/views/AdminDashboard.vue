;<template>
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
import usersData from '../data/users.json'
import ordersData from '../data/order.json'
import servicesData from '../data/services.json'
import productsData from '../data/products.json'
import progressDataFile from '../data/progress.json'
import templatesData from '../data/templates.json'
import whatsappService from '../services/whatsappService.js'
import emailService from '../services/emailService.js'
import { showError, showWarning, showSuccess } from '../utils/sweetAlert'
import {
  usersStorage,
  productsStorage,
  servicesStorage,
  ordersStorage,
  progressStorage,
  templatesStorage
} from '../utils/localStorage'
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
      users: usersStorage.get().length > 0 ? usersStorage.get() : usersData,
      orders: ordersStorage.get().length > 0 ? ordersStorage.get() : ordersData,
      services: servicesStorage.get().length > 0 ? servicesStorage.get() : servicesData,
      products: productsStorage.get().length > 0 ? productsStorage.get() : productsData,
      progressData: progressStorage.get().length > 0 ? progressStorage.get() : progressDataFile,
      templates: templatesStorage.get().length > 0 ? templatesStorage.get() : templatesData,
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
      ]
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
    },
    closeCamera() {
      this.showCamera = false
    },
    captureQR() {
      // In a real app, you would use a QR code scanning library here
      showWarning('Fitur QR Code', 'Fitur pemindaian QR Code akan diimplementasikan dengan library seperti jsQR')
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
    editUser() {
      // This method is called from AdminUsersTab, but we don't need to do anything here
      // The AdminUsersTab handles the editing internally
    },
    deleteUser(userId) {
      if (confirm('Are you sure you want to delete this user?')) {
        this.users = this.users.filter(user => user.id !== userId)
        usersStorage.set(this.users)
        showSuccess('User berhasil dihapus!', 'User telah dihapus dari sistem.')
      }
    },
    updateOrderStatus(orderId, status) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = status
        ordersStorage.set(this.orders)
        showSuccess('Status order berhasil diperbarui!', `Status order ${orderId} telah diubah menjadi ${status}.`)
      }
    },
    deleteOrder(orderId) {
      if (confirm('Are you sure you want to delete this order?')) {
        this.orders = this.orders.filter(order => order.id !== orderId)
        ordersStorage.set(this.orders)
        showSuccess('Order berhasil dihapus!', 'Order telah dihapus dari sistem.')
      }
    },
    editService(service) {
      // Implement edit service functionality
      console.log('Editing service:', service)
      showWarning('Fitur Edit Layanan', 'Fitur edit layanan akan diimplementasikan')
    },
    deleteService(serviceId) {
      if (confirm('Are you sure you want to delete this service?')) {
        this.services = this.services.filter(service => service.id !== serviceId)
        servicesStorage.set(this.services)
        showSuccess('Layanan berhasil dihapus!', 'Layanan telah dihapus dari sistem.')
      }
    },
    editProduct(product) {
      // Update the product in the array
      const index = this.products.findIndex(p => p.id === product.id)
      if (index !== -1) {
        this.products.splice(index, 1, product)
        productsStorage.set(this.products)
        showSuccess('Produk berhasil diperbarui!', 'Produk telah diperbarui.')
      }
    },
    deleteProduct(productId) {
      if (confirm('Are you sure you want to delete this product?')) {
        this.products = this.products.filter(product => product.id !== productId)
        productsStorage.set(this.products)
        showSuccess('Produk berhasil dihapus!', 'Produk telah dihapus dari sistem.')
      }
    },
    updateProgressStatus(progressId, status) {
      const progress = this.progressData.find(p => p.id === progressId)
      if (progress) {
        progress.status = status
        progressStorage.set(this.progressData)
        showSuccess('Status progress berhasil diperbarui!', `Status progress telah diubah menjadi ${status}.`)
      }
    },
    deleteProgress(progressId) {
      if (confirm('Are you sure you want to delete this progress entry?')) {
        this.progressData = this.progressData.filter(progress => progress.id !== progressId)
        progressStorage.set(this.progressData)
        showSuccess('Progress berhasil dihapus!', 'Progress entry telah dihapus dari sistem.')
      }
    },
    addService() {
      // Implement add service functionality
      showWarning('Fitur Tambah Layanan', 'Fitur tambah layanan akan diimplementasikan')
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
        showWarning('Data Tidak Lengkap', 'Silakan isi semua field')
        return
      }

      // Check if email already exists
      const existingUser = this.users.find(u => u.email === this.newUser.email)
      if (existingUser) {
        showWarning('Email Sudah Ada', 'Email sudah ada')
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
      usersStorage.set(this.users)
      this.closeAddUserModal()
      showSuccess('User Berhasil Ditambahkan!', 'User berhasil ditambahkan!')

      // Force re-render of AdminUsersTab by changing activeTab temporarily
      const currentTab = this.activeTab
      this.activeTab = ''
      this.$nextTick(() => {
        this.activeTab = currentTab
      })
    },
    saveProduct() {
      if (!this.newProduct.name || !this.newProduct.description || !this.newProduct.price) {
        showWarning('Data Tidak Lengkap', 'Silakan isi semua field yang diperlukan')
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
      productsStorage.set(this.products)
      this.closeAddProductModal()
      showSuccess('Produk Berhasil Ditambahkan!', 'Produk berhasil ditambahkan!')
    },
    handleProductImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          showWarning('Ukuran File Terlalu Besar', 'Ukuran file harus kurang dari 5MB')
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
        showError('Pelanggan Tidak Ditemukan', 'Pelanggan tidak ditemukan')
        return
      }

      // Send WhatsApp message
      whatsappService.sendStatusUpdate(customer.phone, order.id, order.status)
        .then(() => {
          showSuccess('Notifikasi Berhasil Dikirim!', 'Notifikasi berhasil dikirim!')
        })
        .catch(error => {
          console.error('Error sending notification:', error)
          showError('Gagal Mengirim Notifikasi', 'Gagal mengirim notifikasi')
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
      templatesStorage.set(this.templates)
      showSuccess('Template berhasil ditambahkan!', 'Template telah ditambahkan ke sistem.')
    },
    editTemplate(template) {
      const index = this.templates.findIndex(t => t.id === template.id)
      if (index !== -1) {
        this.templates.splice(index, 1, template)
        templatesStorage.set(this.templates)
        showSuccess('Template berhasil diperbarui!', 'Template telah diperbarui.')
      }
    },
    deleteTemplate(templateId) {
      this.templates = this.templates.filter(t => t.id !== templateId)
      templatesStorage.set(this.templates)
      showSuccess('Template berhasil dihapus!', 'Template telah dihapus dari sistem.')
    }
  }
}
</script>
