<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- 增强的背景动画层 -->
    <div class="fixed inset-x-0 top-16 bottom-0 pointer-events-none z-0">
      <!-- 主要装饰形状 -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
      <div class="absolute top-1/4 -left-32 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed"></div>
      <div class="absolute bottom-20 right-1/3 w-64 h-64 bg-gradient-to-br from-cyan-200/30 to-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
      
      <!-- 网格图案 -->
      <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <!-- 光效 -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-blue-300/20 via-purple-200/10 to-transparent animate-pulse-slow"></div>
      <div class="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-radial from-pink-300/20 via-orange-200/10 to-transparent animate-pulse-slow" style="animation-delay: 3s;"></div>
    </div>

    <!-- Hero Section - 重新设计 -->
    <div class="relative z-10">
      <div class="max-w-7xl mx-auto px-6 py-8 md:py-16">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- 左侧内容 -->
          <div class="space-y-8 animate-fade-in-up">
            <!-- 主标题 -->
            <div class="space-y-6">
              <div class="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-100 animate-bounce-gentle">
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-sm font-medium text-blue-600">Updating Live</span>
              </div>
              
              <h1 class="text-4xl md:text-6xl font-black tracking-tight leading-tight">
                Explore the Infinite Knowledge
                <br />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-shimmer bg-[length:200%_100%]">
                  Infinite Possibilities
                </span>
                <span class="inline-block animate-bounce-gentle text-4xl ml-2">✨</span>
              </h1>
              
              <p class="text-xl text-gray-600 leading-relaxed max-w-lg">
                A professional knowledge sharing platform, gathering
                <span class="font-semibold text-blue-600">High-quality Blogs</span>,
                <span class="font-semibold text-purple-600">Premium Videos</span>,
                <span class="font-semibold text-pink-600">Useful Tools</span>
                <br />
                Empowering your learning and growth journey
              </p>
            </div>
            
            <!-- 特色功能标签 -->
            <div class="flex flex-wrap gap-3">
              <div class="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <i class="fas fa-blog text-blue-500 text-lg"></i>
                <span class="text-sm font-medium">Professional Blogs</span>
              </div>
              <div class="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <i class="fas fa-video text-purple-500 text-lg"></i>
                <span class="text-sm font-medium">Video Tutorials</span>
              </div>
              <div class="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/30 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <i class="fas fa-tools text-pink-500 text-lg"></i>
                <span class="text-sm font-medium">Useful Tools</span>
              </div>
            </div>
            
            <!-- 社交链接 -->
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500 font-medium">Follow us:</span>
              <div class="flex space-x-3">
                <a
                  v-for="(social, index) in socials"
                  :key="index"
                  :href="social.href || '#'"
                  target="_blank"
                  rel="noopener"
                  :aria-label="social.label || 'social link'"
                  class="group w-12 h-12 rounded-xl bg-white/70 backdrop-blur-sm flex items-center justify-center 
                         hover:bg-gradient-to-r from-blue-500 to-purple-600 hover:text-white
                         transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-110"
                  :style="{ animationDelay: `${index * 100}ms` }"
                >
                  <span class="iconify text-2xl group-hover:animate-bounce" :data-icon="social.icon" :style="{ color: social.color || 'currentColor' }"></span>
                </a>
              </div>
            </div>
          </div>
          
          <!-- 右侧图片 -->
          <div class="relative animate-fade-in-up animation-delay-300">
            <div class="relative group">
              <!-- 装饰背景 -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              
              <!-- 主图片 -->
              <img 
                :src="heroImage" 
                alt="Learning Illustration" 
                class="relative w-full h-80 md:h-96 object-cover rounded-3xl shadow-2xl border-4 border-white/50 
                       group-hover:scale-105 transition-transform duration-500" 
              />
              
              <!-- 浮动统计卡片 -->
              <div class="absolute -top-6 -left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/30 animate-float">
                <div class="text-2xl font-bold text-blue-600">{{ platformStats.totalArticles }}+</div>
                <div class="text-sm text-gray-600">Articles</div>
              </div>
              
              <div class="absolute -bottom-6 -right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/30 animate-float-delayed">
                <div class="text-2xl font-bold text-purple-600">{{ platformStats.totalUsers }}+</div>
                <div class="text-sm text-gray-600">Creators</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 py-12">
      <div class="grid lg:grid-cols-12 gap-8">
        <!-- 主内容区 -->
        <div class="lg:col-span-8">
          <!-- 搜索和标题区域 -->
          <div class="bg-white/60 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white/30 shadow-lg">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 class="text-3xl font-bold text-gray-800 mb-2">
                  {{ getContentTitle() }}
                  <span class="text-2xl">🎉</span>
                </h2>
                <p class="text-gray-600">Discover the latest and hottest content</p>
              </div>
              
              <!-- 增强的搜索框 -->
              <div class="relative md:w-80">
                <input
                  type="text"
                  v-model="searchQuery"
                  @input="handleSearch"
                  placeholder="Search for content you are interested in..."
                  class="w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl px-6 py-4 pl-14 
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 
                         transition-all duration-300 shadow-sm hover:shadow-md text-gray-700"
                />
                <i class="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <div v-if="searchQuery" 
                     @click="searchQuery = ''"
                     class="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                  <i class="fas fa-times text-xs text-gray-600"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- 选项卡导航 -->
          <div class="flex flex-wrap gap-3 mb-8">
            <button
              v-for="item in tabs"
              :key="item.key"
              @click="setActiveTab(item.key)"
              :class="[
                'group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105',
                activeTab === item.key
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/70 text-gray-600 hover:bg-white/90 hover:text-blue-600 shadow-sm hover:shadow-md'
              ]"
            >
              <span class="relative z-10">{{ item.name }}</span>
              <span v-if="item.count > 0" 
                    :class="[
                      'ml-2 px-2 py-1 rounded-full text-xs font-bold',
                      activeTab === item.key ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                    ]">
                {{ item.count }}
              </span>
              
              <!-- 活跃指示器 -->
              <div v-if="activeTab === item.key" 
                   class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
            </button>
          </div>

          <!-- 加载状态 -->
          <div v-if="isLoading" class="flex justify-center py-16">
            <div class="flex flex-col items-center space-y-4">
              <div class="relative">
                <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
              </div>
              <p class="text-gray-500 font-medium">Loading amazing content...</p>
            </div>
          </div>

          <!-- 内容卡片网格 -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article
              v-for="(item, index) in paginatedItems"
              :key="item.id"
              class="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden transition-all duration-500 
                     shadow-lg border border-white/30 hover:shadow-2xl hover:shadow-blue-500/10
                     transform hover:scale-105 hover:-translate-y-2 cursor-pointer card-hover"
              :style="{ animationDelay: `${index * 100}ms` }"
              @click="navigateToItem(item)"
            >
              <!-- 图片容器 -->
              <div class="relative overflow-hidden">
                <img 
                  :src="item.coverImage || item.image || getDefaultImage(item.type)" 
                  :alt="item.title" 
                  class="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                
                <!-- 覆盖层渐变 -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <!-- 标签组 -->
                <div class="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <!-- 内容类型 -->
                  <div class="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                    {{ item.type === 'blog' ? '📝 Blog' : '🎥 Video' }}
                  </div>
                  
                  <!-- 付费标识 -->
                  <div v-if="item.accessType === 'paid' || item.isPremium" 
                       class="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
                    <i class="fas fa-crown mr-1"></i>{{ item.price || 'Member' }}{{ item.price ? ' Points' : '' }}
                  </div>
                  <div v-else class="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-bold">
                    Free
                  </div>
                </div>
                
                <!-- 快速操作按钮 -->
                <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div class="flex space-x-2">
                    <button 
                      @click.stop="toggleLike(item)"
                      :class="[
                        'w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200',
                        isArticleLiked(item.id) 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
                      ]"
                      :disabled="!currentUser"
                      :title="!currentUser ? 'Please login first' : (isArticleLiked(item.id) ? 'Unlike' : 'Like')"
                    >
                      <i :class="isArticleLiked(item.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
                    </button>
                    
                    <button 
                      @click.stop="toggleBookmark(item)"
                      :class="[
                        'w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200',
                        isArticleBookmarked(item.id) 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white/80 text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                      ]"
                      :disabled="!currentUser"
                      :title="!currentUser ? 'Please login first' : (isArticleBookmarked(item.id) ? 'Unbookmark' : 'Bookmark')"
                    >
                      <i :class="isArticleBookmarked(item.id) ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Content Area -->
              <div class="p-6 space-y-4">
                <!-- Author Info -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-md">
                      <span class="text-white text-sm font-bold">{{ getAuthorInitial(item.authorName || item.author) }}</span>
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-gray-800">{{ item.authorName || item.author }}</div>
                      <div class="text-xs text-gray-500">{{ formatDate(item.date || item.createdAt) }}</div>
                    </div>
                  </div>
                </div>
                
                <!-- Category and Tags -->
                <div class="flex flex-wrap gap-2">
                  <span v-if="item.categoryName" 
                        class="px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-medium border border-blue-200">
                    {{ item.categoryName }}
                  </span>
                  <span
                    v-for="(tag, tagIndex) in (item.tags || []).slice(0, 2)"
                    :key="tagIndex"
                    class="px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 text-xs font-medium border border-purple-200"
                  >
                    {{ tag }}
                  </span>
                  <span v-if="(item.tags || []).length > 2" 
                        class="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                    +{{ (item.tags || []).length - 2 }}
                  </span>
                </div>
                
                <!-- Title and Description -->
                <div class="space-y-2">
                  <h3 class="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {{ item.title }}
                  </h3>
                  <p class="text-gray-600 text-sm line-clamp-2 leading-relaxed">{{ item.excerpt }}</p>
                </div>
                
                <!-- Bottom Stats -->
                <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div class="flex items-center space-x-4 text-xs text-gray-500">
                    <span class="flex items-center">
                      <i class="far fa-eye mr-1"></i>{{ item.views || 0 }}
                    </span>
                    <span class="flex items-center">
                      <i class="far fa-heart mr-1"></i>{{ item.likes || 0 }}
                    </span>
                  </div>
                  
                  <div class="flex items-center text-blue-600 font-medium text-sm">
                    <span>Read More</span>
                    <i class="fas fa-arrow-right ml-1 transform group-hover:translate-x-1 transition-transform duration-300"></i>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <!-- Pagination Controls -->
          <div v-if="totalPages > 1" class="flex justify-center mt-12">
            <div class="flex items-center space-x-2">
              <button
                @click="currentPage = Math.max(currentPage - 1, 1)"
                :disabled="currentPage === 1"
                class="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 
                       hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-all duration-300 flex items-center space-x-2"
              >
                <i class="fas fa-chevron-left text-sm"></i>
                <span>Previous</span>
              </button>
              
              <div class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold">
                {{ currentPage }} / {{ totalPages }}
              </div>
              
              <button
                @click="currentPage = Math.min(currentPage + 1, totalPages)"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 
                       hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-all duration-300 flex items-center space-x-2"
              >
                <span>Next</span>
                <i class="fas fa-chevron-right text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!isLoading && filteredItems.length === 0" class="text-center py-20">
            <div class="mb-8">
              <div class="w-24 h-24 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                <i class="fas fa-search text-4xl text-gray-400"></i>
              </div>
              <h3 class="text-2xl font-bold text-gray-800 mb-4">
                {{ searchQuery ? 'No content found' : 'No content available' }}
              </h3>
              <p class="text-gray-500 mb-8 max-w-md mx-auto">
                {{ searchQuery ? 'Try adjusting search keywords or browsing other categories' : 'More amazing content is on the way, stay tuned' }}
              </p>
              
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Clear Search
                </button>
                <button 
                  v-if="currentUser && !searchQuery"
                  @click="$router.push('/post')"
                  class="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl 
                         hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  Post Content
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="lg:col-span-4 space-y-6">
          <!-- 平台介绍卡片 -->
          <div class="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/30 animate-fade-in-up">
            <div class="text-center mb-6">
              <div class="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <span class="text-2xl">🧀</span>
              </div>
              <h3 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                CheeseO
              </h3>
              <p class="text-gray-600 text-sm leading-relaxed">
                Professional knowledge sharing platform, gathering high-quality content creators, providing blogs, video tutorials and useful tools
              </p>
            </div>
            
            <!-- 平台统计 -->
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                <div class="text-2xl font-bold text-blue-600 mb-1">{{ platformStats.totalArticles }}</div>
                <div class="text-xs text-blue-700 font-medium">Articles</div>
              </div>
              <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                <div class="text-2xl font-bold text-purple-600 mb-1">{{ platformStats.totalUsers }}</div>
                <div class="text-xs text-purple-700 font-medium">Creators</div>
              </div>
              <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                <div class="text-2xl font-bold text-green-600 mb-1">{{ formatNumber(platformStats.totalViews) }}</div>
                <div class="text-xs text-green-700 font-medium">Total Views</div>
              </div>
            </div>
          </div>
          
          <!-- 热门标签云 -->
          <div class="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/30 animate-fade-in-up animation-delay-300">
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span class="text-2xl mr-2">🔥</span>
              Popular Tags
            </h3>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="(tag, index) in popularTags"
                :key="index"
                @click="searchByTag(tag.name)"
                :class="[
                  'group px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-105 cursor-pointer',
                  index < 3 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'bg-white/80 text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 border border-gray-200'
                ]"
              >
                <span>{{ tag.name }}</span>
                <span class="ml-2 text-xs opacity-75">({{ tag.count }})</span>
              </button>
            </div>
          </div>

          <!-- 热门文章排行榜 -->
          <div class="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/30 animate-fade-in-up animation-delay-500">
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span class="text-2xl mr-2">📈</span>
              Popular Articles
            </h3>
            <div class="space-y-4">
              <div
                v-for="(article, index) in popularArticles"
                :key="article.id"
                @click="navigateToItem(article)"
                class="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-300"
              >
                <div :class="[
                  'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md',
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                  index === 2 ? 'bg-gradient-to-r from-yellow-600 to-yellow-800' :
                  'bg-gradient-to-r from-blue-400 to-blue-600'
                ]">
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                 
                  <h4 class="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {{ article.title }}
                  </h4>
                  <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span class="font-medium">{{ article.authorName }}</span>
                    <span class="flex items-center">
                      <i class="fas fa-heart text-red-400 mr-1"></i>{{ article.likes }}
                    </span>
                    <span class="flex items-center">
                      <i class="fas fa-eye text-gray-400 mr-1"></i>{{ article.views }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 内容分类 -->
          <div class="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/30 animate-fade-in-up animation-delay-700">
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span class="text-2xl mr-2">📚</span>
              Categories
            </h3>
            <div class="space-y-3">
              <button
                v-for="category in categories"
                :key="category.id || category.name"
                @click="filterByCategory(category)"
                class="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md cursor-pointer transition-all duration-300 group"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                    <i :class="category.icon || 'fas fa-folder'" class="text-white"></i>
                  </div>
                  <span class="font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                    {{ category.name }}
                  </span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {{ getCategoryCount(category) }}
                  </span>
                  <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all duration-300"></i>
                </div>
              </button>
            </div>
          </div>

          <!-- 推荐作者 -->
          <div v-if="recommendedAuthors.length > 0" class="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/30 animate-fade-in-up animation-delay-900">
            <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span class="text-2xl mr-2">✨</span>
              Recommended Authors
            </h3>
            <div class="space-y-4">
              <div
                v-for="author in recommendedAuthors"
                :key="author.id"
                class="flex items-center space-x-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
              >
                <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
                  <span class="text-white font-bold">{{ getAuthorInitial(author.nickname || author.username) }}</span>
                </div>
                <div class="flex-1">
                  <div class="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {{ author.nickname || author.username }}
                  </div>
                  <div class="text-sm text-gray-500">{{ author.articleCount }} Premium Articles</div>
                </div>
                <button 
                  v-if="currentUser && currentUser.id !== author.id"
                  @click="toggleFollow(author)"
                  :class="[
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105',
                    isUserFollowed(author.id) 
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg'
                  ]"
                >
                  {{ isUserFollowed(author.id) ? 'Following' : 'Follow' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 增强版页脚 -->
    <footer class="relative z-10 mt-16">
      <div class="max-w-7xl mx-auto px-6 py-8">
        <div class="bg-white/40 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-lg">
          <div class="text-center">
            <div class="mb-4">
              <div class="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3">
                <span class="text-xl">🧀</span>
              </div>
              <h4 class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                CheeseO
              </h4>
            </div>
            <p class="text-gray-600 text-sm mb-6 max-w-md mx-auto">
              A premium platform focused on knowledge sharing and learning exchange, making every learning experience fruitful
            </p>
            <div class="flex justify-center space-x-6 mb-6">
              <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors duration-300">
                <i class="fab fa-github text-xl"></i>
              </a>
              <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors duration-300">
                <i class="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" class="text-gray-500 hover:text-blue-600 transition-colors duration-300">
                <i class="fab fa-weixin text-xl"></i>
              </a>
            </div>
            <div class="text-gray-500 text-xs">
              @2077 CheeseO. All rights reserved. Made by LYPNXYRY
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- 登录提示模态框 -->
    <transition name="modal">
      <div v-if="showLoginModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <i class="fas fa-user-circle text-white text-2xl"></i>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-3">Login Required</h3>
            <p class="text-gray-600 mb-8 leading-relaxed">
              Login to like, bookmark articles, follow favorite authors, and enjoy a more complete experience
            </p>
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="showLoginModal = false"
                class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                @click="goToLogin"
                class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { SimpleDataManager } from '@/utils/simpleDataManager'

export default {
  name: 'Home',
  data() {
    return {
      searchQuery: '',
      activeTab: 'latest',
      isLoading: false,
      currentPage: 1,
      pageSize: 8,
      showLoginModal: false,
      
      // 数据
      items: [],
      categories: [],
      popularArticles: [],
      popularTags: [],
      recommendedAuthors: [],
      
      // 用户状态
      currentUser: null,
      userLikedArticles: new Set(),
      userBookmarkedArticles: new Set(),
      userFollowedUsers: new Set(),
      
      // 数据管理器
      dataManager: null,
      
      // 静态数据
      socials: [
        { icon: 'logos:github-icon', href: 'https://github.com/YueLi04912/CheeseO.github.io', label: 'GitHub' },
        { icon: 'fa6-brands:x-twitter', href: 'https://x.com/yourname', label: 'X' },
        { icon: 'logos:facebook', href: 'https://facebook.com/yourname', label: 'Facebook' },
        { icon: 'ri:wechat-fill', href: 'https://weixin.qq.com/', label: 'WeChat', color: '#07C160' },
      ],
      heroImage: 'https://ai-public.mastergo.com/ai/img_res/22e84a1b8d5cd77f3519c33de1342ccc.jpg',
    }
  },
  computed: {
    tabs() {
      return [
        { name: 'Latest', key: 'latest', count: this.getTabCount('latest') },
        { name: 'Popular', key: 'popular', count: this.getTabCount('popular') },
        { name: 'Blogs', key: 'blog', count: this.getTabCount('blog') },
        { name: 'Videos', key: 'video', count: this.getTabCount('video') },
        ...(this.currentUser ? [{ name: 'Following', key: 'following', count: this.getTabCount('following') }] : [])
      ]
    },
    
    filteredItems() {
      let result = this.items
      
      // 根据选项卡筛选
      switch (this.activeTab) {
        case 'latest':
          result = [...this.items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        case 'popular':
          result = [...this.items].sort((a, b) => (b.likes || 0) + (b.views || 0) * 0.1 - ((a.likes || 0) + (a.views || 0) * 0.1))
          break
        case 'blog':
          result = this.items.filter(item => item.type === 'blog')
          break
        case 'video':
          result = this.items.filter(item => item.type === 'video')
          break
        case 'following':
          if (this.currentUser) {
            const followingIds = Array.from(this.userFollowedUsers)
            result = this.items.filter(item => followingIds.includes(item.authorId))
          }
          break
      }
      
      // 搜索筛选
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(item => 
          item.title.toLowerCase().includes(query) || 
          item.excerpt.toLowerCase().includes(query) ||
          (item.tags || []).some(tag => tag.toLowerCase().includes(query)) ||
          (item.authorName || item.author || '').toLowerCase().includes(query) ||
          (item.categoryName || '').toLowerCase().includes(query)
        )
      }
      
      return result
    },
    
    paginatedItems() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredItems.slice(start, end)
    },
    
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.pageSize)
    },
    
    platformStats() {
      return {
        totalArticles: this.items.length,
        totalUsers: this.recommendedAuthors.length + 1,
        totalViews: this.items.reduce((sum, item) => sum + (item.views || 0), 0)
      }
    }
  },
  watch: {
    activeTab() {
      this.currentPage = 1
    },
    searchQuery() {
      this.currentPage = 1
    }
  },
  mounted() {
    this.loadContent()
  },
  methods: {
    formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'm'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      return num.toString()
    },
    
    async loadContent() {
      this.isLoading = true
      
      try {
        // 初始化数据管理器
        this.dataManager = SimpleDataManager.getInstance()
        
        // 异步获取当前用户
        const user = await this.dataManager.getCurrentUserAsync()
        this.currentUser = user

        if (user) {
           this.loadUserInteractions()
        }
        
        // 加载真实文章数据 - 使用并行请求获取视频和博客内容（云端优化）
        const [videos, blogs] = await Promise.all([
          this.dataManager.getVideoContentAsync(),
          this.dataManager.getBlogContentAsync()
        ])
        const articles = [...(videos || []), ...(blogs || [])]
        
        // 转换为统一格式
        this.items = articles.map(article => ({
          id: article.id,
          title: article.title,
          author: article.authorName,
          authorId: article.authorId,
          authorName: article.authorName,
          excerpt: article.excerpt,
          tags: article.tags || [],
          date: article.createdAt,
          createdAt: article.createdAt,
          publishedAt: article.publishedAt,
          type: article.isVideo ? 'video' : 'blog', // 正确设置内容类型
          image: article.coverImage,
          coverImage: article.coverImage,
          accessType: article.accessType,
          price: article.price,
          views: article.views || 0,
          likes: article.likes || 0,
          comments: article.comments || 0,
          categoryId: article.categoryId,
          categoryName: article.categoryName
        }))
        
        // 加载分类
        this.categories = await this.dataManager.getCategoriesAsync() || []
        
        // 加载热门文章
        const popular = await this.dataManager.getPopularArticlesAsync(5)
        this.popularArticles = popular.map(article => ({
          id: article.id,
          title: article.title,
          authorName: article.authorName,
          likes: article.likes || 0,
          views: article.views || 0
        }))
        
        // 生成热门标签
        this.generatePopularTags()
        
        // 生成推荐作者
        this.generateRecommendedAuthors()
        
        console.log('Home 内容已加载:', this.items.length, '篇文章')
        
      } catch (error) {
        console.error('加载内容失败:', error)
      } finally {
        this.isLoading = false
      }
    },
    
    async loadUserInteractions() {
      if (!this.currentUser) return
      
      try {
        const [likedIds, bookmarkedIds, followingIds] = await Promise.all([
          this.dataManager.getUserLikedArticleIdsAsync(this.currentUser.id),
          this.dataManager.getUserBookmarkedArticleIdsAsync(this.currentUser.id),
          this.dataManager.getUserFollowingIdsAsync(this.currentUser.id)
        ])

        this.userLikedArticles = new Set(likedIds)
        this.userBookmarkedArticles = new Set(bookmarkedIds)
        this.userFollowedUsers = new Set(followingIds)
        
        console.log('用户交互数据已加载:', {
          likes: this.userLikedArticles.size,
          bookmarks: this.userBookmarkedArticles.size,
          following: this.userFollowedUsers.size
        })
      } catch (error) {
        console.error('加载用户交互数据失败:', error)
      }
    },
    
    generatePopularTags() {
      const tagCount = {}
      this.items.forEach(item => {
        (item.tags || []).forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      })
      
      this.popularTags = Object.entries(tagCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8)
        .map(([name, count]) => ({ name, count }))
    },
    
    async generateRecommendedAuthors() {
      const authorStats = {}
      this.items.forEach(item => {
        const authorId = item.authorId
        if (!authorStats[authorId]) {
          authorStats[authorId] = {
            id: authorId,
            name: item.authorName,
            articleCount: 0,
            totalLikes: 0,
            totalViews: 0
          }
        }
        authorStats[authorId].articleCount++
        authorStats[authorId].totalLikes += item.likes || 0
        authorStats[authorId].totalViews += item.views || 0
      })
      
      // 获取用户信息
      const users = await this.dataManager.getUsersAsync()
      this.recommendedAuthors = Object.values(authorStats)
        .sort((a, b) => (b.totalLikes + b.totalViews * 0.1) - (a.totalLikes + a.totalViews * 0.1))
        .slice(0, 5)
        .map(author => {
          const user = users.find(u => u.id === author.id)
          return {
            id: author.id,
            username: user?.username || author.name,
            nickname: user?.nickname || author.name,
            articleCount: author.articleCount,
            totalLikes: author.totalLikes
          }
        })
        .filter(author => this.currentUser ? author.id !== this.currentUser.id : true)
    },
    
    getTabCount(tabKey) {
      switch (tabKey) {
        case 'latest':
        case 'popular':
          return this.items.length
        case 'blog':
          return this.items.filter(item => item.type === 'blog').length
        case 'video':
          return this.items.filter(item => item.type === 'video').length
        case 'following':
          if (!this.currentUser) return 0
          const followingIds = Array.from(this.userFollowedUsers)
          return this.items.filter(item => followingIds.includes(item.authorId)).length
        default:
          return 0
      }
    },
    
    setActiveTab(tabKey) {
      this.activeTab = tabKey
    },
    
    getContentTitle() {
      const tab = this.tabs.find(t => t.key === this.activeTab)
      return tab ? tab.name : 'Latest Content'
    },
    
    getCategoryCount(category) {
      return this.items.filter(item => 
        item.categoryName === category.name || 
        (item.tags && item.tags.includes(category.name))
      ).length
    },
    
    getDefaultImage(type) {
      const defaultImages = {
        blog: 'https://ai-public.mastergo.com/ai/img_res/98a8925ccc2f739ead45421c3e620f2c.jpg',
        video: 'https://ai-public.mastergo.com/ai/img_res/f9e542d143faf3130c066626a525bfda.jpg',
        tool: 'https://ai-public.mastergo.com/ai/img_res/360412168b5aca9387cd84d8652ccc7b.jpg'
      }
      return defaultImages[type] || defaultImages.blog
    },
    
    getAuthorInitial(name) {
      return name ? name.charAt(0).toUpperCase() : 'U'
    },
    
    formatDate(dateString) {
      if (!dateString) return ''
      
      const date = new Date(dateString)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) return 'Today'
      if (days === 1) return 'Yesterday'
      if (days < 7) return `${days} days ago`
      return date.toLocaleDateString('en-US')
    },
    
    // 交互功能
    isArticleLiked(articleId) {
      return this.userLikedArticles.has(articleId)
    },
    
    isArticleBookmarked(articleId) {
      return this.userBookmarkedArticles.has(articleId)
    },
    
    isUserFollowed(userId) {
      return this.userFollowedUsers.has(userId)
    },
    
    async toggleLike(item) {
      if (!this.currentUser) {
        this.showLoginModal = true
        return
      }
      
      try {
        const isLiked = await this.dataManager.likeArticleAsync(this.currentUser.id, item.id)
        
        if (isLiked) {
          this.userLikedArticles.add(item.id)
          item.likes = (item.likes || 0) + 1
        } else {
          this.userLikedArticles.delete(item.id)
          item.likes = Math.max(0, (item.likes || 0) - 1)
        }
        
        console.log('点赞操作完成:', isLiked ? '已点赞' : '已取消点赞')
      } catch (error) {
        console.error('点赞操作失败:', error)
      }
    },
    
    async toggleBookmark(item) {
      if (!this.currentUser) {
        this.showLoginModal = true
        return
      }
      
      try {
        const isBookmarked = await this.dataManager.bookmarkArticleAsync(this.currentUser.id, item.id)
        
        if (isBookmarked) {
          this.userBookmarkedArticles.add(item.id)
          this.$message?.success('Added to bookmarks') || console.log('Added to bookmarks')
        } else {
          this.userBookmarkedArticles.delete(item.id)
          this.$message?.success('Removed from bookmarks') || console.log('Removed from bookmarks')
        }
        
        console.log('收藏操作完成:', isBookmarked ? '已收藏' : '已取消收藏')
      } catch (error) {
        console.error('收藏操作失败:', error)
      }
    },
    
    async toggleFollow(author) {
      if (!this.currentUser) {
        this.showLoginModal = true
        return
      }
      
      try {
        const isFollowed = await this.dataManager.followUserAsync(this.currentUser.id, author.id)
        
        if (isFollowed) {
          this.userFollowedUsers.add(author.id)
          this.$message?.success(`Followed ${author.nickname || author.username}`) || console.log('Followed')
        } else {
          this.userFollowedUsers.delete(author.id)
          this.$message?.success(`Unfollowed ${author.nickname || author.username}`) || console.log('Unfollowed')
        }
        
        console.log('关注操作完成:', isFollowed ? '已关注' : '已取消关注')
      } catch (error) {
        console.error('关注操作失败:', error)
      }
    },
    
    navigateToItem(item) {
      if (item.type === 'blog') {
        // 本地更新浏览量（实际增加由文章详情页处理）
        item.views = (item.views || 0) + 1
        
        // 跳转到文章详情页
        this.$router.push(`/article/${item.id}`)
      } else if (item.type === 'video') {
        this.$router.push(`/video/${item.id}`)
      }
    },
    
    handleSearch() {
      // 搜索功能已通过计算属性实现
      console.log('搜索:', this.searchQuery)
    },
    
    searchByTag(tagName) {
      this.searchQuery = tagName
    },
    
    filterByCategory(category) {
      this.searchQuery = category.name
    },
    
    goToLogin() {
      this.showLoginModal = false
      this.$router.push('/Login')
    }
  }
}
</script>

<style scoped>
/* 自定义动画 */
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

@keyframes float {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(10px, -15px) scale(1.05);
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(-10px, -20px) scale(1.03);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(15px, -10px) scale(1.02);
  }
}

@keyframes bounce-gentle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-float {
  animation: float 20s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 25s ease-in-out infinite;
  animation-delay: -5s;
}

.animate-float-slow {
  animation: float-slow 30s ease-in-out infinite;
  animation-delay: -10s;
}

.animate-bounce-gentle {
  animation: bounce-gentle 3s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

.animate-shimmer {
  animation: shimmer 3s ease-in-out infinite;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  background-size: 200% 100%;
}

/* 背景图案 */
.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.bg-gradient-radial {
  background: radial-gradient(circle, var(--tw-gradient-stops));
}

/* 文本截断 */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 动画延迟 */
.animation-delay-300 { animation-delay: 300ms; }
.animation-delay-500 { animation-delay: 500ms; }
.animation-delay-700 { animation-delay: 700ms; }
.animation-delay-900 { animation-delay: 900ms; }

/* 悬浮卡片效果 */
.card-hover {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-hover:hover {
  transform: translateY(-12px) scale(1.03);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.15),
    0 0 40px rgba(59, 130, 246, 0.15),
    0 0 80px rgba(139, 92, 246, 0.1);
}

/* 模态框动画 */
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 移动端优化 */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  button, input {
    min-height: 2.75rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
    line-height: 1.1;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
}

/* 平板端优化 */
@media (min-width: 641px) and (max-width: 1024px) {
  .hero-title {
    font-size: 3.5rem;
  }
}

/* 高DPI屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .bg-grid-pattern {
    background-size: 10px 10px;
  }
}

/* 深色模式准备 */
@media (prefers-color-scheme: dark) {
  .bg-grid-pattern {
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up,
  .animate-float,
  .animate-float-delayed,
  .animate-float-slow,
  .animate-bounce-gentle,
  .animate-pulse-slow,
  .animate-shimmer {
    animation: none;
  }
  
  .card-hover:hover {
    transform: translateY(-2px) scale(1.01);
    transition-duration: 0.15s;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .card-hover:hover {
    transform: none;
  }
  
  .card-hover:active {
    transform: scale(0.98);
  }
}
</style>