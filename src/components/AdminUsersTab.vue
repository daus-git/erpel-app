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
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Phone</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Level</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="user in users"
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
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden md:table-cell truncate max-w-[12rem]">
                {{ user.phone }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500 capitalize">
                {{ user.level }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm">
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="$emit('edit-user', user)"
                    class="text-indigo-600 hover:text-indigo-900 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    @click="$emit('delete-user', user)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="users.length === 0">
              <td colspan="6" class="text-center py-6 text-gray-500">
                No users found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import usersData from '@/data/users.json' // pastikan file users.json ada di folder assets
import { generatePDF } from '@/utils/pdfGenerator.js'

export default {
  name: 'AdminUsersTab',
  emits: ['add-user', 'edit-user', 'delete-user'],
  data() {
    return {
      users: usersData
    }
  },
  methods: {
    async printPDF() {
      const table = this.$el.querySelector('table')
      if (table) {
        await generatePDF(table, 'Users Management')
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
