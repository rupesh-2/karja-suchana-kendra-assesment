import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import roleService from '../services/roleService'
import './Roles.css'

const Roles = () => {
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
      setError(err.response?.data?.error || 'Failed to fetch roles')
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
    if (!window.confirm('Are you sure you want to delete this role?')) return

    try {
      await roleService.delete(id)
      setSuccess('Role deleted successfully')
      fetchRoles()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete role')
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
        setSuccess('Role updated successfully')
      } else {
        await roleService.create(formData)
        setSuccess('Role created successfully')
      }
      setShowModal(false)
      fetchRoles()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed')
      setTimeout(() => setError(''), 3000)
    }
  }

  if (loading) {
    return <div className="container">Loading...</div>
  }

  return (
    <div className="roles-page">
      <div className="container">
        <div className="page-header">
          <h1>Roles & Permissions</h1>
          {hasRole('superadmin') && (
            <button onClick={handleCreate} className="btn btn-primary">
              Add New Role
            </button>
          )}
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card">
          <div className="static-section">
            <h2>Static Section</h2>
            <p>This section is visible to all authenticated users. It provides general information about the roles and permissions system.</p>
            <p>The system supports three default roles: Read-Only, Admin, and Super Administrator.</p>
          </div>

          {hasPermission('view_roles') ? (
            <div className="dynamic-section">
              <h2>Dynamic Section - Roles List</h2>
              <p>This section is only visible to users with permission to view roles.</p>
              
              <div className="table-wrapper">
                <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Permissions</th>
                    {hasRole('superadmin') && <th>Actions</th>}
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
                      <td>{role.description || 'No description'}</td>
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
                          'No permissions'
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
                              Edit
                            </button>
                            {![1, 2, 3].includes(role.id) && (
                              <button
                                onClick={() => handleDelete(role.id)}
                                className="btn btn-danger"
                              >
                                Delete
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
              <p>You don't have permission to view the roles list.</p>
            </div>
          )}

          {hasRole('superadmin') && (
            <div className="superadmin-section">
              <h2>Super Admin Exclusive Section</h2>
              <p>This section is only visible to Super Administrators.</p>
              <p>You have full control over roles and permissions management.</p>
            </div>
          )}
        </div>

        {showModal && hasRole('superadmin') && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingRole ? 'Edit Role' : 'Create Role'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Role Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., manager"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    placeholder="Describe the role's purpose and responsibilities"
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingRole ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
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

