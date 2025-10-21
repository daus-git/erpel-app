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
            <option v-for="time in availableTimes" :key="time" :value="time">{{ time }}</option>
          </select>
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
      ],
      availableStaff: [
        'Sarah Johnson', 'Mike Chen', 'Lisa Park', 'David Kim',
        'Emma Wilson', 'Tom Anderson', 'Anna Lee', 'James Brown'
      ]
    }
  },
  computed: {
    minDate() {
      const today = new Date()
      return today.toISOString().split('T')[0]
    }
  },
  methods: {
    closeModal() {
      this.resetForm()
      this.$emit('close')
    },
    confirmBooking() {
      if (!this.bookingData.date || !this.bookingData.time) {
        alert('Please fill in all required fields')
        return
      }

      if (!this.selectedService) {
        alert('Service information is missing. Please try again.')
        return
      }

      // Validate staff selection based on quantity
      if (this.bookingData.quantity === 1) {
        if (!this.bookingData.staff) {
          alert('Please select a staff member')
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
          alert('Please select all staff members')
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
    }
  }
}
</script>
