<template>
  <div class="min-h-screen bg-[#FDF8F4] p-4 md:p-8">
    <header class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
      <h1 class="text-3xl font-bold tracking-tight text-amber-950">Admin Dashboard</h1>
      <div class="flex gap-3">
        <button @click="syncData" :disabled="loading" class="flex items-center gap-2 px-5 py-2.5 bg-amber-800 text-white rounded-xl shadow-lg hover:bg-amber-900 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
          <span class="font-semibold">{{ loading ? 'Loading...' : 'Sync' }}</span>
        </button>
        <button @click="logout" class="flex items-center gap-2 px-5 py-2.5 border border-orange-200 bg-white text-amber-800 rounded-xl hover:bg-orange-50 transition-all">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span class="font-semibold">Logout</span>
        </button>
      </div>
    </header>

    <main class="max-w-7xl mx-auto space-y-8">
      <!-- Stats (computed from loaded data) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-amber-800/85 backdrop-blur-sm p-6 rounded-[2rem] text-white flex items-center gap-5 shadow-xl border border-amber-700/30">
          <div class="p-3 bg-white/15 rounded-2xl ring-1 ring-white/20">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-amber-100/70">Users</p>
            <p class="text-3xl font-bold">{{ stats.Users }}</p>
          </div>
        </div>
        <div class="bg-amber-800/85 backdrop-blur-sm p-6 rounded-[2rem] text-white flex items-center gap-5 shadow-xl border border-amber-700/30">
          <div class="p-3 bg-white/15 rounded-2xl ring-1 ring-white/20">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><path d="M9 14l2 2 4-4"/></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-amber-100/70">Orders</p>
            <p class="text-3xl font-bold">{{ stats.Orders }}</p>
          </div>
        </div>
        <div class="bg-amber-800/85 backdrop-blur-sm p-6 rounded-[2rem] text-white flex items-center gap-5 shadow-xl border border-amber-700/30">
          <div class="p-3 bg-white/15 rounded-2xl ring-1 ring-white/20">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-amber-100/70">Services</p>
            <p class="text-3xl font-bold">{{ stats.Services }}</p>
          </div>
        </div>
        <div class="bg-amber-800/85 backdrop-blur-sm p-6 rounded-[2rem] text-white flex items-center gap-5 shadow-xl border border-amber-700/30">
          <div class="p-3 bg-white/15 rounded-2xl ring-1 ring-white/20">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
          </div>
          <div>
            <p class="text-sm font-medium text-amber-100/70">Members</p>
            <p class="text-3xl font-bold">{{ stats.Members }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-orange-100/50 p-1.5 rounded-2xl flex flex-wrap gap-1 shadow-inner border border-orange-100">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="activeTab = tab"
          class="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          :class="activeTab === tab ? 'bg-amber-800 text-white shadow-md' : 'text-amber-800 hover:bg-orange-200/50'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="bg-white rounded-2xl p-12 text-center border border-orange-100">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-800 mx-auto mb-4"></div>
        <p class="text-amber-800">Loading data...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-800">
        <div class="flex gap-3">
          <svg class="w-6 h-6 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <div>
            <h3 class="font-bold text-lg mb-1">Error loading data</h3>
            <p>{{ error }}</p>
            <button @click="syncData" class="mt-3 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900">Retry</button>
          </div>
        </div>
      </div>

      <!-- Users Tab -->
      <div v-else-if="activeTab === 'Users'" class="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-2xl font-bold text-amber-900">Users</h2>
            <p class="text-sm text-amber-700/60">Kelola pengguna ({{ usersData.length }})</p>
          </div>
          <div class="flex gap-2">
            <button @click="printTable('users')" class="flex items-center gap-2 px-4 py-2 border border-orange-200 text-amber-800 rounded-lg hover:bg-orange-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4.586a1 1 0 00.293.707l1.414 1.414a1 1 0 00.707.293H15a1 1 0 001-1v-1a1 1 0 00-1-1h-2.586a1 1 0 00-.707.293l-1.414 1.414A1 1 0 007 11.414V9a2 2 0 00-2-2V5a2 2 0 012-2h10a2 2 0 012 2z"></path></svg>
              Print
            </button>
            <button @click="showAddUserModal = true" class="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 shadow-md">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Tambah
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
<table id="users-table" class="w-full text-left">
            <thead>
              <tr class="bg-orange-50 text-amber-900 uppercase text-xs font-bold tracking-wider">
                <th class="px-4 py-3 rounded-l-lg">Nama</th>
                <th class="px-4 py-3">Email</th>
                <th class="px-4 py-3">Telepon</th>
                <th class="px-4 py-3">Role</th>
                <th class="px-4 py-3 rounded-r-lg">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-orange-50">
              <tr v-for="user in usersData" :key="user.id" class="hover:bg-orange-50/30 transition-colors text-sm text-amber-900">
                <td class="px-4 py-4 font-medium">{{ user.name }}</td>
                <td class="px-4 py-4">{{ user.email }}</td>
                <td class="px-4 py-4">{{ user.phone || '-' }}</td>
                <td class="px-4 py-4">
                  <span class="px-3 py-1 bg-orange-100 text-amber-800 rounded-full text-xs capitalize">{{ user.role }}</span>
                </td>
                <td class="px-4 py-4 flex gap-3 font-medium">
                  <button class="text-amber-700 hover:underline" @click="editUser(user)">Edit</button>
                  <button class="text-red-400 hover:text-red-600" @click="deleteUser(user.id)">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit User Modal -->
      <div v-if="showAddUserModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div class="p-6 border-b border-orange-100">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold text-amber-900">{{ editingUser ? 'Edit User' : 'Tambah User Baru' }}</h3>
              <button @click="closeUserModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input v-model="userForm.name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Masukkan nama">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="userForm.email" type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Masukkan email">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
              <input v-model="userForm.phone" type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Masukkan nomor telepon">
            </div>
            <div v-if="!editingUser">
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input v-model="userForm.password" type="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Masukkan password">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select v-model="userForm.role" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div class="p-6 border-t border-orange-100 flex gap-3">
            <button @click="closeUserModal" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Batal
            </button>
            <button @click="saveUser" class="flex-1 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900">
              {{ editingUser ? 'Simpan' : 'Tambah' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Add/Edit Template Modal -->
      <div v-if="showAddTemplateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
          <div class="p-6 border-b border-orange-100">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold text-amber-900">{{ editingTemplate ? 'Edit Template' : 'Tambah Template Baru' }}</h3>
              <button @click="closeTemplateModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Template</label>
              <input v-model="templateForm.name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="contoh: Payment Reminder">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select v-model="templateForm.type" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option value="">Pilih type</option>
                <option value="payment_reminder">Payment Reminder</option>
                <option value="order_confirmation">Order Confirmation</option>
                <option value="appointment_reminder">Appointment Reminder</option>
                <option value="order_completed">Order Completed</option>
                <option value="promotion">Promotion</option>
                <option value="welcome">Welcome</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Channel</label>
              <select v-model="templateForm.channel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="in_app">In App</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input v-model="templateForm.title" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Contoh: Konfirmasi Order {booking_code}">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea v-model="templateForm.message" rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Contoh: Halo {name}, booking {service} Anda pada {date} jam {time} telah dikonfirmasi. Kode: {booking_code}"></textarea>
              <div class="text-xs text-gray-500 mt-2 space-y-1">
                <p class="font-medium text-amber-700">Variabel yang tersedia:</p>
                <p><b>Semua tipe:</b> <code>{name}</code> <code>{service}</code> <code>{date}</code> <code>{time}</code> <code>{booking_code}</code> <code>{price}</code> <code>{location}</code></p>
                <p><b>appointment_reminder / order_completed:</b> <code>{employee}</code> <code>{remaining_balance}</code></p>
                <p><b>payment_reminder:</b> <code>{deposit}</code></p>
              </div>
            </div>
            <div class="flex items-center">
              <input v-model="templateForm.is_active" type="checkbox" id="is_active" class="mr-2">
              <label for="is_active" class="text-sm text-gray-700">Template Aktif</label>
            </div>
          </div>
          <div class="p-6 border-t border-orange-100 flex gap-3">
            <button @click="closeTemplateModal" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Batal
            </button>
            <button @click="saveTemplate" class="flex-1 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900">
              {{ editingTemplate ? 'Simpan' : 'Tambah' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Add/Edit Service Modal -->
      <div v-if="showAddServiceModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div class="p-6 border-b border-orange-100">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold text-amber-900">{{ editingService ? 'Edit Service' : 'Tambah Service Baru' }}</h3>
              <button @click="closeServiceModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Service</label>
              <input v-model="serviceForm.name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Masukkan nama service">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
              <input v-model.number="serviceForm.price" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Masukkan harga">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Durasi (menit)</label>
              <input v-model.number="serviceForm.duration_minutes" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Masukkan durasi dalam menit">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Deposit Percentage (%)</label>
              <input v-model.number="serviceForm.deposit_percentage" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Masukkan persentase deposit">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input @change="handleServiceImageChange" type="file" accept="image/*" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              <div v-if="serviceForm.image" class="mt-2">
                <img :src="serviceForm.image" alt="Preview" class="w-20 h-20 object-cover rounded-lg border border-gray-200">
              </div>
            </div>
          </div>
          <div class="p-6 border-t border-orange-100 flex gap-3">
            <button @click="closeServiceModal" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Batal
            </button>
            <button @click="saveService" class="flex-1 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900">
              {{ editingService ? 'Simpan' : 'Tambah' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Add/Edit Order Modal -->
      <div v-if="showAddOrderModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-orange-100 sticky top-0 bg-white">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold text-amber-900">{{ editingOrder ? 'Edit Order' : 'Tambah Order Baru' }}</h3>
              <button @click="closeOrderModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Customer *</label>
              <input v-model="orderForm.user_name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Masukkan nama customer">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
              <input v-model="orderForm.user_phone" type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Masukkan nomor telepon">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Order *</label>
                <input v-model="orderForm.order_date" type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jam</label>
                <input v-model="orderForm.order_time" type="time" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Layanan</label>
              <select v-model="orderForm.service_id" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option :value="null">Pilih Layanan</option>
                <option v-for="service in servicesData" :key="service.id" :value="service.id">{{ service.name }} - Rp {{ service.price.toLocaleString() }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Staff</label>
              <select v-model="orderForm.employee_id" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option :value="null">Pilih Staff</option>
                <option v-for="employee in employeesData" :key="employee.id" :value="employee.id">{{ employee.name }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                <input v-model.number="orderForm.price" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Masukkan harga">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Durasi (menit)</label>
                <input v-model.number="orderForm.duration_minutes" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Durasi dalam menit">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="orderForm.status_id" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option :value="1">Pending</option>
                <option :value="2">Confirmed</option>
                <option :value="3">Checked In</option>
                <option :value="4">In Progress</option>
                <option :value="5">Completed</option>
                <option :value="6">Cancelled</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea v-model="orderForm.notes" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Catatan tambahan"></textarea>
            </div>
          </div>
          <div class="p-6 border-t border-orange-100 flex gap-3">
            <button @click="closeOrderModal" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Batal
            </button>
            <button @click="saveOrder" class="flex-1 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900">
              {{ editingOrder ? 'Simpan' : 'Tambah' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Other tabs with API data... (Progress, Notifications implemented similarly) -->
      <div v-else-if="activeTab === 'Progress'" class="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
        <div class="flex justify-between items-start mb-6">
<div>
            <h2 class="text-2xl font-bold text-amber-900">Progress</h2>
            <p class="text-sm text-amber-700/60">Kelola progress pesanan ({{ progressData.length }})</p>
          </div>
          <div class="flex gap-2">
            <button @click="printTable('progress')" class="flex items-center gap-2 px-4 py-2 border border-orange-200 text-amber-800 rounded-lg hover:bg-orange-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4.586a1 1 0 00.293.707l1.414 1.414a1 1 0 00.707.293H15a1 1 0 001-1v-1a1 1 0 00-1-1h-2.586a1 1 0 00-.707.293l-1.414 1.414A1 1 0 007 11.414V9a2 2 0 00-2-2V5a2 2 0 012-2h10a2 2 0 012 2z"></path></svg>
              Print
            </button>
            <button @click="addProgress" class="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 shadow-md">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Tambah
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
<table id="progress-table" class="w-full text-left">
            <thead>
              <tr class="bg-orange-50 text-amber-900 uppercase text-xs font-bold">
                <th class="px-4 py-3 rounded-l-lg">Waktu</th>
                <th class="px-4 py-3">Order</th>
                <th class="px-4 py-3">Pelanggan</th>
                <th class="px-4 py-3">Layanan</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3 rounded-r-lg">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-orange-50">
              <tr v-for="progress in progressData" :key="progress.id" class="text-sm text-amber-900 hover:bg-orange-50/30">
                <td class="px-4 py-4">
                  <div class="font-medium">{{ formatDateTime(progress.created_at) }}</div>
                </td>
                <td class="px-4 py-4">
                  <span class="font-mono text-xs px-2 py-1 bg-amber-100 rounded">{{ progress.order?.booking_code || progress.order_id }}</span>
                </td>
                <td class="px-4 py-4 font-medium">{{ progress.order?.user_name || progress.customer_name || '-' }}</td>
                <td class="px-4 py-4">{{ progress.order?.service?.name || progress.service_name || '-' }}</td>
                <td class="px-4 py-4">
                  <span :class="getProgressStatusClass(progress.status)" class="px-3 py-1 rounded-full text-xs font-semibold">{{ formatProgressStatus(progress.status) }}</span>
                </td>
                <td class="px-4 py-4">
                   <button class="text-amber-700 hover:underline" @click="editProgress(progress)">Edit</button>
                   <button class="text-red-400 hover:text-red-600 font-medium" @click="deleteProgress(progress.id)">Hapus</button>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit Employee Modal -->
      <div v-if="showAddEmployeeModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div class="p-6 border-b border-orange-100">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold text-amber-900">{{ editingEmployee ? 'Edit Employee' : 'Tambah Employee Baru' }}</h3>
              <button @click="closeEmployeeModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Employee *</label>
              <input v-model="employeeForm.name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Masukkan nama employee">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
              <input v-model="employeeForm.phone" type="tel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Masukkan nomor telepon">
            </div>
            <div class="flex items-center">
              <input v-model="employeeForm.is_active" type="checkbox" id="employee_is_active" class="mr-2">
              <label for="employee_is_active" class="text-sm text-gray-700">Employee Aktif</label>
            </div>
          </div>
          <div class="p-6 border-t border-orange-100 flex gap-3">
            <button @click="closeEmployeeModal" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Batal
            </button>
            <button @click="saveEmployee" class="flex-1 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900">
              {{ editingEmployee ? 'Simpan' : 'Tambah' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Add/Edit Membership Modal -->
      <div v-if="showAddMembershipModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div class="p-6 border-b border-orange-100">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold text-amber-900">{{ editingMembership ? 'Edit Membership' : 'Tambah Membership Baru' }}</h3>
              <button @click="closeMembershipModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <select v-model="membershipForm.user_id" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option :value="null">Pilih User</option>
                <option v-for="user in usersData" :key="user.id" :value="user.id">{{ user.name }} ({{ user.email }})</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Member Code</label>
              <input v-model="membershipForm.member_code" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="MBR-XXXX (kosongkan untuk auto-generate)">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Membership Level</label>
              <select v-model="membershipForm.membership_level" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Points</label>
                <input v-model.number="membershipForm.points" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Total Spent</label>
                <input v-model.number="membershipForm.total_spent" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              </div>
            </div>
            <div class="flex items-center">
              <input v-model="membershipForm.is_active" type="checkbox" id="membership_is_active" class="mr-2">
              <label for="membership_is_active" class="text-sm text-gray-700">Membership Aktif</label>
            </div>
          </div>
          <div class="p-6 border-t border-orange-100 flex gap-3">
            <button @click="closeMembershipModal" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Batal
            </button>
            <button @click="saveMembership" class="flex-1 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900">
              {{ editingMembership ? 'Simpan' : 'Tambah' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Add/Edit Progress Modal -->
      <div v-if="showAddProgressModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div class="p-6 border-b border-orange-100">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold text-amber-900">{{ editingProgress ? 'Edit Progress' : 'Tambah Progress Baru' }}</h3>
              <button @click="closeProgressModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Order *</label>
              <select v-model="progressForm.order_id" @change="onOrderChange" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option :value="null">Pilih Order</option>
                <option v-for="order in ordersData" :key="order.id" :value="order.id">
                  {{ order.booking_code }} - {{ order.user_name }} ({{ order.service?.name || 'N/A' }})
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Staff</label>
              <select v-model="progressForm.staff_id" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option :value="null">Pilih Staff</option>
                <option v-for="employee in employeesData" :key="employee.id" :value="employee.id">{{ employee.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
              <input v-model="progressForm.service_name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Nama layanan">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input v-model.number="progressForm.price" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Harga">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="progressForm.status" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea v-model="progressForm.notes" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Catatan"></textarea>
            </div>
          </div>
          <div class="p-6 border-t border-orange-100 flex gap-3">
            <button @click="closeProgressModal" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Batal
            </button>
            <button @click="saveProgress" class="flex-1 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900">
              {{ editingProgress ? 'Simpan' : 'Tambah' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications Tab (Templates) -->
<div v-else-if="activeTab === 'Notifications'" class="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h2 class="text-2xl font-bold text-amber-900">Notification Templates</h2>
            <p class="text-sm text-amber-700/60">Kelola template pesan ({{ notificationsData.length }})</p>
          </div>
          <div class="flex gap-2">
            <button @click="printTable('notifications')" class="flex items-center gap-2 px-4 py-2 border border-orange-200 text-amber-800 rounded-lg hover:bg-orange-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4.586a1 1 0 00.293.707l1.414 1.414a1 1 0 00.707.293H15a1 1 0 001-1v-1a1 1 0 00-1-1h-2.586a1 1 0 00-.707.293l-1.414 1.414A1 1 0 007 11.414V9a2 2 0 00-2-2V5a2 2 0 012-2h10a2 2 0 012 2z"></path></svg>
              Print
            </button>
            <button @click="showAddTemplateModal = true" class="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 shadow-md">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Tambah
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table id="notifications-table" class="w-full text-left">
            <thead>
              <tr class="bg-orange-50 text-amber-900 uppercase text-xs font-bold">
                <th class="px-4 py-3 rounded-l-lg">Nama</th>
                <th class="px-4 py-3">Type</th>
                <th class="px-4 py-3">Channel</th>
                <th class="px-4 py-3">Title</th>
                <th class="px-4 py-3">Message</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3 rounded-r-lg">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-orange-50">
              <tr v-for="template in notificationsData" :key="template.id" class="text-sm text-amber-900">
                <td class="px-4 py-4 font-medium">{{ template.name }}</td>
                <td class="px-4 py-4">
                  <span class="bg-orange-100 px-2 py-1 rounded text-[10px]">{{ template.type }}</span>
                </td>
                <td class="px-4 py-4">
                  <span :class="getChannelClass(template.channel)" class="px-2 py-1 rounded text-[10px]">{{ template.channel }}</span>
                </td>
                <td class="px-4 py-4 truncate max-w-[150px]">{{ template.title }}</td>
                <td class="px-4 py-4 truncate max-w-[200px]">{{ template.message }}</td>
                <td class="px-4 py-4">
                  <span :class="template.is_active ? 'text-emerald-600' : 'text-gray-400'" class="font-bold">{{ template.is_active ? 'Aktif' : 'Nonaktif' }}</span>
                </td>
                <td class="px-4 py-4 flex gap-2">
                  <button class="text-amber-700 hover:underline" @click="editTemplate(template)">Edit</button>
                  <button class="text-red-400 hover:text-red-600" @click="deleteTemplate(template.id)">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
       </div>

       <!-- Orders Tab -->
<div v-else-if="activeTab === 'Orders'" class="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
         <div class="flex justify-between items-start mb-6">
           <div>
             <h2 class="text-2xl font-bold text-amber-900">Orders</h2>
             <p class="text-sm text-amber-700/60">Kelola pesanan ({{ ordersData.length }})</p>
           </div>
           <div class="flex gap-2">
             <button @click="printTable('orders')" class="flex items-center gap-2 px-4 py-2 border border-orange-200 text-amber-800 rounded-lg hover:bg-orange-50">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4.586a1 1 0 00.293.707l1.414 1.414a1 1 0 00.707.293H15a1 1 0 001-1v-1a1 1 0 00-1-1h-2.586a1 1 0 00-.707.293l-1.414 1.414A1 1 0 007 11.414V9a2 2 0 00-2-2V5a2 2 0 012-2h10a2 2 0 012 2z"></path></svg>
               Print
             </button>
             <button @click="showAddOrderModal = true" class="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 shadow-md">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
               Tambah
             </button>
           </div>
         </div>
         <div class="overflow-x-auto">
           <table id="orders-table" class="w-full text-left">
             <thead>
                <tr class="bg-orange-50 text-amber-900 uppercase text-xs font-bold tracking-wider">
                  <th class="px-4 py-3 rounded-l-lg">Order Code</th>
                  <th class="px-4 py-3">Customer Name</th>
                  <th class="px-4 py-3">Booked Service</th>
                  <th class="px-4 py-3">Booked Employee</th>
                   <th class="px-4 py-3">Chosen Date</th>
                   <th class="px-4 py-3">Total Harga</th>
                   <th class="px-4 py-3">Remaining Payment</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3 rounded-r-lg">Actions</th>
                </tr>
             </thead>
             <tbody class="divide-y divide-orange-50">
                <tr v-for="order in ordersData" :key="order.id" class="hover:bg-orange-50/30 transition-colors text-sm text-amber-900">
                  <td class="px-4 py-4 font-medium">{{ order.booking_code }}</td>
                  <td class="px-4 py-4">{{ order.user_name }}</td>
                  <td class="px-4 py-4">{{ order.service?.name || 'Unknown' }}</td>
                  <td class="px-4 py-4">{{ order.employee?.name || 'N/A' }}</td>
                   <td class="px-4 py-4">{{ formatDate(order.order_date) }} {{ order.order_time || '' }}</td>
                   <td class="px-4 py-4 font-semibold">Rp {{ Number(order.price || 0).toLocaleString() }}</td>
                    <td class="px-4 py-4">
                     <span v-if="getRemainingPayment(order) > 0" class="text-red-600 font-semibold">
                       Rp {{ getRemainingPayment(order).toLocaleString() }}
                     </span>
                     <span v-else class="text-green-600">
                       Lunas
                     </span>
                   </td>
                  <td class="px-4 py-4">
                    <span :class="getStatusClass(order.status_id)" class="px-3 py-1 rounded-full text-xs font-semibold">
                      {{ getStatusText(order.status_id) }}
                    </span>
                  </td>
                  <td class="px-4 py-4 flex gap-3 font-medium">
                    <button 
                      v-if="order.status_id === 1" 
                      @click="confirmOrder(order.id)" 
                      class="text-green-600 hover:text-green-800"
                    >Konfirmasi</button>
                    <button class="text-amber-700 hover:underline" @click="editOrder(order)">Edit</button>
                    <button class="text-red-400 hover:text-red-600" @click="deleteOrder(order.id)">Hapus</button>
                  </td>
                </tr>
             </tbody>
           </table>
         </div>
       </div>

       <!-- Employees Tab -->
       <div v-else-if="activeTab === 'Employees'" class="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
         <div class="flex justify-between items-start mb-6">
           <div>
             <h2 class="text-2xl font-bold text-amber-900">Employees</h2>
             <p class="text-sm text-amber-700/60">Kelola karyawan ({{ employeesData.length }})</p>
           </div>
           <div class="flex gap-2">
             <button @click="printTable('employees')" class="flex items-center gap-2 px-4 py-2 border border-orange-200 text-amber-800 rounded-lg hover:bg-orange-50">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4.586a1 1 0 00.293.707l1.414 1.414a1 1 0 00.707.293H15a1 1 0 001-1v-1a1 1 0 00-1-1h-2.586a1 1 0 00-.707.293l-1.414 1.414A1 1 0 007 11.414V9a2 2 0 00-2-2V5a2 2 0 012-2h10a2 2 0 012 2z"></path></svg>
               Print
             </button>
             <button @click="showAddEmployeeModal = true" class="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 shadow-md">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
               Tambah
             </button>
           </div>
         </div>
         <div class="overflow-x-auto">
<table id="employees-table" class="w-full text-left">
              <thead>
                <tr class="bg-orange-50 text-amber-900 uppercase text-xs font-bold tracking-wider">
                  <th class="px-4 py-3 rounded-l-lg">Name</th>
                  <th class="px-4 py-3">Phone</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3 rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-orange-50">
                <tr v-for="employee in employeesData" :key="employee.id" class="hover:bg-orange-50/30 transition-colors text-sm text-amber-900">
                  <td class="px-4 py-4 font-medium">{{ employee.name }}</td>
                  <td class="px-4 py-4">{{ employee.phone || '-' }}</td>
                  <td class="px-4 py-4">
                    <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">{{ employee.is_active ? 'Active' : 'Inactive' }}</span>
                  </td>
                  <td class="px-4 py-4 flex gap-3 font-medium">
                    <button class="text-amber-700 hover:underline" @click="editEmployee(employee)">Edit</button>
                    <button class="text-red-400 hover:text-red-600" @click="deleteEmployee(employee.id)">Hapus</button>
                  </td>
                </tr>
              </tbody>
           </table>
         </div>
       </div>

       <!-- Services Tab -->
       <div v-else-if="activeTab === 'Services'" class="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
         <div class="flex justify-between items-start mb-6">
           <div>
             <h2 class="text-2xl font-bold text-amber-900">Services</h2>
             <p class="text-sm text-amber-700/60">Kelola layanan ({{ servicesData.length }})</p>
           </div>
           <div class="flex gap-2">
             <button @click="printTable('services')" class="flex items-center gap-2 px-4 py-2 border border-orange-200 text-amber-800 rounded-lg hover:bg-orange-50">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4.586a1 1 0 00.293.707l1.414 1.414a1 1 0 00.707.293H15a1 1 0 001-1v-1a1 1 0 00-1-1h-2.586a1 1 0 00-.707.293l-1.414 1.414A1 1 0 007 11.414V9a2 2 0 00-2-2V5a2 2 0 012-2h10a2 2 0 012 2z"></path></svg>
               Print
             </button>
             <button @click="showAddServiceModal = true" class="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 shadow-md">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
               Tambah
             </button>
           </div>
         </div>
         <div class="overflow-x-auto">
<table id="services-table" class="w-full text-left">
               <thead>
                 <tr class="bg-orange-50 text-amber-900 uppercase text-xs font-bold tracking-wider">
                   <th class="px-4 py-3 rounded-l-lg">ID</th>
                   <th class="px-4 py-3">Name</th>
                   <th class="px-4 py-3">Price</th>
                   <th class="px-4 py-3">Duration</th>
                   <th class="px-4 py-3">Deposit %</th>
                   <th class="px-4 py-3">Image</th>
                   <th class="px-4 py-3">Created At</th>
                   <th class="px-4 py-3">Updated At</th>
                   <th class="px-4 py-3 rounded-r-lg">Actions</th>
                 </tr>
               </thead>
               <tbody class="divide-y divide-orange-50">
                 <tr v-for="service in servicesData" :key="service.id" class="hover:bg-orange-50/30 transition-colors text-sm text-amber-900">
                   <td class="px-4 py-4 font-mono text-xs">{{ service.id }}</td>
                   <td class="px-4 py-4 font-medium">{{ service.name }}</td>
                   <td class="px-4 py-4">Rp {{ service.price.toLocaleString() }}</td>
                   <td class="px-4 py-4">{{ service.duration_minutes }} min</td>
                   <td class="px-4 py-4">{{ service.deposit_percentage || 30 }}%</td>
<td class="px-4 py-4">
                      <img v-if="service.image_url || service.image" :src="service.image_url || service.image" alt="Service Image" class="w-12 h-12 object-cover rounded">
                      <span v-else class="text-gray-400">No Image</span>
                    </td>
                   <td class="px-4 py-4 text-gray-600">{{ formatDateTime(service.created_at) }}</td>
                   <td class="px-4 py-4 text-gray-600">{{ formatDateTime(service.updated_at) }}</td>
                   <td class="px-4 py-4 flex gap-3 font-medium">
                     <button class="text-amber-700 hover:underline" @click="editService(service)">Edit</button>
                     <button class="text-red-400 hover:text-red-600" @click="deleteService(service.id)">Hapus</button>
                   </td>
                 </tr>
               </tbody>
           </table>
         </div>
       </div>

       <!-- Memberships Tab -->
       <div v-else-if="activeTab === 'Memberships'" class="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
         <div class="flex justify-between items-start mb-6">
<div>
              <h2 class="text-2xl font-bold text-amber-900">Memberships</h2>
              <p class="text-sm text-amber-700/60">Kelola membership ({{ membershipsData.length }})</p>
            </div>
            <button @click="printTable('memberships')" class="flex items-center gap-2 px-4 py-2 border border-orange-200 text-amber-800 rounded-lg hover:bg-orange-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4.586a1 1 0 00.293.707l1.414 1.414a1 1 0 00.707.293H15a1 1 0 001-1v-1a1 1 0 00-1-1h-2.586a1 1 0 00-.707.293l-1.414 1.414A1 1 0 007 11.414V9a2 2 0 00-2-2V5a2 2 0 012-2h10a2 2 0 012 2z"></path></svg>
              Print
            </button>
            <button @click="showAddMembershipModal = true" class="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 shadow-md">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Tambah
            </button>
          </div>
          <div class="overflow-x-auto">
<table id="memberships-table" class="w-full text-left">
              <thead>
                <tr class="bg-orange-50 text-amber-900 uppercase text-xs font-bold tracking-wider">
                  <th class="px-4 py-3 rounded-l-lg">Member Code</th>
                  <th class="px-4 py-3">Nama</th>
                  <th class="px-4 py-3">Email</th>
                  <th class="px-4 py-3">Level</th>
                  <th class="px-4 py-3">Points</th>
                  <th class="px-4 py-3">Total Spent</th>
                  <th class="px-4 py-3">Join Date</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3 rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-orange-50">
                <tr v-for="membership in membershipsData" :key="membership.id" class="hover:bg-orange-50/30 transition-colors text-sm text-amber-900">
                  <td class="px-4 py-4 font-medium">
                    <span class="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-mono">{{ membership.member_code }}</span>
                  </td>
                  <td class="px-4 py-4 font-medium">{{ getUserName(membership.user_id) }}</td>
                  <td class="px-4 py-4 text-gray-600">{{ getUserEmail(membership.user_id) }}</td>
                  <td class="px-4 py-4">
                    <span :class="getLevelClass(membership.membership_level)" class="px-3 py-1 rounded-full text-xs capitalize">{{ membership.membership_level }}</span>
                  </td>
                  <td class="px-4 py-4 font-semibold">{{ membership.points || 0 }}</td>
                  <td class="px-4 py-4">Rp {{ Number(membership.total_spent || 0).toLocaleString() }}</td>
                  <td class="px-4 py-4 text-gray-600">{{ formatDate(membership.join_date) }}</td>
                  <td class="px-4 py-4">
                    <span :class="membership.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'" class="px-3 py-1 rounded-full text-xs">{{ membership.is_active ? 'Active' : 'Inactive' }}</span>
                  </td>
                  <td class="px-4 py-4 flex gap-3 font-medium">
                    <button class="text-amber-700 hover:underline" @click="editMembership(membership)">Edit</button>
                    <button class="text-red-400 hover:text-red-600" @click="deleteMembership(membership.id)">Hapus</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
       </div>

       <!-- Customer Profiles Tab -->
       <div v-else-if="activeTab === 'Customer'" class="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
         <div class="flex justify-between items-start mb-6">
<div>
              <h2 class="text-2xl font-bold text-amber-900">Customer Profiles</h2>
              <p class="text-sm text-amber-700/60">Data profil pelanggan ({{ customerProfilesData.length }})</p>
            </div>
            <div class="flex gap-2">
              <button @click="printTable('customer-profiles')" class="flex items-center gap-2 px-4 py-2 border border-orange-200 text-amber-800 rounded-lg hover:bg-orange-50">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4.586a1 1 0 00.293.707l1.414 1.414a1 1 0 00.707.293H15a1 1 0 001-1v-1a1 1 0 00-1-1h-2.586a1 1 0 00-.707.293l-1.414 1.414A1 1 0 007 11.414V9a2 2 0 00-2-2V5a2 2 0 012-2h10a2 2 0 012 2z"></path></svg>
                Print
              </button>
              <button @click="addCustomerProfile" class="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 shadow-md">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Tambah
              </button>
            </div>
         </div>
         <div class="overflow-x-auto">
<table id="customer-profiles-table" class="w-full text-left text-sm">
             <thead>
               <tr class="bg-orange-50 text-amber-900 uppercase text-xs font-bold tracking-wider">
                 <th class="px-4 py-3 rounded-l-lg">ID</th>
                 <th class="px-4 py-3">User ID</th>
                 <th class="px-4 py-3">User Name</th>
                 <th class="px-4 py-3">Birth Date</th>
                 <th class="px-4 py-3">Gender</th>
                 <th class="px-4 py-3">Address</th>
                 <th class="px-4 py-3">City</th>
                 <th class="px-4 py-3">Postal Code</th>
                 <th class="px-4 py-3">Emergency Contact</th>
                 <th class="px-4 py-3">Emergency Name</th>
                 <th class="px-4 py-3">Allergies</th>
                 <th class="px-4 py-3">Favorite Staff</th>
                 <th class="px-4 py-3">Created At</th>
                 <th class="px-4 py-3">Updated At</th>
                 <th class="px-4 py-3 rounded-r-lg">Aksi</th>
               </tr>
             </thead>
             <tbody class="divide-y divide-orange-50">
               <tr v-for="profile in customerProfilesData" :key="profile.id" class="hover:bg-orange-50/30 transition-colors text-amber-900">
                 <td class="px-4 py-4 font-mono text-xs">{{ profile.id }}</td>
                 <td class="px-4 py-4 font-mono text-xs">{{ profile.user_id }}</td>
                 <td class="px-4 py-4 font-medium">{{ getUserName(profile.user_id) }}</td>
                 <td class="px-4 py-4">{{ formatDate(profile.birth_date) }}</td>
                 <td class="px-4 py-4">{{ profile.gender || '-' }}</td>
                 <td class="px-4 py-4 truncate max-w-[150px]" :title="profile.address">{{ profile.address || '-' }}</td>
                 <td class="px-4 py-4">{{ profile.city || '-' }}</td>
                 <td class="px-4 py-4">{{ profile.postal_code || '-' }}</td>
                 <td class="px-4 py-4">{{ profile.emergency_contact || '-' }}</td>
                 <td class="px-4 py-4">{{ profile.emergency_name || '-' }}</td>
                 <td class="px-4 py-4 truncate max-w-[100px]" :title="profile.allergies">{{ profile.allergies || '-' }}</td>
                 <td class="px-4 py-4">{{ profile.favorite_staff || '-' }}</td>
                 <td class="px-4 py-4 text-gray-600">{{ formatDateTime(profile.created_at) }}</td>
                 <td class="px-4 py-4 text-gray-600">{{ formatDateTime(profile.updated_at) }}</td>
                  <td class="px-4 py-4 flex gap-3 font-medium">
                     <button class="text-amber-700 hover:text-amber-900 hover:underline" @click="editCustomerProfile(profile)">Edit</button>
                     <button class="text-red-400 hover:text-red-600" @click="deleteCustomerProfile(profile.id)">Hapus</button>
                   </td>
               </tr>
             </tbody>
           </table>
         </div>
       </div>

      <!-- Add/Edit Customer Profile Modal -->
      <div v-if="showAddCustomerModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-orange-100 sticky top-0 bg-white">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold text-amber-900">{{ editingCustomerProfile ? 'Edit Customer Profile' : 'Tambah Customer Profile' }}</h3>
              <button @click="closeCustomerProfileModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">User *</label>
              <select v-model="customerProfileForm.user_id" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option :value="null">Pilih User</option>
                <option v-for="user in usersData" :key="user.id" :value="user.id">{{ user.name }} ({{ user.email }})</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                <input v-model="customerProfileForm.birth_date" type="date" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select v-model="customerProfileForm.gender" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  <option value="">Pilih</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea v-model="customerProfileForm.address" rows="2" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Alamat"></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input v-model="customerProfileForm.city" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Kota">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input v-model="customerProfileForm.postal_code" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Kode Pos">
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <input v-model="customerProfileForm.emergency_contact" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Kontak Darurat">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Emergency Name</label>
                <input v-model="customerProfileForm.emergency_name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Nama Kontak Darurat">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
              <input v-model="customerProfileForm.allergies" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Alergi">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Favorite Staff</label>
              <select v-model="customerProfileForm.favorite_staff" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                <option value="">Pilih Staff</option>
                <option v-for="employee in employeesData" :key="employee.id" :value="employee.name">{{ employee.name }}</option>
              </select>
            </div>
          </div>
          <div class="p-6 border-t border-orange-100 flex gap-3">
            <button @click="closeCustomerProfileModal" class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Batal
            </button>
            <button @click="saveCustomerProfile" class="flex-1 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900">
              {{ editingCustomerProfile ? 'Simpan' : 'Tambah' }}
            </button>
          </div>
        </div>
      </div>


    </main>
    <div class="h-12" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as api from '../services/apiService.js'
import { showSuccess, showError } from '../utils/sweetAlert.js'
import { printTableHTML } from '../utils/printer.js'


import { defineOptions } from 'vue'
defineOptions({
  name: 'AdminView'
})

const router = useRouter()
// toast removed - using browser alerts for now

// State
const activeTab = ref('Users')
const loading = ref(true)
const error = ref(null)

const usersData = ref([])
const ordersData = ref([])
const employeesData = ref([])
const servicesData = ref([])
const membershipsData = ref([])
const progressData = ref([])
const notificationsData = ref([]) // templates
const customerProfilesData = ref([])

const tabs = ['Users', 'Orders', 'Employees', 'Services', 'Memberships', 'Progress', 'Notifications', 'Customer']

// Computed stats from loaded data
const stats = computed(() => ({
  Users: usersData.value.length,
  Orders: ordersData.value.length,
  Services: servicesData.value.length,
  Members: membershipsData.value.length,
}))

// Load all data
const loadData = async () => {
  try {
    loading.value = true
    error.value = null

    const [
      users,
      orders,
      employees,
      services,
      memberships,
      progress,
      templates,
      customerProfiles
    ] = await Promise.all([
      api.fetchUsers(),
      api.fetchOrders(),
      api.fetchEmployees(),
      api.fetchServices(),
      api.fetchMemberships(),
      api.fetchProgress(),
      api.fetchNotificationTemplates(),
      api.fetchCustomerProfiles()
    ])

    usersData.value = users
    ordersData.value = orders
    employeesData.value = employees
    servicesData.value = services
    membershipsData.value = memberships
    progressData.value = progress
    notificationsData.value = templates
    customerProfilesData.value = customerProfiles

    console.log('Data loaded successfully!')
  } catch (err) {
    error.value = err.message || 'Failed to load data. Please check if API server is running.'
    console.error(error.value)
  } finally {
    loading.value = false
  }
}

const syncData = loadData

// Logout
const logout = async () => {
  if (confirm('Yakin logout?')) {
    try {
      await api.logout()
      localStorage.removeItem('authToken')
      router.push('/login')
    } catch (err) {
      console.error('Logout failed')
    }
  }
}

// User management


const editUser = (user) => {
  editingUser.value = user
  userForm.value = {
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    password: '',
    role: user.role || 'customer'
  }
  showAddUserModal.value = true
}

const closeUserModal = () => {
  showAddUserModal.value = false
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer'
  }
}

const saveUser = async () => {
  if (!userForm.value.name || !userForm.value.email) {
    showError('Validasi Error', 'Nama dan Email wajib diisi')
    return
  }

  try {
    if (editingUser.value) {
      // Update existing user
      await api.updateUser(editingUser.value.id, {
        name: userForm.value.name,
        email: userForm.value.email,
        phone: userForm.value.phone,
        role: userForm.value.role
      })
      showSuccess('Berhasil', 'User berhasil diupdate')
    } else {
      // Create new user
      if (!userForm.value.password) {
        showError('Validasi Error', 'Password wajib diisi untuk user baru')
        return
      }
      await api.createUser({
        name: userForm.value.name,
        email: userForm.value.email,
        phone: userForm.value.phone,
        password: userForm.value.password,
        role: userForm.value.role
      })
      showSuccess('Berhasil', 'User berhasil ditambahkan')
    }
    closeUserModal()
    loadData()
  } catch (err) {
    showError('Error', err.message || 'Gagal menyimpan user')
  }
}

const deleteUser = async (id) => {
  if (confirm('Hapus user ini?')) {
    try {
      await api.deleteUser(id)
      showSuccess('Berhasil', 'User berhasil dihapus')
      loadData()
    } catch (err) {
      showError('Delete failed', err.message)
    }
  }
}

// Progress
const addProgress = () => {
  editingProgress.value = null
  progressForm.value = {
    order_id: null,
    staff_id: null,
    staff_name: '',
    service_name: '',
    price: 0,
    status: 'pending',
    notes: ''
  }
  showAddProgressModal.value = true
}

const editProgress = (progress) => {
  editingProgress.value = progress
  progressForm.value = {
    order_id: progress.order_id || null,
    staff_id: progress.staff_id || null,
    staff_name: progress.staff_name || '',
    service_name: progress.service_name || '',
    price: progress.price || 0,
    status: progress.status || 'pending',
    notes: progress.notes || ''
  }
  showAddProgressModal.value = true
}

const closeProgressModal = () => {
  showAddProgressModal.value = false
  editingProgress.value = null
  progressForm.value = {
    order_id: null,
    staff_id: null,
    staff_name: '',
    service_name: '',
    price: 0,
    status: 'pending',
    notes: ''
  }
}

const onOrderChange = () => {
  const order = ordersData.value.find(o => o.id === progressForm.value.order_id)
  if (order) {
    progressForm.value.service_name = order.service?.name || ''
    progressForm.value.price = order.price || 0
    progressForm.value.staff_id = order.employee_id || null
  }
}

const saveProgress = async () => {
  if (!progressForm.value.order_id) {
    showError('Validasi Error', 'Order wajib dipilih')
    return
  }

  try {
    const token = localStorage.getItem('authToken')

    // Get order details for service_name and price if not set
    let serviceName = progressForm.value.service_name
    let price = progressForm.value.price

    if (progressForm.value.order_id && (!serviceName || !price)) {
      const order = ordersData.value.find(o => o.id === progressForm.value.order_id)
      if (order) {
        serviceName = serviceName || order.service?.name || ''
        price = price || order.price || 0
      }
    }

    // Get staff name if staff_id is selected
    let staffName = progressForm.value.staff_name
    if (progressForm.value.staff_id && !staffName) {
      const employee = employeesData.value.find(e => e.id === progressForm.value.staff_id)
      if (employee) {
        staffName = employee.name
      }
    }

    if (editingProgress.value) {
      await api.updateProgress(editingProgress.value.id, {
        staff_id: progressForm.value.staff_id,
        staff_name: staffName,
        service_name: serviceName,
        price: price,
        status: progressForm.value.status,
        notes: progressForm.value.notes
      }, token)
      showSuccess('Berhasil', 'Progress berhasil diupdate')
    } else {
      await api.createProgress({
        order_id: progressForm.value.order_id,
        staff_id: progressForm.value.staff_id,
        staff_name: staffName,
        service_name: serviceName,
        price: price,
        status: progressForm.value.status
      }, token)
      showSuccess('Berhasil', 'Progress berhasil ditambahkan')
    }
    closeProgressModal()
    loadData()
  } catch (err) {
    showError('Error', err.message || 'Gagal menyimpan progress')
  }
}

const deleteProgress = async (id) => {
  if (confirm('Hapus progress?')) {
    try {
      await api.deleteProgress(id)
      showSuccess('Progress deleted')
      loadData()
    } catch (err) {
      showError('Delete failed', err.message)
    }
  }
}

// Templates
const showAddTemplateModal = ref(false)
const editingTemplate = ref(null)
const templateForm = ref({
  name: '',
  type: '',
  channel: 'in_app',
  title: '',
  message: '',
  is_active: true
})
const showAddOrderModal = ref(false)
const showAddEmployeeModal = ref(false)
const editingEmployee = ref(null)
const employeeForm = ref({
  name: '',
  phone: '',
  is_active: true
})
const showAddMembershipModal = ref(false)
const editingMembership = ref(null)
const membershipForm = ref({
  user_id: null,
  member_code: '',
  points: 0,
  membership_level: 'silver',
  total_spent: 0,
  is_active: true
})
const showAddProgressModal = ref(false)
const editingProgress = ref(null)
const progressForm = ref({
  order_id: null,
  staff_id: null,
  staff_name: '',
  service_name: '',
  price: 0,
  status: 'pending',
  notes: ''
})
const showAddCustomerModal = ref(false)
const editingCustomerProfile = ref(null)
const customerProfileForm = ref({
  user_id: null,
  birth_date: '',
  gender: '',
  address: '',
  city: '',
  postal_code: '',
  emergency_contact: '',
  emergency_name: '',
  allergies: '',
  favorite_staff: ''
})
const editingOrder = ref(null)
const orderForm = ref({
  user_name: '',
  user_phone: '',
  order_date: '',
  order_time: '',
  status_id: 1,
  notes: '',
  service_id: null,
  employee_id: null,
  price: 0,
  duration_minutes: 30
})
const showAddServiceModal = ref(false)
const editingService = ref(null)
const serviceForm = ref({
  name: '',
  price: 0,
  duration_minutes: 30,
  deposit_percentage: 30,
  image: ''
})
const serviceImageFile = ref(null)
const showAddUserModal = ref(false)
const editingUser = ref(null)
const userForm = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'customer'
})


const editTemplate = (template) => {
  editingTemplate.value = template
  templateForm.value = {
    name: template.name || '',
    type: template.type || '',
    channel: template.channel || 'in_app',
    title: template.title || '',
    message: template.message || '',
    is_active: template.is_active !== false
  }
  showAddTemplateModal.value = true
}

const closeTemplateModal = () => {
  showAddTemplateModal.value = false
  editingTemplate.value = null
  templateForm.value = {
    name: '',
    type: '',
    channel: 'in_app',
    title: '',
    message: '',
    is_active: true
  }
}

const saveTemplate = async () => {
  if (!templateForm.value.name || !templateForm.value.type || !templateForm.value.message) {
    showError('Validasi Error', 'Nama, Type, dan Message wajib diisi')
    return
  }

  try {
    if (editingTemplate.value) {
      await api.updateNotificationTemplate(editingTemplate.value.id, {
        name: templateForm.value.name,
        type: templateForm.value.type,
        channel: templateForm.value.channel,
        title: templateForm.value.title,
        message: templateForm.value.message,
        is_active: templateForm.value.is_active
      })
      showSuccess('Berhasil', 'Template berhasil diupdate')
    } else {
      await api.createNotificationTemplate({
        name: templateForm.value.name,
        type: templateForm.value.type,
        channel: templateForm.value.channel,
        title: templateForm.value.title,
        message: templateForm.value.message,
        is_active: templateForm.value.is_active
      })
      showSuccess('Berhasil', 'Template berhasil ditambahkan')
    }
    closeTemplateModal()
    loadData()
  } catch (err) {
    showError('Error', err.message || 'Gagal menyimpan template')
  }
}

const deleteTemplate = async (id) => {
  if (confirm('Hapus template ini?')) {
    try {
      await api.deleteNotificationTemplate(id)
      showSuccess('Berhasil', 'Template berhasil dihapus')
      loadData()
    } catch (err) {
      showError('Delete failed', err.message)
    }
  }
}

// Order management
const editOrder = (order) => {
  editingOrder.value = order
  orderForm.value = {
    user_name: order.user_name || '',
    user_phone: order.user_phone || '',
    order_date: order.order_date || '',
    order_time: order.order_time || '',
    status_id: order.status_id || 1,
    notes: order.notes || '',
    service_id: order.service_id || null,
    employee_id: order.employee_id || null,
    price: order.price || 0,
    duration_minutes: order.duration_minutes || 30
  }
  showAddOrderModal.value = true
}

const closeOrderModal = () => {
  showAddOrderModal.value = false
  editingOrder.value = null
  orderForm.value = {
    user_name: '',
    user_phone: '',
    order_date: '',
    order_time: '',
    status_id: 1,
    notes: '',
    service_id: null,
    employee_id: null,
    price: 0,
    duration_minutes: 30
  }
}

const saveOrder = async () => {
  if (!orderForm.value.user_name || !orderForm.value.order_date) {
    showError('Validasi Error', 'Nama customer dan tanggal order wajib diisi')
    return
  }

  try {
    const token = localStorage.getItem('authToken')

    if (editingOrder.value) {
      await api.updateOrder(editingOrder.value.id, {
        user_name: orderForm.value.user_name,
        user_phone: orderForm.value.user_phone,
        order_date: orderForm.value.order_date,
        order_time: orderForm.value.order_time,
        status_id: orderForm.value.status_id,
        notes: orderForm.value.notes,
        service_id: orderForm.value.service_id,
        employee_id: orderForm.value.employee_id,
        price: orderForm.value.price,
        duration_minutes: orderForm.value.duration_minutes
      }, token)
      showSuccess('Berhasil', 'Order berhasil diupdate')
    } else {
      await api.createOrder({
        user_name: orderForm.value.user_name,
        user_phone: orderForm.value.user_phone,
        order_date: orderForm.value.order_date,
        order_time: orderForm.value.order_time,
        status_id: orderForm.value.status_id,
        notes: orderForm.value.notes,
        service_id: orderForm.value.service_id,
        employee_id: orderForm.value.employee_id,
        price: orderForm.value.price,
        duration_minutes: orderForm.value.duration_minutes
      }, token)
      showSuccess('Berhasil', 'Order berhasil ditambahkan')
    }
    closeOrderModal()
    loadData()
  } catch (err) {
    showError('Error', err.message || 'Gagal menyimpan order')
  }
}

const deleteOrder = async (id) => {
  if (confirm('Hapus order ini?')) {
    try {
      await api.deleteOrder(id)
      showSuccess('Order deleted')
      loadData()
    } catch (err) {
      showError('Delete failed', err.message)
    }
  }
}

// Confirm order (change status from Pending to Confirmed)
const confirmOrder = async (id) => {
  if (confirm('Konfirmasi pesanan ini?')) {
    try {
      const token = localStorage.getItem('authToken')
      await api.updateOrderStatus(id, 2, token)
      showSuccess('Pesanan berhasil dikonfirmasi')
      loadData()
    } catch (err) {
      showError('Gagal mengkonfirmasi pesanan', err.message)
    }
  }
}

// Employee management
const editEmployee = (employee) => {
  editingEmployee.value = employee
  employeeForm.value = {
    name: employee.name || '',
    phone: employee.phone || '',
    is_active: employee.is_active !== false
  }
  showAddEmployeeModal.value = true
}

const closeEmployeeModal = () => {
  showAddEmployeeModal.value = false
  editingEmployee.value = null
  employeeForm.value = {
    name: '',
    phone: '',
    is_active: true
  }
}

const saveEmployee = async () => {
  if (!employeeForm.value.name) {
    showError('Validasi Error', 'Nama employee wajib diisi')
    return
  }

  try {
    const token = localStorage.getItem('authToken')

    if (editingEmployee.value) {
      await api.updateEmployee(editingEmployee.value.id, {
        name: employeeForm.value.name,
        phone: employeeForm.value.phone,
        is_active: employeeForm.value.is_active
      }, token)
      showSuccess('Berhasil', 'Employee berhasil diupdate')
    } else {
      await api.createEmployee({
        name: employeeForm.value.name,
        phone: employeeForm.value.phone,
        is_active: employeeForm.value.is_active
      }, token)
      showSuccess('Berhasil', 'Employee berhasil ditambahkan')
    }
    closeEmployeeModal()
    loadData()
  } catch (err) {
    showError('Error', err.message || 'Gagal menyimpan employee')
  }
}

const deleteEmployee = async (id) => {
  if (confirm('Hapus employee ini?')) {
    try {
      await api.deleteEmployee(id)
      showSuccess('Employee deleted')
      loadData()
    } catch (err) {
      showError('Delete failed', err.message)
    }
  }
}

// Service management
const editService = (service) => {
  editingService.value = service
  serviceImageFile.value = null
  serviceForm.value = {
    name: service.name || '',
    price: service.price || 0,
    duration_minutes: service.duration_minutes || 30,
    deposit_percentage: service.deposit_percentage || 30,
    image: service.image_url || service.image || ''
  }
  showAddServiceModal.value = true
}

const closeServiceModal = () => {
  showAddServiceModal.value = false
  editingService.value = null
  serviceForm.value = {
    name: '',
    price: 0,
    duration_minutes: 30,
    deposit_percentage: 30,
    image: ''
  }
  serviceImageFile.value = null
}

const handleServiceImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    serviceImageFile.value = file
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      serviceForm.value.image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const saveService = async () => {
  if (!serviceForm.value.name || !serviceForm.value.price) {
    showError('Validasi Error', 'Nama dan Harga wajib diisi')
    return
  }

  try {
    const token = localStorage.getItem('authToken')
    const formData = new FormData()

    formData.append('name', serviceForm.value.name)
    formData.append('price', serviceForm.value.price)
    formData.append('duration_minutes', serviceForm.value.duration_minutes)
    formData.append('deposit_percentage', serviceForm.value.deposit_percentage)

    // Only append image if a new file is selected
    if (serviceImageFile.value) {
      formData.append('image', serviceImageFile.value)
    }
    // If no new file, don't append image at all - backend will keep existing image

    if (editingService.value) {
      // Update existing service
      await api.updateService(editingService.value.id, formData, token)
      showSuccess('Berhasil', 'Service berhasil diupdate')
    } else {
      // Create new service
      await api.createService(formData, token)
      showSuccess('Berhasil', 'Service berhasil ditambahkan')
    }
    closeServiceModal()
    loadData()
  } catch (err) {
    showError('Error', err.message || 'Gagal menyimpan service')
  }
}

const deleteService = async (id) => {
  if (confirm('Hapus service ini?')) {
    try {
      await api.deleteService(id)
      showSuccess('Service deleted')
      loadData()
    } catch (err) {
      showError('Delete failed', err.message)
    }
  }
}

// Membership management
const editMembership = (membership) => {
  editingMembership.value = membership
  membershipForm.value = {
    user_id: membership.user_id || null,
    member_code: membership.member_code || '',
    points: membership.points || 0,
    membership_level: membership.membership_level || 'silver',
    total_spent: membership.total_spent || 0,
    is_active: membership.is_active !== false
  }
  showAddMembershipModal.value = true
}

const closeMembershipModal = () => {
  showAddMembershipModal.value = false
  editingMembership.value = null
  membershipForm.value = {
    user_id: null,
    member_code: '',
    points: 0,
    membership_level: 'silver',
    total_spent: 0,
    is_active: true
  }
}

const saveMembership = async () => {
  if (!membershipForm.value.user_id && !membershipForm.value.member_code) {
    showError('Validasi Error', 'User atau Member Code wajib diisi')
    return
  }

  try {
    const token = localStorage.getItem('authToken')

    if (editingMembership.value) {
      await api.updateMembership(editingMembership.value.id, {
        user_id: membershipForm.value.user_id,
        member_code: membershipForm.value.member_code,
        points: membershipForm.value.points,
        membership_level: membershipForm.value.membership_level,
        total_spent: membershipForm.value.total_spent,
        is_active: membershipForm.value.is_active
      }, token)
      showSuccess('Berhasil', 'Membership berhasil diupdate')
    } else {
      await api.createMembership({
        user_id: membershipForm.value.user_id,
        member_code: membershipForm.value.member_code,
        points: membershipForm.value.points,
        membership_level: membershipForm.value.membership_level,
        total_spent: membershipForm.value.total_spent,
        is_active: membershipForm.value.is_active
      }, token)
      showSuccess('Berhasil', 'Membership berhasil ditambahkan')
    }
    closeMembershipModal()
    loadData()
  } catch (err) {
    showError('Error', err.message || 'Gagal menyimpan membership')
  }
}

const deleteMembership = async (id) => {
  if (confirm('Hapus membership ini?')) {
    try {
      await api.deleteMembership(id)
      showSuccess('Membership deleted')
      loadData()
    } catch (err) {
      showError('Delete failed', err.message)
    }
  }
}

// Customer Profiles
const addCustomerProfile = () => {
  editingCustomerProfile.value = null
  customerProfileForm.value = {
    user_id: null,
    birth_date: '',
    gender: '',
    address: '',
    city: '',
    postal_code: '',
    emergency_contact: '',
    emergency_name: '',
    allergies: '',
    favorite_staff: ''
  }
  showAddCustomerModal.value = true
}

const editCustomerProfile = (profile) => {
  editingCustomerProfile.value = profile
  customerProfileForm.value = {
    user_id: profile.user_id || null,
    birth_date: profile.birth_date || '',
    gender: profile.gender || '',
    address: profile.address || '',
    city: profile.city || '',
    postal_code: profile.postal_code || '',
    emergency_contact: profile.emergency_contact || '',
    emergency_name: profile.emergency_name || '',
    allergies: profile.allergies || '',
    favorite_staff: profile.favorite_staff || ''
  }
  showAddCustomerModal.value = true
}

const closeCustomerProfileModal = () => {
  showAddCustomerModal.value = false
  editingCustomerProfile.value = null
  customerProfileForm.value = {
    user_id: null,
    birth_date: '',
    gender: '',
    address: '',
    city: '',
    postal_code: '',
    emergency_contact: '',
    emergency_name: '',
    allergies: '',
    favorite_staff: ''
  }
}

const saveCustomerProfile = async () => {
  if (!customerProfileForm.value.user_id) {
    showError('Validasi Error', 'User wajib dipilih')
    return
  }

  try {
    const token = localStorage.getItem('authToken')

    if (editingCustomerProfile.value) {
      await api.updateCustomerProfile(editingCustomerProfile.value.id, {
        user_id: customerProfileForm.value.user_id,
        birth_date: customerProfileForm.value.birth_date,
        gender: customerProfileForm.value.gender,
        address: customerProfileForm.value.address,
        city: customerProfileForm.value.city,
        postal_code: customerProfileForm.value.postal_code,
        emergency_contact: customerProfileForm.value.emergency_contact,
        emergency_name: customerProfileForm.value.emergency_name,
        allergies: customerProfileForm.value.allergies,
        favorite_staff: customerProfileForm.value.favorite_staff
      }, token)
      showSuccess('Berhasil', 'Profil berhasil diupdate')
    } else {
      await api.createCustomerProfile({
        user_id: customerProfileForm.value.user_id,
        birth_date: customerProfileForm.value.birth_date,
        gender: customerProfileForm.value.gender,
        address: customerProfileForm.value.address,
        city: customerProfileForm.value.city,
        postal_code: customerProfileForm.value.postal_code,
        emergency_contact: customerProfileForm.value.emergency_contact,
        emergency_name: customerProfileForm.value.emergency_name,
        allergies: customerProfileForm.value.allergies,
        favorite_staff: customerProfileForm.value.favorite_staff
      }, token)
      showSuccess('Berhasil', 'Profil berhasil ditambahkan')
    }
    closeCustomerProfileModal()
    loadData()
  } catch (err) {
    showError('Error', err.message || 'Gagal menyimpan profil')
  }
}

const deleteCustomerProfile = async (id) => {
  if (confirm('Hapus profil pelanggan ini?')) {
    try {
      await api.deleteCustomerProfile(id)
      showSuccess('Profil pelanggan dihapus')
      loadData()
    } catch (err) {
      showError('Gagal menghapus profil', err.message)
    }
  }
}

// Print specific table using pdfGenerator.js
const printTable = async (type) => {
  // Map type to table ID and title
  const tableConfig = {
    users: { tableId: 'users-table', title: 'Data Users' },
    orders: { tableId: 'orders-table', title: 'Data Orders' },
    employees: { tableId: 'employees-table', title: 'Data Employees' },
    services: { tableId: 'services-table', title: 'Data Services' },
    memberships: { tableId: 'memberships-table', title: 'Data Memberships' },
    progress: { tableId: 'progress-table', title: 'Data Progress' },
    notifications: { tableId: 'notifications-table', title: 'Data Notification Templates' },
    'customer-profiles': { tableId: 'customer-profiles-table', title: 'Data Customer Profiles' }
  }

  const config = tableConfig[type]
  if (!config) {
    showError('Error', 'Unknown table type')
    return
  }

  // Find the table element by ID
  const tableElement = document.getElementById(config.tableId)
  
  if (!tableElement) {
    showError('Error', 'Table element not found')
    return
  }

  // Check if table has data
  const tbody = tableElement.querySelector('tbody')
  if (!tbody || tbody.children.length === 0) {
    showError('Error', 'Tidak ada data untuk dicetak')
    return
  }

// Call printTableHTML to print using browser print
  printTableHTML(tableElement, config.title)
}

// Get status text
const getStatusText = (statusId) => {
  const statusMap = {
    1: 'Pending',
    2: 'Confirmed',
    3: 'Checked In',
    4: 'In Progress',
    5: 'Completed',
    6: 'Cancelled'
  }
  return statusMap[statusId] || 'Unknown'
}

// Get status class
const getStatusClass = (statusId) => {
  const classMap = {
    1: 'bg-yellow-100 text-yellow-800',
    2: 'bg-blue-100 text-blue-800',
    3: 'bg-green-100 text-green-800',
    4: 'bg-purple-100 text-purple-800',
    5: 'bg-gray-100 text-gray-800',
    6: 'bg-red-100 text-red-800'
  }
  return classMap[statusId] || 'bg-gray-100 text-gray-800'
}

// Helper methods for names
const getUserName = (id) => {
  const user = usersData.value.find(u => u.id == id)
  return user ? user.name : 'Unknown'
}

const getUserEmail = (id) => {
  const user = usersData.value.find(u => u.id == id)
  return user ? user.email : '-'
}

const getLevelClass = (level) => {
  const classes = {
    silver: 'bg-slate-200 text-slate-800',
    gold: 'bg-yellow-100 text-yellow-800',
    platinum: 'bg-purple-100 text-purple-800'
  }
  return classes[level?.toLowerCase()] || 'bg-orange-100 text-amber-800'
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatDateTime = (datetime) => {
  if (!datetime) return '-'
  const d = new Date(datetime)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + 
         d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const getProgressStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    checked_in: 'bg-green-100 text-green-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const formatProgressStatus = (status) => {
  const labels = {
    pending: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    checked_in: 'Check In',
    in_progress: 'Sedang Dikerjakan',
    completed: 'Selesai',
    cancelled: 'Dibatalkan'
  }
  return labels[status?.toLowerCase()] || status || 'Unknown'
}

const getChannelClass = (channel) => {
  const classes = {
    whatsapp: 'bg-green-100 text-green-800',
    email: 'bg-blue-100 text-blue-800',
    sms: 'bg-purple-100 text-purple-800',
    in_app: 'bg-gray-100 text-gray-800'
  }
  return classes[channel?.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

// Get remaining payment for an order
const getRemainingPayment = (order) => {
  // If remaining_payment is already provided, use it
  if (order.remaining_payment !== undefined && order.remaining_payment !== null) {
    return Number(order.remaining_payment) || 0
  }
  // Otherwise calculate from total_price - deposit_amount
  const totalPrice = Number(order.total_price || order.price || 0)
  const depositAmount = Number(order.deposit_amount || 0)
  return Math.max(0, totalPrice - depositAmount)
}

// Init
onMounted(loadData)
</script>

<style scoped>
</style>

