<template>
  <div class="min-h-screen bg-salon-base">
    <!-- Navigation -->
    <DashboardHeader />

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8" style="padding-top: 80px;">
      <div class="px-4 py-6 sm:px-0">
        <!-- Back Button -->
        <div class="mb-6">
          <router-link to="/dashboard" class="inline-flex items-center text-salon-accent1 hover:text-salon-accent1/80 transition-colors duration-200">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Dashboard
          </router-link>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div class="flex items-center mb-6">
            <div class="bg-salon-accent1 rounded-lg p-3">
              <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 ml-4">Account Settings</h3>
          </div>

          <form @submit.prevent="saveProfile" class="space-y-6">
            <!-- Profile Photo -->
            <div class="flex items-center space-x-6">
              <div class="flex-shrink-0">
                <img
                  :src="profilePhoto || defaultAvatar"
                  alt="Profile Photo"
                  class="h-24 w-24 rounded-full object-cover border-4 border-gray-200"
                >
              </div>
              <div class="flex-1">
                <label for="photo" class="block text-sm font-medium text-gray-700 mb-2">
                  Profile Photo
                </label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  @change="handlePhotoUpload"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-salon-accent1 file:text-white hover:file:bg-salon-accent1/80"
                >
                <p class="mt-1 text-sm text-gray-500">Upload a new profile photo (JPG, PNG, max 5MB)</p>
              </div>
            </div>

            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                v-model="formData.name"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                placeholder="Enter your full name"
              >
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                required
                v-model="formData.phone"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                placeholder="Enter your phone number"
              >
            </div>

            <!-- Address -->
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <textarea
                id="address"
                rows="3"
                v-model="formData.address"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                placeholder="Enter your delivery address"
              ></textarea>
              <p class="mt-1 text-sm text-gray-500">This address will be used for product delivery</p>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                v-model="formData.email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                placeholder="Enter your email"
              >
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                New Password (leave blank to keep current)
              </label>
              <input
                id="password"
                type="password"
                v-model="formData.password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                placeholder="Enter new password"
              >
            </div>

            <!-- Account Level (Read-only) -->
            <div>
              <label for="level" class="block text-sm font-medium text-gray-700 mb-2">
                Account Level
              </label>
              <input
                id="level"
                type="text"
                :value="formData.level"
                readonly
                class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                placeholder="Account level"
              >
            </div>

            <!-- Save Button -->
            <div class="flex justify-between">
              <button
                @click="logout"
                class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                Logout
              </button>
              <button
                type="submit"
                class="bg-salon-accent1 hover:bg-salon-accent1/80 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import DashboardHeader from '../components/DashboardHeader.vue'
import { showWarning, showSuccess } from '../utils/sweetAlert'

export default {
  name: 'AccountView',
  components: {
    DashboardHeader
  },
  data() {
    return {
      formData: {
        name: '',
        phone: '',
        address: '',
        email: '',
        password: '',
        level: ''
      },
      profilePhoto: null,
      defaultAvatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDdhNCA0IDAgMS0xLTggMCA0IDQgMCAwIDEgOCAweiIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTIgMTRhNyA3IDAgMC0xNCAwaDE0YTcgNyAwIDAgMSA3IDd6IiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
    }
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  mounted() {
    this.loadUserData()
  },
  methods: {
    loadUserData() {
      const user = localStorage.getItem('currentUser')
      if (user) {
        const userData = JSON.parse(user)
        this.formData.name = userData.name || ''
        this.formData.phone = userData.phone || ''
        this.formData.address = userData.address || ''
        this.formData.email = userData.email || ''
        this.formData.password = ''
        this.formData.level = userData.level || ''
        this.profilePhoto = userData.profilePhoto || null
      } else {
        this.router.push('/login')
      }
    },
    logout() {
      localStorage.removeItem('currentUser')
      this.router.push('/login')
    },
    handlePhotoUpload(event) {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          showWarning('Ukuran File Terlalu Besar', 'Ukuran file harus kurang dari 5MB')
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          this.profilePhoto = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    saveProfile() {
      if (!this.formData.name || !this.formData.phone || !this.formData.email) {
        showWarning('Data Tidak Lengkap', 'Silakan isi semua field yang diperlukan')
        return
      }

      const user = JSON.parse(localStorage.getItem('currentUser'))
      const updatedUser = {
        ...user,
        name: this.formData.name,
        phone: this.formData.phone,
        address: this.formData.address,
        email: this.formData.email,
        profilePhoto: this.profilePhoto
      }

      if (this.formData.password) {
        updatedUser.password = this.formData.password
      }

      localStorage.setItem('currentUser', JSON.stringify(updatedUser))

      // Update users.json if needed (in a real app, this would be an API call)
      // For demo purposes, we'll just update localStorage

      showSuccess('Profil Berhasil Diperbarui!', 'Profil berhasil diperbarui!')
      this.router.push('/dashboard')
    }
  }
}
</script>
