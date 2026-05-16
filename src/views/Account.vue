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
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="bg-salon-accent1 rounded-lg p-3">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 ml-4">{{ isMember ? 'Profile Member' : 'Form Membership' }}</h3>
            </div>
            <span v-if="isMember" class="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full text-sm font-semibold shadow-md">
              Member
            </span>
            <span v-else class="px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-sm font-semibold">
              Non-Member
            </span>
          </div>
          
          <!-- Member Info Card -->
          <div v-if="!isMember" class="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <div class="flex items-start">
              <svg class="w-6 h-6 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h4 class="font-semibold text-amber-800">Lengkapi Data untuk Menjadi Member</h4>
                <p class="text-sm text-amber-700 mt-1">Isi semua data di bawah ini, setelah klik <strong>Simpan</strong> Anda otomatis menjadi Member dan dapatkan keuntungan eksklusif!</p>
              </div>
            </div>
          </div>
          
          <!-- Member Success Card -->
          <div v-if="isMember" class="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <div class="flex items-start">
              <svg class="w-6 h-6 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h4 class="font-semibold text-green-800">Anda adalah Member kami!</h4>
                <p class="text-sm text-green-700 mt-1">Nikmati berbagai keuntungan dan penawaran eksklusif untuk member.</p>
              </div>
            </div>
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

            <!-- Date of Birth -->
            <div>
              <label for="birth_date" class="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Lahir
              </label>
              <input
                id="birth_date"
                type="date"
                v-model="formData.birth_date"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
              >
            </div>

            <!-- Gender -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Jenis Kelamin
              </label>
              <div class="flex gap-4">
                <label class="flex items-center">
                  <input type="radio" v-model="formData.gender" value="female" class="mr-2 text-salon-accent1 focus:ring-salon-accent1">
                  <span>Perempuan</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" v-model="formData.gender" value="male" class="mr-2 text-salon-accent1 focus:ring-salon-accent1">
                  <span>Laki-laki</span>
                </label>
              </div>
            </div>

            <!-- Address -->
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                Alamat
              </label>
              <textarea
                id="address"
                rows="3"
                v-model="formData.address"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                placeholder="Alamat lengkap"
              ></textarea>
            </div>

            <!-- City & Postal Code -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                  Kota
                </label>
                <input
                  id="city"
                  type="text"
                  v-model="formData.city"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                  placeholder="Kota"
                >
              </div>
              <div>
                <label for="postal_code" class="block text-sm font-medium text-gray-700 mb-2">
                  Kode Pos
                </label>
                <input
                  id="postal_code"
                  type="text"
                  v-model="formData.postal_code"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                  placeholder="Kode pos"
                >
              </div>
            </div>

            <!-- Emergency Contact -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="emergency_name" class="block text-sm font-medium text-gray-700 mb-2">
                  Nama Kontak Darurat
                </label>
                <input
                  id="emergency_name"
                  type="text"
                  v-model="formData.emergency_name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                  placeholder="Nama"
                >
              </div>
              <div>
                <label for="emergency_contact" class="block text-sm font-medium text-gray-700 mb-2">
                  No. Kontak Darurat
                </label>
                <input
                  id="emergency_contact"
                  type="tel"
                  v-model="formData.emergency_contact"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                  placeholder="No. telepon"
                >
              </div>
            </div>

            <!-- Allergies -->
            <div>
              <label for="allergies" class="block text-sm font-medium text-gray-700 mb-2">
                Alergi (jika ada)
              </label>
              <textarea
                id="allergies"
                rows="2"
                v-model="formData.allergies"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                placeholder="Sebutkan alergi jika ada"
              ></textarea>
            </div>

            <!-- Favorite Staff -->
            <div>
              <label for="favorite_staff" class="block text-sm font-medium text-gray-700 mb-2">
                Staff Favorit
              </label>
              <input
                id="favorite_staff"
                type="text"
                v-model="formData.favorite_staff"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                placeholder="Nama staff favorit"
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
            <div class="flex justify-between pt-4 border-t border-gray-200">
              <button
                @click="logout"
                class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Logout
              </button>
              <button
                type="submit"
                class="bg-gradient-to-r from-salon-accent1 to-amber-600 hover:from-amber-600 hover:to-salon-accent1 text-white px-8 py-3 rounded-lg text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {{ isMember ? 'Simpan Perubahan' : 'Simpan & Jadi Member' }}
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
import { createMembership, fetchMemberships, createCustomerProfile, updateCustomerProfile, fetchCustomerProfileByUser, fetchCurrentUser } from '../services/apiService'

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
        email: '',
        level: '',
        birth_date: '',
        gender: '',
        address: '',
        city: '',
        postal_code: '',
        emergency_contact: '',
        emergency_name: '',
        allergies: '',
        favorite_staff: ''
      },
      customerProfileId: null,
      profilePhoto: null,
      isMember: false,
      membershipId: null,
      defaultAvatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDdhNCA0IDAgMS0xLTggMCA0IDQgMCAwIDEgOCAweiIgc3Ryb2tlPSIjOWNhM2FmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTIgMTRhNyA3IDAgMC0xNCAwaDE0YTcgNyAwIDAgMSA3IDd6IiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
    }
  },
  setup() {
    const router = useRouter()
    return { router }
  },
  mounted() {
    this.loadUserData()
    this.loadUserDataFromAPI()
    this.checkMembershipStatus()
    this.loadCustomerProfile()
  },
  methods: {
    loadUserData() {
      const user = localStorage.getItem('currentUser')
      if (user) {
        const userData = JSON.parse(user)
        this.formData.name = userData.name || ''
        this.formData.phone = userData.phone || ''
        this.formData.email = userData.email || ''
        this.formData.level = userData.level || ''
        this.formData.dateOfBirth = userData.dateOfBirth || ''
        this.formData.gender = userData.gender || ''
        this.profilePhoto = userData.profilePhoto || null
        this.isMember = userData.isMember || false
        this.membershipId = userData.membershipId || null
      } else {
        this.router.push('/login')
      }
    },
    async loadUserDataFromAPI() {
      try {
        const token = localStorage.getItem('authToken')
        if (!token) return
        
        const response = await fetchCurrentUser(token)
        console.log('API response:', response)
        
        // Handle different response formats
        const userData = response?.data || response?.user || response
        if (userData) {
          // Update localStorage with fresh data from API
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
          const updatedUser = {
            ...currentUser,
            id: userData.id || currentUser.id,
            name: userData.name || currentUser.name,
            email: userData.email || currentUser.email,
            phone: userData.phone || userData.telephone || '',
            level: userData.role || userData.level || currentUser.level
          }
          localStorage.setItem('currentUser', JSON.stringify(updatedUser))
          
          // Update form data
          this.formData.name = updatedUser.name || ''
          this.formData.phone = updatedUser.phone || ''
          this.formData.email = updatedUser.email || ''
          this.formData.level = updatedUser.level || ''
          
          console.log('User data loaded from API:', updatedUser)
          console.log('Phone from API:', userData.phone)
        }
      } catch (error) {
        console.log('Error loading user data from API:', error)
      }
    },
    async loadCustomerProfile() {
      try {
        const token = localStorage.getItem('authToken')
        const user = JSON.parse(localStorage.getItem('currentUser'))
        console.log('Loading customer profile for user:', user?.id, 'token:', !!token)
        
        if (!token || !user?.id) {
          console.log('No token or user ID')
          return
        }
        
        const profiles = await fetchCustomerProfileByUser(user.id, token)
        console.log('Profiles from API:', profiles)
        
        if (profiles && profiles.length > 0) {
          const profile = profiles[0]
          console.log('Profile data:', profile)
          console.log('Birth date from API:', profile.birth_date)
          
          // Format birth_date to yyyy-MM-dd for input[type="date"]
          let formattedBirthDate = ''
          if (profile.birth_date) {
            const date = new Date(profile.birth_date)
            if (!isNaN(date.getTime())) {
              formattedBirthDate = date.toISOString().split('T')[0]
            }
          }
          console.log('Formatted birth_date:', formattedBirthDate)
          
          this.customerProfileId = profile.id
          this.formData.birth_date = formattedBirthDate
          this.formData.gender = profile.gender || ''
          this.formData.address = profile.address || ''
          this.formData.city = profile.city || ''
          this.formData.postal_code = profile.postal_code || ''
          this.formData.emergency_contact = profile.emergency_contact || ''
          this.formData.emergency_name = profile.emergency_name || ''
          this.formData.allergies = profile.allergies || ''
          this.formData.favorite_staff = profile.favorite_staff || ''
          
          console.log('Form data updated with birth_date:', this.formData.birth_date)
        } else {
          console.log('No profile found for user')
        }
      } catch (error) {
        console.log('Error loading customer profile:', error)
      }
    },
    async checkMembershipStatus() {
      try {
        const token = localStorage.getItem('authToken')
        const user = JSON.parse(localStorage.getItem('currentUser'))
        if (!user || !user.id) return
        
        const memberships = await fetchMemberships(token)
        const userMembership = memberships?.find(m => m.user_id === user.id)
        
        if (userMembership) {
          this.isMember = true
          this.membershipId = userMembership.id
          
          // Update localStorage
          const updatedUser = { ...user, isMember: true, membershipId: userMembership.id }
          localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        }
      } catch (error) {
        console.error('Error checking membership:', error)
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
    async saveProfile() {
      // Validation
      if (!this.formData.name || !this.formData.phone || !this.formData.email) {
        showWarning('Data Tidak Lengkap', 'Nama, No. Telepon, dan Email wajib diisi')
        return
      }

      const user = JSON.parse(localStorage.getItem('currentUser'))
      const updatedUser = {
        ...user,
        name: this.formData.name,
        phone: this.formData.phone,
        email: this.formData.email,
        dateOfBirth: this.formData.dateOfBirth,
        gender: this.formData.gender,
        profilePhoto: this.profilePhoto
      }

      const token = localStorage.getItem('authToken')
      
      // Save customer profile to API
      try {
        // Format birth_date to YYYY-MM-DD if present
        let formattedBirthDate = null
        if (this.formData.birth_date) {
          // Handle different date formats
          const date = new Date(this.formData.birth_date)
          if (!isNaN(date.getTime())) {
            formattedBirthDate = date.toISOString().split('T')[0]
          } else {
            formattedBirthDate = this.formData.birth_date
          }
        }
        
        const profileData = {
          user_id: user.id,
          birth_date: formattedBirthDate,
          gender: this.formData.gender || null,
          address: this.formData.address || null,
          city: this.formData.city || null,
          postal_code: this.formData.postal_code || null,
          emergency_contact: this.formData.emergency_contact || null,
          emergency_name: this.formData.emergency_name || null,
          allergies: this.formData.allergies || null,
          favorite_staff: this.formData.favorite_staff || null
        }
        
        console.log('Saving customer profile:', profileData)
        console.log('Birth date from form:', this.formData.birth_date)
        console.log('Formatted birth date:', formattedBirthDate)
        
        if (this.customerProfileId) {
          const result = await updateCustomerProfile(this.customerProfileId, profileData, token)
          console.log('Profile updated:', result)
        } else {
          const result = await createCustomerProfile(profileData, token)
          console.log('Profile created:', result)
          this.customerProfileId = result.id
        }
        console.log('Customer profile saved successfully')
      } catch (error) {
        console.error('Error saving customer profile:', error)
      }
      
      // Auto-create membership if profile is complete and user is not yet a member
      if (!this.isMember && this.formData.name && this.formData.phone && this.formData.email) {
        const today = new Date().toISOString().split('T')[0]
        const memberCode = `SALON-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
        
        console.log('Creating membership for user:', user.id, user.email)
        console.log('Member code:', memberCode)
        
        try {
          const membershipData = {
            user_id: user.id,
            member_code: memberCode,
            membership_level: 'silver',
            points: 0,
            total_spent: 0,
            join_date: today,
            is_active: true
          }
          
          const result = await createMembership(membershipData, token)
          console.log('Membership created successfully:', result)
          
          updatedUser.isMember = true
          updatedUser.memberCode = memberCode
          updatedUser.joinDate = today
          this.isMember = true
          
          localStorage.setItem('currentUser', JSON.stringify(updatedUser))
          showSuccess('Selamat! Anda Sekarang Member!', `Member Code: ${memberCode}`)
          this.router.push('/dashboard')
        } catch (error) {
          console.error('Error creating membership:', error)
          
          updatedUser.isMember = true
          updatedUser.memberCode = memberCode
          updatedUser.joinDate = today
          this.isMember = true
          
          localStorage.setItem('currentUser', JSON.stringify(updatedUser))
          showSuccess('Profil Berhasil Disimpan!', 'Anda sekarang member.')
          this.router.push('/dashboard')
        }
      } else {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        showSuccess('Profil Berhasil Diperbarui!', 'Profil berhasil diperbarui.')
        this.router.push('/dashboard')
      }
    }
  }
}
</script>
