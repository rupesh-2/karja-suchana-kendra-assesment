import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Page.css'

const Page3 = () => {
  const { user, hasPermission } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="page">
      <div className="container">
        <h1>Page 3 - Settings</h1>
        
        <div className="card">
          <div className="static-section">
            <h2>Static Section</h2>
            <p>This is a static section that appears for all users regardless of their role.</p>
            <p>It provides general information about Page 3 - Settings.</p>
          </div>

          <div className="dynamic-section">
            <h2>Dynamic Section - Settings Based on Role</h2>
            
            <div className="settings-grid">
              <div className="setting-item">
                <h3>Profile Settings</h3>
                <p>All users can access their profile settings.</p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/profile')}
                >
                  Edit Profile
                </button>
              </div>

              {hasPermission('view_users') && (
                <div className="setting-item">
                  <h3>User Management Settings</h3>
                  <p>Only users with user management permissions can access this.</p>
                  <button className="btn btn-primary">Configure Users</button>
                </div>
              )}

              {hasPermission('view_roles') && (
                <div className="setting-item">
                  <h3>Role Management Settings</h3>
                  <p>Only users with role management permissions can access this.</p>
                  <button className="btn btn-primary">Configure Roles</button>
                </div>
              )}

              {user?.role === 'superadmin' && (
                <div className="setting-item superadmin-setting">
                  <h3>System Settings</h3>
                  <p>Only Super Administrators can access system-wide settings.</p>
                  <button className="btn btn-danger">System Configuration</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page3

