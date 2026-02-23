// src/utils/request.ts
import axios, {
    type AxiosInstance,
    type AxiosRequestConfig,
    type InternalAxiosRequestConfig,
    type AxiosProgressEvent
  } from 'axios'
  import { useAuthStore } from '@/stores/auth'
  
  // Define response data structure
  interface ApiResponse<T = any> {
    code: number
    message: string
    data: T
  }
  
  // Create Axios instance
  const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Get base URL from environment variables
    timeout: 10000, // Request timeout
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
  
  // Request interceptor
  service.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const authStore = useAuthStore()
      
      if (authStore.isAuthenticated) {
      }
      
      // Add special header for admin requests
      if (authStore.isAdmin()) {
        config.headers['X-Request-Role'] = 'admin'
      }
      
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  
  // Encapsulate common request methods
  export default {
    /**
     * GET request
     * @param url Request URL
     * @param params Query parameters
     * @param config Additional configuration
     */
    get<T = any>(
      url: string,
      params?: object,
      config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
      return service.get(url, { params, ...config })
    },
  
    /**
     * POST request
     * @param url Request URL
     * @param data Request body data
     * @param config Additional configuration
     */
    post<T = any>(
      url: string,
      data?: object,
      config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
      return service.post(url, data, config)
    },
  
    /**
     * PUT request
     * @param url Request URL
     * @param data Request body data
     * @param config Additional configuration
     */
    put<T = any>(
      url: string,
      data?: object,
      config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
      return service.put(url, data, config)
    },
  
    /**
     * DELETE request
     * @param url Request URL
     * @param params Query parameters
     * @param config Additional configuration
     */
    delete<T = any>(
      url: string,
      params?: object,
      config?: AxiosRequestConfig
    ): Promise<ApiResponse<T>> {
      return service.delete(url, { params, ...config })
    },
  
    /**
     * File upload
     * @param url Request URL
     * @param file File object
     * @param data Other form data
     * @param onUploadProgress Upload progress callback
     */
    upload<T = any>(
      url: string,
      file: File,
      data?: object,
      onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
    ): Promise<ApiResponse<T>> {
      const formData = new FormData()
      formData.append('file', file)
      if (data) {
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key as keyof typeof data])
        })
      }
      return service.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress
      })
    },
  
    // Export raw axios instance for special needs
    request: service
  }
