<template>
    <!-- Verification Code Modal -->
    <div 
      v-if="isVisible" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4 transform transition-all duration-300 scale-100">
        <!-- Title -->
        <div class="text-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Verification code sent</h3>
          <p class="text-sm text-gray-600 mt-1">
            Verification code sent to {{ formatTarget(target) }}
          </p>
        </div>
        
        <!-- Verification Code Display Area -->
        <div class="bg-gray-50 rounded-lg p-4 mb-4 text-center">
          <div class="text-sm text-gray-500 mb-2">Your verification code is:</div>
          <div class="text-2xl font-mono font-bold text-blue-600 tracking-widest select-text">
            {{ verificationCode }}
          </div>
          <div class="text-xs text-gray-400 mt-2">
            Valid for: {{ formatTime(remainingTime) }}
          </div>
          
          <!-- Refresh Button -->
          <button 
            @click="refreshCode"
            :disabled="refreshCooldown > 0"
            class="mt-3 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors"
          >
            {{ refreshCooldown > 0 ? `${refreshCooldown}s cooldown` : '🔄 Refresh Code' }}
          </button>
        </div>
        
        <!-- Hint Message -->
        <div class="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-blue-800">
                Please enter this code in the verification field.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <button 
            @click="copyCode"
            class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            📋 Copy Code
          </button>
          <button 
            @click="closeModal"
            class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors text-sm font-medium"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  
  // Props
  interface Props {
    isVisible: boolean
    target: string  // Phone or Email
    targetType: 'phone' | 'email'
  }
  
  const props = defineProps<Props>()
  
  // Emits
  const emit = defineEmits<{
    close: []
    codeGenerated: [code: string]
  }>()
  
  // State
  const verificationCode = ref('')
  const remainingTime = ref(300) // 5 minutes validity
  const refreshCooldown = ref(0) // Refresh cooldown
  let countdownTimer: number | null = null
  let refreshTimer: number | null = null
  
  // Generate 6-digit random code
  const generateCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
  
  // Format target (phone/email)
  const formatTarget = (target: string): string => {
    if (props.targetType === 'phone') {
      return target.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    } else {
      const [name, domain] = target.split('@')
      if (name.length <= 2) return target
      return `${name.slice(0, 2)}***@${domain}`
    }
  }
  
  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Initialize verification code
  const initCode = () => {
    verificationCode.value = generateCode()
    remainingTime.value = 300
    emit('codeGenerated', verificationCode.value)
    
    // Start countdown
    startCountdown()
  }
  
  // Refresh verification code
  const refreshCode = () => {
    if (refreshCooldown.value > 0) return
    
    verificationCode.value = generateCode()
    remainingTime.value = 300
    refreshCooldown.value = 60 // 60 seconds refresh cooldown
    
    emit('codeGenerated', verificationCode.value)
    
    // Restart countdown
    startCountdown()
    startRefreshCooldown()
  }
  
  // Start verification code countdown
  const startCountdown = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer)
    }
    
    countdownTimer = setInterval(() => {
      remainingTime.value--
      if (remainingTime.value <= 0) {
        clearInterval(countdownTimer!)
        countdownTimer = null
        // Code expired, auto refresh
        refreshCode()
      }
    }, 1000)
  }
  
  // Start refresh cooldown countdown
  const startRefreshCooldown = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
    }
    
    refreshTimer = setInterval(() => {
      refreshCooldown.value--
      if (refreshCooldown.value <= 0) {
        clearInterval(refreshTimer!)
        refreshTimer = null
      }
    }, 1000)
  }
  
  // Copy verification code
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(verificationCode.value)
      console.log('Verification code copied to clipboard')
    } catch (err) {
      // Fallback solution
      const textArea = document.createElement('textarea')
      textArea.value = verificationCode.value
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      console.log('Verification code copied to clipboard')
    }
  }
  
  // Close modal
  const closeModal = () => {
    emit('close')
  }
  
  // Listen for ESC key to close modal
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal()
    }
  }
  
  // Initialize on mount
  onMounted(() => {
    document.addEventListener('keydown', handleKeyPress)
  })
  
  // Cleanup timers on unmount
  onUnmounted(() => {
    if (countdownTimer) {
      clearInterval(countdownTimer)
    }
    if (refreshTimer) {
      clearInterval(refreshTimer)
    }
    document.removeEventListener('keydown', handleKeyPress)
  })
  
  // Watch visibility status
  watch(() => props.isVisible, (newVal) => {
    if (newVal) {
      initCode()
    } else {
      // Cleanup timers on close
      if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
      if (refreshTimer) {
        clearInterval(refreshTimer)
        refreshTimer = null
      }
    }
  })
  
  // Expose validation method to parent
  defineExpose({
    validateCode: (inputCode: string) => {
      return inputCode === verificationCode.value && remainingTime.value > 0
    },
    getCurrentCode: () => verificationCode.value,
    getRemainingTime: () => remainingTime.value
  })
  </script>
  
  <style scoped>
  /* Modal animation */
  .fixed {
    animation: fadeIn 0.3s ease-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .transform {
    animation: slideUp 0.3s ease-out;
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  /* Verification code number style */
  .font-mono {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }
  </style>