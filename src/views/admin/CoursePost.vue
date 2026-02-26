<template>
  <div class="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 p-6 relative overflow-hidden">
    <!-- Dynamic Background Elements -->
    <div class="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
      <div class="bubble w-24 h-24 top-[10%] right-[5%] bg-gradient-to-r from-pink-300/20 to-purple-300/20"></div>
      <div class="bubble w-16 h-16 bottom-[15%] left-[10%] bg-gradient-to-r from-blue-300/20 to-indigo-300/20 animation-delay-2000"></div>
      <div class="bubble w-20 h-20 top-[25%] left-[15%] bg-gradient-to-r from-yellow-300/20 to-orange-300/20 animation-delay-3000"></div>
    </div>

    <div class="max-w-4xl mx-auto glass-panel rounded-lg shadow-xl overflow-hidden relative z-10">
      <!-- Page Title -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-semibold text-white flex items-center">
            <i class="fas fa-magic mr-2 text-yellow-300 animate-pulse"></i>
            Admin Content Publish 📝
          </h1>
          <div class="flex gap-3">
            <button
              @click="goToContentReview"
              class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 text-sm"
            >
              <i class="fas fa-eye mr-2"></i>Content Review
            </button>
            <button
              @click="viewPublishedContent"
              class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 text-sm"
            >
              <i class="fas fa-list mr-2"></i>Published Content
            </button>
          </div>
        </div>
        <p class="text-white/80 text-sm mt-2">
          <i class="fas fa-info-circle mr-1"></i>
          Content published by admin will be live immediately without review.
        </p>
      </div>

      <!-- Content Type Selection -->
      <div class="px-6 py-4 border-b border-gray-200">
        <label class="block text-sm font-medium text-gray-900 mb-2">Content Type</label>
        <div class="flex space-x-4">
          <button
            v-for="type in contentTypes"
            :key="type.value"
            @click="currentType = type.value"
            :class="[
              'px-5 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[3rem]',
              currentType === type.value
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-900 hover:bg-indigo-100 hover:text-indigo-600'
            ]"
          >
            {{ type.label }}
          </button>
        </div>
      </div>

      <!-- Success/Error Message -->
      <div v-if="message.show" :class="[
        'mx-6 mt-4 p-4 rounded-lg border-l-4',
        message.type === 'success' ? 'bg-green-50 border-green-400 text-green-700' : 'bg-red-50 border-red-400 text-red-700'
      ]">
        <div class="flex items-center">
          <i :class="message.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" class="mr-2"></i>
          {{ message.text }}
        </div>
      </div>

      <!-- Article Form -->
      <form v-if="currentType === 'article'" @submit.prevent="handleSubmit" class="p-6 space-y-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Title -->
          <div class="md:col-span-2">
            <label for="article-title" class="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Title <span class="text-red-500">*</span></label>
            <input
              id="article-title"
              v-model.trim="articleForm.title"
              type="text"
              required
              maxlength="100"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[3rem]"
              :class="{ 'border-red-500': errors.title }"
              placeholder="Enter article title"
            >
            <p class="mt-1 text-xs text-gray-500">{{ articleForm.title.length }}/100 chars</p>
            <p v-if="errors.title" class="mt-1 text-xs text-red-600 animate-pulse">{{ errors.title }}</p>
          </div>

          <!-- Category Selection -->
          <div>
            <label for="article-category" class="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Category <span class="text-red-500">*</span></label>
            <select
              id="article-category"
              v-model="articleForm.categoryId"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[3rem]"
              :class="{ 'border-red-500': errors.categoryId }"
            >
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <p v-if="errors.categoryId" class="mt-1 text-xs text-red-600 animate-pulse">{{ errors.categoryId }}</p>
          </div>

          <!-- Access Type -->
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Access</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  v-model="articleForm.accessType"
                  type="radio"
                  value="free"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                >
                <span class="ml-2 text-gray-700">Free</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  v-model="articleForm.accessType"
                  type="radio"
                  value="paid"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                >
                <span class="ml-2 text-gray-700">Paid</span>
              </label>
            </div>
            <div v-if="articleForm.accessType === 'paid'" class="mt-3">
              <input
                v-model.number="articleForm.price"
                type="number"
                min="1"
                max="10000"
                class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Points"
              >
              <span class="ml-2 text-sm text-gray-500">Points</span>
            </div>
          </div>
        </div>

        <div>
          <label for="article-summary" class="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Summary <span class="text-red-500">*</span></label>
          <textarea
            id="article-summary"
            v-model.trim="articleForm.summary"
            required
            rows="3"
            maxlength="300"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition-all duration-300 ease-in-out transform hover:scale-105"
            :class="{ 'border-red-500': errors.summary }"
            placeholder="Enter summary (1-300 chars)"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500">Current count: {{ articleForm.summary.length }}/300 (1-300 chars required)</p>
          <p v-if="errors.summary" class="mt-1 text-xs text-red-600 animate-pulse">{{ errors.summary }}</p>
        </div>

        <div>
          <label for="article-content" class="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Content <span class="text-red-500">*</span></label>
          <TiptapEditor
            ref="articleEditor"
            :value="articleForm.content"
            @input="articleForm.content = $event"
            @upload-image="handleEditorImageUpload"
          />
          <p v-if="errors.content" class="mt-1 text-xs text-red-600 animate-pulse">{{ errors.content }}</p>
        </div>

        <!-- Cover Image -->
        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Cover Image (Optional)</label>
          <div class="flex items-center justify-center w-full">
            <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <i class="fas fa-cloud-upload-alt text-gray-400 text-3xl mb-2"></i>
                <p class="text-sm text-gray-600">Click or drag to upload</p>
                <p class="text-xs text-gray-500">JPG, PNG supported, max 5MB</p>
              </div>
              <input type="file" class="hidden" @change="handleImageUpload" accept="image/jpeg,image/png">
            </label>
          </div>
          <div v-if="articleForm.coverImage" class="mt-4">
            <div class="relative inline-block">
              <img :src="articleForm.coverImage" class="w-32 h-24 object-cover rounded-lg border border-gray-200">
              <button 
                type="button"
                @click="removeCoverImage"
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <i class="fas fa-times text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Tags (Max 5)</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="tag in articleForm.tags"
              :key="tag"
              class="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 flex items-center"
            >
              {{ tag }}
              <button @click.prevent="removeTag('article', tag)" class="ml-2 text-purple-600 hover:text-purple-800">
                <i class="fas fa-times text-xs"></i>
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newTag"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter tag, press Enter or click Add"
              @keyup.enter="addTag('article')"
              :disabled="articleForm.tags.length >= 5"
            >
            <button
              type="button"
              @click="addTag('article')"
              class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 text-sm"
              :disabled="articleForm.tags.length >= 5 || !newTag.trim()"
            >
              Add
            </button>
          </div>
          <p class="mt-1 text-xs text-gray-500">Suggested Tags: {{ suggestedTags.join(', ') }}</p>
        </div>

        <div class="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            @click="saveDraft('article')"
            class="px-6 py-3 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[3rem]"
            :disabled="isSubmitting"
          >
            <i class="fas fa-save mr-2"></i>Save Draft
          </button>
          <button
            type="submit"
            class="px-6 py-3 border border-transparent rounded-lg text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[3rem]"
            :disabled="isSubmitting"
          >
            <i class="fas fa-rocket mr-2"></i>{{ isSubmitting ? 'Publishing...' : 'Publish Now' }}
          </button>
        </div>
      </form>

      <!-- Video Form -->
      <form v-else @submit.prevent="handleSubmit" class="p-6 space-y-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Title -->
          <div class="md:col-span-2">
            <label for="video-title" class="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Video Title <span class="text-red-500">*</span></label>
            <input
              id="video-title"
              v-model.trim="videoForm.title"
              type="text"
              required
              maxlength="100"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[3rem]"
              :class="{ 'border-red-500': errors.title }"
              placeholder="Enter video title"
            >
            <p class="mt-1 text-xs text-gray-500">{{ videoForm.title.length }}/100 chars</p>
            <p v-if="errors.title" class="mt-1 text-xs text-red-600 animate-pulse">{{ errors.title }}</p>
          </div>

          <!-- Category Selection -->
          <div>
            <label for="video-category" class="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Category <span class="text-red-500">*</span></label>
            <select
              id="video-category"
              v-model="videoForm.categoryId"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[3rem]"
              :class="{ 'border-red-500': errors.categoryId }"
            >
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <p v-if="errors.categoryId" class="mt-1 text-xs text-red-600 animate-pulse">{{ errors.categoryId }}</p>
          </div>

          <!-- Access Type -->
          <div>
            <label class="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Access</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  v-model="videoForm.accessType"
                  type="radio"
                  value="free"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                >
                <span class="ml-2 text-gray-700">Free</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  v-model="videoForm.accessType"
                  type="radio"
                  value="paid"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                >
                <span class="ml-2 text-gray-700">Paid</span>
              </label>
            </div>
            <div v-if="videoForm.accessType === 'paid'" class="mt-3">
              <input
                v-model.number="videoForm.price"
                type="number"
                min="1"
                max="10000"
                class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Points"
              >
              <span class="ml-2 text-sm text-gray-500">Points</span>
            </div>
          </div>
        </div>

        <div>
          <label for="video-summary" class="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Video Description <span class="text-red-500">*</span></label>
          <textarea
            id="video-summary"
            v-model.trim="videoForm.summary"
            required
            rows="3"
            maxlength="300"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition-all duration-300 ease-in-out transform hover:scale-105"
            :class="{ 'border-red-500': errors.summary }"
            placeholder="Enter description (1-300 chars)"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500">Current count: {{ videoForm.summary.length }}/300 (1-300 chars required)</p>
          <p v-if="errors.summary" class="mt-1 text-xs text-red-600 animate-pulse">{{ errors.summary }}</p>
        </div>

        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Video File <span class="text-red-500">*</span></label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg" :class="{ 'border-red-500': errors.videoFile, 'border-gray-300': !errors.videoFile }">
            <div class="space-y-1 text-center">
              <i class="fas fa-video text-gray-400 text-4xl mb-2"></i>
              <p v-if="videoForm.videoFile" class="text-sm text-gray-900">
                <i class="fas fa-check-circle text-green-500 mr-1"></i>
                {{ videoForm.videoFile.name }} ({{ (videoForm.videoFile.size / 1024 / 1024).toFixed(2) }} MB)
              </p>
              <div class="flex text-xs sm:text-sm text-gray-600">
                <label class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                  <span>{{ videoForm.videoFile ? 'Re-upload' : 'Click to Upload' }}</span>
                  <input type="file" class="sr-only" accept="video/mp4,video/avi,video/mov" @change="handleFileUpload">
                </label>
                <p class="pl-1">or drag here</p>
              </div>
              <p class="text-xs text-gray-500">MP4, AVI, MOV supported, max 1GB</p>
            </div>
          </div>
          <p v-if="errors.videoFile" class="mt-1 text-xs text-red-600 animate-pulse">{{ errors.videoFile }}</p>
        </div>

        <!-- Video Cover -->
        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Video Cover (Optional)</label>
          <div class="flex items-center justify-center w-full">
            <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-200">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <i class="fas fa-image text-gray-400 text-3xl mb-2"></i>
                <p class="text-sm text-gray-600">Click to upload cover</p>
                <p class="text-xs text-gray-500">JPG, PNG supported, max 5MB</p>
              </div>
              <input type="file" class="hidden" @change="handleVideoImageUpload" accept="image/jpeg,image/png">
            </label>
          </div>
          <div v-if="videoForm.coverImage" class="mt-4">
            <div class="relative inline-block">
              <img :src="videoForm.coverImage" class="w-32 h-24 object-cover rounded-lg border border-gray-200">
              <button 
                type="button"
                @click="removeVideoCoverImage"
                class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <i class="fas fa-times text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs sm:text-sm font-medium text-gray-900 mb-1">Tags (Max 5)</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="tag in videoForm.tags"
              :key="tag"
              class="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 flex items-center"
            >
              {{ tag }}
              <button @click.prevent="removeTag('video', tag)" class="ml-2 text-purple-600 hover:text-purple-800">
                <i class="fas fa-times text-xs"></i>
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newTag"
              type="text"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter tag, press Enter or click Add"
              @keyup.enter="addTag('video')"
              :disabled="videoForm.tags.length >= 5"
            >
            <button
              type="button"
              @click="addTag('video')"
              class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 text-sm"
              :disabled="videoForm.tags.length >= 5 || !newTag.trim()"
            >
              Add
            </button>
          </div>
        </div>

        <div class="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            @click="saveDraft('video')"
            class="px-6 py-3 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[3rem]"
            :disabled="isSubmitting"
          >
            <i class="fas fa-save mr-2"></i>Save Draft
          </button>
          <button
            type="submit"
            class="px-6 py-3 border border-transparent rounded-lg text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105 min-h-[3rem]"
            :disabled="isSubmitting"
          >
            <i class="fas fa-rocket mr-2"></i>{{ isSubmitting ? 'Publishing...' : 'Publish Now' }}
          </button>
        </div>
      </form>

      <!-- Success Animation -->
      <transition name="fade-slide">
        <div v-if="showSuccessAnimation" class="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div class="bg-white rounded-xl p-6 shadow-2xl text-center">
            <div class="text-4xl font-bold text-green-500 animate-bounce flex items-center justify-center mb-2">
              <i class="fas fa-check-circle mr-2"></i>
              Published Successfully 🎉
            </div>
            <p class="text-gray-600">Content published to platform successfully</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { SimpleDataManager } from '@/utils/simpleDataManager'
import { firebaseRepo } from '@/services/firebaseRepo'
import TiptapEditor from '@/components/TiptapEditor.vue'

export default {
  name: 'CoursePost',
  components: {
    TiptapEditor
  },
  data() {
    return {
      contentTypes: [
        { value: 'article', label: '📝 Blog Article' },
        { value: 'video', label: '🎥 Video Tutorial' }
      ],
      currentType: 'article',
      isSubmitting: false,
      
      // Data Manager and Basic Data
      dataManager: null,
      currentUser: null,
      categories: [],
      
      // Suggested Tags
      suggestedTags: ['Technology', 'Tutorial', 'Analysis', 'Research', 'Case Study', 'Programming', 'Data Analysis'],
      
      // Form Data
      articleForm: {
        title: '',
        summary: '',
        content: '',
        categoryId: '',
        tags: [],
        coverImage: '',
        accessType: 'free',
        price: 10
      },
      videoForm: {
        title: '',
        summary: '',
        categoryId: '',
        tags: [],
        coverImage: '',
        videoFile: null,
        accessType: 'free',
        price: 20
      },
      newTag: '',
      
      // Message Notification
      message: {
        show: false,
        type: 'success', // success | error
        text: ''
      },
      
      // Validation Errors
      errors: {
        title: '',
        summary: '',
        content: '',
        categoryId: '',
        videoFile: '',
        price: ''
      },
      showSuccessAnimation: false
    }
  },
  
  async mounted() {
    await this.initializeData()
  },
  
  methods: {
    async handleEditorImageUpload(file) {
      if (!file) return
      
      if (!file.type.match('image.*')) {
        this.showMessage('Please upload a valid image file', 'error')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.showMessage('Image size cannot exceed 5MB', 'error')
        return
      }
      
      if (!this.currentUser) {
        this.showMessage('Please login before uploading images', 'error')
        return
      }
      
      try {
        const url = await firebaseRepo.uploadContentImage(this.currentUser.id, file)
        // 插入到富文本中
        if (this.$refs.articleEditor && typeof this.$refs.articleEditor.insertImage === 'function') {
          this.$refs.articleEditor.insertImage(url)
        } else {
          // 兜底：直接拼接到内容 HTML 中
          const imgHtml = `<p><img src="${url}" alt="" /></p>`
          this.articleForm.content = (this.articleForm.content || '') + imgHtml
        }
        this.showMessage('Image uploaded successfully', 'success')
      } catch (error) {
        console.error('Failed to upload editor image:', error)
        this.showMessage('Image upload failed, please try again', 'error')
      }
    },

    // Initialize Data
    async initializeData() {
      try {
        // Initialize Data Manager
        this.dataManager = SimpleDataManager.getInstance()
        
        // Get Current User
        const user = await this.dataManager.getCurrentUserAsync()
        
        // Check Admin Permissions
        if (!user || user.role !== 'admin') {
          this.$router.push('/admin/dashboard')
          return
        }

        this.currentUser = user
        
        // Load Category Data
        await this.loadCategories()
        
        console.log('CoursePost initialized, current admin:', this.currentUser)
      } catch (error) {
        console.error('Failed to initialize admin publish page:', error)
        this.showMessage('Initialization failed, please refresh the page to retry', 'error')
      }
    },
    
    // Load Category Data
    async loadCategories() {
      try {
        this.categories = await this.dataManager.getCategoriesAsync() || []
        
        // If no categories, create default categories
        if (this.categories.length === 0) {
          await this.createDefaultCategories()
        }
        
        console.log('Category data loaded:', this.categories.length, 'categories')
      } catch (error) {
        console.error('Failed to load categories:', error)
        this.showMessage('Failed to load categories', 'error')
      }
    },
    
    // Create Default Categories
    async createDefaultCategories() {
      const defaultCategories = [
        { name: 'Tech Tutorials', description: 'Programming technology and tutorial sharing', icon: 'fas fa-code', color: '#3B82F6' },
        { name: 'Academic Research', description: 'Academic papers and research results', icon: 'fas fa-graduation-cap', color: '#8B5CF6' },
        { name: 'Data Analysis', description: 'Data analysis methods and tools', icon: 'fas fa-chart-bar', color: '#10B981' },
        { name: 'Econometrics', description: 'Econometrics related content', icon: 'fas fa-chart-line', color: '#F59E0B' },
        { name: 'Video Tutorials', description: 'Video teaching content', icon: 'fas fa-video', color: '#EF4444' }
      ]
      
      for (const categoryData of defaultCategories) {
        try {
          const category = await this.dataManager.createCategoryAsync(categoryData)
          this.categories.push(category)
        } catch (error) {
          console.error('Failed to create default categories:', categoryData, error)
        }
      }
    },
    
    // Form Validation
    validateForm() {
      this.errors = {
        title: '',
        summary: '',
        content: '',
        categoryId: '',
        videoFile: '',
        price: ''
      }
      
      const form = this.currentType === 'article' ? this.articleForm : this.videoForm
      let isValid = true
      
      // Title validation
      if (!form.title.trim()) {
        this.errors.title = 'Please enter a title'
        isValid = false
      } else if (form.title.length > 100) {
        this.errors.title = 'Title cannot exceed 100 characters'
        isValid = false
      }
      
      if (!form.summary.trim()) {
        this.errors.summary = 'Please enter a summary'
        isValid = false
      } else if (form.summary.length < 1 || form.summary.length > 300) {
        this.errors.summary = 'Summary must be between 1 and 300 characters'
        isValid = false
      }
      
      // Category validation
      if (!form.categoryId) {
        this.errors.categoryId = 'Please select a category'
        isValid = false
      }
      
      if (this.currentType === 'article') {
        if (!form.content.trim()) {
          this.errors.content = 'Please enter content'
          isValid = false
        } else if (form.content.length < 1) {
          this.errors.content = 'Content must be at least 1 character'
          isValid = false
        }
      }
      
      // Video file validation (Video only)
      if (this.currentType === 'video' && !form.videoFile) {
        this.errors.videoFile = 'Please upload a video file'
        isValid = false
      }
      
      // Price validation
      if (form.accessType === 'paid') {
        if (!form.price || form.price < 1 || form.price > 10000) {
          this.errors.price = 'Price must be between 1 and 10000 points'
          isValid = false
        }
      }
      
      return isValid
    },
    
    // Blog Cover Image Upload Handler
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      
      if (!file.type.match('image.*')) {
        this.showMessage('Please upload a valid image file', 'error')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.showMessage('Image size cannot exceed 5MB', 'error')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        this.articleForm.coverImage = e.target.result
        this.showMessage('Cover image uploaded successfully', 'success')
      }
      reader.readAsDataURL(file)
    },
    
    // Video Cover Image Upload Handler
    handleVideoImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      
      if (!file.type.match('image.*')) {
        this.showMessage('Please upload a valid image file', 'error')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.showMessage('Image size cannot exceed 5MB', 'error')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        this.videoForm.coverImage = e.target.result
        this.showMessage('Video cover uploaded successfully', 'success')
      }
      reader.readAsDataURL(file)
    },
    
    // Video File Upload Handler
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      
      const validTypes = ['video/mp4', 'video/avi', 'video/mov']
      const maxSize = 1 * 1024 * 1024 * 1024 // 1GB
      
      if (!validTypes.includes(file.type)) {
        this.errors.videoFile = 'Only MP4, AVI, MOV formats are supported'
        this.showMessage('Only MP4, AVI, MOV formats are supported', 'error')
        this.videoForm.videoFile = null
        event.target.value = '' // Clear file input
      } else if (file.size > maxSize) {
        this.errors.videoFile = 'File size cannot exceed 1GB'
        this.showMessage('File size cannot exceed 1GB', 'error')
        this.videoForm.videoFile = null
        event.target.value = '' // Clear file input
      } else {
        this.errors.videoFile = ''
        this.videoForm.videoFile = file
        this.showMessage(`Video file selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`, 'success')
        console.log('Video file selected:', file.name, (file.size / 1024 / 1024).toFixed(2) + 'MB')
      }
    },
    
    // Tag Management
    addTag(type) {
      if (!this.newTag.trim()) return
      
      const form = type === 'article' ? this.articleForm : this.videoForm
      
      if (form.tags.length >= 5) {
        this.showMessage('You can add up to 5 tags only', 'error')
        return
      }
      
      if (form.tags.includes(this.newTag.trim())) {
        this.showMessage('Tag already exists', 'error')
        return
      }
      
      form.tags.push(this.newTag.trim())
      this.newTag = ''
      this.showMessage('Tag added successfully', 'success')
    },
    
    removeTag(type, tag) {
      const form = type === 'article' ? this.articleForm : this.videoForm
      form.tags = form.tags.filter(t => t !== tag)
    },
    
    // Remove Image
    removeCoverImage() {
      this.articleForm.coverImage = ''
      this.showMessage('Cover image removed', 'success')
    },
    
    removeVideoCoverImage() {
      this.videoForm.coverImage = ''
      this.showMessage('Video cover removed', 'success')
    },
    
    // Save Draft
    async saveDraft(type) {
      const form = type === 'article' ? this.articleForm : this.videoForm
      
      if (!form.title.trim()) {
        this.showMessage('Please enter a title to save draft', 'error')
        return
      }
      
      try {
        // Get selected category info
        const selectedCategory = this.categories.find(c => c.id === form.categoryId)
        
        if (type === 'article') {
          // Create draft article
          const articleData = {
            title: form.title || 'Untitled Draft',
            content: form.content,
            excerpt: form.summary || form.content.substring(0, 100) + '...',
            authorId: this.currentUser.id,
            authorName: this.currentUser.nickname || this.currentUser.username,
            categoryId: form.categoryId || this.categories[0]?.id,
            categoryName: selectedCategory ? selectedCategory.name : (this.categories[0]?.name || 'Uncategorized'),
            tags: form.tags,
            coverImage: form.coverImage,
            images: [],
            accessType: form.accessType,
            price: form.accessType === 'paid' ? form.price : 0,
            status: 'draft' // Draft status
          }
          // Remove undefined fields to avoid Firestore errors
          const cleanArticleData = Object.fromEntries(
            Object.entries(articleData).filter(([_, v]) => v !== undefined)
          )
          
          const article = await this.dataManager.createArticleAsync(cleanArticleData)
          console.log('Blog draft saved:', article)
        } else {
          // Save video draft to pending content
          const pendingContent = {
            id: 'draft_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            type: 'video',
            title: form.title,
            preview: form.summary,
            content: `Video File: ${form.videoFile ? form.videoFile.name : 'Not uploaded'}`,
            categoryId: form.categoryId,
            categoryName: selectedCategory ? selectedCategory.name : 'Uncategorized',
            tags: form.tags,
            images: form.coverImage ? [form.coverImage] : [],
            accessType: form.accessType,
            price: form.accessType === 'paid' ? form.price : 0,
            author: this.currentUser.nickname || this.currentUser.username,
            authorId: this.currentUser.id,
            submitTime: new Date(),
            status: 'draft',
            videoFile: form.videoFile
          }
          
          await this.dataManager.addPendingContentAsync(pendingContent)
          console.log('Video draft saved:', pendingContent)
        }
        
        this.showMessage('Draft saved successfully!', 'success')
        
      } catch (error) {
        console.error('Failed to save draft:', error)
        this.showMessage('Failed to save draft: ' + error.message, 'error')
      }
    },
    
    // Submit Publish
    async handleSubmit() {
      if (!this.validateForm() || !this.currentUser) return
      
      const typeName = this.currentType === 'article' ? 'Blog Article' : 'Video Content'
      if (!confirm(`Confirm publish ${typeName}: ${(this.currentType === 'article' ? this.articleForm : this.videoForm).title}?`)) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        const form = this.currentType === 'article' ? this.articleForm : this.videoForm
        
        // Get selected category info
        const selectedCategory = this.categories.find(c => c.id === form.categoryId)
        
        if (!selectedCategory) {
          throw new Error('Please select a category')
        }
        
        if (this.currentType === 'article') {
          // Publish blog article directly
          const articleData = {
            title: form.title,
            content: form.content,
            excerpt: form.summary,
            authorId: this.currentUser.id,
            authorName: this.currentUser.nickname || this.currentUser.username,
            categoryId: form.categoryId,
            categoryName: selectedCategory.name,
            tags: form.tags || [],
            coverImage: form.coverImage,
            images: form.coverImage ? [form.coverImage] : [],
            accessType: form.accessType,
            price: form.accessType === 'paid' ? form.price : 0,
            status: 'published',
            publishedAt: new Date().toISOString(),
            isVideo: false
          }
          // Remove undefined fields to avoid Firestore errors
          const cleanArticleData = Object.fromEntries(
            Object.entries(articleData).filter(([_, v]) => v !== undefined)
          )
          
          const article = await this.dataManager.createArticleAsync(cleanArticleData)
          console.log('Blog article published:', article)
          
          this.showMessage('Blog article published successfully! Content is now live', 'success')
          
        } else {
          // Publish video content
          const videoContent = {
            id: 'video_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            type: 'video',
            title: form.title,
            preview: form.summary,
            content: `Video Tutorial: ${form.title}`,
            categoryId: form.categoryId,
            categoryName: selectedCategory.name,
            tags: form.tags,
            images: form.coverImage ? [form.coverImage] : [],
            accessType: form.accessType,
            price: form.accessType === 'paid' ? form.price : 0,
            author: this.currentUser.nickname || this.currentUser.username,
            authorId: this.currentUser.id,
            submitTime: new Date(),
            status: 'approved', // Admin publish auto-approved
            videoFile: form.videoFile,
            duration: 'Pending',
            publishedAt: new Date().toISOString()
          }
          
          // Add and approve directly
          const docId = await this.dataManager.addPendingContentAsync(videoContent)
          await this.dataManager.approvePendingContentAsync(docId)
          
          console.log('Video content published:', videoContent)
          this.showMessage('Video content published successfully! Content is now live', 'success')
        }
        
        // Show success animation
        this.showSuccessAnimation = true
        setTimeout(() => {
          this.showSuccessAnimation = false
        }, 3000)
        
        // Reset Form
        setTimeout(() => {
          this.resetForm()
        }, 1000)
        
      } catch (error) {
        console.error('Publish failed:', error)
        this.showMessage('Publish failed: ' + error.message, 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    // Reset Form
    resetForm() {
      if (this.currentType === 'article') {
        this.articleForm = {
          title: '',
          summary: '',
          content: '',
          categoryId: '',
          tags: [],
          coverImage: '',
          accessType: 'free',
          price: 10
        }
      } else {
        this.videoForm = {
          title: '',
          summary: '',
          categoryId: '',
          tags: [],
          coverImage: '',
          videoFile: null,
          accessType: 'free',
          price: 20
        }
      }
      this.newTag = ''
      this.errors = {
        title: '',
        summary: '',
        content: '',
        categoryId: '',
        videoFile: '',
        price: ''
      }
    },
    
    // Show message
    showMessage(text, type = 'success') {
      this.message = {
        show: true,
        type,
        text
      }
      
      // Auto hide after 3 seconds
      setTimeout(() => {
        this.message.show = false
      }, 3000)
    },
    
    // Navigation methods
    goToContentReview() {
      this.$router.push('/admin/content')
    },
    
    viewPublishedContent() {
      this.$router.push('/')
    },
    
    async loadDrafts() {
      // View draft articles
      try {
        const articles = await this.dataManager.getArticlesAsync()
        const draftArticles = articles.filter(article => 
          article.status === 'draft' && article.authorId === this.currentUser.id
        )
        
        const pendingContents = await this.dataManager.getPendingContentsAsync()
        const draftVideos = pendingContents.filter(content => 
          content.status === 'draft' && content.authorId === this.currentUser.id
        )
        
        const totalDrafts = draftArticles.length + draftVideos.length
        
        if (totalDrafts === 0) {
          this.showMessage('No draft content', 'error')
        } else {
          this.showMessage(`Found ${totalDrafts} drafts: ${draftArticles.length} articles, ${draftVideos.length} videos`, 'success')
          console.log('Draft articles:', draftArticles)
          console.log('Draft videos:', draftVideos)
        }
      } catch (error) {
        console.error('Failed to load drafts:', error)
        this.showMessage('Failed to load drafts', 'error')
      }
    }
  }
}
</script>

<style scoped>
/* Glass panel effect */
.glass-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.bubble {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  z-index: 0;
  animation: float 15s infinite ease-in-out;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-3000 { animation-delay: 3s; }

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -40%);
}
</style>
