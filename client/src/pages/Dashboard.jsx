import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, hasPermission } = useAuth();

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="dashboard-title">{t('dashboard.title')}</h1>

        <div className="dashboard-welcome card">
          <h2>{t('dashboard.welcome', { username: user?.username })}</h2>
          <p>
            {t('dashboard.loggedInAs')} <strong>{user?.role}</strong>
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card card">
            <h3>{t('dashboard.staticSection')}</h3>
            <p>{t('dashboard.staticDescription')}</p>
            <p>{t('dashboard.staticInfo')}</p>
          </div>

          {hasPermission('view_users') && (
            <div className="dashboard-card card">
              <h3>{t('dashboard.userManagement')}</h3>
              <p>{t('dashboard.userManagementDesc')}</p>
              <p>{t('dashboard.userManagementRole', { role: user?.role })}</p>
            </div>
          )}

          {hasPermission('view_roles') && (
            <div className="dashboard-card card">
              <h3>{t('dashboard.roleManagement')}</h3>
              <p>{t('dashboard.roleManagementDesc')}</p>
              <p>{t('dashboard.roleManagementRole', { role: user?.role })}</p>
            </div>
          )}

          {user?.role === 'superadmin' && (
            <div className="dashboard-card card">
              <h3>{t('dashboard.superAdminSection')}</h3>
              <p>{t('dashboard.superAdminDesc')}</p>
              <p>{t('dashboard.superAdminAccess')}</p>
            </div>
          )}

          <div className="dashboard-card card">
            <h3>{t('dashboard.quickStats')}</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">3</div>
                <div className="stat-label">{t('dashboard.totalRoles')}</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">-</div>
                <div className="stat-label">{t('dashboard.totalUsers')}</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">6</div>
                <div className="stat-label">{t('dashboard.totalPages')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
