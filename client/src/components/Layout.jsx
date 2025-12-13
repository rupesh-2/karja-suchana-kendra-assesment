import { Outlet, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import './Layout.css'

const Layout = () => {
  const { user, logout, hasPermission } = useAuth()
  const { t } = useTranslation()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h2>{t('nav.appName')}</h2>
          </div>
          <div className="nav-menu">
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              {t('nav.dashboard')}
            </Link>
            {hasPermission('view_users') && (
              <Link
                to="/users"
                className={`nav-link ${isActive('/users') ? 'active' : ''}`}
              >
                {t('nav.users')}
              </Link>
            )}
            {hasPermission('view_roles') && (
              <Link
                to="/roles"
                className={`nav-link ${isActive('/roles') ? 'active' : ''}`}
              >
                {t('nav.roles')}
              </Link>
            )}
            <Link
              to="/page1"
              className={`nav-link ${isActive('/page1') ? 'active' : ''}`}
            >
              {t('nav.page1')}
            </Link>
            <Link
              to="/page2"
              className={`nav-link ${isActive('/page2') ? 'active' : ''}`}
            >
              {t('nav.page2')}
            </Link>
            <Link
              to="/page3"
              className={`nav-link ${isActive('/page3') ? 'active' : ''}`}
            >
              {t('nav.page3')}
            </Link>
          </div>
          <div className="nav-user">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link
              to="/profile"
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              style={{ textDecoration: 'none' }}
            >
              <span className="user-info">
                {user ? `${user.username} (${user.role})` : t('common.loading')}
              </span>
            </Link>
            <button onClick={logout} className="btn btn-secondary">
              {t('nav.logout')}
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

