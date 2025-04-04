import axios from 'axios'
import { useState } from 'react'

const BookingCard = ({ booking, onCancelSuccess }) => {
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      setCancelling(true)
      setError('')

      const token = localStorage.getItem('token')
      const response = await axios.delete(`/api/bookings/${booking.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      onCancelSuccess(booking.id)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {booking.rooms?.name || 'Room'}
          </h3>
          <p className="text-gray-600">{booking.rooms?.hostel_name}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-primary">
            KES {booking.total_price}
          </p>
          <p className="text-sm text-gray-500">
            Booked on {formatDate(booking.created_at)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Check-in</p>
          <p className="font-medium">{formatDate(booking.check_in_date)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Check-out</p>
          <p className="font-medium">{formatDate(booking.check_out_date)}</p>
        </div>
      </div>

      {booking.special_requests && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">Special Requests:</p>
          <p className="text-gray-700">{booking.special_requests}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600 text-sm">{error}</div>
      )}

      {new Date(booking.check_in_date) > new Date() && (
        <div className="mt-6">
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Booking'}
          </button>
        </div>
      )}
    </div>
  )
}

export default BookingCard

