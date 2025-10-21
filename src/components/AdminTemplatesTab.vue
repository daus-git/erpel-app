<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-md">
    <div class="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">Message Templates</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">Manage WhatsApp and Email message templates</p>
      </div>
      <button
        @click="showAddTemplateModal = true"
        class="inline-flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium w-full sm:w-auto"
      >
        Add Template
      </button>
    </div>

    <ul role="list" class="divide-y divide-gray-200">
      <li v-for="template in templates" :key="template.id" class="px-4 py-4 sm:px-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div class="flex-1">
            <div class="flex flex-col sm:flex-row sm:items-center gap-1">
              <p class="text-sm font-medium text-indigo-600 truncate">{{ template.name }}</p>
              <span class="hidden sm:inline text-gray-300">•</span>
              <p class="text-sm text-gray-500 truncate">{{ template.type.toUpperCase() }}</p>
            </div>
            <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ template.template }}</p>
          </div>

          <div class="flex flex-wrap gap-2">
            <button @click="openEdit(template)" class="text-indigo-600 hover:text-indigo-900 text-sm">Edit</button>
            <button @click="$emit('delete-template', template)" class="text-red-600 hover:text-red-800 text-sm">Delete</button>
          </div>
        </div>
      </li>
    </ul>

    <!-- Modal -->
    <div v-if="showAddTemplateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <h4 class="text-lg font-bold text-gray-900 mb-4">{{ editingTemplate ? 'Edit Template' : 'Add Template' }}</h4>

        <div class="space-y-3">
          <label class="block text-sm font-medium text-gray-700">Type</label>
          <select v-model="currentTemplate.type" class="w-full border rounded-lg px-3 py-2">
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
          </select>

          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input v-model="currentTemplate.name" type="text" class="w-full border rounded-lg px-3 py-2" />
          </div>

          <div v-if="currentTemplate.type === 'email'">
            <label class="block text-sm font-medium text-gray-700">Subject</label>
            <input v-model="currentTemplate.subject" type="text" class="w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Template</label>
            <textarea v-model="currentTemplate.template" rows="6" class="w-full border rounded-lg px-3 py-2"></textarea>
          </div>
        </div>

        <div class="mt-4 flex flex-col sm:flex-row gap-2">
          <button @click="saveTemplate" class="flex-1 bg-salon-accent1 hover:bg-salon-accent2 text-white px-4 py-2 rounded-lg font-medium">
            Save
          </button>
          <button @click="closeModal" class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminTemplatesTab',
  props: { templates: Array },
  emits: ['delete-template', 'save-template'],
  data() {
    return {
      showAddTemplateModal: false,
      editingTemplate: null,
      currentTemplate: { type: 'whatsapp', name: '', subject: '', template: '' }
    }
  },
  methods: {
    openEdit(tpl) {
      this.editingTemplate = tpl
      this.currentTemplate = { ...tpl }
      this.showAddTemplateModal = true
    },
    saveTemplate() {
      this.$emit('save-template', { ...this.currentTemplate, id: this.editingTemplate?.id })
      this.closeModal()
    },
    closeModal() {
      this.showAddTemplateModal = false
      this.editingTemplate = null
      this.currentTemplate = { type: 'whatsapp', name: '', subject: '', template: '' }
    }
  }
}
</script>
