import { SimpleDataManager, type User } from '@/utils/simpleDataManager'

export interface AuthResult {
  success: boolean
  message: string
  user?: User
}

export class AuthService {
  private dataManager = SimpleDataManager.getInstance()
  private verificationCodes = new Map<string, { code: string; expireTime: number }>()

  // ==================== Validation Methods ====================
  validatePhone(phone: string): { valid: boolean; message: string } {
    if (!phone) return { valid: false, message: 'Please enter phone number' }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return { valid: false, message: 'Please enter a valid 11-digit phone number' }
    }
    return { valid: true, message: '' }
  }

  validateEmail(email: string): { valid: boolean; message: string } {
    if (!email) return { valid: false, message: 'Please enter email' }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return { valid: false, message: 'Please enter a valid email address' }
    }
    return { valid: true, message: '' }
  }

  validatePassword(password: string): { valid: boolean; message: string } {
    if (!password) return { valid: false, message: 'Please enter password' }
    if (password.length < 6 || password.length > 16) {
      return { valid: false, message: 'Password length must be 6-16 characters' }
    }
    if (!/^(?=.*[a-zA-Z])(?=.*\d).{6,16}$/.test(password)) {
      return { valid: false, message: 'Password must contain letters and numbers' }
    }
    return { valid: true, message: '' }
  }

  validateCode(code: string): { valid: boolean; message: string } {
    if (!code) return { valid: false, message: 'Please enter verification code' }
    if (!/^\d{6}$/.test(code)) {
      return { valid: false, message: 'Please enter a 6-digit verification code' }
    }
    return { valid: true, message: '' }
  }

  // ==================== Verification Code ====================
  async sendVerificationCode(target: string): Promise<{ success: boolean; message: string }> {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expireTime = Date.now() + 5 * 60 * 1000 // Expires in 5 minutes

    // Store code
    this.verificationCodes.set(target, { code, expireTime })

    // Simulate sending code
    console.log(`Verification code sent to ${target}: ${code}`)
    console.log(`Tip: You can also use preset codes: ${this.dataManager.getPresetCodes().join(', ')}`)

    return { 
      success: true, 
      message: 'Verification code sent'
    }
  }

  verifyCode(target: string, code: string): { success: boolean; message: string } {
    // Check preset codes
    const presetCodes = this.dataManager.getPresetCodes()
    if (presetCodes.includes(code)) {
      return { success: true, message: 'Verification successful' }
    }

    // Check stored code
    const stored = this.verificationCodes.get(target)
    if (!stored) {
      return { success: false, message: 'Please get verification code first' }
    }

    if (Date.now() > stored.expireTime) {
      this.verificationCodes.delete(target)
      return { success: false, message: 'Verification code expired' }
    }

    if (code !== stored.code) {
      return { success: false, message: 'Invalid verification code' }
    }

    // Delete code after successful verification
    this.verificationCodes.delete(target)
    return { success: true, message: 'Verification successful' }
  }

  // ==================== Login Methods ====================
  async phoneCodeLogin(phone: string, code: string): Promise<AuthResult> {
    // Verify code
    const codeResult = this.verifyCode(phone, code)
    if (!codeResult.success) {
      return { success: false, message: codeResult.message }
    }

    // Find or create user
    let user = await this.dataManager.getUserByPhoneAsync(phone)
    if (!user) {
      // Auto register user
      user = await this.dataManager.createUserAsync({
        username: `user_${phone.slice(-4)}`,
        password: '', // Password can be set later for code login users
        phone,
        role: 'user',
        nickname: `User${phone.slice(-4)}`,
        points: 100, // New user reward
        status: 'active',
        membershipType: 'none'
      })
    }

    // Update last login time
    await this.dataManager.updateUserAsync(user.id, { 
      lastLoginAt: new Date().toISOString() 
    })

    // Set current user
    this.dataManager.setCurrentUser(user)

    return {
      success: true,
      message: 'Login successful',
      user
    }
  }

  async phonePasswordLogin(phone: string, password: string): Promise<AuthResult> {
    const user = await this.dataManager.validateLoginAsync(phone, password)
    
    if (!user) {
      return { success: false, message: 'Phone number or password is incorrect' }
    }

    this.dataManager.setCurrentUser(user)

    return {
      success: true,
      message: 'Login successful',
      user
    }
  }

  async emailLogin(email: string, password: string): Promise<AuthResult> {
    const user = await this.dataManager.validateLoginAsync(email, password)
    
    if (!user) {
      return { success: false, message: 'Email or password is incorrect' }
    }

    this.dataManager.setCurrentUser(user)

    return {
      success: true,
      message: 'Login successful',
      user
    }
  }

  async adminLogin(username: string, password: string): Promise<AuthResult> {
    const user = await this.dataManager.validateLoginAsync(username, password)
    
    if (!user || user.role !== 'admin') {
      return { success: false, message: 'Admin account does not exist or password is incorrect' }
    }

    this.dataManager.setCurrentUser(user)

    return {
      success: true,
      message: 'Admin login successful',
      user
    }
  }

  // ==================== Register Methods ====================
  async phoneRegister(phone: string, code: string, password: string): Promise<AuthResult> {
    // Verify code
    const codeResult = this.verifyCode(phone, code)
    if (!codeResult.success) {
      return { success: false, message: codeResult.message }
    }

    // Check if user already exists
    if (await this.dataManager.getUserByPhoneAsync(phone)) {
      return { success: false, message: 'Phone number already registered, please login directly' }
    }

    const user = await this.dataManager.createUserAsync({
      username: `user_${phone.slice(-4)}`,
      password,
      phone,
      role: 'user',
      nickname: `User${phone.slice(-4)}`,
      points: 100, // New user reward
      status: 'active',
      membershipType: 'none'
    })

    return {
      success: true,
      message: 'Registration successful',
      user
    }
  }

  async emailRegister(email: string, code: string, password: string): Promise<AuthResult> {
    // Verify code
    const codeResult = this.verifyCode(email, code)
    if (!codeResult.success) {
      return { success: false, message: codeResult.message }
    }

    // Check if user already exists
    if (await this.dataManager.getUserByEmailAsync(email)) {
      return { success: false, message: 'Email already registered, please login directly' }
    }

    const user = await this.dataManager.createUserAsync({
      username: email.split('@')[0],
      password,
      email,
      role: 'user',
      nickname: email.split('@')[0],
      points: 100, // New user reward
      status: 'active',
      membershipType: 'none'
    })

    return {
      success: true,
      message: 'Registration successful',
      user
    }
  }

  // ==================== Other Methods ====================
  logout(): void {
    this.dataManager.clearCurrentUser()
  }

  getCurrentUser(): User | null {
    return this.dataManager.getCurrentUser()
  }

  async getCurrentUserAsync(): Promise<User | null> {
    return this.dataManager.getCurrentUserAsync()
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === 'admin'
  }

  // Reset Password
  async resetPassword(phone: string, code: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    // Verify code
    const codeResult = this.verifyCode(phone, code)
    if (!codeResult.success) {
      return { success: false, message: codeResult.message }
    }

    const user = this.dataManager.getUserByPhone(phone)
    if (!user) {
      return { success: false, message: 'User does not exist' }
    }

    const ok = await this.dataManager.updateUserAsync(user.id, { password: newPassword })
    if (!ok) {
      return { success: false, message: 'Password reset failed' }
    }

    return { success: true, message: 'Password reset successful' }
  }
}
