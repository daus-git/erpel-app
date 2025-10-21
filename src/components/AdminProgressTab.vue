<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Customer Progress</h3>

      <div class="overflow-x-auto -mx-4 sm:mx-0">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="row in progressData" :key="row.id">
              <td class="px-6 py-4 text-sm text-gray-900"><div class="max-w-[14rem] truncate">{{ row.customer }}</div></td>
              <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{{ row.time }}</td>
              <td class="px-6 py-4 text-sm">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{{ row.status }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900"><div class="max-w-[16rem] truncate">{{ row.service }}</div></td>
              <td class="px-6 py-4 text-sm text-gray-900"><div class="max-w-[12rem] truncate">{{ row.staff }}</div></td>
              <td class="px-6 py-4 text-sm">
                <div class="flex flex-wrap gap-2">
                  <button @click="$emit('update-progress-status', row)" class="text-indigo-600 hover:text-indigo-900">Update</button>
                  <button @click="$emit('delete-progress', row)" class="text-red-600 hover:text-red-800">Delete</button>
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
export default { name: 'AdminProgressTab', props: { progressData: Array }, emits: ['update-progress-status', 'delete-progress'] }
</script>
