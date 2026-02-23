<template>
    <div class="min-h-screen bg-gradient-to-b from-purple-50 to-blue-100 flex items-center justify-center px-4">
    <div class="text-center">
      <!-- 404 Animation Icon -->
      <div class="mb-8">
        <div class="relative">
          <div class="text-8xl font-bold text-purple-200 animate-pulse">404</div>
          <div class="absolute inset-0 flex items-center justify-center">
            <i class="fas fa-search text-4xl text-purple-400 animate-bounce"></i>
          </div>
        </div>
      </div>
      
      <!-- Error Message -->
      <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
      <p class="text-gray-600 mb-8 max-w-md mx-auto">
        Sorry, the page you are looking for does not exist or has been removed.
        <br>
        Let's help you find your way back!
      </p>
      
      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          @click="goHome"
          class="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105"
        >
          <i class="fas fa-home mr-2"></i>
          Back to Home
        </button>
        <button 
          @click="goBack"
          class="px-6 py-3 border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          Go Back
        </button>
      </div>
      
      <!-- Recommended Links -->
      <div class="mt-12">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">You might be interested in:</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <router-link 
            to="/"
            class="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-purple-200"
          >
            <i class="fas fa-newspaper text-purple-500 text-2xl mb-2"></i>
            <div class="font-medium text-gray-800">Latest Articles</div>
            <div class="text-sm text-gray-500">Browse latest content</div>
          </router-link>
          
          <router-link 
            to="/about"
            class="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-purple-200"
          >
            <i class="fas fa-user text-purple-500 text-2xl mb-2"></i>
            <div class="font-medium text-gray-800">Profile</div>
            <div class="text-sm text-gray-500">View your profile</div>
          </router-link>
          
          <router-link 
            to="/post"
            class="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-purple-200"
          >
            <i class="fas fa-edit text-purple-500 text-2xl mb-2"></i>
            <div class="font-medium text-gray-800">Post Content</div>
            <div class="text-sm text-gray-500">Create new article</div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound',
    methods: {
      goHome() {
        this.$router.push('/')
      },
      goBack() {
        if (window.history.length > 1) {
          this.$router.go(-1)
        } else {
          this.$router.push('/')
        }
      }
    }
  }
  </script>
  
  <style scoped>
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .animate-pulse {
    animation: pulse 2s infinite;
  }
  
  .animate-bounce {
    animation: bounce 2s infinite;
  }
  </style>