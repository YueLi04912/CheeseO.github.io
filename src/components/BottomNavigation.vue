<template>
  <div class="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-inset">
    <!-- Bottom Navigation Bar -->
    <div class="relative overflow-hidden">
      <!-- Background Layer -->
      <div class="absolute inset-0 bg-gray-50/95 backdrop-blur-lg border-t border-gray-200/60"></div>
      
      <!-- Navigation Content -->
      <div class="relative flex items-center justify-around py-2 px-4">
        <!-- Home -->
        <router-link 
          to="/" 
          class="nav-item"
          :class="{ 'nav-item-active': isActive('/') }"
        >
          <div class="nav-icon-container">
            <el-icon class="nav-icon" :size="24"><HomeFilled /></el-icon>
          </div>
          <span class="nav-text">Home</span>
        </router-link>

        <!-- Post -->
        <router-link 
          v-if="currentUser"
          to="/post" 
          class="nav-item"
          :class="{ 'nav-item-active': isActive('/post') }"
        >
          <div class="nav-icon-container">
            <el-icon class="nav-icon" :size="24"><Plus /></el-icon>
          </div>
          <span class="nav-text">Post</span>
        </router-link>

        <!-- Points Center -->
        <router-link 
          v-if="currentUser"
          to="/projects" 
          class="nav-item relative"
          :class="{ 'nav-item-active': isActive('/projects') }"
        >
          <div class="nav-icon-container">
            <el-icon class="nav-icon" :size="24"><Wallet /></el-icon>
            <!-- Points Badge -->
            <div v-if="userPoints > 0" class="points-badge">
              {{ formatPoints(userPoints) }}
            </div>
          </div>
          <span class="nav-text">Points</span>
        </router-link>

        <!-- Profile -->
        <router-link 
          v-if="currentUser"
          to="/about" 
          class="nav-item"
          :class="{ 'nav-item-active': isActive('/about') }"
        >
          <div class="nav-icon-container">
            <div class="user-avatar">
              <img v-if="currentUser.avatar" 
                   :src="currentUser.avatar" 
                   :alt="displayName"
                   class="w-full h-full object-cover rounded-full">
              <div v-else class="avatar-fallback">
                {{ getInitial(displayName) }}
              </div>
              <!-- Online Indicator -->
              <div class="online-indicator"></div>
            </div>
          </div>
          <span class="nav-text">Profile</span>
        </router-link>

        <!-- Login Button (when not logged in) -->
        <router-link 
          v-if="!currentUser"
          to="/Login" 
          class="nav-item"
          :class="{ 'nav-item-active': isActive('/Login') }"
        >
          <div class="nav-icon-container">
            <el-icon class="nav-icon" :size="24"><SwitchButton /></el-icon>
          </div>
          <span class="nav-text">Login</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { SimpleDataManager } from '@/utils/simpleDataManager'
import { HomeFilled, Plus, Wallet, SwitchButton } from '@element-plus/icons-vue'

const route = useRoute()
const dataManager = SimpleDataManager.getInstance()

// Reactive data
const currentUser = ref(dataManager.getCurrentUser())

// Computed properties
const displayName = computed(() => {
  if (!currentUser.value) return 'Guest'
  return currentUser.value.nickname || currentUser.value.username
})

const userPoints = computed(() => {
  return currentUser.value?.points || 0
})

// Methods
const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const getInitial = (name: string) => {
  return name ? name.charAt(0).toUpperCase() : 'U'
}

const formatPoints = (points: number) => {
  if (points >= 10000) {
    return Math.floor(points / 1000) / 10 + 'w'
  } else if (points >= 1000) {
    return Math.floor(points / 100) / 10 + 'k'
  }
  return points.toString()
}

const refreshUserData = async () => {
  // Use async method to get latest user data
  const user = await dataManager.getCurrentUserAsync()
  currentUser.value = user
}

// Watch route change, refresh user data
watch(() => route.path, () => {
  refreshUserData()
})

// Watch local storage change
onMounted(() => {
  refreshUserData()
  
  window.addEventListener('storage', (e) => {
    if (e.key === 'currentUser') {
      refreshUserData()
    }
  })
})
</script>

<style scoped>
/* Safe area adaptation */
.safe-area-inset {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Navigation item basic styles */
.nav-item {
  @apply flex flex-col items-center justify-center;
  @apply px-3 py-1 rounded-lg min-w-[52px];
  @apply transition-all duration-200 ease-out;
  @apply text-gray-500 hover:text-gray-700;
}

.nav-item-active {
  @apply text-gray-800;
}

/* Icon container */
.nav-icon-container {
  @apply relative flex items-center justify-center mb-1;
  @apply w-8 h-8;
}

.nav-icon {
  @apply text-lg transition-colors duration-200;
}

/* Text styles */
.nav-text {
  @apply text-xs font-medium transition-colors duration-200;
}

/* Points badge */
.points-badge {
  @apply absolute -top-1 -right-1;
  @apply bg-red-500 text-white text-xs font-bold;
  @apply rounded-full min-w-[16px] h-[16px];
  @apply flex items-center justify-center;
  @apply shadow-sm;
}

/* User avatar */
.user-avatar {
  @apply relative w-6 h-6 rounded-full overflow-hidden;
}

.avatar-fallback {
  @apply w-full h-full bg-gray-400;
  @apply flex items-center justify-center text-white text-xs font-bold;
  @apply rounded-full;
}

.online-indicator {
  @apply absolute -bottom-0.5 -right-0.5;
  @apply w-2 h-2 bg-green-400 rounded-full;
  @apply border border-gray-50;
}

/* Glassmorphism background */
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

/* Touch feedback */
.nav-item:active {
  @apply transform scale-95;
}

/* Dark mode adaptation */
@media (prefers-color-scheme: dark) {
  .bg-gray-50\/95 {
    background: rgba(31, 41, 55, 0.95);
  }
  
  .border-gray-200\/60 {
    border-color: rgba(75, 85, 99, 0.6);
  }
  
  .nav-item {
    @apply text-gray-400 hover:text-gray-200;
  }
  
  .nav-item-active {
    @apply text-gray-100;
  }
  
  .avatar-fallback {
    @apply bg-gray-600;
  }
  
  .border-gray-50 {
    @apply border-gray-800;
  }
}

/* Reduced motion mode */
@media (prefers-reduced-motion: reduce) {
  .nav-item,
  .nav-icon,
  .nav-text {
    @apply transition-none;
  }
}

/* Small screen optimization */
@media (max-width: 360px) {
  .nav-item {
    @apply min-w-[44px] px-2;
  }
  
  .nav-text {
    @apply text-[10px];
  }
  
  .nav-icon-container {
    @apply w-7 h-7;
  }
  
  .nav-icon {
    @apply text-base;
  }
}
</style>