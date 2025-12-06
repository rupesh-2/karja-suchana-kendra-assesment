import api from './api'

const roleService = {
  async getAll() {
    const response = await api.get('/roles')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/roles/${id}`)
    return response.data
  },

  async create(roleData) {
    const response = await api.post('/roles', roleData)
    return response.data
  },

  async update(id, roleData) {
    const response = await api.put(`/roles/${id}`, roleData)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/roles/${id}`)
    return response.data
  }
}

export default roleService

