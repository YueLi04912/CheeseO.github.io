<!-- src/components/Navbar.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { SimpleDataManager } from '@/utils/simpleDataManager'

const router = useRouter()
const route = useRoute()
const dataManager = SimpleDataManager.getInstance()

// Reactive data
const currentUser = ref(dataManager.getCurrentUser())
const membershipStatus = ref<{ isMember: boolean; type?: string }>({ isMember: false })
const isScrolled = ref(false)

// Computed properties
const isLoggedIn = computed(() => !!currentUser.value)
const displayName = computed(() => {
  if (!currentUser.value) return 'Guest'
  return currentUser.value.nickname || currentUser.value.username
})

const userPoints = computed(() => currentUser.value?.points || 0)
const isAdmin = computed(() => currentUser.value?.role === 'admin')

// Navigation Items Configuration - Desktop Only
const navItems = computed(() => [
  { name: 'Home', path: '/', icon: 'fas fa-home' },
  ...(isLoggedIn.value ? [
    { name: 'Post Content', path: '/post', icon: 'fas fa-edit' },
    { name: 'Points Center', path: '/projects', icon: 'fas fa-coins' }
  ] : []),
  ...(isAdmin.value ? [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: 'fas fa-cog', special: true }
  ] : [])
])

// Methods
const logout = () => {
  if (confirm('Are you sure you want to logout?')) {
    dataManager.clearCurrentUser()
    currentUser.value = null
    membershipStatus.value = { isMember: false }
    router.push('/')
  }
}

const refreshUserData = async () => {
  // Use async method to get latest user data (includes server-side refresh logic)
  const user = await dataManager.getCurrentUserAsync()
  currentUser.value = user

  if (user) {
    try {
        const status = await dataManager.getUserMembershipStatusAsync(user.id)
        membershipStatus.value = status
    } catch (e) {
        console.error('Failed to refresh membership data:', e)
        // Fallback to sync membership status
        membershipStatus.value = dataManager.getUserMembershipStatus(user.id)
    }
  } else {
    membershipStatus.value = { isMember: false }
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

// Watch for route changes, refresh user data
watch(() => route.path, () => {
  refreshUserData()
})

// Initialize on mount
onMounted(() => {
  refreshUserData()
  
  // Scroll listener
  window.addEventListener('scroll', handleScroll)
  
  // Listen for local storage changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'currentUser') {
      refreshUserData()
    }
  })
  
  console.log('Navbar.vue loaded, current user:', currentUser.value)
})
</script>

<template>
  <!-- Navigation Bar - All Devices -->
  <nav :class="[
    'fixed top-0 w-full z-50 transition-all duration-500',
    isScrolled 
      ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-white/20' 
      : 'bg-white/70 backdrop-blur-sm border-b border-white/10'
  ]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
      <!-- Logo -->
      <router-link 
        to="/" 
        class="group flex items-center space-x-2 text-transparent bg-clip-text text-lg sm:text-xl font-black tracking-tight isolate mix-blend-normal"
      >
        <div class="relative">
          <div class="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg transform group-hover:rotate-12 transition-transform duration-300 flex items-center justify-center">
            <span class="text-white font-bold text-xs sm:text-sm">🧀</span>
          </div>
          <!-- Glow Effect -->
          <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
        </div>
        <span 
          class="group-hover:scale-105 transition-transform duration-300 inline-block isolate relative z-10"
          style="background: linear-gradient(to right, #2563eb, #9333ea, #db2777); background-clip: text; color: transparent;"
        >
          CheeseO
        </span>
      </router-link>
      
      <!-- Navigation Menu - Desktop Only -->
      <div class="hidden lg:flex items-center space-x-1">
        <div 
          v-for="item in navItems" 
          :key="item.path"
          class="relative"
        >
          <router-link 
            :to="item.path"
            :class="[
              'group relative px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2',
              item.special 
                ? 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                : route.path === item.path || (item.path !== '/' && route.path.startsWith(item.path))
                  ? 'text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            ]"
          >
            <i :class="item.icon" class="text-sm"></i>
            <span>{{ item.name }}</span>
            
            <!-- Active Status Indicator -->
            <div 
              v-if="route.path === item.path || (item.path !== '/' && route.path.startsWith(item.path))"
              class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
            ></div>
          </router-link>
        </div>
      </div>
      
      <!-- User Information Area -->
      <div class="flex items-center space-x-2 sm:space-x-3">
        <template v-if="isLoggedIn">
          <!-- Points Display - Mobile Simplified -->
          <div class="group flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl border border-yellow-200/50 hover:shadow-md transition-all duration-300">
            <div class="relative">
              <i class="fas fa-coins text-yellow-500 text-sm group-hover:animate-bounce"></i>
              <!-- Flash Effect -->
              <div class="absolute inset-0 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-30 group-hover:animate-ping"></div>
            </div>
            <span class="text-xs sm:text-sm font-bold text-gray-700">
              {{ userPoints >= 1000 ? Math.floor(userPoints/1000) + 'k' : userPoints }}
            </span>
          </div>
          
          <!-- Membership Badge - Hidden on Mobile -->
          <div 
            v-if="membershipStatus.isMember" 
            class="hidden sm:group sm:flex items-center space-x-1 bg-gradient-to-r from-purple-50 to-pink-50 px-3 py-2 rounded-xl border border-purple-200/50 hover:shadow-md transition-all duration-300"
          >
            <i class="fas fa-crown text-yellow-500 text-sm group-hover:animate-pulse"></i>
            <span class="text-xs font-bold text-purple-600">
              {{ membershipStatus.type === 'monthly' ? 'Monthly' : 'Yearly' }}
            </span>
          </div>
          
          <!-- User Menu -->
          <div class="relative group">
            <button class="flex items-center space-x-1 sm:space-x-2 text-gray-700 hover:text-blue-600 transition-all duration-300 px-2 sm:px-3 py-2 rounded-xl hover:bg-blue-50">
              <div class="relative">
                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold shadow-lg transform group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  <img v-if="currentUser?.avatar" :src="currentUser.avatar" class="w-full h-full object-cover" :alt="displayName" />
                  <span v-else class="text-xs sm:text-sm">{{ displayName.charAt(0).toUpperCase() }}</span>
                </div>
                <!-- Online Status Indicator -->
                <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div class="hidden md:block">
                <div class="text-sm font-bold text-gray-800">{{ displayName }}</div>
                <div class="text-xs text-gray-500">Online</div>
              </div>
              <i class="fas fa-chevron-down text-xs transition-transform duration-300 group-hover:rotate-180 hidden sm:block"></i>
            </button>
            
            <!-- Dropdown Menu -->
            <div class="absolute right-0 mt-2 w-48 sm:w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
              <!-- User Info Header -->
              <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-3 sm:p-4 text-white">
                <div class="font-bold text-sm sm:text-base">{{ displayName }}</div>
                <div class="text-xs opacity-90">{{ userPoints.toLocaleString() }} Points</div>
              </div>
              
              <!-- Menu Items -->
              <div class="py-2">
                <router-link 
                  to="/about" 
                  class="flex items-center px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 text-sm"
                >
                  <i class="fas fa-user w-4 sm:w-5 text-center mr-2 sm:mr-3"></i>
                  <span>Profile</span>
                </router-link>
                
                <router-link 
                  to="/withdraw" 
                  class="flex items-center px-3 sm:px-4 py-2 sm:py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 text-sm"
                >
                  <i class="fas fa-money-bill w-4 sm:w-5 text-center mr-2 sm:mr-3"></i>
                  <span>Withdraw</span>
                </router-link>
                
                <div class="border-t border-gray-100 my-2"></div>
                
                <button 
                  @click="logout" 
                  class="w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 text-sm"
                >
                  <i class="fas fa-sign-out-alt w-4 sm:w-5 text-center mr-2 sm:mr-3"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </template>
        
        <template v-else>
          <!-- Not Logged In - Mobile Optimized -->
          <router-link
            to="/Login"
            class="px-3 sm:px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 hover:bg-blue-50 rounded-lg sm:rounded-xl text-sm"
          >
            <span class="hidden sm:inline">Login</span>
            <i class="fas fa-sign-in-alt sm:hidden"></i>
          </router-link>
          <router-link
            to="/Login/Register"
            class="px-3 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium text-sm"
          >
            <span class="hidden sm:inline">Register</span>
            <i class="fas fa-user-plus sm:hidden"></i>
          </router-link>
        </template>
      </div>
    </div>
  </nav>
  
  <!-- Navigation Placeholder -->
  <div class="h-14 sm:h-16"></div>
</template>

<style scoped>
/* Custom Animations */
@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-2px);
  }
}

.animate-float-gentle {
  animation: float-gentle 3s ease-in-out infinite;
}

/* Menu Dropdown Animation */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\:visible {
  visibility: visible;
}

.group:hover .group-hover\:translate-y-0 {
  transform: translateY(0);
}

.group:hover .group-hover\:rotate-180 {
  transform: rotate(180deg);
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Router Link Active State */
.router-link-active {
  @apply text-white bg-gradient-to-r from-blue-500 to-purple-600;
}

/* Glassmorphism Enhancement */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
}

/* Mobile Touch Optimization */
@media (max-width: 640px) {
  /* Ensure large touch targets */
  button, a {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Optimize mobile spacing */
  .space-x-2 > * + * {
    margin-left: 0.5rem;
  }
  
  /* Mobile font adjustment */
  .text-xs {
    font-size: 0.75rem;
  }
}

/* Dark Mode Adaptation */
@media (prefers-color-scheme: dark) {
  .bg-white\/95 {
    background: rgba(17, 24, 39, 0.95);
  }
  
  .border-white\/20 {
    border-color: rgba(75, 85, 99, 0.2);
  }
  
  .text-gray-700 {
    color: #d1d5db;
  }
}

/* Reduced Motion Preference */
@media (prefers-reduced-motion: reduce) {
  .transition-all,
  .transition-transform,
  .transition-opacity,
  .animate-float-gentle,
  .group-hover\:animate-bounce,
  .group-hover\:animate-pulse,
  .group-hover\:animate-ping {
    animation: none;
    transition: none;
  }
}

/* Touch Device Optimization */
@media (hover: none) and (pointer: coarse) {
  .group:hover .opacity-0 {
    opacity: 0;
  }
  
  .group:hover .invisible {
    visibility: hidden;
  }
  
  /* Show dropdown on click */
  .group:active .opacity-0 {
    opacity: 1;
  }
  
  .group:active .invisible {
    visibility: visible;
  }
}
</style>