<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-800">Service Progress</h2>
      <button
        @click="printPDF"
        class="bg-salon-accent1 hover:bg-salon-accent2 text-white px-4 py-2 rounded-md text-sm transition-all"
      >
        Print PDF
      </button>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-salon-accent1 text-white">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-semibold">Time</th>
            <th class="px-4 py-2 text-left text-sm font-semibold">Customer</th>
            <th class="px-4 py-2 text-left text-sm font-semibold">Service</th>
            <th class="px-4 py-2 text-left text-sm font-semibold">Staff</th>
            <th class="px-4 py-2 text-left text-sm font-semibold">Status</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr 
            v-for="item in progressList" 
            :key="item.id" 
            class="hover:bg-gray-50 transition duration-150"
          >
            <td class="px-4 py-2 text-sm text-gray-700">{{ item.time }}</td>
            <td class="px-4 py-2 text-sm text-gray-800 font-medium">
              {{ item.customerName }}
            </td>
            <td class="px-4 py-2 text-sm text-gray-700">{{ item.serviceType }}</td>
            <td class="px-4 py-2 text-sm text-gray-700">{{ item.staff }}</td>
            <td class="px-4 py-2 text-sm">
              <select
                v-model="item.status"
                @change="updateStatus(item)"
                class="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-salon-accent1 focus:border-salon-accent1"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="finished">Finished</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { generatePDF } from '@/utils/pdfGenerator.js'
import { updateProgress } from '@/services/apiService'
import { showSuccess, showError } from '@/utils/sweetAlert'

export default {
  name: 'AdminProgressTab',
  props: {
    progressData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      progressList: []
    }
  },
  watch: {
    progressData: {
      handler(newVal) {
        this.progressList = [...(newVal || [])]
      },
      immediate: true
    }
  },
  methods: {
    async updateStatus(item) {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.warn('No auth token found for updating progress status')
        return
      }
      try {
        await updateProgress(item.id, { status: item.status }, token)
        showSuccess('Status diperbarui', `Status progress diubah menjadi ${item.status}`)
      } catch (error) {
        console.error('Failed to update progress status', error)
        const message = error?.body?.message || error.message || 'Gagal mengubah status'
        showError('Gagal update status', message)
      }
    },
    async printPDF() {
      const table = this.$el.querySelector('table')
      if (table) {
        await generatePDF(table, 'Service Progress')
      }
    },
  },
}
</script>

<style scoped>
select {
  min-width: 130px;
}
</style>
