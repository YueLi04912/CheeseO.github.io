<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 pt-16">
    <!-- Main content -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <!-- Profile card -->
      <div class="bg-white rounded-2xl shadow-lg border border-purple-200 mb-8 transform transition-all hover:scale-[1.01] duration-300">
        <div class="p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div class="flex flex-col sm:flex-row items-center w-full sm:w-auto">
              <div class="relative group mb-4 sm:mb-0">
                <img :src="currentUser?.avatar || defaultAvatar" alt="User Avatar" class="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-pink-300 transition-transform group-hover:scale-105">
                <div 
                  @click="openAvatarModal"
                  class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <span class="text-white text-xs font-poppins">🖼️ Change</span>
                </div>
              </div>
              <div class="ml-0 sm:ml-6 text-center sm:text-left">
                <div class="flex flex-col sm:flex-row items-center">
                  <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 mr-0 sm:mr-3 font-poppins">
                    {{ currentUser?.nickname || currentUser?.username || 'User' }}
                  </h1>
                  <span 
                    v-if="currentUser?.isVerified"
                    class="bg-green-200 text-green-800 text-sm px-3 py-1 rounded-full flex items-center animate-pulse mt-2 sm:mt-0"
                  >
                    <i class="fas fa-check-circle mr-1"></i> Verified
                  </span>
                </div>
                <p class="text-gray-600 mt-1 font-poppins">{{ currentUser?.bio || 'No bio provided.' }}</p>
                <div class="flex justify-center sm:justify-start items-center mt-3">
                  <i class="fas fa-phone-alt text-purple-500 mr-2"></i>
                  <span class="text-gray-700 font-poppins">{{ currentUser?.phone || 'No phone linked' }}</span>
                </div>
                <div v-if="currentUser?.email" class="flex justify-center sm:justify-start items-center mt-2">
                  <i class="fas fa-envelope text-purple-500 mr-2"></i>
                  <span class="text-gray-700 font-poppins">{{ currentUser.email }}</span>
                </div>
                <!-- Membership info -->
                <div class="mt-4 flex justify-center sm:justify-start items-center">
                  <span class="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 font-poppins">
                    {{ getMembershipText() }}
                  </span>
                  <button 
                    @click="renewMembership"
                    class="ml-4 text-sm text-pink-600 hover:text-pink-700 font-poppins transition-colors duration-200"
                  >
                    {{ membershipStatus.isMember ? 'Renew Membership' : 'Activate Membership' }}
                  </button>
                </div>
              </div>
            </div>
            <div class="flex flex-row sm:flex-col space-x-3 sm:space-x-0 sm:space-y-3 w-full sm:w-auto">
              <button 
                @click="editProfile"
                class="flex-1 sm:flex-none px-5 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-200 font-poppins"
              >
                Edit Profile
              </button>
              <button 
                @click="logout"
                class="flex-1 sm:flex-none px-5 py-2 bg-gradient-to-r from-red-400 to-pink-400 text-white rounded-full hover:from-red-500 hover:to-pink-500 transition-all duration-200 font-poppins"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <!-- Published articles count -->
        <div class="bg-white rounded-xl shadow-sm p-4 text-center transform transition-all hover:scale-105 duration-300">
          <div class="text-2xl font-bold text-blue-600">{{ userStats.publishedArticles }}</div>
          <div class="text-sm text-gray-600">Articles</div>
        </div>
        
        <!-- Total likes received -->
        <div class="bg-white rounded-xl shadow-sm p-4 text-center transform transition-all hover:scale-105 duration-300">
          <div class="text-2xl font-bold text-red-500">{{ userStats.totalLikesReceived }}</div>
          <div class="text-sm text-gray-600">Likes</div>
        </div>
        
        <!-- Bookmarked articles count -->
        <div class="bg-white rounded-xl shadow-sm p-4 text-center transform transition-all hover:scale-105 duration-300">
          <div class="text-2xl font-bold text-yellow-500">{{ userStats.bookmarkedArticles }}</div>
          <div class="text-sm text-gray-600">Bookmarks</div>
        </div>
        
        <!-- Following count -->
        <div class="bg-white rounded-xl shadow-sm p-4 text-center transform transition-all hover:scale-105 duration-300">
          <div class="text-2xl font-bold text-green-500">{{ userStats.following }}</div>
          <div class="text-sm text-gray-600">Following</div>
        </div>
      </div>

      <!-- Points and content area -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：积分和会员 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 积分卡 -->
          <div class="bg-white rounded-2xl shadow-lg border border-purple-200 p-4 sm:p-6 transform transition-all hover:scale-[1.01] duration-300">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg sm:text-xl font-bold text-gray-800 font-poppins">Points Center</h2>
              <button 
                @click="refreshPointsData" 
                class="text-xs text-purple-500 hover:text-purple-700 transition-colors"
                title="Refresh Points"
              >
                <i class="fas fa-sync-alt"></i>
              </button>
            </div>
            <div class="flex items-center justify-between mb-6">
              <div>
                <p class="text-gray-600 font-poppins">Current Points</p>
                <p class="text-3xl sm:text-4xl font-bold text-purple-600 font-poppins">{{ currentUser?.points || 0 }}</p>
                <p class="text-xs text-gray-500 font-poppins mt-1">
                  {{ pointsOverview ? `Total Recharge: ${pointsOverview.totalRecharge}` : 'Loading...' }}
                </p>
              </div>
              <div class="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center animate-spin-slow">
                <i class="fas fa-coins text-purple-500 text-xl sm:text-2xl"></i>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button 
                @click="goToRecharge"
                class="py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-poppins text-sm"
              >
                Recharge Points
              </button>
              <button 
                @click="goToWithdraw"
                class="py-2 px-4 border border-purple-300 text-purple-700 rounded-full hover:bg-purple-50 transition-all duration-200 font-poppins text-sm"
              >
                Withdraw Points
              </button>
            </div>
          </div>

          <!-- Points Statistics -->
          <div class="bg-white rounded-2xl shadow-lg border border-purple-200 p-4 sm:p-6 transform transition-all hover:scale-[1.01] duration-300">
            <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 font-poppins">Points Statistics</h2>
            <div class="space-y-4">
              <div>
                <p class="text-gray-600 font-poppins">Total Recharged</p>
                <p class="text-xl sm:text-2xl font-bold text-green-600 font-poppins">{{ pointsOverview?.totalRecharge || 0 }}</p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-gray-600 font-poppins">Consumed</p>
                  <p class="text-base sm:text-lg font-medium text-red-600 font-poppins">{{ Math.abs(pointsOverview?.totalSpent || 0) }}</p>
                </div>
                <div>
                  <p class="text-gray-600 font-poppins">Recharge Amount</p>
                  <p class="text-base sm:text-lg font-medium text-blue-600 font-poppins">$ {{ (pointsOverview?.totalRecharge || 0) / 100 }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Membership Info -->
          <div class="bg-white rounded-2xl shadow-lg border border-purple-200 p-4 sm:p-6 transform transition-all hover:scale-[1.01] duration-300">
            <h2 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 font-poppins">Membership Status</h2>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600 font-poppins">Status</span>
                <span class="font-medium font-poppins">{{ getMembershipText() }}</span>
              </div>
              <div v-if="membershipStatus.isMember && membershipStatus.endDate" class="flex justify-between">
                <span class="text-gray-600 font-poppins">Expires At</span>
                <span class="font-medium font-poppins">{{ formatDate(membershipStatus.endDate) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 font-poppins">Registered At</span>
                <span class="font-medium font-poppins">{{ formatDate(currentUser?.createdAt) }}</span>
              </div>
              <button 
          @click="renewMembership"
          class="w-full mt-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-poppins text-sm"
        >
          {{ membershipStatus.isMember ? 'Renew Membership' : 'Join Membership' }}
        </button>
            </div>
          </div>

          <!-- Points Transaction History -->
          <div class="bg-white rounded-2xl shadow-lg border border-purple-200 p-4 sm:p-6 transform transition-all hover:scale-[1.01] duration-300">
            <h3 class="text-lg sm:text-xl font-bold text-gray-800 mb-4 font-poppins">Recent Points Transactions</h3>
            <div v-if="recentTransactions.length === 0" class="text-center py-4">
              <i class="fas fa-receipt text-3xl text-gray-300 mb-2"></i>
              <p class="text-gray-500 text-sm font-poppins">No points records yet</p>
            </div>
            <div v-else class="space-y-3">
              <div 
                v-for="transaction in recentTransactions.slice(0, 5)" 
                :key="transaction.id"
                class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p class="font-medium text-gray-800 text-sm">{{ getTransactionTypeText(transaction.type) }}</p>
                  <p class="text-xs text-gray-500">{{ formatDateTime(transaction.createdAt) }}</p>
                  <p v-if="transaction.description" class="text-xs text-gray-400 mt-1">{{ transaction.description }}</p>
                </div>
                <div class="text-right">
                  <p :class="getTransactionAmountClass(transaction.amount)" class="font-medium text-sm">
                    {{ transaction.amount > 0 ? '+' : '' }}{{ transaction.amount }}
                  </p>
                  <p class="text-xs text-gray-500">Balance: {{ transaction.balance }}</p>
                </div>
              </div>
            </div>
            <div v-if="recentTransactions.length > 5" class="mt-4 text-center">
              <button 
                @click="goToPointsHistory" 
                class="text-sm text-purple-600 hover:text-purple-700 font-poppins"
              >
                View Full History →
              </button>
            </div>
          </div>
        </div>

        <!-- Right side: Content and Tasks -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Tabs -->
          <div class="bg-white rounded-2xl shadow-lg border border-purple-200 overflow-hidden">
            <div class="border-b border-gray-200">
              <div class="flex flex-wrap">
                <button 
                  v-for="tab in tabs" 
                  :key="tab.key"
                  @click="setActiveTab(tab.key as TabKey)"
                  :class="[
                    'px-4 sm:px-6 py-2 sm:py-3 font-medium border-b-4 transition-all duration-200 font-poppins text-sm sm:text-base',
                    activeTab === tab.key 
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-300'
                  ]"
                >
                  {{ tab.name }}
                  <span 
                    v-if="tab.count !== undefined"
                    class="ml-2 bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full"
                  >
                    {{ tab.count }}
                  </span>
                </button>
              </div>
            </div>

            <!-- 我的博客 -->
            <div v-if="activeTab === 'blogs'" class="divide-y divide-gray-200">
              <div 
                v-for="blog in userBlogs" 
                :key="blog.id"
                class="p-4 sm:p-6 hover:bg-purple-50 transition-all duration-200 cursor-pointer transform hover:scale-[1.005]"
                @click="viewBlog(blog.id)"
              >
                <div class="flex justify-between">
                  <h3 class="text-base sm:text-lg font-medium text-gray-800 font-poppins truncate">{{ blog.title }}</h3>
                  <span 
                    :class="[
                      'text-xs px-3 py-1 rounded-full font-poppins',
                      blog.status === 'published' ? 'bg-green-200 text-green-800' :
                      blog.status === 'draft' ? 'bg-gray-200 text-gray-800' :
                      blog.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-red-200 text-red-800'
                    ]"
                  >
                    {{ getStatusText(blog.status) }}
                  </span>
                </div>
                <p class="text-gray-600 mt-2 font-poppins line-clamp-2">{{ blog.excerpt }}</p>
                <div class="flex items-center mt-4">
                  <div class="flex items-center mr-6">
                    <i class="far fa-eye text-purple-500 mr-1"></i>
                    <span class="text-sm text-gray-600 font-poppins">{{ blog.views }}</span>
                  </div>
                  <div class="flex items-center mr-6">
                    <i class="far fa-heart text-pink-500 mr-1"></i>
                    <span class="text-sm text-gray-600 font-poppins">{{ blog.likes }}</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-calendar text-gray-500 mr-1"></i>
                    <span class="text-sm text-gray-600 font-poppins">{{ formatDate(blog.createdAt) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 空状态 -->
              <div v-if="userBlogs.length === 0" class="p-6 sm:p-8 text-center">
                <div class="animate-bounce mb-2">
                  <i class="fas fa-file-alt text-4xl sm:text-6xl text-gray-300"></i>
                </div>
                <p class="text-gray-500 text-base sm:text-lg mb-1 font-poppins">No blogs published yet ~ 🌟</p>
                <p class="text-gray-400 text-sm font-poppins">Go publish your first article!</p>
                <button 
                  @click="$router.push('/post')"
                  class="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-poppins"
                >
                  Publish Article
                </button>
              </div>
            </div>

            <!-- 点赞的文章 -->
            <div v-if="activeTab === 'liked'" class="divide-y divide-gray-200">
              <div 
                v-for="article in likedArticles" 
                :key="article.id"
                class="p-4 sm:p-6 hover:bg-purple-50 transition-all duration-200 cursor-pointer transform hover:scale-[1.005]"
                @click="viewBlog(article.id)"
              >
                <div class="flex justify-between">
                  <h3 class="text-base sm:text-lg font-medium text-gray-800 font-poppins truncate">{{ article.title }}</h3>
                  <span class="text-xs px-3 py-1 rounded-full bg-red-100 text-red-800 font-poppins">
                    <i class="fas fa-heart mr-1"></i>Liked
                  </span>
                </div>
                <p class="text-gray-600 mt-2 font-poppins line-clamp-2">{{ article.excerpt }}</p>
                <div class="flex items-center justify-between mt-4">
                  <div class="flex items-center">
                    <div class="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                      <span class="text-purple-600 text-xs font-bold">{{ getAuthorInitial(article.authorName) }}</span>
                    </div>
                    <span class="text-sm text-gray-600 font-poppins">{{ article.authorName }}</span>
                  </div>
                  <div class="flex items-center text-sm text-gray-500">
                    <i class="far fa-heart text-red-500 mr-1"></i>
                    <span>{{ article.likes }}</span>
                    <span class="mx-2">•</span>
                    <span>{{ formatDate(article.createdAt) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- 空状态 -->
              <div v-if="likedArticles.length === 0" class="p-6 sm:p-8 text-center">
                <div class="animate-bounce mb-2">
                  <i class="far fa-heart text-4xl sm:text-6xl text-gray-300"></i>
                </div>
                <p class="text-gray-500 text-base sm:text-lg mb-1 font-poppins">No liked articles yet ~ ❤️</p>
                <p class="text-gray-400 text-sm font-poppins">Go discover more quality content!</p>
                <button 
                  @click="$router.push('/')"
                  class="mt-4 px-6 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-full hover:from-red-500 hover:to-pink-600 transition-all duration-200 font-poppins"
                >
                  Discover Content
                </button>
              </div>
            </div>

            <!-- Bookmarked Articles -->
            <div v-if="activeTab === 'bookmarked'" class="divide-y divide-gray-200">
              <div 
                v-for="article in bookmarkedArticles" 
                :key="article.id"
                class="p-4 sm:p-6 hover:bg-purple-50 transition-all duration-200 cursor-pointer transform hover:scale-[1.005]"
                @click="viewBlog(article.id)"
              >
                <div class="flex justify-between">
                  <h3 class="text-base sm:text-lg font-medium text-gray-800 font-poppins truncate">{{ article.title }}</h3>
                  <span class="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-poppins">
                    <i class="fas fa-bookmark mr-1"></i>Bookmarked
                  </span>
                </div>
                <p class="text-gray-600 mt-2 font-poppins line-clamp-2">{{ article.excerpt }}</p>
                <div class="flex items-center justify-between mt-4">
                  <div class="flex items-center">
                    <div class="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                      <span class="text-purple-600 text-xs font-bold">{{ getAuthorInitial(article.authorName) }}</span>
                    </div>
                    <span class="text-sm text-gray-600 font-poppins">{{ article.authorName }}</span>
                  </div>
                  <div class="flex items-center text-sm text-gray-500">
                    <i class="far fa-bookmark text-blue-500 mr-1"></i>
                    <span>Bookmarked at {{ formatDate(article.createdAt) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Empty State -->
              <div v-if="bookmarkedArticles.length === 0" class="p-6 sm:p-8 text-center">
                <div class="animate-bounce mb-2">
                  <i class="far fa-bookmark text-4xl sm:text-6xl text-gray-300"></i>
                </div>
                <p class="text-gray-500 text-base sm:text-lg mb-1 font-poppins">No bookmarked articles yet ~ 📚</p>
                <p class="text-gray-400 text-sm font-poppins">Bookmark quality articles for easy review!</p>
                <button 
                  @click="$router.push('/')"
                  class="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-poppins"
                >
                  Discover Content
                </button>
              </div>
            </div>

            <!-- 关注的人 -->
            <div v-if="activeTab === 'following'" class="divide-y divide-gray-200">
              <div 
                v-for="user in followingUsers" 
                :key="user.id"
                class="p-4 sm:p-6 hover:bg-purple-50 transition-all duration-200"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                      <span class="text-purple-600 font-bold">{{ getAuthorInitial(user.nickname || user.username) }}</span>
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-800 font-poppins">{{ user.nickname || user.username }}</h3>
                      <p class="text-sm text-gray-600 font-poppins">{{ user.bio || '这个人很懒，什么都没留下...' }}</p>
                    </div>
                  </div>
                  <button 
                    @click="unfollowUser(user.id)"
                    class="px-4 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all duration-200 text-sm font-poppins"
                  >
                    已关注
                  </button>
                </div>
              </div>
              
              <!-- 空状态 -->
              <div v-if="followingUsers.length === 0" class="p-6 sm:p-8 text-center">
                <div class="animate-bounce mb-2">
                  <i class="fas fa-user-friends text-4xl sm:text-6xl text-gray-300"></i>
                </div>
                <p class="text-gray-500 text-base sm:text-lg mb-1 font-poppins">No following yet ~ 👥</p>
                <p class="text-gray-400 text-sm font-poppins">Follow great creators to get more quality content!</p>
                <button 
                  @click="$router.push('/')"
                  class="mt-4 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full hover:from-green-600 hover:to-blue-600 transition-all duration-200 text-sm font-poppins"
                >
                  Discover Creators
                </button>
              </div>
            </div>

            
            <!-- Videos -->
            <div v-if="activeTab === 'videos'" class="divide-y divide-gray-200">
              <!-- Video List -->
              <div 
                v-for="video in userVideos" 
                :key="video.id"
                class="p-4 sm:p-6 hover:bg-purple-50 transition-all duration-200 cursor-pointer transform hover:scale-[1.005]"
                @click="viewVideo(video.id)"
              >
                <div class="flex justify-between items-start gap-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <h3 class="text-base sm:text-lg font-medium text-gray-800 font-poppins truncate">{{ video.title }}</h3>
                      <span class="text-xs px-3 py-1 rounded-full bg-red-100 text-red-800 font-poppins">
                        <i class="fas fa-video mr-1"></i>Video
                      </span>
                      <span 
                        :class="[
                          'text-xs px-3 py-1 rounded-full font-poppins',
                          video.status === 'published' ? 'bg-green-200 text-green-800' :
                          video.status === 'draft' ? 'bg-gray-200 text-gray-800' :
                          video.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-red-200 text-red-800'
                        ]"
                      >
                        {{ getStatusText(video.status) }}
                      </span>
                    </div>
                    <p class="text-gray-600 mt-2 font-poppins line-clamp-2">{{ video.excerpt }}</p>
                    
                    <!-- 视频特有信息 -->
                    <div class="flex items-center mt-3 text-sm text-gray-500">
                      <div class="flex items-center mr-4">
                        <i class="fas fa-clock mr-1"></i>
                        <span>{{ video.duration || '待处理' }}</span>
                      </div>
                      <div class="flex items-center mr-4">
                        <i class="far fa-eye text-purple-500 mr-1"></i>
                        <span>{{ video.views }}</span>
                      </div>
                      <div class="flex items-center mr-4">
                        <i class="far fa-heart text-pink-500 mr-1"></i>
                        <span>{{ video.likes }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 视频封面缩略图 -->
                  <div v-if="video.coverImage" class="flex-shrink-0">
                    <div class="w-24 h-16 bg-gray-200 rounded-lg overflow-hidden relative">
                      <img :src="video.coverImage" class="w-full h-full object-cover" />
                      <div class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <i class="fas fa-play text-white text-lg"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- 视频底部信息 -->
                <div class="flex items-center mt-4">
                  <div class="flex items-center">
                    <i class="fas fa-calendar text-gray-500 mr-1"></i>
                    <span class="text-sm text-gray-600 font-poppins">{{ formatDate(video.createdAt) }}</span>
                  </div>
                  <span class="mx-2 text-gray-400">•</span>
                  <span class="text-sm text-purple-600 font-poppins">{{ video.categoryName }}</span>
                  <span v-if="video.accessType === 'paid'" class="ml-2 text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                    {{ video.price }} 积分
                  </span>
                </div>
              </div>
              
              <!-- 空状态 -->
              <div v-if="userVideos.length === 0" class="p-6 sm:p-8 text-center">
                <div class="animate-bounce mb-2">
                  <i class="fas fa-video text-4xl sm:text-6xl text-gray-300"></i>
                </div>
                <p class="text-gray-500 text-base sm:text-lg mb-1 font-poppins">No videos yet ~ 🎬</p>
                <p class="text-gray-400 text-sm font-poppins">Create your first video content!</p>
                <button 
                  @click="$router.push('/post')"
                  class="mt-4 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full hover:from-red-600 hover:to-pink-600 transition-all duration-200 font-poppins"
                >
                  Publish Video
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Avatar Modal -->
    <div 
      v-if="showAvatarModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-[90vw] sm:max-w-md transform animate-scale-in border border-purple-200">
        <div class="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-2xl">
          <h3 class="text-lg sm:text-xl font-bold text-gray-900 flex items-center font-poppins">
            <i class="fas fa-camera mr-2 text-purple-500"></i>
            Change Avatar
          </h3>
        </div>
        <div class="px-6 py-6">
          <div class="flex flex-col items-center mb-4">
            <img 
              :src="previewAvatar || currentUser?.avatar || defaultAvatar" 
              alt="Avatar Preview" 
              class="w-24 h-24 rounded-full object-cover border-4 border-purple-300 mb-4"
            />
            <input 
              type="file" 
              ref="avatarInput" 
              accept="image/jpeg,image/png"
              @change="handleAvatarChange"
              class="hidden"
            />
            <button 
              @click="triggerFileInput"
              class="px-4 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-full hover:from-blue-500 hover:to-purple-500 transition-all duration-200 font-poppins text-sm"
            >
              Select Image
            </button>
            <p v-if="avatarError" class="text-red-500 text-xs mt-2 font-poppins">{{ avatarError }}</p>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200/50 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50/50 rounded-b-2xl">
          <button
            @click="closeAvatarModal"
            class="px-6 py-2 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            @click="saveAvatar"
            :disabled="!previewAvatar"
            :class="[
              'px-6 py-2 border-2 border-transparent rounded-xl text-sm font-semibold text-white transition-all duration-200 transform hover:scale-105',
              previewAvatar 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-md hover:shadow-lg' 
                : 'bg-gray-300 cursor-not-allowed'
            ]"
          >
            🖼️ Save Avatar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SimpleDataManager } from '@/utils/simpleDataManager'

// Define types
type TabKey = 'blogs' | 'liked' | 'bookmarked' | 'following' | 'videos'

interface Tab {
  name: string
  key: TabKey
  count?: number
}

const router = useRouter()
const dataManager = SimpleDataManager.getInstance()

// Reactive data
const currentUser = ref(dataManager.getCurrentUser())
const userBlogs = ref<any[]>([])
const likedArticles = ref<any[]>([])
const bookmarkedArticles = ref<any[]>([])
const followingUsers = ref<any[]>([])
const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=8B5CF6&color=fff&size=150'

// Points related data
const pointsOverview = ref<any>(null)
const recentTransactions = ref<any[]>([])

// Membership status
const membershipStatus = ref<{ isMember: boolean; type?: string; endDate?: string }>({ 
  isMember: false, 
  type: '', 
  endDate: '' 
})

// User stats
const userStats = ref<any>({
  publishedArticles: 0,
  totalLikesReceived: 0,
  bookmarkedArticles: 0,
  following: 0
})

// Tabs
const activeTab = ref<TabKey>('blogs')

// Avatar related state
const showAvatarModal = ref(false)
const previewAvatar = ref<string | null>(null)
const avatarInput = ref<HTMLInputElement | null>(null)
const avatarError = ref<string>('')

// Computed properties
const tabs = computed<Tab[]>(() => [
  { name: 'My Content', key: 'blogs', count: userBlogs.value.length },
  { name: 'Liked Articles', key: 'liked', count: likedArticles.value.length },
  { name: 'Bookmarked Articles', key: 'bookmarked', count: bookmarkedArticles.value.length },
  { name: 'Following', key: 'following', count: followingUsers.value.length },
  { name: 'My Videos', key: 'videos', count: userVideos.value.length }, // Updated here
])

// Add new reactive data
const userVideos = ref<any[]>([])

// Add method to load user videos
const loadUserVideos = async () => {
  if (currentUser.value) {
    const allUserContent = await dataManager.getArticlesByAuthorAsync(currentUser.value.id)
    userVideos.value = allUserContent.filter(content => content.isVideo)
    console.log('User videos loaded:', userVideos.value.length, 'videos')
  }
}

// Add viewVideo method
const viewVideo = (id: string) => {
  router.push(`/video/${id}`)
}

// Methods
const setActiveTab = (tab: TabKey) => {
  activeTab.value = tab
}

// Get membership status text
const getMembershipText = () => {
  if (membershipStatus.value.isMember) {
    return membershipStatus.value.type === 'monthly' ? 'Monthly Member' : 'Annual Member'
  }
  return 'Standard User'
}

// Load points overview
const loadPointsOverview = async () => {
  if (!currentUser.value) return
  
  pointsOverview.value = await dataManager.getUserPointsOverviewAsync(currentUser.value.id)
  recentTransactions.value = pointsOverview.value?.recentTransactions || []
  
  console.log('Points overview:', pointsOverview.value)
}

// Refresh points data
const refreshPointsData = async () => {
  // Re-fetch current user info (including latest points)
  currentUser.value = await dataManager.getUserByIdAsync(currentUser.value!.id)
  
  // Reload points overview and transaction records
  await loadPointsOverview()
  await loadMembershipStatus()
  
  console.log('Points data refreshed:', {
    currentPoints: currentUser.value?.points,
    overview: pointsOverview.value
  })
  
  // Show refresh message
  try {
    // @ts-ignore
    window.$message?.success('Data refreshed!')
  } catch {
    console.log('Points data refreshed')
  }
}

// Transaction type text
const getTransactionTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    'recharge': 'Recharge',
    'withdraw': 'Withdraw',
    'membership': 'Upgrade to Member',
    'reward': 'Reward',
    'penalty': 'Deduction'
  }
  return typeMap[type] || type
}

// Transaction amount style
const getTransactionAmountClass = (amount: number) => {
  return amount > 0 ? 'text-green-600' : 'text-red-600'
}

// Format time
const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Go to points history
const goToPointsHistory = () => {
  // Can navigate to detailed points history page here
  console.log('Navigate to points history page')
}

// Load membership status
const loadMembershipStatus = async () => {
  if (!currentUser.value) return
  
  const status = await dataManager.getUserMembershipStatusAsync(currentUser.value.id)
  membershipStatus.value = {
    isMember: status.isMember,
    type: status.type || '',
    endDate: status.endDate || ''
  }
}

// Load user stats
const loadUserStats = async () => {
  if (!currentUser.value) return
  
  userStats.value = await dataManager.getUserStatsEnhancedAsync(currentUser.value.id)
  console.log('User stats:', userStats.value)
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'draft': 'Draft',
    'published': 'Published',
    'pending': 'Pending',
    'rejected': 'Rejected'
  }
  return statusMap[status] || status
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// Avatar related methods
const openAvatarModal = () => {
  showAvatarModal.value = true
  previewAvatar.value = null
  avatarError.value = ''
}

const closeAvatarModal = () => {
  showAvatarModal.value = false
  previewAvatar.value = null
  avatarError.value = ''
}

const triggerFileInput = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      avatarError.value = 'Only JPG or PNG formats supported!'
      previewAvatar.value = null
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      avatarError.value = 'Image size cannot exceed 2MB!'
      previewAvatar.value = null
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      previewAvatar.value = e.target?.result as string
      avatarError.value = ''
    }
    reader.readAsDataURL(file)
  }
}

const saveAvatar = async () => {
  if (previewAvatar.value && currentUser.value) {
    const success = await dataManager.updateUserAsync(currentUser.value.id, {
      avatar: previewAvatar.value
    })
    
    if (success) {
      currentUser.value = { ...currentUser.value, avatar: previewAvatar.value }
      closeAvatarModal()
      console.log('Avatar updated successfully!')
      try {
        // @ts-ignore
        window.$message?.success('Avatar updated successfully!')
      } catch {
        alert('Avatar updated successfully!')
      }
    }
  }
}

// Load user blogs
const loadUserBlogs = async () => {
  if (currentUser.value) {
    const allUserContent = await dataManager.getArticlesByAuthorAsync(currentUser.value.id)
    userBlogs.value = allUserContent.filter(content => !content.isVideo)
    console.log('User blogs loaded:', userBlogs.value.length, 'articles')
  }
}

// Load liked articles
const loadLikedArticles = async () => {
  if (currentUser.value) {
    const likedIds = await dataManager.getUserLikedArticleIdsAsync(currentUser.value.id)
    const allArticles = await dataManager.getArticlesAsync()
    likedArticles.value = allArticles.filter(a => likedIds.includes(a.id))
    console.log('Liked articles loaded:', likedArticles.value.length, 'articles')
  }
}

// Load bookmarked articles
const loadBookmarkedArticles = async () => {
  if (currentUser.value) {
    const bookmarkedIds = await dataManager.getUserBookmarkedArticleIdsAsync(currentUser.value.id)
    const allArticles = await dataManager.getArticlesAsync()
    bookmarkedArticles.value = allArticles.filter(a => bookmarkedIds.includes(a.id))
    console.log('Bookmarked articles loaded:', bookmarkedArticles.value.length, 'articles')
  }
}

// Load following users
const loadFollowingUsers = async () => {
  if (currentUser.value) {
    const followingIds = await dataManager.getUserFollowingIdsAsync(currentUser.value.id)
    const usersPromises = followingIds.map(id => dataManager.getUserByIdAsync(id))
    const users = await Promise.all(usersPromises)
    followingUsers.value = users.filter(u => u !== null) as any[]
    console.log('Following users loaded:', followingUsers.value.length, 'users')
  }
}

// Unfollow
const unfollowUser = async (userId: number) => {
  if (!currentUser.value) return
  
  const success = await dataManager.unfollowUserAsync(currentUser.value.id, userId)
  if (success) { 
    await loadFollowingUsers() // Reload following list
    await loadUserStats() // Update stats
  }
}

// Navigation methods
const editProfile = () => {
  router.push('/edit')
}

const goToRecharge = () => {
  router.push('/projects')
}

const goToWithdraw = () => {
  router.push('/withdraw')
}

const viewBlog = (id: string) => {
  router.push(`/article/${id}`)
}

const renewMembership = () => {
  router.push('/projects')
}

const logout = () => {
  dataManager.clearCurrentUser()
  router.push('/Login')
}

const getAuthorInitial = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : 'U'
}

// Initialization on component mount
onMounted(async () => {
  // Check login status and get latest data
  const user = await dataManager.getCurrentUserAsync()
  if (!user) {
    router.push('/Login')
    return
  }
  currentUser.value = user

  await Promise.all([
    loadUserBlogs(),
    loadLikedArticles(),
    loadBookmarkedArticles(),
    loadFollowingUsers(),
    loadMembershipStatus(),
    loadPointsOverview(),
    loadUserStats(),
    loadUserVideos()
  ])

  console.log('About.vue real data loaded:', {
    user: currentUser.value,
    membership: membershipStatus.value,
    points: pointsOverview.value,
    stats: userStats.value,
  })
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

.animate-spin-slow {
  animation: spin 4s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Mobile optimization */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  button, input {
    min-height: 2.5rem;
  }
}
</style>
