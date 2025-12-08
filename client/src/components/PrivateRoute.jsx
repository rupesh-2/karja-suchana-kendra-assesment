import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  // Check if we have any token (for backward compatibility)
  const hasToken = authService.getAccessToken() || localStorage.getItem('token') || authService.getRefreshToken()
  
  // If we have a token, always allow access (user data can load in background)
  if (hasToken) {
    return children
  }

  // If authenticated (has user), allow access
  if (isAuthenticated) {
    return children
  }

  // Show loading only if we're still checking and have no token
  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    )
  }

  // No token and no user - redirect to login
  return <Navigate to="/login" replace />
}

export default PrivateRoute

