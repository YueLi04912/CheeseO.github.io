<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Main content area -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Back button -->
      <button 
        @click="$router.push('/admin/User')"
        class="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <i class="fas fa-arrow-left mr-2"></i>
        Back to User List
      </button>

      <!-- User basic info card -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 bg-blue-600 text-white flex justify-between items-center">
          <h1 class="text-xl font-bold">User Details</h1>
          <div class="flex space-x-2">
            <button
              @click="showBanModal = true"
              :class="[
                'px-4 py-1 rounded-lg text-sm font-medium',
                user.isBanned 
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
              ]"
            >
              {{ user.isBanned ? 'Unban User' : 'Ban User' }}
            </button>
            <button
              @click="showPointsModal = true"
              class="px-4 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 text-sm font-medium"
            >
              Adjust Points
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <div class="flex flex-col md:flex-row">
            <!-- User avatar -->
            <div class="md:mr-6 mb-4 md:mb-0">
              <div class="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                <i class="fas fa-user text-blue-500 text-3xl"></i>
              </div>
            </div>
            
            <!-- Basic info -->
            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">Nickname</p>
                <p class="font-medium">{{ user.nickname }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">User ID</p>
                <p class="font-mono">{{ user.id }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Phone</p>
                <p class="font-medium">{{ user.phone || 'Not Bound' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Email</p>
                <p class="font-medium">{{ user.email || 'Not Bound' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Register Time</p>
                <p class="font-medium">{{ formatDate(user.registerTime) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Last Login</p>
                <p class="font-medium">{{ formatDateTime(user.lastLogin) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Verification Status</p>
                <span 
                  class="px-2 py-1 rounded-full text-xs"
                  :class="user.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ user.isVerified ? 'Verified' : 'Unverified' }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-500">Membership Status</p>
                <span 
                  class="px-2 py-1 rounded-full text-xs"
                  :class="user.memberLevel === 'vip' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ user.memberLevel === 'vip' ? 'VIP Member' : 'Normal User' }}
                </span>
                <span v-if="user.memberLevel === 'vip'" class="text-xs text-gray-500 ml-1">
                  Expire: {{ formatDate(user.memberExpire) }}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-500">Current Points</p>
                <p class="font-medium">{{ user.points }} Points</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Account Status</p>
                <span 
                  class="px-2 py-1 rounded-full text-xs"
                  :class="user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                >
                  {{ user.isBanned ? 'Banned' : 'Normal' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="activeTab = tab.name"
            :class="[
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.name
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Points Records -->
      <div v-show="activeTab === 'points'" class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 bg-gray-100 border-b border-gray-200">
          <h2 class="font-semibold text-gray-800">Points Records</h2>
        </div>
        
        <div class="divide-y divide-gray-200">
          <div 
            v-for="(record, index) in pointsRecords" 
            :key="index"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex justify-between">
              <div>
                <p class="font-medium">{{ getPointsTypeText(record.type) }}</p>
                <p class="text-sm text-gray-500">{{ formatDateTime(record.time) }}</p>
                <p v-if="record.remark" class="text-sm text-gray-500 mt-1">{{ record.remark }}</p>
              </div>
              <div class="text-right">
                <p :class="getPointsAmountColor(record.type)">
                  {{ getPointsAmountPrefix(record.type) }}{{ record.amount }} Points
                </p>
                <p class="text-sm text-gray-500">Balance: {{ record.balance }} Points</p>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="pointsRecords.length === 0" class="px-6 py-8 text-center text-gray-500">
            <i class="fas fa-coins text-3xl mb-2"></i>
            <p>No points records found</p>
          </div>
        </div>
      </div>

      <!-- Content Records -->
      <div v-show="activeTab === 'contents'" class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 bg-gray-100 border-b border-gray-200">
          <h2 class="font-semibold text-gray-800">Content Records</h2>
        </div>
        
        <div class="divide-y divide-gray-200">
          <div 
            v-for="(content, index) in userContents" 
            :key="index"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-start">
              <div class="mr-4">
                <i 
                  :class="[
                    content.type === 'blog' ? 'fas fa-file-alt text-blue-500' : 'fas fa-video text-purple-500',
                    'text-xl'
                  ]"
                ></i>
              </div>
              <div class="flex-1">
                <h3 class="font-medium">{{ content.title }}</h3>
                <p class="text-sm text-gray-500 mb-1">{{ formatDateTime(content.publishTime) }}</p>
                <p class="text-sm text-gray-500">
                  Status: 
                  <span :class="getStatusColor(content.status)">
                    {{ getStatusText(content.status) }}
                  </span>
                </p>
              </div>
              <div class="ml-4 flex flex-col space-y-2 items-end">
                <router-link 
                  :to="`/content/${content.id}`"
                  class="text-sm text-blue-600 hover:text-blue-800"
                >
                  View Details
                </router-link>
                <button
                  @click="confirmDeleteContent(content)"
                  class="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="userContents.length === 0" class="px-6 py-8 text-center text-gray-500">
            <i class="fas fa-file-alt text-3xl mb-2"></i>
            <p>No content records found</p>
          </div>
        </div>
      </div>

      <!-- Task Records -->
      <div v-show="activeTab === 'tasks'" class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 bg-gray-100 border-b border-gray-200">
          <h2 class="font-semibold text-gray-800">Task Records</h2>
        </div>
        
        <div class="divide-y divide-gray-200">
          <div 
            v-for="(task, index) in userTasks" 
            :key="index"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-start">
              <div class="mr-4">
                <i class="fas fa-tasks text-green-500 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-medium">{{ task.title }}</h3>
                <p class="text-sm text-gray-500 mb-1">{{ formatDateTime(task.acceptTime) }}</p>
                <div class="flex flex-wrap gap-4 mt-2">
                  <p class="text-sm text-gray-500">
                    Budget: <span class="font-medium">¥{{ task.budget }}</span>
                  </p>
                  <p class="text-sm text-gray-500">
                    Status: 
                    <span :class="getTaskStatusColor(task.status)">
                      {{ getTaskStatusText(task.status) }}
                    </span>
                  </p>
                  <p class="text-sm text-gray-500">
                    Deadline: {{ formatDate(task.deadline) }}
                  </p>
                </div>
              </div>
              <div class="ml-4">
                <router-link 
                  :to="`/task/${task.id}`"
                  class="text-sm text-blue-600 hover:text-blue-800"
                >
                  View Details
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-if="userTasks.length === 0" class="px-6 py-8 text-center text-gray-500">
            <i class="fas fa-tasks text-3xl mb-2"></i>
            <p>No task records found</p>
          </div>
        </div>
      </div>

      <!-- Course Records -->
      <div v-show="activeTab === 'courses'" class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div class="px-6 py-4 bg-gray-100 border-b border-gray-200">
          <h2 class="font-semibold text-gray-800">Course Records</h2>
        </div>
        
        <div class="divide-y divide-gray-200">
          <div 
            v-for="(course, index) in userCourses" 
            :key="index"
            class="px-6 py-4 hover:bg-gray-50"
          >
            <div class="flex items-start">
              <div class="mr-4">
                <i class="fas fa-graduation-cap text-indigo-500 text-xl"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-medium">{{ course.title }}</h3>
                <p class="text-sm text-gray-500 mb-1">Purchase Time: {{ formatDateTime(course.purchaseTime) }}</p>
                <div class="flex flex-wrap gap-4 mt-2">
                  <p class="text-sm text-gray-500">
                    Price: <span class="font-medium">¥{{ course.price }}</span>
                  </p>
                  <p class="text-sm text-gray-500">
                    Status: 
                    <span :class="course.isCompleted ? 'text-green-500' : 'text-blue-500'">
                      {{ course.isCompleted ? 'Completed' : 'Learning' }}
                    </span>
                  </p>
                  <p v-if="course.progress" class="text-sm text-gray-500">
                    Progress: {{ course.progress }}%
                  </p>
                </div>
              </div>
              <div class="ml-4">
                <router-link 
                  :to="`/course/${course.id}`"
                  class="text-sm text-blue-600 hover:text-blue-800"
                >
                  View Course
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-if="userCourses.length === 0" class="px-6 py-8 text-center text-gray-500">
            <i class="fas fa-graduation-cap text-3xl mb-2"></i>
            <p>No course records found</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Ban User Modal -->
    <div v-if="showBanModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">
            {{ user.isBanned ? 'Unban User' : 'Ban User' }}
          </h3>
        </div>
        
        <div class="px-6 py-4">
          <div class="mb-4">
            <p class="text-sm text-gray-600">
              User: <span class="font-medium">{{ user.nickname }}</span>
            </p>
            <p class="text-sm text-gray-600">
              ID: <span class="font-mono">{{ user.id }}</span>
            </p>
          </div>
          <div v-if="!user.isBanned" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Reason for Ban</label>
            <textarea
              v-model="banReason"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter reason for ban..."
              required
            ></textarea>
          </div>
          <div v-else class="mb-4">
            <p class="text-sm text-gray-600">
              Ban Time: {{ formatDateTime(user.banTime) }}
            </p>
            <p v-if="user.banReason" class="text-sm text-gray-600">
              Ban Reason: {{ user.banReason }}
            </p>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            @click="showBanModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="confirmBanUser"
            :class="[
              'px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white',
              user.isBanned ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            ]"
          >
            {{ user.isBanned ? 'Confirm Unban' : 'Confirm Ban' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Adjust Points Modal -->
    <div v-if="showPointsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Adjust Points</h3>
        </div>
        
        <div class="px-6 py-4">
          <div class="mb-4">
            <p class="text-sm text-gray-600">
              User: <span class="font-medium">{{ user.nickname }}</span>
            </p>
            <p class="text-sm text-gray-600">
              Current Points: <span class="font-medium">{{ user.points }}</span>
            </p>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
            <select
              v-model="pointsAction"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="add">Add Points</option>
              <option value="subtract">Deduct Points</option>
              <option value="reset">Reset Points</option>
            </select>
          </div>
          <div v-if="pointsAction !== 'reset'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Points Amount</label>
            <input
              v-model.number="pointsAmount"
              type="number"
              min="1"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter points amount"
            >
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              v-model="pointsReason"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter reason..."
              required
            ></textarea>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            @click="showPointsModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="confirmPointsAdjustment"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Confirm Adjustment
          </button>
        </div>
      </div>
    </div>
    <!-- Delete Content Modal -->
    <div v-if="showDeleteContentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Delete Content</h3>
      </div>
      <div class="px-6 py-4">
        <p class="text-sm text-gray-700 mb-2">
          Are you sure you want to delete this content?
        </p>
        <p class="text-sm font-semibold text-gray-900">
          {{ deletingContent?.title }}
        </p>
      </div>
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button
          @click="showDeleteContentModal = false; deletingContent = null"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          :disabled="isDeletingContent"
        >
          Cancel
        </button>
        <button
          @click="handleDeleteContent"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
          :disabled="isDeletingContent"
        >
          Confirm Delete
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
      dataManager: SimpleDataManager.getInstance(),
      activeTab: 'points',
      loading: false,
      tabs: [
        { name: 'points', label: 'Points Records' },
        { name: 'contents', label: 'Content Records' },
        // { name: 'tasks', label: 'Task Records' },
        { name: 'courses', label: 'Course Records' }
      ],
      showBanModal: false,
      showPointsModal: false,
      banReason: '',
      pointsAction: 'add',
      pointsAmount: 0,
      pointsReason: '',
      user: {
        id: '',
        nickname: 'Loading...',
        phone: '',
        email: '',
        registerTime: null,
        lastLogin: null,
        points: 0,
        isVerified: false,
        isBanned: false,
        banTime: null,
        banReason: null,
        memberLevel: 'normal',
        memberExpire: null
      },
      pointsRecords: [],
      userContents: [],
      userTasks: [],
      userCourses: [],
      showDeleteContentModal: false,
      deletingContent: null,
      isDeletingContent: false
    }
  },
  async mounted() {
    const userId = this.$route.params.id
    if (userId) {
      await this.loadUser(userId)
      this.loadPointsRecords(userId)
      this.loadUserContents(userId)
    } else {
      this.$message.error('No user ID specified')
      this.$router.push('/admin/User')
    }
  },
  methods: {
    async loadUser(userId) {
      this.loading = true
      try {
        const user = await this.dataManager.getUserByIdAsync(userId)
        if (user) {
          this.user = {
            ...user,
            registerTime: user.createdAt ? new Date(user.createdAt) : null,
            lastLogin: user.lastLoginAt ? new Date(user.lastLoginAt) : null,
            isBanned: user.status === 'banned',
            banTime: user.banTime ? new Date(user.banTime) : null,
            banReason: user.banReason || null,
            memberLevel: (user.membershipType === 'monthly' || user.membershipType === 'yearly') ? 'vip' : 'normal',
            memberExpire: user.membershipEndDate ? new Date(user.membershipEndDate) : null
          }
        } else {
          this.$message.error('User not found')
        }
      } catch (error) {
        console.error('Failed to load user details:', error)
        this.$message.error('Failed to load user details')
      } finally {
        this.loading = false
      }
    },
    confirmDeleteContent(content) {
      this.deletingContent = content
      this.showDeleteContentModal = true
    },
    async handleDeleteContent() {
      if (!this.deletingContent) return
      this.isDeletingContent = true
      try {
        const ok = await this.dataManager.deleteArticleAsync(this.deletingContent.id)
        if (ok) {
          this.userContents = this.userContents.filter(c => c.id !== this.deletingContent.id)
          this.$message.success('Content deleted successfully')
        } else {
          this.$message.error('Failed to delete content')
        }
      } catch (error) {
        console.error('Failed to delete content:', error)
        this.$message.error('Failed to delete content')
      } finally {
        this.isDeletingContent = false
        this.showDeleteContentModal = false
        this.deletingContent = null
      }
    },
    async loadPointsRecords(userId) {
      try {
        const records = await this.dataManager.getUserPointTransactionsAsync(userId)
        this.pointsRecords = records.map(r => ({
          type: r.type,
          amount: Math.abs(r.amount),
          balance: r.balance,
          time: new Date(r.createdAt),
          remark: r.description
        }))
      } catch (error) {
        console.error('Failed to load points records:', error)
      }
    },
    async loadUserContents(userId) {
      try {
        const userArticles = await this.dataManager.getArticlesByAuthorAsync(userId)
        
        this.userContents = userArticles.map(a => ({
          id: a.id,
          type: a.isVideo ? 'video' : 'blog',
          title: a.title,
          publishTime: a.publishedAt ? new Date(a.publishedAt) : new Date(a.createdAt),
          status: a.status
        }))
      } catch (error) {
        console.error('Failed to load content records:', error)
      }
    },
    formatDate(date) {
      if (!date) return '-'
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    },
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
    getStatusText(status) {
      const statusMap = {
        'published': 'Published',
        'reviewing': 'Reviewing',
        'rejected': 'Rejected',
        'draft': 'Draft',
        'pending': 'Pending'
      }
      return statusMap[status] || status
    },
    getStatusColor(status) {
      const colorMap = {
        'published': 'text-green-500',
        'reviewing': 'text-blue-500',
        'pending': 'text-blue-500',
        'rejected': 'text-red-500',
        'draft': 'text-gray-500'
      }
      return colorMap[status] || 'text-gray-500'
    },
    getTaskStatusText(status) {
      const statusMap = {
        'completed': 'Completed',
        'in_progress': 'In Progress',
        'cancelled': 'Cancelled',
        'pending': 'Pending'
      }
      return statusMap[status] || status
    },
    getTaskStatusColor(status) {
      const colorMap = {
        'completed': 'text-green-500',
        'in_progress': 'text-blue-500',
        'cancelled': 'text-red-500',
        'pending': 'text-yellow-500'
      }
      return colorMap[status] || 'text-gray-500'
    },
    getPointsTypeText(type) {
      const typeMap = {
        'recharge': 'Recharge',
        'consume': 'Consume',
        'withdraw': 'Withdraw',
        'reward': 'Reward',
        'penalty': 'Penalty',
        'purchase': 'Purchase',
        'tip': 'Tip',
        'adjust': 'Adjustment',
        'membership': 'Membership'
      }
      return typeMap[type] || type
    },
    getPointsAmountColor(type) {
      const positiveTypes = ['recharge', 'reward', 'tip']
      const negativeTypes = ['consume', 'withdraw', 'penalty', 'purchase', 'membership']
      
      if (positiveTypes.includes(type)) return 'text-green-500'
      if (negativeTypes.includes(type)) return 'text-red-500'
      return 'text-blue-500' // adjust or others
    },
    getPointsAmountPrefix(type) {
      const positiveTypes = ['recharge', 'reward', 'tip']
      const negativeTypes = ['consume', 'withdraw', 'penalty', 'purchase', 'membership']
      
      if (positiveTypes.includes(type)) return '+'
      if (negativeTypes.includes(type)) return '-'
      return ''
    },
    async confirmBanUser() {
      if (!this.user.isBanned && !this.banReason) {
        this.$message.error('Please enter reason for ban')
        return
      }
      
      try {
        let success = false
        if (this.user.isBanned) {
          // Unban
          success = await this.dataManager.unbanUserAsync(this.user.id)
        } else {
          // Ban
          success = await this.dataManager.banUserAsync(this.user.id, this.banReason)
        }
        
        if (success) {
          this.$message.success(`User has been ${this.user.isBanned ? 'unbanned' : 'banned'}`)
          this.showBanModal = false
          this.banReason = ''
          // Reload user info
          await this.loadUser(this.user.id)
        } else {
          this.$message.error('Operation failed')
        }
      } catch (error) {
        console.error('Ban operation error:', error)
        this.$message.error('An error occurred')
      }
    },
    async confirmPointsAdjustment() {
      if (!this.pointsReason) {
        this.$message.error('Please enter reason')
        return
      }
      
      if (this.pointsAction !== 'reset' && (!this.pointsAmount || this.pointsAmount <= 0)) {
        this.$message.error('Please enter valid points amount')
        return
      }
      
      try {
        let amount = 0
        if (this.pointsAction === 'reset') {
          // Reset logic: deduct current points to reach 0
          amount = -this.user.points
        } else if (this.pointsAction === 'add') {
          amount = this.pointsAmount
        } else {
          amount = -this.pointsAmount
        }
        
        // Check points cannot be negative
        if (this.user.points + amount < 0) {
          this.$message.error('Points cannot be negative')
          return
        }
        
        const result = await this.dataManager.adminAdjustUserPointsAsync(
          this.user.id,
          amount,
          this.pointsReason
        )
        
        if (result) {
          this.$message.success('Points adjusted successfully')
          this.showPointsModal = false
          this.pointsAction = 'add'
          this.pointsAmount = 0
          this.pointsReason = ''
          
          // Refresh data
          await this.loadUser(this.user.id)
          this.loadPointsRecords(this.user.id)
        } else {
          this.$message.error('Points adjustment failed')
        }
      } catch (error) {
        console.error('Points adjustment error:', error)
        this.$message.error('An error occurred: ' + error.message)
      }
    }
  }
}
</script>

<style scoped>
/* Custom styles */
</style>
