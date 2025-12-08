import api from './api'

const profileService = {
  async getProfile() {
    const response = await api.get('/profile/me')
    return response.data
  },

  async updateProfile(profileData) {
    const response = await api.put('/profile/update', profileData)
    return response.data
  },

  async uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export default profileService

