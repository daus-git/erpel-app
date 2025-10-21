<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Users Management</h3>
        <button
          @click="$emit('add-user')"
          class="bg-salon-accent1 hover:bg-salon-accent2 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium self-end sm:self-auto"
        >
          Add User
        </button>
      </div>

      <div class="overflow-x-auto -mx-4 sm:mx-0">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Phone</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user.id">
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-900 whitespace-nowrap">#{{ user.id }}</td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-900">
                <div class="max-w-[16rem] truncate">{{ user.name }}</div>
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                <div class="max-w-[18rem] truncate">{{ user.email }}</div>
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                <div class="max-w-[12rem] truncate">{{ user.phone }}</div>
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm">
                <div class="flex flex-wrap gap-2">
                  <button @click="$emit('edit-user', user)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button @click="$emit('delete-user', user)" class="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminUsersTab',
  props: { users: Array },
  emits: ['add-user', 'edit-user', 'delete-user']
}
</script>
