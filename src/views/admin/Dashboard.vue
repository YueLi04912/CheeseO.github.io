<template>
  <div class="min-h-screen bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600">
    <!-- Main Content Area -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold text-white">Admin Dashboard</h1>
        <p class="text-gray-100">Platform Overview and Quick Actions</p>
        <div class="mt-2 flex items-center gap-4">
          <button 
            @click="refreshAllData"
            class="text-sm bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg transition-all duration-200"
            :disabled="isRefreshing"
          >
            <i class="fas fa-sync-alt mr-1" :class="{ 'animate-spin': isRefreshing }"></i>
            {{ isRefreshing ? 'Refreshing...' : 'Refresh Data' }}
          </button>
          <span class="text-white/80 text-sm">
            Last Updated: {{ lastUpdateTime }}
          </span>
        </div>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <!-- Users -->
        <div class="bg-white p-6 rounded-lg shadow-xl border-l-4 border-blue-500 hover:scale-105 transform transition-all duration-300">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Users</p>
              <p class="text-3xl font-bold mt-2 text-blue-600">{{ userStats.totalUsers }}</p>
              <div class="flex mt-2 space-x-4">
                <span class="text-sm text-gray-600">Normal: {{ userStats.normalUsers }}</span>
                <span class="text-sm text-gray-600">Admin: {{ userStats.adminUsers }}</span>
              </div>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <i class="fas fa-users text-blue-500 text-xl"></i>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-4">
            <span class="text-green-500">
              <i class="fas fa-arrow-up mr-1"></i>
              New: {{ userStats.newUsersToday }}
            </span>
            Today
          </p>
        </div>
        
        <!-- Content -->
        <div class="bg-white p-6 rounded-lg shadow-xl border-l-4 border-purple-500 hover:scale-105 transform transition-all duration-300">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Content</p>
              <p class="text-3xl font-bold mt-2 text-purple-600">{{ contentStats.totalArticles }}</p>
              <div class="flex mt-2 space-x-4">
                <span class="text-sm text-gray-600">Published: {{ contentStats.publishedArticles }}</span>
                <span class="text-sm text-gray-600">Pending: {{ contentStats.pendingReviews }}</span>
              </div>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <i class="fas fa-file-alt text-purple-500 text-xl"></i>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-4">
            <span class="text-orange-500">
              <i class="fas fa-clock mr-1"></i>
              Pending: {{ contentStats.pendingReviews }}
            </span>
          </p>
        </div>
        
        <!-- Points Circulation -->
        <div class="bg-white p-6 rounded-lg shadow-xl border-l-4 border-yellow-500 hover:scale-105 transform transition-all duration-300">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Points Circulation</p>
              <p class="text-3xl font-bold mt-2 text-yellow-600">{{ pointsStats.totalPoints.toLocaleString() }}</p>
              <div class="flex flex-wrap mt-2 gap-2">
                <span class="text-sm text-gray-600">Recharge: {{ pointsStats.totalRecharge.toLocaleString() }}</span>
                <span class="text-sm text-gray-600">Spent: {{ pointsStats.totalWithdraw.toLocaleString() }}</span>
              </div>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <i class="fas fa-coins text-yellow-500 text-xl"></i>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-4">
            <span class="text-blue-500">
              <i class="fas fa-crown mr-1"></i>
              Members: {{ pointsStats.activeMembers }}
            </span>
          </p>
        </div>

        <!-- Total Revenue -->
        <div class="bg-white p-6 rounded-lg shadow-xl border-l-4 border-green-500 hover:scale-105 transform transition-all duration-300">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Revenue (Simulated)</p>
              <p class="text-3xl font-bold mt-2 text-green-600">${{ totalRevenue.toLocaleString() }}</p>
              <div class="flex flex-wrap mt-2 gap-2">
                <span class="text-sm text-gray-600">Recharge: ${{ rechargeRevenue.toLocaleString() }}</span>
                <span class="text-sm text-gray-600">Membership: ${{ membershipRevenue.toLocaleString() }}</span>
              </div>
            </div>
            <div class="p-3 bg-green-100 rounded-full">
              <i class="fas fa-dollar-sign text-green-500 text-xl"></i>
            </div>
          </div>
          <p class="text-sm text-gray-500 mt-4">
            <span class="text-green-500">
              <i class="fas fa-arrow-up mr-1"></i>
              Conversion Rate: {{ conversionRate.toFixed(1) }}%
            </span>
          </p>
        </div>
      </div>
      
      <!-- Quick Links -->
      <div class="bg-white p-6 rounded-lg shadow-xl mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-6">Quick Links</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <!-- Content Review -->
          <router-link 
            to="/admin/content"
            class="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors transform hover:scale-105"
          >
            <div class="flex flex-col items-center text-center">
              <div class="p-3 bg-blue-100 rounded-full mb-3 relative">
                <i class="fas fa-check-circle text-blue-500 text-xl"></i>
                <span 
                  v-if="contentStats.pendingReviews > 0"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ contentStats.pendingReviews }}
                </span>
              </div>
              <h3 class="font-medium text-gray-800">Content Review</h3>
              <p class="text-sm text-gray-500 mt-1">Pending: {{ contentStats.pendingReviews }}</p>
            </div>
          </router-link>
          
          <!-- Category Management -->
          <router-link 
            to="/admin/category"
            class="p-4 border border-gray-200 rounded-lg hover:bg-teal-50 hover:border-teal-200 transition-colors transform hover:scale-105"
          >
            <div class="flex flex-col items-center text-center">
              <div class="p-3 bg-teal-100 rounded-full mb-3">
                <i class="fas fa-folder text-teal-500 text-xl"></i>
              </div>
              <h3 class="font-medium text-gray-800">Category Mgmt</h3>
              <p class="text-sm text-gray-500 mt-1">Total: {{ categoryStats.totalCategories }}</p>
            </div>
          </router-link>
          
          <!-- Course Publish -->
          <router-link 
            to="/admin/coursepost"
            class="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors transform hover:scale-105"
          >
            <div class="flex flex-col items-center text-center">
              <div class="p-3 bg-purple-100 rounded-full mb-3">
                <i class="fas fa-chalkboard-teacher text-purple-500 text-xl"></i>
              </div>
              <h3 class="font-medium text-gray-800">Publish Course</h3>
              <p class="text-sm text-gray-500 mt-1">New Course</p>
            </div>
          </router-link>
          
          <!-- User Management -->
          <router-link 
            to="/admin/user"
            class="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors transform hover:scale-105"
          >
            <div class="flex flex-col items-center text-center">
              <div class="p-3 bg-green-100 rounded-full mb-3">
                <i class="fas fa-user-cog text-green-500 text-xl"></i>
              </div>
              <h3 class="font-medium text-gray-800">User Mgmt</h3>
              <p class="text-sm text-gray-500 mt-1">New Today: {{ userStats.newUsersToday }}</p>
            </div>
          </router-link>
          
          <!-- Points Management -->
          <router-link 
            to="/admin/points"
            class="p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition-colors transform hover:scale-105"
          >
            <div class="flex flex-col items-center text-center">
              <div class="p-3 bg-yellow-100 rounded-full mb-3 relative">
                <i class="fas fa-coins text-yellow-500 text-xl"></i>
                <span 
                  v-if="recentTransactionsCount > 0"
                  class="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ recentTransactionsCount }}
                </span>
              </div>
              <h3 class="font-medium text-gray-800">Points Mgmt</h3>
              <p class="text-sm text-gray-500 mt-1">Today's Tx: {{ recentTransactionsCount }}</p>
            </div>
          </router-link>

        </div>
      </div>
      
      <!-- Recent Activities -->
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-gray-800">Recent Activities</h2>
          <span class="text-sm text-gray-500">
            Real-time data, updates every 30s
          </span>
        </div>
        <div class="space-y-4">
          <div 
            v-for="(activity, index) in recentActivities" 
            :key="activity.id || index"
            class="flex items-start pb-4 border-b border-gray-100 last:border-0"
          >
            <div 
              :class="[ 'p-2 rounded-full mr-4', getActivityIcon(activity.type).bg ]"
            >
              <i 
                :class="[ getActivityIcon(activity.type).icon, getActivityIcon(activity.type).text, 'text-lg' ]"
              ></i>
            </div>
            <div class="flex-1">
              <p class="text-gray-800">{{ activity.description }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ formatTime(activity.time) }}</p>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="recentActivities.length === 0" class="text-center py-8">
          <i class="fas fa-clock text-3xl text-gray-300 mb-2"></i>
          <p class="text-gray-500">No recent activities</p>
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
      // Data Manager
      dataManager: SimpleDataManager.getInstance(),
      
      // Refresh Status
      isRefreshing: false,
      lastUpdateTime: '',
      
      // Statistics Data
      userStats: {
        totalUsers: 0,
        normalUsers: 0,
        adminUsers: 0,
        newUsersToday: 0,
        activeUsers: 0,
        bannedUsers: 0
      },
      contentStats: {
        totalArticles: 0,
        publishedArticles: 0,
        pendingReviews: 0,
        draftArticles: 0,
        rejectedArticles: 0
      },
      categoryStats: {
        totalCategories: 0
      },
      pointsStats: {
        totalPoints: 0,
        totalRecharge: 0,
        totalWithdraw: 0,
        totalMembershipSpent: 0,
        activeMembers: 0
      },
      
      // Recent Activities
      recentActivities: [],
      
      // Auto-refresh Timer
      refreshTimer: null
    }
  },
  computed: {
    // Calculate Revenue
    totalRevenue() {
      // Simulated revenue: percentage of recharge
      return Math.floor(this.pointsStats.totalRecharge / 100 * 0.05) // 5% fee
    },
    rechargeRevenue() {
      return Math.floor(this.pointsStats.totalRecharge / 100 * 0.03) // 3% recharge fee
    },
    membershipRevenue() {
      return Math.floor(this.pointsStats.totalMembershipSpent / 100 * 1) // Membership revenue
    },
    conversionRate() {
      // User conversion rate: active members / total users
      if (this.userStats.totalUsers === 0) return 0
      return (this.pointsStats.activeMembers / this.userStats.totalUsers) * 100
    },
    recentTransactionsCount() {
      // Today's transaction count
      const today = new Date().toDateString()
      return this.recentActivities.filter(activity => 
        activity.type === 'points' && 
        new Date(activity.time).toDateString() === today
      ).length
    }
  },
  mounted() {
    this.loadAllData()
    this.startAutoRefresh()
    console.log('Dashboard.vue loaded real data')
  },
  beforeUnmount() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
  },
  methods: {
    // Load all data
    async loadAllData() {
      try {
        // Load user stats
        this.userStats = await this.dataManager.getUserStatsAsync()
        
        // Load content stats
        this.contentStats = await this.dataManager.getContentStatsAsync()
        
        // Load category stats
        this.categoryStats = await this.dataManager.getCategoryStatsAsync()
        
        // Load points stats
        this.pointsStats = await this.dataManager.getPointsStatsAsync()
        
        // Load recent activities
        await this.loadRecentActivities()
        
        // Update time
        this.lastUpdateTime = new Date().toLocaleTimeString('en-US')
        
        console.log('Dashboard Data Updated:', {
          users: this.userStats,
          content: this.contentStats,
          points: this.pointsStats
        })
      } catch (error) {
        console.error('Failed to load Dashboard data:', error)
      }
    },
    
    // Manually refresh all data
    async refreshAllData() {
      this.isRefreshing = true
      try {
        await this.loadAllData()
        
        // Show success message
        this.$message?.success('Data refreshed') || console.log('Data refreshed')
      } catch (error) {
        console.error('Failed to refresh data:', error)
        this.$message?.error('Refresh failed') || console.log('Refresh failed')
      } finally {
        this.isRefreshing = false
      }
    },
    
    // Load recent activities
    async loadRecentActivities() {
      const activities = []
      
      try {
        // Get recent point transactions
        const transactions = await this.dataManager.getPointTransactionsAsync()
        const recentTransactions = transactions
          .filter(t => t.status === 'completed')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
        
        recentTransactions.forEach(transaction => {
          activities.push({
            id: transaction.id,
            type: 'points',
            description: `${transaction.userName} ${this.getTransactionTypeText(transaction.type)} ${Math.abs(transaction.amount)} Points`,
            time: new Date(transaction.createdAt)
          })
        })
        
        // Get recent user registrations
        const users = await this.dataManager.getUsersAsync()
        const recentUsers = users
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
        
        recentUsers.forEach(user => {
          activities.push({
            id: `user_${user.id}`,
            type: 'user',
            description: `New user "${user.nickname || user.username}" registered`,
            time: new Date(user.createdAt)
          })
        })
        
        // Get recent content reviews
        const articles = await this.dataManager.getArticlesAsync()
        const recentArticles = articles
          .filter(a => a.status === 'published')
          .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
          .slice(0, 3)
        
        recentArticles.forEach(article => {
          activities.push({
            id: `article_${article.id}`,
            type: 'content',
            description: `Content "${article.title}" approved`,
            time: new Date(article.publishedAt || article.createdAt)
          })
        })
        
        // Sort by time and limit
        this.recentActivities = activities
          .sort((a, b) => b.time.getTime() - a.time.getTime())
          .slice(0, 10)
      } catch (error) {
        console.error('Failed to load recent activities:', error)
      }
    },
    
    // Get transaction type text
    getTransactionTypeText(type) {
      const typeMap = {
        'recharge': 'recharged',
        'withdraw': 'withdrew',
        'membership': 'spent on membership',
        'reward': 'received reward',
        'penalty': 'was penalized'
      }
      return typeMap[type] || 'transacted'
    },
    
    // Start auto refresh
    startAutoRefresh() {
      // Auto refresh every 30 seconds
      this.refreshTimer = setInterval(() => {
        this.loadAllData()
      }, 30000)
    },
    
    // Get activity icon
    getActivityIcon(type) {
      const icons = {
        user: {
          icon: 'fas fa-user-plus',
          text: 'text-blue-500',
          bg: 'bg-blue-50'
        },
        content: {
          icon: 'fas fa-file-alt',
          text: 'text-purple-500',
          bg: 'bg-purple-50'
        },
        points: {
          icon: 'fas fa-coins',
          text: 'text-green-500',
          bg: 'bg-green-50'
        },
        membership: {
          icon: 'fas fa-crown',
          text: 'text-yellow-500',
          bg: 'bg-yellow-50'
        }
      }
      return icons[type] || icons.user
    },
    
    // Format time
    formatTime(date) {
      const now = new Date()
      const diff = now - date
      
      if (diff < 60 * 1000) {
        return 'Just now'
      } else if (diff < 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 1000))} mins ago`
      } else if (diff < 24 * 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 60 * 1000))} hours ago`
      } else {
        return date.toLocaleDateString()
      }
    },
    
    // Open data config page
    openDataConfig() {
      // Can open a modal or navigate to data config page
      alert('System Config is under development...\n\nWill include:\n- Points Exchange Rate\n- Membership Pricing\n- System Parameters\n- Data Import/Export')
    }
  }
}
</script>

<style scoped>
/* Custom Styles */
.router-link-active {
  border-color: rgb(147, 197, 253);
  background-color: rgb(239, 246, 255);
}

/* Animation Effects */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
