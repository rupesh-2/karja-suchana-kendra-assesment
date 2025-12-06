import { useAuth } from '../context/AuthContext'
import './Page.css'

const Page1 = () => {
  const { user, hasPermission } = useAuth()

  return (
    <div className="page">
      <div className="container">
        <h1>Page 1 - Information</h1>
        
        <div className="card">
          <div className="static-section">
            <h2>Static Section</h2>
            <p>This is a static section that appears for all users regardless of their role.</p>
            <p>It provides general information about Page 1.</p>
          </div>

          <div className="dynamic-section">
            <h2>Dynamic Section</h2>
            <p>Welcome, <strong>{user?.username}</strong>! You are viewing this page as a <strong>{user?.role}</strong>.</p>
            
            {hasPermission('view_users') && (
              <div className="permission-block">
                <h3>User Management Access</h3>
                <p>You have permission to view and manage users.</p>
              </div>
            )}

            {hasPermission('view_roles') && (
              <div className="permission-block">
                <h3>Role Management Access</h3>
                <p>You have permission to view and manage roles.</p>
              </div>
            )}

            {user?.role === 'superadmin' && (
              <div className="permission-block superadmin-block">
                <h3>Super Administrator Access</h3>
                <p>You have full system access and can manage all aspects of the application.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page1

