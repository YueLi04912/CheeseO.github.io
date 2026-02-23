<!-- src/components/AdminReturnButton.vue -->
<template>
    <!-- Admin Return Button (Only displayed when not in admin pages and user is admin) -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 transform translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform translate-y-2"
    >
      <div
        v-if="shouldShowButton"
        class="fixed top-20 right-4 z-40"
      >
        <!-- Desktop Button -->
        <button
          @click="returnToAdmin"
          class="hidden md:flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
          title="Return to Admin Dashboard"
        >
          <i class="fas fa-arrow-left"></i>
          <span class="font-medium">Back to Admin</span>
        </button>
        
        <!-- Mobile Button -->
        <button
          @click="returnToAdmin"
          class="md:hidden w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105"
          title="Return to Admin Dashboard"
        >
          <i class="fas fa-cog text-lg"></i>
        </button>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { computed, ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { SimpleDataManager } from '@/utils/simpleDataManager'
  
  const route = useRoute()
  const router = useRouter()
  const dataManager = SimpleDataManager.getInstance()

  const currentUser = ref(dataManager.getCurrentUser())

  // Async refresh user role
  onMounted(async () => {
    const user = await dataManager.getCurrentUserAsync()
    if (user) {
        currentUser.value = user
    }
  })
  
  // Check if return button should be shown
  const shouldShowButton = computed(() => {
    // Must be admin
    if (!currentUser.value || currentUser.value.role !== 'admin') {
      return false
    }
    
    // Not in admin pages
    if (route.path.startsWith('/admin')) {
      return false
    }
    
    // Not in login page
    if (route.path.startsWith('/login')) {
      return false
    }
    
    // Check if coming from admin (via sessionStorage)
    const fromAdmin = sessionStorage.getItem('fromAdmin') === 'true'
    
    return fromAdmin
  })
  
  // Return to admin dashboard
  const returnToAdmin = () => {
    // Clear flag
    sessionStorage.removeItem('fromAdmin')
    
    // Return to admin dashboard
    router.push('/admin/dashboard')
  }
  
  // Watch route changes, manage fromAdmin flag
  const handleRouteChange = () => {
    // If navigating from admin to user side, set flag
    if (route.path.startsWith('/admin')) {
      sessionStorage.removeItem('fromAdmin')
    }
  }
  
  // Initialize
  handleRouteChange()
  </script>