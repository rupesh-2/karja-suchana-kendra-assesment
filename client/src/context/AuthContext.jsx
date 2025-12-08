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
  const [accessToken, setAccessToken] = useState(authService.getAccessToken())

  const fetchUser = async () => {
    try {
      const userData = await authService.getMe()
      setUser(userData)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      // Don't logout immediately - let the interceptor handle token refresh
      if (error.response?.status === 401) {
        // Clear tokens and redirect to login
        authService.clearTokens()
        setAccessToken(null)
        setUser(null)
        window.location.href = '/login'
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (accessToken) {
      authService.setAccessToken(accessToken)
      fetchUser()
    } else {
      // Check for old token format for backward compatibility
      const oldToken = localStorage.getItem('token')
      if (oldToken) {
        authService.setAccessToken(oldToken)
        setAccessToken(oldToken)
        fetchUser()
      } else {
        setLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password)
      
      // Handle new token structure (accessToken + refreshToken)
      if (response.accessToken && response.refreshToken) {
        authService.setAccessToken(response.accessToken)
        authService.setRefreshToken(response.refreshToken)
        setAccessToken(response.accessToken)
      } else if (response.token) {
        // Backward compatibility with old token format
        authService.setAccessToken(response.token)
        setAccessToken(response.token)
      }
      
      setUser(response.user)
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    const refreshToken = authService.getRefreshToken()
    if (refreshToken) {
      await authService.logout(refreshToken)
    }
    
    setAccessToken(null)
    setUser(null)
    authService.clearTokens()
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

