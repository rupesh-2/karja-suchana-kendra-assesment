import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import profileService from '../services/profileService'
import './Profile.css'

const Profile = () => {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    currentPassword: ''
  })
  const [avatarPreview, setAvatarPreview] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await profileService.getProfile()
      setProfile(data)
      setFormData({
        username: data.username,
        email: data.email,
        password: '',
        currentPassword: ''
      })
      setAvatarPreview(data.avatar ? `/api${data.avatar}` : null)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Upload avatar
      handleAvatarUpload(file)
    }
  }

  const handleAvatarUpload = async (file) => {
    setUploading(true)
    setError('')
    try {
      const response = await profileService.uploadAvatar(file)
      setSuccess('Avatar uploaded successfully')
      setProfile(prev => ({ ...prev, avatar: response.avatar }))
      setAvatarPreview(`/api${response.avatar}`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload avatar')
      setAvatarPreview(profile?.avatar ? `/api${profile.avatar}` : null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const updateData = {}
      if (formData.username !== profile.username) {
        updateData.username = formData.username
      }
      if (formData.email !== profile.email) {
        updateData.email = formData.email
      }
      if (formData.password) {
        updateData.password = formData.password
        updateData.currentPassword = formData.currentPassword
      }

      if (Object.keys(updateData).length === 0) {
        setError('No changes to save')
        return
      }

      const updatedProfile = await profileService.updateProfile(updateData)
      setProfile(updatedProfile)
      setSuccess('Profile updated successfully')
      setEditing(false)
      
      // Update auth context if username changed
      if (updateData.username) {
        // Refresh user data in auth context
        window.location.reload() // Simple way to refresh user data
      }
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile')
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setFormData({
      username: profile.username,
      email: profile.email,
      password: '',
      currentPassword: ''
    })
    setError('')
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="card">
            <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="card">
            <div style={{ padding: '40px', textAlign: 'center' }}>Profile not found</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="page-title">My Profile</h1>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card profile-card">
          <div className="profile-header">
            <div className="avatar-section">
              <div className="avatar-container">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder">
                    {profile.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="avatar-overlay">
                  <label htmlFor="avatar-upload" className="avatar-upload-label">
                    {uploading ? 'Uploading...' : '📷 Change'}
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                </div>
              </div>
            </div>
            <div className="profile-info">
              <h2>{profile.username}</h2>
              <p className="profile-email">{profile.email}</p>
              <span className={`role-badge role-${profile.role}`}>
                {profile.role}
              </span>
            </div>
          </div>

          {!editing ? (
            <div className="profile-details">
              <div className="detail-item">
                <label>Username</label>
                <p>{profile.username}</p>
              </div>
              <div className="detail-item">
                <label>Email</label>
                <p>{profile.email}</p>
              </div>
              <div className="detail-item">
                <label>Role</label>
                <p>{profile.role}</p>
              </div>
              <div className="detail-item">
                <label>Member Since</label>
                <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setEditing(true)} className="btn btn-primary">
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="currentPassword">Current Password (required to change password)</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter current password to change password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">New Password (optional)</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile

