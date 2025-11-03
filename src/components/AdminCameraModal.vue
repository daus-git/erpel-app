<template>
  <div v-if="showCamera" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-bold text-gray-900 mb-4">Scan QR Code</h3>
      <div class="mb-4">
        <video ref="video" class="w-full rounded-lg" autoplay playsinline></video>
      </div>
      <div class="flex space-x-2">
        <button @click="$emit('close-camera')" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg font-medium">
          Cancel
        </button>
        <button @click="$emit('capture-qr')" class="flex-1 bg-salon-accent1 hover:bg-salon-accent2 text-white py-2 px-4 rounded-lg font-medium">
          Capture
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { showError } from '@/utils/sweetAlert'

export default {
  name: 'AdminCameraModal',
  props: {
    showCamera: Boolean
  },
  emits: ['close-camera', 'capture-qr'],
  watch: {
    showCamera(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.startCamera()
        })
      } else {
        this.stopCamera()
      }
    }
  },
  methods: {
    async startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        this.$refs.video.srcObject = stream
      } catch (error) {
        console.error('Error accessing camera:', error)
        showError('Akses Kamera Gagal', 'Tidak dapat mengakses kamera. Silakan periksa izin.')
      }
    },
    stopCamera() {
      if (this.$refs.video && this.$refs.video.srcObject) {
        this.$refs.video.srcObject.getTracks().forEach(track => track.stop())
      }
    }
  },
  beforeUnmount() {
    this.stopCamera()
  }
}
</script>
