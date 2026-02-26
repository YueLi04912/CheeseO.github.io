<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 text-gray-800 pt-10">
    <div class="container mx-auto px-6 py-12">
      <!-- Post Type Selection -->
      <div class="flex justify-center mb-8 px-2">
        <div class="inline-flex bg-white rounded-xl shadow-lg p-1 flex-wrap sm:flex-nowrap w-full sm:w-auto transform transition-all hover:scale-[1.01]">
          <button
            @click="activeTab = 'blog'"
            :class="{'bg-gradient-to-r from-blue-400 to-purple-400 text-white': activeTab === 'blog', 'text-gray-600 hover:bg-purple-50': activeTab !== 'blog'}"
            class="flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base font-poppins"
          >
            <i class="fas fa-edit mr-1 sm:mr-2 text-lg"></i><span>Post Blog</span>
          </button>
          <button
            @click="activeTab = 'video'"
            :class="{'bg-gradient-to-r from-blue-400 to-purple-400 text-white': activeTab === 'video', 'text-gray-600 hover:bg-purple-50': activeTab !== 'video'}"
            class="flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base font-poppins"
          >
            <i class="fas fa-video mr-1 sm:mr-2 text-lg"></i><span>Post Video</span>
          </button>
        </div>
      </div>

      <!-- Blog Post Form -->
      <div v-if="activeTab === 'blog'" class="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-[1.01] duration-300">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 font-poppins">New Blog Post</h2>
        
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ errorMessage }}
        </div>
        
        <!-- Success Alert -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ successMessage }}
        </div>
        
        <!-- Title -->
        <div class="mb-6">
          <label for="blog-title" class="block text-sm font-medium text-gray-700 mb-2 font-poppins">Title*</label>
          <input
            v-model="blogForm.title"
            type="text"
            id="blog-title"
            class="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 focus:ring-2 transition-all duration-200 font-poppins"
            placeholder="Enter blog title"
            required
          >
          <p v-if="blogForm.title.length > 0" class="mt-1 text-xs text-gray-500">{{ blogForm.title.length }}/100 chars</p>
        </div>

        <!-- Category Selection -->
        <div class="mb-6">
          <label for="blog-category" class="block text-sm font-medium text-gray-700 mb-2 font-poppins">Category*</label>
          <div class="relative">
            <select
              v-model="blogForm.categoryId"
              id="blog-category"
              class="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 focus:ring-2 appearance-none font-poppins transition-all duration-200"
              required
            >
              <option value="" disabled selected>Select Category</option>
              <option 
                v-for="category in categories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-500">
              <i class="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>

        <!-- Excerpt -->
        <div class="mb-6">
          <label for="blog-excerpt" class="block text-sm font-medium text-gray-700 mb-2 font-poppins">Excerpt*</label>
          <textarea
            v-model="blogForm.excerpt"
            id="blog-excerpt"
            rows="3"
            class="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 focus:ring-2 transition-all duration-200 font-poppins"
            placeholder="Enter excerpt (1-300 chars)"
            required
          ></textarea>
          <p class="mt-1 text-xs text-gray-500">{{ blogForm.excerpt.length }}/300 chars</p>
        </div>

        <!-- Rich Text Editor -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2 font-poppins">Content*</label>
          <TiptapEditor
            ref="blogEditor"
            :value="blogForm.content"
            @input="blogForm.content = $event"
            @upload-image="handleEditorImageUpload"
          />
          <p class="mt-1 text-xs text-gray-500">Current chars: {{ blogForm.content.length }} (Recommended 500+)</p>
        </div>

        <!-- Tags -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2 font-poppins">Tags (Max 5)</label>
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="(tag, index) in blogForm.tags"
              :key="index"
              class="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 flex items-center"
            >
              {{ tag }}
              <button 
                type="button"
                @click="removeTag(index)" 
                class="ml-2 text-purple-600 hover:text-purple-800"
              >
                <i class="fas fa-times text-xs"></i>
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newTag"
              type="text"
              class="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 focus:ring-2 text-sm font-poppins"
              placeholder="Enter tag, press Enter or click Add"
              @keyup.enter="addTag"
              :disabled="blogForm.tags.length >= 5"
            >
            <button
              type="button"
              @click="addTag"
              class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 text-sm font-poppins"
              :disabled="blogForm.tags.length >= 5 || !newTag.trim()"
            >
              Add
            </button>
          </div>
          <p class="mt-1 text-xs text-gray-500">Suggested tags: {{ suggestedTags.join('、') }}</p>
        </div>

        <!-- Access -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2 font-poppins">Access</label>
          <div class="flex items-center space-x-4">
            <label class="inline-flex items-center">
              <input
                v-model="blogForm.accessType"
                type="radio"
                name="blog-access"
                value="free"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500"
              >
              <span class="ml-2 text-gray-700 font-poppins">Free</span>
            </label>
            <label class="inline-flex items-center">
              <input
                v-model="blogForm.accessType"
                type="radio"
                name="blog-access"
                value="paid"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500"
              >
              <span class="ml-2 text-gray-700 font-poppins">Paid</span>
            </label>
          </div>
          <div v-if="blogForm.accessType === 'paid'" class="mt-4">
            <label for="blog-price" class="block text-sm font-medium text-gray-700 mb-2 font-poppins">Price (Points)</label>
            <input
              v-model.number="blogForm.price"
              type="number"
              id="blog-price"
              min="1"
              max="10000"
              class="w-full sm:w-32 px-4 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 focus:ring-2 font-poppins transition-all duration-200"
              placeholder="10"
            >
            <p class="mt-1 text-xs text-gray-500">Suggested: 10-100 points</p>
          </div>
        </div>

        <!-- Preview -->
        <div v-if="isBlogFormValid" class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Preview</h3>
          <div class="text-sm text-gray-600 space-y-1">
            <p><strong>Title: </strong>{{ blogForm.title }}</p>
            <p><strong>Category: </strong>{{ getSelectedCategoryName() }}</p>
            <p><strong>Tags: </strong>{{ blogForm.tags.join('、') || 'None' }}</p>
            <p><strong>Access: </strong>{{ blogForm.accessType === 'free' ? 'Free' : `Paid ${blogForm.price} points` }}</p>
            <p><strong>Chars: </strong>Approx {{ blogForm.content.length }} chars</p>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="saveDraft('blog')"
            class="px-6 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-all duration-200 font-poppins"
            :disabled="isSubmitting || !blogForm.title.trim()"
          >
            <i class="fas fa-save mr-2"></i>Save Draft
          </button>
          <button
            type="button"
            @click="submitForReview('blog')"
            class="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-poppins"
            :disabled="isSubmitting || !isBlogFormValid"
          >
            <i class="fas fa-paper-plane mr-2"></i>{{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
          </button>
        </div>
      </div>

      <!-- Video Post Form -->
      <div v-if="activeTab === 'video'" class="bg-white rounded-xl shadow-lg p-6 transform transition-all hover:scale-[1.01] duration-300">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 font-poppins">New Video Post</h2>
        
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ errorMessage }}
        </div>
        
        <!-- Success Alert -->
        <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ successMessage }}
        </div>
        
        <!-- Membership Check -->
        <div v-if="!currentUser || membershipStatus.membershipType === 'none'" class="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
          <div class="flex items-center">
            <i class="fas fa-crown text-yellow-600 mr-2"></i>
            <span class="text-yellow-800">Membership required for video posting</span>
            <button 
              @click="$router.push('/projects')"
              class="ml-4 px-4 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 text-sm"
            >
              Get Membership
            </button>
          </div>
        </div>
        
        <!-- Video Form Content -->
        <div v-if="currentUser && membershipStatus.membershipType !== 'none'">
          <!-- Title -->
          <div class="mb-6">
            <label for="video-title" class="block text-sm font-medium text-gray-700 mb-2 font-poppins">Video Title*</label>
            <input
              v-model="videoForm.title"
              type="text"
              id="video-title"
              class="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 focus:ring-2 transition-all duration-200 font-poppins"
              placeholder="Enter video title"
              required
            >
            <p v-if="videoForm.title.length > 0" class="mt-1 text-xs text-gray-500">{{ videoForm.title.length }}/100 chars</p>
          </div>

          <!-- Category -->
          <div class="mb-6">
            <label for="video-category" class="block text-sm font-medium text-gray-700 mb-2 font-poppins">Category*</label>
            <div class="relative">
              <select
                v-model="videoForm.categoryId"
                id="video-category"
                class="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 focus:ring-2 appearance-none font-poppins transition-all duration-200"
                required
              >
                <option value="" disabled selected>Select Category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-500">
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <label for="video-excerpt" class="block text-sm font-medium text-gray-700 mb-2 font-poppins">Video Description*</label>
            <textarea
              v-model="videoForm.excerpt"
              id="video-excerpt"
              rows="3"
              class="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 focus:ring-2 transition-all duration-200 font-poppins"
              placeholder="Enter video description (1-300 chars)"
              required
            ></textarea>
            <p class="mt-1 text-xs text-gray-500">{{ videoForm.excerpt.length }}/300 chars</p>
          </div>

          <!-- Video Upload -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2 font-poppins">Video File*</label>
            <div class="flex items-center justify-center w-full">
              <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-400 rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition-all duration-200">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <i class="fas fa-video text-purple-500 text-4xl mb-2"></i>
                  <p class="text-sm text-gray-600 font-poppins">Click to upload video</p>
                  <p class="text-xs text-gray-500 font-poppins">Supports MP4, AVI (Max 500MB)</p>
                </div>
                <input type="file" class="hidden" @change="handleVideoUpload" accept="video/mp4,video/avi">
              </label>
            </div>
            <div v-if="videoForm.videoFile" class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p class="text-sm text-green-800 font-poppins">
                <i class="fas fa-check-circle mr-2"></i>
                Selected: {{ videoForm.videoFile.name }} ({{ (videoForm.videoFile.size / 1024 / 1024).toFixed(2) }} MB)
              </p>
            </div>
          </div>

          <!-- Video Cover -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2 font-poppins">Video Cover (Optional)</label>
            <div class="flex items-center justify-center w-full">
              <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-purple-400 rounded-lg cursor-pointer bg-purple-50 hover:bg-purple-100 transition-all duration-200">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <i class="fas fa-image text-purple-500 text-4xl mb-2"></i>
                  <p class="text-sm text-gray-600 font-poppins">Click to upload cover</p>
                  <p class="text-xs text-gray-500 font-poppins">Supports JPG, PNG (Max 5MB)</p>
                </div>
                <input type="file" class="hidden" @change="handleVideoImageUpload" accept="image/jpeg,image/png">
              </label>
            </div>
            <div v-if="videoForm.coverImage" class="mt-4">
              <div class="relative inline-block">
                <img :src="videoForm.coverImage" class="w-32 h-24 object-cover rounded-lg border border-purple-200">
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

          <!-- Video Tags -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2 font-poppins">Tags (Max 5)</label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="(tag, index) in videoForm.tags"
                :key="index"
                class="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 flex items-center"
              >
                {{ tag }}
                <button 
                  type="button"
                  @click="removeVideoTag(index)" 
                  class="ml-2 text-purple-600 hover:text-purple-800"
                >
                  <i class="fas fa-times text-xs"></i>
                </button>
              </span>
            </div>
            <div class="flex gap-2">
              <input
                v-model="newVideoTag"
                type="text"
                class="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 focus:ring-2 text-sm font-poppins"
                placeholder="Enter tag, press Enter or click Add"
                @keyup.enter="addVideoTag"
                :disabled="videoForm.tags.length >= 5"
              >
              <button
                type="button"
                @click="addVideoTag"
                class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 text-sm font-poppins"
                :disabled="videoForm.tags.length >= 5 || !newVideoTag.trim()"
              >
                Add
              </button>
            </div>
          </div>

          <!-- Video Access -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2 font-poppins">Access</label>
            <div class="flex items-center space-x-4">
              <label class="inline-flex items-center">
                <input
                  v-model="videoForm.accessType"
                  type="radio"
                  name="video-access"
                  value="free"
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500"
                >
                <span class="ml-2 text-gray-700 font-poppins">Free</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  v-model="videoForm.accessType"
                  type="radio"
                  name="video-access"
                  value="paid"
                  class="h-4 w-4 text-purple-600 focus:ring-purple-500"
                >
                <span class="ml-2 text-gray-700 font-poppins">Paid</span>
              </label>
            </div>
            <div v-if="videoForm.accessType === 'paid'" class="mt-4">
              <label for="video-price" class="block text-sm font-medium text-gray-700 mb-2 font-poppins">Price (Points)</label>
              <input
                v-model.number="videoForm.price"
                type="number"
                id="video-price"
                min="1"
                max="10000"
                class="w-full sm:w-32 px-4 py-2 border border-purple-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 focus:ring-2 font-poppins transition-all duration-200"
                placeholder="20"
              >
              <p class="mt-1 text-xs text-gray-500">Suggested: 20-200 points</p>
            </div>
          </div>

          <!-- Video Preview -->
          <div v-if="isVideoFormValid" class="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 class="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            <div class="text-sm text-gray-600 space-y-1">
              <p><strong>Title: </strong>{{ videoForm.title }}</p>
              <p><strong>Category: </strong>{{ getSelectedVideoCategoryName() }}</p>
              <p><strong>Tags: </strong>{{ videoForm.tags.join('、') || 'None' }}</p>
              <p><strong>Access: </strong>{{ videoForm.accessType === 'free' ? 'Free' : `Paid ${videoForm.price} points` }}</p>
              <p><strong>File: </strong>{{ videoForm.videoFile ? videoForm.videoFile.name : 'Not selected' }}</p>
            </div>
          </div>

          <!-- Video Submit Buttons -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="saveDraft('video')"
              class="px-6 py-2 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-all duration-200 font-poppins"
              :disabled="isSubmitting || !videoForm.title.trim()"
            >
              <i class="fas fa-save mr-2"></i>Save Draft
            </button>
            <button
              type="button"
              @click="submitForReview('video')"
              class="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-poppins"
              :disabled="isSubmitting || !isVideoFormValid"
            >
              <i class="fas fa-paper-plane mr-2"></i>{{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
            </button>
          </div>
        </div>
        
        <!-- Membership Required Message -->
        <div v-else class="text-center py-8">
          <i class="fas fa-crown text-6xl text-yellow-400 mb-4"></i>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Membership required for video posting</h3>
          <p class="text-gray-600 mb-6">Get membership to post videos and enjoy more privileges</p>
          <button 
            @click="$router.push('/projects')"
            class="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-poppins"
          >
            <i class="fas fa-crown mr-2"></i>Get Membership Now
          </button>
        </div>
      </div>
    </div>

    <!-- Submission Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl p-6 max-w-md w-full transform scale-95 animate-pop-in">
        <div class="text-center">
          <i class="fas fa-check-circle text-green-500 text-5xl mb-4"></i>
          <h3 class="text-xl font-bold text-gray-800 mb-2 font-poppins">Submission Successful!</h3>
          <p class="text-gray-600 mb-6 font-poppins">Your {{ submittedContentType }} has been submitted for review</p>
          <div class="bg-blue-50 p-3 rounded-lg mb-4">
            <p class="text-sm text-blue-700">
              <i class="fas fa-info-circle mr-1"></i>
              Estimated review time: 1-3 business days
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="goToHome"
              class="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-poppins"
            >
              Back to Home
            </button>
            <button
              @click="goToProfile"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-poppins"
            >
              My Works
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SimpleDataManager } from '@/utils/simpleDataManager'
import { firebaseRepo } from '@/services/firebaseRepo'
import TiptapEditor from '@/components/TiptapEditor.vue'

export default {
  name: 'Post',
  components: {
    TiptapEditor
  },
  data() {
    return {
      activeTab: 'blog',
      isSubmitting: false,
      showSuccessModal: false,
      submittedContentType: '',
      errorMessage: '',
      successMessage: '',
      newTag: '',
      newVideoTag: '',
      
      // Data Manager and User
      dataManager: null,
      currentUser: null,
      categories: [],
      membershipStatus: { membershipType: 'none' },
      
      // Suggested Tags
      suggestedTags: ['Tech', 'Tutorial', 'Analysis', 'Research', 'Case Study'],
      
      // Blog Form Data
      blogForm: {
        title: '',
        excerpt: '',
        content: '',
        categoryId: '',
        tags: [],
        coverImage: '', // Keep for backward compatibility or future use, but UI removed
        accessType: 'free',
        price: 10
      },
      
      // Video Form Data
      videoForm: {
        title: '',
        excerpt: '',
        categoryId: '',
        tags: [],
        coverImage: '',
        videoFile: null,
        accessType: 'free',
        price: 20
      }
    }
  },
  computed: {
    isBlogFormValid() {
      return this.blogForm.title.trim() && 
             this.blogForm.title.length <= 100 &&
             this.blogForm.excerpt.trim() && 
             this.blogForm.excerpt.length >= 1 &&
             this.blogForm.excerpt.length <= 300 &&
             this.blogForm.content.trim() && 
             this.blogForm.content.length >= 1 &&
             this.blogForm.categoryId &&
             (this.blogForm.accessType === 'free' || (this.blogForm.accessType === 'paid' && this.blogForm.price > 0))
    },
    
    isVideoFormValid() {
      return this.videoForm.title.trim() && 
             this.videoForm.title.length <= 100 &&
             this.videoForm.excerpt.trim() && 
             this.videoForm.excerpt.length >= 1 &&
             this.videoForm.excerpt.length <= 300 &&
             this.videoForm.videoFile &&
             this.videoForm.categoryId &&
             (this.videoForm.accessType === 'free' || (this.videoForm.accessType === 'paid' && this.videoForm.price > 0))
    }
  },
  mounted() {
    this.initializeData()
  },
  methods: {
    async handleEditorImageUpload(file) {
      if (!file) return
      
      if (!file.type.match('image.*')) {
        this.errorMessage = 'Please upload a valid image file'
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Image size cannot exceed 5MB'
        return
      }
      
      if (!this.currentUser) {
        this.errorMessage = 'Please login before uploading images'
        return
      }
      
      try {
        const url = await firebaseRepo.uploadContentImage(this.currentUser.id, file)
        // Insert into rich text
        if (this.$refs.blogEditor && typeof this.$refs.blogEditor.insertImage === 'function') {
          this.$refs.blogEditor.insertImage(url)
        } else {
          // Fallback
          const imgHtml = `<p><img src="${url}" alt="" /></p>`
          this.blogForm.content = (this.blogForm.content || '') + imgHtml
        }
        this.errorMessage = ''
      } catch (error) {
        console.error('Failed to upload editor image:', error)
        this.errorMessage = 'Image upload failed, please try again'
      }
    },

    async initializeData() {
      try {
        this.dataManager = SimpleDataManager.getInstance()
        const user = await this.dataManager.getCurrentUserAsync()
        
        if (!user) {
          this.$router.push('/Login')
          return
        }
        
        this.currentUser = user
        await this.loadCategories()
        await this.loadMembershipStatus()
      } catch (error) {
        console.error('Failed to initialize post page:', error)
        this.errorMessage = 'Initialization failed, please refresh page'
      }
    },
    
    async loadCategories() {
      try {
        this.categories = await this.dataManager.getCategoriesAsync() || []
        if (this.categories.length === 0) {
          await this.createDefaultCategories()
        }
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    },
    
    async loadMembershipStatus() {
      if (!this.currentUser) return
      try {
        this.membershipStatus = await this.dataManager.getUserMembershipStatusAsync(this.currentUser.id)
      } catch (error) {
        console.error('Failed to load membership status:', error)
      }
    },
    
    async createDefaultCategories() {
      const defaultCategories = [
        { name: 'Tech Tutorials', description: 'Programming techniques and tutorials', icon: 'fas fa-code', color: '#3B82F6' },
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
          console.error('Failed to create category:', error)
        }
      }
    },
    
    getSelectedCategoryName() {
      const category = this.categories.find(c => c.id === this.blogForm.categoryId)
      return category ? category.name : 'Not selected'
    },
    
    getSelectedVideoCategoryName() {
      const category = this.categories.find(c => c.id === this.videoForm.categoryId)
      return category ? category.name : 'Not selected'
    },
    
    addTag() {
      if (this.newTag.trim() && !this.blogForm.tags.includes(this.newTag.trim()) && this.blogForm.tags.length < 5) {
        this.blogForm.tags.push(this.newTag.trim())
        this.newTag = ''
      }
    },
    
    removeTag(index) {
      this.blogForm.tags.splice(index, 1)
    },
    
    addVideoTag() {
      if (this.newVideoTag.trim() && !this.videoForm.tags.includes(this.newVideoTag.trim()) && this.videoForm.tags.length < 5) {
        this.videoForm.tags.push(this.newVideoTag.trim())
        this.newVideoTag = ''
      }
    },
    
    removeVideoTag(index) {
      this.videoForm.tags.splice(index, 1)
    },
    
    handleVideoUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      if (!file.type.match('video.*')) {
        this.errorMessage = 'Please upload a valid video file'
        return
      }
      if (file.size > 500 * 1024 * 1024) {
        this.errorMessage = 'Video size cannot exceed 500MB'
        return
      }
      this.videoForm.videoFile = file
    },
    
    handleVideoImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      if (!file.type.match('image.*')) {
        this.errorMessage = 'Please upload a valid image file'
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Image size cannot exceed 5MB'
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        this.videoForm.coverImage = e.target.result
      }
      reader.readAsDataURL(file)
    },
    
    removeVideoCoverImage() {
      this.videoForm.coverImage = ''
    },
    
    async saveDraft(type) {
      if (!this.currentUser) return
      const form = type === 'blog' ? this.blogForm : this.videoForm
      if (!form.title.trim()) {
        this.errorMessage = 'Please enter at least a title to save draft'
        return
      }
      try {
        const selectedCategory = this.categories.find(c => c.id === form.categoryId)
        if (type === 'blog') {
          const articleData = {
            title: form.title || 'Untitled Draft',
            content: form.content,
            excerpt: form.excerpt || form.content.substring(0, 100) + '...',
            authorId: this.currentUser.id,
            authorName: this.currentUser.nickname || this.currentUser.username,
            categoryId: form.categoryId || '',
            categoryName: selectedCategory ? selectedCategory.name : 'Uncategorized',
            tags: form.tags || [],
            status: 'draft',
            isVideo: false
          }
          await this.dataManager.createArticleAsync(articleData)
        }
        this.successMessage = 'Draft saved successfully!'
        setTimeout(() => { this.successMessage = '' }, 3000)
      } catch (error) {
        console.error('Failed to save draft:', error)
        this.errorMessage = 'Failed to save draft'
      }
    },
    
    async submitForReview(type) {
      const isValid = type === 'blog' ? this.isBlogFormValid : this.isVideoFormValid
      if (!isValid || !this.currentUser) return
      
      this.isSubmitting = true
      try {
        const form = type === 'blog' ? this.blogForm : this.videoForm
        const selectedCategory = this.categories.find(c => c.id === form.categoryId)
        
        const pendingContent = {
          id: 'content_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          type: type,
          title: form.title,
          preview: form.excerpt,
          content: type === 'blog' ? form.content : `Video file: ${form.videoFile.name}`,
          categoryId: form.categoryId,
          categoryName: selectedCategory.name,
          tags: form.tags,
          accessType: form.accessType,
          price: form.accessType === 'paid' ? form.price : 0,
          author: this.currentUser.nickname || this.currentUser.username,
          authorId: this.currentUser.id,
          submitTime: new Date(),
          status: 'pending',
          ...(type === 'video' && {
            videoFile: form.videoFile,
            duration: 'Pending'
          })
        }
        
        await this.dataManager.addPendingContentAsync(pendingContent)
        this.submittedContentType = type === 'blog' ? 'blog post' : 'video'
        this.showSuccessModal = true
        this.resetForm(type)
      } catch (error) {
        console.error('Submission failed:', error)
        this.errorMessage = 'Submission failed'
      } finally {
        this.isSubmitting = false
      }
    },
    
    resetForm(type) {
      if (type === 'blog') {
        this.blogForm = { title: '', excerpt: '', content: '', categoryId: '', tags: [], coverImage: '', accessType: 'free', price: 10 }
      } else {
        this.videoForm = { title: '', excerpt: '', categoryId: '', tags: [], coverImage: '', videoFile: null, accessType: 'free', price: 20 }
      }
    },
    
    goToHome() { this.$router.push('/') },
    goToProfile() { this.$router.push('/about') }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
.font-poppins { font-family: 'Poppins', sans-serif; }
.animate-pop-in { animation: pop-in 0.3s ease-out forwards; }
@keyframes pop-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
