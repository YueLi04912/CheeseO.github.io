<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 text-gray-800 pt-3">
    <!-- Main Content Area -->
    <div class="container mx-auto px-6 pt-24 pb-12">
      <div class="flex gap-8">
        <!-- Left Side Video Content -->
        <div class="flex-1">
          <!-- Video Not Found Alert -->
          <div v-if="!videoData && !loading" class="bg-white border border-red-200 rounded-lg p-8 text-center">
            <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
            <h2 class="text-xl font-bold text-gray-800 mb-2">Video Content Not Found</h2>
            <p class="text-gray-600 mb-4">The video may have been deleted or does not exist</p>
            <button 
              @click="$router.push('/')" 
              class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
            >
              Back to Home
            </button>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="bg-white border border-blue-100 rounded-lg p-8 text-center">
            <i class="fas fa-spinner fa-spin text-blue-500 text-4xl mb-4"></i>
            <p class="text-gray-600">Loading video content...</p>
          </div>

          <!-- Video Content -->
          <article v-if="videoData" class="bg-white border border-blue-100 rounded-lg p-8 hover:border-blue-300 transition-colors duration-300">
            <h1 class="text-3xl font-bold text-gray-800 mb-6">{{ videoData.title }}</h1>

            <div class="flex items-center gap-6 mb-8">
              <div class="flex items-center gap-3">
                <img :src="getAuthorAvatar()" alt="Author Avatar" class="w-10 h-10 rounded-full object-cover"/>
                <div>
                  <div class="text-gray-800">{{ videoData.authorName }}</div>
                  <div class="text-gray-500 text-sm">{{ getUserRole() }}</div>
                </div>
              </div>
              <div class="flex items-center gap-4 text-gray-500 text-sm">
                <span>{{ formatDate(videoData.publishedAt || videoData.createdAt) }}</span>
                <span v-if="videoData.duration && videoData.duration !== 'Pending'">Duration {{ videoData.duration }}</span>
                <div class="flex gap-2">
                  <span 
                    v-for="tag in (videoData.tags || []).slice(0, 3)" 
                    :key="tag"
                    class="px-2 py-1 rounded-full bg-blue-50 text-blue-400 text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <button
                v-if="isAdmin"
                @click="deleteVideo"
                class="ml-auto px-3 py-1.5 border border-red-300 text-red-600 rounded-full text-xs font-semibold hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>

            <!-- 视频播放器 -->
            <div class="mb-8 bg-black rounded-lg overflow-hidden">
              <!-- 如果有视频文件，显示视频播放器 -->
              <video v-if="videoData.videoUrl || hasVideoFile" controls class="w-full aspect-video">
      <source :src="getVideoUrl()" type="video/mp4">
      Your browser does not support video playback.
    </video>
              <!-- 如果没有视频文件，显示封面图片和提示 -->
              <div v-else class="w-full aspect-video flex items-center justify-center bg-gray-800">
                <div class="text-center text-white">
                  <i class="fas fa-video text-6xl mb-4 opacity-50"></i>
                  <p class="text-lg mb-2">视频内容</p>
                  <p class="text-sm opacity-75">{{ videoData.title }}</p>
                </div>
              </div>
            </div>

            <!-- 视频描述 -->
            <div class="prose max-w-none">
              <p class="text-gray-600 leading-relaxed mb-6">
                {{ videoData.excerpt || videoData.content }}
              </p>
            </div>

            <!-- Video bottom buttons -->
            <div class="mt-12 pt-8 border-t border-blue-100">
              <div class="flex items-center justify-between">
                <!-- Like button -->
                <button 
                  @click="toggleLike"
                  :class="[
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
                    isLiked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-red-400 hover:bg-red-50'
                  ]"
                >
                  <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
                  <span>{{ isLiked ? 'Liked' : 'Like' }} ({{ videoData.likes }})</span>
                </button>
                
                <!-- Bookmark and share button group -->
                <div class="flex items-center gap-4">
                  <!-- Bookmark button -->
                  <button 
                    @click="toggleBookmark"
                    :class="[
                      'flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 w-24',
                      isBookmarked ? 'bg-blue-500 text-white' : 'bg-blue-400 text-white hover:bg-blue-500'
                    ]"
                  >
                    <i :class="isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
                    <span>{{ isBookmarked ? 'Saved' : 'Save' }}</span>
                  </button>
                  
                  <!-- Share button -->
                  <button 
                    @click="shareVideo"
                    class="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200 w-24"
                  >
                    <i class="fas fa-share"></i>
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </article>

          <!-- 评论区 -->
          <div v-if="videoData" class="mt-8 bg-white border border-blue-100 rounded-lg p-8">
            <h3 class="text-xl font-bold text-gray-800 mb-6">Comments</h3>
            
            <!-- 发表评论 -->
            <div v-if="currentUser" class="flex gap-3 mb-6">
              <input 
                v-model="commentContent"
                type="text"
                placeholder="Write a comment..."
                class="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                @keyup.enter="submitComment"
              >
              <button 
                @click="submitComment"
                :disabled="!commentContent.trim()"
                class="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Post
              </button>
            </div>

            <!-- 未登录提示 -->
            <div v-else class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p class="text-yellow-800">
                <i class="fas fa-info-circle mr-2"></i>
                Please <router-link to="/Login" class="text-blue-600 hover:underline">Login</router-link> to post comments
              </p>
            </div>

            <!-- 评论列表 -->
            <div class="space-y-6">
              <div v-for="comment in comments" :key="comment.id" class="flex gap-4">
                <img :src="comment.avatar" alt="User Avatar" class="w-10 h-10 rounded-full"/>
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="text-gray-800 font-medium">{{ comment.name }}</span>
                    <span class="text-gray-500 text-sm">{{ comment.time }}</span>
                  </div>
                  <p class="text-gray-600">{{ comment.content }}</p>
                </div>
              </div>
              
              <!-- 评论为空提示 -->
              <div v-if="comments.length === 0" class="text-center py-8">
                <i class="far fa-comments text-4xl text-gray-300 mb-2"></i>
                <p class="text-gray-500">No comments yet. Be the first to comment!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="w-80 shrink-0">
          <div class="sticky top-24 space-y-6">
            <!-- 视频信息卡片 -->
            <div v-if="videoData" class="bg-white border border-blue-100 rounded-lg p-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Video Info</h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Published At</span>
                  <span class="text-gray-800">{{ formatDate(videoData.publishedAt || videoData.createdAt) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Views</span>
                  <span class="text-gray-800">{{ videoData.views }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Likes</span>
                  <span class="text-gray-800">{{ videoData.likes }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Category</span>
                  <span class="text-blue-600">{{ videoData.categoryName }}</span>
                </div>
                <div v-if="videoData.accessType === 'paid'" class="flex justify-between">
                  <span class="text-gray-600">Price</span>
                  <span class="text-orange-600">{{ videoData.price }} Points</span>
                </div>
              </div>
            </div>

            <!-- 相关视频推荐 -->
            <div class="bg-white border border-blue-100 rounded-lg p-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Related Videos</h3>
              <div v-if="relatedVideos.length > 0" class="space-y-4">
                <router-link 
                  v-for="video in relatedVideos" 
                  :key="video.id" 
                  :to="`/video/${video.id}`"
                  class="block group"
                >
                  <div class="aspect-video bg-gray-200 rounded-lg mb-2 overflow-hidden">
                    <img 
                      v-if="video.coverImage"
                      :src="video.coverImage" 
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                      <i class="fas fa-video text-gray-500 text-2xl"></i>
                    </div>
                  </div>
                  <div class="text-gray-600 group-hover:text-blue-400 mb-1 line-clamp-2 text-sm">{{ video.title }}</div>
                  <div class="text-xs text-gray-500">{{ video.authorName }} • {{ video.views }} views</div>
                </router-link>
              </div>
              <div v-else class="text-center py-4">
                <i class="fas fa-video text-2xl text-gray-300 mb-2"></i>
                <p class="text-gray-500 text-sm">No related videos</p>
              </div>
            </div>

            <!-- 作者信息 -->
            <div v-if="authorInfo" class="bg-white border border-blue-100 rounded-lg p-6">
              <h3 class="text-lg font-bold text-gray-800 mb-4">Author Info</h3>
              <div class="flex items-center gap-3 mb-4">
                <img :src="getAuthorAvatar()" alt="Author Avatar" class="w-12 h-12 rounded-full object-cover"/>
                <div>
                  <div class="font-medium text-gray-800">{{ authorInfo.nickname || authorInfo.username }}</div>
                  <div class="text-sm text-gray-500">{{ getUserRole() }}</div>
                </div>
              </div>
              <p v-if="authorInfo.bio" class="text-gray-600 text-sm mb-4">{{ authorInfo.bio }}</p>
              <div class="flex gap-2">
                <button 
                  @click="toggleFollow"
                  :class="[
                    'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200',
                    isFollowing ? 'bg-gray-100 text-gray-600' : 'bg-blue-500 text-white hover:bg-blue-600'
                  ]"
                >
                  {{ isFollowing ? 'Following' : 'Follow' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SimpleDataManager } from '@/utils/simpleDataManager'

// Route and component instances
const route = useRoute()
const router = useRouter()

// Data Manager
const dataManager = SimpleDataManager.getInstance()

// Reactive data
const currentUser = ref(dataManager.getCurrentUser())
const isAdmin = computed(() => currentUser.value?.role === 'admin')
const videoData = ref(null)
const authorInfo = ref(null)
const loading = ref(true)

// Interaction state
const isLiked = ref(false)
const isBookmarked = ref(false)
const isFollowing = ref(false)

// Comments
const commentContent = ref('')
const comments = ref([])

// Related content
const relatedVideos = ref([])

// Computed properties
const videoId = computed(() => route.params.id)
const hasVideoFile = computed(() => videoData.value && (videoData.value.videoFile || videoData.value.videoUrl))

// Component initialization and route watchers are set after method definitions

// Method definitions
const loadVideoData = async () => {
  const id = Array.isArray(videoId.value) ? videoId.value[0] : videoId.value
  if (!id) {
    loading.value = false
    return
  }

  loading.value = true
  
  try {
    // Get video data (find video type content from articles)
    const article = await dataManager.getArticleWithViewAsync(id)
    
    if (article && article.isVideo) {
      // Show main content first to avoid blocking by network issues
      videoData.value = article
      loading.value = false

      Promise.allSettled([
        loadAuthorInfo(),
        loadInteractionStates(),
        loadRelatedVideos(),
        loadComments()
      ]).then(() => {
        console.log('Video auxiliary data loaded')
      })

      console.log('Video data loaded:', videoData.value)
    } else {
      console.error('Video not found or invalid type:', id)
      videoData.value = null
      loading.value = false
    }
  } catch (error) {
    console.error('Failed to load video data:', error)
    videoData.value = null
    loading.value = false
  }
}

const loadAuthorInfo = async () => {
  if (videoData.value) {
    authorInfo.value = await dataManager.getUserByIdAsync(videoData.value.authorId)
  }
}

const loadInteractionStates = async () => {
  if (!currentUser.value || !videoData.value) return
  
  // Check like status
  isLiked.value = await dataManager.isArticleLikedAsync(currentUser.value.id, videoData.value.id)
  
  // Check bookmark status
  isBookmarked.value = await dataManager.isArticleBookmarkedAsync(currentUser.value.id, videoData.value.id)
  
  // Check follow status
  if (authorInfo.value) {
    isFollowing.value = await dataManager.isUserFollowedAsync(currentUser.value.id, authorInfo.value.id)
  }
}

const loadRelatedVideos = async () => {
  if (!videoData.value) return
  
  try {
    // Get all video content (use cloud optimized query)
    const allVideos = await dataManager.getVideoContentAsync()
    
    // Filter related videos (same category or tags, exclude current video)
    relatedVideos.value = allVideos
      .filter(video => 
        video.id !== videoData.value.id && 
        (video.categoryId === videoData.value.categoryId || 
         (video.tags && videoData.value.tags && 
          video.tags.some(tag => videoData.value.tags.includes(tag))))
      )
      .slice(0, 5)
      
    console.log('Related videos loaded:', relatedVideos.value.length)
  } catch (error) {
    console.error('Failed to load related videos:', error)
    relatedVideos.value = []
  }
}

const loadComments = async () => {
  if (!videoData.value) return
  
  try {
    // Get comment list
    const commentsList = await dataManager.getCommentsAsync(videoData.value.id)
    if (commentsList && commentsList.length > 0) {
      comments.value = commentsList.map(c => ({
        id: c.id,
        name: c.userName || c.authorName || 'Anonymous User',
        avatar: c.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.userName || 'User')}&background=random&color=fff`,
        time: formatDate(c.createdAt),
        content: c.content
      }))
    } else {
      comments.value = []
    }
  } catch (error) {
    console.error('Failed to load comments:', error)
    comments.value = []
  }
}

const deleteVideo = async () => {
  if (!currentUser.value || currentUser.value.role !== 'admin' || !videoData.value) return
  const ok = confirm(`确定要删除这个视频吗？\n\n标题：${videoData.value.title}`)
  if (!ok) return
  try {
    const success = await dataManager.deleteArticleAsync(videoData.value.id)
    if (success) {
      alert('视频已删除')
      router.push('/')
    } else {
      alert('删除失败：未找到对应内容')
    }
  } catch (error) {
    console.error('删除视频失败:', error)
    alert('删除失败：' + (error.message || '未知错误'))
  }
}

const getVideoUrl = () => {
  if (videoData.value?.videoUrl) {
    return videoData.value.videoUrl
  }
  if (videoData.value?.videoFile) {
    // If file object, need to create URL
    return URL.createObjectURL(videoData.value.videoFile)
  }
  // Return example video URL
  return new URL('../assets/man.mp4', import.meta.url).href
}

const getAuthorAvatar = () => {
  if (authorInfo.value?.avatar) {
    return authorInfo.value.avatar
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(videoData.value?.authorName || 'User')}&background=8B5CF6&color=fff`
}

const getUserRole = () => {
  if (authorInfo.value?.role === 'admin') {
    return 'Admin'
  }
  return 'Creator'
}

const toggleLike = async () => {
  if (!currentUser.value) {
    router.push('/Login')
    return
  }
  
  try {
    const newLikeState = await dataManager.likeArticleAsync(currentUser.value.id, videoData.value.id)
    isLiked.value = newLikeState
    
    // 更新点赞数
    if (newLikeState) {
      videoData.value.likes++
    } else {
      videoData.value.likes = Math.max(0, videoData.value.likes - 1)
    }
    
    console.log('点赞状态已更新:', isLiked.value)
  } catch (error) {
    console.error('点赞操作失败:', error)
  }
}

const toggleBookmark = async () => {
  if (!currentUser.value) {
    router.push('/Login')
    return
  }
  
  try {
    const newBookmarkState = await dataManager.bookmarkArticleAsync(currentUser.value.id, videoData.value.id)
    isBookmarked.value = newBookmarkState
    
    console.log('收藏状态已更新:', isBookmarked.value)
  } catch (error) {
    console.error('收藏操作失败:', error)
  }
}

const toggleFollow = async () => {
  if (!currentUser.value || !authorInfo.value) {
    router.push('/Login')
    return
  }
  
  try {
    const newFollowState = await dataManager.followUserAsync(currentUser.value.id, authorInfo.value.id)
    isFollowing.value = newFollowState
    
    console.log('关注状态已更新:', isFollowing.value)
  } catch (error) {
    console.error('关注操作失败:', error)
  }
}

const submitComment = async () => {
  if (!currentUser.value || !commentContent.value.trim()) return
  
  const commentData = {
    articleId: videoData.value.id,
    userId: currentUser.value.id.toString(),
    userName: currentUser.value.nickname || currentUser.value.username,
    userAvatar: currentUser.value.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.value.username)}&background=8B5CF6&color=fff`,
    content: commentContent.value.trim(),
    createdAt: new Date().toISOString()
  }

  try {
    const savedComment = await dataManager.addCommentAsync(commentData)
    
    const newComment = {
      id: savedComment.id,
      name: savedComment.userName,
      avatar: savedComment.userAvatar,
      time: '刚刚',
      content: savedComment.content
    }
    
    comments.value.unshift(newComment)
    commentContent.value = ''
    
    // 更新评论数
    videoData.value.comments++
    
    console.log('评论已发表:', newComment)
  } catch (error) {
    console.error('发表评论失败:', error)
    alert('发表评论失败，请重试')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  
  if (diff < 24 * 60 * 60 * 1000) {
    if (diff < 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 1000))}分钟前`
    }
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
  }
  
  return date.toLocaleDateString('zh-CN')
}

// 在所有方法定义完成后再挂载初始逻辑，避免 TDZ 错误
onMounted(async () => {
  const user = await dataManager.getCurrentUserAsync()
  if (user) currentUser.value = user
  await loadVideoData()
})

watch(videoId, async (newId) => {
  if (!newId) return
  await loadVideoData()
})
</script>

<style scoped>
.prose {
  color: #4b5563;
}
.prose h1, .prose h2, .prose h3 {
  color: #1f2937;
}
.prose a {
  color: #60a5fa;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.container {
  max-width: 1200px;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
