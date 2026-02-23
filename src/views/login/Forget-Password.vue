<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <!-- Verification Code Modal Component -->
    <VerificationCodeModal
      :is-visible="showCodeModal"
      :target="currentTarget"
      :target-type="currentTargetType"
      @close="showCodeModal = false"
      @code-generated="handleCodeGenerated"
      ref="codeModalRef"
    />

    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Forgot Password
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Enter your phone number to reset password
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <!-- Error Alert -->
        <div v-if="globalError" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ globalError }}
        </div>

        <!-- Success Alert -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ successMessage }}
        </div>

        <div class="space-y-6">
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input 
                v-model="phone" 
                id="phone" 
                type="tel" 
                required 
                maxlength="11"
                pattern="[0-9]*"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter 11-digit phone number"
                @input="validatePhone"
              >
            </div>
            <p v-if="phoneError" class="mt-1 text-sm text-red-600">{{ phoneError }}</p>
          </div>

          <div>
            <label for="code" class="block text-sm font-medium text-gray-700">Verification Code</label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <input 
                v-model="code" 
                id="code" 
                type="text" 
                required 
                maxlength="6"
                pattern="[0-9]*"
                class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter 6-digit code"
              >
              <button 
                @click="sendCode"
                :disabled="countdown > 0 || !isPhoneValid || loading"
                class="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                {{ countdown > 0 ? `Retry in ${countdown}s` : 'Get Code' }}
              </button>
            </div>
            <p v-if="codeError" class="mt-1 text-sm text-red-600">{{ codeError }}</p>
          </div>

          <div>
            <button 
              @click="handleSubmit"
              :disabled="!isFormValid || loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ loading ? 'Verifying...' : 'Next' }}
            </button>
          </div>
        </div>

        <!-- Test Info -->
        <div class="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p class="text-sm text-blue-600">
            <strong>New Verification Mechanism:</strong><br>
            Click 'Get Code' to see the dynamic verification code<br>
            Code valid for 5 mins, refresh/copy supported<br>
            Can use registered phone number for testing
          </p>
        </div>

        <div class="mt-6 text-center text-sm">
          <a href="#" @click.prevent="goToLogin" class="font-medium text-blue-600 hover:text-blue-500">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SimpleDataManager } from '@/utils/simpleDataManager'
import VerificationCodeModal from '@/components/VerificationCodeModal.vue'

const router = useRouter()
const dataManager = SimpleDataManager.getInstance()

// State management
const loading = ref(false)
const globalError = ref('')
const successMessage = ref('')

// Verification code modal related
const showCodeModal = ref(false)
const currentTarget = ref('')
const currentTargetType = ref<'phone' | 'email'>('phone')
const codeModalRef = ref()

// Form data
const phone = ref('')
const phoneError = ref('')
const isPhoneValid = ref(false)

const code = ref('')
const codeError = ref('')
const countdown = ref(0)

// Form validation status
const isFormValid = computed(() => {
  return isPhoneValid.value && code.value.length === 6
})

// Clear error messages
const clearErrors = () => {
  globalError.value = ''
  phoneError.value = ''
  codeError.value = ''
}

// Verify input code
const verifyInputCode = (inputCode: string): boolean => {
  if (!codeModalRef.value) return false
  return codeModalRef.value.validateCode(inputCode)
}

// Validate phone
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

// Send code - show modal
const sendCode = async () => {
  if (!isPhoneValid.value) return
  
  clearErrors()
  
  // Check if phone is registered
  const user = await dataManager.getUserByPhoneAsync(phone.value)
  if (!user) {
    phoneError.value = 'This phone number is not registered, please register first'
    return
  }
  
  // Set current target and type
  currentTarget.value = phone.value
  currentTargetType.value = 'phone'
  
  // Show verification code modal
  showCodeModal.value = true
  
  // Start countdown
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  
  console.log(`Verification code modal shown, target: ${phone.value}`)
}

// 处理验证码生成
const handleCodeGenerated = (code: string) => {
  console.log('New code generated:', code)
}

// 处理提交
const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  clearErrors()
  
  try {
    // 验证验证码
    if (!verifyInputCode(code.value)) {
      codeError.value = 'Invalid or expired code, please retry'
      return
    }
    
    // 检查用户是否存在
    const user = await dataManager.getUserByPhoneAsync(phone.value)
    
    if (!user) {
      phoneError.value = 'Phone number not registered'
      return
    }
    
    // 验证成功，跳转到重置密码页面
    successMessage.value = 'Verified successfully, redirecting to reset password'
    setTimeout(() => {
      router.push({
        path: '/login/Reset-Password',
        query: {
          phone: phone.value,
          code: code.value,
          userId: user.id.toString()
        }
      })
    }, 1000)
    
  } catch (error: any) {
    globalError.value = 'Verification failed, please try again later'
    console.error('Verification failed:', error)
  } finally {
    loading.value = false
  }
}

// 返回登录
const goToLogin = () => {
  router.push('/Login')
}

console.log('Forget-Password.vue 已加载 - 已集成动态验证码功能')
</script>