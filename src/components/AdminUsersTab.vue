<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Users Management</h3>
          <p class="text-gray-500 text-sm">Manage registered salon users</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="printPDF"
            class="bg-salon-accent1 hover:bg-salon-accent2 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
          >
            Print PDF
          </button>
          <button
            @click="$emit('add-user')"
            class="bg-salon-accent1 hover:bg-salon-accent2 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
          >
            + Add User
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto -mx-4 sm:mx-0">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-salon-accent1 text-white">
            <tr>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Email</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="user in internalUsers"
              :key="user.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                #{{ user.id }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-900 truncate max-w-[12rem]">
                {{ user.name }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden sm:table-cell truncate max-w-[16rem]">
                {{ user.email }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500 truncate max-w-[12rem]">
                {{ user.phone || '-' }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm">
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="openEditModal(user)"
                    class="text-indigo-600 hover:text-indigo-900 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteUser(user.id)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="internalUsers.length === 0">
              <td colspan="5" class="text-center py-6 text-gray-500">
                No users found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Edit User Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Edit User</h3>
            <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveEditUser" class="space-y-4">
            <div>
              <label for="editUserName" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                id="editUserName"
                v-model="editUser.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                placeholder="Enter full name"
              >
            </div>

            <div>
              <label for="editUserPhone" class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                id="editUserPhone"
                v-model="editUser.phone"
                type="tel"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                placeholder="Enter phone number"
              >
            </div>

            <div>
              <label for="editUserEmail" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                id="editUserEmail"
                v-model="editUser.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                placeholder="Enter email"
              >
            </div>

            <div>
              <label for="editUserPassword" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                id="editUserPassword"
                v-model="editUser.password"
                type="password"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
                placeholder="Enter password"
              >
            </div>

            <div>
              <label for="editUserLevel" class="block text-sm font-medium text-gray-700 mb-2">Account Level</label>
              <select
                id="editUserLevel"
                v-model="editUser.level"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-salon-accent1 focus:border-salon-accent1 transition-colors duration-200"
              >
                <option value="">Select level</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div class="flex space-x-3 mt-6">
              <button type="button" @click="closeEditModal" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" class="flex-1 px-4 py-2 bg-salon-accent1 text-white rounded-md hover:bg-salon-accent1/80">
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { generatePDF } from '@/utils/pdfGenerator.js'

export default {
  name: 'AdminUsersTab',
  props: {
    users: {
      type: Array,
      default: () => []
    }
  },
  emits: ['add-user', 'edit-user', 'delete-user'],
  data() {
    return {
      internalUsers: [],
      showEditModal: false,
      editUser: {
        id: null,
        name: '',
        phone: '',
        email: '',
        password: '',
        level: ''
      }
    }
  },
  watch: {
    users: {
      handler(newVal) {
        this.internalUsers = [...(newVal || [])]
      },
      immediate: true
    }
  },
  methods: {
    async printPDF() {
      const table = this.$el.querySelector('table')
      if (table) {
        await generatePDF(table, 'Users Management')
      }
    },
    openEditModal(user) {
      this.editUser = { ...user }
      this.showEditModal = true
    },
    closeEditModal() {
      this.showEditModal = false
      this.editUser = {
        id: null,
        name: '',
        phone: '',
        email: '',
        password: '',
        level: ''
      }
    },
    saveEditUser() {
      if (!this.editUser.name || !this.editUser.phone || !this.editUser.email || !this.editUser.password || !this.editUser.level) {
        alert('Please fill all fields')
        return
      }

      // Check if email already exists (excluding current user)
      const existingUser = this.internalUsers.find(u => u.email === this.editUser.email && u.id !== this.editUser.id)
      if (existingUser) {
        alert('Email already exists')
        return
      }

      // Update user
      const index = this.internalUsers.findIndex(u => u.id === this.editUser.id)
      if (index !== -1) {
        this.internalUsers[index] = { ...this.editUser }
        this.closeEditModal()
        alert('User updated successfully!')
      }
    },
    deleteUser(userId) {
      if (confirm('Are you sure you want to delete this user?')) {
        this.$emit('delete-user', userId)
      }
    }
  }
}
</script>

<style scoped>
/* Responsiveness tweak for smaller screens */
@media (max-width: 640px) {
  table th, table td {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>
