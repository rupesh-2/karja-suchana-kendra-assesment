import axios from 'axios'
import authService from './authService'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    // Use accessToken if available, fallback to old token for backward compatibility
    const accessToken = authService.getAccessToken() || localStorage.getItem('token')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = authService.getRefreshToken()

      if (!refreshToken) {
        // No refresh token, logout user
        authService.clearTokens()
        processQueue(new Error('No refresh token'), null)
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const response = await authService.refreshToken(refreshToken)
        const { accessToken } = response

        authService.setAccessToken(accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        processQueue(null, accessToken)
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        authService.clearTokens()
        processQueue(refreshError, null)
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
