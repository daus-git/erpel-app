/**
 * Utility functions for managing data persistence with localStorage
 */

// Keys for localStorage
const STORAGE_KEYS = {
  USERS: 'salon_users',
  PRODUCTS: 'salon_products',
  SERVICES: 'salon_services',
  ORDERS: 'salon_orders',
  PROGRESS: 'salon_progress',
  TEMPLATES: 'salon_templates',
  TRANSACTIONS: 'salon_transactions',
  STOCK: 'salon_stock'
}

/**
 * Get data from localStorage, fallback to default data if not exists
 * @param {string} key - localStorage key
 * @param {Array|Object} defaultData - default data to return if key doesn't exist
 * @returns {Array|Object} parsed data or default data
 */
export function getFromStorage(key, defaultData = []) {
  try {
    const item = localStorage.getItem(key)
    if (item === null) {
      // If not in localStorage, save default data and return it
      setToStorage(key, defaultData)
      return defaultData
    }
    return JSON.parse(item)
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error)
    return defaultData
  }
}

/**
 * Save data to localStorage
 * @param {string} key - localStorage key
 * @param {Array|Object} data - data to save
 */
export function setToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error)
  }
}

/**
 * Remove data from localStorage
 * @param {string} key - localStorage key
 */
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error)
  }
}

/**
 * Clear all salon-related data from localStorage
 */
export function clearAllSalonData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    removeFromStorage(key)
  })
}

// Specific functions for each data type
export const usersStorage = {
  get: () => getFromStorage(STORAGE_KEYS.USERS, []),
  set: (data) => setToStorage(STORAGE_KEYS.USERS, data),
  add: (user) => {
    const users = usersStorage.get()
    users.push(user)
    usersStorage.set(users)
  },
  update: (userId, updatedUser) => {
    const users = usersStorage.get()
    const index = users.findIndex(u => u.id === userId)
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser }
      usersStorage.set(users)
    }
  },
  delete: (userId) => {
    const users = usersStorage.get()
    const filtered = users.filter(u => u.id !== userId)
    usersStorage.set(filtered)
  }
}

export const productsStorage = {
  get: () => getFromStorage(STORAGE_KEYS.PRODUCTS, []),
  set: (data) => setToStorage(STORAGE_KEYS.PRODUCTS, data),
  add: (product) => {
    const products = productsStorage.get()
    products.push(product)
    productsStorage.set(products)
  },
  update: (productId, updatedProduct) => {
    const products = productsStorage.get()
    const index = products.findIndex(p => p.id === productId)
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct }
      productsStorage.set(products)
    }
  },
  delete: (productId) => {
    const products = productsStorage.get()
    const filtered = products.filter(p => p.id !== productId)
    productsStorage.set(filtered)
  }
}

export const servicesStorage = {
  get: () => getFromStorage(STORAGE_KEYS.SERVICES, []),
  set: (data) => setToStorage(STORAGE_KEYS.SERVICES, data),
  add: (service) => {
    const services = servicesStorage.get()
    services.push(service)
    servicesStorage.set(services)
  },
  update: (serviceId, updatedService) => {
    const services = servicesStorage.get()
    const index = services.findIndex(s => s.id === serviceId)
    if (index !== -1) {
      services[index] = { ...services[index], ...updatedService }
      servicesStorage.set(services)
    }
  },
  delete: (serviceId) => {
    const services = servicesStorage.get()
    const filtered = services.filter(s => s.id !== serviceId)
    servicesStorage.set(filtered)
  }
}

export const ordersStorage = {
  get: () => getFromStorage(STORAGE_KEYS.ORDERS, []),
  set: (data) => setToStorage(STORAGE_KEYS.ORDERS, data),
  add: (order) => {
    const orders = ordersStorage.get()
    orders.push(order)
    ordersStorage.set(orders)
  },
  update: (orderId, updatedOrder) => {
    const orders = ordersStorage.get()
    const index = orders.findIndex(o => o.id === orderId)
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updatedOrder }
      ordersStorage.set(orders)
    }
  },
  delete: (orderId) => {
    const orders = ordersStorage.get()
    const filtered = orders.filter(o => o.id !== orderId)
    ordersStorage.set(filtered)
  }
}

export const progressStorage = {
  get: () => getFromStorage(STORAGE_KEYS.PROGRESS, []),
  set: (data) => setToStorage(STORAGE_KEYS.PROGRESS, data),
  add: (progress) => {
    const progressData = progressStorage.get()
    progressData.push(progress)
    progressStorage.set(progressData)
  },
  update: (progressId, updatedProgress) => {
    const progressData = progressStorage.get()
    const index = progressData.findIndex(p => p.id === progressId)
    if (index !== -1) {
      progressData[index] = { ...progressData[index], ...updatedProgress }
      progressStorage.set(progressData)
    }
  },
  delete: (progressId) => {
    const progressData = progressStorage.get()
    const filtered = progressData.filter(p => p.id !== progressId)
    progressStorage.set(filtered)
  }
}

export const templatesStorage = {
  get: () => getFromStorage(STORAGE_KEYS.TEMPLATES, []),
  set: (data) => setToStorage(STORAGE_KEYS.TEMPLATES, data),
  add: (template) => {
    const templates = templatesStorage.get()
    templates.push(template)
    templatesStorage.set(templates)
  },
  update: (templateId, updatedTemplate) => {
    const templates = templatesStorage.get()
    const index = templates.findIndex(t => t.id === templateId)
    if (index !== -1) {
      templates[index] = { ...templates[index], ...updatedTemplate }
      templatesStorage.set(templates)
    }
  },
  delete: (templateId) => {
    const templates = templatesStorage.get()
    const filtered = templates.filter(t => t.id !== templateId)
    templatesStorage.set(filtered)
  }
}

export const transactionsStorage = {
  get: () => getFromStorage(STORAGE_KEYS.TRANSACTIONS, []),
  set: (data) => setToStorage(STORAGE_KEYS.TRANSACTIONS, data),
  add: (transaction) => {
    const transactions = transactionsStorage.get()
    transactions.push(transaction)
    transactionsStorage.set(transactions)
  },
  update: (transactionId, updatedTransaction) => {
    const transactions = transactionsStorage.get()
    const index = transactions.findIndex(t => t.id === transactionId)
    if (index !== -1) {
      transactions[index] = { ...transactions[index], ...updatedTransaction }
      transactionsStorage.set(transactions)
    }
  },
  delete: (transactionId) => {
    const transactions = transactionsStorage.get()
    const filtered = transactions.filter(t => t.id !== transactionId)
    transactionsStorage.set(filtered)
  }
}

export const stockStorage = {
  get: () => getFromStorage(STORAGE_KEYS.STOCK, []),
  set: (data) => setToStorage(STORAGE_KEYS.STOCK, data),
  add: (stock) => {
    const stockData = stockStorage.get()
    stockData.push(stock)
    stockStorage.set(stockData)
  },
  update: (stockId, updatedStock) => {
    const stockData = stockStorage.get()
    const index = stockData.findIndex(s => s.id === stockId)
    if (index !== -1) {
      stockData[index] = { ...stockData[index], ...updatedStock }
      stockStorage.set(stockData)
    }
  },
  delete: (stockId) => {
    const stockData = stockStorage.get()
    const filtered = stockData.filter(s => s.id !== stockId)
    stockStorage.set(filtered)
  }
}
