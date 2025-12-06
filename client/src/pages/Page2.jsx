import { useAuth } from '../context/AuthContext'
import './Page.css'

const Page2 = () => {
  const { user, hasPermission } = useAuth()

  return (
    <div className="page">
      <div className="container">
        <h1>Page 2 - Analytics</h1>
        
        <div className="card">
          <div className="static-section">
            <h2>Static Section</h2>
            <p>This is a static section that appears for all users regardless of their role.</p>
            <p>It provides general information about Page 2 - Analytics.</p>
          </div>

          <div className="dynamic-section">
            <h2>Dynamic Section - Role-Based Content</h2>
            
            {user?.role === 'readonly' && (
              <div className="role-content">
                <h3>Read-Only View</h3>
                <p>As a read-only user, you can view analytics data but cannot modify anything.</p>
                <div className="analytics-placeholder">
                  <p>📊 Analytics Dashboard (Read-Only Mode)</p>
                </div>
              </div>
            )}

            {user?.role === 'admin' && (
              <div className="role-content">
                <h3>Admin View</h3>
                <p>As an admin, you can view and export analytics data.</p>
                <div className="analytics-placeholder">
                  <p>📊 Analytics Dashboard (Admin Mode)</p>
                  <button className="btn btn-primary">Export Data</button>
                </div>
              </div>
            )}

            {user?.role === 'superadmin' && (
              <div className="role-content">
                <h3>Super Admin View</h3>
                <p>As a super admin, you have full access to all analytics features.</p>
                <div className="analytics-placeholder">
                  <p>📊 Analytics Dashboard (Super Admin Mode)</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button className="btn btn-primary">Export Data</button>
                    <button className="btn btn-success">Generate Report</button>
                    <button className="btn btn-secondary">Configure Settings</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page2

