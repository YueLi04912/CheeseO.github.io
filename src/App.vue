<!-- src/App.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import AdminSidebar from './components/admin.vue'
import BottomNavigation from './components/BottomNavigation.vue'
import AdminReturnButton from './components/AdminReturnButton.vue'

const route = useRoute()

// Check route type
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isLoginRoute = computed(() => route.path.startsWith('/login'))
</script>

<template>
  <div class="font-Inter bg-gray-50 min-h-screen">
    <!-- Navbar component -->
    <template v-if="!isLoginRoute">
      <Navbar v-if="!isAdminRoute" />
      <AdminSidebar v-else />
    </template>
    
    <!-- Main content area -->
    <main :class="[
      'transition-all duration-300',
      { 
        'lg:ml-64': isAdminRoute && !isLoginRoute, // Sidebar for admin on desktop
        'pt-4': isAdminRoute, // Top padding for admin
        'pb-20 md:pb-6': !isLoginRoute && !isAdminRoute, // Space for bottom nav on user side
        'px-4 md:px-6 lg:px-8': !isLoginRoute // No side padding for login page
      }
    ]">
      <router-view></router-view>
    </main>
    
    <!-- Mobile bottom navigation (User side only) -->
    <BottomNavigation v-if="!isLoginRoute && !isAdminRoute" />
    
    <!-- Admin return button -->
    <AdminReturnButton />
  </div>
</template>

<style>
/* Sidebar transition effect */
main {
  transition: margin-left 0.3s ease, margin-top 0.3s ease, padding-bottom 0.3s ease;
}

/* Global responsive settings */
@media (max-width: 768px) {
  html {
    font-size: 14px; /* Slightly smaller font for mobile */
  }
  
  /* Extra top padding for admin pages on mobile */
  .admin-page {
    padding-top: 1rem;
  }
  
  /* Ensure content is not covered by bottom nav */
  .mobile-content {
    padding-bottom: 6rem;
  }
}

/* Ensure media content adapts to container width */
img, video, iframe {
  max-width: 100%;
  height: auto;
}

/* Safe area adaptation for bottom nav */
@supports (padding: env(safe-area-inset-bottom)) {
  .bottom-nav-safe {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }
}

/* Optimize mobile scrolling */
@media (max-width: 767px) {
  body {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
  
  /* Minimum touch area for mobile buttons */
  button, a, [role="button"] {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Optimize mobile inputs */
  input, textarea, select {
    font-size: 16px; /* Prevent iOS auto-zoom */
  }
}

/* Page transition animation */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Bottom navigation shadow optimization */
.bottom-nav-shadow {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

/* Global scrollbar optimization */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #0ea5e9, #d946ef);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #0284c7, #c026d3);
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: #0ea5e9 #f1f5f9;
}

/* Disable text selection highlight */
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Mobile safe area support */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-left {
  padding-left: env(safe-area-inset-left);
}

.safe-area-right {
  padding-right: env(safe-area-inset-right);
}

/* Enhanced touch feedback */
@media (hover: none) and (pointer: coarse) {
  button:active,
  a:active,
  [role="button"]:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-gray-50 {
    background-color: #ffffff;
  }
  
  .text-gray-600 {
    color: #000000;
  }
  
  .border-gray-200 {
    border-color: #000000;
  }
}

/* Reduced motion preference support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Dark mode basic support */
@media (prefers-color-scheme: dark) {
  .bg-gray-50 {
    background-color: #0f172a;
    color: #e2e8f0;
  }
}

/* Print style optimization */
@media print {
  .fixed,
  .sticky,
  nav,
  .bottom-navigation,
  .admin-return-button {
    display: none !important;
  }
  
  main {
    margin: 0 !important;
    padding: 0 !important;
  }
  
  * {
    background: white !important;
    color: black !important;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: no-preference) {
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  
  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Focus indicator enhancement */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Skip link (Accessibility) */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #3b82f6;
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 9999;
}

.skip-link:focus {
  top: 6px;
}

/* Mobile landscape optimization */
@media (max-height: 500px) and (orientation: landscape) {
  .bottom-navigation {
    height: 50px;
  }
  
  main {
    padding-bottom: 4rem;
  }
}

/* Large screen optimization */
@media (min-width: 1920px) {
  .container {
    max-width: 1400px;
    margin: 0 auto;
  }
}

/* Extra small screen optimization */
@media (max-width: 320px) {
  html {
    font-size: 12px;
  }
  
  .px-4 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}

/* Tablet landscape optimization */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .lg\:ml-64 {
    margin-left: 16rem;
  }
}

/* Performance optimization - Compositing layer */
.will-change {
  will-change: transform, opacity;
}

.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
}

/* Content protection */
.content-protected {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Image loading optimization */
img {
  loading: lazy;
}

img[data-src] {
  filter: blur(5px);
  transition: filter 0.3s;
}

img[data-loaded="true"] {
  filter: blur(0px);
}
</style>