import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

const Dashboard = () => {
  const { user, hasPermission } = useAuth()

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Dashboard</h1>
        
        <div className="dashboard-welcome card">
          <h2>Welcome, {user?.username}!</h2>
          <p>You are logged in as <strong>{user?.role}</strong></p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card card">
            <h3>Static Section</h3>
            <p>This is a static section that appears for all users regardless of their role.</p>
            <p>It provides general information about the application.</p>
          </div>

          {hasPermission('view_users') && (
            <div className="dashboard-card card">
              <h3>Dynamic Section - User Management</h3>
              <p>This section is only visible to users with permission to view users.</p>
              <p>Your role ({user?.role}) has access to user management features.</p>
            </div>
          )}

          {hasPermission('view_roles') && (
            <div className="dashboard-card card">
              <h3>Dynamic Section - Role Management</h3>
              <p>This section is only visible to users with permission to view roles.</p>
              <p>Your role ({user?.role}) has access to role management features.</p>
            </div>
          )}

          {user?.role === 'superadmin' && (
            <div className="dashboard-card card">
              <h3>Super Admin Exclusive Section</h3>
              <p>This section is only visible to Super Administrators.</p>
              <p>You have full access to all system features and controls.</p>
            </div>
          )}

          <div className="dashboard-card card">
            <h3>Quick Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">3</div>
                <div className="stat-label">Total Roles</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">-</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">6</div>
                <div className="stat-label">Total Pages</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

