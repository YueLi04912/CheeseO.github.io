// src/api/auth.ts
import api from '@/utils/request'
import { PRESET_VERIFICATION_CODES } from '@/utils/constants'
export const authAPI = {
  // Send verification code
  sendCode: (phone: string, type: 'login' | 'register' | 'bind' | 'reset') => {
    return api.post('/auth/send-code', { phone, type })
  },
  // Verify code
  verifyCode: (phone: string, code: string, type: 'login' | 'register' | 'bind' | 'reset') => {
    // Check if it is a preset verification code
    if (PRESET_VERIFICATION_CODES.includes(code)) {
      console.log('Using preset verification code:', code)
      // Return success Promise
      return Promise.resolve({ data: { success: true, message: 'Verification code verified successfully' } })
    }
    
    // If not a preset code, call actual API
    return api.post('/auth/verify-code', { phone, code, type })
  },
  
  // Phone code login
  phoneCodeLogin: (phone: string, code: string) => {
    return api.post('/auth/login/phone-code', { phone, code })
  },
  
  // Phone password login
  phonePwdLogin: (phone: string, password: string) => {
    return api.post('/auth/login/phone-pwd', { phone, password })
  },
  
  // Get Wechat QR code
  getWechatQRCode: () => {
    return api.get('/auth/wechat/qrcode')
  },
  
  // Check Wechat login status
  wechatLoginCheck: (ticket: string) => {
    return api.get('/auth/wechat/check', { params: { ticket } })
  },
  
  // Admin login
  adminLogin: (username: string, password: string) => {
    return api.post('/auth/login/admin', { username, password })
  },
  
  // Bind phone
  bindPhone: (phone: string, code: string) => {
    return api.post('/auth/bind-phone', { phone, code })
  },
  
  // Refresh token
  refreshToken: (refreshToken: string) => {
    return api.post('/auth/refresh-token', { refreshToken })
  },
  
  // Logout
  logout: () => {
    return api.post('/auth/logout')
  }
}