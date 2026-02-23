<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100">
    <!-- Decorative Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-72 h-72 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-lg opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-lg opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-lg opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Main Content -->
    <div class="relative max-w-6xl mx-auto px-4 sm:px-8 py-8">
      <!-- Title and Filter -->
      <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent mb-1 font-poppins">
            🔍 Content Review
          </h1>
          <p class="text-gray-600 text-sm sm:text-base flex items-center font-poppins">
            <i class="fas fa-scroll mr-2 text-purple-500"></i>
            Manage user submitted content
          </p>
        </div>
        
        <!-- Filter Button Group -->
        <div class="mt-4 sm:mt-0 w-full sm:w-auto grid grid-cols-3 sm:flex sm:flex-row gap-2 animate-fade-in-up animation-delay-300">
          <button
            @click="refreshContent"
            class="px-3 sm:px-4 py-2 rounded-xl border bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-600 hover:bg-green-200 flex items-center justify-center text-sm sm:text-base font-semibold shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
            :disabled="isLoading"
          >
            <i class="fas fa-sync-alt mr-2" :class="{ 'animate-spin': isLoading }"></i> 
            {{ isLoading ? 'Loading...' : 'Refresh' }}
          </button>
          <button
            @click="viewPublishedContent"
            class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 text-sm"
          >
            <i class="fas fa-eye mr-2"></i>View Published
          </button>
          <button
            @click="filter = 'all'"
            :class="[
              'px-3 sm:px-4 py-2 rounded-xl border flex items-center justify-center text-sm font-semibold transition-all duration-200 transform hover:scale-105',
              filter === 'all' 
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300 text-blue-600 shadow-md'
                : 'bg-white/80 border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'
            ]"
          >
            🌟 All ({{ totalPendingCount }})
          </button>
          <button
            @click="filter = 'blog'"
            :class="[
              'px-3 sm:px-4 py-2 rounded-xl border flex items-center justify-center text-sm font-semibold transition-all duration-200 transform hover:scale-105',
              filter === 'blog' 
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300 text-blue-600 shadow-md'
                : 'bg-white/80 border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'
            ]"
          >
            📄 Blog ({{ blogCount }})
          </button>
          <button
            @click="filter = 'video'"
            :class="[
              'px-3 sm:px-4 py-2 rounded-xl border flex items-center justify-center text-sm font-semibold transition-all duration-200 transform hover:scale-105',
              filter === 'video' 
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300 text-blue-600 shadow-md'
                : 'bg-white/80 border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'
            ]"
          >
            🎥 Video ({{ videoCount }})
          </button>
        </div>
      </div>
      
      <!-- Pending List -->
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden animate-fade-in-up animation-delay-600">
        <!-- List Header -->
        <div class="hidden sm:grid grid-cols-12 bg-gradient-to-r from-gray-50 to-gray-100 p-3 sm:p-4 border-b border-gray-200/50 font-poppins text-sm text-gray-700">
          <div class="col-span-4">Title</div>
          <div class="col-span-2">Author</div>
          <div class="col-span-2">Category</div>
          <div class="col-span-2">Time</div>
          <div class="col-span-2 text-center">Actions</div>
        </div>
        
        <!-- Content Item -->
        <div 
          v-for="(item, index) in filteredContents" 
          :key="item.id"
          class="block sm:grid grid-cols-12 p-3 sm:p-4 border-b border-gray-200/30 hover:bg-gray-50 transition-all duration-300 animate-fade-in-up"
          :style="{ animationDelay: `${(index + 3) * 100}ms` }"
        >
          <!-- Mobile Card Layout -->
          <div class="sm:hidden flex flex-col gap-3 p-4 bg-white rounded-lg shadow-sm mb-4">
            <div class="flex items-start gap-3">
              <div class="p-2 rounded-lg shadow-sm" :class="item.type === 'blog' ? 'bg-blue-100' : 'bg-purple-100'">
                <i :class="item.type === 'blog' ? 'fas fa-file-alt text-blue-500' : 'fas fa-video text-purple-500'"></i>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-gray-800 text-base truncate">{{ item.title }}</h3>
                  <span v-if="item.categoryName" class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                    {{ item.categoryName }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 line-clamp-2">{{ item.preview }}</p>
                <div class="mt-2 flex flex-wrap gap-1">
                  <span 
                    v-for="tag in (item.tags || []).slice(0, 3)" 
                    :key="tag"
                    class="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex justify-between text-xs text-gray-500">
              <span>👤 {{ item.author }}</span>
              <span>⏰ {{ formatTime(item.submitTime) }}</span>
            </div>
            <div class="flex gap-2 mt-3">
              <button
                @click="showContentDetail(item)"
                class="flex-1 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                <i class="fas fa-eye mr-1"></i> Preview
              </button>
              <button
                @click="approveContent(item.id)"
                class="flex-1 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-200 transition-all duration-200"
                :disabled="processingItems.includes(item.id)"
              >
                <i class="fas fa-check mr-1"></i> Approve
              </button>
              <button
                @click="showRejectDialog(item.id)"
                class="flex-1 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold hover:bg-red-200 transition-all duration-200"
                :disabled="processingItems.includes(item.id)"
              >
                <i class="fas fa-times mr-1"></i> Reject
              </button>
            </div>
          </div>
          
          <!-- Desktop Grid Layout -->
          <div class="hidden sm:flex col-span-4 items-center">
            <div class="mr-2 p-2 rounded-lg shadow-sm" :class="item.type === 'blog' ? 'bg-blue-100' : 'bg-purple-100'">
              <i :class="item.type === 'blog' ? 'fas fa-file-alt text-blue-500' : 'fas fa-video text-purple-500'"></i>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-bold text-gray-800 text-sm truncate">{{ item.title }}</h3>
                <span v-if="item.accessType === 'paid'" class="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                  {{ item.price }} Points
                </span>
              </div>
              <p class="text-sm text-gray-600 line-clamp-2">{{ item.preview }}</p>
              <div class="mt-1 flex flex-wrap gap-1">
                <span 
                  v-for="tag in (item.tags || []).slice(0, 3)" 
                  :key="tag"
                  class="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          <div class="hidden sm:flex col-span-2 items-center text-sm font-semibold text-gray-600">
            <i class="fas fa-user mr-2 text-purple-500"></i>{{ item.author }}
          </div>
          <div class="hidden sm:flex col-span-2 items-center text-sm text-gray-600">
            <div>
              <div class="flex items-center">
                <i class="fas fa-folder mr-1 text-gray-500"></i>
                {{ item.categoryName || 'Uncategorized' }}
              </div>
              <div class="flex items-center mt-1">
                <i class="fas fa-clock mr-1 text-gray-500"></i>
                {{ formatTime(item.submitTime) }}
              </div>
            </div>
          </div>
          <div class="hidden sm:flex col-span-2 items-center justify-center gap-2">
            <button
              @click="showContentDetail(item)"
              class="px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 hover:from-gray-200 hover:to-gray-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <i class="fas fa-eye mr-1"></i> Preview
            </button>
            <button
              @click="approveContent(item.id)"
              class="px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-600 hover:from-green-200 hover:to-emerald-200 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
              :disabled="processingItems.includes(item.id)"
            >
              <i class="fas fa-check mr-1"></i> Approve
            </button>
            <button
              @click="showRejectDialog(item.id)"
              class="px-3 py-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 hover:from-red-200 hover:to-pink-200 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
              :disabled="processingItems.includes(item.id)"
            >
              <i class="fas fa-times mr-1"></i> Reject
            </button>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="filteredContents.length === 0" class="p-6 sm:p-8 text-center">
          <div class="animate-bounce mb-2">
            <i class="fas fa-inbox text-4xl sm:text-6xl text-gray-300"></i>
          </div>
          <p class="text-gray-500 text-base sm:text-lg mb-1 font-poppins">No pending content ✨</p>
          <p class="text-gray-400 text-sm font-poppins">All content has been processed!</p>
        </div>
      </div>
    </div>
    
    <!-- Content Preview Modal -->
    <div 
      v-if="showDetailModal && currentContent"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform animate-scale-in border border-white/20">
        <div class="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
          <div class="flex justify-between items-center">
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 flex items-center font-poppins">
              <i :class="currentContent.type === 'blog' ? 'fas fa-file-alt' : 'fas fa-video'" class="mr-2 text-blue-500"></i>
              Content Preview
            </h3>
            <button @click="closeDetailModal" class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>
        
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <!-- Content Basic Info -->
          <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ currentContent.title }}</h1>
            <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <span><i class="fas fa-user mr-1"></i>{{ currentContent.author }}</span>
              <span><i class="fas fa-folder mr-1"></i>{{ currentContent.categoryName || 'Uncategorized' }}</span>
              <span><i class="fas fa-clock mr-1"></i>{{ formatTime(currentContent.submitTime) }}</span>
              <span v-if="currentContent.accessType === 'paid'">
                <i class="fas fa-coins mr-1 text-orange-500"></i>{{ currentContent.price }} Points
              </span>
              <span v-else class="text-green-600">
                <i class="fas fa-check mr-1"></i>Free
              </span>
            </div>
            
            <!-- Tags -->
            <div v-if="currentContent.tags && currentContent.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="tag in currentContent.tags" 
                :key="tag"
                class="px-3 py-1 bg-purple-100 text-purple-600 text-sm rounded-full"
              >
                {{ tag }}
              </span>
            </div>
            
            <!-- Summary -->
            <div class="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 class="font-semibold text-gray-800 mb-2">Summary</h4>
              <p class="text-gray-600">{{ currentContent.preview }}</p>
            </div>
          </div>
          
          <!-- Cover Image -->
          <div v-if="currentContent.images && currentContent.images.length > 0" class="mb-6">
            <h4 class="font-semibold text-gray-800 mb-2">Cover Image</h4>
            <img 
              :src="currentContent.images[0]" 
              :alt="currentContent.title"
              class="w-full max-w-md h-48 object-cover rounded-lg"
            />
          </div>
          
          <!-- Content Body -->
          <div v-if="currentContent.content" class="mb-6">
            <h4 class="font-semibold text-gray-800 mb-2">Content Body</h4>
            <div class="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
              <div class="prose max-w-none text-gray-700 whitespace-pre-wrap">{{ currentContent.content }}</div>
            </div>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200/50 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
          <button
            @click="closeDetailModal"
            class="px-6 py-2 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
          >
            Close
          </button>
          <button
            @click="showRejectDialog(currentContent.id)"
            class="px-6 py-2 border-2 border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
            :disabled="processingItems.includes(currentContent.id)"
          >
            <i class="fas fa-times mr-1"></i> Reject
          </button>
          <button
            @click="approveContent(currentContent.id)"
            class="px-6 py-2 border-2 border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105"
            :disabled="processingItems.includes(currentContent.id)"
          >
            <i class="fas fa-check mr-1"></i> Approve
          </button>
        </div>
      </div>
    </div>
    
    <!-- Reject Reason Dialog -->
    <div 
      v-if="showRejectModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-[90vw] sm:max-w-md transform animate-scale-in border border-white/20">
        <div class="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-red-50 to-pink-50 rounded-t-2xl">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 flex items-center font-poppins">
            <i class="fas fa-times-circle mr-2 text-red-500"></i>
            Rejection Reason
          </h3>
        </div>
        
        <div class="px-6 py-6">
          <label class="block text-sm font-semibold text-gray-700 mb-2 flex items-center font-poppins">
            <i class="fas fa-comment-dots mr-2 text-gray-500"></i>
            Please provide a reason for rejection
          </label>
          <textarea
            v-model="rejectReason"
            placeholder="Enter rejection reason to help the author improve! 💡"
            rows="4"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 hover:border-red-300 resize-none text-gray-800 font-poppins"
          ></textarea>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200/50 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
          <button
            @click="closeRejectModal"
            class="px-6 py-2 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            @click="rejectContent"
            :disabled="!rejectReason.trim() || isProcessingReject"
            :class="[
              'px-6 py-2 border-2 border-transparent rounded-xl text-sm font-semibold text-white transition-all duration-200 transform hover:scale-105',
              rejectReason.trim() && !isProcessingReject
                ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg' 
                : 'bg-gray-300 cursor-not-allowed'
            ]"
          >
            {{ isProcessingReject ? 'Processing...' : '🗑️ Confirm Reject' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SimpleDataManager } from '@/utils/simpleDataManager'
import { firebaseRepo } from '@/services/firebaseRepo'

export default {
  name: 'ContentReview',
  data() {
    return {
      filter: 'all',
      isLoading: false,
      
      // Modal Status
      showDetailModal: false,
      showRejectModal: false,
      currentContent: null,
      rejectReason: '',
      currentRejectId: null,
      isProcessingReject: false,
      
      // Data
      contents: [],
      processingItems: [], // IDs of content being processed
      
      // Data Manager
      dataManager: null
    }
  },
  computed: {
    filteredContents() {
      return this.contents.filter(item => {
        // Show only pending content
        if (item.status !== 'pending') return false;
        
        // Filter by type
        if (this.filter === 'all') return true;
        return item.type === this.filter;
      })
    },
    
    totalPendingCount() {
      return this.contents.filter(item => item.status === 'pending').length
    },
    
    blogCount() {
      return this.contents.filter(item => item.status === 'pending' && item.type === 'blog').length
    },
    
    videoCount() {
      return this.contents.filter(item => item.status === 'pending' && item.type === 'video').length
    }
  },
  mounted() {
    this.initializeData()
  },
  methods: {
    initializeData() {
      try {
        this.dataManager = SimpleDataManager.getInstance()
        this.loadPendingContents()
        console.log('Content.vue initialized')
      } catch (error) {
        console.error('Failed to initialize content review page:', error)
      }
    },
    
    // Load pending content from data manager
    async loadPendingContents() {
      try {
        const list = await this.dataManager.getPendingContentsAsync()
        this.contents = list.map(content => ({
          ...content,
          submitTime: content.submitTime?.toDate ? content.submitTime.toDate() : (content.submitTime || new Date())
        }))
        console.log('Pending content loaded (Firebase):', this.contents.length, 'items')
      } catch (error) {
        console.error('Failed to load pending content:', error)
        this.contents = []
      }
    },
    
    refreshContent() {
      this.isLoading = true
      setTimeout(() => {
        this.loadPendingContents()
        this.isLoading = false
      }, 500)
    },
    
    formatTime(date) {
      if (!date) return 'Unknown Time'
      
      const now = new Date()
      const diff = now - date
      
      if (diff < 60 * 1000) {
        return 'Just now'
      } else if (diff < 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 1000))} mins ago`
      } else if (diff < 24 * 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 60 * 1000))} hours ago`
      } else {
        return date.toLocaleDateString('en-US')
      }
    },
    
    showContentDetail(content) {
      this.currentContent = content
      this.showDetailModal = true
    },
    
    closeDetailModal() {
      this.showDetailModal = false
      this.currentContent = null
    },
    
    async approveContent(id) {
      if (this.processingItems.includes(id)) return
      
      const content = this.contents.find(item => item.id === id)
      if (!content) return
      
      const contentType = content.type === 'video' ? 'Video Content' : 'Blog Post'
      if (!confirm(`Are you sure you want to approve "${content.title}"?\n\nContent Type: ${contentType}\nIt will be published to the home page after approval.`)) return
      
      this.processingItems.push(id)
      
      try {
        // Approve content using data manager
        const success = await this.dataManager.approvePendingContentAsync(id)
        
        if (success) {
          // Refresh pending list
          this.loadPendingContents()
          
          // Close detail modal
          if (this.currentContent && this.currentContent.id === id) {
            this.closeDetailModal()
          }
          
          // Show success message, distinguish content type
          const successMsg = `${contentType} "${content.title}" Approved! Content published to home page`
          this.$message?.success(successMsg) || console.log(successMsg)
          
          // Additional tip for video content
          if (content.type === 'video') {
            setTimeout(() => {
              const videoTip = 'Video content published! Users can view it in "Video Content" filter on home page, or in their profile.'
              this.$message?.info(videoTip) || console.log(videoTip)
            }, 2000)
          }
        } else {
              throw new Error('Review operation failed')
            }
          } catch (error) {
            console.error('Approve failed:', error)
            const errorMsg = error.message || 'Unknown Error'
            this.$message?.error(`Review operation failed: ${errorMsg} (ID: ${id})`) || 
            alert(`Review operation failed: ${errorMsg}\nContent ID: ${id}`)
          } finally {
            this.processingItems = this.processingItems.filter(itemId => itemId !== id)
          }
       
    },
    
    // Add new method in Content.vue to view published content
    async viewPublishedContent() {
      try {
        const publishedArticles = await this.dataManager.getPublishedContentAsync()
        const videoContent = publishedArticles.filter(article => article.isVideo)
        const blogContent = publishedArticles.filter(article => !article.isVideo)
        
        console.log('Published content stats:', {
          Total: publishedArticles.length,
          Blogs: blogContent.length,
          Videos: videoContent.length
        })
        
        // Show statistics
        const statsMsg = `Published content: Total ${publishedArticles.length} items (Blogs ${blogContent.length}, Videos ${videoContent.length})`
        this.$message?.success(statsMsg) || alert(statsMsg)
        
        // Redirect to home to view
        this.$router.push('/')
      } catch (error) {
        console.error('Failed to view published content:', error)
      }
    },

    showRejectDialog(id) {
      this.currentRejectId = id
      this.rejectReason = ''
      this.showRejectModal = true
    },
    
    closeRejectModal() {
      this.showRejectModal = false
      this.currentRejectId = null
      this.rejectReason = ''
    },
    
    async rejectContent() {
      if (!this.currentRejectId || !this.rejectReason.trim()) return
      
      const content = this.contents.find(item => item.id === this.currentRejectId)
      if (!content) return
      
      this.isProcessingReject = true
      
      try {
        // Reject content using data manager
        const success = await this.dataManager.rejectPendingContentAsync(this.currentRejectId, this.rejectReason.trim())
        
        if (success) {
          // Refresh pending list
          this.loadPendingContents()
          
          // Close detail modal
          if (this.currentContent && this.currentContent.id === this.currentRejectId) {
            this.closeDetailModal()
          }
          
          // Close reject modal
          this.closeRejectModal()
          
          // Show success message
          this.$message?.success(`"${content.title}" Rejected`) || 
          console.log(`"${content.title}" Rejected`)
        } else {
          throw new Error('Reject operation failed')
        }
      } catch (error) {
        console.error('Reject content failed:', error)
        this.$message?.error('Operation failed') || 
        alert('Operation failed: ' + error.message)
      } finally {
        this.isProcessingReject = false
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(20px, -30px) scale(1.05);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-blob {
  animation: blob 8s infinite;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Animation Delay */
.animation-delay-300 { animation-delay: 300ms; }
.animation-delay-600 { animation-delay: 600ms; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }

/* Mobile Optimization */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  button, input, textarea {
    min-height: 2.5rem;
  }
}

/* Disabled State */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Scrollbar Style */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>