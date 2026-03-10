import { firebaseRepo, verifyPasswordHash } from '@/services/firebaseRepo'

import siteConfig from '@/data/site-config.json'

// Point Transaction Interface
export interface PointTransaction {
  id: string
  userId: number | string
  userName: string // Added username field for admin view
  type: 'recharge' | 'withdraw' | 'membership' | 'reward' | 'penalty' | 'purchase' | 'tip'
  amount: number // Positive for income, negative for expense
  balance: number // Point balance after transaction
  description: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  processedAt?: string
  relatedOrderId?: string // Related order ID (e.g., membership order)
  paymentMethod?: 'alipay' | 'wechat' | 'bank' // Payment method (used for recharge)
}

// Membership Record Interface
export interface MembershipRecord {
  id: string
  userId: number | string
  userName: string // Added username field
  type: 'monthly' | 'yearly'
  startDate: string
  endDate: string
  price: number // Points spent
  status: 'active' | 'expired' | 'cancelled'
  autoRenewal: boolean
  createdAt: string
  transactionId: string // Related point transaction record
}

// Recharge Order Interface
export interface RechargeOrder {
  id: string
  userId: number | string
  userName: string // Added username field
  amount: number // Recharge amount (CNY)
  points: number // Points obtained
  exchangeRate: number // Exchange rate (1 CNY = how many points)
  paymentMethod: 'alipay' | 'wechat' | 'bank'
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  createdAt: string
  paidAt?: string
  transactionId?: string // Related point transaction record
}

// Withdraw Request Interface
export interface WithdrawRequest {
  id: string
  userId: number | string
  userName: string // Added username field
  points: number
  amount: number // Withdraw amount (CNY)
  exchangeRate: number // Exchange rate
  bankInfo: {
    bankName: string
    accountNumber: string
    accountName: string
  }
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  createdAt: string
  processedAt?: string
  processedBy?: number | string // Processor ID
  processedByName?: string // Processor Name
  rejectReason?: string
  transactionId?: string // Related point transaction record
}

// Like Record Interface
export interface LikeRecord {
  id: string
  userId: number | string
  articleId: string
  createdAt: string
}

// Bookmark Record Interface
export interface BookmarkRecord {
  id: string
  userId: number | string
  articleId: string
  createdAt: string
}

// Follow Record Interface
export interface FollowRecord {
  id: string
  followerId: number | string // Follower ID
  followingId: number | string // Following ID
  createdAt: string
}

// User Interface Definition
export interface User {
  id: number | string
  username: string
  password: string
  passwordSalt?: string
  phone?: string
  email?: string
  role: 'admin' | 'user'
  nickname?: string
  realName?: string
  avatar?: string
  bio?: string
  points: number
  status: 'active' | 'inactive' | 'banned'
  membershipType: 'none' | 'monthly' | 'yearly'
  membershipEndDate?: string // Membership expiration time
  createdAt: string
  lastLoginAt?: string
  
  // Registration related info
  registerType?: 'phone' | 'email' | 'wechat'
  isVerified?: boolean
  
  // Extended user profile fields
  specialties?: string[]
  socialLinks?: {
    wechat?: string
    weibo?: string
    github?: string
  }
  
  // Statistics
  totalEarnings?: number
  subscriptionEarnings?: number
  tipEarnings?: number
  
  // Ban related
  banTime?: string
  banReason?: string
}

// Create User Input Type
export interface CreateUserInput {
  username: string
  password: string
  nickname?: string
  phone?: string
  email?: string
  role: 'admin' | 'user'
  registerType?: 'phone' | 'email' | 'wechat'
  isVerified?: boolean
  avatar?: string
  realName?: string
  bio?: string
  specialties?: string[]
  socialLinks?: {
    wechat?: string
    weibo?: string
    github?: string
  }
  points?: number
  status?: 'active' | 'inactive' | 'banned'
  membershipType?: 'none' | 'monthly' | 'yearly'
}

export interface Category {
  id: string
  name: string
  description: string
  icon: string
  color: string
  createdAt: string
}

export interface CreateArticleInput {
  title: string
  content: string
  excerpt: string
  authorId: number
  authorName: string
  categoryId: string
  categoryName: string
  tags: string[]
  coverImage?: string
  images: string[]
  accessType: 'free' | 'paid'
  price: number
  status: 'draft' | 'pending' | 'published' | 'rejected'
  publishedAt?: string
  rejectReason?: string
  
  // Video related fields
  isVideo?: boolean
  videoFile?: File
  videoUrl?: string
  duration?: string
}

export interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  authorId: number
  authorName: string
  categoryId: string
  categoryName: string
  tags: string[]
  coverImage?: string
  images: string[]
  accessType: 'free' | 'paid'
  price: number
  status: 'draft' | 'pending' | 'published' | 'rejected'
  views: number
  likes: number
  comments: number
  rejectReason?: string
  createdAt: string
  publishedAt?: string
  updatedAt: string
  
  // Video related fields
  isVideo?: boolean
  videoFile?: File
  videoUrl?: string
  duration?: string
}

export interface PendingContent {
  id: string
  type: 'blog' | 'video'
  title: string
  preview: string
  content?: string
  categoryId?: string
  categoryName?: string
  images?: string[]
  accessType: 'free' | 'paid'
  price: number
  author: string
  authorId: number
  submitTime: Date
  status: 'pending' | 'approved' | 'rejected'
  rejectReason?: string
  
  // Add missing fields
  tags?: string[]  // Tags array
  
  // Video related fields
  videoFile?: File
  videoUrl?: string
  duration?: string
}

export class SimpleDataManager {
  private static instance: SimpleDataManager
  private readonly USERS_KEY = 'app_users'
  private readonly CATEGORIES_KEY = 'app_categories'
  private readonly ARTICLES_KEY = 'app_articles'
  private readonly PENDING_CONTENTS_KEY = 'app_pending_contents'
  private readonly CURRENT_USER_KEY = 'app_current_user'
  
  // Points system related data keys
  private readonly POINT_TRANSACTIONS_KEY = 'app_point_transactions'
  private readonly MEMBERSHIP_RECORDS_KEY = 'app_membership_records'
  private readonly RECHARGE_ORDERS_KEY = 'app_recharge_orders'
  private readonly WITHDRAW_REQUESTS_KEY = 'app_withdraw_requests'
  
  // New data keys
  private readonly LIKES_KEY = 'app_likes'
  private readonly BOOKMARKS_KEY = 'app_bookmarks'
  private readonly FOLLOWS_KEY = 'app_follows'

  private constructor() {
    this.initializeData()
  }

  // User data synchronization method
  public syncUserData(userId: number): User | null {
    const user = this.getUserById(userId)
    if (!user) return null
    
    try {
      // Recalculate point balance (based on transaction records)
      const transactions = this.getPointTransactions().filter(t => 
        t.userId === userId && t.status === 'completed'
      )
      const calculatedPoints = transactions.reduce((sum, t) => sum + t.amount, 0)
      
      // Re-check membership status
      const membershipStatus = this.getUserMembershipStatus(userId)
      
      // Build update data
      const updateData: Partial<User> = {
        points: Math.max(0, calculatedPoints), // Ensure points are not negative
      }
      
      // Update membership status
      if (membershipStatus.isMember) {
        updateData.membershipType = membershipStatus.type as 'monthly' | 'yearly'
        updateData.membershipEndDate = membershipStatus.endDate
      } else {
        updateData.membershipType = 'none'
        updateData.membershipEndDate = undefined
      }
      
      // Update user data
      const updatedUser = this.updateUser(userId, updateData)
      
      console.log(`User ${user.nickname || user.username} data synced:`, {
        'Original Points': user.points,
        'New Points': calculatedPoints,
        'Membership Status': membershipStatus.isMember ? membershipStatus.type : 'Non-member'
      })
      
      return updatedUser
      
    } catch (error) {
      console.error('Failed to sync user data:', error)
      return null
    }
  }

  // Data integrity check and repair method
  public checkAndRepairPointsData(): { fixed: number; errors: string[] } {
    const errors: string[] = []
    let fixed = 0
    
    try {
      const users = this.getUsers()
      const transactions = this.getPointTransactions()
      
      // Check if each user's point balance is consistent with transaction records
      users.forEach(user => {
        const userTransactions = transactions.filter(t => 
          t.userId === user.id && t.status === 'completed'
        )
        
        // Calculate expected point balance
        const calculatedBalance = userTransactions.reduce((sum, t) => sum + t.amount, 0)
        
        // If points are inconsistent, fix it
        if (Math.abs(user.points - calculatedBalance) > 0.01) {
          console.log(`Repairing points for user ${user.nickname || user.username}`, {
            'Original Points': user.points,
            'Calculated Points': calculatedBalance,
            'Difference': user.points - calculatedBalance
          })
          
          this.updateUser(user.id, { points: Math.max(0, calculatedBalance) })
          fixed++
        }
      })
      
      // Check membership status consistency
      users.forEach(user => {
        const membershipStatus = this.getUserMembershipStatus(user.id)
        
        if (membershipStatus.isMember && user.membershipType === 'none') {
          this.updateUser(user.id, { 
            membershipType: membershipStatus.type as 'monthly' | 'yearly',
            membershipEndDate: membershipStatus.endDate
          })
          fixed++
        } else if (!membershipStatus.isMember && user.membershipType !== 'none') {
          this.updateUser(user.id, { 
            membershipType: 'none',
            membershipEndDate: undefined
          })
          fixed++
        }
      })
      
    } catch (error) {
      errors.push(`Error occurred during data check: ${error}`)
    }
    
    return { fixed, errors }
  }

  // Reset Points System (Admin Feature)
  public resetPointsSystem(): { success: boolean; message: string; usersProcessed?: number } {
    try {
      // 1. Reset all user points
      const users = this.getUsers()
      const resetUsers = users.map(user => ({
        ...user,
        points: 0,
        membershipType: 'none' as const,
        membershipEndDate: undefined,
        totalEarnings: 0,
        subscriptionEarnings: 0,
        tipEarnings: 0
      }))
      
      // Save reset user data
      this.saveUsers(resetUsers)
      
      // 2. Clear all point-related records
      this.savePointTransactions([])
      this.saveMembershipRecords([])
      this.saveRechargeOrders([])
      this.saveWithdrawRequests([])
      
      // 3. If there is a current user, also reset current user cache
      const currentUser = this.getCurrentUser()
      if (currentUser) {
        const resetCurrentUser = resetUsers.find(u => u.id === currentUser.id)
        if (resetCurrentUser) {
          this.setCurrentUser(resetCurrentUser)
        }
      }
      
      console.log('Points system reset, processed', users.length, 'users')
      
      return {
        success: true,
        message: `Points system reset! Processed data for ${users.length} users`,
        usersProcessed: users.length
      }
      
    } catch (error) {
      console.error('Failed to reset points system:', error)
      return {
        success: false,
        message: 'Reset failed: ' + (error as Error).message
      }
    }
  }

  public static getInstance(): SimpleDataManager {
    if (!SimpleDataManager.instance) {
      SimpleDataManager.instance = new SimpleDataManager()
    }
    return SimpleDataManager.instance
  }

  // Initialize Data
  private initializeData() {
    // Initialize user data
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]))
    }
    
    // Initialize category data
    if (!localStorage.getItem(this.CATEGORIES_KEY)) {
      localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify([]))
    }
    
    // Initialize article data
    if (!localStorage.getItem(this.ARTICLES_KEY)) {
      localStorage.setItem(this.ARTICLES_KEY, JSON.stringify([]))
    }

    // Initialize points system related data
    if (!localStorage.getItem(this.POINT_TRANSACTIONS_KEY)) {
      localStorage.setItem(this.POINT_TRANSACTIONS_KEY, JSON.stringify([]))
    }
    
    if (!localStorage.getItem(this.MEMBERSHIP_RECORDS_KEY)) {
      localStorage.setItem(this.MEMBERSHIP_RECORDS_KEY, JSON.stringify([]))
    }
    
    if (!localStorage.getItem(this.RECHARGE_ORDERS_KEY)) {
      localStorage.setItem(this.RECHARGE_ORDERS_KEY, JSON.stringify([]))
    }
    
    if (!localStorage.getItem(this.WITHDRAW_REQUESTS_KEY)) {
      localStorage.setItem(this.WITHDRAW_REQUESTS_KEY, JSON.stringify([]))
    }

    // Force clear local pending content cache to ensure only cloud data is used
    localStorage.removeItem(this.PENDING_CONTENTS_KEY)
    
    // Initialize like, bookmark, follow data
    if (!localStorage.getItem(this.LIKES_KEY)) {
      localStorage.setItem(this.LIKES_KEY, JSON.stringify([]))
    }
    
    if (!localStorage.getItem(this.BOOKMARKS_KEY)) {
      localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify([]))
    }
    
    if (!localStorage.getItem(this.FOLLOWS_KEY)) {
      localStorage.setItem(this.FOLLOWS_KEY, JSON.stringify([]))
    }
  }

  // Helper method to generate unique ID
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private sanitizeUserForLocal(user: User): User {
    const clone: any = { ...user }
    delete clone.password
    delete clone.passwordSalt
    return clone as User
  }





  // ==================== User Management ====================
  getUsers(): User[] {
    const data = localStorage.getItem(this.USERS_KEY)
    return data ? JSON.parse(data) : []
  }

  async getUsersAsync(): Promise<User[]> {
    try {
      const users = await firebaseRepo.getUsers()
      return users as unknown as User[]
    } catch (error) {
      console.error('Failed to get user list:', error)
      return this.getUsers()
    }
  }

  private saveUsers(users: User[]): void {
    const sanitized = users.map(u => this.sanitizeUserForLocal(u))
    localStorage.setItem(this.USERS_KEY, JSON.stringify(sanitized))
  }

  getUserById(id: number | string): User | null {
    const users = this.getUsers()
    return users.find(user => user.id === id) || null
  }

  async getUserByIdAsync(id: number | string): Promise<User | null> {
    try {
      const user = await firebaseRepo.getUserById(id)
      return user as User
    } catch (error) {
      console.error('Failed to get user:', error)
      return this.getUserById(id) // Fallback to local
    }
  }

  async getUserByPhoneAsync(phone: string): Promise<User | null> {
    try {
      const user = await firebaseRepo.getUserByPhone(phone)
      return user as User
    } catch (error) {
      console.error('Cloud get user by phone failed:', error)
      return this.getUserByPhone(phone)
    }
  }

  async getUserByEmailAsync(email: string): Promise<User | null> {
    try {
      const user = await firebaseRepo.getUserByEmail(email)
      return user as User
    } catch (error) {
      console.error('Cloud get user by email failed:', error)
      return this.getUserByEmail(email)
    }
  }

  async getUserByUsernameAsync(username: string): Promise<User | null> {
    try {
      const user = await firebaseRepo.getUserByUsername(username)
      return user as User
    } catch (error) {
      console.error('Cloud get user by username failed:', error)
      return this.getUserByUsername(username)
    }
  }

  async createUserAsync(userData: CreateUserInput): Promise<User> {
    try {
      const newUser = {
        ...userData,
        points: userData.points ?? 0,
        status: userData.status || 'active',
        membershipType: userData.membershipType || 'none',
        createdAt: new Date().toISOString(),
        totalEarnings: 0,
        subscriptionEarnings: 0,
        tipEarnings: 0,
        role: userData.role || 'user',
        registerType: userData.registerType || 'phone',
        isVerified: userData.isVerified || false,
        specialties: userData.specialties || [],
        socialLinks: userData.socialLinks || {}
      }
      
      const createdUser = await firebaseRepo.createUser(newUser) as User
      
      const users = this.getUsers()
      users.push(createdUser)
      this.saveUsers(users)
      
      return createdUser
    } catch (error) {
      console.error('Cloud create user failed:', error)
      return this.createUser(userData)
    }
  }

  async validateLoginAsync(identifier: string, password: string): Promise<User | null> {
    try {
      let user: User | null = null;
      
      // Try finding user by different identifier types
      if (identifier.includes('@')) {
          user = await this.getUserByEmailAsync(identifier);
      } else if (/^\d{11}$/.test(identifier)) {
          user = await this.getUserByPhoneAsync(identifier);
      } 
      
      // If not found, or might be username (admin)
      if (!user) {
         user = await this.getUserByUsernameAsync(identifier);
      }
      
      if (user && user.status === 'active') {
          const ok = await verifyPasswordHash(password, { password: user.password, passwordSalt: user.passwordSalt })
          if (ok) {
            await this.updateUserAsync(user.id, { lastLoginAt: new Date().toISOString() })
            return user
          }
      }
      return null;
    } catch (error) {
      console.error('Cloud login validation failed:', error)
      return null
    }
  }

  getUserByPhone(phone: string): User | null {
    const users = this.getUsers()
    return users.find(user => user.phone === phone) || null
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers()
    return users.find(user => user.email === email) || null
  }

  getUserByUsername(username: string): User | null {
    const users = this.getUsers()
    return users.find(user => user.username === username) || null
  }

  // Create new user (registration)
  createUser(userData: CreateUserInput): User {
    const users = this.getUsers()
    
    // Generate new user ID - supports numeric and string IDs
    const numericIds = users.filter(u => typeof u.id === 'number').map(u => u.id as number)
    const newId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1
    
    const newUser: User = {
      id: newId,
      // Required fields
      username: userData.username,
      password: userData.password,
      role: userData.role,
      
      // Optional fields with default values
      nickname: userData.nickname,
      phone: userData.phone,
      email: userData.email,
      realName: userData.realName,
      avatar: userData.avatar,
      bio: userData.bio,
      registerType: userData.registerType,
      isVerified: userData.isVerified || false,
      specialties: userData.specialties || [],
      socialLinks: userData.socialLinks || {},
      
      // System default values - supports initial points
      points: userData.points ?? 0,
      status: userData.status || 'active',
      membershipType: userData.membershipType || 'none',
      createdAt: new Date().toISOString(),
      totalEarnings: 0,
      subscriptionEarnings: 0,
      tipEarnings: 0
    }
    
    users.push(newUser)
    this.saveUsers(users)
    
    console.log('New user created:', newUser)
    return newUser
  }

  // Update user info
  updateUser(id: number | string, updates: Partial<User>): User | null {
    const users = this.getUsers()
    const userIndex = users.findIndex(user => user.id === id)
    
    if (userIndex === -1) return null
    
    const merged: any = { ...users[userIndex], ...updates }
    delete merged.password
    delete merged.passwordSalt
    users[userIndex] = merged
    
    this.saveUsers(users)
    
    // If updating current user, sync current user cache
    const currentUser = this.getCurrentUser()
    if (currentUser && currentUser.id === id) {
      this.setCurrentUser(users[userIndex])
    }
    
    return users[userIndex]
  }

  async updateUserAsync(id: number | string, updates: Partial<User>): Promise<boolean> {
    try {
      const success = await firebaseRepo.updateUser(id, updates)
      if (success) {
        this.updateUser(id, updates)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to update user:', error)
      return false
    }
  }

  // Check if user exists
  checkUserExists(phone?: string, email?: string, username?: string): boolean {
    const users = this.getUsers()
    
    return users.some(user => 
      (phone && user.phone === phone) ||
      (email && user.email === email) ||
      (username && user.username === username)
    )
  }

  // Current user management
  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.CURRENT_USER_KEY)
    return userData ? JSON.parse(userData) : null
  }

  async getCurrentUserAsync(): Promise<User | null> {
    const localUser = this.getCurrentUser()
    if (!localUser) return null
    
    try {
      // Refresh from server
      const freshUser = await this.getUserByIdAsync(localUser.id)
      
      if (freshUser) {
          // Update the current user session storage with fresh data
          this.setCurrentUser(freshUser)
          return freshUser
      }
      return localUser
    } catch (error) {
      console.error('Failed to refresh current user:', error)
      return localUser
    }
  }

  setCurrentUser(user: User): void {
    const sanitized = this.sanitizeUserForLocal(user)
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(sanitized))
  }

  clearCurrentUser(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY)
  }

  // ==================== Point Transaction Management ====================
  
  getPointTransactions(): PointTransaction[] {
    const data = localStorage.getItem(this.POINT_TRANSACTIONS_KEY)
    return data ? JSON.parse(data) : []
  }

  async getPointTransactionsAsync(): Promise<PointTransaction[]> {
    try {
      const transactions = await firebaseRepo.getPointTransactions()
      return (transactions as any[]).map((t) => {
        let createdAt: any = (t as any).createdAt
        if (createdAt && typeof createdAt === 'object') {
          if (typeof createdAt.toDate === 'function') {
            createdAt = createdAt.toDate().toISOString()
          } else if (typeof createdAt.seconds === 'number') {
            createdAt = new Date(createdAt.seconds * 1000).toISOString()
          }
        }

        let processedAt: any = (t as any).processedAt || (t as any).paidAt
        if (processedAt && typeof processedAt === 'object') {
          if (typeof processedAt.toDate === 'function') {
            processedAt = processedAt.toDate().toISOString()
          } else if (typeof processedAt.seconds === 'number') {
            processedAt = new Date(processedAt.seconds * 1000).toISOString()
          }
        }

        return {
          ...(t as any),
          createdAt: createdAt || new Date().toISOString(),
          processedAt: processedAt || (t as any).processedAt
        } as PointTransaction
      })
    } catch (error) {
      console.error('Failed to get point transactions:', error)
      return this.getPointTransactions()
    }
  }

  private savePointTransactions(transactions: PointTransaction[]): void {
    localStorage.setItem(this.POINT_TRANSACTIONS_KEY, JSON.stringify(transactions))
  }

  getUserPointTransactions(userId: number | string): PointTransaction[] {
    return this.getPointTransactions().filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Create point transaction record
  createPointTransaction(data: Omit<PointTransaction, 'id' | 'createdAt' | 'balance' | 'userName'>): PointTransaction {
    const transactions = this.getPointTransactions()
    const user = this.getUserById(data.userId)
    
    if (!user) {
      throw new Error('User not found')
    }

    const newBalance = user.points + data.amount

    // Check points cannot be negative
    if (newBalance < 0) {
      throw new Error('Insufficient points, cannot complete this operation')
    }

    const newTransaction: PointTransaction = {
      id: this.generateId('pt'),
      userName: user.nickname || user.username,
      ...data,
      balance: newBalance,
      createdAt: new Date().toISOString(),
      processedAt: data.status === 'completed' ? new Date().toISOString() : undefined
    }

    transactions.push(newTransaction)
    this.savePointTransactions(transactions)

    // If transaction completed, update user points
    if (data.status === 'completed') {
      this.updateUser(data.userId, { points: newBalance })
    }

    console.log('Point transaction created:', newTransaction)
    return newTransaction
  }

  // Update point transaction status
  updatePointTransaction(id: string, updates: Partial<PointTransaction>): PointTransaction | null {
    const transactions = this.getPointTransactions()
    const transactionIndex = transactions.findIndex(t => t.id === id)
    
    if (transactionIndex === -1) return null
    
    const oldTransaction = transactions[transactionIndex]
    transactions[transactionIndex] = { 
      ...oldTransaction, 
      ...updates,
      processedAt: updates.status === 'completed' ? new Date().toISOString() : oldTransaction.processedAt
    }
    
    this.savePointTransactions(transactions)

    // If status becomes completed, update user points
    if (updates.status === 'completed' && oldTransaction.status !== 'completed') {
      this.updateUser(oldTransaction.userId, { points: transactions[transactionIndex].balance })
    }
    
    return transactions[transactionIndex]
  }

  // ==================== Recharge Management ====================
  
  getRechargeOrders(): RechargeOrder[] {
    const data = localStorage.getItem(this.RECHARGE_ORDERS_KEY)
    return data ? JSON.parse(data) : []
  }

  private saveRechargeOrders(orders: RechargeOrder[]): void {
    localStorage.setItem(this.RECHARGE_ORDERS_KEY, JSON.stringify(orders))
  }

  getUserRechargeOrders(userId: number | string): RechargeOrder[] {
    return this.getRechargeOrders().filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Create recharge order
  createRechargeOrder(userId: number | string, amount: number, paymentMethod: 'alipay' | 'wechat' | 'bank'): RechargeOrder {
    const user = this.getUserById(userId)
    if (!user) throw new Error('User not found')

    const exchangeRate = 100 // 1 CNY = 100 points
    
    const newOrder: RechargeOrder = {
      id: this.generateId('ro'),
      userId,
      userName: user.nickname || user.username,
      amount,
      points: amount * exchangeRate,
      exchangeRate,
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    const orders = this.getRechargeOrders()
    orders.push(newOrder)
    this.saveRechargeOrders(orders)
    
    console.log('Recharge order created:', newOrder)
    return newOrder
  }

  // Complete recharge (simulate payment success)
  completeRechargeOrder(orderId: string): { order: RechargeOrder, transaction: PointTransaction } | null {
    const orders = this.getRechargeOrders()
    const orderIndex = orders.findIndex(o => o.id === orderId)
    
    if (orderIndex === -1 || orders[orderIndex].status !== 'pending') {
      return null
    }

    // Update order status
    orders[orderIndex].status = 'completed'
    orders[orderIndex].paidAt = new Date().toISOString()
    
    const order = orders[orderIndex]

    // Create point transaction record
    const transaction = this.createPointTransaction({
      userId: order.userId,
      type: 'recharge',
      amount: order.points,
      description: `Recharge $${order.amount} to get ${order.points} points`,
      status: 'completed',
      relatedOrderId: order.id,
      paymentMethod: order.paymentMethod
    })

    // Link transaction ID
    orders[orderIndex].transactionId = transaction.id
    this.saveRechargeOrders(orders)

    console.log('Recharge order completed:', order, transaction)
    return { order: orders[orderIndex], transaction }
  }

  // Async create recharge order
  async createRechargeOrderAsync(userId: number | string, amount: number, paymentMethod: 'alipay' | 'wechat' | 'bank'): Promise<RechargeOrder> {
    try {
      const user = await this.getUserByIdAsync(userId)
      if (!user) throw new Error('User not found')

      const exchangeRate = 100
      
      const newOrder: any = {
        userId: userId.toString(),
        userName: user.nickname || user.username,
        amount,
        points: amount * exchangeRate,
        exchangeRate,
        paymentMethod,
        status: 'pending'
      }

      const createdOrder = await firebaseRepo.createRechargeOrder(newOrder)
      return createdOrder as RechargeOrder
    } catch (error) {
      console.error('Failed to create recharge order:', error)
      return this.createRechargeOrder(userId, amount, paymentMethod)
    }
  }

  // Async complete recharge order
  async completeRechargeOrderAsync(orderId: string): Promise<{ order: RechargeOrder, transaction: PointTransaction } | null> {
    try {
      const order = await firebaseRepo.getRechargeOrder(orderId) as RechargeOrder
      if (!order || order.status !== 'pending') {
        const localResult = this.completeRechargeOrder(orderId)
        return localResult
      }

      // Update order status
      await firebaseRepo.updateRechargeOrder(orderId, {
        status: 'completed',
        paidAt: new Date().toISOString()
      })

      // Create transaction
      const transactionData = {
        userId: order.userId.toString(),
        userName: order.userName,
        type: 'recharge',
        amount: order.points,
        description: `Recharge $${order.amount} to get ${order.points} points`,
        status: 'completed',
        relatedOrderId: order.id,
        paymentMethod: order.paymentMethod
      }
      
      const transaction = await firebaseRepo.addPointTransaction(transactionData)

      // Update user points
      const user = await this.getUserByIdAsync(order.userId)
      if (user) {
        const newPoints = (user.points || 0) + order.points
        await firebaseRepo.updateUser(user.id, { points: newPoints })
        this.updateUser(user.id, { points: newPoints })
      }

      return { order: { ...order, status: 'completed' } as RechargeOrder, transaction: transaction as unknown as PointTransaction }
    } catch (error) {
      console.error('Failed to complete recharge order:', error)
      return this.completeRechargeOrder(orderId)
    }
  }

  // Async get all recharge orders
  async getRechargeOrdersAsync(): Promise<RechargeOrder[]> {
    try {
      const orders = await firebaseRepo.getRechargeOrders()
      return orders as unknown as RechargeOrder[]
    } catch (error) {
      console.error('getRechargeOrdersAsync failed:', error)
      return this.getRechargeOrders()
    }
  }

  // Async get user recharge orders
  async getUserRechargeOrdersAsync(userId: number | string): Promise<RechargeOrder[]> {
    try {
      const orders = await firebaseRepo.getUserRechargeOrders(userId.toString())
      return orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as unknown as RechargeOrder[]
    } catch (error) {
      console.error('getUserRechargeOrdersAsync failed:', error)
      return this.getUserRechargeOrders(userId)
    }
  }

  // ==================== Membership Management ====================
  
  getMembershipRecords(): MembershipRecord[] {
    const data = localStorage.getItem(this.MEMBERSHIP_RECORDS_KEY)
    return data ? JSON.parse(data) : []
  }

  private saveMembershipRecords(records: MembershipRecord[]): void {
    localStorage.setItem(this.MEMBERSHIP_RECORDS_KEY, JSON.stringify(records))
  }

  getUserMembershipRecords(userId: number | string): MembershipRecord[] {
    return this.getMembershipRecords().filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Get user current membership status
  getUserMembershipStatus(userId: number | string): { isMember: boolean, type?: string, endDate?: string } {
    const records = this.getUserMembershipRecords(userId)
    const now = new Date()
    
    const activeRecord = records.find(r => 
      r.status === 'active' && 
      new Date(r.endDate) > now
    )

    if (activeRecord) {
      return {
        isMember: true,
        type: activeRecord.type,
        endDate: activeRecord.endDate
      }
    }

    // If no record, try to determine from user info (compatibility for old data or simplified logic)
    const user = this.getUserById(userId)
    if (user && user.membershipType !== 'none' && user.membershipEndDate) {
      if (new Date(user.membershipEndDate) > now) {
        return {
          isMember: true,
          type: user.membershipType,
          endDate: user.membershipEndDate
        }
      }
    }

    return { isMember: false }
  }

  // Async get user current membership status
  async getUserMembershipStatusAsync(userId: number | string): Promise<{ isMember: boolean, type?: string, endDate?: string }> {
    try {
      // Get latest user info from Firebase
      const user = await firebaseRepo.getUserById(userId) as unknown as User
      if (user && user.membershipType !== 'none' && user.membershipEndDate) {
        const now = new Date()
        const endDate = new Date(user.membershipEndDate)
        if (endDate > now) {
          return {
            isMember: true,
            type: user.membershipType,
            endDate: user.membershipEndDate
          }
        }
      }
      return { isMember: false }
    } catch (error) {
      console.error('Failed to get membership status:', error)
      return this.getUserMembershipStatus(userId)
    }
  }

  // Purchase membership
  purchaseMembership(userId: number | string, type: 'monthly' | 'yearly'): { record: MembershipRecord, transaction: PointTransaction } {
    const user = this.getUserById(userId)
    if (!user) throw new Error('User not found')

    const prices = {
      monthly: 1000, // 1000 points/month
      yearly: 10000  // 10000 points/year (price of 10 months)
    }

    const price = prices[type]
    
    if (user.points < price) {
      throw new Error('Insufficient points')
    }

    // Calculate membership duration
    const now = new Date()
    const duration = type === 'monthly' ? 1 : 12 // Months
    const endDate = new Date(now.getFullYear(), now.getMonth() + duration, now.getDate())

    // Create point transaction record
    const transaction = this.createPointTransaction({
      userId,
      type: 'membership',
      amount: -price, // Negative for expense
      description: `Purchase ${type === 'monthly' ? 'monthly' : 'yearly'} membership`,
      status: 'completed'
    })

    // Create membership record
    const records = this.getMembershipRecords()
    const newRecord: MembershipRecord = {
      id: this.generateId('mr'),
      userId,
      userName: user.nickname || user.username,
      type,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      price,
      status: 'active',
      autoRenewal: false,
      createdAt: new Date().toISOString(),
      transactionId: transaction.id
    }

    records.push(newRecord)
    this.saveMembershipRecords(records)

    // Update user membership type and expiration time
    this.updateUser(userId, { 
      membershipType: type,
      membershipEndDate: endDate.toISOString()
    })

    console.log('Membership purchase successful:', newRecord, transaction)
    return { record: newRecord, transaction }
  }

  // Async purchase membership
  async purchaseMembershipAsync(userId: number | string, type: 'monthly' | 'yearly'): Promise<{ record: MembershipRecord, transaction: PointTransaction }> {
    try {
      const user = await this.getUserByIdAsync(userId)
      if (!user) throw new Error('User not found')

      const prices = {
        monthly: 1000,
        yearly: 10000
      }
      const price = prices[type]
      
      if ((user.points || 0) < price) {
        throw new Error('Insufficient points')
      }

      const now = new Date()
      const duration = type === 'monthly' ? 1 : 12
      const endDate = new Date(now.getFullYear(), now.getMonth() + duration, now.getDate())

      // Create transaction
      const transactionData = {
        userId: userId.toString(),
        userName: user.nickname || user.username,
        type: 'membership',
        amount: -price,
        description: `Purchase ${type === 'monthly' ? 'monthly' : 'yearly'} membership`,
        status: 'completed'
      }
      const transaction = await firebaseRepo.addPointTransaction(transactionData)

      // Create membership record
      const recordData = {
        userId: userId.toString(),
        userName: user.nickname || user.username,
        type,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        price,
        status: 'active',
        autoRenewal: false,
        transactionId: transaction.id
      }
      const record = await firebaseRepo.addMembershipRecord(recordData)

      // Update user
      await firebaseRepo.updateUser(userId, {
        points: (user.points || 0) - price,
        membershipType: type,
        membershipEndDate: endDate.toISOString()
      })
      
      this.updateUser(userId, {
        points: (user.points || 0) - price,
        membershipType: type,
        membershipEndDate: endDate.toISOString()
      })

      return { record: record as unknown as MembershipRecord, transaction: transaction as unknown as PointTransaction }
    } catch (error) {
      console.error('Failed to purchase membership:', error)
      return this.purchaseMembership(userId, type)
    }
  }

  // Async get all membership records
  async getMembershipRecordsAsync(): Promise<MembershipRecord[]> {
    try {
      const records = await firebaseRepo.getMembershipRecords()
      return records as unknown as MembershipRecord[]
    } catch (error) {
      console.error('getMembershipRecordsAsync failed:', error)
      return this.getMembershipRecords()
    }
  }

  // Async get user membership records
  async getUserMembershipRecordsAsync(userId: number | string): Promise<MembershipRecord[]> {
    try {
      const records = await firebaseRepo.getUserMembershipRecords(userId.toString())
      return records.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as unknown as MembershipRecord[]
    } catch (error) {
      console.error('getUserMembershipRecordsAsync failed:', error)
      return this.getUserMembershipRecords(userId)
    }
  }

  // ==================== Withdraw Management ====================
  
  getWithdrawRequests(): WithdrawRequest[] {
    const data = localStorage.getItem(this.WITHDRAW_REQUESTS_KEY)
    return data ? JSON.parse(data) : []
  }

  private saveWithdrawRequests(requests: WithdrawRequest[]): void {
    localStorage.setItem(this.WITHDRAW_REQUESTS_KEY, JSON.stringify(requests))
  }

  getUserWithdrawRequests(userId: number | string): WithdrawRequest[] {
    return this.getWithdrawRequests().filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Async get user withdraw requests
  async getUserWithdrawRequestsAsync(userId: number | string): Promise<WithdrawRequest[]> {
    try {
      const requests = await firebaseRepo.getUserWithdrawRequests(userId.toString())
      return requests as unknown as WithdrawRequest[]
    } catch (error) {
      console.error('Failed to get withdraw records:', error)
      return this.getUserWithdrawRequests(userId)
    }
  }

  // Create withdraw request
  createWithdrawRequest(
    userId: number | string, 
    points: number, 
    bankInfo: WithdrawRequest['bankInfo']
  ): WithdrawRequest {
    const user = this.getUserById(userId)
    if (!user) throw new Error('User not found')

    if (user.points < points) {
      throw new Error('Insufficient points')
    }

    const minWithdraw = 1 // Minimum withdraw 1 point
    if (points < minWithdraw) {
      throw new Error(`Minimum withdraw amount is ${minWithdraw} points`)
    }

    const exchangeRate = 100 // 100 points = 1 CNY
    const amount = points / exchangeRate

    // Deduct points first (create pending transaction)
    const transaction = this.createPointTransaction({
      userId,
      type: 'withdraw',
      amount: -points,
      description: `Request withdraw ${points} points (approx ¥${amount.toFixed(2)})`,
      status: 'completed' // Deduct points immediately
    })

    const requests = this.getWithdrawRequests()
    const newRequest: WithdrawRequest = {
      id: this.generateId('wr'),
      userId,
      userName: user.nickname || user.username,
      points,
      amount,
      exchangeRate,
      bankInfo,
      status: 'pending',
      createdAt: new Date().toISOString(),
      transactionId: transaction.id
    }

    requests.push(newRequest)
    this.saveWithdrawRequests(requests)

    console.log('Withdraw request created:', newRequest)
    return newRequest
  }

  // Async create withdraw request
  async createWithdrawRequestAsync(userId: number | string, points: number, bankInfo: WithdrawRequest['bankInfo']): Promise<WithdrawRequest> {
    try {
      const user = await this.getUserByIdAsync(userId)
      if (!user) throw new Error('User not found')

      if ((user.points || 0) < points) {
        throw new Error('Insufficient points')
      }

      const minWithdraw = 1
      if (points < minWithdraw) {
        throw new Error(`Minimum withdraw amount is ${minWithdraw} points`)
      }

      const exchangeRate = 100
      const amount = points / exchangeRate

      // Deduct points first
      const transactionData = {
        userId: userId.toString(),
        userName: user.nickname || user.username,
        type: 'withdraw',
        amount: -points,
        description: `Request withdraw ${points} points (approx ¥${amount.toFixed(2)})`,
        status: 'completed'
      }
      const transaction = await firebaseRepo.addPointTransaction(transactionData)
      
      // Update user points
      const newPoints = (user.points || 0) - points
      await firebaseRepo.updateUser(userId, { points: newPoints })
      this.updateUser(userId, { points: newPoints })

      // Create withdraw request
      const requestData: any = {
        userId: userId.toString(),
        userName: user.nickname || user.username,
        points,
        amount,
        exchangeRate,
        bankInfo,
        status: 'pending',
        transactionId: transaction.id
      }
      
      const request = await firebaseRepo.createWithdrawRequest(requestData)
      return request as WithdrawRequest
    } catch (error) {
      console.error('Failed to create withdraw request:', error)
      return this.createWithdrawRequest(userId, points, bankInfo)
    }
  }

  // Process withdraw request (Admin feature)
  processWithdrawRequest(
    requestId: string, 
    action: 'approve' | 'reject', 
    processedBy: number,
    rejectReason?: string
  ): WithdrawRequest | null {
    const requests = this.getWithdrawRequests()
    const requestIndex = requests.findIndex(r => r.id === requestId)
    
    if (requestIndex === -1 || requests[requestIndex].status !== 'pending') {
      return null
    }

    const request = requests[requestIndex]
    const processor = this.getUserById(processedBy)
    const now = new Date().toISOString()

    if (action === 'approve') {
      requests[requestIndex].status = 'approved'
      requests[requestIndex].processedAt = now
      requests[requestIndex].processedBy = processedBy
      requests[requestIndex].processedByName = processor?.nickname || processor?.username || 'Admin'
    } else {
      requests[requestIndex].status = 'rejected'
      requests[requestIndex].processedAt = now
      requests[requestIndex].processedBy = processedBy
      requests[requestIndex].processedByName = processor?.nickname || processor?.username || 'Admin'
      requests[requestIndex].rejectReason = rejectReason

      // Reject withdraw, refund points
      this.createPointTransaction({
        userId: request.userId,
        type: 'reward',
        amount: request.points,
        description: `Withdraw request rejected, points refunded: ${rejectReason || 'Audit failed'}`,
        status: 'completed'
      })
    }

    this.saveWithdrawRequests(requests)
    console.log('Withdraw request processing completed:', requests[requestIndex])
    return requests[requestIndex]
  }

  // Async process withdraw request
  async processWithdrawRequestAsync(
    requestId: string,
    action: 'approve' | 'reject',
    processedBy: number | string,
    rejectReason?: string
  ): Promise<WithdrawRequest | null> {
    try {
      const request = await firebaseRepo.getWithdrawRequestById(requestId) as unknown as WithdrawRequest
      if (!request || request.status !== 'pending') {
        return null
      }

      const processor = await this.getUserByIdAsync(processedBy)
      const now = new Date().toISOString()
      const processorName = processor?.nickname || processor?.username || 'Admin'

      if (action === 'approve') {
        // Just update status
        await firebaseRepo.updateWithdrawRequest(requestId, {
          status: 'approved',
          processedAt: now,
          processedBy,
          processedByName: processorName
        })
        
        return {
          ...request,
          status: 'approved',
          processedAt: now,
          processedBy,
          processedByName: processorName
        }
      } else {
        // Reject: Update status AND refund points
        await firebaseRepo.updateWithdrawRequest(requestId, {
          status: 'rejected',
          processedAt: now,
          processedBy,
          processedByName: processorName,
          rejectReason
        })

        // Refund points
        const transactionData = {
          userId: request.userId.toString(),
          userName: request.userName,
          type: 'reward', // Refund as reward/income
          amount: request.points,
          description: `Withdraw request rejected, points refunded: ${rejectReason || 'Audit failed'}`,
          status: 'completed'
        }
        await firebaseRepo.addPointTransaction(transactionData)

        // Update user points
        const user = await this.getUserByIdAsync(request.userId)
        if (user) {
          const newPoints = (user.points || 0) + request.points
          await firebaseRepo.updateUser(user.id, { points: newPoints })
          this.updateUser(user.id, { points: newPoints })
        }

        return {
          ...request,
          status: 'rejected',
          processedAt: now,
          processedBy,
          processedByName: processorName,
          rejectReason
        }
      }
    } catch (error) {
      console.error('Failed to process withdraw request:', error)
      return this.processWithdrawRequest(requestId, action, Number(processedBy), rejectReason)
    }
  }

  // ==================== Like Feature ====================
  
  getLikes(): LikeRecord[] {
    const data = localStorage.getItem(this.LIKES_KEY)
    return data ? JSON.parse(data) : []
  }

  private saveLikes(likes: LikeRecord[]): void {
    localStorage.setItem(this.LIKES_KEY, JSON.stringify(likes))
  }

  // Like article
  likeArticle(userId: number | string, articleId: string): boolean {
    try {
      const likes = this.getLikes()
      
      // Check if already liked
      const existingLike = likes.find(like => 
        like.userId === userId && like.articleId === articleId
      )
      
      if (existingLike) {
        // Unlike
        const updatedLikes = likes.filter(like => like.id !== existingLike.id)
        this.saveLikes(updatedLikes)
        
        // Update article like count
        this.updateArticleLikeCount(articleId, -1)
        return false
      } else {
        // Add like
        const newLike: LikeRecord = {
          id: this.generateId('like'),
          userId,
          articleId,
          createdAt: new Date().toISOString()
        }
        
        likes.push(newLike)
        this.saveLikes(likes)
        
        // Update article like count
        this.updateArticleLikeCount(articleId, 1)
        return true
      }
    } catch (error) {
      console.error('Like operation failed:', error)
      return false
    }
  }

  // Check if user liked article
  isArticleLiked(userId: number | string, articleId: string): boolean {
    const likes = this.getLikes()
    return likes.some(like => like.userId === userId && like.articleId === articleId)
  }

  // Async toggle like
  async likeArticleAsync(userId: number | string, articleId: string): Promise<boolean> {
    try {
      return await firebaseRepo.toggleLike(userId.toString(), articleId)
    } catch (error) {
      console.error('Like operation failed:', error)
      return false
    }
  }

  // Async check like status
  async isArticleLikedAsync(userId: number | string, articleId: string): Promise<boolean> {
    try {
      return await firebaseRepo.isArticleLiked(userId.toString(), articleId)
    } catch (error) {
      console.error('Failed to check like status:', error)
      return false
    }
  }

  // Async toggle bookmark
  async bookmarkArticleAsync(userId: number | string, articleId: string): Promise<boolean> {
    try {
      return await firebaseRepo.toggleBookmark(userId.toString(), articleId)
    } catch (error) {
      console.error('Bookmark operation failed:', error)
      return false
    }
  }

  // Async check bookmark status
  async isArticleBookmarkedAsync(userId: number | string, articleId: string): Promise<boolean> {
    try {
      return await firebaseRepo.isArticleBookmarked(userId.toString(), articleId)
    } catch (error) {
      console.error('Failed to check bookmark status:', error)
      return false
    }
  }

  // Async toggle follow
  async followUserAsync(followerId: number | string, followingId: number | string): Promise<boolean> {
    try {
      return await firebaseRepo.toggleFollow(followerId.toString(), followingId.toString())
    } catch (error) {
      console.error('Follow operation failed:', error)
      return false
    }
  }

  // Async check follow status
  async isUserFollowedAsync(followerId: number | string, followingId: number | string): Promise<boolean> {
    try {
      return await firebaseRepo.isUserFollowed(followerId.toString(), followingId.toString())
    } catch (error) {
      console.error('Failed to check follow status:', error)
      return false
    }
  }

  // Async check if article is purchased
  async checkArticlePurchasedAsync(userId: number | string, articleId: string): Promise<boolean> {
    try {
      return await firebaseRepo.isArticlePurchased(userId.toString(), articleId)
    } catch (error) {
      console.error('Failed to check article purchase status:', error)
      return false
    }
  }

  // Async purchase article
  async purchaseArticleAsync(userId: number | string, articleId: string, price: number): Promise<boolean> {
    try {
      // 1. Get latest user info
      const user = await firebaseRepo.getUserById(userId) as unknown as User
      if (!user) throw new Error('User not found')
      
      if ((user.points || 0) < price) {
        throw new Error('Insufficient points')
      }

      // 2. Deduct points
      const newPoints = (user.points || 0) - price
      await firebaseRepo.updateUser(userId, { points: newPoints })
      
      // Update local cache for consistency
      this.updateUser(userId, { points: newPoints })

      // 3. Record transaction
      await firebaseRepo.addPointTransaction({
        userId: userId.toString(),
        userName: user.nickname || user.username || 'Unknown',
        type: 'purchase',
        amount: -price,
        balance: newPoints,
        description: `Purchase article`,
        status: 'completed',
        relatedArticleId: articleId
      })

      // 4. Record purchase
      await firebaseRepo.addPurchasedArticle({
        userId: userId.toString(),
        articleId,
        price
      })

      return true
    } catch (error) {
      console.error('Failed to purchase article:', error)
      throw error
    }
  }

  // Async tip article
  async tipArticleAsync(userId: number | string, articleId: string, amount: number): Promise<boolean> {
    try {
      // 1. Get latest user info
      const user = await firebaseRepo.getUserById(userId) as unknown as User
      if (!user) throw new Error('User not found')
      
      if ((user.points || 0) < amount) {
        throw new Error('Insufficient points')
      }

      // 2. Deduct points
      const newPoints = (user.points || 0) - amount
      await firebaseRepo.updateUser(userId, { points: newPoints })
      
      // Update local cache for consistency
      this.updateUser(userId, { points: newPoints })

      // 3. Record transaction
      await firebaseRepo.addPointTransaction({
        userId: userId.toString(),
        userName: user.nickname || user.username || 'Unknown',
        type: 'tip',
        amount: -amount,
        balance: newPoints,
        description: `Tip article`,
        status: 'completed',
        relatedArticleId: articleId
      })

      return true
    } catch (error) {
      console.error('Failed to tip article:', error)
      throw error
    }
  }

  // Async get user liked article IDs
  async getUserLikedArticleIdsAsync(userId: number | string): Promise<string[]> {
    try {
      return await firebaseRepo.getUserLikedArticleIds(userId.toString())
    } catch (error) {
      console.error('Failed to get user liked article IDs:', error)
      return []
    }
  }

  // Async get user bookmarked article IDs
  async getUserBookmarkedArticleIdsAsync(userId: number | string): Promise<string[]> {
    try {
      return await firebaseRepo.getUserBookmarkedArticleIds(userId.toString())
    } catch (error) {
      console.error('Failed to get user bookmarked article IDs:', error)
      return []
    }
  }

  // Async get user following IDs
  async getUserFollowingIdsAsync(followerId: number | string): Promise<string[]> {
    try {
      return await firebaseRepo.getUserFollowingIds(followerId.toString())
    } catch (error) {
      console.error('Failed to get user following IDs:', error)
      return []
    }
  }

  // Async add comment
  async addCommentAsync(comment: any): Promise<any> {
    try {
      return await firebaseRepo.addComment(comment)
    } catch (error) {
      console.error('Failed to add comment:', error)
      throw error
    }
  }

  // Async get article comments
  async getCommentsAsync(articleId: string): Promise<any[]> {
    try {
      return await firebaseRepo.getComments(articleId)
    } catch (error) {
      console.error('Failed to get comments:', error)
      return []
    }
  }

  // Get user liked articles
  getUserLikedArticles(userId: number | string): Article[] {
    try {
      const likes = this.getLikes()
      const userLikes = likes.filter(like => like.userId === userId)
      const articles = this.getArticles()
      
      return userLikes.map(like => {
        const article = articles.find(a => a.id === like.articleId)
        return article
      }).filter(article => article !== undefined) as Article[]
    } catch (error) {
      console.error('Failed to get user liked articles:', error)
      return []
    }
  }

  // Async get user liked articles
  async getUserLikedArticlesAsync(userId: number | string): Promise<Article[]> {
    try {
      const articleIds = await firebaseRepo.getUserLikedArticleIds(userId.toString())
      if (!articleIds.length) return []
      
      const articlePromises = articleIds.map(id => firebaseRepo.getArticleById(id))
      const articles = await Promise.all(articlePromises)
      
      return articles.filter(a => a !== null) as unknown as Article[]
    } catch (error) {
      console.error('getUserLikedArticlesAsync failed:', error)
      return this.getUserLikedArticles(userId)
    }
  }

  // ==================== Bookmark Feature ====================
  
  getBookmarks(): BookmarkRecord[] {
    const data = localStorage.getItem(this.BOOKMARKS_KEY)
    return data ? JSON.parse(data) : []
  }

  private saveBookmarks(bookmarks: BookmarkRecord[]): void {
    localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(bookmarks))
  }

  // Bookmark article
  bookmarkArticle(userId: number | string, articleId: string): boolean {
    try {
      const bookmarks = this.getBookmarks()
      
      // Check if already bookmarked
      const existingBookmark = bookmarks.find(bookmark => 
        bookmark.userId === userId && bookmark.articleId === articleId
      )
      
      if (existingBookmark) {
        // Remove bookmark
        const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== existingBookmark.id)
        this.saveBookmarks(updatedBookmarks)
        return false
      } else {
        // Add bookmark
        const newBookmark: BookmarkRecord = {
          id: this.generateId('bookmark'),
          userId,
          articleId,
          createdAt: new Date().toISOString()
        }
        
        bookmarks.push(newBookmark)
        this.saveBookmarks(bookmarks)
        return true
      }
    } catch (error) {
      console.error('Bookmark operation failed:', error)
      return false
    }
  }

  // Check if user has bookmarked article
  isArticleBookmarked(userId: number | string, articleId: string): boolean {
    const bookmarks = this.getBookmarks()
    return bookmarks.some(bookmark => bookmark.userId === userId && bookmark.articleId === articleId)
  }

  



  // Get user bookmarked articles
  getUserBookmarkedArticles(userId: number | string): Article[] {
    try {
      const bookmarks = this.getBookmarks()
      const userBookmarks = bookmarks.filter(bookmark => bookmark.userId === userId)
      const articles = this.getArticles()
      
      return (userBookmarks.map(bookmark => {
        const article = articles.find(a => a.id === bookmark.articleId)
        return article
      }).filter(article => article !== undefined) as Article[])
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (error) {
      console.error('Failed to get user bookmarked articles:', error)
      return []
    }
  }

  // Async get user bookmarked articles
  async getUserBookmarkedArticlesAsync(userId: number | string): Promise<Article[]> {
    try {
      const articleIds = await firebaseRepo.getUserBookmarkedArticleIds(userId.toString())
      if (!articleIds.length) return []
      
      const articlePromises = articleIds.map(id => firebaseRepo.getArticleById(id))
      const articles = await Promise.all(articlePromises)
      
      return articles
        .filter(a => a !== null)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as unknown as Article[]
    } catch (error) {
      console.error('getUserBookmarkedArticlesAsync failed:', error)
      return this.getUserBookmarkedArticles(userId)
    }
  }

  // ==================== Follow Feature ====================
  
  getFollows(): FollowRecord[] {
    const data = localStorage.getItem(this.FOLLOWS_KEY)
    return data ? JSON.parse(data) : []
  }

  private saveFollows(follows: FollowRecord[]): void {
    localStorage.setItem(this.FOLLOWS_KEY, JSON.stringify(follows))
  }

  // Follow user
  followUser(followerId: number | string, followingId: number | string): boolean {
    if (followerId === followingId) return false
    
    try {
      const follows = this.getFollows()
      
      // Check if already following
      const existingFollow = follows.find(follow => 
        follow.followerId === followerId && follow.followingId === followingId
      )
      
      if (existingFollow) {
        // Unfollow
        const updatedFollows = follows.filter(follow => follow.id !== existingFollow.id)
        this.saveFollows(updatedFollows)
        return false
      } else {
        // Add follow
        const newFollow: FollowRecord = {
          id: this.generateId('follow'),
          followerId,
          followingId,
          createdAt: new Date().toISOString()
        }
        
        follows.push(newFollow)
        this.saveFollows(follows)
        return true
      }
    } catch (error) {
      console.error('Follow operation failed:', error)
      return false
    }
  }

  // Async toggle follow
  async toggleFollowAsync(followerId: number | string, followingId: number | string): Promise<boolean> {
    try {
      const isFollowing = await firebaseRepo.toggleFollow(followerId.toString(), followingId.toString())
      return isFollowing // true = followed, false = unfollowed
    } catch (error) {
      console.error('Failed to toggle follow:', error)
      // Fallback to sync
      const result = this.followUser(followerId, followingId)
      return result
    }
  }

  // Async unfollow user
  async unfollowUserAsync(followerId: number | string, followingId: number | string): Promise<boolean> {
    try {
      // Check if following first to be safe, or just toggle if we know state
      // Since UI calls this when "Following", we assume we are following.
      // Calling toggle should unfollow.
      const isFollowing = await this.toggleFollowAsync(followerId, followingId)
      return !isFollowing // If isFollowing is false, then we successfully unfollowed
    } catch (error) {
      console.error('Failed to unfollow:', error)
      return false
    }
  }

  // Check if followed
  isUserFollowed(followerId: number | string, followingId: number | string): boolean {
    const follows = this.getFollows()
    return follows.some(follow => 
      follow.followerId === followerId && follow.followingId === followingId
    )
  }

  // Get user following list
  getUserFollowing(userId: number | string): User[] {
    try {
      const follows = this.getFollows()
      const userFollows = follows.filter(follow => follow.followerId === userId)
      const users = this.getUsers()
      
      return userFollows.map(follow => {
        const user = users.find(u => u.id === follow.followingId)
        return user
      }).filter(user => user !== undefined) as User[]
    } catch (error) {
      console.error('Failed to get following list:', error)
      return []
    }
  }

  // Get user followers list
  getUserFollowers(userId: number | string): User[] {
    try {
      const follows = this.getFollows()
      const userFollowers = follows.filter(follow => follow.followingId === userId)
      const users = this.getUsers()
      
      return userFollowers.map(follow => {
        const user = users.find(u => u.id === follow.followerId)
        return user
      }).filter(user => user !== undefined) as User[]
    } catch (error) {
      console.error('Failed to get followers list:', error)
      return []
    }
  }

  // Async get user following
  async getUserFollowingAsync(userId: number | string): Promise<User[]> {
    try {
      const followingIds = await firebaseRepo.getUserFollowingIds(userId.toString())
      if (!followingIds.length) return []
      
      const userPromises = followingIds.map(id => firebaseRepo.getUserById(id))
      const users = await Promise.all(userPromises)
      
      return users.filter(u => u !== null) as unknown as User[]
    } catch (error) {
      console.error('getUserFollowingAsync failed:', error)
      return this.getUserFollowing(userId)
    }
  }

  // Async get user followers
  async getUserFollowersAsync(userId: number | string): Promise<User[]> {
    try {
      const followerIds = await firebaseRepo.getUserFollowerIds(userId.toString())
      if (!followerIds.length) return []
      
      const userPromises = followerIds.map(id => firebaseRepo.getUserById(id))
      const users = await Promise.all(userPromises)
      
      return users.filter(u => u !== null) as unknown as User[]
    } catch (error) {
      console.error('getUserFollowersAsync failed:', error)
      return this.getUserFollowers(userId)
    }
  }

  // ==================== Admin Features ====================
  public restoreDefaultAdmin(): User {
    const users = this.getUsers()
    
    // Check if admin exists
    const existingAdmin = users.find(user => user.role === 'admin')
    if (existingAdmin) {
      console.log('Admin account already exists:', existingAdmin)
      return existingAdmin
    }
    
    // Create default admin account
    const defaultAdmin: User = {
      id: 1,
      username: 'admin',
      password: 'admin123',
      phone: '13800138001',
      email: 'admin@cheeseo.com',
      role: 'admin',
      nickname: 'System Admin',
      points: 0,
      status: 'active',
      membershipType: 'none',
      createdAt: new Date().toISOString(),
      totalEarnings: 0,
      subscriptionEarnings: 0,
      tipEarnings: 0
    }
    
    // Ensure ID does not conflict
    const numericIds = users.filter(u => typeof u.id === 'number').map(u => u.id as number)
    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0
    
    if (maxId >= (defaultAdmin.id as number)) {
      defaultAdmin.id = maxId + 1
    }
    
    users.push(defaultAdmin)
    this.saveUsers(users)
    
    console.log('Default admin account restored:', defaultAdmin)
    return defaultAdmin
  }

  // New: Async restore admin account (Supports Firebase)
  async restoreDefaultAdminAsync(): Promise<User> {
    try {
      console.log('Starting attempt to restore admin account from cloud...')
      
      // 1. Check if admin exists in cloud
      let admin = await firebaseRepo.getUserByUsername('admin') as unknown as User | null
      
      if (admin) {
        console.log('Admin account exists in cloud:', admin)
      } else {
        // 2. If not exists, create default admin account
        const defaultAdmin = {
          username: 'admin',
          password: 'admin123',
          phone: '13800138001',
          email: 'admin@cheeseo.com',
          role: 'admin',
          nickname: 'System Admin',
          points: 0,
          status: 'active',
          membershipType: 'none',
          createdAt: new Date().toISOString(),
          totalEarnings: 0,
          subscriptionEarnings: 0,
          tipEarnings: 0
        }
        
        // Create and get user object with ID
        const result = await firebaseRepo.createUser(defaultAdmin)
        admin = result as unknown as User
        console.log('Cloud default admin account created:', admin)
      }
      
      // 3. Sync to local storage
      const users = this.getUsers()
      // Check if local has admin (avoid duplicates)
      const localAdminIndex = users.findIndex(u => u.username === 'admin')
      
      if (localAdminIndex !== -1) {
        // Update existing local admin
        users[localAdminIndex] = { ...users[localAdminIndex], ...admin }
      } else {
        // Add to local
        users.push(admin)
      }
      
      this.saveUsers(users)
      console.log('Admin account synced to local storage')
      
      return admin
    } catch (error) {
      console.error('Cloud admin restore failed, falling back to local restore:', error)
      return this.restoreDefaultAdmin()
    }
  }

  /**
   * Static method: Quickly restore admin from browser console
   * Usage: Enter SimpleDataManager.restoreAdminFromConsole() in console
   */
  public static restoreAdminFromConsole(): void {
    const manager = SimpleDataManager.getInstance()
    const admin = manager.restoreDefaultAdmin()
    console.log('='.repeat(50))
    console.log('🎉 Admin account restored!')
    console.log('='.repeat(50))
    console.log('📧 Username:', admin.username)
    console.log('🔑 Password: admin123')
    console.log('👤 Nickname:', admin.nickname)
    console.log('📞 Phone:', admin.phone)
    console.log('✉️  Email:', admin.email)
    console.log('='.repeat(50))
    console.log('💡 Please refresh page and use admin login')
    
    // Auto refresh
    if (confirm('Refresh page now?')) {
      window.location.reload()
    }
  }

  /**
   * Force reset to initial user data
   * Warning: This will clear all user data and restore to initial state
   */
  public forceResetToInitialUsers(): boolean {
    try {
      const initialUsers = [
        {
          id: 1,
          username: 'admin',
          password: 'admin123',
          phone: '13800138001',
          email: 'admin@cheeseo.com',
          role: 'admin' as const,
          nickname: 'System Admin',
          points: 0,
          status: 'active' as const,
          membershipType: 'none' as const,
          createdAt: '2024-01-01T00:00:00Z',
          totalEarnings: 0,
          subscriptionEarnings: 0,
          tipEarnings: 0
        },
        {
          id: 2,
          username: 'testuser',
          password: 'test123',
          phone: '13800138002',
          email: 'test@example.com',
          role: 'user' as const,
          nickname: 'Test User',
          points: 0,
          status: 'active' as const,
          membershipType: 'none' as const,
          createdAt: '2024-02-01T00:00:00Z',
          totalEarnings: 0,
          subscriptionEarnings: 0,
          tipEarnings: 0
        }
      ]
      
      this.saveUsers(initialUsers)
      console.log('✅ User data reset to initial state')
      return true
    } catch (error) {
      console.error('❌ Failed to reset user data:', error)
      return false
    }
  }
  // Admin adjust user points
  adminAdjustUserPoints(
    userId: number,
    amount: number,
    reason: string,
    adminId: number
  ): PointTransaction {
    const user = this.getUserById(userId)
    const admin = this.getUserById(adminId)
    
    if (!user) throw new Error('User not found')
    if (!admin || admin.role !== 'admin') throw new Error('Insufficient permissions')

    // Check points cannot be negative
    if (user.points + amount < 0) {
      throw new Error('Points cannot be negative after adjustment')
    }

    const type = amount > 0 ? 'reward' : 'penalty'
    const description = `Admin adjustment: ${reason} (Operator: ${admin.nickname || admin.username})`

    return this.createPointTransaction({
      userId,
      type,
      amount,
      description,
      status: 'completed'
    })
  }

  // Admin ban user
  banUser(userId: number | string, reason: string, adminId?: number | string): boolean {
    const currentUser = this.getCurrentUser()
    const actualAdminId = adminId || currentUser?.id
    
    if (!actualAdminId) return false
    
    const admin = this.getUserById(actualAdminId)
    if (!admin || admin.role !== 'admin') return false

    const result = this.updateUser(userId, {
      status: 'banned',
      banReason: reason,
      banTime: new Date().toISOString()
    })

    return !!result
  }

  // Admin unban user
  unbanUser(userId: number | string, adminId?: number | string): boolean {
    const currentUser = this.getCurrentUser()
    const actualAdminId = adminId || currentUser?.id
    
    if (!actualAdminId) return false
    
    const admin = this.getUserById(actualAdminId)
    if (!admin || admin.role !== 'admin') return false

    const result = this.updateUser(userId, {
      status: 'active',
      banReason: undefined,
      banTime: undefined
    })

    return !!result
  }

  // Async ban user
  async banUserAsync(userId: number | string, reason: string, adminId?: number | string): Promise<boolean> {
    try {
      const currentUser = this.getCurrentUser()
      const actualAdminId = adminId || currentUser?.id
      
      if (!actualAdminId) return false
      
      const admin = await this.getUserByIdAsync(actualAdminId)
      if (!admin || admin.role !== 'admin') return false

      const success = await this.updateUserAsync(userId, {
        status: 'banned',
        banReason: reason,
        banTime: new Date().toISOString()
      })
      
      return success
    } catch (error) {
      console.error('Failed to ban user:', error)
      return this.banUser(userId, reason, adminId)
    }
  }

  // Async unban user
  async unbanUserAsync(userId: number | string, adminId?: number | string): Promise<boolean> {
    try {
      const currentUser = this.getCurrentUser()
      const actualAdminId = adminId || currentUser?.id
      
      if (!actualAdminId) return false
      
      const admin = await this.getUserByIdAsync(actualAdminId)
      if (!admin || admin.role !== 'admin') return false

      const success = await this.updateUserAsync(userId, {
        status: 'active',
        banReason: undefined,
        banTime: undefined
      })
      
      return success
    } catch (error) {
      console.error('Failed to unban user:', error)
      return this.unbanUser(userId, adminId)
    }
  }

  // Async admin adjust user points
  async adminAdjustUserPointsAsync(
    userId: number | string,
    amount: number,
    reason: string,
    adminId?: number | string
  ): Promise<PointTransaction | null> {
    try {
      const currentUser = this.getCurrentUser()
      const actualAdminId = adminId || currentUser?.id
      
      if (!actualAdminId) throw new Error('Need admin ID')
      
      const admin = await this.getUserByIdAsync(actualAdminId)
      if (!admin || admin.role !== 'admin') throw new Error('Insufficient permissions')

      const user = await this.getUserByIdAsync(userId)
      if (!user) throw new Error('User not found')

      // Check points cannot be negative
      if ((user.points || 0) + amount < 0) {
        throw new Error('Points cannot be negative after adjustment')
      }

      const type = amount > 0 ? 'reward' : 'penalty'
      const description = `Admin adjustment: ${reason} (Operator: ${admin.nickname || admin.username})`
      const newPoints = (user.points || 0) + amount

      // Update user points
      await this.updateUserAsync(userId, { points: newPoints })

      // Create transaction
      const transactionData = {
        userId: userId.toString(),
        userName: user.nickname || user.username || 'Unknown',
        type: type as any,
        amount,
        balance: newPoints,
        description,
        status: 'completed' as const
      }

      const transactionId = await firebaseRepo.addPointTransaction(transactionData)
      
      const transaction = {
        id: transactionId,
        ...transactionData,
        createdAt: new Date().toISOString()
      } as PointTransaction
      
      return transaction
    } catch (error) {
      console.error('Admin adjust points failed:', error)
      // Fallback to local
      try {
         const currentUser = this.getCurrentUser()
         const actualAdminId = adminId || currentUser?.id
         if (!actualAdminId) return null
         return this.adminAdjustUserPoints(Number(userId), amount, reason, Number(actualAdminId))
      } catch (e) {
        return null
      }
    }
  }

  // Async get user point transactions
  async getUserPointTransactionsAsync(userId: number | string): Promise<PointTransaction[]> {
    try {
      const transactions = await this.getPointTransactionsAsync()
      return transactions.filter(t => t.userId.toString() === userId.toString())
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (error) {
      return this.getUserPointTransactions(userId)
    }
  }

  // ==================== Helper Methods ====================
  
  // Update article like count
  private updateArticleLikeCount(articleId: string, change: number): void {
    const articles = this.getArticles()
    const articleIndex = articles.findIndex(article => article.id === articleId)
    
    if (articleIndex !== -1) {
      articles[articleIndex].likes = Math.max(0, articles[articleIndex].likes + change)
      this.saveArticles(articles)
    }
  }

  // Get popular articles (sorted by likes)
  getPopularArticles(limit: number = 10): Article[] {
    return this.getPublishedArticles()
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, limit)
  }
  
  // Get latest articles
  getLatestArticles(limit: number = 10): Article[] {
    return this.getPublishedArticles()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }

  // Get recommended articles (based on user behavior)
  getRecommendedArticles(userId: number | string, limit: number = 10): Article[] {
    try {
      // Get tags of articles liked and bookmarked by user
      const likedArticles = this.getUserLikedArticles(userId)
      const bookmarkedArticles = this.getUserBookmarkedArticles(userId)
      
      const interactedTags = [...likedArticles, ...bookmarkedArticles]
        .flatMap(article => article.tags || [])
        .reduce((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      
      const popularTags = Object.keys(interactedTags)
        .sort((a, b) => interactedTags[b] - interactedTags[a])
        .slice(0, 5)
      
      // Recommend articles based on tags
      const allArticles = this.getPublishedArticles()
      const recommendedArticles = allArticles
        .filter(article => 
          // Exclude user's own articles
          article.authorId !== userId &&
          // Exclude articles already liked or bookmarked
          !this.isArticleLiked(userId, article.id) &&
          !this.isArticleBookmarked(userId, article.id) &&
          // Include tags user is interested in
          (article.tags || []).some(tag => popularTags.includes(tag))
        )
        .sort((a, b) => {
          // Sort by relevance and popularity
          const aScore = (a.likes || 0) + (a.views || 0) * 0.1
          const bScore = (b.likes || 0) + (b.views || 0) * 0.1
          return bScore - aScore
        })
        .slice(0, limit)
      
      // If not enough recommended articles, add popular articles
      if (recommendedArticles.length < limit) {
        const popularArticles = this.getPopularArticles(limit)
          .filter(article => 
            article.authorId !== userId &&
            !recommendedArticles.some(rec => rec.id === article.id)
          )
        
        recommendedArticles.push(...popularArticles.slice(0, limit - recommendedArticles.length))
      }
      
      return recommendedArticles
    } catch (error) {
      console.error('Failed to get recommended articles:', error)
      return this.getPopularArticles(limit)
    }
  }

  // Async get recommended articles (use popular articles for now, improve algorithm later)
  async getRecommendedArticlesAsync(_userId: number | string, limit: number = 10): Promise<Article[]> {
    try {
      // Temporarily return popular articles
      return await this.getPopularArticlesAsync(limit)
    } catch (error) {
      console.error('Failed to get recommended articles:', error)
      return []
    }
  }

  // ==================== Statistics Methods ====================
  
  // Get points statistics
  getPointsStats() {
    const transactions = this.getPointTransactions()
    const users = this.getUsers()
    
    const totalPoints = users.reduce((sum, user) => sum + user.points, 0)
    const totalRecharge = transactions
      .filter(t => t.type === 'recharge' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
    const totalWithdraw = Math.abs(transactions
      .filter(t => t.type === 'withdraw' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0))
    const totalMembershipSpent = Math.abs(transactions
      .filter(t => t.type === 'membership' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0))

    // Active members count
    const activeMembers = users.filter(u => {
      const status = this.getUserMembershipStatus(u.id)
      return status.isMember
    }).length

    return {
      totalPoints,
      totalRecharge,
      totalWithdraw,
      totalMembershipSpent,
      activeMembers,
      totalUsers: users.length,
      totalTransactions: transactions.length
    }
  }

  // Async stats methods
  async getUserStatsAsync() {
    try {
      const users = await this.getUsersAsync()
      const totalUsers = users.length
      const normalUsers = users.filter(u => u.role === 'user').length
      const adminUsers = users.filter(u => u.role === 'admin').length
      
      const today = new Date().toDateString()
      const newUsersToday = users.filter(u => new Date(u.createdAt).toDateString() === today).length
      
      return {
        totalUsers,
        normalUsers,
        adminUsers,
        newUsersToday,
        activeUsers: users.filter(u => u.status === 'active').length,
        bannedUsers: users.filter(u => u.status === 'banned').length,
        verifiedUsers: users.filter(u => u.isVerified).length,
        phoneUsers: users.filter(u => u.registerType === 'phone').length,
        emailUsers: users.filter(u => u.registerType === 'email').length,
        wechatUsers: users.filter(u => u.registerType === 'wechat').length
      }
    } catch (error) {
      console.error('Failed to get user stats:', error)
      return this.getUserStats()
    }
  }

  async getContentStatsAsync() {
    try {
      const articles = await this.getArticlesAsync()
      const pendingContents = await firebaseRepo.listPendingContents()
      
      return {
        totalArticles: articles.length + pendingContents.length,
        publishedArticles: articles.filter(a => a.status === 'published').length,
        pendingReviews: pendingContents.length,
        draftArticles: articles.filter(a => a.status === 'draft').length,
        rejectedArticles: 0
      }
    } catch (error) {
      console.error('Failed to get content stats:', error)
      return this.getContentStats()
    }
  }

  async getCategoryStatsAsync() {
    try {
      const categories = await this.getCategoriesAsync()
      return {
        totalCategories: categories.length
      }
    } catch (error) {
      console.error('Failed to get category stats:', error)
      return this.getCategoryStats()
    }
  }

  async getPointsStatsAsync() {
    try {
      const transactions = await firebaseRepo.getPointTransactions() as unknown as PointTransaction[]
      const users = await this.getUsersAsync()
      
      const totalPoints = users.reduce((sum, user) => sum + (user.points || 0), 0)
      const totalRecharge = transactions
        .filter(t => t.type === 'recharge' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0)
      const totalWithdraw = Math.abs(transactions
        .filter(t => t.type === 'withdraw' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0))
      const totalMembershipSpent = Math.abs(transactions
        .filter(t => t.type === 'membership' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0))

      const activeMembers = users.filter(u => u.membershipType && u.membershipType !== 'none').length

      return {
        totalPoints,
        totalRecharge,
        totalWithdraw,
        totalMembershipSpent,
        activeMembers,
        totalUsers: users.length,
        totalTransactions: transactions.length
      }
    } catch (error) {
      console.error('Failed to get points stats:', error)
      return this.getPointsStats()
    }
  }

  // Get user points overview
  getUserPointsOverview(userId: number | string) {
    const transactions = this.getUserPointTransactions(userId)
    const membershipStatus = this.getUserMembershipStatus(userId)
    const user = this.getUserById(userId)

    if (!user) return null

    const totalRecharge = transactions
      .filter(t => t.type === 'recharge' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalSpent = Math.abs(transactions
      .filter(t => ['membership', 'withdraw'].includes(t.type) && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0))

    return {
      currentPoints: user.points,
      totalRecharge,
      totalSpent,
      membershipStatus,
      recentTransactions: transactions.slice(0, 10)
    }
  }

  // Get user statistics (enhanced)
  getUserStatsEnhanced(userId: number | string) {
    const userArticles = this.getArticlesByAuthor(userId)
    const userLikes = this.getLikes().filter(like => like.userId === userId)
    const userBookmarks = this.getBookmarks().filter(bookmark => bookmark.userId === userId)
    const userFollowers = this.getUserFollowers(userId)
    const userFollowing = this.getUserFollowing(userId)
    
    // Calculate total likes received (likes on user's articles)
    const totalLikesReceived = userArticles.reduce((total, article) => total + (article.likes || 0), 0)
    
    return {
      publishedArticles: userArticles.filter(a => a.status === 'published').length,
      draftArticles: userArticles.filter(a => a.status === 'draft').length,
      pendingArticles: userArticles.filter(a => a.status === 'pending').length,
      totalViews: userArticles.reduce((total, article) => total + (article.views || 0), 0),
      totalLikesReceived,
      likedArticles: userLikes.length,
      bookmarkedArticles: userBookmarks.length,
      followers: userFollowers.length,
      following: userFollowing.length
    }
  }

  // Get user statistics
  getUserStats() {
    const users = this.getUsers()
    const today = new Date().toDateString()
    
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      bannedUsers: users.filter(u => u.status === 'banned').length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      normalUsers: users.filter(u => u.role === 'user').length,
      newUsersToday: users.filter(u => {
        return new Date(u.createdAt).toDateString() === today
      }).length,
      verifiedUsers: users.filter(u => u.isVerified).length,
      phoneUsers: users.filter(u => u.registerType === 'phone').length,
      emailUsers: users.filter(u => u.registerType === 'email').length,
      wechatUsers: users.filter(u => u.registerType === 'wechat').length
    }
  }

  // Async get user follower IDs
  async getUserFollowerIdsAsync(userId: number | string): Promise<string[]> {
    try {
      return await firebaseRepo.getUserFollowerIds(userId.toString())
    } catch (error) {
      console.error('Failed to get user follower IDs:', error)
      return []
    }
  }

  // Async get user points overview
  async getUserPointsOverviewAsync(userId: number | string) {
    try {
      const transactions = await this.getUserPointTransactionsAsync(userId)
      const membershipStatus = await this.getUserMembershipStatusAsync(userId)
      const user = await this.getUserByIdAsync(userId)

      if (!user) return null

      const totalRecharge = transactions
        .filter(t => t.type === 'recharge' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const totalSpent = Math.abs(transactions
        .filter(t => ['membership', 'withdraw'].includes(t.type) && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0))

      return {
        currentPoints: user.points,
        totalRecharge,
        totalSpent,
        membershipStatus,
        recentTransactions: transactions.slice(0, 10)
      }
    } catch (error) {
      console.error('getUserPointsOverviewAsync failed:', error)
      return this.getUserPointsOverview(userId)
    }
  }

  // Async get user stats enhanced
  async getUserStatsEnhancedAsync(userId: number | string) {
    try {
      const [
        articles,
        likedIds,
        bookmarkedIds,
        followerIds,
        followingIds
      ] = await Promise.all([
        firebaseRepo.getArticlesByAuthor(userId.toString()),
        firebaseRepo.getUserLikedArticleIds(userId.toString()),
        firebaseRepo.getUserBookmarkedArticleIds(userId.toString()),
        firebaseRepo.getUserFollowerIds(userId.toString()),
        firebaseRepo.getUserFollowingIds(userId.toString())
      ])

      const typedArticles = articles as unknown as Article[]
      
      // Calculate total likes received
      const totalLikesReceived = typedArticles.reduce((total, article) => total + (article.likes || 0), 0)
      
      return {
        publishedArticles: typedArticles.filter(a => a.status === 'published').length,
        draftArticles: typedArticles.filter(a => a.status === 'draft').length,
        pendingArticles: typedArticles.filter(a => a.status === 'pending').length,
        totalViews: typedArticles.reduce((total, article) => total + (article.views || 0), 0),
        totalLikesReceived,
        likedArticles: likedIds.length,
        bookmarkedArticles: bookmarkedIds.length,
        followers: followerIds.length,
        following: followingIds.length
      }
    } catch (error) {
      console.error('getUserStatsEnhancedAsync failed:', error)
      return this.getUserStatsEnhanced(userId)
    }
  }


  // ==================== Article Management ====================
  // Async get categories
  async getCategoriesAsync(): Promise<Category[]> {
    try {
      const categories = await firebaseRepo.getCategories()
      if (categories.length > 0) {
        return categories as Category[]
      }
      return this.getCategories()
    } catch (error) {
      console.error('Failed to get categories from Firebase:', error)
      return this.getCategories()
    }
  }

  getCategories(): Category[] {
    const data = localStorage.getItem(this.CATEGORIES_KEY)
    return data ? JSON.parse(data) : []
  }

  getCategoryById(id: string): Category | null {
    const categories = this.getCategories()
    return categories.find(cat => cat.id === id) || null
  }

  saveCategories(categories: Category[]): void {
    localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories))
  }

  // Async create category
  async createCategoryAsync(categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    try {
      // 1. Create category in Firebase
      const newCategory = await firebaseRepo.createCategory(categoryData)
      
      // 2. Sync to local cache (optional, maintain consistency)
      const categories = this.getCategories()
      categories.push(newCategory as Category)
      this.saveCategories(categories)
      
      return newCategory as Category
    } catch (error) {
      console.error('Cloud create category failed:', error)
      // Fallback to local
      return this.createCategory(categoryData)
    }
  }

  createCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Category {
    const categories = this.getCategories()
    
    const newCategory: Category = {
      id: this.generateId('cat'),
      createdAt: new Date().toISOString(),
      ...categoryData
    }
    
    categories.push(newCategory)
    this.saveCategories(categories)
    return newCategory
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const categories = this.getCategories()
    const categoryIndex = categories.findIndex(cat => cat.id === id)
    
    if (categoryIndex === -1) return null
    
    categories[categoryIndex] = { 
      ...categories[categoryIndex], 
      ...updates
    }
    
    this.saveCategories(categories)
    return categories[categoryIndex]
  }

  // Async update category
  async updateCategoryAsync(id: string, updates: Partial<Category>): Promise<Category | null> {
    try {
      await firebaseRepo.updateCategory(id, updates)
      
      // Sync update local cache
      return this.updateCategory(id, updates)
    } catch (error) {
      console.error('Cloud update category failed:', error)
      return this.updateCategory(id, updates)
    }
  }

  deleteCategory(id: string): boolean {
    const categories = this.getCategories()
    const categoryIndex = categories.findIndex(cat => cat.id === id)
    
    if (categoryIndex === -1) return false
    
    categories.splice(categoryIndex, 1)
    this.saveCategories(categories)
    return true
  }

  // Async delete category
  async deleteCategoryAsync(id: string): Promise<boolean> {
    try {
      await firebaseRepo.deleteCategory(id)
      
      // Sync update local cache
      return this.deleteCategory(id)
    } catch (error) {
      console.error('Cloud delete category failed:', error)
      return this.deleteCategory(id)
    }
  }

  // ==================== Article Management ====================
  // Changed to async method, prefer fetching from Firebase
  async getArticlesAsync(): Promise<Article[]> {
    try {
      const articles = await firebaseRepo.getArticles()
      // Compatible with old code: if no data from Firebase (maybe offline or initialized), try reading local cache
      if (articles.length === 0) {
        return this.getArticles()
      }
      return articles.map((a: any) => ({
        ...a,
        authorId: typeof a.authorId === 'string' ? parseInt(a.authorId, 10) : a.authorId
      })) as Article[]
    } catch (error) {
      console.error('Failed to get articles from Firebase, fallback to local cache:', error)
      return this.getArticles()
    }
  }

  getArticles(): Article[] {
    const data = localStorage.getItem(this.ARTICLES_KEY)
    return data ? JSON.parse(data) : []
  }

  // Async get published articles
  async getPublishedArticlesAsync(): Promise<Article[]> {
    try {
      const articles = await firebaseRepo.getPublishedArticles()
      return articles.map((a: any) => ({
        ...a,
        authorId: typeof a.authorId === 'string' ? parseInt(a.authorId, 10) : a.authorId
      })) as Article[]
    } catch (error) {
      console.error('Failed to get published articles from Firebase:', error)
      const articles = await this.getArticlesAsync()
      return articles.filter(article => article.status === 'published')
    }
  }

  // Async get popular articles
  async getPopularArticlesAsync(limit: number = 5): Promise<Article[]> {
    const articles = await this.getPublishedArticlesAsync()
    return articles
      .sort((a, b) => ((b.views || 0) + (b.likes || 0)) - ((a.views || 0) + (a.likes || 0)))
      .slice(0, limit)
  }

  getPublishedArticles(): Article[] {
    return this.getArticles().filter(article => article.status === 'published')
  }

  // Async get article details
  async getArticleByIdAsync(id: string): Promise<Article | null> {
    try {
      const article = await firebaseRepo.getArticleById(id)
      if (article) return article as Article
      
      // Fallback to local
      return this.getArticleById(id)
    } catch (error) {
      console.error('Failed to get article details from Firebase:', error)
      return this.getArticleById(id)
    }
  }

  // Async get article details (with view count)
  async getArticleWithViewAsync(id: string): Promise<Article | null> {
    try {
      // Try to increment view count (non-blocking)
      firebaseRepo.incrementArticleView(id).catch(e => {
        console.error('Failed to increment view count:', e)
      })
      
      return this.getArticleByIdAsync(id)
    } catch (error) {
      console.error('Failed to get article details:', error)
      return this.getArticleWithView(id)
    }
  }

  getArticleById(id: string): Article | null {
    const articles = this.getArticles()
    return articles.find(article => article.id === id) || null
  }

  async getArticlesByCategoryAsync(categoryId: string): Promise<Article[]> {
    const articles = await this.getPublishedArticlesAsync()
    return articles.filter(article => article.categoryId === categoryId)
  }

  getArticlesByCategory(categoryId: string): Article[] {
    return this.getPublishedArticles().filter(article => article.categoryId === categoryId)
  }

  getArticlesByAuthor(authorId: number | string): Article[] {
    return this.getArticles().filter(article => article.authorId === authorId)
  }

  async getArticlesByAuthorAsync(authorId: number | string): Promise<Article[]> {
    try {
      const articles = await firebaseRepo.getArticlesByAuthor(authorId.toString())
      return articles.map((a: any) => ({
        ...a,
        // Ensure authorId is a number as per Article interface
        authorId: typeof a.authorId === 'string' ? parseInt(a.authorId, 10) : a.authorId,
        // Timestamps are already handled by firebaseRepo
      })) as Article[]
    } catch (error) {
      console.error('getArticlesByAuthorAsync failed:', error)
      return this.getArticlesByAuthor(authorId)
    }
  }

  private saveArticles(articles: Article[]): void {
    localStorage.setItem(this.ARTICLES_KEY, JSON.stringify(articles))
  }

  // Async create draft/article
  async createArticleAsync(articleData: CreateArticleInput): Promise<Article> {
    try {
      const result = await firebaseRepo.createArticle(articleData)
      return result as unknown as Article
    } catch (error) {
      console.error('Failed to save article to Firebase:', error)
      throw error
    }
  }

  // Update createArticle method
  createArticle(articleData: CreateArticleInput): Article {
    const articles = this.getArticles()
    
    const newArticle: Article = {
      // System generated fields
      id: this.generateId('article'),
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      
      // User provided data
      ...articleData
    }
    
    articles.push(newArticle)
    this.saveArticles(articles)
    return newArticle
  }

  updateArticle(id: string, updates: Partial<Article>): Article | null {
    const articles = this.getArticles()
    const articleIndex = articles.findIndex(article => article.id === id)
    
    if (articleIndex === -1) return null
    
    articles[articleIndex] = { 
      ...articles[articleIndex], 
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.saveArticles(articles)
    return articles[articleIndex]
  }

  deleteArticle(id: string): boolean {
    const articles = this.getArticles()
    const articleIndex = articles.findIndex(article => article.id === id)
    
    if (articleIndex === -1) return false
    
    articles.splice(articleIndex, 1)
    this.saveArticles(articles)
    return true
  }

  async updateArticleAsync(id: string, updates: Partial<Article>): Promise<Article | null> {
    try {
      const updated = await firebaseRepo.updateArticle(id, updates)
      // Also update local for consistency
      this.updateArticle(id, updates)
      return updated as Article
    } catch (error) {
      console.error('Failed to update article:', error)
      return this.updateArticle(id, updates)
    }
  }

  async deleteArticleAsync(id: string): Promise<boolean> {
    try {
      await firebaseRepo.deleteArticle(id)
      // Also update local for consistency
      this.deleteArticle(id)
      return true
    } catch (error) {
      console.error('Failed to delete article:', error)
      // Try to clean local cache but report failure so UI can reflect that
      this.deleteArticle(id)
      return false
    }
  }

  // ==================== Pending Content Management ====================
  getPendingContents(): PendingContent[] {
    const data = localStorage.getItem(this.PENDING_CONTENTS_KEY)
    if (!data) return []
    
    return JSON.parse(data, (key, value) => {
      if (key === 'submitTime' && value) {
        return new Date(value)
      }
      return value
    })
  }

  private savePendingContents(contents: PendingContent[]): void {
    localStorage.setItem(this.PENDING_CONTENTS_KEY, JSON.stringify(contents))
  }

  addPendingContent(content: PendingContent): void {
    const contents = this.getPendingContents()
    contents.push(content)
    this.savePendingContents(contents)
  }

  async getPendingContentsAsync(): Promise<PendingContent[]> {
    try {
      const contents = await firebaseRepo.listPendingContents()
      return contents as PendingContent[]
    } catch (error) {
      console.error('Failed to get pending contents:', error)
      // Return empty array on error, never use local cache
      return []
    }
  }

  async addPendingContentAsync(content: PendingContent): Promise<string> {
    return await firebaseRepo.addPendingContent(content)
  }

  approvePendingContent(contentId: string): boolean {
    const contents = this.getPendingContents()
    const contentIndex = contents.findIndex(c => c.id === contentId)
  
    if (contentIndex === -1) return false
  
    const content = contents[contentIndex]
  
    // Convert pending content to official article (including video)
    if (content.type === 'blog' || content.type === 'video') {
      // Get author info
      const author = this.getUserById(content.authorId)
      if (!author) {
        console.error('Content author not found:', content.authorId)
        return false
      }

      // Create article data
      const articleData: CreateArticleInput = {
        title: content.title,
        content: content.content || content.preview,
        excerpt: content.preview,
        authorId: content.authorId,
        authorName: content.author,
        categoryId: content.categoryId || 'cat_001',
        categoryName: content.categoryName || 'Default Category',
        tags: content.tags || [],
        coverImage: content.images?.[0],
        images: content.images || [],
        accessType: content.accessType,
        price: content.price,
        status: 'published',
        publishedAt: new Date().toISOString(),
        
        // Video specific fields
        isVideo: content.type === 'video',
        videoFile: content.type === 'video' ? content.videoFile : undefined,
        videoUrl: content.type === 'video' ? (content.videoUrl || '') : undefined,
        duration: content.type === 'video' ? (content.duration || 'Pending') : undefined
      }
    
      // Now types match, no error
      const article = this.createArticle(articleData)
      console.log(`${content.type === 'video' ? 'Video' : 'Blog'} content published as article:`, article)
    }
  
  // Update pending content status
  contents[contentIndex].status = 'approved'
  this.savePendingContents(contents)
  
  return true
  }

  async approvePendingContentAsync(contentId: string): Promise<string> {
    try {
      const result = await firebaseRepo.approvePendingContent(contentId)

      if (typeof result === 'string' && result) {
        console.log('Content approved and synced to cloud:', contentId, 'New article ID:', result)
        return result
      }

      console.warn('Firebase approval failed or returned non-string result:', contentId)
      throw new Error('Firebase approval failed: Content may not exist or already approved')
    } catch (error) {
      console.error('Approval failed:', error)
      throw error
    }
  }

  async getPublishedContentAsync(): Promise<Article[]> {
    const articles = await this.getPublishedArticlesAsync()
    
    // Sort by publish time, newest first
    return articles.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt)
      const dateB = new Date(b.publishedAt || b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })
  }

  getPublishedContent(): Article[] {
    const articles = this.getPublishedArticles()
    
    // Sort by publish time, newest first
    return articles.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt)
      const dateB = new Date(b.publishedAt || b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })
  }

  // New method: Get video content
  getVideoContent(): Article[] {
    return this.getPublishedArticles().filter(article => article.isVideo === true)
  }

  // New method: Get blog content
  getBlogContent(): Article[] {
    return this.getPublishedArticles().filter(article => !article.isVideo)
  }

  // Async get video content
  async getVideoContentAsync(): Promise<Article[]> {
    try {
      const articles = await firebaseRepo.getVideoArticles()
      return articles.map((a: any) => ({
        ...a,
        authorId: typeof a.authorId === 'string' ? parseInt(a.authorId, 10) : a.authorId
      })) as Article[]
    } catch (error) {
      console.error('Failed to get video content:', error)
      return this.getVideoContent()
    }
  }

  // Async get blog content
  async getBlogContentAsync(): Promise<Article[]> {
    try {
      const articles = await firebaseRepo.getBlogArticles()
      return articles.map((a: any) => ({
        ...a,
        authorId: typeof a.authorId === 'string' ? parseInt(a.authorId, 10) : a.authorId
      })) as Article[]
    } catch (error) {
      console.error('Failed to get blog content:', error)
      return this.getBlogContent()
    }
  }

  async rejectPendingContentAsync(contentId: string, reason: string): Promise<boolean> {
    try {
      const success = await firebaseRepo.rejectPendingContent(contentId, reason)
      if (success) {
        // Update local cache
        this.rejectPendingContent(contentId, reason)
        return true
      }
      // Fallback to local if Firebase returns false (not found)
      return this.rejectPendingContent(contentId, reason)
    } catch (error) {
      console.error('Failed to reject pending content:', error)
      return this.rejectPendingContent(contentId, reason)
    }
  }

  rejectPendingContent(contentId: string, reason: string): boolean {
    const contents = this.getPendingContents()
    const contentIndex = contents.findIndex(c => c.id === contentId)
    
    if (contentIndex === -1) return false
    
    contents[contentIndex].status = 'rejected'
    contents[contentIndex].rejectReason = reason
    this.savePendingContents(contents)
    
    return true
  }

  deletePendingContent(contentId: string): boolean {
    const contents = this.getPendingContents()
    const contentIndex = contents.findIndex(c => c.id === contentId)
    
    if (contentIndex === -1) return false
    
    contents.splice(contentIndex, 1)
    this.savePendingContents(contents)
    return true
  }

  // ==================== Utility Methods ====================
  getPresetCodes(): string[] {
    return siteConfig.auth.presetCodes
  }

  getSiteConfig() {
    return siteConfig
  }

  // ==================== Statistics Methods ====================
  getContentStats() {
    const articles = this.getArticles()
    const pendingContents = this.getPendingContents()
    
    return {
      totalArticles: articles.length,
      publishedArticles: articles.filter(a => a.status === 'published').length,
      draftArticles: articles.filter(a => a.status === 'draft').length,
      pendingArticles: articles.filter(a => a.status === 'pending').length,
      rejectedArticles: articles.filter(a => a.status === 'rejected').length,
      pendingReviews: pendingContents.filter(c => c.status === 'pending').length,
      approvedContents: pendingContents.filter(c => c.status === 'approved').length,
      rejectedContents: pendingContents.filter(c => c.status === 'rejected').length
    }
  }

  getCategoryStats() {
    const categories = this.getCategories()
    const articles = this.getArticles()
    
    return {
      totalCategories: categories.length,
      categoriesWithArticles: categories.filter(cat => 
        articles.some(article => article.categoryId === cat.id)
      ).length,
      emptyCategorieCount: categories.filter(cat => 
        !articles.some(article => article.categoryId === cat.id)
      ).length
    }
  }

  // ==================== Search Function ====================
  searchUsers(query: string): User[] {
    const users = this.getUsers()
    const lowerQuery = query.toLowerCase()
    
    return users.filter(user => 
      user.username.toLowerCase().includes(lowerQuery) ||
      (user.nickname && user.nickname.toLowerCase().includes(lowerQuery)) ||
      (user.phone && user.phone.includes(query)) ||
      (user.email && user.email.toLowerCase().includes(lowerQuery)) ||
      user.id.toString().includes(query)
    )
  }

  searchArticles(query: string): Article[] {
    const articles = this.getArticles()
    const lowerQuery = query.toLowerCase()
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(lowerQuery) ||
      article.content.toLowerCase().includes(lowerQuery) ||
      article.excerpt.toLowerCase().includes(lowerQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }

  searchCategories(query: string): Category[] {
    const categories = this.getCategories()
    const lowerQuery = query.toLowerCase()
    
    return categories.filter(category => 
      category.name.toLowerCase().includes(lowerQuery) ||
      category.description.toLowerCase().includes(lowerQuery)
    )
  }

  // ==================== Data Export/Import ====================
  exportData(): string {
    const data = {
      users: this.getUsers(),
      categories: this.getCategories(),
      articles: this.getArticles(),
      pendingContents: this.getPendingContents(),
      pointTransactions: this.getPointTransactions(),
      membershipRecords: this.getMembershipRecords(),
      rechargeOrders: this.getRechargeOrders(),
      withdrawRequests: this.getWithdrawRequests(),
      likes: this.getLikes(),
      bookmarks: this.getBookmarks(),
      follows: this.getFollows(),
      exportTime: new Date().toISOString(),
      version: '2.1'
    }
    return JSON.stringify(data, null, 2)
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      
      // Validate data format
      if (!data.version || !data.exportTime) {
        throw new Error('Invalid data format')
      }
      
      if (data.users) {
        this.saveUsers(data.users)
      }
      if (data.categories) {
        this.saveCategories(data.categories)
      }
      if (data.articles) {
        this.saveArticles(data.articles)
      }
      if (data.pendingContents) {
        this.savePendingContents(data.pendingContents)
      }
      if (data.pointTransactions) {
        this.savePointTransactions(data.pointTransactions)
      }
      if (data.membershipRecords) {
        this.saveMembershipRecords(data.membershipRecords)
      }
      if (data.rechargeOrders) {
        this.saveRechargeOrders(data.rechargeOrders)
      }
      if (data.withdrawRequests) {
        this.saveWithdrawRequests(data.withdrawRequests)
      }
      if (data.likes) {
        this.saveLikes(data.likes)
      }
      if (data.bookmarks) {
        this.saveBookmarks(data.bookmarks)
      }
      if (data.follows) {
        this.saveFollows(data.follows)
      }
      
      console.log('Data imported successfully')
      return true
    } catch (error) {
      console.error('Data import failed:', error)
      return false
    }
  }

  // Reset data
  resetData(): void {
    const keys = [
      this.USERS_KEY,
      this.CATEGORIES_KEY, 
      this.ARTICLES_KEY,
      this.PENDING_CONTENTS_KEY,
      this.CURRENT_USER_KEY,
      this.POINT_TRANSACTIONS_KEY,
      this.MEMBERSHIP_RECORDS_KEY,
      this.RECHARGE_ORDERS_KEY,
      this.WITHDRAW_REQUESTS_KEY,
      this.LIKES_KEY,
      this.BOOKMARKS_KEY,
      this.FOLLOWS_KEY
    ]
    
    keys.forEach(key => localStorage.removeItem(key))
    this.initializeData()
    console.log('Data reset successfully')
  }

  // ==================== Data Integrity Check ====================
  
  // Check data consistency
  checkDataIntegrity(): { isValid: boolean; errors: string[] } {
    const errors: string[] = []
    
    try {
      // Check user data
      const users = this.getUsers()
      const transactions = this.getPointTransactions()
      
      // Verify point balance correctness
      users.forEach(user => {
        const userTransactions = transactions.filter(t => t.userId === user.id && t.status === 'completed')
        const calculatedBalance = userTransactions.reduce((sum, t) => sum + t.amount, 0)
        
        if (Math.abs(user.points - calculatedBalance) > 0.01) {
          errors.push(`User ${user.nickname || user.username} point balance incorrect`)
        }
      })
      
      // Check membership status
      users.forEach(user => {
        const membershipStatus = this.getUserMembershipStatus(user.id)
        const userMembershipType = user.membershipType
        
        if (membershipStatus.isMember && userMembershipType === 'none') {
          errors.push(`User ${user.nickname || user.username} membership status inconsistent`)
        }
      })
      
      // Check like records integrity
      const likes = this.getLikes()
      const articles = this.getArticles()
      likes.forEach(like => {
        const user = users.find(u => u.id === like.userId)
        const article = articles.find(a => a.id === like.articleId)
        if (!user) {
          errors.push(`Like record ${like.id} references non-existent user`)
        }
        if (!article) {
          errors.push(`Like record ${like.id} references non-existent article`)
        }
      })
      
      // Check bookmark records integrity
      const bookmarks = this.getBookmarks()
      bookmarks.forEach(bookmark => {
        const user = users.find(u => u.id === bookmark.userId)
        const article = articles.find(a => a.id === bookmark.articleId)
        if (!user) {
          errors.push(`Bookmark record ${bookmark.id} references non-existent user`)
        }
        if (!article) {
          errors.push(`Bookmark record ${bookmark.id} references non-existent article`)
        }
      })
      
      // Check follow records integrity
      const follows = this.getFollows()
      follows.forEach(follow => {
        const follower = users.find(u => u.id === follow.followerId)
        const following = users.find(u => u.id === follow.followingId)
        if (!follower) {
          errors.push(`Follow record ${follow.id} references non-existent follower`)
        }
        if (!following) {
          errors.push(`Follow record ${follow.id} references non-existent followee`)
        }
      })
      
    } catch (error) {
      errors.push(`Error occurred during data check: ${error}`)
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Repair data inconsistencies
  repairDataIntegrity(): { fixed: number; errors: string[] } {
    const errors: string[] = []
    let fixed = 0
    
    try {
      const users = this.getUsers()
      const transactions = this.getPointTransactions()
      
      // Repair point balance
      users.forEach(user => {
        const userTransactions = transactions.filter(t => t.userId === user.id && t.status === 'completed')
        const calculatedBalance = userTransactions.reduce((sum, t) => sum + t.amount, 0)
        
        if (Math.abs(user.points - calculatedBalance) > 0.01) {
          this.updateUser(user.id, { points: Math.max(0, calculatedBalance) })
          fixed++
        }
      })
      
      // Repair membership status
      users.forEach(user => {
        const membershipStatus = this.getUserMembershipStatus(user.id)
        
        if (membershipStatus.isMember && user.membershipType === 'none') {
          this.updateUser(user.id, { 
            membershipType: membershipStatus.type as 'monthly' | 'yearly',
            membershipEndDate: membershipStatus.endDate
          })
          fixed++
        } else if (!membershipStatus.isMember && user.membershipType !== 'none') {
          this.updateUser(user.id, { 
            membershipType: 'none',
            membershipEndDate: undefined
          })
          fixed++
        }
      })
      
      // Clean up invalid like records
      const likes = this.getLikes()
      const validLikes = likes.filter(like => {
        const user = users.find(u => u.id === like.userId)
        const article = this.getArticleById(like.articleId)
        return user && article
      })
      if (validLikes.length !== likes.length) {
        this.saveLikes(validLikes)
        fixed += likes.length - validLikes.length
      }
      
      // Clean up invalid bookmark records
      const bookmarks = this.getBookmarks()
      const validBookmarks = bookmarks.filter(bookmark => {
        const user = users.find(u => u.id === bookmark.userId)
        const article = this.getArticleById(bookmark.articleId)
        return user && article
      })
      if (validBookmarks.length !== bookmarks.length) {
        this.saveBookmarks(validBookmarks)
        fixed += bookmarks.length - validBookmarks.length
      }
      
      // Clean up invalid follow records
      const follows = this.getFollows()
      const validFollows = follows.filter(follow => {
        const follower = users.find(u => u.id === follow.followerId)
        const following = users.find(u => u.id === follow.followingId)
        return follower && following && follow.followerId !== follow.followingId
      })
      if (validFollows.length !== follows.length) {
        this.saveFollows(validFollows)
        fixed += follows.length - validFollows.length
      }
      
    } catch (error) {
      errors.push(`Error occurred during data repair: ${error}`)
    }
    
    return { fixed, errors }
  }

  // ==================== Increment Article Views ====================
  incrementArticleViews(articleId: string): void {
    const articles = this.getArticles()
    const articleIndex = articles.findIndex(article => article.id === articleId)
    
    if (articleIndex !== -1) {
      articles[articleIndex].views = (articles[articleIndex].views || 0) + 1
      this.saveArticles(articles)
    }
  }

  async incrementArticleViewsAsync(articleId: string): Promise<void> {
    try {
      await firebaseRepo.incrementArticleView(articleId)
    } catch (error) {
      console.error('Failed to increment view count:', error)
      // Fallback to local
      this.incrementArticleViews(articleId)
    }
  }

  // ==================== Get Article Details (With View Count Increment) ====================
  getArticleWithView(articleId: string): Article | null {
    const article = this.getArticleById(articleId)
    if (article && article.status === 'published') {
      // Increment view count
      this.incrementArticleViews(articleId)
      // Return updated article
      return this.getArticleById(articleId)
    }
    return article
  }
}
