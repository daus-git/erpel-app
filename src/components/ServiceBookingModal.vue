<template>
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Book Service</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <!-- Service Info -->
        <div v-if="selectedService" class="bg-gray-50 p-3 rounded-lg">
          <h4 class="font-medium text-gray-900">{{ selectedService.name }}</h4>
          <p class="text-sm text-gray-600">{{ selectedService.duration }}</p>
          <p class="text-salon-accent1 font-bold">Rp {{ selectedService.price.toLocaleString() }}</p>
        </div>

        <!-- Date Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <input
            v-model="bookingData.date"
            type="date"
            :min="minDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-salon-accent1 focus:border-transparent"
            required
          />
        </div>

        <!-- Time Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
          <select
            v-model="bookingData.time"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-salon-accent1 focus:border-transparent"
            required
          >
            <option value="">Choose time</option>
            <option v-for="time in availableTimeSlots" :key="time" :value="time">{{ time }}</option>
          </select>
          <p v-if="bookingData.date && availableTimeSlots.length === 0" class="text-sm text-red-500 mt-1">
            Tidak ada waktu tersedia untuk tanggal ini
          </p>
        </div>

        <!-- Staff Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Select Staff</label>
          <div v-if="bookingData.quantity === 1" class="space-y-2">
            <select
              v-model="bookingData.staff"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-salon-accent1 focus:border-transparent"
              required
            >
              <option value="">Choose staff</option>
              <option value="random">Random Staff</option>
              <option v-for="staff in availableStaff" :key="staff" :value="staff">{{ staff }}</option>
            </select>
          </div>
          <div v-else class="space-y-2">
            <p class="text-sm text-gray-600 mb-2">Select {{ bookingData.quantity }} staff members:</p>
            <div v-for="i in bookingData.quantity" :key="i" class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-700 w-16">Staff {{ i }}:</span>
              <select
                v-model="bookingData.selectedStaff[i-1]"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-salon-accent1 focus:border-transparent"
                required
              >
                <option value="">Choose staff</option>
                <option value="random">Random Staff</option>
                <option v-for="staff in availableStaff" :key="staff" :value="staff">{{ staff }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Quantity -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <div class="flex items-center space-x-2">
            <button @click="decreaseQuantity" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md">-</button>
            <span class="px-3 py-1 border border-gray-300 rounded-md">{{ bookingData.quantity }}</span>
            <button @click="increaseQuantity" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md">+</button>
          </div>
        </div>
      </div>

      <div class="flex space-x-3 mt-6">
        <button @click="closeModal" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
          Cancel
        </button>
        <button @click="confirmBooking" class="flex-1 px-4 py-2 bg-salon-accent1 text-white rounded-md hover:bg-salon-accent1/80">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { showWarning, showError } from '@/utils/sweetAlert'

export default {
  name: 'ServiceBookingModal',
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    selectedService: {
      type: Object,
      default: null
    },
    employees: {
      type: Array,
      default: () => []
    },
    orders: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'confirm'],
  data() {
    return {
      bookingData: {
        date: '',
        time: '',
        staff: 'random',
        selectedStaff: [],
        quantity: 1
      },
      availableTimes: [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '13:00', '13:30', '14:00', '14:30', '15:00',
        '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
      ]
    }
  },
  computed: {
    minDate() {
      const today = new Date()
      return today.toISOString().split('T')[0]
    },
    allStaffNames() {
      return (this.employees || []).map(emp => emp.name).filter(Boolean)
    },
    availableStaff() {
      const names = this.allStaffNames
      if (!names.length) return ['Random Staff']

      if (!this.bookingData.date) {
        // No date yet — show all
        return names
      }

      // Get busy staff for selected date (+ time if selected)
      const busyStaff = this.getBusyStaff(this.bookingData.date, this.bookingData.time || null)

      const available = names.filter(name => !busyStaff.includes(name))
      return available.length ? available : []
    },
    availableTimeSlots() {
      if (!this.bookingData.date || !this.selectedService) {
        return this.availableTimes
      }

      const now = new Date()
      const todayStr = now.toISOString().split('T')[0]
      const currentMinutes = now.getHours() * 60 + now.getMinutes()

      // Filter time slots based on staff availability
      return this.availableTimes.filter(time => {
        // Skip waktu yang sudah lewat
        if (this.bookingData.date === todayStr) {
          const timeMinutes = this.timeToMinutes(time)
          if (timeMinutes < currentMinutes) return false
        }

        const busyStaff = this.getBusyStaff(this.bookingData.date, time)
        // At least one staff must be available
        return this.allStaffNames.some(name => !busyStaff.includes(name))
      })
    }
  },
  methods: {
    closeModal() {
      this.resetForm()
      this.$emit('close')
    },
    // Get busy staff for a specific date and time
    getBusyStaff(date, time) {
      if (!date) return []
      
      const busyStaff = []
      const serviceDuration = this.getServiceDuration()
      const hasTime = !!time
      
      // Convert time to minutes for comparison
      const selectedTimeMinutes = hasTime ? this.timeToMinutes(time) : 0
      const selectedEndTime = hasTime ? selectedTimeMinutes + serviceDuration : 0

      // Current time for "estimated end already passed" check
      const now = new Date()
      const todayStr = now.toISOString().split('T')[0]
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      
      // Check all existing orders
      for (const order of (this.orders || [])) {
        // Skip completed or cancelled orders
        const statusId = order.status_id
        if (statusId === 5 || statusId === 6) continue
        
        // Normalize order date (API returns ISO like "2026-05-16T00:00:00.000000Z")
        const rawDate = order.order_date || order.date
        if (!rawDate) continue
        const orderDate = rawDate.substring(0, 10)
        if (orderDate !== date) continue
        
        // Get order time — skip orders without a time
        const orderTime = order.order_time || order.time
        if (!orderTime) continue

        const orderDuration = order.service?.duration_minutes || 60
        const orderTimeMinutes = this.timeToMinutes(orderTime)
        const orderEndMinutes = orderTimeMinutes + orderDuration
        
        // Skip if estimated end time has already passed (staff is available again)
        if (orderDate === todayStr && orderEndMinutes <= currentMinutes) continue
        if (orderDate < todayStr) continue
        
        if (hasTime) {
          // Check if times overlap
          if (this.timesOverlap(selectedTimeMinutes, selectedEndTime, orderTimeMinutes, orderEndMinutes)) {
            const staffName = order.employee?.name
            if (staffName && !busyStaff.includes(staffName)) {
              busyStaff.push(staffName)
            }
          }
        } else {
          // No time selected: staff is busy if order hasn't ended yet
          const staffName = order.employee?.name
          if (staffName && !busyStaff.includes(staffName)) {
            busyStaff.push(staffName)
          }
        }
      }
      
      return busyStaff
    },
    // Convert time string (HH:MM) to minutes
    timeToMinutes(time) {
      if (!time) return 0
      const [hours, minutes] = time.split(':').map(Number)
      return hours * 60 + minutes
    },
    // Check if two time ranges overlap
    timesOverlap(start1, end1, start2, end2) {
      return start1 < end2 && start2 < end1
    },
    // Get service duration in minutes
    getServiceDuration() {
      if (!this.selectedService) return 60 // default 60 minutes
      
      // Try to parse duration from service
      const duration = this.selectedService.duration_minutes || 
                       this.selectedService.duration ||
                       60
      
      // If duration is a string like "60 menit" or "1 hour", parse it
      if (typeof duration === 'string') {
        const match = duration.match(/(\d+)/)
        return match ? parseInt(match[1]) : 60
      }
      
      return parseInt(duration) || 60
    },
    confirmBooking() {
      if (!this.bookingData.date || !this.bookingData.time) {
        showWarning('Data Tidak Lengkap', 'Silakan isi semua field yang diperlukan')
        return
      }

      if (!this.selectedService) {
        showError('Informasi Layanan Hilang', 'Informasi layanan tidak ditemukan. Silakan coba lagi.')
        return
      }

      if (!this.availableStaff.length) {
        showWarning('Staff tidak tersedia', 'Semua staff sudah dibooking pada waktu ini. Silakan pilih waktu lain.')
        return
      }

      // Validate staff selection based on quantity
      if (this.bookingData.quantity === 1) {
        if (!this.bookingData.staff) {
          showWarning('Pilih Staff', 'Silakan pilih anggota staff')
          return
        }
        // If random staff selected, pick one randomly
        if (this.bookingData.staff === 'random') {
          this.bookingData.staff = this.availableStaff[Math.floor(Math.random() * this.availableStaff.length)]
        }
      } else {
        // For multiple quantity, check all staff selections
        const missingStaff = this.bookingData.selectedStaff.some(staff => !staff)
        if (missingStaff || this.bookingData.selectedStaff.length !== this.bookingData.quantity) {
          showWarning('Pilih Semua Staff', 'Silakan pilih semua anggota staff')
          return
        }

        // Handle random staff selections
        this.bookingData.selectedStaff = this.bookingData.selectedStaff.map(staff => {
          if (staff === 'random') {
            return this.availableStaff[Math.floor(Math.random() * this.availableStaff.length)]
          }
          return staff
        })
      }

      this.$emit('confirm', {
        service: this.selectedService,
        date: this.bookingData.date,
        time: this.bookingData.time,
        staff: this.bookingData.staff,
        selectedStaff: this.bookingData.selectedStaff,
        quantity: this.bookingData.quantity,
        type: 'service'
      })
      this.closeModal()
    },
    increaseQuantity() {
      this.bookingData.quantity++
      // Add empty slot for new staff selection
      this.bookingData.selectedStaff.push('')
    },
    decreaseQuantity() {
      if (this.bookingData.quantity > 1) {
        this.bookingData.quantity--
        // Remove last staff selection
        this.bookingData.selectedStaff.pop()
      }
    },
    resetForm() {
      this.bookingData = {
        date: '',
        time: '',
        staff: 'random',
        selectedStaff: [],
        quantity: 1
      }
    }
  },
  watch: {
    showModal(newVal) {
      if (newVal && !this.selectedService) {
        console.error('ServiceBookingModal opened without selectedService')
        this.closeModal()
      }
    },
    'bookingData.date'() {
      this.bookingData.time = ''
      this.bookingData.staff = 'random'
    },
    'bookingData.time'() {
      this.bookingData.staff = 'random'
    }
  }
}
</script>
