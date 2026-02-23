<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
    <!-- 用户协议弹窗 -->
    <div 
      v-if="showTermsModal" 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="showTermsModal = false"
    >
      <div class="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto shadow-xl">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center mr-3">
            <i class="fas fa-file-contract text-white"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-800">User Service Agreement</h3>
        </div>
        <div class="text-sm text-gray-600 space-y-3 leading-relaxed">
          <div class="bg-purple-50 p-3 rounded-lg">
            <p class="font-medium text-purple-800 mb-1">1. Service Terms</p>
            <p>Welcome to the Cheese Circle platform. By using this service, you agree to comply with the following terms and conditions.</p>
          </div>
          <div class="bg-pink-50 p-3 rounded-lg">
            <p class="font-medium text-pink-800 mb-1">2. User Account</p>
            <p>You are responsible for maintaining the accuracy and security of your account information, including but not limited to the confidentiality of login credentials.</p>
          </div>
          <div class="bg-orange-50 p-3 rounded-lg">
            <p class="font-medium text-orange-800 mb-1">3. Usage Norms</p>
            <p>You agree not to use this service for any illegal, harmful, or inappropriate activities.</p>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button 
            @click="showTermsModal = false"
            class="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
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
          <div class="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center mr-3">
            <i class="fas fa-shield-alt text-white"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-800">Privacy Policy</h3>
        </div>
        <div class="text-sm text-gray-600 space-y-3 leading-relaxed">
          <div class="bg-teal-50 p-3 rounded-lg">
            <p class="font-medium text-teal-800 mb-1">1. Information Collection</p>
            <p>We collect personal information you provide, such as name, email, phone number, etc., to provide better service.</p>
          </div>
          <div class="bg-cyan-50 p-3 rounded-lg">
            <p class="font-medium text-cyan-800 mb-1">2. Information Usage</p>
            <p>Your personal information is only used for providing services, improving user experience, and necessary communication.</p>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button 
            @click="showPrivacyModal = false"
            class="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>

    <!-- 验证码弹窗组件 -->
    <VerificationCodeModal
      :is-visible="showCodeModal"
      :target="currentTarget"
      :target-type="currentTargetType"
      @close="showCodeModal = false"
      @code-generated="handleCodeGenerated"
      ref="codeModalRef"
    />

    <!-- 主要注册卡片 -->
    <div class="w-full max-w-md">
      <!-- Logo 和标题 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
          <span class="text-2xl">🧀</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Join Us</h1>
        <p class="text-gray-600">Create your Cheese Circle account</p>
      </div>

      <!-- 注册表单卡片 -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <!-- 错误提示 -->
        <div v-if="globalError" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
          <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
          <span class="text-sm">{{ globalError }}</span>
        </div>

        <!-- 成功提示 -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center">
          <i class="fas fa-check-circle text-green-500 mr-2"></i>
          <span class="text-sm">{{ successMessage }}</span>
        </div>

        <!-- Registration Method Selection -->
        <div class="flex justify-center mb-6">
          <div class="inline-flex bg-gray-100 rounded-lg p-1">
            <button 
              @click="registerType = 'phone'"
              :class="registerType === 'phone' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500'"
              class="px-3 py-2 text-sm font-medium rounded-md transition-all"
            >
              <i class="fas fa-mobile-alt mr-1"></i>Phone Register
            </button>
            <button 
              @click="registerType = 'email'"
              :class="registerType === 'email' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'"
              class="px-3 py-2 text-sm font-medium rounded-md transition-all"
            >
              <i class="fas fa-envelope mr-1"></i>Email Register
            </button>
          </div>
        </div>

        <!-- 手机注册 -->
        <div v-if="registerType === 'phone'" class="space-y-4">
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <input 
                  v-model="code" 
                  type="text" 
                  required 
                  maxlength="6"
                  class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors"
                  placeholder="Enter 6-digit code"
                >
                <i class="fas fa-shield-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <button 
                @click="sendCode"
                :disabled="countdown > 0 || !isPhoneValid || loading"
                class="px-4 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {{ countdown > 0 ? `${countdown}s` : 'Get Code' }}
              </button>
            </div>
            <p v-if="codeError" class="mt-1 text-sm text-red-600">{{ codeError }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div class="relative">
              <input 
                v-model="password" 
                type="password" 
                required 
                minlength="6"
                maxlength="16"
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors"
                placeholder="Enter 6-16 chars (letters & numbers)"
                @input="validatePassword"
              >
              <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div class="relative">
              <input 
                v-model="confirmPassword" 
                type="password" 
                required 
                minlength="6"
                maxlength="16"
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-colors"
                placeholder="Enter password again"
                @input="validateConfirmPassword"
              >
              <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-600">{{ confirmPasswordError }}</p>
          </div>

          <button 
            @click="handlePhoneRegister"
            :disabled="!isPhoneFormValid || !agreeToTerms || loading"
            class="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
            <i v-else class="fas fa-user-plus mr-2"></i>
            {{ loading ? 'Registering...' : 'Register Now' }}
          </button>
        </div>

        <!-- Email Registration -->
        <div v-if="registerType === 'email'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div class="relative">
              <input 
                v-model="email" 
                type="email" 
                required 
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                placeholder="Enter email address"
                @input="validateEmail"
              >
              <i class="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
            <div class="flex gap-3">
              <div class="flex-1 relative">
                <input 
                  v-model="emailCode" 
                  type="text" 
                  required 
                  maxlength="6"
                  class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                  placeholder="Enter 6-digit code"
                >
                <i class="fas fa-shield-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <button 
                @click="sendEmailCode"
                :disabled="emailCountdown > 0 || !isEmailValid || loading"
                class="px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {{ emailCountdown > 0 ? `${emailCountdown}s` : 'Get Code' }}
              </button>
            </div>
            <p v-if="emailCodeError" class="mt-1 text-sm text-red-600">{{ emailCodeError }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div class="relative">
              <input 
                v-model="emailPassword" 
                type="password" 
                required 
                minlength="6"
                maxlength="16"
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                placeholder="Enter 6-16 chars (letters & numbers)"
                @input="validateEmailPassword"
              >
              <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <p v-if="emailPasswordError" class="mt-1 text-sm text-red-600">{{ emailPasswordError }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div class="relative">
              <input 
                v-model="emailConfirmPassword" 
                type="password" 
                required 
                minlength="6"
                maxlength="16"
                class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
                placeholder="Enter password again"
                @input="validateEmailConfirmPassword"
              >
              <i class="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <p v-if="emailConfirmPasswordError" class="mt-1 text-sm text-red-600">{{ emailConfirmPasswordError }}</p>
          </div>

          <button 
            @click="handleEmailRegister"
            :disabled="!isEmailFormValid || !agreeToTerms || loading"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <i v-if="loading" class="fas fa-spinner animate-spin mr-2"></i>
            <i v-else class="fas fa-user-plus mr-2"></i>
            {{ loading ? 'Registering...' : 'Register Now' }}
          </button>
        </div>

        <!-- 登录协议 -->
        <div class="mt-6">
          <div class="flex items-start space-x-3">
            <input 
              id="agree-terms-register" 
              v-model="agreeToTerms"
              type="checkbox" 
              class="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            >
            <label for="agree-terms-register" class="text-sm text-gray-700">
              I have read and agree to
              <a href="#" @click.prevent="showTermsModal = true" class="text-purple-600 hover:text-purple-500 underline">
                User Service Agreement
              </a>
              and
              <a href="#" @click.prevent="showPrivacyModal = true" class="text-teal-600 hover:text-teal-500 underline">
                Privacy Policy
              </a>
            </label>
          </div>
        </div>
      </div>

      <!-- Login Link -->
      <div class="text-center">
        <span class="text-gray-600">Already have an account? </span>
        <a href="#" @click.prevent="goToLogin" class="font-medium text-purple-600 hover:text-purple-500 transition-colors">
          Login Now
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { SimpleDataManager } from '@/utils/simpleDataManager'
import VerificationCodeModal from '@/components/VerificationCodeModal.vue'

const router = useRouter()
const dataManager = SimpleDataManager.getInstance()

// State management
const loading = ref(false)
const globalError = ref('')
const successMessage = ref('')

const registerType = ref<'phone' | 'email'>('phone')

// 协议相关
const agreeToTerms = ref(false)
const showTermsModal = ref(false)
const showPrivacyModal = ref(false)

// 验证码弹窗相关
const showCodeModal = ref(false)
const currentTarget = ref('')
const currentTargetType = ref<'phone' | 'email'>('phone')
const codeModalRef = ref()

// Phone registration data
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

// Email registration data
const email = ref('')
const emailError = ref('')
const isEmailValid = ref(false)

const emailCode = ref('')
const emailCodeError = ref('')
const emailCountdown = ref(0)

const emailPassword = ref('')
const emailPasswordError = ref('')
const isEmailPasswordValid = ref(false)

const emailConfirmPassword = ref('')
const emailConfirmPasswordError = ref('')

// 表单验证状态
const isPhoneFormValid = computed(() => {
  return isPhoneValid.value && 
         code.value.length === 6 && 
         isPasswordValid.value && 
         password.value === confirmPassword.value
})

const isEmailFormValid = computed(() => {
  return isEmailValid.value && 
         emailCode.value.length === 6 && 
         isEmailPasswordValid.value && 
         emailPassword.value === emailConfirmPassword.value
})

// 清除错误信息
const clearErrors = () => {
  globalError.value = ''
  phoneError.value = ''
  codeError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''
  emailError.value = ''
  emailCodeError.value = ''
  emailPasswordError.value = ''
  emailConfirmPasswordError.value = ''
}

// 验证输入的验证码
const verifyInputCode = (inputCode: string): boolean => {
  if (!codeModalRef.value) return false
  return codeModalRef.value.validateCode(inputCode)
}

// 验证手机号
const validatePhone = async () => {
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phone.value) {
    phoneError.value = 'Please enter phone number'
    isPhoneValid.value = false
  } else if (!phoneRegex.test(phone.value)) {
    phoneError.value = 'Please enter valid 11-digit phone number'
    isPhoneValid.value = false
  } else {
    const existingUser = await dataManager.getUserByPhoneAsync(phone.value)
    if (existingUser) {
      phoneError.value = 'Phone number already registered, please login'
      isPhoneValid.value = false
    } else {
      phoneError.value = ''
      isPhoneValid.value = true
    }
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

// 验证邮箱
const validateEmail = async () => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  if (!email.value) {
    emailError.value = 'Please enter email address'
    isEmailValid.value = false
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Please enter valid email address'
    isEmailValid.value = false
  } else {
    const existingUser = await dataManager.getUserByEmailAsync(email.value)
    if (existingUser) {
      emailError.value = 'Email already registered, please login'
      isEmailValid.value = false
    } else {
      emailError.value = ''
      isEmailValid.value = true
    }
  }
}

// 验证邮箱密码
const validateEmailPassword = () => {
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,16}$/
  if (!emailPassword.value) {
    emailPasswordError.value = 'Please enter password'
    isEmailPasswordValid.value = false
  } else if (!passwordRegex.test(emailPassword.value)) {
    emailPasswordError.value = 'Password must be 6-16 chars, alphanumeric'
    isEmailPasswordValid.value = false
  } else {
    emailPasswordError.value = ''
    isEmailPasswordValid.value = true
  }
  validateEmailConfirmPassword()
}

// 验证邮箱确认密码
const validateEmailConfirmPassword = () => {
  if (!emailConfirmPassword.value) {
    emailConfirmPasswordError.value = 'Please enter password again'
  } else if (emailConfirmPassword.value !== emailPassword.value) {
    emailConfirmPasswordError.value = 'Passwords do not match'
  } else {
    emailConfirmPasswordError.value = ''
  }
}

// 发送手机验证码
const sendCode = () => {
  if (!isPhoneValid.value) return
  
  clearErrors()
  
  currentTarget.value = phone.value
  currentTargetType.value = 'phone'
  
  showCodeModal.value = true
  
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 发送邮箱验证码
const sendEmailCode = () => {
  if (!isEmailValid.value) return
  
  clearErrors()
  
  currentTarget.value = email.value
  currentTargetType.value = 'email'
  
  showCodeModal.value = true
  
  emailCountdown.value = 60
  const timer = setInterval(() => {
    emailCountdown.value--
    if (emailCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 处理验证码生成
const handleCodeGenerated = (code: string) => {
  console.log('新验证码已生成:', code)
}

// 手机号注册
const handlePhoneRegister = async () => {
  if (!isPhoneFormValid.value) return
  
  if (!agreeToTerms.value) {
    globalError.value = '请先阅读并同意用户服务协议和隐私政策'
    return
  }
  
  loading.value = true
  clearErrors()
  
  try {
    if (!verifyInputCode(code.value)) {
      codeError.value = '验证码错误或已过期，请重新获取'
      return
    }
    
    const existingUser = await dataManager.getUserByPhoneAsync(phone.value)
    if (existingUser) {
      phoneError.value = '该手机号已注册，请登录'
      return
    }
    
    const newUser = await dataManager.createUserAsync({
      username: `user_${phone.value.slice(-4)}`,
      password: password.value,
      phone: phone.value,
      role: 'user',
      registerType: 'phone',
      isVerified: true,
      nickname: `用户${phone.value.slice(-4)}`
    })
    
    dataManager.setCurrentUser(newUser)
    
    successMessage.value = '注册成功！即将跳转到首页'
    setTimeout(() => {
      router.push('/')
    }, 1500)
    
  } catch (error: any) {
    globalError.value = '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 邮箱注册
const handleEmailRegister = async () => {
  if (!isEmailFormValid.value) return
  
  if (!agreeToTerms.value) {
    globalError.value = '请先阅读并同意用户服务协议和隐私政策'
    return
  }
  
  loading.value = true
  clearErrors()
  
  try {
    if (!verifyInputCode(emailCode.value)) {
      emailCodeError.value = '验证码错误或已过期，请重新获取'
      return
    }
    
    const existingUser = await dataManager.getUserByEmailAsync(email.value)
    if (existingUser) {
      emailError.value = '该邮箱已注册，请登录'
      return
    }
    
    const newUser = await dataManager.createUserAsync({
      username: email.value.split('@')[0],
      password: emailPassword.value,
      email: email.value,
      role: 'user',
      registerType: 'email',
      isVerified: true,
      nickname: email.value.split('@')[0]
    })
    
    dataManager.setCurrentUser(newUser)
    
    successMessage.value = '注册成功！即将跳转到首页'
    setTimeout(() => {
      router.push('/')
    }, 1500)
    
  } catch (error: any) {
    globalError.value = '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 跳转登录
const goToLogin = () => {
  router.push('/Login')
}

// 监听注册方式变化
watch(registerType, () => {
  clearErrors()
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
  .bg-gradient-to-br.from-purple-50.to-pink-50 {
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
  outline: 2px solid #8b5cf6;
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
  background: rgba(139, 92, 246, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.5);
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