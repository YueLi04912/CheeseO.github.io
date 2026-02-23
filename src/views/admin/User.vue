<template>
  <div class="min-h-screen bg-gradient-to-r from-indigo-300 via-purple-400 to-pink-500 p-4 sm:p-6">
    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 py-6 sm:py-8 bg-white rounded-lg shadow-xl">
      <!-- Title and Search -->
      <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 text-shadow-md">User Management</h1>
          <p class="text-gray-600 text-sm sm:text-lg">Manage platform registered users</p>
        </div>
        <div class="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search User ID or Nickname..."
              class="w-full pl-8 sm:pl-10 pr-4 py-2 border border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-gray-100 placeholder-gray-500 text-black transition-all duration-300"
            >
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
          <button 
            @click="showFilter = !showFilter"
            class="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 flex items-center text-sm text-indigo-600 transition-all duration-300"
          >
            <i class="fas fa-filter text-gray-500 mr-2"></i>
            <span>Filter</span>
          </button>
          <button 
            @click="refreshUsers"
            class="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center text-sm transition-all duration-300"
          >
            <i class="fas fa-sync-alt mr-2"></i>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <!-- User Stats Cards -->
      <div class="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm">Total Users</p>
              <p class="text-2xl font-bold">{{ userStats.totalUsers }}</p>
            </div>
            <i class="fas fa-users text-blue-200 text-2xl"></i>
          </div>
        </div>
        <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm">Active Users</p>
              <p class="text-2xl font-bold">{{ userStats.activeUsers }}</p>
            </div>
            <i class="fas fa-user-check text-green-200 text-2xl"></i>
          </div>
        </div>
        <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm">New Today</p>
              <p class="text-2xl font-bold">{{ userStats.newUsersToday }}</p>
            </div>
            <i class="fas fa-user-plus text-purple-200 text-2xl"></i>
          </div>
        </div>
        <div class="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-red-100 text-sm">Banned Users</p>
              <p class="text-2xl font-bold">{{ userStats.bannedUsers }}</p>
            </div>
            <i class="fas fa-user-slash text-red-200 text-2xl"></i>
          </div>
        </div>
      </div>

      <!-- Filter Conditions -->
      <div v-if="showFilter" class="bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Register Type</label>
            <select v-model="filters.registerType" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="">All</option>
              <option value="phone">Phone</option>
              <option value="email">Email</option>
              <option value="wechat">WeChat</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">User Role</label>
            <select v-model="filters.role" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="">All</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select v-model="filters.status" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          <div class="flex items-end gap-2">
            <button 
              @click="resetFilters"
              class="flex-1 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              Reset
            </button>
            <button 
              @click="applyFilters"
              class="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
      
      <!-- User List -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- List Header -->
        <div class="hidden sm:grid grid-cols-12 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 p-3 sm:p-4 border-b border-gray-200 font-medium text-gray-700 text-xs sm:text-sm">
          <div class="col-span-1">User ID</div>
          <div class="col-span-2">User Info</div>
          <div class="col-span-2">Contact</div>
          <div class="col-span-2">Registration</div>
          <div class="col-span-1">Points</div>
          <div class="col-span-2">Status</div>
          <div class="col-span-2">Actions</div>
        </div>
        
        <!-- User Items -->
        <div 
          v-for="user in paginatedUsers" 
          :key="user.id"
          class="block sm:grid sm:grid-cols-12 p-3 sm:p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors text-sm"
          :class="{ 'bg-red-50': user.status === 'banned' }"
        >
          <!-- Mobile Card Layout -->
          <div class="sm:hidden flex flex-col gap-2 p-3 bg-white rounded-lg shadow-sm mb-2">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <i class="fas fa-user text-blue-500"></i>
                </div>
                <div>
                  <span class="font-medium">{{ user.nickname || user.username }}</span>
                  <div class="text-xs text-gray-500">
                    ID:
                    <span class="font-mono" :title="user.id">{{ formatUserId(user.id) }}</span>
                  </div>
                </div>
              </div>
              <span 
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="getRoleClass(user.role)"
              >
                {{ getRoleText(user.role) }}
              </span>
            </div>
            <div class="text-xs text-gray-500 space-y-1">
              <div v-if="user.phone">📱 {{ user.phone }}</div>
              <div v-if="user.email">📧 {{ user.email }}</div>
              <div>📅 {{ formatDate(user.createdAt) }}</div>
              <div>🪙 {{ user.points }} Points</div>
              <div v-if="user.registerType">
                📝 {{ getRegisterTypeText(user.registerType) }} Registered
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span 
                class="px-2 py-1 rounded-full text-xs"
                :class="getStatusClass(user.status)"
              >
                {{ getStatusText(user.status) }}
              </span>
              <div class="flex gap-2">
                <router-link
                  :to="`/admin/user-detail/${user.id}`"
                  class="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-xs"
                >
                  Detail
                </router-link>
                <button
                  @click="toggleBanUser(user)"
                  class="px-3 py-1 rounded-lg text-xs"
                  :class="user.status === 'banned' ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'"
                >
                  {{ user.status === 'banned' ? 'Unban' : 'Ban' }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Desktop Grid Layout -->
          <div class="hidden sm:flex col-span-1 items-center text-gray-600 font-mono text-xs">
            <span :title="user.id">{{ formatUserId(user.id) }}</span>
          </div>
          <div class="hidden sm:flex col-span-2 items-center">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <i class="fas fa-user text-blue-500"></i>
            </div>
            <div>
              <div class="font-medium">{{ user.nickname || user.username }}</div>
              <div class="text-xs text-gray-500">{{ user.realName || 'Not filled' }}</div>
            </div>
          </div>
          <div class="hidden sm:block col-span-2 text-xs">
            <div v-if="user.phone" class="mb-1">📱 {{ user.phone }}</div>
            <div v-if="user.email">📧 {{ user.email }}</div>
            <div v-if="!user.phone && !user.email" class="text-gray-400">No contact info</div>
          </div>
          <div class="hidden sm:block col-span-2 text-xs">
            <div>📅 {{ formatDate(user.createdAt) }}</div>
            <div v-if="user.registerType" class="text-gray-500">
              {{ getRegisterTypeText(user.registerType) }} Registered
            </div>
            <div v-if="user.lastLoginAt" class="text-gray-500">
              Last login: {{ formatDate(user.lastLoginAt) }}
            </div>
          </div>
          <div class="hidden sm:block col-span-1">
            <span class="font-medium">{{ user.points }}</span>
            <span class="text-xs text-gray-500 ml-1">Pts</span>
          </div>
          <div class="hidden sm:block col-span-2">
            <div class="flex flex-col gap-1">
              <span 
                class="px-2 py-1 rounded-full text-xs w-fit"
                :class="getStatusClass(user.status)"
              >
                {{ getStatusText(user.status) }}
              </span>
              <span 
                class="px-2 py-1 rounded-full text-xs w-fit"
                :class="getRoleClass(user.role)"
              >
                {{ getRoleText(user.role) }}
              </span>
            </div>
          </div>
          <div class="hidden sm:flex col-span-2 items-center gap-2">
            <router-link
              :to="`/admin/user-detail/${user.id}`"
              class="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-xs"
            >
              Detail
            </router-link>
            <button
              @click="toggleBanUser(user)"
              :class="[ 'px-3 py-1 rounded-lg text-xs flex items-center', user.status === 'banned' ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200' ]"
            >
              {{ user.status === 'banned' ? 'Unban' : 'Ban' }}
            </button>
          </div>
        </div>
        
        <!-- Pagination -->
        <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
          <div class="text-gray-700">
            Showing <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> to 
            <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredUsers.length) }}</span> of
            <span class="font-medium">{{ filteredUsers.length }}</span> results
          </div>
          <div class="flex gap-2">
            <button
              @click="currentPage = Math.max(currentPage - 1, 1)"
              :disabled="currentPage === 1"
              class="px-3 py-2 border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 text-xs sm:text-sm"
            >
              Previous
            </button>
            <button
              @click="currentPage = Math.min(currentPage + 1, totalPages)"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 text-xs sm:text-sm"
            >
              Next
            </button>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredUsers.length === 0" class="p-6 sm:p-8 text-center text-gray-500">
          <i class="fas fa-user-slash text-2xl sm:text-3xl mb-2"></i>
          <p class="text-sm sm:text-base">No users found</p>
          <button 
            @click="refreshUsers"
            class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Refresh List
          </button>
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
      searchQuery: '',
      showFilter: false,
      filters: {
        registerType: '',
        role: '',
        status: ''
      },
      currentPage: 1,
      pageSize: 10,
      users: [],
      dataManager: SimpleDataManager.getInstance(),
      userStats: {
        totalUsers: 0,
        activeUsers: 0,
        newUsersToday: 0,
        bannedUsers: 0
      }
    }
  },
  computed: {
    filteredUsers() {
      let result = this.users
      const query = this.searchQuery.toLowerCase()
      
      if (query) {
        result = result.filter(user => 
          user.id.toString().includes(query) || 
          (user.nickname && user.nickname.toLowerCase().includes(query)) ||
          (user.username && user.username.toLowerCase().includes(query)) ||
          (user.phone && user.phone.includes(query)) ||
          (user.email && user.email.toLowerCase().includes(query))
        )
      }
      
      if (this.filters.registerType) {
        result = result.filter(user => user.registerType === this.filters.registerType)
      }
      
      if (this.filters.role) {
        result = result.filter(user => user.role === this.filters.role)
      }
      
      if (this.filters.status) {
        result = result.filter(user => user.status === this.filters.status)
      }
      
      return result
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.pageSize)
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredUsers.slice(start, end)
    }
  },
  mounted() {
    this.loadUsers()
  },
  methods: {
    async loadUsers() {
      // Get all users from SimpleDataManager
      try {
        this.users = await this.dataManager.getUsersAsync()
        this.userStats = await this.dataManager.getUserStatsAsync()
        console.log('User list loaded:', this.users.length, 'users')
      } catch (error) {
        console.error('Failed to load user list:', error)
        this.$message ? this.$message.error('Failed to load user list') : alert('Failed to load user list')
      }
    },
    formatUserId(id) {
      if (id === null || id === undefined) return ''
      const str = id.toString()
      if (str.length <= 10) return str
      return str.slice(0, 8) + '…' + str.slice(-4)
    },
    async refreshUsers() {
      await this.loadUsers()
      this.$message ? this.$message.success('User list refreshed') : console.log('User list refreshed')
    },
    formatDate(dateString) {
      if (!dateString) return 'Unknown'
      return new Date(dateString).toLocaleDateString()
    },
    getRegisterTypeText(type) {
      const typeMap = {
        'phone': 'Phone',
        'email': 'Email', 
        'wechat': 'WeChat'
      }
      return typeMap[type] || 'Unknown'
    },
    getRoleText(role) {
      return role === 'admin' ? 'Admin' : 'User'
    },
    getRoleClass(role) {
      return role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
    },
    getStatusText(status) {
      const statusMap = {
        'active': 'Active',
        'banned': 'Banned',
        'inactive': 'Inactive'
      }
      return statusMap[status] || status
    },
    getStatusClass(status) {
      const classMap = {
        'active': 'bg-green-100 text-green-800',
        'banned': 'bg-red-100 text-red-800',
        'inactive': 'bg-gray-100 text-gray-800'
      }
      return classMap[status] || 'bg-gray-100 text-gray-800'
    },
    resetFilters() {
      this.filters = {
        registerType: '',
        role: '',
        status: ''
      }
      this.currentPage = 1
    },
    applyFilters() {
      this.showFilter = false
      this.currentPage = 1
    },
    async toggleBanUser(user) {
      const action = user.status === 'banned' ? 'Unban' : 'Ban'
      const confirmText = user.status === 'banned' 
        ? `Are you sure you want to unban user ${user.nickname || user.username}?`
        : `Are you sure you want to ban user ${user.nickname || user.username}?`
      
      if (confirm(confirmText)) {
        let success = false
        if (user.status === 'banned') {
          success = await this.dataManager.unbanUserAsync(user.id)
        } else {
          const reason = prompt('Please enter ban reason:')
          if (reason) {
            success = await this.dataManager.banUserAsync(user.id, reason)
          } else {
            return
          }
        }
        
        if (success) {
          // Refresh user list
          await this.loadUsers()
          this.$message ? this.$message.success(`User ${action}ned successfully`) : console.log(`User ${action}ned successfully`)
        } else {
          this.$message ? this.$message.error(`${action} failed`) : alert(`${action} failed`)
        }
      }
    }
  }
}
</script>

<style scoped>
.text-shadow-md {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

button:hover:not(:disabled), a:hover {
  transform: translateY(-1px);
}

button:active:not(:disabled), a:active {
  transform: translateY(0);
}

button, a, input, select {
  min-height: 2.5rem;
  min-width: 2.5rem;
}
</style>
