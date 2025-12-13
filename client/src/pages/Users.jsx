import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import userService from '../services/userService'
import roleService from '../services/roleService'
import './Users.css'

const Users = () => {
  const { t } = useTranslation()
  const { hasPermission } = useAuth()
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role_id: ''
  })

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll()
      // Backend returns { users: [...], pagination: {...} }
      if (response.users) {
        setUsers(response.users)
      } else if (Array.isArray(response)) {
        // Backward compatibility: if it's an array, use it directly
        setUsers(response)
      } else {
        setUsers([])
      }
    } catch (err) {
      console.error('Fetch users error:', err)
      setError(err.response?.data?.error || t('users.failedToFetch'))
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const data = await roleService.getAll()
      setRoles(data)
    } catch (err) {
      console.error('Failed to fetch roles:', err)
    }
  }

  const handleCreate = () => {
    setEditingUser(null)
    setFormData({ username: '', email: '', password: '', role_id: '' })
    setShowModal(true)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role_id: user.role_id
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('users.deleteConfirm'))) return

    try {
      await userService.delete(id)
      setSuccess(t('users.userDeleted'))
      fetchUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || t('users.failedToFetch'))
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (editingUser) {
        await userService.update(editingUser.id, formData)
        setSuccess(t('users.userUpdated'))
      } else {
        await userService.create(formData)
        setSuccess(t('users.userCreated'))
      }
      setShowModal(false)
      fetchUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || t('users.operationFailed'))
      setTimeout(() => setError(''), 3000)
    }
  }

  if (loading) {
    return <div className="container">Loading...</div>
  }

  return (
    <div className="users-page">
      <div className="container">
        <div className="page-header">
          <h1>User Management</h1>
          {hasPermission('create_users') && (
            <button onClick={handleCreate} className="btn btn-primary">
              Add New User
            </button>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card">
          <div className="static-section">
            <h2>Static Section</h2>
            <p>This section is visible to all authenticated users. It provides general information about user management.</p>
          </div>

          {hasPermission('view_users') ? (
            <div className="dynamic-section">
              <h2>Dynamic Section - User List</h2>
              <p>This section is only visible to users with permission to view users.</p>
              
              <div className="table-wrapper">
                <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created At</th>
                    {hasPermission('edit_users') && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge role-${user.role_name}`}>
                          {user.role_name}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      {hasPermission('edit_users') && (
                        <td>
                          <div className="action-buttons">
                                {hasPermission('edit_users') && (
                                        <button
                                          onClick={() => handleEdit(user)}
                                          className="btn btn-secondary"
                                          style={{ marginRight: '5px' }}
                                        >
                                          {t('common.edit')}
                                        </button>
                                      )}
                                      {hasPermission('delete_users') && (
                                        <button
                                          onClick={() => handleDelete(user.id)}
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
                </div>

                {showModal && (
                  <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <h2>{editingUser ? t('users.editUser') : t('users.createUser')}</h2>
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label>{t('users.username')}</label>
                          <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>{t('users.email')}</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>{t('users.password')} {editingUser && `(${t('users.leaveBlank')})`}</label>
                          <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required={!editingUser}
                          />
                        </div>
                        <div className="form-group">
                          <label>{t('users.role')}</label>
                          <select
                            value={formData.role_id}
                            onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                            required
                          >
                            <option value="">{t('users.selectRole')}</option>
                            {roles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="modal-actions">
                          <button type="submit" className="btn btn-primary">
                            {editingUser ? t('common.update') : t('common.create')}
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

export default Users

