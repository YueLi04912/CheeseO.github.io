<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
    <!-- Terms Modal -->
    <div 
      v-if="showTermsModal" 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showTermsModal = false"
    >
      <div class="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto shadow-xl">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
            <i class="fas fa-file-contract text-white"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-800">User Service Agreement</h3>
        </div>
        <div class="text-sm text-gray-600 space-y-3 leading-relaxed">
          <div class="bg-blue-50 p-3 rounded-lg">
            <p class="font-medium text-blue-800 mb-1">1. Service Terms</p>
            <p>Welcome to the platform. By using this service, you agree to comply with the following terms and conditions.</p>
          </div>
          <div class="bg-purple-50 p-3 rounded-lg">
            <p class="font-medium text-purple-800 mb-1">2. User Account</p>
            <p>You are responsible for maintaining the accuracy and security of your account information.</p>
          </div>
          <div class="bg-green-50 p-3 rounded-lg">
            <p class="font-medium text-green-800 mb-1">3. Usage Norms</p>
            <p>You agree not to use this service for any illegal, harmful, or inappropriate activities.</p>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button 
            @click="showTermsModal = false"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>

    <!-- Privacy Policy Modal -->
    <div 
      v-if="showPrivacyModal" 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showPrivacyModal = false"
    >
      <div class="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto shadow-xl">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-3">
            <i class="fas fa-shield-alt text-white"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-800">Privacy Policy</h3>
        </div>
        <div class="text-sm text-gray-600 space-y-3 leading-relaxed">
          <div class="bg-emerald-50 p-3 rounded-lg">
            <p class="font-medium text-emerald-800 mb-1">1. Information Collection</p>
            <p>We collect personal information you provide, such as name, email, phone number, etc., to provide better service.</p>
          </div>
          <div class="bg-teal-50 p-3 rounded-lg">
            <p class="font-medium text-teal-800 mb-1">2. Information Usage</p>
            <p>Your personal information is only used for providing services, improving user experience, and necessary communication.</p>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button 
            @click="showPrivacyModal = false"
            class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>

    <!-- Verification Code Modal -->
    <VerificationCodeModal
      :is-visible="showCodeModal"
      :target="currentTarget"
      :target-type="currentTargetType"
      @close="showCodeModal = false"
      @code-generated="handleCodeGenerated"
      ref="codeModalRef"
    />

    <!-- Main Login Card -->
    <div class="w-full max-w-md">
      <!-- Logo and Title -->
      <div class="text-center mb-8">
        <div 
          class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg cursor-pointer transition-transform hover:scale-105"
          @click="handleLogoClick"
          :title="clickCount > 2 ? `Click ${5 - clickCount} more times for emergency restore` : ''"
        >
          <span class="text-2xl">🧀</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p class="text-gray-600">Login to your account</p>
        
        <!-- Emergency Restore Button - Show after clicking logo 5 times consecutively -->
        <div v-if="showEmergencyRestore" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center justify-center mb-2">
            <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
            <span class="text-sm text-red-700 font-medium">Emergency Restore Mode</span>
          </div>
          <button 
            @click="emergencyRestoreAdmin"
            class="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
          >
            🔧 Restore Default Admin Account
          </button>
          <p class="text-xs text-red-600 mt-2">⚠️ Use only when admin account is lost</p>
        </div>
      </div>

      <!-- Login Form Card -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <!-- Error Alert -->
        <div v-if="globalError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
          <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
          <span class="text-sm">{{ globalError }}</span>
        </div>

        <!-- Success Alert -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
          <i class="fas fa-check-circle text-green-500 mr-2"></i>
          <span class="text-sm">{{ successMessage }}</span>
        </div>

        <!-- Restore Success Alert -->
        <div v-if="restoreSuccessMessage" class="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
          <div class="flex items-start">
            <i class="fas fa-info-circle text-blue-500 mt-0.5 mr-2"></i>
            <div class="text-sm">
              <p class="font-medium text-blue-800 mb-1">{{ restoreSuccessMessage }}</p>
              <p class="text-blue-600">Username: admin | Password: admin123</p>
            </div>
          </div>
        </div>

        <!-- Admin Login -->
        <div v-if="isAdminLogin" class="space-y-4">
          <div class="text-center mb-6">
            <div class="inline-flex items-center bg-purple-100 px-4 py-2 rounded-lg">
              <i class="fas fa-crown text-purple-600 mr-2"></i>
              <span class="text-purple-700 font-medium">Admin Login</span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Admin Account</label>
            <div class="relative">
              <input 
                v-model="adminForm.username" 
                type="text" 
                required
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors"
                placeholder="Enter admin username"
              >
              <i class="fas fa-user-shield absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div class="relative">
              <input 
                v-model="adminForm.password" 
                type="password" 
                required
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors"
                placeholder="Enter admin password"
                @keyup.enter="handleAdminLogin"
              >
              <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <button 
            @click="handleAdminLogin"
            :disabled="loading || !adminForm.username || !adminForm.password"
            class="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
            <i v-else class="fas fa-sign-in-alt mr-2"></i>
            {{ loading ? 'Logging in...' : 'Admin Login' }}
          </button>

          <!-- Modified Test Tip -->
          <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-start">
              <i class="fas fa-info-circle text-blue-500 mt-0.5 mr-2"></i>
              <div class="text-sm">
                <p class="font-medium text-blue-800 mb-1">Default Admin Account</p>
                <p class="text-blue-600">Username: admin | Password: admin123</p>
                <p class="text-xs text-blue-500 mt-1">If unable to login, click logo 5 times for recovery options</p>
              </div>
            </div>
          </div>
        </div>

        <!-- User Login -->
        <div v-if="!isAdminLogin">
          <!-- Login Method Selection -->
          <div class="flex justify-center mb-6">
            <div class="inline-flex bg-gray-100 rounded-lg p-1">
              <button 
                @click="activeTab = 'phoneCode'"
                :class="activeTab === 'phoneCode' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'"
                class="px-3 py-2 text-sm font-medium rounded-md transition-all"
              >
                <i class="fas fa-mobile-alt mr-1"></i> Code
              </button>
              <button 
                @click="activeTab = 'phonePwd'"
                :class="activeTab === 'phonePwd' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'"
                class="px-3 py-2 text-sm font-medium rounded-md transition-all"
              >
                <i class="fas fa-key mr-1"></i> Password
              </button>
              <button 
                @click="activeTab = 'email'"
                :class="activeTab === 'email' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'"
                class="px-3 py-2 text-sm font-medium rounded-md transition-all"
              >
                <i class="fas fa-envelope mr-1"></i> Email
              </button>
            </div>
          </div>

          <!-- Phone Code Login -->
          <div v-if="activeTab === 'phoneCode'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div class="relative">
                <input 
                  v-model="phone" 
                  type="tel" 
                  required 
                  maxlength="11"
                  class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                  placeholder="Enter 11-digit phone number"
                  @input="validatePhone"
                >
                <i class="fas fa-mobile-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <p v-if="phoneError" class="mt-1 text-sm text-red-600">{{ phoneError }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
              <div class="flex gap-3">
                <div class="flex-1 relative">
                  <input 
                    v-model="code" 
                    type="text" 
                    required 
                    maxlength="6"
                    class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                    placeholder="Enter 6-digit code"
                  >
                  <i class="fas fa-shield-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                <button 
                  @click="sendCode"
                  :disabled="countdown > 0 || !isPhoneValid"
                  class="px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {{ countdown > 0 ? `${countdown}s` : 'Get Code' }}
                </button>
              </div>
              <p v-if="codeError" class="mt-1 text-sm text-red-600">{{ codeError }}</p>
            </div>

            <button 
              @click="handlePhoneCodeLogin"
              :disabled="!isPhoneValid || !code || !agreeToTerms || loading"
              class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
              <i v-else class="fas fa-sign-in-alt mr-2"></i>
              {{ loading ? 'Logging in...' : 'Login with Code' }}
            </button>
          </div>

          <!-- Phone Password Login -->
          <div v-if="activeTab === 'phonePwd'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div class="relative">
                <input 
                  v-model="phone" 
                  type="tel" 
                  required 
                  maxlength="11"
                  class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors"
                  placeholder="Enter 11-digit phone number"
                  @input="validatePhone"
                >
                <i class="fas fa-mobile-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <p v-if="phoneError" class="mt-1 text-sm text-red-600">{{ phoneError }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div class="relative">
                <input 
                  v-model="password" 
                  type="password" 
                  required 
                  class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors"
                  placeholder="Enter password"
                  @input="validatePassword"
                  @keyup.enter="handlePhonePwdLogin"
                >
                <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
            </div>

            <div class="flex items-center justify-between">
              <div class="text-sm">
                <a href="#" @click.prevent="goToForgotPassword" class="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                  Forgot Password?
                </a>
              </div>
            </div>

            <button 
              @click="handlePhonePwdLogin"
              :disabled="!isPhoneValid || !isPasswordValid || !agreeToTerms || loading"
              class="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
              <i v-else class="fas fa-sign-in-alt mr-2"></i>
              {{ loading ? 'Logging in...' : 'Login with Password' }}
            </button>
          </div>

          <!-- Email Login -->
          <div v-if="activeTab === 'email'" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div class="relative">
                <input 
                  v-model="email" 
                  type="email" 
                  required 
                  class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors"
                  placeholder="Enter email address"
                  @input="validateEmail"
                >
                <i class="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div class="relative">
                <input 
                  v-model="emailPassword" 
                  type="password" 
                  required 
                  class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors"
                  placeholder="Enter password"
                  @keyup.enter="handleEmailLogin"
                >
                <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <p v-if="emailPasswordError" class="mt-1 text-sm text-red-600">{{ emailPasswordError }}</p>
            </div>

            <div class="flex items-center justify-between">
              <div class="text-sm">
                <a href="#" @click.prevent="goToForgotPassword" class="font-medium text-green-600 hover:text-green-500 transition-colors">
                  Forgot Password?
                </a>
              </div>
            </div>

            <button 
              @click="handleEmailLogin"
              :disabled="!isEmailValid || !emailPassword || !agreeToTerms || loading"
              class="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
              <i v-else class="fas fa-sign-in-alt mr-2"></i>
              {{ loading ? 'Logging in...' : 'Login with Email' }}
            </button>
          </div>

          <!-- Login Agreement -->
          <div class="mt-6">
            <div class="flex items-start space-x-3">
              <input 
                id="agree-terms" 
                v-model="agreeToTerms"
                type="checkbox" 
                class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="agree-terms" class="text-sm text-gray-700">
                I have read and agree to
                <a href="#" @click.prevent="showTermsModal = true" class="text-blue-600 hover:text-blue-500 underline">
                  Terms of Service
                </a>
                and
                <a href="#" @click.prevent="showPrivacyModal = true" class="text-green-600 hover:text-green-500 underline">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Switch Button and Register Link -->
      <div class="space-y-4">
        <!-- Admin Login Switch -->
        <div class="text-center">
          <button 
            @click="isAdminLogin = !isAdminLogin"
            class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200"
          >
            <i :class="isAdminLogin ? 'fas fa-user' : 'fas fa-crown'" class="mr-2"></i>
            {{ isAdminLogin ? 'Switch to User Login' : 'Admin Login' }}
          </button>
        </div>

        <!-- Register Link -->
        <div v-if="!isAdminLogin" class="text-center">
          <span class="text-gray-600">Don't have an account? </span>
          <a href="#" @click.prevent="goToRegister" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Register Now
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { SimpleDataManager } from '@/utils/simpleDataManager'
import VerificationCodeModal from '@/components/VerificationCodeModal.vue'

const router = useRouter()
const dataManager = SimpleDataManager.getInstance()

// State management
const loading = ref(false)
const globalError = ref('')
const successMessage = ref('')

// Agreement related
const agreeToTerms = ref(false)
const showTermsModal = ref(false)
const showPrivacyModal = ref(false)

// Verification code modal related
const showCodeModal = ref(false)
const currentTarget = ref('')
const currentTargetType = ref<'phone' | 'email'>('phone')
const codeModalRef = ref()

// Login type switch
const isAdminLogin = ref(false)
const activeTab = ref<'phoneCode' | 'phonePwd' | 'email'>('phoneCode')

// Admin login data
const adminForm = ref({
  username: '',
  password: ''
})

// User login data
const phone = ref('')
const phoneError = ref('')
const isPhoneValid = ref(false)

const code = ref('')
const codeError = ref('')
const countdown = ref(0)

const password = ref('')
const passwordError = ref('')
const isPasswordValid = ref(false)

const email = ref('')
const emailError = ref('')
const isEmailValid = ref(false)

const emailPassword = ref('')
const emailPasswordError = ref('')

// New: Emergency restore related variables
const showEmergencyRestore = ref(false)
const restoreSuccessMessage = ref('')
const clickCount = ref(0)
let clickTimer: ReturnType<typeof setTimeout> | null = null

// Clear error messages
const clearErrors = () => {
  globalError.value = ''
  phoneError.value = ''
  codeError.value = ''
  passwordError.value = ''
  emailError.value = ''
  emailPasswordError.value = ''
}

// Added: Handle logo click
const handleLogoClick = () => {
  clickCount.value++
  
  // Clear previous timer
  if (clickTimer) {
    clearTimeout(clickTimer)
  }
  
  // Set new timer, reset click count after 3 seconds
  clickTimer = setTimeout(() => {
    clickCount.value = 0
  }, 3000)
  
  // Show emergency restore after 5 consecutive clicks
  if (clickCount.value >= 5) {
    showEmergencyRestore.value = true
    clickCount.value = 0
    
    // Auto hide emergency restore button (after 30 seconds)
    setTimeout(() => {
      showEmergencyRestore.value = false
    }, 30000)
    
    console.log('🔧 Emergency restore mode activated!')
  }
}

// Added: Emergency restore admin account
const emergencyRestoreAdmin = async () => {
  try {
    // Show confirmation dialog
    const confirmed = confirm(
      '⚠️ Are you sure you want to restore the default admin account?\n\n' +
      'This will create or restore the following admin account:\n' +
      '• Username: admin\n' +
      '• Password: admin123\n' +
      '• Nickname: System Admin\n\n' +
      'Click "OK" to continue, "Cancel" to abort.'
    )
    
    if (!confirmed) {
      return
    }
    
    loading.value = true
    clearErrors()
    
    // Call restore method
    const restoredAdmin = await dataManager.restoreDefaultAdminAsync()
    
    if (restoredAdmin) {
      restoreSuccessMessage.value = '🎉 Admin account restored successfully!'
      showEmergencyRestore.value = false
      
      // Auto switch to admin login mode
      isAdminLogin.value = true
      
      // Prefill admin info
      adminForm.value.username = 'admin'
      adminForm.value.password = 'admin123'
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        restoreSuccessMessage.value = ''
      }, 5000)
      
      console.log('✅ Admin account restored successfully:', restoredAdmin)
      
    } else {
      globalError.value = 'Failed to restore admin account, please contact support'
    }
    
  } catch (error: any) {
    console.error('❌ Error restoring admin account:', error)
    globalError.value = 'Error during restoration: ' + (error.message || 'Unknown error')
  } finally {
    loading.value = false
  }
}

// Validate phone number
const validatePhone = () => {
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phone.value) {
    phoneError.value = 'Please enter phone number'
    isPhoneValid.value = false
  } else if (!phoneRegex.test(phone.value)) {
    phoneError.value = 'Please enter a valid 11-digit phone number'
    isPhoneValid.value = false
  } else {
    phoneError.value = ''
    isPhoneValid.value = true
  }
}

// Validate password
const validatePassword = () => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,16}$/
  if (!password.value) {
    passwordError.value = 'Please enter password'
    isPasswordValid.value = false
  } else if (!passwordRegex.test(password.value)) {
    passwordError.value = 'Password must be 6-16 characters, including letters and numbers'
    isPasswordValid.value = false
  } else {
    passwordError.value = ''
    isPasswordValid.value = true
  }
}

// Validate email
const validateEmail = () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!email.value.trim()) {
    emailError.value = 'Email cannot be empty'
    isEmailValid.value = false
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Please enter a valid email address'
    isEmailValid.value = false
  } else {
    emailError.value = ''
    isEmailValid.value = true
  }
}

// Send verification code - Show modal
const sendCode = () => {
  if (!isPhoneValid.value) return
  
  clearErrors()
  
  // Set current target and type
  currentTarget.value = phone.value
  currentTargetType.value = 'phone'
  
  // Show verification code modal
  showCodeModal.value = true
  
  // Start countdown (prevent frequent clicks)
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// Handle verification code generation
const handleCodeGenerated = (code: string) => {
  console.log('New code generated:', code)
}

// Verify input code
const verifyInputCode = (inputCode: string): boolean => {
  if (!codeModalRef.value) return false
  return codeModalRef.value.validateCode(inputCode)
}

// Phone verification code login
const handlePhoneCodeLogin = async () => {
  if (!isPhoneValid.value || !code.value) return
  
  if (!agreeToTerms.value) {
    globalError.value = 'Please read and agree to the Terms of Service and Privacy Policy'
    return
  }
  
  loading.value = true
  clearErrors()
  
  try {
    if (!verifyInputCode(code.value)) {
      codeError.value = 'Invalid or expired verification code, please retry'
      return
    }
    
    let user = await dataManager.getUserByPhoneAsync(phone.value)
    
    if (!user) {
      user = await dataManager.createUserAsync({
        username: `user_${phone.value.slice(-4)}`,
        password: 'temp123',
        phone: phone.value,
        role: 'user',
        registerType: 'phone',
        isVerified: true,
        nickname: `User${phone.value.slice(-4)}`
      })
    } else if (user.status === 'banned') {
      globalError.value = 'Account banned, cannot login'
      return
    } else if (user.status === 'inactive') {
      globalError.value = 'Account inactive, contact admin'
      return
    }
    
    dataManager.setCurrentUser(user)
    
    successMessage.value = 'Login successful!'
    setTimeout(() => {
      router.push('/')
    }, 1000)
    
  } catch (error: any) {
    globalError.value = 'Login failed, please try again later'
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Phone password login
const handlePhonePwdLogin = async () => {
  if (!isPhoneValid.value || !isPasswordValid.value) return
  
  if (!agreeToTerms.value) {
    globalError.value = 'Please read and agree to the Terms of Service and Privacy Policy'
    return
  }
  
  loading.value = true
  clearErrors()
  
  try {
    const user = await dataManager.validateLoginAsync(phone.value, password.value)
    
    if (!user) {
      phoneError.value = 'Incorrect phone number or password'
      return
    }
    
    dataManager.setCurrentUser(user)
    
    successMessage.value = 'Login successful!'
    setTimeout(() => {
      if (user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/')
      }
    }, 1000)
    
  } catch (error: any) {
    globalError.value = 'Login failed, please try again later'
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Email login
const handleEmailLogin = async () => {
  if (!isEmailValid.value || !emailPassword.value) return
  
  if (!agreeToTerms.value) {
    globalError.value = 'Please read and agree to the Terms of Service and Privacy Policy'
    return
  }
  
  loading.value = true
  clearErrors()
  
  try {
    const user = await dataManager.validateLoginAsync(email.value, emailPassword.value)
    
    if (!user) {
      emailError.value = 'Incorrect email or password'
      return
    }
    
    dataManager.setCurrentUser(user)
    
    successMessage.value = 'Login successful!'
    setTimeout(() => {
      if (user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/')
      }
    }, 1000)
    
  } catch (error: any) {
    globalError.value = 'Login failed, please try again later'
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Admin login
const handleAdminLogin = async () => {
  if (!adminForm.value.username || !adminForm.value.password) return
  
  loading.value = true
  clearErrors()
  
  try {
    const admin = await dataManager.validateLoginAsync(adminForm.value.username, adminForm.value.password)
    
    if (!admin || admin.role !== 'admin') {
      globalError.value = 'Admin account or password error'
      return
    }
    
    dataManager.setCurrentUser(admin)
    
    successMessage.value = 'Admin login successful!'
    setTimeout(() => {
      router.push('/admin/dashboard')
    }, 1000)
    
  } catch (error) {
    globalError.value = 'Login failed, please try again later'
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Go to register
const goToRegister = () => {
  router.push('/login/Register')
}

// Go to forgot password
const goToForgotPassword = () => {
  router.push('/login/Forget-Password')
}

// Check if redirected from password reset page
const checkResetSuccess = () => {
  const route = router.currentRoute.value
  if (route.query.resetSuccess === 'true') {
    successMessage.value = 'Password reset successful! Please login with new password'
    
    if (route.query.phone) {
      phone.value = route.query.phone as string
      validatePhone()
      activeTab.value = 'phonePwd'
    }
    
    router.replace('/Login')
    
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  }
}

// Watch login method change
watch(activeTab, () => {
  clearErrors()
})

// Check reset status when component mounted
onMounted(() => {
  checkResetSuccess()
  
  // Add keyboard shortcut support (optional)
  const handleKeyDown = (event: KeyboardEvent) => {
    // Ctrl + Alt + R quickly show restore options
    if (event.ctrlKey && event.altKey && event.key === 'r') {
      event.preventDefault()
      showEmergencyRestore.value = !showEmergencyRestore.value
      console.log('🔧 Emergency restore mode activated by shortcut!')
    }
  }
  
  window.addEventListener('keydown', handleKeyDown)
  
  // Remove event listener when component unmounted
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    if (clickTimer) {
      clearTimeout(clickTimer)
    }
  })
})
</script>

<style scoped>
/* 自定义动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* 输入框聚焦效果 */
input:focus {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* 按钮悬浮效果 */
button:hover:not(:disabled) {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* 新增：logo点击效果 */
.cursor-pointer:active {
  transform: scale(0.95);
}

/* 新增：恢复按钮动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
}

/* 移动端优化 */
@media (max-width: 640px) {
  .max-w-md {
    max-width: calc(100vw - 2rem);
  }
  
  .p-6 {
    padding: 1.5rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .w-16.h-16 {
    width: 3.5rem;
    height: 3.5rem;
  }
  
  .text-2xl span {
    font-size: 1.5rem;
  }
  
  input {
    font-size: 16px; /* 防止iOS缩放 */
  }
  
  .px-4 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  
  .inline-flex {
    flex-wrap: wrap;
    gap: 0.25rem;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .bg-gradient-to-br.from-gray-50.to-blue-50 {
    background: linear-gradient(to bottom right, #1f2937, #374151);
  }
  
  .bg-white {
    background-color: #1f2937;
    color: #f9fafb;
  }
  
  .text-gray-800 {
    color: #f9fafb;
  }
  
  .text-gray-600 {
    color: #d1d5db;
  }
  
  .text-gray-700 {
    color: #e5e7eb;
  }
  
  .border-gray-300 {
    border-color: #4b5563;
  }
  
  .bg-gray-100 {
    background-color: #374151;
  }
  
  input {
    background-color: #374151;
    color: #f9fafb;
  }
  
  input::placeholder {
    color: #9ca3af;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .animate-spin {
    animation: none;
  }
  
  button:hover:not(:disabled),
  input:focus {
    transform: none;
    transition: none;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .text-gray-600,
  .text-gray-700 {
    color: #000000;
  }
  
  .border-gray-300 {
    border-color: #000000;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  button:hover:not(:disabled) {
    transform: none;
  }
  
  button:active:not(:disabled) {
    transform: scale(0.98);
  }
}

/* 键盘导航优化 */
button:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}

/* 表单验证状态 */
.input-valid {
  border-color: #10b981 !important;
  box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.3);
}

.input-invalid {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.3);
}

/* 禁用状态样式 */
.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

/* 响应式文字大小 */
@media (max-width: 480px) {
  .text-lg {
    font-size: 1rem;
  }
  
  .text-sm {
    font-size: 0.8rem;
  }
  
  .py-3 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
  
  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .space-y-4 > * + * {
    margin-top: 0.75rem;
  }
}

/* 提升可访问性 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 高分辨率屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
}
</style>