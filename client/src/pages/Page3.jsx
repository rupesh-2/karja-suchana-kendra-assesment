import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Page.css'

const Page3 = () => {
  const { t } = useTranslation()
  const { user, hasPermission } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="page">
      <div className="container">
        <h1>{t('page3.title')}</h1>
        
        <div className="card">
          <div className="static-section">
            <h2>{t('page3.staticSection')}</h2>
            <p>{t('page3.staticDesc')}</p>
            <p>{t('page3.staticInfo')}</p>
          </div>

          <div className="dynamic-section">
            <h2>{t('page3.dynamicSection')}</h2>
            
            <div className="settings-grid">
              <div className="setting-item">
                <h3>{t('page3.profileSettings')}</h3>
                <p>{t('page3.profileSettingsDesc')}</p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/profile')}
                >
                  {t('page3.editProfile')}
                </button>
              </div>

              {hasPermission('view_users') && (
                <div className="setting-item">
                  <h3>{t('page3.userManagementSettings')}</h3>
                  <p>{t('page3.userManagementSettingsDesc')}</p>
                  <button className="btn btn-primary">{t('page3.configureUsers')}</button>
                </div>
              )}

              {hasPermission('view_roles') && (
                <div className="setting-item">
                  <h3>{t('page3.roleManagementSettings')}</h3>
                  <p>{t('page3.roleManagementSettingsDesc')}</p>
                  <button className="btn btn-primary">{t('page3.configureRoles')}</button>
                </div>
              )}

              {user?.role === 'superadmin' && (
                <div className="setting-item superadmin-setting">
                  <h3>{t('page3.systemSettings')}</h3>
                  <p>{t('page3.systemSettingsDesc')}</p>
                  <button className="btn btn-danger">{t('page3.systemConfiguration')}</button>
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

