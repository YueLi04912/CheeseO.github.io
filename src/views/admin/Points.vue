<template>
  <div class="min-h-screen bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 p-6">
    <div class="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <!-- Title and Tabs -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-white">Points Management System</h1>
        <div class="mt-4 border-b border-gray-200">
          <nav class="flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[ 
                'py-3 px-1 border-b-2 font-medium text-sm transition-all duration-300',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300'
              ]"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Transaction List -->
      <div v-show="activeTab === 'transactions'" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Filters -->
        <div class="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div class="flex-1 md:flex-none md:w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
            <select
              v-model="filters.type"
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Types</option>
              <option value="recharge">Recharge</option>
              <option value="withdraw">Withdraw</option>
              <option value="membership">Membership</option>
              <option value="reward">Reward</option>
              <option value="penalty">Penalty</option>
            </select>
          </div>
          
          <div class="flex-1 md:flex-none md:w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">User Search</label>
            <div class="relative">
              <input
                v-model="filters.search"
                type="text"
                placeholder="User ID"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
              <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          
          <div class="flex gap-2">
            <button 
              @click="loadRealData"
              class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
            >
              <i class="fas fa-sync-alt mr-1"></i>
              Refresh
            </button>
          </div>
        </div>

        <!-- Transactions Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-teal-300 via-blue-300 to-purple-300">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tx ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="tx in filteredTransactions" :key="tx.id" class="hover:bg-gray-50 transition duration-300">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{{ tx.id.slice(-8) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="font-medium text-gray-900">{{ tx.userName }}</div>
                  <div class="text-gray-500">ID: {{ tx.userId }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getTypeBadgeClass(tx.type)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getTypeText(tx.type) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm" :class="getAmountColor(tx.amount)">
                  {{ getAmountPrefix(tx.amount) }}{{ Math.abs(tx.amount) }} Points
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {{ tx.balance }} Points
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDateTime(tx.time) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusBadgeClass(tx.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusText(tx.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {{ tx.description }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredTransactions.length === 0" class="p-8 text-center">
          <i class="fas fa-exchange-alt text-4xl text-gray-400 mb-3"></i>
          <p class="text-gray-500">No matching transaction records found</p>
        </div>
      </div>

      <!-- Overview -->
      <div v-show="activeTab === 'overview'" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <div class="p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-6">Points System Statistics</h2>
          
          <!-- Stat Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-100 text-sm">Total Points Circulation</p>
                  <p class="text-2xl font-bold">{{ pointsStats.totalPoints.toLocaleString() }}</p>
                </div>
                <i class="fas fa-coins text-3xl text-blue-200"></i>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-100 text-sm">Total Recharge Amount</p>
                  <p class="text-2xl font-bold">$ {{ pointsStats.totalRecharge.toLocaleString() }}</p>
                </div>
                <i class="fas fa-arrow-up text-3xl text-green-200"></i>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-red-100 text-sm">Total Withdraw Amount</p>
                  <p class="text-2xl font-bold">{{ pointsStats.totalWithdraw.toLocaleString() }}</p>
                </div>
                <i class="fas fa-arrow-down text-3xl text-red-200"></i>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-purple-100 text-sm">Active Members</p>
                  <p class="text-2xl font-bold">{{ pointsStats.activeMembers }}</p>
                </div>
                <i class="fas fa-crown text-3xl text-purple-200"></i>
              </div>
            </div>
          </div>
          
          <!-- Recent Transactions Trend -->
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-800 mb-4">Transaction Type Distribution</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="(count, type) in transactionTypeStats" :key="type" class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ count }}</div>
                <div class="text-sm text-gray-600">{{ getTypeText(type) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SimpleDataManager } from '@/utils/simpleDataManager'

export default {
  data() {
    return {
      tabs: [
        { id: 'transactions', label: 'Transactions' },
        { id: 'overview', label: 'Overview' }
      ],
      activeTab: 'transactions',
      
      // Points Filter
      filters: {
        type: 'all',
        search: ''
      },
      
      // Real Data
      transactions: [],
      pointsStats: {
        totalPoints: 0,
        totalRecharge: 0,
        totalWithdraw: 0,
        totalMembershipSpent: 0,
        activeMembers: 0
      },
      transactionTypeStats: {},
      
      // Data Manager
      dataManager: null
    }
  },
  
  computed: {
    // Filtered Transactions
    filteredTransactions() {
      let result = this.transactions
      
      // Filter by type
      if (this.filters.type !== 'all') {
        result = result.filter(tx => tx.type === this.filters.type)
      }
      
      // Search user
      if (this.filters.search) {
        const query = this.filters.search.toLowerCase()
        result = result.filter(tx => 
          tx.userId.toString().includes(query) ||
          tx.userName.toLowerCase().includes(query)
        )
      }
      
      return result.sort((a, b) => new Date(b.time) - new Date(a.time))
    }
  },
  
  mounted() {
    this.dataManager = SimpleDataManager.getInstance()
    this.loadRealData()
    console.log('Points.vue (Admin) loaded')
  },
  
  methods: {
    // Load Real Data
    async loadRealData() {
      try {
        // Get all transactions
        const allTransactions = await this.dataManager.getPointTransactionsAsync()
        const allUsers = await this.dataManager.getUsersAsync()
        
        // Convert for display
        this.transactions = allTransactions.map(transaction => {
          const user = allUsers.find(u => u.id === transaction.userId)
          return {
            id: transaction.id,
            userId: transaction.userId,
            userName: user ? (user.nickname || user.username) : 'Unknown User',
            type: transaction.type,
            amount: transaction.amount,
            balance: transaction.balance,
            time: new Date(transaction.createdAt),
            status: transaction.status,
            description: transaction.description || this.getDefaultDescription(transaction.type)
          }
        })
        
        // Get stats
        this.pointsStats = await this.dataManager.getPointsStatsAsync()
        
        // Calculate type stats
        this.transactionTypeStats = this.transactions.reduce((stats, tx) => {
          stats[tx.type] = (stats[tx.type] || 0) + 1
          return stats
        }, {})
        
        console.log('Points management data loaded:', {
          transactions: this.transactions.length,
          stats: this.pointsStats
        })
      } catch (error) {
        console.error('Failed to load points data:', error)
      }
    },
    
    // Format Date Time
    formatDateTime(date) {
      if (!date) return '-'
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    // Get Default Description
    getDefaultDescription(type) {
      const descriptions = {
        'recharge': 'Points Recharge',
        'withdraw': 'Points Withdrawal',
        'membership': 'Membership Subscription',
        'reward': 'System Reward',
        'penalty': 'Points Deduction'
      }
      return descriptions[type] || 'Points Change'
    },
    
    // Transaction Type Methods
    getTypeText(type) {
      const typeMap = {
        'recharge': 'Recharge',
        'withdraw': 'Withdraw',
        'membership': 'Membership',
        'reward': 'Reward',
        'penalty': 'Deduction'
      }
      return typeMap[type] || type
    },
    
    getTypeBadgeClass(type) {
      const classMap = {
        'recharge': 'bg-green-100 text-green-800',
        'withdraw': 'bg-blue-100 text-blue-800',
        'membership': 'bg-purple-100 text-purple-800',
        'reward': 'bg-yellow-100 text-yellow-800',
        'penalty': 'bg-red-100 text-red-800'
      }
      return classMap[type] || 'bg-gray-100 text-gray-800'
    },
    
    getAmountPrefix(amount) {
      return amount > 0 ? '+' : ''
    },
    
    getAmountColor(amount) {
      return amount > 0 ? 'text-green-600' : 'text-red-600'
    },
    
    getStatusText(status) {
      const statusMap = {
        'completed': 'Completed',
        'pending': 'Processing',
        'failed': 'Failed'
      }
      return statusMap[status] || status
    },
    
    getStatusBadgeClass(status) {
      const classMap = {
        'completed': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'failed': 'bg-red-100 text-red-800'
      }
      return classMap[status] || 'bg-gray-100 text-gray-800'
    }
  }
}
</script>

<style scoped>
/* Add custom styles */
</style>
