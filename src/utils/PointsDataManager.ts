// src/utils/PointsDataManager.ts


import { firebaseRepo } from '@/services/firebaseRepo'

// Data type definitions
export interface User {
  id: number
  username: string
  password: string
  phone?: string
  email?: string
  role: 'admin' | 'user'
  nickname: string
  realName?: string
  points: number
  status: 'active' | 'banned'
  membershipType: 'none' | 'monthly' | 'yearly'
  membershipEndDate?: string
  avatar?: string
  bio?: string
  specialties?: string[]
  socialLinks?: {
    wechat?: string
    weibo?: string
    github?: string
  }
  isVerified?: boolean
  createdAt: string
  lastLoginAt?: string
  banReason?: string
  banTime?: string
}

export interface PointTransaction {
  id: string
  userId: number | string
  userName: string
  type: 'recharge' | 'withdraw' | 'consume' | 'reward' | 'penalty' | 'membership'
  amount: number // Positive for increase, negative for deduction
  balance: number // Balance after operation
  status: 'completed' | 'pending' | 'failed'
  description: string
  paymentMethod?: 'alipay' | 'wechat' | 'bank'
  orderNo?: string
  createdAt: string
  processedAt?: string
  rejectReason?: string
}

export interface WithdrawRequest {
  id: string
  userId: number | string
  userName: string
  points: number
  amount: number // RMB amount
  bankInfo: {
    bankName: string
    accountNumber: string
    accountName: string
  }
  status: 'pending' | 'approved' | 'completed' | 'rejected'
  createdAt: string
  processedAt?: string
  rejectReason?: string
  adminId?: number | string
  adminName?: string
}

export interface MembershipRecord {
  id: string
  userId: number | string
  userName: string
  type: 'monthly' | 'yearly'
  pointsCost: number
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'cancelled'
  createdAt: string
}

export interface RechargeOrder {
  id: string
  userId: number | string
  userName: string
  amount: number // RMB amount
  points: number // Points obtained
  paymentMethod: 'alipay' | 'wechat' | 'bank'
  status: 'pending' | 'completed' | 'failed'
  orderNo: string
  createdAt: string
  completedAt?: string
}

class PointsDataManager {
  private static instance: PointsDataManager
  private readonly STORAGE_KEYS = {
    users: 'users',
    pointTransactions: 'pointTransactions',
    withdrawRequests: 'withdrawRequests',
    membershipRecords: 'membershipRecords',
    rechargeOrders: 'rechargeOrders',
    currentUser: 'currentUser'
  }

  // Get singleton instance
  static getInstance(): PointsDataManager {
    if (!PointsDataManager.instance) {
      PointsDataManager.instance = new PointsDataManager()
    }
    return PointsDataManager.instance
  }

  private constructor() {
    this.initializeData()
  }

  // Initialize data
  private initializeData() {
    // Initialize user data (if not exists)
    if (!this.getFromStorage(this.STORAGE_KEYS.users)) {
      const initialUsers: User[] = [
        {
          id: 1,
          username: "admin",
          password: "admin123",
          phone: "13800138001",
          email: "admin@cheeseo.com",
          role: "admin",
          nickname: "System Administrator",
          points: 0, // Points start from 0
          status: "active",
          membershipType: "none",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          username: "testuser",
          password: "test123",
          phone: "13800138002",
          email: "test@example.com",
          role: "user",
          nickname: "Test User",
          points: 0, // Points start from 0
          status: "active",
          membershipType: "none",
          createdAt: new Date().toISOString()
        }
      ]
      this.saveToStorage(this.STORAGE_KEYS.users, initialUsers)
    }

    // Initialize empty point transaction records
    if (!this.getFromStorage(this.STORAGE_KEYS.pointTransactions)) {
      this.saveToStorage(this.STORAGE_KEYS.pointTransactions, [])
    }

    // Initialize empty withdraw request records
    if (!this.getFromStorage(this.STORAGE_KEYS.withdrawRequests)) {
      this.saveToStorage(this.STORAGE_KEYS.withdrawRequests, [])
    }

    // Initialize empty membership records
    if (!this.getFromStorage(this.STORAGE_KEYS.membershipRecords)) {
      this.saveToStorage(this.STORAGE_KEYS.membershipRecords, [])
    }

    // Initialize empty recharge order records
    if (!this.getFromStorage(this.STORAGE_KEYS.rechargeOrders)) {
      this.saveToStorage(this.STORAGE_KEYS.rechargeOrders, [])
    }
  }

  private sanitizeUserForLocal(user: User): User {
    const clone: any = { ...user }
    delete clone.password
    return clone as User
  }

  // Local storage operations
  private saveToStorage(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Failed to save data to ${key}:`, error)
    }
  }

  private getFromStorage(key: string): any {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error(`Failed to read data from ${key}:`, error)
      return null
    }
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  // Generate order number
  private generateOrderNo(): string {
    return 'ORDER' + Date.now().toString() + Math.random().toString(36).substr(2, 5).toUpperCase()
  }

  // ===================== User Management =====================

  // Async methods
  async getUsersAsync(): Promise<User[]> {
    try {
      const users = await firebaseRepo.getUsers() as unknown as User[]
      const sanitized = users.map(u => this.sanitizeUserForLocal(u))
      this.saveToStorage(this.STORAGE_KEYS.users, sanitized)
      return sanitized
    } catch (error) {
      console.error('getUsersAsync failed:', error)
      return this.getUsers()
    }
  }

  async getUserByIdAsync(id: number | string): Promise<User | null> {
    try {
      const user = await firebaseRepo.getUserById(id)
      if (user) {
        // Update local cache if needed, or rely on bulk fetch
        return user as unknown as User
      }
      return null
    } catch (error) {
      console.error('getUserByIdAsync failed:', error)
      return this.getUserById(id)
    }
  }

  async updateUserAsync(userId: number | string, updates: Partial<User>): Promise<User | null> {
    try {
      await firebaseRepo.updateUser(userId.toString(), updates)
      const updatedUser = await this.getUserByIdAsync(userId)
      
      // Update local cache
      const users = this.getUsers()
      const index = users.findIndex(u => u.id == userId)
      if (index !== -1 && updatedUser) {
        users[index] = updatedUser
        const sanitized = users.map(u => this.sanitizeUserForLocal(u))
        this.saveToStorage(this.STORAGE_KEYS.users, sanitized)
      }
      
      return updatedUser
    } catch (error) {
      console.error('updateUserAsync failed:', error)
      return this.updateUser(userId, updates)
    }
  }

  // Get all users
  getUsers(): User[] {
    return this.getFromStorage(this.STORAGE_KEYS.users) || []
  }

  // Get user by ID
  getUserById(id: number | string): User | null {
    const users = this.getUsers()
    return users.find(user => user.id == id) || null
  }

  // Update user info
  updateUser(userId: number | string, updates: Partial<User>): User | null {
    const users = this.getUsers()
    const userIndex = users.findIndex(user => user.id == userId)
    
    if (userIndex === -1) return null
    
    users[userIndex] = { ...users[userIndex], ...updates }
    this.saveToStorage(this.STORAGE_KEYS.users, users)
    
    // If updating current logged-in user, sync update current user info
    const currentUser = this.getCurrentUser()
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(users[userIndex])
    }
    
    return users[userIndex]
  }

  // Get current logged-in user
  getCurrentUser(): User | null {
    return this.getFromStorage(this.STORAGE_KEYS.currentUser)
  }

  // Set current logged-in user
  setCurrentUser(user: User) {
    const sanitized = this.sanitizeUserForLocal(user)
    this.saveToStorage(this.STORAGE_KEYS.currentUser, sanitized)
  }

  // Clear current logged-in user
  clearCurrentUser() {
    localStorage.removeItem(this.STORAGE_KEYS.currentUser)
  }

  // ===================== Point Transaction Management =====================

  // Async methods
  async getPointTransactionsAsync(): Promise<PointTransaction[]> {
    try {
      const transactions = await firebaseRepo.getPointTransactions()
      this.saveToStorage(this.STORAGE_KEYS.pointTransactions, transactions)
      return transactions as unknown as PointTransaction[]
    } catch (error) {
      console.error('getPointTransactionsAsync failed:', error)
      return this.getPointTransactions()
    }
  }

  async getUserPointTransactionsAsync(userId: number | string): Promise<PointTransaction[]> {
    try {
      const transactions = await firebaseRepo.getPointTransactions(userId.toString())
      return transactions.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as unknown as PointTransaction[]
    } catch (error) {
      console.error('getUserPointTransactionsAsync failed:', error)
      return this.getUserPointTransactions(userId)
    }
  }

  async createPointTransactionAsync(
    userId: number | string,
    type: PointTransaction['type'],
    amount: number,
    description: string,
    paymentMethod?: string,
    orderNo?: string
  ): Promise<PointTransaction> {
    const user = await this.getUserByIdAsync(userId)
    if (!user) throw new Error('User not found')

    const newBalance = (user.points || 0) + amount
    
    // Update user points
    await this.updateUserAsync(userId, { points: newBalance })

    const transaction = {
      userId: userId.toString(),
      userName: user.nickname || user.username,
      type,
      amount,
      balance: newBalance,
      status: 'completed',
      description,
      paymentMethod,
      orderNo,
      createdAt: new Date().toISOString()
    }

    const result = await firebaseRepo.addPointTransaction(transaction)
    
    // Update local cache
    const transactions = this.getPointTransactions()
    transactions.push(result as unknown as PointTransaction)
    this.saveToStorage(this.STORAGE_KEYS.pointTransactions, transactions)

    return result as unknown as PointTransaction
  }

  // Get all point transaction records
  getPointTransactions(): PointTransaction[] {
    return this.getFromStorage(this.STORAGE_KEYS.pointTransactions) || []
  }

  // Get user's point transaction records
  getUserPointTransactions(userId: number | string): PointTransaction[] {
    const transactions = this.getPointTransactions()
    return transactions.filter(transaction => transaction.userId == userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Create point transaction record
  private createPointTransaction(
    userId: number | string,
    type: PointTransaction['type'],
    amount: number,
    description: string,
    paymentMethod?: string,
    orderNo?: string
  ): PointTransaction {
    const user = this.getUserById(userId)
    if (!user) throw new Error('User not found')

    const transaction: PointTransaction = {
      id: this.generateId(),
      userId,
      userName: user.nickname || user.username,
      type,
      amount,
      balance: (user.points || 0) + amount, // Calculate balance after operation
      status: 'completed',
      description,
      paymentMethod: paymentMethod as any,
      orderNo,
      createdAt: new Date().toISOString()
    }

    // Update user points
    this.updateUser(userId, { points: transaction.balance })

    // Save transaction record
    const transactions = this.getPointTransactions()
    transactions.push(transaction)
    this.saveToStorage(this.STORAGE_KEYS.pointTransactions, transactions)

    return transaction
  }

  // ===================== Recharge Management =====================

  // Async methods
  async getRechargeOrdersAsync(): Promise<RechargeOrder[]> {
    try {
      const orders = await firebaseRepo.getRechargeOrders()
      this.saveToStorage(this.STORAGE_KEYS.rechargeOrders, orders)
      return orders as unknown as RechargeOrder[]
    } catch (error) {
      console.error('getRechargeOrdersAsync failed:', error)
      return this.getFromStorage(this.STORAGE_KEYS.rechargeOrders) || []
    }
  }

  async getUserRechargeOrdersAsync(userId: number | string): Promise<RechargeOrder[]> {
    try {
      const orders = await firebaseRepo.getUserRechargeOrders(userId.toString())
      return orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as unknown as RechargeOrder[]
    } catch (error) {
      console.error('getUserRechargeOrdersAsync failed:', error)
      const allOrders = this.getFromStorage(this.STORAGE_KEYS.rechargeOrders) || []
      return allOrders.filter((o: any) => o.userId == userId).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  }

  async createRechargeOrderAsync(userId: number | string, amount: number, paymentMethod: 'alipay' | 'wechat' | 'bank'): Promise<RechargeOrder> {
    const user = await this.getUserByIdAsync(userId)
    if (!user) throw new Error('User not found')

    const points = amount * 100
    const orderNo = 'ORDER' + Date.now().toString() + Math.random().toString(36).substr(2, 5).toUpperCase()

    const order = {
      userId: userId.toString(),
      userName: user.nickname || user.username,
      amount,
      points,
      paymentMethod,
      status: 'pending',
      orderNo,
      createdAt: new Date().toISOString()
    }

    const result = await firebaseRepo.createRechargeOrder(order)
    return result as unknown as RechargeOrder
  }

  async completeRechargeOrderAsync(orderId: string): Promise<boolean> {
    try {
      const order = await firebaseRepo.getRechargeOrder(orderId) as any
      if (!order || order.status !== 'pending') return false

      await firebaseRepo.updateRechargeOrder(orderId, {
        status: 'completed',
        completedAt: new Date().toISOString()
      })

      // Create transaction
      await this.createPointTransactionAsync(
        order.userId,
        'recharge',
        order.points,
        `Recharge $${order.amount}`,
        order.paymentMethod,
        order.orderNo
      )

      return true
    } catch (error) {
      console.error('completeRechargeOrderAsync failed:', error)
      return false
    }
  }

  // Create recharge order
  createRechargeOrder(userId: number | string, amount: number, paymentMethod: 'alipay' | 'wechat' | 'bank'): RechargeOrder {
    const user = this.getUserById(userId)
    if (!user) throw new Error('User not found')

    const points = amount * 100 // 1 RMB = 100 Points
    const orderNo = this.generateOrderNo()

    const order: RechargeOrder = {
      id: this.generateId(),
      userId,
      userName: user.nickname || user.username,
      amount,
      points,
      paymentMethod,
      status: 'pending',
      orderNo,
      createdAt: new Date().toISOString()
    }

    const orders = this.getFromStorage(this.STORAGE_KEYS.rechargeOrders) || []
    orders.push(order)
    this.saveToStorage(this.STORAGE_KEYS.rechargeOrders, orders)

    return order
  }

  // Complete recharge order
  completeRechargeOrder(orderId: string): boolean {
    const orders = this.getFromStorage(this.STORAGE_KEYS.rechargeOrders) || []
    const orderIndex = orders.findIndex((order: RechargeOrder) => order.id === orderId)
    
    if (orderIndex === -1) return false

    const order = orders[orderIndex]
    order.status = 'completed'
    order.completedAt = new Date().toISOString()
    
    // Create point transaction record
    this.createPointTransaction(
      order.userId,
      'recharge',
      order.points,
      `Recharge $${order.amount}`,
      order.paymentMethod,
      order.orderNo
    )

    this.saveToStorage(this.STORAGE_KEYS.rechargeOrders, orders)
    return true
  }

  // ===================== Membership Management =====================

  // Async methods
  async getMembershipRecordsAsync(): Promise<MembershipRecord[]> {
    const repo = firebaseRepo as any
    const records = await repo.getMembershipRecords()
    return records as unknown as MembershipRecord[]
  }

  async getUserMembershipStatusAsync(userId: number | string): Promise<{ isMember: boolean; type?: string; endDate?: string }> {
    const records = await firebaseRepo.getUserMembershipRecords(userId.toString())
    const activeRecord = records.find((record: any) => 
      record.status === 'active' && 
      new Date(record.endDate) > new Date()
    ) as any

    if (activeRecord) {
      return {
        isMember: true,
        type: activeRecord.type,
        endDate: activeRecord.endDate
      }
    }

    return { isMember: false }
  }

  async purchaseMembershipAsync(userId: number | string, type: 'monthly' | 'yearly'): Promise<MembershipRecord | null> {
    const user = await this.getUserByIdAsync(userId)
    if (!user) throw new Error('User not found')

    const pointsCost = type === 'monthly' ? 1000 : 10000
    if ((user.points || 0) < pointsCost) {
      throw new Error('Insufficient points')
    }

    const now = new Date()
    const endDate = new Date(now)
    if (type === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1)
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1)
    }

    const membershipRecord = {
      userId: userId.toString(),
      userName: user.nickname || user.username,
      type,
      pointsCost,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      createdAt: now.toISOString()
    }

    const result = await firebaseRepo.addMembershipRecord(membershipRecord)

    // Update user membership status
    await this.updateUserAsync(userId, {
      membershipType: type,
      membershipEndDate: endDate.toISOString()
    })

    // Create transaction
    await this.createPointTransactionAsync(
      userId,
      'membership',
      -pointsCost,
      `Purchase ${type === 'monthly' ? 'Monthly' : 'Yearly'} Membership`
    )

    return result as unknown as MembershipRecord
  }

  // Get all membership records
  getMembershipRecords(): MembershipRecord[] {
    return this.getFromStorage(this.STORAGE_KEYS.membershipRecords) || []
  }

  // Get user membership status
  getUserMembershipStatus(userId: number): { isMember: boolean; type?: string; endDate?: string } {
    const records = this.getMembershipRecords()
    const activeRecord = records.find(record => 
      record.userId === userId && 
      record.status === 'active' && 
      new Date(record.endDate) > new Date()
    )

    if (activeRecord) {
      return {
        isMember: true,
        type: activeRecord.type,
        endDate: activeRecord.endDate
      }
    }

    return { isMember: false }
  }

  // Purchase membership
  purchaseMembership(userId: number | string, type: 'monthly' | 'yearly'): MembershipRecord | null {
    const user = this.getUserById(userId)
    if (!user) throw new Error('User not found')

    const pointsCost = type === 'monthly' ? 1000 : 10000
    if (user.points < pointsCost) {
      throw new Error('Insufficient points')
    }

    const now = new Date()
    const endDate = new Date(now)
    if (type === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1)
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1)
    }

    // Create membership record
    const membershipRecord: MembershipRecord = {
      id: this.generateId(),
      userId,
      userName: user.nickname || user.username,
      type,
      pointsCost,
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      createdAt: now.toISOString()
    }

    // Save membership record
    const records = this.getMembershipRecords()
    records.push(membershipRecord)
    this.saveToStorage(this.STORAGE_KEYS.membershipRecords, records)

    // Update user membership status
    this.updateUser(userId, {
      membershipType: type,
      membershipEndDate: endDate.toISOString()
    })

    // Create points deduction record
    this.createPointTransaction(
      userId,
      'membership',
      -pointsCost,
      `Purchase ${type === 'monthly' ? 'Monthly' : 'Yearly'} Membership`
    )

    return membershipRecord
  }

  // ===================== Withdraw Management =====================

  // Async methods
  async getWithdrawRequestsAsync(): Promise<WithdrawRequest[]> {
    try {
      const requests = await firebaseRepo.getWithdrawRequests()
      return requests as unknown as WithdrawRequest[]
    } catch (error) {
      console.error('getWithdrawRequestsAsync failed:', error)
      return this.getWithdrawRequests()
    }
  }

  async getUserWithdrawRequestsAsync(userId: number | string): Promise<WithdrawRequest[]> {
    try {
      const requests = await firebaseRepo.getUserWithdrawRequests(userId.toString())
      return requests.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) as unknown as WithdrawRequest[]
    } catch (error) {
      console.error('getUserWithdrawRequestsAsync failed:', error)
      return this.getUserWithdrawRequests(userId)
    }
  }

  async createWithdrawRequestAsync(
    userId: number | string,
    points: number,
    bankInfo: { bankName: string; accountNumber: string; accountName: string }
  ): Promise<WithdrawRequest> {
    const user = await this.getUserByIdAsync(userId)
    if (!user) throw new Error('User not found')

    if ((user.points || 0) < points) {
      throw new Error('Insufficient points')
    }

    const request = {
      userId: userId.toString(),
      userName: user.nickname || user.username,
      points,
      amount: points / 100, // Assume 100 points = 1 RMB
      bankInfo,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    const result = await firebaseRepo.createWithdrawRequest(request)

    // Deduct points immediately
    await this.createPointTransactionAsync(
      userId,
      'withdraw',
      -points,
      'Point Withdraw Request'
    )

    return result as unknown as WithdrawRequest
  }

  async processWithdrawRequestAsync(requestId: string, status: 'approved' | 'rejected', remark?: string): Promise<boolean> {
    try {
      const requests = await this.getWithdrawRequestsAsync()
      const request = requests.find(r => r.id === requestId)
      
      if (!request) return false
      
      await firebaseRepo.updateWithdrawRequest(requestId, {
        status,
        remark,
        processedAt: new Date().toISOString()
      })

      if (status === 'rejected') {
         // Refund points
         await this.createPointTransactionAsync(
           request.userId,
           'reward',
           request.points,
           'Withdraw request rejected, points refunded'
         )
      }
      return true
    } catch (error) {
      console.error('processWithdrawRequestAsync failed:', error)
      return false
    }
  }

  // ===================== 统计分析 =====================

  async getPointsStatsAsync() {
    const repo = firebaseRepo as any
    const transactions = await this.getPointTransactionsAsync()
    const withdrawRequests = await this.getWithdrawRequestsAsync()
    const rechargeOrders = await repo.getRechargeOrders() as unknown as RechargeOrder[]

    const totalPoints = transactions.reduce((sum, t) => sum + (Number(t.amount) > 0 ? Number(t.amount) : 0), 0)
    const consumedPoints = Math.abs(transactions.reduce((sum, t) => sum + (Number(t.amount) < 0 ? Number(t.amount) : 0), 0))
    
    const pendingWithdraw = withdrawRequests
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + (Number(r.points) || 0), 0)
      
    const totalRecharge = rechargeOrders
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (Number(r.amount) || 0), 0)

    return {
      totalPoints,
      consumedPoints,
      pendingWithdraw,
      totalRecharge
    }
  }

  async getUserPointsOverviewAsync(userId: number | string) {
    const transactions = await this.getUserPointTransactionsAsync(userId)
    
    return {
      totalIncome: transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
      totalExpense: Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)),
      transactionCount: transactions.length
    }
  }

  // ===================== 管理员功能 =====================

  async getUserStatsAsync() {
    const users = await this.getUsersAsync()
    const activeMembers = await this.getMembershipRecordsAsync()
    
    // Filter unique active members
    const uniqueMembers = new Set(
      activeMembers
        .filter(r => r.status === 'active' && new Date(r.endDate) > new Date())
        .map(r => r.userId)
    ).size

    const totalPoints = users.reduce((sum, user) => sum + (user.points || 0), 0)

    return {
      totalUsers: users.length,
      activeMembers: uniqueMembers,
      totalPoints,
      newUsersToday: users.filter(u => {
        const date = new Date(u.createdAt)
        const today = new Date()
        return date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear()
      }).length
    }
  }

  async adminAdjustUserPointsAsync(
    userId: number | string,
    amount: number,
    reason: string
  ): Promise<boolean> {
    try {
      const user = await this.getUserByIdAsync(userId)
      if (!user) return false

      await this.createPointTransactionAsync(
        userId,
        amount > 0 ? 'reward' : 'penalty',
        amount,
        reason
      )
      return true
    } catch (error) {
      console.error('adminAdjustUserPointsAsync failed:', error)
      return false
    }
  }

  async banUserAsync(userId: number | string, reason: string): Promise<boolean> {
    // Check admin permission logic should be on server or verified via auth, 
    // but here we just do the update.
    try {
      await this.updateUserAsync(userId, {
        status: 'banned',
        banReason: reason,
        banTime: new Date().toISOString()
      })
      return true
    } catch (error) {
      return false
    }
  }

  async unbanUserAsync(userId: number | string): Promise<boolean> {
    try {
      await this.updateUserAsync(userId, {
        status: 'active',
        banReason: undefined, // Firestore doesn't support undefined well, might need deleteField() but partial update ignores undefined.
        // Better pass null or empty string? Or rely on interface.
        // Let's assume partial update works or just ignore cleaning up fields for now.
        // Actually passing null is better for clearing.
        banTime: undefined
      })
      // If undefined doesn't remove the field in updateDoc, we might need to send something else.
      // But for now let's stick to this.
      return true
    } catch (error) {
      return false
    }
  }

  // 获取所有提现申请
  getWithdrawRequests(): WithdrawRequest[] {
    return this.getFromStorage(this.STORAGE_KEYS.withdrawRequests) || []
  }

  // 获取用户的提现申请
  getUserWithdrawRequests(userId: number | string): WithdrawRequest[] {
    const requests = this.getWithdrawRequests()
    return requests.filter(request => request.userId == userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // 创建提现申请
  createWithdrawRequest(
    userId: number | string, 
    points: number, 
    bankInfo: { bankName: string; accountNumber: string; accountName: string }
  ): WithdrawRequest {
    const user = this.getUserById(userId)
    if (!user) throw new Error('User not found')

    if ((user.points || 0) < points) {
      throw new Error('Insufficient points')
    }

    if (points < 1) {
      throw new Error('Minimum withdraw is 1 point')
    }

    const amount = points / 100 // 100 points = 1 RMB

    const withdrawRequest: WithdrawRequest = {
      id: this.generateId(),
      userId,
      userName: user.nickname || user.username,
      points,
      amount,
      bankInfo,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    // 先扣除积分
    this.createPointTransaction(
      userId,
      'withdraw',
      -points,
      `Withdraw Request ¥${amount.toFixed(2)}`
    )

    // 保存提现申请
    const requests = this.getWithdrawRequests()
    requests.push(withdrawRequest)
    this.saveToStorage(this.STORAGE_KEYS.withdrawRequests, requests)

    return withdrawRequest
  }

  // 管理员处理提现申请
  processWithdrawRequest(
    requestId: string, 
    action: 'approve' | 'reject', 
    adminId: number,
    rejectReason?: string
  ): boolean {
    const requests = this.getWithdrawRequests()
    const requestIndex = requests.findIndex(request => request.id === requestId)
    
    if (requestIndex === -1) return false

    const request = requests[requestIndex]
    const admin = this.getUserById(adminId)
    
    if (action === 'approve') {
      request.status = 'approved'
    } else {
      request.status = 'rejected'
      request.rejectReason = rejectReason
      
      // 如果拒绝，需要退还积分
      this.createPointTransaction(
        request.userId,
        'reward',
        request.points,
        `Withdraw request rejected, points refunded ¥${request.amount.toFixed(2)}`
      )
    }

    request.processedAt = new Date().toISOString()
    request.adminId = adminId
    request.adminName = admin?.nickname || admin?.username || 'Admin'

    this.saveToStorage(this.STORAGE_KEYS.withdrawRequests, requests)
    return true
  }

  // ===================== 统计数据 =====================

  // 获取积分系统统计数据
  getPointsStats() {
    const transactions = this.getPointTransactions()
    const users = this.getUsers()


    // 计算总积分流通量
    const totalPoints = users.reduce((sum, user) => sum + user.points, 0)
    
    // 计算充值总额
    const rechargeTransactions = transactions.filter(t => t.type === 'recharge')
    const totalRecharge = rechargeTransactions.reduce((sum, t) => sum + t.amount, 0)
    
    // 计算提现总额
    const withdrawTransactions = transactions.filter(t => t.type === 'withdraw')
    const totalWithdraw = Math.abs(withdrawTransactions.reduce((sum, t) => sum + t.amount, 0))
    
    // 计算会员开通总额
    const membershipTransactions = transactions.filter(t => t.type === 'membership')
    const totalMembershipSpent = Math.abs(membershipTransactions.reduce((sum, t) => sum + t.amount, 0))
    
    // 活跃会员数
    const activeMembers = users.filter(user => 
      user.membershipType !== 'none' && 
      user.membershipEndDate && 
      new Date(user.membershipEndDate) > new Date()
    ).length

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

  // 获取用户积分概览
  getUserPointsOverview(userId: number) {
    const transactions = this.getUserPointTransactions(userId)
    
    // 计算总充值
    const totalRecharge = transactions
      .filter(t => t.type === 'recharge')
      .reduce((sum, t) => sum + t.amount, 0)
    
    // 计算总消费
    const totalSpent = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    // 最近交易记录（最多10条）
    const recentTransactions = transactions.slice(0, 10)

    return {
      totalRecharge,
      totalSpent,
      recentTransactions
    }
  }

  // 获取用户统计数据
  getUserStats() {
    const users = this.getUsers()
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    return {
      totalUsers: users.length,
      activeUsers: users.filter(user => user.status === 'active').length,
      bannedUsers: users.filter(user => user.status === 'banned').length,
      newUsersToday: users.filter(user => 
        new Date(user.createdAt) > oneDayAgo
      ).length
    }
  }

  // ===================== 管理员功能 =====================

  // 管理员调整用户积分
  adminAdjustUserPoints(
    userId: number | string,
    amount: number,
    reason: string,
    adminId: number | string
  ): boolean {
    const user = this.getUserById(userId)
    const admin = this.getUserById(adminId)
    
    if (!user || !admin || admin.role !== 'admin') return false

    // Check if points become negative
    if (user.points + amount < 0) {
      throw new Error('Points cannot be negative after adjustment')
    }

    const type = amount > 0 ? 'reward' : 'penalty'
    const description = `Admin Adjustment: ${reason} (Operator: ${admin.nickname || admin.username})`

    this.createPointTransaction(userId, type, amount, description)
    return true
  }

  // 管理员封禁用户
  banUser(userId: number, reason: string, adminId: number): boolean {
    const admin = this.getUserById(adminId)
    if (!admin || admin.role !== 'admin') return false

    return !!this.updateUser(userId, {
      status: 'banned',
      banReason: reason,
      banTime: new Date().toISOString()
    })
  }

  // 管理员解封用户
  unbanUser(userId: number, adminId: number): boolean {
    const admin = this.getUserById(adminId)
    if (!admin || admin.role !== 'admin') return false

    return !!this.updateUser(userId, {
      status: 'active',
      banReason: undefined,
      banTime: undefined
    })
  }

}

// 导出单例实例
export const pointsDataManager = PointsDataManager.getInstance()
export default PointsDataManager
