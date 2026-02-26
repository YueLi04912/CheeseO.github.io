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
  
            <!-- 文章正文 -->
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
  
            <!-- 文章底部互动区 -->
            <div class="mt-12 pt-8 border-t border-gray-200">
              <div class="flex flex-wrap items-center justify-between gap-4">
                <!-- 左侧互动按钮 -->
                <div class="flex items-center gap-4">
                  <!-- 点赞按钮 -->
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

                  <!-- 收藏按钮 -->
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

                  <!-- 分享按钮 -->
                  <button 
                    @click="shareArticle"
                    class="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    <i class="fas fa-share"></i>
                    <span>Share</span>
                  </button>
                </div>

                <!-- 右侧操作按钮 -->
                <div class="flex items-center gap-3">
                  <!-- 关注作者按钮 -->
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

                  <!-- 打赏按钮 -->
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
  
        <!-- 相关文章推荐 -->
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
        // 数据管理器
        dataManager: SimpleDataManager.getInstance(),
        
        // 文章数据
        article: null,
        isLoading: true,
        
        // 用户状态
        currentUser: null,
        membershipStatus: { isMember: false },
        isLiked: false,
        isBookmarked: false,
        isFollowing: false,
        isPurchased: false,
        
        // 评论相关
        comments: [],
        newComment: '',
        
        // 相关文章
        relatedArticles: [],
        
        // 打赏相关
        showTipModal: false,
        selectedTipAmount: null,
        tipAmounts: [10, 50, 100, 200, 500],
        
        // 其他状态
        showLoginModal: false
      }
    },
    computed: {
      // 是否可以阅读付费内容
      canReadPaidContent() {
        if (!this.article || this.article.accessType !== 'paid') return true
        if (!this.currentUser) return false
        
        // 作者本人可以阅读
        if (this.currentUser.id === this.article.authorId) return true
        
        // 会员可以免费阅读
        if (this.membershipStatus.isMember) return true
        
        // 检查是否已购买此文章
        if (this.isPurchased) return true
        
        return false
      },
      
      // 是否可以阅读内容
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
      
      // 管理员删除文章
      async confirmDeleteArticle() {
        if (!this.currentUser || this.currentUser.role !== 'admin' || !this.article) return
        
        const ok = confirm(`确定要删除这篇内容吗？\n\n标题：${this.article.title}`)
        if (!ok) return
        
        try {
          const success = await this.dataManager.deleteArticleAsync(this.article.id)
          if (success) {
            this.showMessage('文章已删除')
            this.$router.push('/')
          } else {
            this.showMessage('删除失败：未找到对应文章')
          }
        } catch (error) {
          console.error('删除文章失败:', error)
          this.showMessage('删除失败：' + (error.message || '未知错误'))
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
          
          // 检查关注状态
          this.isFollowing = await this.dataManager.isUserFollowedAsync(this.currentUser.id, this.article.authorId)

          // 检查是否已购买
          if (this.article.accessType === 'paid') {
            this.isPurchased = await this.dataManager.checkArticlePurchasedAsync(this.currentUser.id, this.article.id)
          }
          
          console.log('用户交互状态:', {
            liked: this.isLiked,
            bookmarked: this.isBookmarked,
            following: this.isFollowing,
            purchased: this.isPurchased
          })
        } catch (error) {
          console.error('加载用户交互状态失败:', error)
        }
      },
      
      // 加载相关文章
      async loadRelatedArticles() {
        if (!this.article) return
        
        try {
          // 获取推荐文章
          if (this.currentUser) {
            this.relatedArticles = await this.dataManager.getRecommendedArticlesAsync(this.currentUser.id, 4)
          } else {
            this.relatedArticles = await this.dataManager.getPopularArticlesAsync(4)
          }
          
          // 排除当前文章
          this.relatedArticles = this.relatedArticles.filter(a => a.id !== this.article.id)
        } catch (error) {
          console.error('加载相关文章失败:', error)
          this.relatedArticles = []
        }
      },
      
      // 加载评论
      async loadComments() {
        if (!this.article) return
        try {
          this.comments = await this.dataManager.getCommentsAsync(this.article.id)
        } catch (error) {
          console.error('加载评论失败:', error)
          this.comments = []
        }
      },
      
      // 点赞切换
      async toggleLike() {
        if (!this.currentUser) {
          this.showLoginModal = true
          return
        }
        
        try {
          const newLikeStatus = await this.dataManager.likeArticleAsync(this.currentUser.id, this.article.id)
          this.isLiked = newLikeStatus
          
          // 更新文章点赞数
          if (newLikeStatus) {
            this.article.likes = (this.article.likes || 0) + 1
          } else {
            this.article.likes = Math.max(0, (this.article.likes || 0) - 1)
          }
          
          console.log('点赞操作完成:', newLikeStatus ? '已点赞' : '已取消点赞')
        } catch (error) {
          console.error('点赞操作失败:', error)
        }
      },
      
      // 收藏切换
      async toggleBookmark() {
        if (!this.currentUser) {
          this.showLoginModal = true
          return
        }
        
        try {
          const newBookmarkStatus = await this.dataManager.bookmarkArticleAsync(this.currentUser.id, this.article.id)
          this.isBookmarked = newBookmarkStatus
          
          const message = newBookmarkStatus ? '已添加到收藏' : '已取消收藏'
          this.showMessage(message)
          
          console.log('收藏操作完成:', newBookmarkStatus ? '已收藏' : '已取消收藏')
        } catch (error) {
          console.error('收藏操作失败:', error)
        }
      },
      
      // 关注切换
      async toggleFollow() {
        if (!this.currentUser) {
          this.showLoginModal = true
          return
        }
        
        try {
          const newFollowStatus = await this.dataManager.followUserAsync(this.currentUser.id, this.article.authorId)
          this.isFollowing = newFollowStatus
          
          const message = newFollowStatus ? `已关注 ${this.article.authorName}` : `已取消关注 ${this.article.authorName}`
          this.showMessage(message)
          
          console.log('关注操作完成:', newFollowStatus ? '已关注' : '已取消关注')
        } catch (error) {
          console.error('关注操作失败:', error)
        }
      },
      
      // 发表评论
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
          
          // 转换时间戳为 ISO 字符串以供显示
          newComment.createdAt = new Date().toISOString()
          
          this.comments.unshift(newComment)
          this.newComment = ''
          
          // 增加评论数显示
          this.article.comments = (this.article.comments || 0) + 1
          
          this.showMessage('评论发表成功')
        } catch (error) {
          console.error('发表评论失败:', error)
          this.showMessage('评论失败: ' + (error.message || '未知错误'))
        }
      },
      
      // 购买文章
      async purchaseArticle() {
        if (!this.currentUser) {
          this.showLoginModal = true
          return
        }
        
        try {
          if (!confirm(`确定要支付 ${this.article.price} 积分购买此文章吗？`)) return
          
          await this.dataManager.purchaseArticleAsync(this.currentUser.id, this.article.id, this.article.price)
          
          this.isPurchased = true
          // 更新本地用户积分显示
          this.currentUser.points -= this.article.price
          
          this.showMessage('购买成功')
        } catch (error) {
          console.error('购买失败:', error)
          this.showMessage('购买失败: ' + (error.message || '未知错误'))
        }
      },
      
      // 发送打赏
      async sendTip() {
        if (!this.selectedTipAmount || !this.currentUser) return
        
        if (this.currentUser.points < this.selectedTipAmount) {
          this.showMessage('积分不足')
          return
        }
        
        try {
          await this.dataManager.tipArticleAsync(this.currentUser.id, this.article.id, this.selectedTipAmount)
          
          // 更新本地用户积分显示
          this.currentUser.points -= this.selectedTipAmount
          
          this.showMessage(`打赏 ${this.selectedTipAmount} 积分成功，感谢您的支持！`)
          this.showTipModal = false
          this.selectedTipAmount = null
        } catch (error) {
          console.error('打赏失败:', error)
          this.showMessage('打赏失败: ' + (error.message || '未知错误'))
        }
      },
      
      // 分享文章
      shareArticle() {
        if (navigator.share) {
          navigator.share({
            title: this.article.title,
            text: this.article.excerpt,
            url: window.location.href
          })
        } else {
          // 复制链接到剪贴板
          navigator.clipboard.writeText(window.location.href).then(() => {
            this.showMessage('链接已复制到剪贴板')
          })
        }
      },
      
      // 按标签搜索
      searchByTag(tag) {
        this.$router.push(`/?search=${encodeURIComponent(tag)}`)
      },
      
      // 跳转到登录页
      goToLogin() {
        this.showLoginModal = false
        this.$router.push('/Login')
      },
      
      // 工具方法
      getAuthorInitial(name) {
        return name ? name.charAt(0).toUpperCase() : 'U'
      },
      
      formatDate(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('zh-CN')
      },
      
      formatDateTime(dateString) {
        if (!dateString) return ''
        const date = new Date(dateString)
        const now = new Date()
        const diff = now - date
        
        if (diff < 60 * 1000) return '刚刚'
        if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))}分钟前`
        if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
        return date.toLocaleDateString('zh-CN')
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
