import Swal from 'sweetalert2'

// Custom SweetAlert2 configuration to match the salon theme
const salonSwal = Swal.mixin({
  customClass: {
    popup: 'bg-white rounded-2xl shadow-2xl border-2 border-salon-primary',
    title: 'text-salon-text font-heading text-2xl font-bold',
    htmlContainer: 'text-salon-text font-body',
    confirmButton: 'bg-salon-primary hover:bg-salon-primary/80 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200',
    cancelButton: 'bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors duration-200 mr-3',
    input: 'border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-salon-primary focus:border-salon-primary'
  },
  buttonsStyling: false,
  confirmButtonColor: '#8B5A3C', // salon-primary color
  cancelButtonColor: '#6B7280'
})

// Success alert
export const showSuccess = (title, text = '') => {
  return salonSwal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'OK'
  })
}

// Error alert
export const showError = (title, text = '') => {
  return salonSwal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK'
  })
}

// Warning alert
export const showWarning = (title, text = '') => {
  return salonSwal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'OK'
  })
}

// Info alert
export const showInfo = (title, text = '') => {
  return salonSwal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonText: 'OK'
  })
}

// Confirmation dialog
export const showConfirm = (title, text = '', confirmText = 'Ya', cancelText = 'Batal') => {
  return salonSwal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText
  })
}

// Input dialog
export const showInput = (title, inputPlaceholder = '', inputValue = '') => {
  return salonSwal.fire({
    title,
    input: 'text',
    inputPlaceholder,
    inputValue,
    showCancelButton: true,
    confirmButtonText: 'OK',
    cancelButtonText: 'Batal'
  })
}

export default salonSwal
