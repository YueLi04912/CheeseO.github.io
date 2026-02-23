// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AuthService } from '@/services/authService'
import router from '@/router'
import type { User } from '@/utils/simpleDataManager'

export const useAuthStore = defineStore('auth', () => {
  const authService = new AuthService()
  
  // State
  const isAuthenticated = ref(false)
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref('')

  // Verification code countdown state
  const countdown = ref(0)

  // Initialize - Check local storage user info
  const init = async () => {
    // Prioritize synchronous reading of local cache to avoid page flickering
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      user.value = currentUser
      isAuthenticated.value = true
    }
    
    // Asynchronously refresh user info
    try {
      const freshUser = await authService.getCurrentUserAsync()
      if (freshUser) {
        user.value = freshUser
        isAuthenticated.value = true
      }
    } catch (e) {
      console.error('Auth store init refresh failed:', e)
    }
  }

  // Clear error message
  const clearError = () => {
    error.value = ''
  }

  // Send verification code
  const sendVerificationCode = async (target: string) => {
    try {
      clearError()
      const result = await authService.sendVerificationCode(target)
      
      if (result.success) {
        // Start countdown
        countdown.value = 60
        const timer = setInterval(() => {
          countdown.value--
          if (countdown.value <= 0) {
            clearInterval(timer)
          }
        }, 1000)
      } else {
        error.value = result.message
      }
      
      return result
    } catch (err: any) {
      error.value = err.message || 'Failed to send verification code'
      throw err
    }
  }

  // Phone code login
  const phoneCodeLogin = async (phone: string, code: string) => {
    loading.value = true
    clearError()
    
    try {
      const result = await authService.phoneCodeLogin(phone, code)
      
      if (result.success && result.user) {
        user.value = result.user
        isAuthenticated.value = true
        
        // Redirect based on role
        if (result.user.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/')
        }
      } else {
        error.value = result.message
      }
      
      return result
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Phone password login
  const phonePasswordLogin = async (phone: string, password: string) => {
    loading.value = true
    clearError()
    
    try {
      const result = await authService.phonePasswordLogin(phone, password)
      
      if (result.success && result.user) {
        user.value = result.user
        isAuthenticated.value = true
        
        if (result.user.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/')
        }
      } else {
        error.value = result.message
      }
      
      return result
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Email login
  const emailLogin = async (email: string, password: string) => {
    loading.value = true
    clearError()
    
    try {
      const result = await authService.emailLogin(email, password)
      
      if (result.success && result.user) {
        user.value = result.user
        isAuthenticated.value = true
        
        if (result.user.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/')
        }
      } else {
        error.value = result.message
      }
      
      return result
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Admin login
  const adminLogin = async (username: string, password: string) => {
    loading.value = true
    clearError()
    
    try {
      const result = await authService.adminLogin(username, password)
      
      if (result.success && result.user) {
        user.value = result.user
        isAuthenticated.value = true
        
        router.push('/admin/dashboard')
      } else {
        error.value = result.message
      }
      
      return result
    } catch (err: any) {
      error.value = err.message || 'Admin login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Phone register
  const phoneRegister = async (phone: string, code: string, password: string) => {
    loading.value = true
    clearError()
    
    try {
      const result = await authService.phoneRegister(phone, code, password)
      
      if (result.success) {
        // Auto login after registration
        return await phonePasswordLogin(phone, password)
      } else {
        error.value = result.message
      }
      
      return result
    } catch (err: any) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Email register
  const emailRegister = async (email: string, code: string, password: string) => {
    loading.value = true
    clearError()
    
    try {
      const result = await authService.emailRegister(email, code, password)
      
      if (result.success) {
        // Auto login after registration
        return await emailLogin(email, password)
      } else {
        error.value = result.message
      }
      
      return result
    } catch (err: any) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Reset password
  const resetPassword = async (phone: string, code: string, newPassword: string) => {
    loading.value = true
    clearError()
    
    try {
      const result = await authService.resetPassword(phone, code, newPassword)
      
      if (!result.success) {
        error.value = result.message
      }
      
      return result
    } catch (err: any) {
      error.value = err.message || 'Password reset failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Validate form fields
  const validatePhone = (phone: string) => {
    return authService.validatePhone(phone)
  }

  const validateEmail = (email: string) => {
    return authService.validateEmail(email)
  }

  const validatePassword = (password: string) => {
    return authService.validatePassword(password)
  }

  const validateCode = (code: string) => {
    return authService.validateCode(code)
  }

  // Logout
  const logout = () => {
    authService.logout()
    user.value = null
    isAuthenticated.value = false
    error.value = ''
    
    router.push('/Login')
  }

  // Getters
  const isAdmin = () => {
    return user.value?.role === 'admin'
  }

  const userPoints = () => {
    return user.value?.points || 0
  }

  // Initialize
  init()

  return {
    // State
    isAuthenticated,
    user,
    loading,
    error,
    countdown,
    
    // Login methods
    phoneCodeLogin,
    phonePasswordLogin,
    emailLogin,
    adminLogin,
    
    // Register methods
    phoneRegister,
    emailRegister,
    
    // Other methods
    resetPassword,
    sendVerificationCode,
    logout,
    
    // Validation methods
    validatePhone,
    validateEmail,
    validatePassword,
    validateCode,
    
    // Utility methods
    clearError,
    
    // Getters
    isAdmin,
    userPoints
  }
})