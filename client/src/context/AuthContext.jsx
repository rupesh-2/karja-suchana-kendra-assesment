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
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      
      // If it's a 401, try to refresh token first
      if (error.response?.status === 401) {
        const refreshToken = authService.getRefreshToken()
        
        if (refreshToken) {
          try {
            // Try to refresh the token
            const refreshResponse = await authService.refreshToken(refreshToken)
            if (refreshResponse.accessToken) {
              authService.setAccessToken(refreshResponse.accessToken)
              setAccessToken(refreshResponse.accessToken)
              // Retry fetching user
              const userData = await authService.getMe()
              setUser(userData)
              setLoading(false)
              return
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
          }
        }
        
        // If refresh failed or no refresh token, clear everything
        authService.clearTokens()
        setAccessToken(null)
        setUser(null)
      }
      
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial load - check for tokens and fetch user if needed
    const initializeAuth = async () => {
      // Check for new token format first
      const accessToken = authService.getAccessToken()
      const refreshToken = authService.getRefreshToken()
      const oldToken = localStorage.getItem('token')
      
      const hasAnyToken = accessToken || refreshToken || oldToken
      
      if (hasAnyToken && !user) {
        // We have a token but no user - fetch user data
        if (accessToken) {
          authService.setAccessToken(accessToken)
          setAccessToken(accessToken)
        } else if (oldToken) {
          authService.setAccessToken(oldToken)
          setAccessToken(oldToken)
        }
        await fetchUser()
      } else if (!hasAnyToken) {
        // No tokens at all
        setLoading(false)
      } else if (user) {
        // We have both token and user
        setLoading(false)
      } else {
        // No user but we should have fetched - set loading to false anyway
        setLoading(false)
      }
    }

    // Always run on mount to check authentication state
    initializeAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array - only run once on mount

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password)
      
      // Handle new token structure (accessToken + refreshToken)
      if (response.accessToken && response.refreshToken) {
        authService.setAccessToken(response.accessToken)
        authService.setRefreshToken(response.refreshToken)
        // Set user immediately from response to avoid re-fetch
        setUser(response.user)
        setAccessToken(response.accessToken)
        setLoading(false)
      } else if (response.token) {
        // Backward compatibility with old token format
        authService.setAccessToken(response.token)
        setUser(response.user)
        setAccessToken(response.token)
        setLoading(false)
      } else {
        // If no token in response, something went wrong
        throw new Error('No token received from server')
      }
      
      return response
    } catch (error) {
      setLoading(false)
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

