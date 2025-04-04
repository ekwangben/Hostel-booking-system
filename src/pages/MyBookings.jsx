import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import BookingCard from '../components/BookingCard'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [activeBookings, setActiveBookings] = useState([])
  const [pastBookings, setPastBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [activeTab, setActiveTab] = useState('active')
  
  const location = useLocation()

  useEffect(() => {
    if (location.state?.success) {
      setSuccessMessage(location.state.message)
      window.history.replaceState({}, document.title)
    }
    
    fetchBookings()
  }, [location])

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching bookings with token:', token.substring(0, 10) + '...');
      
      const response = await axios.get('/api/bookings/my-bookings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Bookings response:', response.data);
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      const currentDate = new Date();
      
      const active = response.data.filter(booking => 
        new Date(booking.check_out_date) >= currentDate
      );
      const past = response.data.filter(booking => 
        new Date(booking.check_out_date) < currentDate
      );
      
      setBookings(response.data);
      setActiveBookings(active);
      setPastBookings(past);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch bookings';
      setError(errorMessage);
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  }

  const handleCancelSuccess = (bookingId) => {
    setBookings(prevBookings => 
      prevBookings.filter(booking => booking.id !== bookingId)
    )
    
    setActiveBookings(prevBookings => 
      prevBookings.filter(booking => booking.id !== bookingId)
    )
    
    setSuccessMessage('Booking cancelled successfully')
    
    setTimeout(() => {
      setSuccessMessage('')
    }, 3000)
  }

  if (loading) {
    return (
      <div className="bg-background min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'active'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('active')}
          >
            Active Bookings ({activeBookings.length})
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'past'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab('past')}
          >
            Past Bookings ({pastBookings.length})
          </button>
        </div>
        
        {activeTab === 'active' ? (
          activeBookings.length > 0 ? (
            <div className="space-y-4">
              {activeBookings.map(booking => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  onCancelSuccess={handleCancelSuccess}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active bookings</h3>
              <p className="text-gray-500 mb-4">
                You don't have any active bookings at the moment.
              </p>
              <a href="/rooms" className="btn btn-primary">
                Browse Rooms
              </a>
            </div>
          )
        ) : (
          pastBookings.length > 0 ? (
            <div className="space-y-4">
              {pastBookings.map(booking => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  onCancelSuccess={handleCancelSuccess}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No past bookings</h3>
              <p className="text-gray-500">
                You don't have any past booking history.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default MyBookings



