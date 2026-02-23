import { ref, onMounted, onUnmounted } from 'vue'

// Responsive breakpoints (consistent with tailwind)
export const breakpoints = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

// Use Composition API to get responsive window width
export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)

  function update() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  onMounted(() => window.addEventListener('resize', update))
  onUnmounted(() => window.removeEventListener('resize', update))

  return { width, height }
}

// Check if it is a mobile device
export function useIsMobile() {
  const { width } = useWindowSize()
  
  return {
    isMobile: () => width.value < breakpoints.md,
    isTablet: () => width.value >= breakpoints.md && width.value < breakpoints.lg,
    isDesktop: () => width.value >= breakpoints.lg
  }
}

// Get current device type
export function useDeviceType() {
  const { width } = useWindowSize()
  const deviceType = ref('mobile') // Default to mobile

  // Listen and update device type
  const updateDeviceType = () => {
    if (width.value < breakpoints.md) {
      deviceType.value = 'mobile'
    } else if (width.value < breakpoints.lg) {
      deviceType.value = 'tablet'
    } else {
      deviceType.value = 'desktop'
    }
  }

  updateDeviceType() // Initialize

  onMounted(() => window.addEventListener('resize', updateDeviceType))
  onUnmounted(() => window.removeEventListener('resize', updateDeviceType))

  return { deviceType }
} 