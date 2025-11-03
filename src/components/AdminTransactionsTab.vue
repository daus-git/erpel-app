<template>
  <div class="bg-white shadow rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Transactions Management</h3>
          <p class="text-gray-500 text-sm">Manage and track salon transactions</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Period Filter -->
          <select
            v-model="selectedPeriod"
            @change="filterTransactions"
            class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-salon-accent1"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            @click="generatePDF"
            class="bg-salon-accent1 hover:bg-salon-accent2 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
          >
            Print PDF
          </button>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="text-sm font-medium text-blue-800">Total Transactions</h4>
          <p class="text-2xl font-bold text-blue-900">{{ totalTransactions }}</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <h4 class="text-sm font-medium text-green-800">Total Revenue</h4>
          <p class="text-2xl font-bold text-green-900">Rp {{ formatPrice(totalRevenue) }}</p>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <h4 class="text-sm font-medium text-purple-800">Average Transaction</h4>
          <p class="text-2xl font-bold text-purple-900">Rp {{ formatPrice(averageTransaction) }}</p>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto -mx-4 sm:mx-0">
        <table id="transactions-table" class="min-w-full divide-y divide-gray-200">
          <thead class="bg-salon-accent1 text-white">
            <tr>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden sm:table-cell">Customer</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total Amount</th>
              <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment Method</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="transaction in filteredTransactions"
              :key="transaction.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                #TRANSACTION-{{ transaction.id }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                {{ transaction.orderId }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-900 hidden sm:table-cell truncate max-w-[12rem]">
                {{ transaction.customerName }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {{ formatDate(transaction.date) }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-900 font-medium">
                Rp {{ formatPrice(transaction.totalAmount) }}
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500">
                {{ transaction.paymentMethod }}
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="transactions.length === 0">
              <td colspan="6" class="text-center py-6 text-gray-500">
                No transactions found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import transactionsData from '@/data/transactions.json'
import { generatePDF } from '@/utils/pdfGenerator.js'
import { showError, showConfirm } from '@/utils/sweetAlert'

export default {
  name: 'AdminTransactionsTab',
  data() {
    return {
      transactions: transactionsData,
      selectedPeriod: 'all',
      filteredTransactions: transactionsData
    }
  },
  computed: {
    totalTransactions() {
      return this.filteredTransactions.length
    },
    totalRevenue() {
      return this.filteredTransactions.reduce((sum, transaction) => sum + transaction.totalAmount, 0)
    },
    averageTransaction() {
      if (this.filteredTransactions.length === 0) return 0
      return Math.round(this.totalRevenue / this.filteredTransactions.length)
    }
  },
  methods: {
    formatPrice(value) {
      return value.toLocaleString('id-ID')
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    },
    statusBadgeClass(status) {
      const colors = {
        'Completed': 'bg-green-100 text-green-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Failed': 'bg-red-100 text-red-800'
      }
      return colors[status] || 'bg-gray-100 text-gray-800'
    },
    generatePDF() {
      const tableElement = document.getElementById('transactions-table')
      if (tableElement) {
        const statsData = {
          totalTransactions: this.totalTransactions,
          totalRevenue: this.totalRevenue,
          averageTransaction: this.averageTransaction
        }
        generatePDF(tableElement, `Transactions Report - ${this.selectedPeriod.charAt(0).toUpperCase() + this.selectedPeriod.slice(1)}`, '/icons/logo.png', true, statsData)
      } else {
        showError('Tabel Tidak Ditemukan', 'Tabel tidak ditemukan. Silakan coba lagi.')
      }
    },
    filterTransactions() {
      const now = new Date()
      let filtered = this.transactions
      let weekAgo, monthAgo, yearAgo

      switch (this.selectedPeriod) {
        case 'today':
          filtered = this.transactions.filter(t => {
            const transactionDate = new Date(t.date)
            return transactionDate.toDateString() === now.toDateString()
          })
          break
        case 'week':
          weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          filtered = this.transactions.filter(t => new Date(t.date) >= weekAgo)
          break
        case 'month':
          monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
          filtered = this.transactions.filter(t => new Date(t.date) >= monthAgo)
          break
        case 'year':
          yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
          filtered = this.transactions.filter(t => new Date(t.date) >= yearAgo)
          break
        default:
          filtered = this.transactions
      }

      this.filteredTransactions = filtered
    },
    async deleteTransaction(transactionId) {
      const result = await showConfirm('Hapus Transaksi', 'Apakah Anda yakin ingin menghapus transaksi ini?')
      if (result.isConfirmed) {
        this.transactions = this.transactions.filter(transaction => transaction.id !== transactionId)
        this.filterTransactions() // Re-apply filter after deletion
        // In a real app, you would save to backend
      }
    }
  }
}
</script>

<style scoped>
/* Responsiveness tweak for smaller screens */
@media (max-width: 640px) {
  table th, table td {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}
</style>
