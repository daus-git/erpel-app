<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">Services</h2>
        <p class="text-gray-500 text-sm">Manage salon service list</p>
      </div>
      <button
        @click="openAddModal"
        class="bg-salon-accent1 hover:bg-salon-accent2 text-white px-4 py-2 rounded-md text-sm transition-all"
      >
        + Add Service
      </button>
    </div>

    <!-- Table Section -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-salon-accent1 text-white">
          <tr>
            <th class="px-4 py-2 text-left">Image</th>
            <th class="px-4 py-2 text-left">Name</th>
            <th class="px-4 py-2 text-left">Category</th>
            <th class="px-4 py-2 text-left">Duration</th>
            <th class="px-4 py-2 text-left">Price</th>
            <th class="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="service in services" :key="service.id" class="hover:bg-gray-50 transition duration-150">
            <td class="px-4 py-2">
              <img :src="service.image" alt="service image" class="w-12 h-12 rounded-md object-cover" />
            </td>
            <td class="px-4 py-2 font-medium text-gray-800">{{ service.name }}</td>
            <td class="px-4 py-2 text-gray-700">{{ service.category }}</td>
            <td class="px-4 py-2 text-gray-700">{{ service.duration }}</td>
            <td class="px-4 py-2 text-gray-700">Rp {{ formatPrice(service.price) }}</td>
            <td class="px-4 py-2">
              <div class="flex gap-2">
                <!-- Tombol Edit -->
                <button
                  @click="editService(service)"
                  class="px-3 py-1.5 text-xs rounded-md text-white transition-all
                         bg-salon-accent1 hover:bg-salon-accent2 shadow-sm"
                >
                  Edit
                </button>

                <!-- Tombol Delete -->
                <button
                  @click="deleteService(service.id)"
                  class="px-3 py-1.5 text-xs rounded-md text-white transition-all
                         bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Add/Edit -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h3 class="text-lg font-semibold mb-4">{{ editMode ? 'Edit Service' : 'Add New Service' }}</h3>

        <form @submit.prevent="saveService" class="space-y-3">
          <!-- Nama -->
          <input
            v-model="form.name"
            type="text"
            placeholder="Service Name"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            required
          />

          <!-- Kategori -->
          <input
            v-model="form.category"
            type="text"
            placeholder="Category"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />

          <!-- Durasi -->
          <input
            v-model="form.duration"
            type="text"
            placeholder="Duration (e.g., 45 minutes)"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />

          <!-- Harga -->
          <input
            v-model.number="form.price"
            type="number"
            placeholder="Price (Rp)"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />

          <!-- Upload Gambar -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />

            <div v-if="form.image" class="mt-3">
              <img :src="form.image" alt="preview" class="w-24 h-24 object-cover rounded-md shadow-sm" />
            </div>
          </div>

          <!-- Tombol Aksi -->
          <div class="flex justify-end gap-3 mt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-salon-accent1 hover:bg-salon-accent2 text-white rounded-md text-sm transition-all"
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
import servicesData from '@/data/services.json'

export default {
  name: 'AdminServicesTab',
  data() {
    return {
      services: [...servicesData],
      showAddModal: false,
      editMode: false,
      form: {
        id: null,
        name: '',
        category: '',
        duration: '',
        price: '',
        image: '',
      },
    }
  },
  methods: {
    formatPrice(value) {
      return value.toLocaleString('id-ID')
    },
    openAddModal() {
      this.showAddModal = true
      this.editMode = false
      this.form = { id: null, name: '', category: '', duration: '', price: '', image: '' }
    },
    closeModal() {
      this.showAddModal = false
      this.form = { id: null, name: '', category: '', duration: '', price: '', image: '' }
      this.editMode = false
    },
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = e => {
          this.form.image = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    editService(service) {
      this.form = { ...service }
      this.editMode = true
      this.showAddModal = true
    },
    deleteService(id) {
      this.services = this.services.filter((s) => s.id !== id)
    },
    saveService() {
      if (this.editMode) {
        const index = this.services.findIndex((s) => s.id === this.form.id)
        if (index !== -1) this.services[index] = { ...this.form }
      } else {
        this.form.id = Date.now()
        this.services.push({ ...this.form })
      }
      this.closeModal()
    },
  },
}
</script>

<style scoped>
@media (max-width: 640px) {
  table {
    font-size: 0.875rem;
  }
  th, td {
    padding: 0.5rem 0.75rem;
  }
}
</style>
