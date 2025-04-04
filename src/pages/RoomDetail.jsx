import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const RoomDetail = () => {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await axios.get(`/api/rooms/${id}`)
        setRoom(data)
      } catch (error) {
        setError('Failed to fetch room details. Please try again.')
        console.error('Error fetching room:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()
  }, [id])

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/rooms/${id}` } })
    } else {
      navigate(`/booking/${id}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Room not found</h3>
          <p className="text-gray-500 mb-4">
            The room you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/rooms" className="btn btn-primary">
            Browse Other Rooms
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/rooms" className="text-primary hover:text-indigo-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Rooms
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{room.name}</h1>
              <p className="text-gray-600 mb-4">{room.hostelName}</p>
              
              <div className="flex items-center mb-6">
                <span className={`inline-block w-3 h-3 rounded-full ${room.available ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                <span className="text-sm font-medium">{room.available ? 'Available' : 'Currently Booked'}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold mb-4">Room Details</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-bold text-primary text-xl">
                      Ksh 16,000<span className="text-sm text-gray-500 font-normal">/semester</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-medium">{room.capacity} {room.capacity === 1 ? 'Person' : 'People'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Room Type</p>
                    <p className="font-medium">{room.roomType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Floor</p>
                    <p className="font-medium">{room.floor}</p>
                  </div>
                </div>
                
                <h2 className="text-lg font-semibold mb-4">Description</h2>
                <p className="text-gray-700 mb-6">{room.description}</p>
                
                <h2 className="text-lg font-semibold mb-4">Amenities</h2>
                <ul className="grid grid-cols-2 gap-2 mb-6">
                  {room.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {amenity}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <button
                    onClick={handleBookNow}
                    disabled={!room.available}
                    className="btn btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {room.available ? 'Book Now' : 'Not Available'}
                  </button>
                  {!room.available && (
                    <p className="text-sm text-gray-500 text-center mt-2">
                      This room is currently booked. Please check back later or browse other rooms.
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100">
              <img 
                src={room.image} 
                alt={room.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDetail
