import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import './Page.css'

const Page1 = () => {
  const { t } = useTranslation()
  const { user, hasPermission } = useAuth()

  return (
    <div className="page">
      <div className="container">
        <h1>{t('page1.title')}</h1>
        
        <div className="card">
          <div className="static-section">
            <h2>{t('page1.staticSection')}</h2>
            <p>{t('page1.staticDesc')}</p>
            <p>{t('page1.staticInfo')}</p>
          </div>

          <div className="dynamic-section">
            <h2>{t('page1.dynamicSection')}</h2>
            <p>{t('page1.welcome', { username: user?.username, role: user?.role })}</p>
            
            {hasPermission('view_users') && (
              <div className="permission-block">
                <h3>{t('page1.userManagementAccess')}</h3>
                <p>{t('page1.userManagementPerm')}</p>
              </div>
            )}

            {hasPermission('view_roles') && (
              <div className="permission-block">
                <h3>{t('page1.roleManagementAccess')}</h3>
                <p>{t('page1.roleManagementPerm')}</p>
              </div>
            )}

            {user?.role === 'superadmin' && (
              <div className="permission-block superadmin-block">
                <h3>{t('page1.superAdminAccess')}</h3>
                <p>{t('page1.superAdminPerm')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page1

