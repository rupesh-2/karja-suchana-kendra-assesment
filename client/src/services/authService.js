import api from './api'

const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password })
    return response.data
  },

  async getMe() {
    const response = await api.get('/auth/me')
    return response.data
  },

  async logout() {
    await api.post('/auth/logout')
  },

  setToken(token) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }
}

export default authService

