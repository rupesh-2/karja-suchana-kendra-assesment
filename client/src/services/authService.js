import api from './api'

const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password })
    return response.data
  },

  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data
  },

  async getMe() {
    const response = await api.get('/auth/me')
    return response.data
  },

  async logout(refreshToken) {
    try {
      await api.post('/auth/logout', { refreshToken })
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API error:', error)
    }
  },

  setAccessToken(token) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem('accessToken', token)
    } else {
      delete api.defaults.headers.common['Authorization']
      localStorage.removeItem('accessToken')
    }
  },

  getAccessToken() {
    return localStorage.getItem('accessToken')
  },

  setRefreshToken(token) {
    if (token) {
      localStorage.setItem('refreshToken', token)
    } else {
      localStorage.removeItem('refreshToken')
    }
  },

  getRefreshToken() {
    return localStorage.getItem('refreshToken')
  },

  clearTokens() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('token') // Remove old token for backward compatibility
    delete api.defaults.headers.common['Authorization']
  }
}

export default authService

