<template>
  <div class="min-h-screen bg-gray-50">
    <AdminDashboardHeader @open-camera="openCamera" @logout="logout" />

    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <AdminStatsCards :users="users" :orders="orders" :services="services" :products="products" />

      <AdminTabs :active-tab="activeTab" :tabs="tabs" @tab-change="activeTab = $event" />

      <AdminUsersTab v-if="activeTab === 'users'" :users="users" @add-user="showAddUserModal = true" @edit-user="editUser" @delete-user="deleteUser" />
      <AdminOrdersTab v-if="activeTab === 'orders'" :orders="orders" @update-order-status="updateOrderStatus" @send-notification="sendNotification" @delete-order="deleteOrder" />
      <AdminServicesTab v-if="activeTab === 'services'" :services="services" @add-service="addService" @edit-service="editService" @delete-service="deleteService" />
      <AdminProgressTab v-if="activeTab === 'progress'" :progress-data="progressData" @update-progress-status="updateProgressStatus" @delete-progress="deleteProgress" />
      <AdminProductsTab v-if="activeTab === 'products'" :products="products" @add-product="addProduct" @edit-product="editProduct" @delete-product="deleteProduct" />
      <AdminTemplatesTab v-if="activeTab === 'templates'" :templates="templates" @add-template="addTemplate" @edit-template="editTemplate" @delete-template="deleteTemplate" />
    </main>

    <AdminCameraModal :show-camera="showCamera" @close-camera="closeCamera" @capture-qr="captureQR" />
  </div>
</template>

<script>
import users from '../data/users.json'
import orders from '../data/history.json'
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
    AdminTemplatesTab
  },
  data() {
    return {
      activeTab: 'users',
      showCamera: false,
      showAddUserModal: false,
      showAddServiceModal: false,
      showAddProductModal: false,
      users: users,
      orders: orders,
      services: services,
      products: products,
      progressData: progressData,
      templates: templates,
      tabs: [
        { key: 'users', label: 'Users' },
        { key: 'orders', label: 'Orders' },
        { key: 'services', label: 'Services' },
        { key: 'progress', label: 'Progress' },
        { key: 'products', label: 'Products' },
        { key: 'templates', label: 'Templates' }
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
      // Implement add product functionality
      alert('Add product functionality to be implemented')
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
