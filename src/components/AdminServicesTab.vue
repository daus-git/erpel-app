<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Services Management</h3>
        <button
          @click="$emit('add-service')"
          class="bg-salon-accent1 hover:bg-salon-accent2 text-white px-4 py-2 rounded-lg font-medium"
        >
          Add Service
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div v-for="service in services" :key="service.id" class="border rounded-lg p-4">
          <h4 class="font-medium text-gray-900">{{ service.name }}</h4>
          <p class="text-sm text-gray-500 mt-1">{{ service.description }}</p>
          <p class="text-lg font-bold text-green-600 mt-2">Rp {{ service.price.toLocaleString() }}</p>

          <div class="mt-4 flex flex-wrap gap-2">
            <button @click="$emit('edit-service', service)" class="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
            <button @click="$emit('delete-service', service)" class="text-red-600 hover:text-red-800 text-sm">Delete</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default { name: 'AdminServicesTab', props: { services: Array }, emits: ['add-service', 'edit-service', 'delete-service'] }
</script>
