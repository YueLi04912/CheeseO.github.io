<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Decorative Background Elements - Smoother Animation -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-violet-200/40 to-purple-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"></div>
      <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float-delayed"></div>
      <div class="absolute top-32 left-1/2 w-48 h-48 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float-slow"></div>
    </div>

    <!-- Main Content Area -->
    <div class="relative max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <!-- Title and Add Button -->
      <div class="mb-6 sm:mb-8 opacity-0 animate-slide-in-top">
        <div class="text-center sm:text-left mb-6">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2 tracking-tight">
            ✨ Category Management
          </h1>
          <p class="text-gray-500 text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
            <svg class="w-4 h-4 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path>
            </svg>
            Manage your content categories
          </p>
        </div>
        
        <div class="flex justify-center sm:justify-end">
          <button
            @click="addCategory"
            class="group relative px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative flex items-center gap-2">
              <svg class="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              New Category
            </div>
          </button>
        </div>
      </div>
      
      <!-- Category List Container -->
      <div class="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/20 overflow-hidden opacity-0 animate-slide-in-bottom">
        <!-- Desktop Header -->
        <div class="hidden sm:grid grid-cols-12 bg-gradient-to-r from-gray-50/90 to-slate-50/90 backdrop-blur-sm px-6 py-4 border-b border-gray-200/50">
          <div class="col-span-1 text-center text-sm font-semibold text-gray-600">No.</div>
          <div class="col-span-3 text-sm font-semibold text-gray-600">Category Name</div>
          <div class="col-span-4 text-sm font-semibold text-gray-600">Description</div>
          <div class="col-span-2 text-center text-sm font-semibold text-gray-600">Articles</div>
          <div class="col-span-2 text-center text-sm font-semibold text-gray-600">Actions</div>
        </div>
        
        <!-- Category List Item -->
        <div class="max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div 
            v-for="(category, index) in categories" 
            :key="category.id"
            class="opacity-0 animate-fade-in-item"
            :style="{ animationDelay: `${index * 100 + 300}ms` }"
          >
            <!-- Mobile Card Style -->
            <div class="sm:hidden m-4 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-md border border-gray-100/50 overflow-hidden hover:shadow-lg transition-all duration-300">
              <div class="p-5">
                <div class="flex items-start gap-4 mb-4">
                  <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center">
                    <svg :class="category.icon || 'w-6 h-6'" class="w-6 h-6 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 text-lg mb-1 truncate">{{ category.name }}</h3>
                    <p class="text-sm text-gray-500 line-clamp-2 leading-relaxed">{{ category.description || 'No description' }}</p>
                  </div>
                </div>
                
                <div class="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                      <path fill-rule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 002 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
                    </svg>
                    {{ getCategoryArticleCount(category.id) }} articles
                  </span>
                  <span>{{ formatTime(category.createdAt) }}</span>
                </div>
                
                <div class="flex gap-3">
                  <button
                    @click="editCategory(category)"
                    class="flex-1 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-blue-600 rounded-xl text-sm font-medium transition-all duration-200 border border-blue-100/50"
                  >
                    <svg class="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                  </button>
                  <button
                    @click="confirmDelete(category)"
                    :disabled="getCategoryArticleCount(category.id) > 0"
                    class="flex-1 py-2.5 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-600 rounded-xl text-sm font-medium transition-all duration-200 border border-red-100/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg class="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Desktop List Style -->
            <div class="hidden sm:grid grid-cols-12 px-6 py-4 border-b border-gray-100/50 hover:bg-gradient-to-r hover:from-violet-50/30 hover:to-purple-50/30 transition-all duration-300 group">
              <div class="col-span-1 flex items-center justify-center">
                <div class="w-8 h-8 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center text-violet-600 font-semibold text-sm">
                  {{ index + 1 }}
                </div>
              </div>
              <div class="col-span-3 flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg :class="category.icon || 'w-5 h-5'" class="w-5 h-5 text-violet-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-gray-900 truncate">{{ category.name }}</p>
                  <p class="text-xs text-gray-400">{{ formatTime(category.createdAt) }}</p>
                </div>
              </div>
              <div class="col-span-4 flex items-center text-sm text-gray-600 line-clamp-2">
                {{ category.description || 'No description' }}
              </div>
              <div class="col-span-2 flex items-center justify-center">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 border border-blue-100/50">
                  {{ getCategoryArticleCount(category.id) }} articles
                </span>
              </div>
              <div class="col-span-2 flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  @click="editCategory(category)"
                  class="p-2 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-blue-600 rounded-lg transition-all duration-200 transform hover:scale-110"
                  title="Edit Category"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  @click="confirmDelete(category)"
                  :disabled="getCategoryArticleCount(category.id) > 0"
                  class="p-2 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-600 rounded-lg transition-all duration-200 transform hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
                  :title="getCategoryArticleCount(category.id) > 0 ? 'Cannot delete category with articles' : 'Delete Category'"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="categories.length === 0" class="py-16 text-center">
          <div class="mb-6 opacity-60">
            <svg class="w-20 h-20 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-400 mb-2">No categories yet</h3>
          <p class="text-gray-400 text-sm mb-6">Create your first category to start organizing content!</p>
          <button
            @click="addCategory"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create Category
          </button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Category Modal -->
    <div 
      v-if="showAddModal || showEditModal"
      class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 opacity-0 animate-modal-show"
      @click.self="closeModal"
    >
      <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md transform scale-95 animate-modal-content border border-white/30" @click.stop>
        <div class="px-6 py-5 border-b border-gray-100/50 bg-gradient-to-r from-violet-50/50 to-purple-50/50 rounded-t-3xl">
          <h3 class="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="showEditModal" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            {{ showEditModal ? 'Edit Category' : 'New Category' }}
          </h3>
        </div>
        
        <form @submit.prevent="saveCategory">
          <div class="px-6 py-6 space-y-5">
            <!-- Category Name -->
            <div class="space-y-2">
              <label for="category-name" class="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg class="w-4 h-4 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path>
                </svg>
                Category Name
              </label>
              <input
                v-model="editingName"
                id="category-name"
                type="text"
                class="w-full px-4 py-3 border-2 border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 text-gray-800 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                placeholder="Give your category a catchy name ✨"
                required
              />
            </div>
            
            <!-- Category Description -->
            <div class="space-y-2">
              <label for="category-desc" class="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                </svg>
                Description (Optional)
              </label>
              <textarea
                v-model="editingDescription"
                id="category-desc"
                rows="3"
                class="w-full px-4 py-3 border-2 border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 text-gray-800 transition-all duration-200 bg-gray-50/50 hover:bg-white resize-none"
                placeholder="Briefly describe the purpose of this category 🎯"
              ></textarea>
            </div>

            <!-- Category Icon -->
            <div class="space-y-3">
              <label class="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                </svg>
                Select Icon
              </label>
              <div class="grid grid-cols-6 gap-2">
                <button
                  v-for="icon in availableIcons"
                  :key="icon"
                  type="button"
                  @click="editingIcon = icon"
                  :class="[
                    'p-3 rounded-xl border-2 transition-all duration-200 transform hover:scale-105',
                    editingIcon === icon 
                      ? 'border-violet-400 bg-violet-50 text-violet-600 shadow-md scale-105' 
                      : 'border-gray-200/50 hover:border-violet-300 text-gray-400 hover:text-violet-500 bg-gray-50/50 hover:bg-violet-50/50'
                  ]"
                >
                  <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div class="px-6 py-5 border-t border-gray-100/50 flex gap-3 bg-gray-50/30 rounded-b-3xl">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-6 py-3 border-2 border-gray-300/50 rounded-2xl text-sm font-semibold text-gray-600 bg-white/50 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!editingName.trim()"
              :class="[
                'flex-1 px-6 py-3 border-2 border-transparent rounded-2xl text-sm font-semibold text-white transition-all duration-200 transform hover:scale-105',
                editingName.trim()
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg hover:shadow-xl' 
                  : 'bg-gray-300 cursor-not-allowed transform-none'
              ]"
            >
              {{ showEditModal ? 'Save Changes' : 'Create Category' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div 
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 opacity-0 animate-modal-show"
    >
      <div class="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md transform scale-95 animate-modal-content border border-white/30">
        <div class="px-6 py-8 text-center">
          <div class="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Delete Category</h3>
          <p class="text-gray-600 text-sm mb-1">Are you sure you want to delete category</p>
          <p class="text-violet-600 font-semibold text-lg mb-3">"{{ currentCategory.name }}"</p>
          <p v-if="getCategoryArticleCount(currentCategory.id) > 0" class="text-red-500 text-sm mb-2 bg-red-50 rounded-lg p-2">
            ⚠️ This category has {{ getCategoryArticleCount(currentCategory.id) }} articles, cannot delete
          </p>
          <p v-else class="text-gray-500 text-sm">This action cannot be undone</p>
        </div>
        
        <div class="px-6 py-5 border-t border-gray-100/50 flex gap-3 bg-gray-50/30 rounded-b-3xl">
          <button
            @click="showDeleteModal = false"
            class="flex-1 px-6 py-3 border-2 border-gray-300/50 rounded-2xl text-sm font-semibold text-gray-600 bg-white/50 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            v-if="getCategoryArticleCount(currentCategory.id) === 0"
            @click="deleteCategory"
            class="flex-1 px-6 py-3 border-2 border-transparent rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SimpleDataManager } from '@/utils/simpleDataManager'

export default {
  name: 'CategoryManagement',
  data() {
    return {
      // Data Manager
      dataManager: null,
      
      // Category Data
      categories: [],
      articleCounts: {},
      
      // Modal State
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      
      // Current Category
      currentCategory: {
        id: '',
        name: '',
        description: ''
      },
      
      // Edit Form Data
      editingName: '',
      editingDescription: '',
      editingIcon: 'fas fa-tag',
      editingId: '',
      
      // Available Icons
      availableIcons: [
        'fas fa-tag',
        'fas fa-folder',
        'fas fa-book',
        'fas fa-graduation-cap',
        'fas fa-laptop-code',
        'fas fa-chart-line',
        'fas fa-lightbulb',
        'fas fa-rocket',
        'fas fa-cog',
        'fas fa-globe',
        'fas fa-heart',
        'fas fa-star'
      ]
    }
  },
  mounted() {
    this.initializeData()
  },
  methods: {
    // Initialize Data
    async initializeData() {
      try {
        this.dataManager = SimpleDataManager.getInstance()
        await this.loadCategories()
        console.log('Category.vue initialized, using real data manager')
      } catch (error) {
        console.error('Failed to initialize category management:', error)
      }
    },
    
    // Load Category Data
    async loadCategories() {
      try {
        this.categories = await this.dataManager.getCategoriesAsync() || []
        
        // Load article data to calculate counts
        const articles = await this.dataManager.getArticlesAsync() || []
        const counts = {}
        articles.forEach(article => {
          if (article.categoryId) {
            counts[article.categoryId] = (counts[article.categoryId] || 0) + 1
          }
        })
        this.articleCounts = counts
        
        console.log('Category data loaded:', this.categories.length, 'categories')
      } catch (error) {
        console.error('Failed to load category data:', error)
        this.categories = []
      }
    },
    
    // Get article count for category
    getCategoryArticleCount(categoryId) {
      return (this.articleCounts && this.articleCounts[categoryId]) || 0
    },
    
    // Format Time
    formatTime(dateString) {
      if (!dateString) return 'Unknown Time'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('zh-CN')
      } catch (error) {
        return 'Invalid Date'
      }
    },
    
    // Add Category
    addCategory() {
      this.editingId = ''
      this.editingName = ''
      this.editingDescription = ''
      this.editingIcon = 'fas fa-tag'
      this.showAddModal = true
    },
    
    // Edit Category
    editCategory(category) {
      this.editingId = category.id
      this.editingName = category.name
      this.editingDescription = category.description || ''
      this.editingIcon = category.icon || 'fas fa-tag'
      this.showEditModal = true
    },
    
    // Close Modal
    closeModal() {
      this.showAddModal = false
      this.showEditModal = false
      this.editingId = ''
      this.editingName = ''
      this.editingDescription = ''
      this.editingIcon = 'fas fa-tag'
    },
    
    // Save Category
    async saveCategory() {
      if (!this.editingName.trim()) return
      
      try {
        if (this.showAddModal) {
          // Create New Category
          const categoryData = {
            name: this.editingName.trim(),
            description: this.editingDescription.trim(),
            icon: this.editingIcon,
            color: '#8B5CF6' // Default Purple
          }
          
          const newCategory = await this.dataManager.createCategoryAsync(categoryData)
          
          if (newCategory) {
            await this.loadCategories() // Reload category list
            this.showSuccessMessage('Category added successfully!')
            console.log('New category created:', newCategory)
          } else {
            throw new Error('Failed to create category')
          }
          
        } else if (this.showEditModal) {
          // Update Category
          const updateData = {
            name: this.editingName.trim(),
            description: this.editingDescription.trim(),
            icon: this.editingIcon
          }
          
          const updatedCategory = await this.dataManager.updateCategoryAsync(this.editingId, updateData)
          
          if (updatedCategory) {
            await this.loadCategories() // Reload category list
            this.showSuccessMessage('Category updated successfully!')
            console.log('Category updated:', updatedCategory)
          } else {
            throw new Error('Failed to update category')
          }
        }
        
        this.closeModal()
        
      } catch (error) {
        console.error('Failed to save category:', error)
        this.showErrorMessage('Save failed: ' + error.message)
      }
    },
    
    // Confirm Delete
    confirmDelete(category) {
      this.currentCategory = { ...category }
      this.showDeleteModal = true
    },
    
    // Delete Category
    async deleteCategory() {
      try {
        // Check if category has articles
        if (this.getCategoryArticleCount(this.currentCategory.id) > 0) {
          this.showErrorMessage('Cannot delete: category has articles')
          return
        }
        
        const success = await this.dataManager.deleteCategoryAsync(this.currentCategory.id)
        
        if (success) {
          await this.loadCategories() // Reload categories
          this.showSuccessMessage('Category deleted successfully!')
          console.log('Category deleted:', this.currentCategory.name)
        } else {
          throw new Error('Failed to delete category')
        }
        
        this.showDeleteModal = false
        
      } catch (error) {
        console.error('Failed to delete category:', error)
        this.showErrorMessage('Delete failed: ' + error.message)
      }
    },
    
    // Show Success Message
    showSuccessMessage(message) {
      if (this.$message) {
        this.$message.success(message)
      } else {
        alert(message)
      }
    },
    
    // Show Error Message
    showErrorMessage(message) {
      if (this.$message) {
        this.$message.error(message)
      } else {
        alert(message)
      }
    }
  }
}
</script>

<style scoped>
/* Basic Animation Definitions */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(3deg);
  }
}

@keyframes slide-in-top {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-bottom {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-item {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes modal-show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modal-content {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Animation Classes */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 6s ease-in-out infinite;
  animation-delay: 2s;
}

.animate-float-slow {
  animation: float 8s ease-in-out infinite;
  animation-delay: 4s;
}

.animate-slide-in-top {
  animation: slide-in-top 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-slide-in-bottom {
  animation: slide-in-bottom 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in-item {
  animation: fade-in-item 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-modal-show {
  animation: modal-show 0.3s ease-out forwards;
}

.animate-modal-content {
  animation: modal-content 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Text Truncation */
.line-clamp-1 {
  display: -webkit-box;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom Scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(139, 92, 246, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.5);
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  /* Mobile Spacing Adjustments */
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* Mobile Button Min-Height */
  button, input, textarea {
    min-height: 2.75rem;
  }
  
  /* Mobile Font Size Adjustments */
  h1 {
    font-size: 1.75rem;
  }
  
  /* Mobile Card Spacing */
  .mobile-card {
    margin: 0.75rem;
  }
}

/* Disabled State Styles */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

button:disabled:hover {
  transform: none !important;
  box-shadow: none !important;
}

/* Focus State */
input:focus, textarea:focus {
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

/* Hover Effect Optimization */
.hover-lift {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>