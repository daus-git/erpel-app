<template>
  <div class="bg-white shadow sm:rounded-xl mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4 mb-4">
      <div>
        <h3 class="text-lg sm:text-xl font-semibold text-salon-text">Message Templates</h3>
        <p class="mt-1 text-sm text-gray-500">Manage WhatsApp and Email message templates</p>
      </div>

<button
  @click="showAddTemplateModal = true"
  class="inline-flex items-center justify-center
         text-white bg-salon-accent1 hover:bg-salon-accent2
         px-4 py-2 sm:px-5 sm:py-2
         text-sm sm:text-base
         rounded-md font-medium shadow-sm
         transition-all duration-200"
>
  + Add Template
</button>



    </div>

    <!-- Template List -->
    <ul role="list" class="divide-y divide-gray-200">
      <li
        v-for="template in templates"
        :key="template.id"
        class="px-3 py-4 sm:px-4 lg:px-6 hover:bg-salon-base/60 transition-colors duration-150 rounded-md"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <p class="text-sm font-medium text-salon-accent1 truncate">{{ template.name }}</p>
              <span class="hidden sm:inline text-gray-300">•</span>
              <p class="text-sm text-gray-500 truncate uppercase">{{ template.type }}</p>
            </div>
            <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ template.template }}</p>
          </div>

          <div class="flex flex-wrap gap-2 shrink-0">
            <button
              @click="openEdit(template)"
              class="text-salon-accent1 hover:text-salon-accent2 font-medium text-sm transition-colors"
            >
              Edit
            </button>
            <button
              @click="$emit('delete-template', template)"
              class="text-salon-highlight hover:text-salon-accent2 font-medium text-sm transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </li>
    </ul>

    <!-- Modal -->
    <div
      v-if="showAddTemplateModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md max-h-[85vh] overflow-y-auto shadow-xl"
      >
        <h4 class="text-lg sm:text-xl font-bold text-gray-900 mb-5">
          {{ editingTemplate ? 'Edit Template' : 'Add Template' }}
        </h4>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              v-model="currentTemplate.type"
              class="w-full border rounded-lg px-3 py-2 focus:ring-salon-accent1 focus:border-salon-accent1"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              v-model="currentTemplate.name"
              type="text"
              class="w-full border rounded-lg px-3 py-2 focus:ring-salon-accent1 focus:border-salon-accent1"
            />
          </div>

          <div v-if="currentTemplate.type === 'email'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              v-model="currentTemplate.subject"
              type="text"
              class="w-full border rounded-lg px-3 py-2 focus:ring-salon-accent1 focus:border-salon-accent1"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Template</label>
            <textarea
              v-model="currentTemplate.template"
              rows="6"
              class="w-full border rounded-lg px-3 py-2 focus:ring-salon-accent1 focus:border-salon-accent1"
            ></textarea>
          </div>
        </div>

        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            @click="saveTemplate"
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
