<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Reset Password
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Please set your new password
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
            <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input 
                v-model="newPassword" 
                id="newPassword" 
                type="password" 
                required 
                minlength="6"
                maxlength="16"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="6-16 characters (letters and numbers)"
                @input="validatePassword"
              >
            </div>
            <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
          </div>

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
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter new password again"
                @input="validateConfirmPassword"
              >
            </div>
            <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-600">{{ confirmPasswordError }}</p>
          </div>

          <div>
            <button 
              @click="handleReset"
              :disabled="!isFormValid || loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {{ loading ? 'Resetting...' : 'Confirm Reset' }}
            </button>
          </div>
        </div>

        <!-- Info -->
        <div class="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p class="text-sm text-blue-600">
            <strong>Notice:</strong><br>
            Phone: {{ phone }}<br>
            Will redirect to login page after success
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SimpleDataManager } from '@/utils/simpleDataManager'

const router = useRouter()
const dataManager = SimpleDataManager.getInstance()

// State management
const loading = ref(false)
const globalError = ref('')
const successMessage = ref('')

// Get parameters from route
const route = router.currentRoute.value
const phone = (route.query.phone as string) || ''
const code = (route.query.code as string) || ''
const userId = parseInt(route.query.userId as string) || 0

// Form data
const newPassword = ref('')
const passwordError = ref('')
const isPasswordValid = ref(false)

const confirmPassword = ref('')
const confirmPasswordError = ref('')

// Password validation regex
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,16}$/

// Form validation status
const isFormValid = computed(() => {
  return isPasswordValid.value && 
         newPassword.value === confirmPassword.value
})

// Validate password
const validatePassword = () => {
  if (!newPassword.value) {
    passwordError.value = 'Please enter password'
    isPasswordValid.value = false
  } else if (!passwordRegex.test(newPassword.value)) {
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
  } else if (confirmPassword.value !== newPassword.value) {
    confirmPasswordError.value = 'Passwords do not match'
  } else {
    confirmPasswordError.value = ''
  }
}

// 处理重置
const handleReset = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  globalError.value = ''
  
  try {
    // 验证参数
    if (!phone || !code || !userId) {
      globalError.value = 'Invalid parameters, please restart password reset'
      return
    }
    
    // 验证用户是否存在
    const user = await dataManager.getUserByIdAsync(userId)
    if (!user || user.phone !== phone) {
      globalError.value = 'User verification failed'
      return
    }
    
    // Update password
    const success = await dataManager.updateUserAsync(userId, {
      password: newPassword.value
    })
    
    if (success) {
      successMessage.value = 'Password reset successful! Redirecting to login...'
      
      setTimeout(() => {
        router.push({
          path: '/Login',
          query: {
            resetSuccess: 'true',
            phone: phone
          }
        })
      }, 2000)
      
      console.log('Password reset successful, User ID:', userId)
    } else {
      globalError.value = 'Password reset failed, please try again later'
    }
    
  } catch (error: any) {
    globalError.value = 'Password reset failed, please try again later'
    console.error('Password reset failed:', error)
  } finally {
    loading.value = false
  }
}

// 返回登录
const goToLogin = () => {
  router.push('/Login')
}

// 页面加载时验证参数
onMounted(() => {
  if (!phone || !code || !userId) {
    globalError.value = 'Invalid access parameters, please restart password reset'
    setTimeout(() => {
      router.push('/login/Forget-Password')
    }, 2000)
  }
  
  console.log('Reset-Password.vue 已加载，参数:', { phone, code, userId })
})
</script>