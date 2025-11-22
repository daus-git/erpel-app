<template>
  <div class="bg-white shadow sm:rounded-xl mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4 mb-4">
      <div>
        <h3 class="text-lg sm:text-xl font-semibold text-salon-text">Notifications</h3>
        <p class="mt-1 text-sm text-gray-500">Kelola notifikasi pelanggan</p>
      </div>
      <div class="flex gap-2">
        <button
          @click="printPDF"
          class="inline-flex items-center justify-center text-white bg-salon-accent1 hover:bg-salon-accent2 px-4 py-2 sm:px-5 sm:py-2 text-sm sm:text-base rounded-md font-medium shadow-sm transition-all duration-200"
        >
          Print PDF
        </button>
        <button
          @click="openCreate"
          class="inline-flex items-center justify-center text-white bg-salon-accent1 hover:bg-salon-accent2 px-4 py-2 sm:px-5 sm:py-2 text-sm sm:text-base rounded-md font-medium shadow-sm transition-all duration-200"
        >
          + Add Notification
        </button>
      </div>
    </div>

    <ul role="list" class="divide-y divide-gray-200">
      <li
        v-for="notification in notifications"
        :key="notification.id"
        class="px-3 py-4 sm:px-4 lg:px-6 hover:bg-salon-base/60 transition-colors duration-150 rounded-md"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span class="font-semibold text-salon-accent1">#{{ notification.id }}</span>
              <span>• User: {{ notification.user_id }}</span>
              <span v-if="notification.order_id">• Order: {{ notification.order_id }}</span>
            </div>
            <p class="mt-1 text-sm text-gray-700">{{ notification.message }}</p>
          </div>

          <div class="flex flex-wrap gap-2 shrink-0 justify-end">
            <button
              type="button"
              @click="sendEmail(notification)"
              class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold text-white bg-salon-accent1 hover:bg-salon-accent2 transition-colors shadow-sm"
            >
              <span class="hidden sm:inline">Kirim Email</span>
              <span class="sm:hidden">Email</span>
            </button>
            <button
              type="button"
              @click="sendWhatsApp(notification)"
              class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold text-emerald-900 bg-emerald-100 border border-emerald-300 hover:bg-emerald-200 transition-colors shadow-sm"
            >
              <span class="hidden sm:inline">Kirim WhatsApp</span>
              <span class="sm:hidden">WA</span>
            </button>
          </div>
        </div>
      </li>
      <li v-if="!notifications.length" class="px-3 py-6 text-center text-gray-500">No notifications found.</li>
    </ul>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-xl">
        <h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-5">
          {{ editing ? 'Edit Notification' : 'Add Notification' }}
        </h4>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input
              v-model.number="form.user_id"
              type="number"
              class="w-full border rounded-lg px-3 py-2 focus:ring-salon-accent1 focus:border-salon-accent1"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Order ID (opsional)</label>
            <input
              v-model.number="form.order_id"
              type="number"
              class="w-full border rounded-lg px-3 py-2 focus:ring-salon-accent1 focus:border-salon-accent1"
              placeholder="Kosongkan jika tidak ada"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              v-model="form.message"
              rows="4"
              maxlength="255"
              class="w-full border rounded-lg px-3 py-2 focus:ring-salon-accent1 focus:border-salon-accent1"
              required
            ></textarea>
          </div>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            @click="save"
            class="flex-1 bg-salon-accent1 hover:bg-salon-accent2 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
          >
            Save
          </button>
          <button
            @click="closeModal"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { generatePDF } from '@/utils/pdfGenerator.js'

export default {
  name: 'AdminNotificationsTab',
  props: {
    notifications: {
      type: Array,
      default: () => []
    }
  },
  emits: ['save-notification', 'delete-notification', 'send-email', 'send-whatsapp'],
  data() {
    return {
      showModal: false,
      editing: false,
      editingId: null,
      form: {
        user_id: '',
        order_id: '',
        message: ''
      }
    }
  },
  methods: {
    openCreate() {
      this.editing = false
      this.editingId = null
      this.form = { user_id: '', order_id: '', message: '' }
      this.showModal = true
    },
    openEdit(notification) {
      this.editing = true
      this.editingId = notification.id
      this.form = {
        user_id: notification.user_id,
        order_id: notification.order_id,
        message: notification.message
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.editing = false
      this.editingId = null
      this.form = { user_id: '', order_id: '', message: '' }
    },
    save() {
      const payload = {
        ...this.form,
        id: this.editingId || undefined
      }
      this.$emit('save-notification', payload)
      this.closeModal()
    },
    sendEmail(notification) {
      this.$emit('send-email', notification)
    },
    sendWhatsApp(notification) {
      this.$emit('send-whatsapp', notification)
    },
    async printPDF() {
      const tempTable = document.createElement('table')
      tempTable.style.width = '100%'
      tempTable.style.borderCollapse = 'collapse'
      tempTable.innerHTML = `
        <thead style="background-color: #f3f4f6;">
          <tr>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">ID</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">User</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Order</th>
            <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Message</th>
          </tr>
        </thead>
        <tbody>
          ${(this.notifications || []).map(n => `
            <tr>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${n.id}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${n.user_id}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${n.order_id || '-'}</td>
              <td style="border: 1px solid #d1d5db; padding: 8px;">${n.message}</td>
            </tr>
          `).join('')}
        </tbody>
      `
      document.body.appendChild(tempTable)
      await generatePDF(tempTable, 'Notifications')
      document.body.removeChild(tempTable)
    }
  }
}
</script>
