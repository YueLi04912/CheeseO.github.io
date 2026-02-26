<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 pt-10 relative overflow-hidden">
    <!-- Dynamic background elements -->
    <div class="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      <div class="bubble w-24 h-24 top-[10%] right-[5%] bg-gradient-to-r from-pink-300/20 to-purple-300/20"></div>
      <div class="bubble w-16 h-16 bottom-[15%] left-[10%] bg-gradient-to-r from-blue-300/20 to-indigo-300/20 animation-delay-2000"></div>
      <div class="bubble w-20 h-20 top-[25%] left-[15%] bg-gradient-to-r from-yellow-300/20 to-orange-300/20 animation-delay-3000"></div>
    </div>

    <!-- Main content area -->
    <div class="max-w-md mx-auto px-4 pt-12 pb-16 relative z-10">
      <div class="glass-panel rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:shadow-2xl">
        <!-- Title -->
        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-white flex items-center">
                <i class="fas fa-coins text-yellow-300 mr-3 animate-pulse"></i>
                Points Center
              </h1>
              <p class="text-indigo-100 text-sm mt-1">Points Recharge & Membership</p>
            </div>
            <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-3 py-1 rounded-full flex items-center">
              <span>{{ currentUser?.points || 0 }}</span>
              <i class="fas fa-coins ml-1 text-white"></i>
              <button 
                @click="syncUserData"
                class="ml-2 text-xs hover:text-yellow-200 transition-colors"
                title="Refresh Points Data"
              >
                <i class="fas fa-sync-alt" :class="{ 'animate-spin': isSyncing }"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Tab navigation -->
        <div class="flex border-b border-indigo-100">
          <button 
            @click="activeTab = 'points'"
            :class="[
              'flex-1 py-4 font-medium text-center transition-all duration-300',
              activeTab === 'points' 
                ? 'text-indigo-600 bg-gradient-to-b from-white to-indigo-50 border-t-2 border-indigo-500 relative'
                : 'text-gray-500 hover:text-indigo-500'
            ]"
          >
            <div class="flex items-center justify-center">
              <i class="fas fa-bolt mr-2"></i>
              <span>Recharge Points</span>
            </div>
            <div v-if="activeTab === 'points'" class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-indigo-500 rounded-t-full"></div>
          </button>
          <button 
            @click="activeTab = 'membership'"
            :class="[
              'flex-1 py-4 font-medium text-center transition-all duration-300',
              activeTab === 'membership' 
                ? 'text-purple-600 bg-gradient-to-b from-white to-purple-50 border-t-2 border-purple-500 relative'
                : 'text-gray-500 hover:text-purple-500'
            ]"
          >
            <div class="flex items-center justify-center">
              <i class="fas fa-crown mr-2"></i>
              <span>Upgrade Membership</span>
            </div>
            <div v-if="activeTab === 'membership'" class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-purple-500 rounded-t-full"></div>
          </button>
        </div>
        
        <!-- Points recharge content -->
        <div v-if="activeTab === 'points'" class="p-6">
          <h2 class="text-lg font-semibold text-indigo-700 mb-4 flex items-center">
            <i class="fas fa-money-bill-wave mr-2"></i>
            Recharge Amount
          </h2>
          <div class="grid grid-cols-3 gap-3">
            <button 
              v-for="(amount, index) in amountOptions" 
              :key="amount.value"
              @click="selectAmount(amount)"
              :class="[
                'py-3 px-4 rounded-xl border text-center transition-all duration-300 transform hover:-translate-y-1 relative',
                selectedAmount.value === amount.value 
                  ? 'bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-300 shadow-md text-indigo-600 font-medium'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              ]"
            >
              <div class="text-lg flex items-center justify-center">
                <span class="mr-1">$</span>
                {{ amount.value }}
              </div>
              <div class="text-xs text-gray-500 mt-1 flex items-center justify-center">
                <i class="fas fa-coins text-yellow-500 mr-1 text-xs"></i>
                {{ amount.points }}
              </div>
              <div v-if="index < 2" class="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] px-1 rounded-bl-lg rounded-tr-lg">
                Hot
              </div>
            </button>
          </div>
          
          <!-- 自定义金额 -->
          <div class="mt-6 floating-element">
            <label class="block text-sm font-medium text-indigo-700 mb-2 flex items-center">
              <i class="fas fa-pen mr-2"></i>
              Custom Amount
            </label>
            <div class="relative">
              <input
                type="number"
                v-model="customAmount"
                placeholder="Enter other amount"
                min="1"
                class="w-full pl-10 pr-4 py-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white/80 transition-all"
                @focus="selectCustomAmount"
                @input="validateCustomAmount"
              >
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-500">
                $
              </span>
            </div>
          </div>
          
          <!-- 支付方式 -->
          <div class="mt-8">
            <h2 class="text-lg font-semibold text-indigo-700 mb-4 flex items-center">
              <i class="fas fa-credit-card mr-2"></i>
              Payment Method
            </h2>
            <div class="space-y-3">
              <div 
                v-for="method in paymentMethods" 
                :key="method.id"
                @click="selectPaymentMethod(method)"
                :class="[
                  'p-4 rounded-xl border cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5',
                  selectedPaymentMethod.id === method.id
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300 shadow-sm'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                ]"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 mr-3 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100">
                    <i :class="[method.icon, method.iconClass, 'text-2xl']"></i>
                  </div>
                  <span class="font-medium text-gray-800">{{ method.name }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 订单信息 -->
          <div class="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl mt-6 mb-6 border border-indigo-100">
            <div class="flex justify-between py-3 border-b border-indigo-100">
              <span class="text-indigo-700 flex items-center">
                <i class="fas fa-money-bill mr-2"></i>
                Recharge Amount
              </span>
              <span class="font-medium text-indigo-600">${{ currentAmount }}</span>
            </div>
            <div class="flex justify-between py-3">
              <span class="text-indigo-700 flex items-center">
                <i class="fas fa-coins mr-2 text-yellow-500"></i>
                Points to Get
              </span>
              <span class="font-medium text-indigo-600">{{ currentPoints }}</span>
            </div>
          </div>
          
          <!-- 支付按钮 -->
          <button 
            @click="handlePointsPayment"
            class="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center"
            :disabled="currentAmount <= 0 || loading"
          >
            <i class="fas fa-bolt mr-2 animate-pulse"></i>
            {{ loading ? 'Processing...' : `Recharge Now $${currentAmount}` }}
          </button>
        </div>
        
        <!-- 会员开通内容 -->
        <div v-if="activeTab === 'membership'" class="p-6">
          <!-- 当前会员状态 -->
          <div class="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
            <div class="flex justify-between items-center mb-3">
              <span class="text-purple-700 flex items-center">
                <i class="fas fa-crown mr-2 text-yellow-500"></i>
                Membership Status
              </span>
              <span class="font-medium text-purple-600">{{ getMembershipStatusText() }}</span>
            </div>
            <div class="flex justify-between items-center mb-3">
              <span class="text-purple-700 flex items-center">
                <i class="fas fa-coins mr-2 text-yellow-500"></i>
                Current Points
              </span>
              <span class="font-medium text-purple-600">{{ currentUser?.points || 0 }} Points</span>
            </div>
            <div v-if="membershipStatus.isMember" class="text-sm text-purple-600">
              Expire Date: {{ formatDate(membershipStatus.endDate) }}
            </div>
          </div>
          
          <h2 class="text-lg font-semibold text-purple-700 mb-4 flex items-center">
            <i class="fas fa-crown mr-2 text-yellow-500"></i>
            Membership Plans
          </h2>
          <div class="space-y-4">
            <div 
              v-for="plan in membershipPlans" 
              :key="plan.id"
              @click="selectPlan(plan)"
              :class="[
                'p-4 rounded-xl border cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5',
                selectedPlan.id === plan.id
                  ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300 shadow-sm'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              ]"
            >
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="font-medium text-gray-800 flex items-center">
                    <i :class="plan.icon" class="mr-2 text-yellow-500"></i>
                    {{ plan.name }}
                  </h3>
                  <p class="text-sm text-gray-600 mt-1">{{ plan.description }}</p>
                </div>
                <div class="text-right">
                  <div class="text-purple-600 font-medium flex items-center justify-end">
                    <i class="fas fa-coins text-yellow-500 mr-1"></i>
                    {{ plan.points }}
                  </div>
                  <div class="text-xs text-gray-500">{{ plan.duration }}</div>
                </div>
              </div>
              <div class="mt-3 pt-3 border-t border-gray-100">
                <ul class="space-y-1 text-sm text-gray-600">
                  <li v-for="(benefit, index) in plan.benefits" :key="index" class="flex items-start">
                    <i class="fas fa-check-circle text-green-500 text-xs mt-1 mr-2"></i>
                    <span>{{ benefit }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- 开通按钮 -->
          <button 
            @click="handleMembershipPayment"
            :class="[
              'w-full py-3 px-4 mt-6 font-medium rounded-xl transition-all duration-300 transform flex items-center justify-center',
              canPurchaseMembership
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white hover:-translate-y-0.5 hover:shadow-lg'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            ]"
            :disabled="!canPurchaseMembership || loading"
          >
            <i class="fas fa-gem mr-2"></i>
            {{ getMembershipButtonText() }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 积分动画 -->
    <transition name="fade-slide">
      <div v-if="showPointsAnimation" class="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div 
          class="text-4xl font-bold animate-bounce flex items-center"
          :class="animationType === 'add' ? 'text-green-500' : 'text-red-500'"
        >
          <i class="fas fa-coins mr-2"></i>
          {{ animationType === 'add' ? `+${animatedPoints} Points` : `-${Math.abs(animatedPoints)} Points` }}
        </div>
      </div>
    </transition>

    <!-- 成功提示 -->
    <transition name="fade-slide">
      <div v-if="showSuccessMessage" class="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div class="bg-white rounded-xl p-6 shadow-2xl border border-green-200">
          <div class="text-center">
            <i class="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
            <h3 class="text-xl font-bold text-gray-800 mb-2">{{ successMessage }}</h3>
            <p class="text-gray-600">Operation Completed</p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { SimpleDataManager } from '@/utils/simpleDataManager'
import { alipayService } from '@/services/alipayService'

// 接口定义
interface AmountOption {
  value: number
  points: number
}

interface MembershipPlan {
  id: string
  name: string
  points: number
  icon: string
  description: string
  duration: string
  benefits: string[]
  type: 'monthly' | 'yearly'
}

interface PaymentMethod {
  id: string
  name: string
  icon: string
  iconClass: string
  type: 'alipay' | 'wechat' | 'bank'
}

// 路由和数据管理器
const router = useRouter()
const dataManager = SimpleDataManager.getInstance()

// 响应式数据
const currentUser = ref(dataManager.getCurrentUser())
const activeTab = ref<'points' | 'membership'>('points')
const loading = ref(false)
const isSyncing = ref(false)

// 会员状态
const membershipStatus = ref<{ isMember: boolean; type?: string; endDate?: string }>({ 
  isMember: false, 
  type: '', 
  endDate: '' 
})

// 充值金额选项
const amountOptions = ref<AmountOption[]>([
  { value: 10, points: 1000 },
  { value: 20, points: 2000 },
  { value: 50, points: 5000 },
  { value: 100, points: 10000 },
  { value: 200, points: 20000 },
  { value: 500, points: 50000 }
])

// 会员套餐
const membershipPlans = ref<MembershipPlan[]>([
  { 
    id: 'monthly', 
    name: "Monthly Member", 
    points: 1000, 
    icon: "fas fa-moon",
    description: "30 days of membership privileges",
    duration: "Valid for 30 days",
    type: 'monthly',
    benefits: [
      "Free access to paid articles",
      "Exclusive learning materials",
      "Member-only events"
    ]
  },
  { 
    id: 'yearly', 
    name: "Annual Member", 
    points: 10000, 
    icon: "fas fa-sun",
    description: "365 days of membership privileges",
    duration: "Valid for 365 days",
    type: 'yearly',
    benefits: [
      "Free access to all paid articles",
      "Advanced learning library",
      "VIP study group",
      "Monthly exclusive live classes"
    ]
  }
])

// 支付方式
const paymentMethods = ref<PaymentMethod[]>([
  { id: 'alipay', name: "Alipay", icon: "fab fa-alipay", iconClass: "text-blue-500", type: 'alipay' },
  { id: 'wechat', name: "WeChat Pay", icon: "fab fa-weixin", iconClass: "text-green-500", type: 'wechat' },
  { id: 'bank', name: "Credit Card", icon: "fas fa-credit-card", iconClass: "text-gray-500", type: 'bank' }
])

// 选择状态
const selectedAmount = ref<AmountOption>(amountOptions.value[0])
const selectedPlan = ref<MembershipPlan>(membershipPlans.value[0])
const selectedPaymentMethod = ref<PaymentMethod>(paymentMethods.value[0])
const customAmount = ref<string>('')

// 动画相关
const showPointsAnimation = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')
const animatedPoints = ref(0)
const animationType = ref<'add' | 'subtract'>('add')

// 🔥 修复：使用正确的定时器类型
let syncInterval: number | null = null

// 🔥 修复：实现本地的用户数据同步方法
const syncUserData = async () => {
  if (!currentUser.value) return
  
  isSyncing.value = true
  
  try {
    // 重新从数据管理器获取最新的用户数据
    const latestUser = await dataManager.getUserByIdAsync(currentUser.value.id)
    if (latestUser) {
      currentUser.value = latestUser
      dataManager.setCurrentUser(latestUser) // 更新当前用户缓存
      console.log('User data synced:', latestUser)
    }
    
    // 同时更新会员状态
    await loadMembershipStatus()
    
  } catch (error) {
    console.error('Failed to sync user data:', error)
  } finally {
    isSyncing.value = false
  }
}

// 页面可见性变化时同步数据
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    syncUserData()
  }
}

// 计算当前金额和积分
const currentAmount = computed(() => {
  const amount = parseInt(customAmount.value)
  return !isNaN(amount) && amount > 0 ? amount : selectedAmount.value.value
})

const currentPoints = computed(() => {
  if (customAmount.value && !isNaN(parseInt(customAmount.value))) {
    const amount = parseInt(customAmount.value)
    return amount * 100 // 1元 = 100积分
  }
  return selectedAmount.value.points
})

// 会员购买检查
const canPurchaseMembership = computed(() => {
  if (!currentUser.value) return false
  return currentUser.value.points >= selectedPlan.value.points
})

// 初始化
onMounted(async () => {
  if (!currentUser.value) {
    router.push('/Login')
    return
  }
  
  // 初始同步数据
  syncUserData()
  
  // 检查是否是从支付宝支付返回
  await checkAlipayReturn()
  
  // 监听页面可见性变化
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  // 🔥 修复：使用 window.setInterval 并正确类型化
  syncInterval = window.setInterval(syncUserData, 30000)
  
  console.log('Projects.vue 已加载真实积分数据，当前用户:', currentUser.value)
})

// 检查支付宝同步返回参数
const checkAlipayReturn = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const outTradeNo = urlParams.get('out_trade_no')
  const tradeNo = urlParams.get('trade_no')
  const totalAmount = urlParams.get('total_amount')
  
  if (outTradeNo && tradeNo) {
    console.log('[Alipay] Detected return from payment:', { outTradeNo, tradeNo, totalAmount })
    
    loading.value = true
    try {
      // 模拟验证并完成订单
      // 在真实后端中，这里需要调用支付宝 API 验证同步返回的签名
      await completeLocalOrder(outTradeNo)
      
      // 清理 URL 参数，防止刷新页面重复充值
      window.history.replaceState({}, document.title, window.location.pathname)
      
      successMessage.value = 'Alipay payment successful!'
      showSuccessMessage.value = true
      setTimeout(() => { showSuccessMessage.value = false }, 3000)
    } catch (error) {
      console.error('Failed to process Alipay return:', error)
    } finally {
      loading.value = false
    }
  }
}

// 清理资源
onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  if (syncInterval !== null) {
    window.clearInterval(syncInterval)
  }
})

// 加载会员状态
const loadMembershipStatus = async () => {
  if (!currentUser.value) return
  
  const status = await dataManager.getUserMembershipStatusAsync(currentUser.value.id)
  membershipStatus.value = {
    isMember: status.isMember,
    type: status.type || '',
    endDate: status.endDate || ''
  }
  
  console.log('会员状态已加载:', membershipStatus.value)
}

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-US')
}

// 获取会员状态文本
const getMembershipStatusText = () => {
  if (membershipStatus.value.isMember) {
    return membershipStatus.value.type === 'monthly' ? 'Monthly Member' : 'Annual Member'
  }
  return 'Standard User'
}

// 获取会员按钮文本
const getMembershipButtonText = () => {
  if (loading.value) return 'Processing...'
  if (!currentUser.value) return 'Please login first'
  if (currentUser.value.points < selectedPlan.value.points) return 'Insufficient points'
  return 'Activate Now'
}

// 验证自定义金额
const validateCustomAmount = () => {
  const value = parseInt(customAmount.value)
  if (isNaN(value) || value <= 0) {
    customAmount.value = ''
  }
}

// 选择方法
const selectAmount = (amount: AmountOption) => {
  selectedAmount.value = amount
  customAmount.value = ''
}

const selectPlan = (plan: MembershipPlan) => {
  selectedPlan.value = plan
}

const selectPaymentMethod = (method: PaymentMethod) => {
  selectedPaymentMethod.value = method
}

const selectCustomAmount = () => {
  selectedAmount.value = { value: 0, points: 0 }
}

// 显示动画
const showAnimation = (type: 'add' | 'subtract', points: number, message: string) => {
  animationType.value = type
  animatedPoints.value = points
  showPointsAnimation.value = true
  
  setTimeout(() => {
    showPointsAnimation.value = false
    successMessage.value = message
    showSuccessMessage.value = true
    
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  }, 2000)
}

// 处理积分充值
const handlePointsPayment = async () => {
  if (currentAmount.value <= 0 || !currentUser.value) return
  
  loading.value = true
  
  try {
    // 1. 创建充值订单
    const order = await dataManager.createRechargeOrderAsync(
      currentUser.value.id,
      currentAmount.value,
      selectedPaymentMethod.value.type
    )
    
    console.log('充值订单已创建:', order)

    // 2. 根据支付方式处理
    if (selectedPaymentMethod.value.type === 'alipay') {
      // 接入支付宝沙箱 API：构造请求并跳转到支付宝真实网关
      // 注意：由于没有后端，签名(sign)在 alipayService 中是 mock 的，
      // 跳转后支付宝会提示“签名校验失败”，这是正常现象，说明你已经成功触达到了支付宝 API。
      await alipayService.initiatePayment(
        order.id, 
        currentAmount.value, 
        `Points Recharge - ${currentPoints.value} Points`
      )
      // 页面会发生跳转，后续逻辑由 onMounted 中的 checkAlipayReturn 处理
    } else {
      // 其他支付方式（微信/银行卡）目前仍走模拟逻辑
      await new Promise(resolve => setTimeout(resolve, 1500))
      await completeLocalOrder(order.id)
    }
  } catch (error: any) {
    console.error('Recharge failed:', error)
    alert(error.message || 'Recharge failed, please try again later')
  } finally {
    loading.value = false
  }
}

// 提取公共的完成订单逻辑
const completeLocalOrder = async (orderId: string) => {
  const result = await dataManager.completeRechargeOrderAsync(orderId)
  
  if (result) {
    // 同步最新用户数据
    await syncUserData()
    
    // 显示成功动画
    showAnimation('add', currentPoints.value, 'Recharge successful!')
    
    // 重置表单
    selectedAmount.value = amountOptions.value[0]
    customAmount.value = ''
    
    console.log('Recharge successful, current points:', currentUser.value?.points)
  } else {
    throw new Error('Order completion failed')
  }
}

// Handle membership activation
const handleMembershipPayment = async () => {
if (!canPurchaseMembership.value || !currentUser.value) return

if (!confirm(`Confirm to use ${selectedPlan.value.points} points to activate ${selectedPlan.value.name}?`)) {
  return
}

loading.value = true

try {
  // Purchase membership
  const result = await dataManager.purchaseMembershipAsync(
    currentUser.value.id,
    selectedPlan.value.type
  )
  
  if (result) {
    // Important: sync latest user data and membership status
    await syncUserData()
    
    // Show success animation
    showAnimation('subtract', selectedPlan.value.points, 'Membership activated successfully!')
    
    console.log('Membership activated successfully, current points:', currentUser.value?.points)
  } else {
    throw new Error('Membership activation failed')
  }
} catch (error: any) {
  console.error('Membership activation failed:', error)
  alert(error.message || 'Membership activation failed, please try again later')
} finally {
  loading.value = false
}
}
</script>

<style scoped>
/* 动态气泡 */
.bubble {
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  animation: float 6s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-3000 {
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

/* 玻璃拟态效果 */
.glass-panel {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
}

/* 浮动元素效果 */
.floating-element {
  transition: all 0.3s ease;
}

.floating-element:hover {
  transform: translateY(-3px);
}

/* 动画效果 */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -30px);
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 移动端优化 */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  button, input {
    min-height: 2.5rem;
  }
}
</style>
