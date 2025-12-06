import { createContext, useState, useContext, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      authService.setToken(token)
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const userData = await authService.getMe()
      setUser(userData)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password)
      setToken(response.token)
      setUser(response.user)
      localStorage.setItem('token', response.token)
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    authService.setToken(null)
  }

  const hasPermission = (permission) => {
    if (!user) return false
    
    // Super admin has all permissions
    if (user.role === 'superadmin') return true
    
    // Admin permissions
    if (user.role === 'admin') {
      const adminPermissions = ['view_users', 'create_users', 'edit_users', 'view_roles', 'view_dashboard', 'view_pages']
      return adminPermissions.includes(permission)
    }
    
    // Read-only permissions
    if (user.role === 'readonly') {
      const readonlyPermissions = ['view_users', 'view_roles', 'view_dashboard', 'view_pages']
      return readonlyPermissions.includes(permission)
    }
    
    return false
  }

  const hasRole = (role) => {
    return user?.role === role
  }

  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    hasRole,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

