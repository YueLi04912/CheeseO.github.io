<template>
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
    </div>

    <!-- Article Not Found -->
    <div v-else-if="!article" class="max-w-4xl mx-auto px-4 py-16 text-center">
      <i class="fas fa-file-alt text-6xl text-gray-300 mb-4"></i>
      <h1 class="text-2xl font-bold text-gray-600 mb-2">Article not found</h1>
      <p class="text-gray-500 mb-6">The article you requested may have been deleted or does not exist</p>
      <button 
        @click="$router.push('/')"
        class="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
      >
        Back to Home
      </button>
    </div>

    <!-- Article content -->
    <div v-else class="max-w-4xl mx-auto px-4 py-8">
      <!-- Article header -->
      <article class="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <!-- Cover image -->
        <div v-if="article.coverImage" class="aspect-video overflow-hidden">
          <img 
            :src="article.coverImage" 
            :alt="article.title"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="p-6 md:p-8">
          <!-- Article title -->
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {{ article.title }}
          </h1>

          <!-- Article metadata -->
          <div class="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
            <!-- Author info -->
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span class="text-purple-600 font-medium text-sm">{{ getAuthorInitial(article.authorName) }}</span>
              </div>
              <span class="font-medium">{{ article.authorName }}</span>
            </div>
            
            <!-- Publish time -->
            <div class="flex items-center gap-1">
              <i class="fas fa-calendar text-gray-400"></i>
              <span>{{ formatDate(article.publishedAt || article.createdAt) }}</span>
            </div>
            
            <!-- Views -->
            <div class="flex items-center gap-1">
              <i class="fas fa-eye text-gray-400"></i>
              <span>{{ article.views || 0 }} Views</span>
            </div>
            
            <!-- Category -->
            <div v-if="article.categoryName" class="flex items-center gap-1">
              <i class="fas fa-folder text-gray-400"></i>
              <span class="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                {{ article.categoryName }}
              </span>
            </div>

            <!-- Paid badge -->
            <div v-if="article.accessType === 'paid'" class="flex items-center gap-1">
              <span class="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs">
                <i class="fas fa-crown mr-1"></i>{{ article.price }} Points
              </span>
            </div>

            <!-- Admin delete button -->
            <button
              v-if="currentUser && currentUser.role === 'admin'"
              @click="confirmDeleteArticle"
              class="ml-auto px-3 py-1.5 border border-red-300 text-red-600 rounded-full text-xs font-semibold hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>

          <!-- Tags -->
          <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mb-6">
            <span 
              v-for="tag in article.tags" 
              :key="tag"
              class="px-3 py-1 bg-purple-100 text-purple-600 text-sm rounded-full cursor-pointer hover:bg-purple-200 transition-colors"
              @click="searchByTag(tag)"
            >
              #{{ tag }}
            </span>
          </div>

          <!-- Article excerpt -->
          <div v-if="article.excerpt" class="bg-gray-50 p-4 rounded-lg mb-6 border-l-4 border-purple-500">
            <p class="text-gray-700 italic">{{ article.excerpt }}</p>
          </div>
  
            <!-- Paid Content Prompt -->
            <div v-if="article.accessType === 'paid' && !canReadPaidContent" class="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6 mb-6 text-center">
              <i class="fas fa-crown text-orange-500 text-3xl mb-3"></i>
              <h3 class="text-lg font-bold text-gray-800 mb-2">Paid Content</h3>
              <p class="text-gray-600 mb-4">This article requires {{ article.price }} points to unlock</p>
              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  v-if="currentUser"
                  @click="purchaseArticle"
                  :disabled="(currentUser?.points || 0) < article.price"
                  class="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {{ (currentUser?.points || 0) < article.price ? 'Insufficient points' : `Pay ${article.price} points to read` }}
                </button>
                <button 
                  v-else
                  @click="$router.push('/Login')"
                  class="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Login to read
                </button>
                <button 
                  @click="$router.push('/projects')"
                  class="px-6 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Recharge Points
                </button>
              </div>
            </div>
  
            <!-- Article Content Body -->
            <div class="prose max-w-none break-words overflow-hidden">
              <div 
                v-if="canReadContent" 
                class="text-gray-700 leading-relaxed break-words"
                v-html="sanitizedArticleHtml"
              >
              </div>
              <div v-else class="text-gray-500 italic text-center py-8">
                Content hidden, please unlock to read
              </div>
            </div>
  
            <!-- Article Interaction Footer -->
            <div class="mt-12 pt-8 border-t border-gray-200">
              <div class="flex flex-wrap items-center justify-between gap-4">
                <!-- Left Interaction Buttons -->
                <div class="flex items-center gap-4">
                  <!-- Like Button -->
                  <button 
                    @click="toggleLike"
                    :class="[
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
                      isLiked 
                        ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                        : 'bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500'
                    ]"
                    :disabled="!currentUser"
                    :title="!currentUser ? 'Please login first' : (isLiked ? 'Unlike' : 'Like')"
                  >
                    <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
                    <span>{{ article.likes || 0 }}</span>
                  </button>

                  <!-- Bookmark Button -->
                  <button 
                    @click="toggleBookmark"
                    :class="[
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
                      isBookmarked 
                        ? 'bg-blue-50 text-blue-500 hover:bg-blue-100' 
                        : 'bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-500'
                    ]"
                    :disabled="!currentUser"
                    :title="!currentUser ? 'Please login first' : (isBookmarked ? 'Unbookmark' : 'Bookmark')"
                  >
                    <i :class="isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
                    <span>Bookmark</span>
                  </button>

                  <!-- Share Button -->
                  <button 
                    @click="shareArticle"
                    class="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <i class="fas fa-share"></i>
                    <span>Share</span>
                  </button>
                </div>

                <!-- Right Action Buttons -->
                <div class="flex items-center gap-3">
                  <!-- Follow Author Button -->
                  <button 
                    v-if="currentUser && currentUser.id !== article.authorId"
                    @click="toggleFollow"
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isFollowing 
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    ]"
                  >
                    {{ isFollowing ? 'Following' : 'Follow Author' }}
                  </button>

                  <!-- Tip Button -->
                  <button 
                    v-if="currentUser && currentUser.id !== article.authorId"
                    @click="showTipModal = true"
                    class="px-4 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-lg hover:from-orange-500 hover:to-red-500 transition-all duration-200 text-sm font-medium"
                  >
                    <i class="fas fa-coins mr-1"></i>
                    Tip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
  
        <!-- Related Articles -->
        <div v-if="relatedArticles.length > 0" class="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 class="text-xl font-bold text-gray-900 mb-4">Related</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="relatedArticle in relatedArticles" 
              :key="relatedArticle.id"
              @click="$router.push(`/article/${relatedArticle.id}`)"
              class="flex gap-4 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <img 
                :src="relatedArticle.coverImage || getDefaultImage()" 
                :alt="relatedArticle.title"
                class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900 line-clamp-2 mb-2">{{ relatedArticle.title }}</h4>
                <div class="flex items-center gap-3 text-sm text-gray-500">
                  <span>{{ relatedArticle.authorName }}</span>
                  <span>{{ formatDate(relatedArticle.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 评论区 -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6">Comments</h3>
          
          <!-- 发表评论 -->
          <div v-if="currentUser" class="mb-6">
            <div class="flex gap-3">
              <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span class="text-purple-600 font-medium">{{ getAuthorInitial(currentUser.nickname || currentUser.username) }}</span>
              </div>
              <div class="flex-1">
                <textarea
                  v-model="newComment"
                  placeholder="Write your thoughts..."
                  rows="3"
                  class="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                ></textarea>
                <div class="flex justify-end mt-2">
                  <button
                    @click="postComment"
                    :disabled="!newComment.trim()"
                    class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 登录提示 -->
          <div v-else class="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <p class="text-gray-600 mb-3">Login to post comments</p>
            <button 
              @click="$router.push('/Login')"
              class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Login Now
            </button>
          </div>

          <!-- 评论列表 -->
          <div class="space-y-6">
            <div 
              v-for="comment in comments" 
              :key="comment.id"
              class="flex gap-3"
            >
              <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <span class="text-gray-600 font-medium">{{ getAuthorInitial(comment.author) }}</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="font-medium text-gray-900">{{ comment.author }}</span>
                  <span class="text-sm text-gray-500">{{ formatDateTime(comment.createdAt) }}</span>
                </div>
                <p class="text-gray-700">{{ comment.content }}</p>
              </div>
            </div>
          </div>
  
          <!-- 评论为空状态 -->
          <div v-if="comments.length === 0" class="text-center py-8">
          <i class="fas fa-comments text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-500">No comments yet. Be the first to comment!</p>
        </div>
        </div>
      </div>
  
      <!-- Tip Modal -->
      <div v-if="showTipModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl p-6 max-w-md w-full">
          <div class="text-center mb-6">
            <i class="fas fa-coins text-orange-500 text-4xl mb-3"></i>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Tip Author</h3>
            <p class="text-gray-600">Support the author for high-quality content</p>
          </div>
          
          <div class="grid grid-cols-3 gap-3 mb-6">
            <button 
              v-for="amount in tipAmounts" 
              :key="amount"
              @click="selectedTipAmount = amount"
              :class="[
                'py-3 px-4 rounded-lg border text-center transition-colors',
                selectedTipAmount === amount 
                  ? 'border-orange-300 bg-orange-50 text-orange-600' 
                  : 'border-gray-200 hover:border-orange-200'
              ]"
            >
              {{ amount }} Points
            </button>
          </div>
          
          <div class="flex gap-3">
            <button
              @click="showTipModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="sendTip"
              :disabled="!selectedTipAmount || (currentUser?.points || 0) < selectedTipAmount"
              class="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {{ (currentUser?.points || 0) < selectedTipAmount ? 'Insufficient Points' : 'Confirm Tip' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Login Modal -->
      <div v-if="showLoginModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl p-6 max-w-sm w-full text-center">
          <i class="fas fa-user-circle text-gray-400 text-5xl mb-4"></i>
          <h3 class="text-lg font-bold text-gray-800 mb-2">Login Required</h3>
          <p class="text-gray-600 mb-6">Please login first to perform this action</p>
          <div class="flex gap-3">
            <button
              @click="showLoginModal = false"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="goToLogin"
              class="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { SimpleDataManager } from '@/utils/simpleDataManager'
  import DOMPurify from 'dompurify'
  
  export default {
    name: 'ArticleDetail',
    data() {
      return {
        // Data Manager
        dataManager: SimpleDataManager.getInstance(),
        
        // Article Data
        article: null,
        isLoading: true,
        
        // User Status
        currentUser: null,
        membershipStatus: { isMember: false },
        isLiked: false,
        isBookmarked: false,
        isFollowing: false,
        isPurchased: false,
        
        // Comments related
        comments: [],
        newComment: '',
        
        // Related articles
        relatedArticles: [],
        
        // Tip related
        showTipModal: false,
        selectedTipAmount: null,
        tipAmounts: [10, 50, 100, 200, 500],
        
        // Other states
        showLoginModal: false
      }
    },
    computed: {
      // Whether can read paid content
      canReadPaidContent() {
        if (!this.article || this.article.accessType !== 'paid') return true
        if (!this.currentUser) return false
        
        // Author can read
        if (this.currentUser.id === this.article.authorId) return true
        
        // Members can read for free
        if (this.membershipStatus.isMember) return true
        
        // Check if article is purchased
        if (this.isPurchased) return true
        
        return false
      },
      
      // Whether can read content
      canReadContent() {
        return this.article && (this.article.accessType === 'free' || this.canReadPaidContent)
      },
      
      sanitizedArticleHtml() {
        const c = this.article && this.article.content ? String(this.article.content) : ''
        const isHtml = c.includes('<') && c.includes('>')
        const html = isHtml ? c : this.formatContent(c)
        return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
      },
    },
    async mounted() {
      await this.loadArticle()
    },
    methods: {
      // Load Article
      async loadArticle() {
        try {
          const articleId = this.$route.params.id
          if (!articleId) {
            this.$router.push('/')
            return
          }
          
          // Get current user
          this.currentUser = await this.dataManager.getCurrentUserAsync()
          
          // Get article details (auto increment views)
          this.article = await this.dataManager.getArticleWithViewAsync(articleId)
          
          if (!this.article) {
            this.isLoading = false
            return
          }
          
          // Load user interactions
          if (this.currentUser) {
            this.loadUserInteractions()
            // Load membership status
            this.membershipStatus = await this.dataManager.getUserMembershipStatusAsync(this.currentUser.id)
          }
          
          // Load related content
          await this.loadRelatedArticles()
          this.loadComments()
          
          console.log('Article details loaded:', this.article)
        } catch (error) {
          console.error('Failed to load article:', error)
        } finally {
          this.isLoading = false
        }
      },
      
      // Admin delete article
      async confirmDeleteArticle() {
        if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
          return
        }
        
        try {
          const success = await this.dataManager.deleteArticleAsync(this.article.id)
          if (success) {
            alert('Article deleted successfully')
            this.$router.push('/')
          }
        } catch (error) {
          console.error('Failed to delete article:', error)
          alert('Delete failed')
        }
      },
      
      // Load user interactions
      async loadUserInteractions() {
        if (!this.currentUser || !this.article) return
        
        try {
          // Check like status
          this.isLiked = await this.dataManager.isArticleLikedAsync(this.currentUser.id, this.article.id)
          
          // Check bookmark status
          this.isBookmarked = await this.dataManager.isArticleBookmarkedAsync(this.currentUser.id, this.article.id)
          
          // Check follow status
          this.isFollowing = await this.dataManager.isUserFollowedAsync(this.currentUser.id, this.article.authorId)

          // Check if purchased
          if (this.article.accessType === 'paid') {
            this.isPurchased = await this.dataManager.checkArticlePurchasedAsync(this.currentUser.id, this.article.id)
          }
          
          console.log('User interaction status:', {
            liked: this.isLiked,
            bookmarked: this.isBookmarked,
            following: this.isFollowing,
            purchased: this.isPurchased
          })
        } catch (error) {
          console.error('Failed to load user interactions:', error)
        }
      },
      
      // Load related articles
      async loadRelatedArticles() {
        if (!this.article) return
        
        try {
          // Get recommended articles
          if (this.currentUser) {
            this.relatedArticles = await this.dataManager.getRecommendedArticlesAsync(this.currentUser.id, 4)
          } else {
            this.relatedArticles = await this.dataManager.getPopularArticlesAsync(4)
          }
          
          // Exclude current article
          this.relatedArticles = this.relatedArticles.filter(a => a.id !== this.article.id)
        } catch (error) {
          console.error('Failed to load related articles:', error)
          this.relatedArticles = []
        }
      },
      
      // Load comments
      async loadComments() {
        if (!this.article) return
        try {
          this.comments = await this.dataManager.getCommentsAsync(this.article.id)
        } catch (error) {
          console.error('Failed to load comments:', error)
          this.comments = []
        }
      },
      
      // Toggle like
      async toggleLike() {
        if (!this.currentUser) {
          this.showLoginModal = true
          return
        }
        
        try {
          const newLikeStatus = await this.dataManager.likeArticleAsync(this.currentUser.id, this.article.id)
          this.isLiked = newLikeStatus
          
          // Update article likes
          if (newLikeStatus) {
            this.article.likes = (this.article.likes || 0) + 1
          } else {
            this.article.likes = Math.max(0, (this.article.likes || 0) - 1)
          }
          
          console.log('Like operation completed:', newLikeStatus ? 'Liked' : 'Unliked')
        } catch (error) {
          console.error('Failed to toggle like:', error)
        }
      },
      
      // Toggle bookmark
      async toggleBookmark() {
        if (!this.currentUser) {
          this.showLoginModal = true
          return
        }
        
        try {
          const newBookmarkStatus = await this.dataManager.bookmarkArticleAsync(this.currentUser.id, this.article.id)
          this.isBookmarked = newBookmarkStatus
          
          const message = newBookmarkStatus ? 'Added to bookmarks' : 'Removed from bookmarks'
          this.showMessage(message)
          
          console.log('Bookmark operation completed:', newBookmarkStatus ? 'Bookmarked' : 'Unbookmarked')
        } catch (error) {
          console.error('Failed to toggle bookmark:', error)
        }
      },
      
      // Toggle follow
      async toggleFollow() {
        if (!this.currentUser) {
          this.showLoginModal = true
          return
        }
        
        try {
          const newFollowStatus = await this.dataManager.followUserAsync(this.currentUser.id, this.article.authorId)
          this.isFollowing = newFollowStatus
          
          const message = newFollowStatus ? `Followed ${this.article.authorName}` : `Unfollowed ${this.article.authorName}`
          this.showMessage(message)
          
          console.log('Follow operation completed:', newFollowStatus ? 'Followed' : 'Unfollowed')
        } catch (error) {
          console.error('Failed to toggle follow:', error)
        }
      },
      
      // Post comment
      async postComment() {
        if (!this.newComment.trim() || !this.currentUser) return
        
        try {
          const commentData = {
            articleId: this.article.id,
            userId: this.currentUser.id.toString(),
            author: this.currentUser.nickname || this.currentUser.username,
            content: this.newComment.trim(),
            // createdAt will be set by serverTimestamp
          }
          
          const newComment = await this.dataManager.addCommentAsync(commentData)
          
          // Convert timestamp to ISO string for display
          newComment.createdAt = new Date().toISOString()
          
          this.comments.unshift(newComment)
          this.newComment = ''
          
          // Increment comment count
          this.article.comments = (this.article.comments || 0) + 1
          
          this.showMessage('Comment posted successfully')
        } catch (error) {
          console.error('Failed to post comment:', error)
          this.showMessage('Failed to post comment: ' + (error.message || 'Unknown error'))
        }
      },
      
      // Purchase article
      async purchaseArticle() {
        if (!this.currentUser) {
          this.showLoginModal = true
          return
        }
        
        try {
          if (!confirm(`Are you sure you want to pay ${this.article.price} points to purchase this article?`)) return
          
          await this.dataManager.purchaseArticleAsync(this.currentUser.id, this.article.id, this.article.price)
          
          this.isPurchased = true
          // Update local user points display
          this.currentUser.points -= this.article.price
          
          this.showMessage('Purchase successful')
        } catch (error) {
          console.error('Failed to purchase article:', error)
          this.showMessage('Purchase failed: ' + (error.message || 'Unknown error'))
        }
      },
      
      // Send tip
      async sendTip() {
        if (!this.selectedTipAmount || !this.currentUser) return
        
        if (this.currentUser.points < this.selectedTipAmount) {
          this.showMessage('Insufficient points')
          return
        }
        
        try {
          await this.dataManager.tipArticleAsync(this.currentUser.id, this.article.id, this.selectedTipAmount)
          
          // Update local user points display
          this.currentUser.points -= this.selectedTipAmount
          
          this.showMessage(`Tipped ${this.selectedTipAmount} points successfully, thank you for your support!`)
          this.showTipModal = false
          this.selectedTipAmount = null
        } catch (error) {
          console.error('Failed to tip:', error)
          this.showMessage('Tip failed: ' + (error.message || 'Unknown error'))
        }
      },
      
      // Share article
      shareArticle() {
        if (navigator.share) {
          navigator.share({
            title: this.article.title,
            text: this.article.excerpt,
            url: window.location.href
          })
        } else {
          // Copy link to clipboard
          navigator.clipboard.writeText(window.location.href).then(() => {
            this.showMessage('Link copied to clipboard')
          })
        }
      },
      
      // Search by tag
      searchByTag(tag) {
        this.$router.push(`/?search=${encodeURIComponent(tag)}`)
      },
      
      // Navigate to login
      goToLogin() {
        this.showLoginModal = false
        this.$router.push('/Login')
      },
      
      // Utility methods
      getAuthorInitial(name) {
        return name ? name.charAt(0).toUpperCase() : 'U'
      },
      
      formatDate(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US')
      },
      
      formatDateTime(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        const now = new Date()
        const diff = now - date
        
        if (diff < 60 * 1000) return 'Just now'
        if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} mins ago`
        if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))} hours ago`
        return date.toLocaleDateString('en-US')
      },
      
      formatContent(content) {
        if (!content) return ''
        
        const lines = content.split('\n')
        const processedLines = []
        let inList = false
        
        for (const line of lines) {
          const trimmed = line.trim()
          if (trimmed.startsWith('- ')) {
            if (!inList) {
              inList = true
              processedLines.push('<ul>')
            }
            processedLines.push(`<li>${trimmed.replace(/^- /, '')}</li>`)
          } else {
            if (inList) {
              processedLines.push('</ul>')
              inList = false
            }
            processedLines.push(line)
          }
        }
        if (inList) {
          processedLines.push('</ul>')
        }
        
        let html = processedLines.join('\n')
        
        html = html
          .replace(/^### (.*)$/gm, '<h3>$1</h3>')
          .replace(/^## (.*)$/gm, '<h2>$1</h2>')
          .replace(/^# (.*)$/gm, '<h1>$1</h1>')
          .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-4" />')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-600 hover:underline">$1</a>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/\n/g, '<br>')
        
        return html
      },
      
      getDefaultImage() {
        return 'https://ai-public.mastergo.com/ai/img_res/98a8925ccc2f739ead45421c3e620f2c.jpg'
      },
      
      showMessage(message) {
        if (this.$message) {
          this.$message.success(message)
        } else {
          console.log(message)
        }
      }
    }
  }
  </script>
  
<style scoped>
  .prose {
    max-width: none;
  }
  
  .prose h1, .prose h2, .prose h3 {
    color: #1f2937;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  
  .prose h1 {
    font-size: 1.5em;
    font-weight: bold;
  }
  
  .prose h2 {
    font-size: 1.3em;
    font-weight: bold;
  }
  
  .prose h3 {
    font-size: 1.1em;
    font-weight: bold;
  }
  
  .prose p {
    margin-bottom: 1em;
    line-height: 1.7;
  }
  
  .prose strong {
    font-weight: 600;
    color: #374151;
  }
  
  .prose em {
    font-style: italic;
    color: #6b7280;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* 移动端优化 */
  @media (max-width: 640px) {
    .prose {
      font-size: 0.9rem;
    }
    
    .prose h1 {
      font-size: 1.3em;
    }
    
    .prose h2 {
      font-size: 1.2em;
    }
    
    .prose h3 {
      font-size: 1.1em;
    }
  }
</style>
