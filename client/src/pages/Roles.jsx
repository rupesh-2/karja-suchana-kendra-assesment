import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import roleService from '../services/roleService'
import './Roles.css'

const Roles = () => {
  const { t } = useTranslation()
  const { hasPermission, hasRole } = useAuth()
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const data = await roleService.getAll()
      setRoles(data)
    } catch (err) {
      setError(err.response?.data?.error || t('roles.failedToFetch'))
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingRole(null)
    setFormData({ name: '', description: '' })
    setShowModal(true)
  }

  const handleEdit = (role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('roles.deleteConfirm'))) return

    try {
      await roleService.delete(id)
      setSuccess(t('roles.roleDeleted'))
      fetchRoles()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || t('roles.failedToFetch'))
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (editingRole) {
        await roleService.update(editingRole.id, formData)
        setSuccess(t('roles.roleUpdated'))
      } else {
        await roleService.create(formData)
        setSuccess(t('roles.roleCreated'))
      }
      setShowModal(false)
      fetchRoles()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || t('roles.operationFailed'))
      setTimeout(() => setError(''), 3000)
    }
  }

  if (loading) {
    return <div className="container">{t('common.loading')}</div>
  }

  return (
    <div className="roles-page">
      <div className="container">
        <div className="page-header">
          <h1>{t('roles.title')}</h1>
          {hasRole('superadmin') && (
            <button onClick={handleCreate} className="btn btn-primary">
              {t('roles.addRole')}
            </button>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card">
          <div className="static-section">
            <h2>{t('dashboard.staticSection')}</h2>
            <p>{t('roles.staticInfo')}</p>
            <p>{t('roles.systemSupports')}</p>
          </div>

          {hasPermission('view_roles') ? (
            <div className="dynamic-section">
              <h2>{t('roles.roleList')}</h2>
              <p>{t('roles.roleListDesc')}</p>
              
              <div className="table-wrapper">
                <table className="table">
                <thead>
                  <tr>
                    <th>{t('roles.id')}</th>
                    <th>{t('roles.name')}</th>
                    <th>{t('roles.description')}</th>
                    <th>{t('roles.permissions')}</th>
                    {hasRole('superadmin') && <th>{t('common.actions')}</th>}
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id}>
                      <td>{role.id}</td>
                      <td>
                        <span className={`role-badge role-${role.name}`}>
                          {role.name}
                        </span>
                      </td>
                      <td>{role.description || t('roles.noPermissions')}</td>
                      <td>
                        {role.permissions ? (
                          <div className="permissions-list">
                            {role.permissions.split(',').map((perm, idx) => (
                              <span key={idx} className="permission-badge">
                                {perm}
                              </span>
                            ))}
                          </div>
                        ) : (
                          t('roles.noPermissions')
                        )}
                      </td>
                      {hasRole('superadmin') && (
                        <td>
                          <div className="action-buttons">
                            <button
                              onClick={() => handleEdit(role)}
                              className="btn btn-secondary"
                              style={{ marginRight: '5px' }}
                            >
                              {t('common.edit')}
                            </button>
                            {![1, 2, 3].includes(role.id) && (
                              <button
                                onClick={() => handleDelete(role.id)}
                                className="btn btn-danger"
                              >
                                {t('common.delete')}
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          ) : (
            <div className="dynamic-section">
              <p>{t('users.noPermission')}</p>
            </div>
          )}

          {hasRole('superadmin') && (
            <div className="superadmin-section">
              <h2>{t('dashboard.superAdminSection')}</h2>
              <p>{t('dashboard.superAdminDesc')}</p>
              <p>{t('dashboard.superAdminAccess')}</p>
            </div>
          )}
        </div>

        {showModal && hasRole('superadmin') && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingRole ? t('roles.editRole') : t('roles.createRole')}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>{t('roles.name')}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., manager"
                  />
                </div>
                <div className="form-group">
                  <label>{t('roles.description')}</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    placeholder="Describe the role's purpose and responsibilities"
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingRole ? t('common.update') : t('common.create')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Roles

