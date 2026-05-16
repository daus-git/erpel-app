// Allow overriding API base for local proxy to avoid CORS during development
const BASE_URL = process.env.VUE_APP_API_BASE || '/api'
const DEBUG = process.env.NODE_ENV === 'development'

// Basic fetch wrapper for the Salon API
async function request(path, { method = 'GET', body, token, headers = {}, isForm = false } = {}) {
  const options = { method, headers: { 'Accept': 'application/json', ...headers } }

  // Auto-get token from localStorage if not provided
  const authToken = token || localStorage.getItem('authToken')
  if (authToken) options.headers.Authorization = `Bearer ${authToken}`

  if (body !== undefined) {
    if (isForm) {
      options.body = body
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(body)
    }
  }

  if (DEBUG) {
    console.log(`[API] ${method} ${BASE_URL}${path}`, {
      headers: options.headers,
      body: options.body
    })
  }

  const response = await fetch(`${BASE_URL}${path}`, options)
  const contentType = response.headers.get('content-type') || ''
  
  if (DEBUG) {
    console.log(`[API] Response ${response.status} ${response.statusText}`, {
      contentType,
      url: response.url
    })
  }
  
  // Check if response is HTML (redirect/error page)
  if (contentType.includes('text/html')) {
    const htmlText = await response.text()
    if (DEBUG) {
      console.error(`[API] HTML response received:`, htmlText.substring(0, 500))
    }
    const error = new Error(`Server returned HTML instead of JSON (status: ${response.status}). Check server logs.`)
    error.status = response.status
    error.body = htmlText
    throw error
  }
  
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()

  if (!response.ok) {
    if (DEBUG) {
      console.error(`[API] Error response:`, payload)
    }
    const message = payload && payload.message ? payload.message : `Request failed with status ${response.status}`
    const error = new Error(message)
    error.status = response.status
    error.body = payload
    throw error
  }

  if (DEBUG) {
    console.log(`[API] Success response:`, payload)
  }

  return payload
}

// TEST ENDPOINT
export function testApi() {
  return request('/test')
}

// CURRENT USER
export function fetchCurrentUser(token) {
  return request('/me', { token })
}

// SERVICES
// Service fields: name, price, duration_minutes, deposit_percentage (optional, default: 30)
export async function fetchServices() {
  const response = await request('/services')
  // Handle both {data: [...]} and [...] response formats
  return response?.data || response || []
}

export function fetchService(id) {
  return request(`/services/${id}`)
}

export function fetchServiceImage(id) {
  return request(`/services/${id}/image`)
}

export function createService(data, token) {
  // data should include: name, price, duration_minutes, deposit_percentage, image (file or URL)
  const isForm = data instanceof FormData
  return request('/services', { method: 'POST', body: data, token, isForm })
}

export function updateService(id, data, token) {
  const isForm = data instanceof FormData
  return request(`/services/${id}`, { method: 'PUT', body: data, token, isForm })
}

export function deleteService(id, token) {
  return request(`/services/${id}`, { method: 'DELETE', token })
}

// EMPLOYEES
// Employee fields: name, phone (optional) - position field has been removed
export async function fetchEmployees() {
  const response = await request('/employees')
  return response?.data || response || []
}

export function fetchEmployee(id) {
  return request(`/employees/${id}`)
}

export function createEmployee(data, token) {
  // data should include: name, phone (optional)
  return request('/employees', { method: 'POST', body: data, token })
}

export function updateEmployee(id, data, token) {
  return request(`/employees/${id}`, { method: 'PUT', body: data, token })
}

export function deleteEmployee(id, token) {
  return request(`/employees/${id}`, { method: 'DELETE', token })
}

// ORDERS
// Order fields: user_name, order_date, order_time (optional), status_id (1-6), notes (optional), deposit_percentage (optional), items (array)
// Status IDs: 1=pending, 2=confirmed, 3=checked_in, 4=in_progress, 5=completed, 6=cancelled
export async function fetchOrders(token, userId = null) {
  const url = userId ? `/orders?user_id=${userId}` : '/orders'
  const response = await request(url, { token })
  return response?.data || response || []
}

export function fetchOrder(id) {
  return request(`/orders/${id}`)
}

export function fetchOrderByBookingCode(bookingCode, token) {
  return request(`/orders?search=${encodeURIComponent(bookingCode)}`, { token })
}

export function createOrder(data, token) {
  // data should include: user_name, user_phone, order_date, order_time, status_id, notes, service_id, employee_id
  return request('/orders', { method: 'POST', body: data, token })
}

export function updateOrder(id, data, token) {
  return request(`/orders/${id}`, { method: 'PUT', body: data, token })
}

export function deleteOrder(id, token) {
  return request(`/orders/${id}`, { method: 'DELETE', token })
}

export function updateOrderStatus(id, statusId, token) {
  // statusId: 1-6 (pending, confirmed, checked_in, in_progress, completed, cancelled)
  const statusMap = {
    1: 'pending',
    2: 'confirmed',
    3: 'checked_in',
    4: 'in_progress',
    5: 'completed',
    6: 'cancelled'
  }
  const status = statusMap[statusId] || 'pending'
  return request(`/orders/${id}/status`, { method: 'PATCH', body: { status_id: statusId, status: status }, token })
}

export function assignEmployeeToOrder(orderId, employeeId, token) {
  // Assign employee to order (update order_items employee_id)
  return request(`/orders/${orderId}/assign-employee`, { method: 'PATCH', body: { employee_id: employeeId }, token })
}

// ORDER AVAILABILITY
export function checkOrderAvailability(data, token) {
  // data: { booking_date, booking_time, employee_id }
  return request('/orders/availability', { method: 'POST', body: data, token })
}

// STAFF AVAILABILITY
export function fetchStaffAvailability({ order_date, order_time, duration_minutes } = {}, token) {
  const params = new URLSearchParams()
  if (order_date) params.append('order_date', order_date)
  if (order_time) params.append('order_time', order_time)
  if (duration_minutes) params.append('duration_minutes', duration_minutes)
  return request(`/staff-availability?${params.toString()}`, { token })
}

// DASHBOARD
export function fetchDashboard(token) {
  return request('/dashboard', { token })
}

export function fetchDashboardSummary(token) {
  return request('/dashboard/summary', { token })
}

// WORK PROGRESS (/api/work-progress)
export async function fetchWorkProgressList(token) {
  const response = await request('/work-progress', { token })
  return response?.data || response || []
}

export function fetchWorkProgress(id, token) {
  return request(`/work-progress/${id}`, { token })
}

export function createWorkProgress(data, token) {
  return request('/work-progress', { method: 'POST', body: data, token })
}

export function updateWorkProgress(id, data, token) {
  return request(`/work-progress/${id}`, { method: 'PUT', body: data, token })
}

export function deleteWorkProgress(id, token) {
  return request(`/work-progress/${id}`, { method: 'DELETE', token })
}

// PROGRESS (alias)
export async function fetchProgress(token) {
  return fetchWorkProgressList(token)
}

export function fetchProgressItem(id, token) {
  return fetchWorkProgress(id, token)
}

export function createProgress(data, token) {
  return createWorkProgress(data, token)
}

export function updateProgress(id, data, token) {
  return updateWorkProgress(id, data, token)
}

export function deleteProgress(id, token) {
  return deleteWorkProgress(id, token)
}

// MEMBERSHIPS
export async function fetchMemberships(token) {
  const response = await request('/memberships', { token })
  return response?.data || response || []
}

export function fetchMembership(id, token) {
  return request(`/memberships/${id}`, { token })
}

export function fetchMembershipByUser(userId, token) {
  return request(`/memberships/user/${userId}`, { token })
}

export function createMembership(data, token) {
  return request('/memberships', { method: 'POST', body: data, token })
}

export function updateMembership(id, data, token) {
  return request(`/memberships/${id}`, { method: 'PUT', body: data, token })
}

export function deleteMembership(id, token) {
  return request(`/memberships/${id}`, { method: 'DELETE', token })
}

// CUSTOMER NOTIFICATIONS
export async function fetchCustomerNotifications(token) {
  const response = await request('/customer-notifications', { token })
  return response?.data || response || []
}

export function fetchCustomerNotification(id, token) {
  return request(`/customer-notifications/${id}`, { token })
}

export function createCustomerNotification(data, token) {
  return request('/customer-notifications', { method: 'POST', body: data, token })
}

export function updateCustomerNotification(id, data, token) {
  return request(`/customer-notifications/${id}`, { method: 'PUT', body: data, token })
}

export function deleteCustomerNotification(id, token) {
  return request(`/customer-notifications/${id}`, { method: 'DELETE', token })
}

export function sendCustomerNotification(data, token) {
  return request('/customer-notifications/send', { method: 'POST', body: data, token })
}

export function sendReminder(data, token) {
  return request('/customer-notifications/send-reminder', { method: 'POST', body: data, token })
}

export function sendPaymentReminder(data, token) {
  return request('/customer-notifications/payment-reminder', { method: 'POST', body: data, token })
}

// NOTIFICATION TEMPLATES
export async function fetchNotificationTemplates(token) {
  const response = await request('/notification-templates', { token })
  return Array.isArray(response) ? response : (response?.data || [])
}

export function fetchNotificationTemplate(id, token) {
  return request(`/notification-templates/${id}`, { token })
}

export function fetchNotificationTemplateByType(type, token) {
  return request(`/notification-templates/type/${type}`, { token })
}

export function createNotificationTemplate(data, token) {
  return request('/notification-templates', { method: 'POST', body: data, token })
}

export function updateNotificationTemplate(id, data, token) {
  return request(`/notification-templates/${id}`, { method: 'PUT', body: data, token })
}

export function deleteNotificationTemplate(id, token) {
  return request(`/notification-templates/${id}`, { method: 'DELETE', token })
}

// ADMIN NOTIFICATIONS (/api/admin/notifications)
export async function fetchAdminNotifications(token) {
  const response = await request('/admin/notifications', { token })
  return response?.data || response || []
}

export function fetchAdminNotification(id, token) {
  return request(`/admin/notifications/${id}`, { token })
}

export function createAdminNotification(data, token) {
  return request('/admin/notifications', { method: 'POST', body: data, token })
}

export function updateAdminNotification(id, data, token) {
  return request(`/admin/notifications/${id}`, { method: 'PUT', body: data, token })
}

export function deleteAdminNotification(id, token) {
  return request(`/admin/notifications/${id}`, { method: 'DELETE', token })
}

// NOTIFICATIONS (alias for backward compatibility)
export async function fetchNotifications(token) {
  return fetchAdminNotifications(token)
}

export function fetchNotification(id, token) {
  return fetchAdminNotification(id, token)
}

export function createNotification(data, token) {
  return createAdminNotification(data, token)
}

export function updateNotification(id, data, token) {
  return updateAdminNotification(id, data, token)
}

export function deleteNotification(id, token) {
  return deleteAdminNotification(id, token)
}

// CUSTOMER NOTIFICATIONS aliases
export async function fetchCustomerNotificationsList(token) {
  return fetchCustomerNotifications(token)
}

// PAYMENTS (Midtrans)
export function createPaymentToken(data, token) {
  // data should include order details for Midtrans Snap
  return request('/payments/snap', { method: 'POST', body: data, token })
}

export function createInvoice(data, token) {
  // Alias for payments/snap
  return request('/create-invoice', { method: 'POST', body: data, token })
}

export function testPayment(data) {
  // Test payment without database
  return request('/payments/snap-test', { method: 'POST', body: data })
}

export function midtransWebhook(data) {
  // Webhook from Midtrans
  return request('/midtrans/webhook', { method: 'POST', body: data })
}

// USERS
export async function fetchUsers(token) {
  const response = await request('/users', { token })
  return response?.data || response || []
}

// EMPLOYEE SCHEDULES
export async function fetchEmployeeSchedules(token) {
  // Fetch schedules for all employees
  try {
    const employees = await fetchEmployees(token)
    const allSchedules = []
    for (const emp of employees) {
      try {
        const response = await request(`/employees/${emp.id}/schedules`, { token })
        const schedules = response?.data || response || []
        schedules.forEach(s => {
          s.employee_id = emp.id
          allSchedules.push(s)
        })
      } catch (e) {
        if (e.status !== 404) {
          console.warn(`Failed to fetch schedules for employee ${emp.id}:`, e.message)
        }
      }
    }
    return allSchedules
  } catch (e) {
    console.warn('Failed to fetch employees for schedules:', e.message)
    return []
  }
}

export function fetchEmployeeSchedule(employeeId, token) {
  return request(`/employees/${employeeId}/schedules`, { token })
}

export function createEmployeeSchedule(employeeId, data, token) {
  return request(`/employees/${employeeId}/schedules`, { method: 'POST', body: data, token })
}

export function deleteEmployeeSchedule(employeeId, scheduleId, token) {
  return request(`/employees/${employeeId}/schedules/${scheduleId}`, { method: 'DELETE', token })
}

// EMPLOYEE SERVICES
export async function fetchEmployeeServicesList(token) {
  // Fetch services for all employees
  try {
    const employees = await fetchEmployees(token)
    const allServices = []
    for (const emp of employees) {
      try {
        const response = await request(`/employees/${emp.id}/services`, { token })
        const services = response?.data || response || []
        services.forEach(s => {
          s.employee_id = emp.id
          s.id = s.id || `${emp.id}-${s.service_id}`
          allServices.push(s)
        })
      } catch (e) {
        if (e.status !== 404) {
          console.warn(`Failed to fetch services for employee ${emp.id}:`, e.message)
        }
      }
    }
    return allServices
  } catch (e) {
    console.warn('Failed to fetch employees for services:', e.message)
    return []
  }
}

export function deleteEmployeeServiceItem(employeeId, serviceId, token) {
  return request(`/employees/${employeeId}/services/${serviceId}`, { method: 'DELETE', token })
}

// EMPLOYEE TIME OFF
export async function fetchEmployeeTimeOffs(token) {
  // Fetch time offs for all employees
  try {
    const employees = await fetchEmployees(token)
    const allTimeOffs = []
    for (const emp of employees) {
      try {
        const response = await request(`/employees/${emp.id}/time-offs`, { token })
        const timeOffs = response?.data || response || []
        timeOffs.forEach(t => {
          t.employee_id = emp.id
          allTimeOffs.push(t)
        })
      } catch (e) {
        if (e.status !== 404) {
          console.warn(`Failed to fetch time-offs for employee ${emp.id}:`, e.message)
        }
      }
    }
    return allTimeOffs
  } catch (e) {
    console.warn('Failed to fetch employees for time-offs:', e.message)
    return []
  }
}

export function approveTimeOff(employeeId, timeOffId, token) {
  return request(`/employees/${employeeId}/time-offs/${timeOffId}/approve`, { method: 'PATCH', token })
}

export function rejectTimeOff(employeeId, timeOffId, token) {
  return request(`/employees/${employeeId}/time-offs/${timeOffId}/reject`, { method: 'PATCH', token })
}

export function deleteTimeOff(employeeId, timeOffId, token) {
  return request(`/employees/${employeeId}/time-offs/${timeOffId}`, { method: 'DELETE', token })
}

// ORDER ITEMS (extracted from orders)
export async function fetchOrderItemsList(token) {
  const orders = await fetchOrders(token)
  const allItems = []
  for (const order of orders) {
    const items = order.order_items || order.items || []
    items.forEach(item => {
      item.order_id = order.id
      item.booking_code = order.booking_code
      allItems.push(item)
    })
  }
  return allItems
}

// ORDER LOGS (placeholder - API might not have this endpoint)
export async function fetchOrderLogs(token) {
  try {
    const response = await request('/order-logs', { token })
    return response?.data || response || []
  } catch (e) {
    if (e.status !== 404) {
      console.warn('Order logs endpoint not available:', e.message)
    }
    return []
  }
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

export function register(data) {
  return request('/register', { method: 'POST', body: data })
}

export function logout(token) {
  return request('/logout', { method: 'POST', token })
}

// CUSTOMER PROFILE
export function fetchCustomerProfiles(token) {
  return request('/customer-profiles', { token })
}

export function fetchCustomerProfileByUser(userId, token) {
  return request(`/customer-profiles?user_id=${userId}`, { token })
}

export function fetchCustomerProfile(id, token) {
  return request(`/customer-profiles/${id}`, { token })
}

export function createCustomerProfile(data, token) {
  return request('/customer-profiles', { method: 'POST', body: data, token })
}

export function updateCustomerProfile(id, data, token) {
  return request(`/customer-profiles/${id}`, { method: 'PUT', body: data, token })
}

export function deleteCustomerProfile(id, token) {
  return request(`/customer-profiles/${id}`, { method: 'DELETE', token })
}

// NOTIFICATIONS - Additional functions
export function markNotificationAsRead(id, token) {
  return request(`/notifications/${id}/read`, { method: 'PATCH', token })
}

export function markAllNotificationsAsRead(token) {
  return request('/notifications/read-all', { method: 'PATCH', token })
}

export default {
  // Test
  testApi,
  // Services
  fetchServices,
  fetchService,
  fetchServiceImage,
  createService,
  updateService,
  deleteService,
  // Employees
  fetchEmployees,
  fetchEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  // Orders
  fetchOrders,
  fetchOrder,
  fetchOrderByBookingCode,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  assignEmployeeToOrder,
  checkOrderAvailability,
  fetchStaffAvailability,
  fetchDashboard,
  fetchDashboardSummary,
  // Work Progress
  fetchWorkProgressList,
  fetchWorkProgress,
  createWorkProgress,
  updateWorkProgress,
  deleteWorkProgress,
  // Progress (alias)
  fetchProgress,
  fetchProgressItem,
  createProgress,
  updateProgress,
  deleteProgress,
  // Memberships
  fetchMemberships,
  fetchMembership,
  fetchMembershipByUser,
  createMembership,
  updateMembership,
  deleteMembership,
  // Customer Notifications
  fetchCustomerNotifications,
  fetchCustomerNotification,
  createCustomerNotification,
  updateCustomerNotification,
  deleteCustomerNotification,
  sendCustomerNotification,
  sendReminder,
  sendPaymentReminder,
  // Notification Templates
  fetchNotificationTemplates,
  fetchNotificationTemplate,
  fetchNotificationTemplateByType,
  createNotificationTemplate,
  updateNotificationTemplate,
  deleteNotificationTemplate,
  // Notifications (legacy alias)
  fetchNotifications,
  fetchNotification,
  createNotification,
  updateNotification,
  deleteNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  // Payments
  createPaymentToken,
  createInvoice,
  testPayment,
  midtransWebhook,
  // Users
  fetchUsers,
  fetchUser,
  createUser,
  updateUser,
  deleteUser,
  // Employee Schedules
  fetchEmployeeSchedules,
  fetchEmployeeSchedule,
  createEmployeeSchedule,
  deleteEmployeeSchedule,
  // Employee Services
  fetchEmployeeServicesList,
  deleteEmployeeServiceItem,
  // Employee Time Off
  fetchEmployeeTimeOffs,
  approveTimeOff,
  rejectTimeOff,
  deleteTimeOff,
  // Order Items
  fetchOrderItemsList,
  fetchOrderLogs,
  // Auth
  requestPasswordReset,
  getResetPasswordForm,
  resetPassword,
  login,
  register,
  logout
}
