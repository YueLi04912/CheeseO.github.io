<!-- 青春渐变背景 + 装饰性动画 -->
<template>
  <div class="min-h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 pt-14 sm:pt-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
    <!-- 装饰性背景动画 -->
    <div class="fixed inset-0 pointer-events-none z-0">
      <div class="absolute -top-20 -left-10 w-40 h-40 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-lg opacity-60 animate-blob"></div>
      <div class="absolute top-40 right-0 w-40 h-40 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-lg opacity-60 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-0 left-1/3 w-40 h-40 bg-gradient-to-br from-yellow-200 to-pink-200 rounded-full mix-blend-multiply filter blur-lg opacity-60 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative z-10 max-w-4xl mx-auto">
      <!-- 页面标题 -->
      <div class="flex items-center mb-6 animate-fade-in-up">
        <button 
          @click="goBack" 
          class="mr-3 text-purple-500 hover:text-purple-600 text-lg p-2 transition-all duration-200 transform hover:scale-110 hover:shadow-md"
        >
          <i class="fas fa-arrow-left"></i>
        </button>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 font-poppins">
          Edit Profile ✨
        </h1>
      </div>

      <!-- 错误和成功提示 -->
      <div v-if="globalError" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded animate-fade-in-up">
        {{ globalError }}
      </div>
      <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded animate-fade-in-up">
        {{ successMessage }}
      </div>
      
      <!-- 表单区域 -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-md mb-6 transform transition-all duration-300 hover:scale-[1.01] animate-fade-in-up animation-delay-100">
        <div class="p-4 sm:p-6 lg:p-8">
          <form @submit.prevent="saveProfile">
            <!-- 头像编辑 -->
            <div class="mb-6 flex flex-col items-center animate-bounce-slow">
              <div class="relative mb-3 group cursor-pointer">
                <div class="w-24 sm:w-32 h-24 sm:h-32 rounded-full overflow-hidden border-4 border-pink-200">
                  <img 
                    :src="form.avatar || defaultAvatar" 
                    class="w-full h-full object-cover group-hover:opacity-70 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3"
                    alt="Click to change avatar"
                    @click="triggerFileInput"
                  />
                  <div class="absolute inset-0 flex items-center justify-center bg-purple-500/50 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <i class="fas fa-camera text-white text-xl sm:text-2xl"></i>
                  </div>
                </div>
                <input 
                  ref="fileInput"
                  type="file" 
                  accept="image/jpeg,image/png"
                  class="hidden"
                  @change="handleAvatarChange" 
                />
              </div>
              <p class="text-xs sm:text-sm text-gray-600 font-poppins">Click avatar to change 🖼️</p>
            </div>

            <div class="space-y-6">
              <!-- Basic Info -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <!-- Username -->
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-poppins">
                    Username
                  </label>
                  <input 
                    v-model="form.username"
                    type="text"
                    class="w-full px-3 sm:px-4 py-2 border border-purple-200 rounded-lg focus:ring-purple-400 focus:border-purple-400 focus:ring-2 transition-all duration-300 font-poppins bg-white/90"
                    placeholder="Enter username"
                  />
                </div>
                
                <!-- Nickname -->
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-poppins">
                    Nickname
                  </label>
                  <input 
                    v-model="form.nickname"
                    type="text"
                    class="w-full px-3 sm:px-4 py-2 border border-purple-200 rounded-lg focus:ring-purple-400 focus:border-purple-400 focus:ring-2 transition-all duration-300 font-poppins bg-white/90"
                    placeholder="Display nickname (optional)"
                  />
                </div>
                
                <!-- Real Name -->
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-poppins">
                    Real Name
                  </label>
                  <input 
                    v-model="form.realName"
                    type="text"
                    class="w-full px-3 sm:px-4 py-2 border border-purple-200 rounded-lg focus:ring-purple-400 focus:border-purple-400 focus:ring-2 transition-all duration-300 font-poppins bg-white/90"
                    placeholder="Real name (optional)"
                  />
                </div>
                
                <!-- Phone -->
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-poppins">
                    Phone
                  </label>
                  <input 
                    v-model="form.phone"
                    type="text"
                    :disabled="!!form.phone"
                    class="w-full px-3 sm:px-4 py-2 border border-purple-200 rounded-lg focus:ring-purple-400 focus:border-purple-400 focus:ring-2 transition-all duration-300 font-poppins bg-white/90 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Enter phone number"
                  />
                  <p v-if="form.phone" class="text-xs text-gray-500 mt-1 font-poppins">Phone number linked, cannot be changed</p>
                </div>
              </div>
              
              <!-- Contact Info -->
              <div class="grid grid-cols-1 sm:grid-cols-1 gap-3 sm:gap-4">
                <!-- Email -->
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-poppins">
                    Email
                  </label>
                  <input 
                    v-model="form.email"
                    type="email"
                    class="w-full px-3 sm:px-4 py-2 border border-purple-200 rounded-lg focus:ring-purple-400 focus:border-purple-400 focus:ring-2 transition-all duration-300 font-poppins bg-white/90"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              
              <!-- 个人简介 -->
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-poppins">
                  Bio
                </label>
                <textarea 
                  v-model="form.bio"
                  rows="4"
                  class="w-full px-3 sm:px-4 py-2 border border-purple-200 rounded-lg focus:ring-purple-400 focus:border-purple-400 focus:ring-2 transition-all duration-300 font-poppins bg-white/90"
                  placeholder="Briefly introduce yourself..."
                ></textarea>
              </div>
              
              <!-- 专业方向 -->
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-poppins">
                  Specialties
                </label>
                <div class="flex flex-wrap gap-2">
                  <div 
                    v-for="(tag, index) in form.specialties" 
                    :key="index"
                    class="flex items-center bg-purple-50 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-poppins transition-all duration-200 hover:scale-105 hover:bg-purple-100"
                  >
                    <span>{{ tag }}</span>
                    <button 
                      type="button"
                      @click="removeSpecialty(index)" 
                      class="ml-1 text-purple-500 hover:text-purple-700"
                    >
                      <i class="fas fa-times text-xs"></i>
                    </button>
                  </div>
                  <div class="flex w-full sm:w-auto">
                    <input 
                      v-model="newSpecialty"
                      type="text"
                      class="px-3 py-1.5 border border-purple-200 rounded-l-lg focus:ring-purple-400 focus:border-purple-400 focus:ring-2 text-xs sm:text-sm font-poppins bg-white/90"
                      placeholder="Add specialty"
                      @keyup.enter="addSpecialty"
                    />
                    <button 
                      type="button"
                      @click="addSpecialty"
                      class="px-3 py-1.5 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-r-lg hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-400/30 transition-all duration-200 text-xs sm:text-sm font-poppins animate-bounce-click"
                    >
                      Add 🎉
                    </button>
                  </div>
                </div>
              </div>

              <!-- 社交媒体链接 -->
              <div>
                <h3 class="text-base sm:text-lg font-medium text-gray-800 mb-3 font-poppins">Social Media 🌐</h3>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <span class="w-8 text-purple-500 mr-2 text-lg">
                      <i class="fab fa-weixin"></i>
                    </span>
                    <input 
                      v-model="form.socialLinks.wechat"
                      type="text"
                      class="flex-1 px-3 sm:px-4 py-2 border border-purple-200 rounded-lg focus:ring-purple-400 focus:border-purple-400 focus:ring-2 transition-all duration-200 text-xs sm:text-sm font-poppins bg-white/90"
                      placeholder="Enter WeChat ID"
                    />
                  </div>
                  <div class="flex items-center">
                    <span class="w-8 text-purple-500 mr-2 text-lg">
                      <i class="fab fa-weibo"></i>
                    </span>
                    <input 
                      v-model="form.socialLinks.weibo"
                      type="text"
                      class="flex-1 px-3 sm:px-4 py-2 border border-purple-200 rounded-lg focus:ring-purple-400 focus:border-purple-400 focus:ring-2 transition-all duration-200 text-xs sm:text-sm font-poppins bg-white/90"
                      placeholder="Enter Weibo account"
                    />
                  </div>
                  <div class="flex items-center">
                    <span class="w-8 text-purple-500 mr-2 text-lg">
                      <i class="fab fa-github"></i>
                    </span>
                    <input 
                      v-model="form.socialLinks.github"
                      type="text"
                      class="flex-1 px-3 sm:px-4 py-2 border border-purple-200 rounded-lg focus:ring-purple-400 focus:border-purple-400 focus:ring-2 transition-all duration-200 text-xs sm:text-sm font-poppins bg-white/90"
                      placeholder="Enter GitHub username"
                    />
                  </div>
                </div>
              </div>

              <!-- 提交按钮 -->
              <div class="flex justify-end space-x-3 sm:space-x-4 pt-4">
                <button 
                  type="button"
                  @click="goBack"
                  class="px-4 sm:px-6 py-2 border border-purple-200 text-gray-700 rounded-lg hover:bg-purple-50 hover:shadow-md hover:from-purple-100 hover:to-pink-100 transition-all duration-200 text-xs sm:text-sm font-poppins animate-bounce-click"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  :disabled="isSaving"
                  class="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:shadow-purple-400/30 transition-all duration-200 text-xs sm:text-sm font-poppins animate-bounce-click disabled:opacity-50"
                >
                  {{ isSaving ? 'Saving...' : 'Save Changes 🎉' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <!-- 修改密码区域 -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-md transform transition-all duration-300 hover:scale-[1.01] animate-fade-in-up animation-delay-200">
        <div class="p-4 sm:p-6 lg:p-8">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2 font-poppins">
            Change Password 🔒
          </h2>
          <p v-if="passwordSuccess" class="mb-4 text-xs sm:text-sm text-green-600 font-poppins animate-pulse">
            {{ passwordSuccess }}
          </p>
          <form @submit.prevent="changePassword">
            <div class="space-y-4">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-poppins">
                  Current Password
                </label>
                <input 
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="w-full px-3 sm:px-4 py-2 border border-purple-200 rounded-lg focus:ring-purple-400 focus:border-purple-400 focus:ring-2 transition-all duration-200 text-xs sm:text-sm font-poppins bg-white/90"
                  placeholder="Enter current password"
                />
                <p v-if="passwordErrors.currentPassword" class="mt-1 text-xs sm:text-sm text-red-500 font-poppins animate-pulse">
                  {{ passwordErrors.currentPassword }}
                </p>
              </div>
              
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-poppins">
                  New Password
                </label>
                <input 
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="w-full px-3 sm:px-4 py-2 border border-purple-200 rounded-lg focus:ring-purple-400 focus:border-purple-400 focus:ring-2 transition-all duration-200 text-xs sm:text-sm font-poppins bg-white/90"
                  placeholder="Enter new password (min 6 chars, letters & numbers)"
                />
                <p v-if="passwordErrors.newPassword" class="mt-1 text-xs sm:text-sm text-red-500 font-poppins animate-pulse">
                  {{ passwordErrors.newPassword }}
                </p>
              </div>
              
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-poppins">
                  Confirm New Password
                </label>
                <input 
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="w-full px-3 sm:px-4 py-2 border border-purple-200 rounded-lg focus:ring-purple-400 focus:border-purple-400 focus:ring-2 transition-all duration-200 text-xs sm:text-sm font-poppins bg-white/90"
                  placeholder="Enter new password again"
                />
                <p v-if="passwordErrors.confirmPassword" class="mt-1 text-xs sm:text-sm text-red-500 font-poppins animate-pulse">
                  {{ passwordErrors.confirmPassword }}
                </p>
              </div>
              
              <div class="flex justify-end pt-3">
                <button 
                  type="submit"
                  :disabled="isPasswordFormInvalid || isChangingPassword"
                  class="px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:shadow-purple-400/30 transition-all duration-200 text-xs sm:text-sm font-poppins animate-bounce-click disabled:opacity-50"
                >
                  {{ isChangingPassword ? 'Changing...' : 'Change Password 🔑' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SimpleDataManager, type User } from '@/utils/simpleDataManager'

const router = useRouter()
const dataManager = SimpleDataManager.getInstance()
const fileInput = ref<HTMLInputElement | null>(null)
const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=8B5CF6&color=fff&size=150'
const newSpecialty = ref('')

// 状态管理
const isSaving = ref(false)
const isChangingPassword = ref(false)
const globalError = ref('')
const successMessage = ref('')
const passwordSuccess = ref('')

// 获取当前用户
const currentUser = ref<User | null>(dataManager.getCurrentUser())

// 表单数据
const form = reactive({
  username: '',
  nickname: '',
  realName: '',
  email: '',
  phone: '',
  bio: '',
  avatar: '',
  specialties: [] as string[],
  socialLinks: {
    wechat: '',
    weibo: '',
    github: ''
  }
})

// 密码修改表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码错误信息
const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码格式正则（至少6位，包含字母和数字）
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/

// 判断密码表单是否有效
const isPasswordFormInvalid = computed(() => {
  return !passwordForm.currentPassword || 
         !passwordForm.newPassword || 
         !passwordForm.confirmPassword || 
         passwordForm.newPassword !== passwordForm.confirmPassword ||
         !passwordRegex.test(passwordForm.newPassword) ||
         passwordForm.newPassword === passwordForm.currentPassword
})

// 初始化用户数据
const initializeUserData = async () => {
  const user = await dataManager.getCurrentUserAsync()
  
  if (!user) {
    router.push('/Login')
    return
  }
  
  currentUser.value = user

  // 将用户数据填充到表单
  form.username = user.username || ''
  form.nickname = user.nickname || ''
  form.realName = user.realName || ''
  form.email = user.email || ''
  form.phone = user.phone || ''
  form.bio = user.bio || ''
  form.avatar = user.avatar || ''
  form.specialties = Array.isArray(user.specialties) ? [...user.specialties] : []
  form.socialLinks = {
    wechat: user.socialLinks?.wechat || '',
    weibo: user.socialLinks?.weibo || '',
    github: user.socialLinks?.github || ''
  }
}

// 组件挂载时初始化
onMounted(async () => {
  await initializeUserData()
})

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理头像更改
const handleAvatarChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  
  const file = target.files[0]
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    globalError.value = 'Only JPG or PNG format supported! 😓'
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    globalError.value = 'Image size cannot exceed 2MB! 😓'
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target && e.target.result) {
      form.avatar = e.target.result as string
    }
  }
  reader.readAsDataURL(file)
}

// 添加专业方向
const addSpecialty = () => {
  if (newSpecialty.value.trim() && !form.specialties.includes(newSpecialty.value.trim())) {
    form.specialties.push(newSpecialty.value.trim())
    newSpecialty.value = ''
  }
}

// 移除专业方向
const removeSpecialty = (index: number) => {
  form.specialties.splice(index, 1)
}

// 保存个人资料
const saveProfile = async () => {
  if (!currentUser.value) return
  
  isSaving.value = true
  globalError.value = ''
  successMessage.value = ''
  
  try {
    const updates = {
      username: form.username,
      nickname: form.nickname,
      realName: form.realName,
      email: form.email,
      bio: form.bio,
      avatar: form.avatar,
      specialties: form.specialties,
      socialLinks: form.socialLinks
    }
    
    // 使用 SimpleDataManager 异步更新用户信息
    const success = await dataManager.updateUserAsync(currentUser.value.id, updates)
    
    if (success) {
      // 获取更新后的用户数据
      const updatedUser = await dataManager.getUserByIdAsync(currentUser.value.id)
      if (updatedUser) {
        currentUser.value = updatedUser
        dataManager.setCurrentUser(updatedUser)
      }
      
      successMessage.value = 'Profile updated successfully! 🎉'
      
      setTimeout(() => {
        successMessage.value = ''
      }, 3000)
      
      console.log('User profile updated')
    } else {
      globalError.value = 'Save failed, please try again later 😓'
    }
  } catch (error) {
    console.error('Failed to save profile:', error)
    globalError.value = 'Save failed, please try again later 😓'
  } finally {
    isSaving.value = false
  }
}

// 修改密码
const changePassword = async () => {
  if (!currentUser.value) return
  
  // 清空错误信息
  passwordErrors.currentPassword = ''
  passwordErrors.newPassword = ''
  passwordErrors.confirmPassword = ''
  passwordSuccess.value = ''
  globalError.value = ''

  // 前端验证
  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = 'Enter current password! 😓'
    return
  }
  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = 'Enter new password! 😓'
    return
  }
  if (!passwordRegex.test(passwordForm.newPassword)) {
    passwordErrors.newPassword = 'Password must be 6+ chars with letters & numbers! 😓'
    return
  }
  if (passwordForm.newPassword === passwordForm.currentPassword) {
    passwordErrors.newPassword = 'New password cannot be same as current! 😓'
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Passwords do not match! 😓'
    return
  }

  isChangingPassword.value = true

  try {
    // 验证当前密码
    const loginResult = await dataManager.validateLoginAsync(
      currentUser.value.username, 
      passwordForm.currentPassword
    )
    
    if (!loginResult) {
      passwordErrors.currentPassword = 'Incorrect current password! 😓'
      return
    }

    // 更新密码
    const success = await dataManager.updateUserAsync(currentUser.value.id, {
      password: passwordForm.newPassword
    })

    if (success) {
      // 获取更新后的用户数据
      const updatedUser = await dataManager.getUserByIdAsync(currentUser.value.id)
      if (updatedUser) {
        currentUser.value = updatedUser
        dataManager.setCurrentUser(updatedUser)
      }
      
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
      passwordSuccess.value = 'Password changed successfully! 🎉'
      
      setTimeout(() => {
        passwordSuccess.value = ''
      }, 3000)
      
      console.log('Password changed successfully')
    } else {
      passwordErrors.newPassword = 'Password change failed, try again later 😓'
    }
  } catch (error: any) {
    console.error('Password change failed:', error)
    passwordErrors.newPassword = 'Password change failed, try again later 😓'
  } finally {
    isChangingPassword.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.push('/about')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.font-poppins {
  font-family: 'Poppins', sans-serif;
}

/* 动画定义 */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(10px, -15px) scale(1.05);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

@keyframes bounce-click {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
  }
}

.animate-blob {
  animation: blob 6s infinite;
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
}

.animate-bounce-slow {
  animation: bounce-slow 3s infinite;
}

.animate-pulse {
  animation: pulse 1s infinite;
}

.animate-bounce-click:active {
  animation: bounce-click 0.2s ease-out;
}

input, textarea {
  background-color: transparent;
  color: #333;
}

input:focus, textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 移动端优化 */
@media (max-width: 640px) {
  input, textarea, button {
    min-height: 3rem;
  }
}
</style>