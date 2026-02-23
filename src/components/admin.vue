<script setup lang="ts">
import { ref } from 'vue';
import { useWindowSize } from '../utils/responsive';

const { width } = useWindowSize();

// Control mobile sidebar visibility
const isMobileSidebarOpen = ref(false);

// Toggle sidebar visibility
const toggleSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
};

// Close sidebar (after clicking menu item)
const closeSidebar = () => {
  if (width.value < 768) { // Only close on mobile
    isMobileSidebarOpen.value = false;
  }
};

// Currently active menu item

</script>

<template>
  <div>
    <!-- Mobile Top Navbar -->
    <div class="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#1A1B1E]/90 backdrop-blur-sm z-50 border-b border-gray-800 px-4 flex items-center justify-between">
      <div class="text-[#00B0FF] text-xl font-bold">CheeseO Admin</div>
      <button @click="toggleSidebar" class="text-white focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path v-if="!isMobileSidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="isMobileSidebarOpen" 
      @click="toggleSidebar" 
      class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
    ></div>

    <!-- Sidebar Navigation - Fixed on Desktop, Conditional on Mobile -->
    <nav 
      :class="[
        'fixed top-0 h-full bg-[#1A1B1E]/90 backdrop-blur-sm z-50 border-r border-gray-800 transition-all duration-300 ease-in-out',
        width < 768 ? (isMobileSidebarOpen ? 'left-0' : '-left-64') : 'left-0',
        'md:w-64 w-64'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Logo Area - Desktop Only -->
        <div class="px-6 py-5 border-b border-gray-800 hidden md:block">
          <h1 class="text-[#00B0FF] text-xl font-bold">CheeseO Admin</h1>
        </div>
        
        <!-- Top Spacer for Mobile -->
        <div class="h-16 md:hidden"></div>
        
        <!-- Navigation Menu -->
        <div class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <router-link 
            to="/admin/Dashboard" 
            @click="closeSidebar"
            class="flex items-center px-4 py-3 rounded-lg text-white hover:bg-gray-800 hover:text-[#00B0FF] transition-colors group"
            active-class="bg-gray-800 text-[#00B0FF]"
          >
            <i class="fas fa-tachometer-alt mr-3 text-gray-400 group-hover:text-[#00B0FF] group-[.router-link-active]:text-[#00B0FF]"></i>
            <span>Dashboard</span>
          </router-link>
          
          <router-link 
            to="/admin/Content" 
            @click="closeSidebar"
            class="flex items-center px-4 py-3 rounded-lg text-white hover:bg-gray-800 hover:text-[#00B0FF] transition-colors group"
            active-class="bg-gray-800 text-[#00B0FF]"
          >
            <i class="fas fa-check-circle mr-3 text-gray-400 group-hover:text-[#00B0FF] group-[.router-link-active]:text-[#00B0FF]"></i>
            <span>Content Review</span>
          </router-link>
          
          <router-link 
            to="/admin/Category" 
            @click="closeSidebar"
            class="flex items-center px-4 py-3 rounded-lg text-white hover:bg-gray-800 hover:text-[#00B0FF] transition-colors group"
            active-class="bg-gray-800 text-[#00B0FF]"
          >
            <i class="fas fa-folder mr-3 text-gray-400 group-hover:text-[#00B0FF] group-[.router-link-active]:text-[#00B0FF]"></i>
            <span>Category Mgmt</span>
          </router-link>
          
          <router-link 
            to="/admin/User" 
            @click="closeSidebar"
            class="flex items-center px-4 py-3 rounded-lg text-white hover:bg-gray-800 hover:text-[#00B0FF] transition-colors group"
            active-class="bg-gray-800 text-[#00B0FF]"
          >
            <i class="fas fa-users mr-3 text-gray-400 group-hover:text-[#00B0FF] group-[.router-link-active]:text-[#00B0FF]"></i>
            <span>User Mgmt</span>
          </router-link>
          
          <router-link 
            to="/admin/Points" 
            @click="closeSidebar"
            class="flex items-center px-4 py-3 rounded-lg text-white hover:bg-gray-800 hover:text-[#00B0FF] transition-colors group"
            active-class="bg-gray-800 text-[#00B0FF]"
          >
            <i class="fas fa-coins mr-3 text-gray-400 group-hover:text-[#00B0FF] group-[.router-link-active]:text-[#00B0FF]"></i>
            <span>Points Mgmt</span>
          </router-link>
 

          <router-link 
            to="/admin/coursepost" 
            @click="closeSidebar"
            class="flex items-center px-4 py-3 rounded-lg text-white hover:bg-gray-800 hover:text-[#00B0FF] transition-colors group"
            active-class="bg-gray-800 text-[#00B0FF]"
          >
            <i class="fas fa-box-open mr-3 text-gray-400 group-hover:text-[#00B0FF] group-[.router-link-active]:text-[#00B0FF]"></i>
            <span>Publish Content</span>
          </router-link>
        </div>
        
        <!-- Bottom Back to Home Button -->
        <div class="px-4 py-4 border-t border-gray-800">
          <router-link 
            to="/" 
            @click="closeSidebar">
          <button 
            class="w-full flex items-center px-4 py-3 rounded-lg text-white hover:bg-gray-800 hover:text-red-500 transition-colors"
          >
            <i class="fas fa-sign-out-alt mr-3 text-gray-400 hover:text-red-500"></i>
            <span>Back to Home</span>
            
          </button>
        </router-link>
        </div>
      </div>
    </nav>

    <!-- Top Spacer for Fixed Navbar -->
    <div class="h-16 md:hidden"></div>
  </div>
</template>
