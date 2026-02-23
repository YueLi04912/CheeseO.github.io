<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 pt-14 relative overflow-hidden">
    <!-- Dynamic Background Elements -->
    <div class="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      <div class="bubble w-24 h-24 top-[10%] right-[5%] bg-gradient-to-r from-pink-300/20 to-purple-300/20"></div>
      <div class="bubble w-16 h-16 bottom-[15%] left-[10%] bg-gradient-to-r from-blue-300/20 to-indigo-300/20 animation-delay-2000"></div>
      <div class="bubble w-20 h-20 top-[25%] left-[15%] bg-gradient-to-r from-yellow-300/20 to-orange-300/20 animation-delay-3000"></div>
    </div>

    <!-- Main Content Area -->
    <div class="max-w-md mx-auto px-4 py-8 relative z-10">
      <div class="glass-panel rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <!-- Title -->
        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <h1 class="text-xl font-bold text-white flex items-center">
            <i class="fas fa-coins text-yellow-300 mr-2 animate-pulse"></i>
            Points Withdrawal 💰
          </h1>
        </div>
        
        <!-- Withdrawal Form -->
        <div class="p-6">
          <!-- Current Points -->
          <div class="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
            <div class="flex justify-between items-center">
              <span class="text-gray-900 font-medium text-sm sm:text-base">Current Points Balance</span>
              <span class="text-xl font-bold text-indigo-600">{{ currentUser?.points || 0 }} Points</span>
            </div>
          </div>
          
          <!-- Withdrawal Amount -->
          <div class="mb-6">
            <label class="block text-gray-900 font-medium mb-2 text-sm sm:text-base">Withdraw Points</label>
            <div class="relative">
              <input
                type="number"
                v-model.number="withdrawAmount"
                placeholder="Enter points to withdraw (Min. 1 point)"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[3rem] text-sm sm:text-base"
                :class="{ 'border-red-500': amountError }"
                @input="calculateActualAmount"
                min="1"
              >
              <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 font-medium text-sm sm:text-base">Points</span>
            </div>
            <p v-if="amountError" class="mt-1 text-xs sm:text-sm font-medium text-red-600 animate-pulse">{{ amountError }}</p>
          </div>
          
          <!-- Bank Info -->
          <div class="mb-6 space-y-4">
            <h3 class="text-gray-900 font-medium text-sm sm:text-base">Bank Information</h3>
            
            <div>
              <label class="block text-gray-700 text-sm mb-1">Bank Name</label>
              <input
                type="text"
                v-model.trim="bankInfo.bankName"
                placeholder="Enter bank name"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[3rem] text-sm sm:text-base"
                :class="{ 'border-red-500': bankNameError }"
              >
              <p v-if="bankNameError" class="mt-1 text-xs sm:text-sm font-medium text-red-600 animate-pulse">{{ bankNameError }}</p>
            </div>
            
            <div>
              <label class="block text-gray-700 text-sm mb-1">Account Number</label>
              <input
                type="text"
                v-model.trim="bankInfo.accountNumber"
                placeholder="Enter account number"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[3rem] text-sm sm:text-base"
                :class="{ 'border-red-500': accountNumberError }"
              >
              <p v-if="accountNumberError" class="mt-1 text-xs sm:text-sm font-medium text-red-600 animate-pulse">{{ accountNumberError }}</p>
            </div>
            
            <div>
              <label class="block text-gray-700 text-sm mb-1">Account Name</label>
              <input
                type="text"
                v-model.trim="bankInfo.accountName"
                placeholder="Enter account name"
                class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[3rem] text-sm sm:text-base"
                :class="{ 'border-red-500': accountNameError }"
              >
              <p v-if="accountNameError" class="mt-1 text-xs sm:text-sm font-medium text-red-600 animate-pulse">{{ accountNameError }}</p>
            </div>
          </div>
          
          <!-- Fee Description -->
          <div class="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
            <div class="flex justify-between py-2 text-sm sm:text-base">
              <span class="text-gray-900 font-medium">Withdraw Points</span>
              <span class="font-medium text-gray-900">{{ withdrawAmount || 0 }} Points</span>
            </div>
            <div class="flex justify-between py-2 border-t border-gray-300 text-sm sm:text-base">
              <span class="text-gray-900 font-medium">Exchange Rate</span>
              <span class="font-medium text-gray-900">100 Points = $1</span>
            </div>
            <div class="flex justify-between py-2 border-t border-gray-300 text-sm sm:text-base">
              <span class="text-gray-900 font-medium">Estimated Arrival</span>
              <span class="font-bold text-indigo-600">$ {{ actualAmount.toFixed(2) }}</span>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              * Actual amount subject to bank processing, usually arrives in 1-3 business days
            </div>
          </div>
          
          <!-- Withdraw Button -->
          <button
            @click="submitWithdrawal"
            :disabled="!isFormValid || isSubmitting"
            :class="[ 
              'w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 min-h-[3rem] text-sm sm:text-base', 
              isFormValid && !isSubmitting
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Request 🎉' }}
          </button>
          
          <!-- Tips -->
          <div class="mt-4 text-xs text-gray-500">
            <p>• Minimum withdrawal 1 point</p>
            <p>• Request will be reviewed after submission</p>
            <p>• Arrives in 1-3 business days after approval</p>
          </div>
        </div>
      </div>

      <!-- Withdrawal History -->
      <div class="mt-6 glass-panel rounded-lg shadow-xl overflow-hidden">
        <div class="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
          <h2 class="text-lg font-bold text-white flex items-center">
            <i class="fas fa-history text-yellow-300 mr-2"></i>
            Withdrawal History
          </h2>
        </div>
        
        <div class="p-6">
          <div v-if="withdrawHistory.length === 0" class="text-center py-8">
            <i class="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
            <p class="text-gray-500">No withdrawal records</p>
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="record in withdrawHistory" 
              :key="record.id"
              class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="font-medium">{{ record.points }} Points</span>
                    <span class="text-gray-500">→</span>
                    <span class="font-medium text-green-600">¥{{ record.amount }}</span>
                  </div>
                  <div class="text-sm text-gray-500">
                    <p>{{ record.bankInfo.bankName }} ({{ record.bankInfo.accountNumber.replace(/(\d{4})\d*(\d{4})/, '$1****$2') }})</p>
                    <p>{{ formatDateTime(record.createdAt) }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span 
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      getStatusClass(record.status)
                    ]"
                  >
                    {{ getStatusText(record.status) }}
                  </span>
                  <div v-if="record.processedAt" class="text-xs text-gray-500 mt-1">
                    {{ formatDateTime(record.processedAt) }}
                  </div>
                  <div v-if="record.rejectReason" class="text-xs text-red-500 mt-1">
                    {{ record.rejectReason }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Points Deduction Animation -->
    <transition name="fade-slide">
      <div v-if="showPointsAnimation" class="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div class="text-4xl font-bold text-red-500 animate-bounce flex items-center">
          <i class="fas fa-coins mr-2"></i>
          -{{ animatedPoints }} Points
        </div>
      </div>
    </transition>
    
    <!-- Success Message -->
    <transition name="fade-slide">
      <div v-if="showSuccessMessage" class="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div class="bg-white rounded-xl p-6 shadow-2xl border border-green-200">
          <div class="text-center">
            <i class="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Request Submitted</h3>
            <p class="text-gray-600">Please wait for admin review</p>
          </div>
        </div>
      </div>
    </transition>
  </div>

</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SimpleDataManager } from '@/utils/simpleDataManager'

const router = useRouter()
const dataManager = SimpleDataManager.getInstance()

// 响应式数据
const currentUser = ref(dataManager.getCurrentUser())
const withdrawAmount = ref<number | null>(null)
const bankInfo = ref({
  bankName: '',
  accountNumber: '',
  accountName: ''
})

// 表单验证状态
const amountError = ref('')
const bankNameError = ref('')
const accountNumberError = ref('')
const accountNameError = ref('')
const isSubmitting = ref(false)

// 动画状态
const showPointsAnimation = ref(false)
const showSuccessMessage = ref(false)
const animatedPoints = ref(0)

// 提现记录
const withdrawHistory = ref<any[]>([])

// 计算实际到账金额
const actualAmount = computed(() => {
  if (!withdrawAmount.value || withdrawAmount.value <= 0) return 0
  return withdrawAmount.value / 100 // 100积分 = 1元
})

// 表单验证
const isFormValid = computed(() => {
  return withdrawAmount.value && 
         withdrawAmount.value >= 1 && 
         withdrawAmount.value <= (currentUser.value?.points || 0) &&
         bankInfo.value.bankName &&
         bankInfo.value.accountNumber &&
         bankInfo.value.accountName &&
         !amountError.value &&
         !bankNameError.value &&
         !accountNumberError.value &&
         !accountNameError.value
})

// 初始化
onMounted(async () => {
  const user = await dataManager.getCurrentUserAsync()
  if (!user) {
    router.push('/Login')
    return
  }
  
  currentUser.value = user
  
  await loadWithdrawHistory()
  console.log('Withdraw.vue 已加载，当前用户:', currentUser.value)
})

// 加载提现记录
const loadWithdrawHistory = async () => {
  if (!currentUser.value) return
  
  try {
    const history = await dataManager.getUserWithdrawRequestsAsync(currentUser.value.id)
    withdrawHistory.value = history
    console.log('提现记录:', withdrawHistory.value)
  } catch (error) {
    console.error('加载提现记录失败:', error)
  }
}

// 计算实际金额并验证
const calculateActualAmount = () => {
  amountError.value = ''
  const amount = Number(withdrawAmount.value)
  
  if (!withdrawAmount.value) {
    amountError.value = 'Please enter points to withdraw 😓'
  } else if (isNaN(amount) || amount <= 0) {
    amountError.value = 'Please enter a valid amount 😓'
  } else if (amount > (currentUser.value?.points || 0)) {
    amountError.value = 'Insufficient points balance 😓'
  }
}

// 验证银行信息
const validateBankInfo = () => {
  bankNameError.value = ''
  bankNameError.value = ''
  accountNumberError.value = ''
  accountNameError.value = ''
  
  if (!bankInfo.value.bankName) {
    bankNameError.value = 'Please enter bank name 😓'
  }
  
  if (!bankInfo.value.accountNumber) {
    accountNumberError.value = 'Please enter account number 😓'
  } else if (!/^\d{16,19}$/.test(bankInfo.value.accountNumber.replace(/\s/g, ''))) {
    accountNumberError.value = 'Invalid account number format 😓'
  }
  
  if (!bankInfo.value.accountName) {
    accountNameError.value = 'Please enter account name 😓'
  }
}

// 提交提现申请
const submitWithdrawal = async () => {
  if (!isFormValid.value || !currentUser.value) return
  
  // 验证银行信息
  validateBankInfo()
  if (bankNameError.value || accountNumberError.value || accountNameError.value) {
    return
  }
  
  if (!confirm(`Confirm withdraw ${withdrawAmount.value} points to ${bankInfo.value.bankName} (${bankInfo.value.accountNumber.replace(/(\d{4})\d*(\d{4})/, '$1****$2')})? Est. arrival $${actualAmount.value.toFixed(2)}`)) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // 创建提现申请
    const withdrawRequest = await dataManager.createWithdrawRequestAsync(
      currentUser.value.id,
      withdrawAmount.value!,
      {
        bankName: bankInfo.value.bankName,
        accountNumber: bankInfo.value.accountNumber,
        accountName: bankInfo.value.accountName
      }
    )
    
    console.log('提现申请已创建:', withdrawRequest)
    
    // 显示扣减动画
    animatedPoints.value = withdrawAmount.value!
    showPointsAnimation.value = true
    
    // 更新当前用户数据
    const latestUser = await dataManager.getUserByIdAsync(currentUser.value.id)
    if (latestUser) {
      currentUser.value = latestUser
      dataManager.setCurrentUser(latestUser)
    }
    
    // 重新加载提现记录
    await loadWithdrawHistory()
    
    // 重置表单
    withdrawAmount.value = null
    bankInfo.value = {
      bankName: '',
      accountNumber: '',
      accountName: ''
    }
    
    // 显示成功提示
    setTimeout(() => {
      showPointsAnimation.value = false
      showSuccessMessage.value = true
      
      setTimeout(() => {
        showSuccessMessage.value = false
      }, 3000)
    }, 2000)
    
  } catch (error: any) {
    console.error('提现申请失败:', error)
    alert(error.message || 'Withdrawal failed, please try again later 😓')
  } finally {
    isSubmitting.value = false
  }
}

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US')
}

// 获取状态样式
const getStatusClass = (status: string) => {
  const statusClasses = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusTexts = {
    'pending': 'Pending',
    'approved': 'Approved',
    'completed': 'Completed',
    'rejected': 'Rejected'
  }
  return statusTexts[status as keyof typeof statusTexts] || status
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
}

/* 输入框和按钮悬浮效果 */
input:hover,
button:not(:disabled):hover {
  transform: translateY(-2px);
}

/* 平滑过渡 */
input,
button {
  transition: all 0.3s ease;
}

/* 禁用按钮样式 */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  input, button {
    min-height: 3rem;
    font-size: 0.875rem;
  }
}
</style>
