<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
        Bind Phone
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        WeChat login successful, please bind your phone number
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-lg rounded-xl sm:rounded-lg sm:px-10">
        <!-- Error Alert -->
        <div v-if="globalError" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ globalError }}
        </div>

        <!-- Success Alert -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ successMessage }}
        </div>

        <div class="space-y-6">
          <!-- Phone Input -->
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
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 sm:text-sm transition-all duration-300 ease-in-out"
                placeholder="Enter 11-digit phone number"
                @input="validatePhone"
              >
            </div>
            <p v-if="phoneError" class="mt-1 text-sm text-red-600">{{ phoneError }}</p>
          </div>

          <!-- Code Input -->
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
                class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 ease-in-out"
                placeholder="Enter 6-digit code"
              >
              <button 
                @click="sendCode"
                :disabled="countdown > 0 || !isPhoneValid || loading"
                class="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md bg-gray-50 text-gray-700 hover:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 transition-all duration-300 ease-in-out"
              >
                {{ countdown > 0 ? `Retry in ${countdown}s` : 'Get Code' }}
              </button>
            </div>
            <p v-if="codeError" class="mt-1 text-sm text-red-600">{{ codeError }}</p>
          </div>

          <!-- Password Set -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Set Password</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input 
                v-model="password" 
                id="password" 
                type="password" 
                required 
                minlength="6"
                maxlength="16"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 ease-in-out"
                placeholder="6-16 characters (letters and numbers)"
                @input="validatePassword"
              >
            </div>
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input 
                v-model="confirmPassword" 
                id="confirmPassword" 
                type="password" 
                required 
                minlength="6"
                maxlength="16"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 ease-in-out"
                placeholder="Enter password again"
                @input="validateConfirmPassword"
              >
            </div>
            <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-600">{{ confirmPasswordError }}</p>
          </div>

          <!-- Submit Button -->
          <div>
            <button 
              @click="handleBind"
              :disabled="!isFormValid || loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:bg-gradient-to-l hover:from-blue-400 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-300 ease-in-out"
            >
              {{ loading ? 'Binding...' : 'Confirm Bind' }}
            </button>
          </div>
        </div>

        <!-- Test Information -->
        <div class="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p class="text-sm text-blue-600">
            <strong>New Verification Mechanism:</strong><br>
            Click 'Get Code' to see the dynamic verification code<br>
            Code valid for 5 mins, refresh/copy supported
          </p>
        </div>

        <div class="mt-6 text-center text-sm">
          <a href="#" @click.prevent="goToLogin" class="font-medium text-blue-600 hover:text-blue-500 transition-all duration-300 ease-in-out">
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

const password = ref('')
const passwordError = ref('')
const isPasswordValid = ref(false)

const confirmPassword = ref('')
const confirmPasswordError = ref('')

// Form validation status
const isFormValid = computed(() => {
  return isPhoneValid.value && 
         code.value.length === 6 && 
         isPasswordValid.value && 
         password.value === confirmPassword.value
})

// Clear error messages
const clearErrors = () => {
  globalError.value = ''
  phoneError.value = ''
  codeError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''
}

// 验证输入的验证码
const verifyInputCode = (inputCode: string): boolean => {
  if (!codeModalRef.value) return false
  return codeModalRef.value.validateCode(inputCode)
}

// 验证手机号
const validatePhone = () => {
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phone.value) {
    phoneError.value = 'Please enter phone number'
    isPhoneValid.value = false
  } else if (!phoneRegex.test(phone.value)) {
    phoneError.value = 'Please enter valid 11-digit phone number'
    isPhoneValid.value = false
  } else {
    phoneError.value = ''
    isPhoneValid.value = true
  }
}

// 验证密码
const validatePassword = () => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,16}$/
  if (!password.value) {
    passwordError.value = 'Please enter password'
    isPasswordValid.value = false
  } else if (!passwordRegex.test(password.value)) {
    passwordError.value = 'Password must be 6-16 chars, alphanumeric'
    isPasswordValid.value = false
  } else {
    passwordError.value = ''
    isPasswordValid.value = true
  }
  validateConfirmPassword()
}

// 验证确认密码
const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please enter password again'
  } else if (confirmPassword.value !== password.value) {
    confirmPasswordError.value = 'Passwords do not match'
  } else {
    confirmPasswordError.value = ''
  }
}

// 发送验证码 - 显示弹窗
const sendCode = () => {
  if (!isPhoneValid.value) return
  
  clearErrors()
  
  // 设置当前目标和类型
  currentTarget.value = phone.value
  currentTargetType.value = 'phone'
  
  // 显示验证码弹窗
  showCodeModal.value = true
  
  // 开始倒计时
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

// 处理绑定
const handleBind = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  clearErrors()
  
  try {
    // 验证验证码
    if (!verifyInputCode(code.value)) {
      codeError.value = 'Invalid or expired code, please retry'
      return
    }
    
    // 检查手机号是否已被使用
    const existingUser = await dataManager.getUserByPhoneAsync(phone.value)
    
    if (existingUser) {
      phoneError.value = 'Phone number already bound to another account'
      return
    }
    
    // 模拟绑定成功
    successMessage.value = '手机号绑定成功！即将跳转到首页'
    
    setTimeout(() => {
      router.push('/')
    }, 2000)
    
  } catch (error: any) {
    globalError.value = '绑定失败，请稍后重试'
    console.error('绑定失败:', error)
  } finally {
    loading.value = false
  }
}

// 返回登录
const goToLogin = () => {
  router.push('/Login')
}

console.log('Bind-Phone.vue 已加载 - 已集成动态验证码功能')
</script>