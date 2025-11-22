<template>
  <div class="bg-white shadow rounded-lg p-4 sm:p-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">Employees</h2>
        <p class="text-gray-500 text-sm">Data karyawan salon</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          @click="printPDF"
          class="bg-salon-accent1 hover:bg-salon-accent2 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
        >
          Print PDF
        </button>
        <button
          @click="openAddModal"
          class="bg-salon-accent1 hover:bg-salon-accent2 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
        >
          + Add Employee
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-salon-accent1 text-white">
          <tr>
            <th class="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider">ID</th>
            <th class="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider">Name</th>
            <th class="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider">Position</th>
            <th class="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider">Phone</th>
            <th class="px-3 sm:px-6 py-3 text-left font-semibold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="emp in internalEmployees" :key="emp.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-3 sm:px-6 py-3 text-gray-800 whitespace-nowrap">#{{ emp.id }}</td>
            <td class="px-3 sm:px-6 py-3 text-gray-800">{{ emp.name }}</td>
            <td class="px-3 sm:px-6 py-3 text-gray-600">{{ emp.position }}</td>
            <td class="px-3 sm:px-6 py-3 text-gray-600">{{ emp.phone || '-' }}</td>
            <td class="px-3 sm:px-6 py-3 text-gray-600">
              <div class="flex flex-wrap gap-2">
                <button
                  @click="openEditModal(emp)"
                  class="px-3 py-1.5 text-xs rounded-md text-white transition-all bg-salon-accent1 hover:bg-salon-accent2 shadow-sm"
                >
                  Edit
                </button>
                <button
                  @click="$emit('delete-employee', emp.id)"
                  class="px-3 py-1.5 text-xs rounded-md text-white transition-all bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!internalEmployees.length">
            <td colspan="5" class="text-center py-6 text-gray-500">No employees found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ editMode ? 'Edit Employee' : 'Add Employee' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1"
              placeholder="Nama karyawan"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <input
              v-model="form.position"
              type="text"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1"
              placeholder="Posisi"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone (opsional)</label>
            <input
              v-model="form.phone"
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800 text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-salon-accent1 hover:bg-salon-accent2 text-white rounded-md text-sm transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { generatePDF } from '@/utils/pdfGenerator.js'

export default {
  name: 'AdminEmployeesTab',
  props: {
    employees: {
      type: Array,
      default: () => []
    }
  },
  emits: ['create-employee', 'update-employee', 'delete-employee'],
  data() {
    return {
      internalEmployees: [],
      showModal: false,
      editMode: false,
      form: {
        id: null,
        name: '',
        position: '',
        phone: ''
      }
    }
  },
  watch: {
    employees: {
      handler(val) {
        this.internalEmployees = [...(val || [])]
      },
      immediate: true
    }
  },
  methods: {
    openAddModal() {
      this.editMode = false
      this.form = { id: null, name: '', position: '', phone: '' }
      this.showModal = true
    },
    openEditModal(employee) {
      this.editMode = true
      this.form = { ...employee }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.editMode = false
      this.form = { id: null, name: '', position: '', phone: '' }
    },
    submitForm() {
      const payload = {
        name: this.form.name,
        position: this.form.position,
        phone: this.form.phone
      }
      if (this.editMode && this.form.id !== null) {
        this.$emit('update-employee', { id: this.form.id, ...payload })
      } else {
        this.$emit('create-employee', payload)
      }
      this.closeModal()
    },
    async printPDF() {
      const table = this.$el.querySelector('table')
      if (table) {
        await generatePDF(table, 'Employees')
      }
    }
  }
}
</script>
