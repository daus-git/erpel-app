// Allow overriding API base for local proxy to avoid CORS during development
const BASE_URL = process.env.VUE_APP_API_BASE || 'https://salon-api-production.up.railway.app/api'

// Basic fetch wrapper for the Erpel Salon API
async function request(path, { method = 'GET', body, token, headers = {}, isForm = false } = {}) {
  const options = { method, headers: { ...headers } }

  if (token) options.headers.Authorization = `Bearer ${token}`

  if (body !== undefined) {
    if (isForm) {
      options.body = body
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(body)
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, options)
  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    const message = payload && payload.message ? payload.message : `Request failed with status ${response.status}`
    const error = new Error(message)
    error.status = response.status
    error.body = payload
    throw error
  }

  return payload
}

// SERVICES
export function fetchServices() {
  return request('/services')
}

export function createService(data, token) {
  return request('/services', { method: 'POST', body: data, token })
}

export function updateService(id, data, token) {
  return request(`/services/${id}`, { method: 'PUT', body: data, token })
}

export function deleteService(id, token) {
  return request(`/services/${id}`, { method: 'DELETE', token })
}

// EMPLOYEES
export function fetchEmployees() {
  return request('/employees')
}

export function fetchEmployee(id) {
  return request(`/employees/${id}`)
}

export function createEmployee(data, token) {
  return request('/employees', { method: 'POST', body: data, token })
}

export function updateEmployee(id, data, token) {
  return request(`/employees/${id}`, { method: 'PUT', body: data, token })
}

export function deleteEmployee(id, token) {
  return request(`/employees/${id}`, { method: 'DELETE', token })
}

// ORDERS
export function fetchOrders() {
  return request('/orders')
}

export function createOrder(data, token) {
  return request('/orders', { method: 'POST', body: data, token })
}

export function updateOrder(id, data, token) {
  return request(`/orders/${id}`, { method: 'PUT', body: data, token })
}

export function deleteOrder(id, token) {
  return request(`/orders/${id}`, { method: 'DELETE', token })
}

// PROGRESS
export function fetchProgress() {
  return request('/progress')
}

export function createProgress(data, token) {
  return request('/progress', { method: 'POST', body: data, token })
}

export function updateProgress(id, data, token) {
  return request(`/progress/${id}`, { method: 'PUT', body: data, token })
}

export function deleteProgress(id, token) {
  return request(`/progress/${id}`, { method: 'DELETE', token })
}

// NOTIFICATIONS
export function fetchNotifications() {
  return request('/notifications')
}

export function fetchNotification(id) {
  return request(`/notifications/${id}`)
}

export function createNotification(data, token) {
  return request('/notifications', { method: 'POST', body: data, token })
}

export function updateNotification(id, data, token) {
  return request(`/notifications/${id}`, { method: 'PUT', body: data, token })
}

export function deleteNotification(id, token) {
  return request(`/notifications/${id}`, { method: 'DELETE', token })
}

// USERS
export function fetchUsers(token) {
  return request('/users', { token })
}

export function fetchUser(id) {
  return request(`/users/${id}`)
}

export function createUser(data, token) {
  return request('/users', { method: 'POST', body: data, token })
}

export function updateUser(id, data, token) {
  return request(`/users/${id}`, { method: 'PUT', body: data, token })
}

export function deleteUser(id, token) {
  return request(`/users/${id}`, { method: 'DELETE', token })
}

// AUTHENTICATION
export function requestPasswordReset(email) {
  return request('/forgot-password', { method: 'POST', body: { email } })
}

export function getResetPasswordForm(token, email) {
  const query = email ? `?email=${encodeURIComponent(email)}` : ''
  return request(`/reset-password/${token}${query}`)
}

export function resetPassword({ token, email, password, passwordConfirmation }) {
  const formData = new FormData()
  formData.append('token', token)
  formData.append('email', email)
  formData.append('password', password)
  formData.append('password_confirmation', passwordConfirmation || password)

  return request('/reset-password', { method: 'POST', body: formData, isForm: true })
}

export function login(credentials) {
  return request('/login', { method: 'POST', body: credentials })
}

export default {
  fetchServices,
  createService,
  updateService,
  deleteService,
  fetchEmployees,
  fetchEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  fetchOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  fetchProgress,
  createProgress,
  updateProgress,
  deleteProgress,
  fetchNotifications,
  fetchNotification,
  createNotification,
  updateNotification,
  deleteNotification,
  fetchUsers,
  fetchUser,
  createUser,
  updateUser,
  deleteUser,
  requestPasswordReset,
  getResetPasswordForm,
  resetPassword,
  login
}
