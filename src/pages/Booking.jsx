import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Booking = () => {
  const { roomId } = useParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    specialRequests: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)
  
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await axios.get(`/api/rooms/${roomId}`)
        setRoom(data)
        
        // Set default dates (check-in: tomorrow, check-out: next month)
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        
        const nextMonth = new Date(tomorrow)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        
        const formattedCheckIn = tomorrow.toISOString().split('T')[0]
        const formattedCheckOut = nextMonth.toISOString().split('T')[0]
        
        setBookingData(prev => ({
          ...prev,
          checkInDate: formattedCheckIn,
          checkOutDate: formattedCheckOut
        }))
        
        // Calculate initial price
        calculateTotalPrice(formattedCheckIn, formattedCheckOut)
      } catch (error) {
        setError('Failed to fetch room details. Please try again.')
        console.error('Error fetching room:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()
  }, [roomId])

  const calculateTotalPrice = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return
    
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    
    // Calculate difference in semesters (assuming 4 months per semester)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const semesters = Math.ceil(diffDays / 120) // Approximately 4 months (120 days) per semester
    
    const SEMESTER_PRICE = 16000
    setTotalPrice(semesters * SEMESTER_PRICE)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (name === 'checkInDate' || name === 'checkOutDate') {
      const checkIn = name === 'checkInDate' ? value : bookingData.checkInDate
      const checkOut = name === 'checkOutDate' ? value : bookingData.checkOutDate
      calculateTotalPrice(checkIn, checkOut)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      
      const { data } = await axios.post('/api/bookings', {
        roomId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        specialRequests: bookingData.specialRequests,
        totalPrice
      }, config)
      
      navigate('/my-bookings', { 
        state: { 
          success: true, 
          message: 'Booking successful! Your room has been reserved.' 
        } 
      })
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create booking. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Room not found</h3>
          <p className="text-gray-500 mb-4">
            The room you're trying to book doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/rooms')}
            className="btn btn-primary"
          >
            Browse Other Rooms
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book Your Room</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-2">Room Details</h2>
            <div className="flex items-start">
              <img 
                src={room.image} 
                alt={room.name} 
                className="w-24 h-24 object-cover rounded mr-4"
              />
              <div>
                <h3 className="font-medium text-gray-900">{room.name}</h3>
                <p className="text-gray-600">{room.hostelName}</p>
                <p className="text-gray-600">{room.capacity} {room.capacity === 1 ? 'Person' : 'People'} • {room.roomType}</p>
                <p className="font-bold text-primary mt-1">${room.price}/month</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  id="checkInDate"
                  name="checkInDate"
                  value={bookingData.checkInDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  id="checkOutDate"
                  name="checkOutDate"
                  value={bookingData.checkOutDate}
                  onChange={handleChange}
                  min={bookingData.checkInDate}
                  required
                  className="input"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests (Optional)
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={bookingData.specialRequests}
                onChange={handleChange}
                rows="3"
                className="input"
                placeholder="Any special requirements or requests..."
              ></textarea>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Booking Summary</h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Room Rate:</span>
                <span>Ksh {room.price}/semester</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2">
                <span>Total:</span>
                <span className="text-primary">Ksh {totalPrice}</span>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center">
              <button
                type="button"
                onClick={() => navigate(`/rooms/${roomId}`)}
                className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 mb-4 md:mb-0 w-full md:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full md:w-auto disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Booking
