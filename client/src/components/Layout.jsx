import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import './Layout.css'

const Layout = () => {
  const { user, logout, hasPermission } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h2>Full-Stack App</h2>
          </div>
          <div className="nav-menu">
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            {hasPermission('view_users') && (
              <Link
                to="/users"
                className={`nav-link ${isActive('/users') ? 'active' : ''}`}
              >
                Users
              </Link>
            )}
            {hasPermission('view_roles') && (
              <Link
                to="/roles"
                className={`nav-link ${isActive('/roles') ? 'active' : ''}`}
              >
                Roles
              </Link>
            )}
            <Link
              to="/page1"
              className={`nav-link ${isActive('/page1') ? 'active' : ''}`}
            >
              Page 1
            </Link>
            <Link
              to="/page2"
              className={`nav-link ${isActive('/page2') ? 'active' : ''}`}
            >
              Page 2
            </Link>
            <Link
              to="/page3"
              className={`nav-link ${isActive('/page3') ? 'active' : ''}`}
            >
              Page 3
            </Link>
          </div>
          <div className="nav-user">
            <ThemeToggle />
            <Link
              to="/profile"
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              <span className="user-info">
                {user ? `${user.username} (${user.role})` : 'Loading...'}
              </span>
            </Link>
            <button onClick={logout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

