import { useState } from 'react'
import axios from 'axios'

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    studentId: user.studentId || '',
    emergencyContact: user.emergencyContact || '',
    emergencyPhone: user.emergencyPhone || '',
    parentName: user.parentName || '',
    parentPhone: user.parentPhone || ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      console.log('Submitting form data:', formData)

      const { data } = await axios.put('/api/users/profile', formData, config)
      console.log('Server response:', data)
      
      onUpdate(data) // This will use the updateUser function from AuthContext
      onClose()
    } catch (error) {
      console.error('Profile update error:', error)
      setError(
        error.response?.data?.message || 
        error.message || 
        'Failed to update profile'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit Profile</h3>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input mt-1"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input mt-1"
                  required
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
                  Student ID
                </label>
                <input
                  type="text"
                  name="studentId"
                  id="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="input mt-1"
                  required
                />
              </div>

              <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="input mt-1"
                  required
                />
              </div>

              <div>
                <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="input mt-1"
                  required
                  placeholder="+256 XXX XXX XXX"
                />
              </div>

              <div>
                <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">
                  Parent/Guardian Name
                </label>
                <input
                  type="text"
                  name="parentName"
                  id="parentName"
                  value={formData.parentName}
                  onChange={handleChange}
                  className="input mt-1"
                  required
                />
              </div>

              <div>
                <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700">
                  Parent/Guardian Phone
                </label>
                <input
                  type="tel"
                  name="parentPhone"
                  id="parentPhone"
                  value={formData.parentPhone}
                  onChange={handleChange}
                  className="input mt-1"
                  required
                  placeholder="+256 XXX XXX XXX"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfileModal




