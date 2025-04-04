import { useState, useEffect } from 'react'
import axios from 'axios'
import RoomCard from '../components/RoomCard'
import ViewDetailsButton from '../components/ViewDetailsButton'

const RoomList = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    hostelName: '',
    capacity: '',
    available: ''
  })

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    setLoading(true)
    setError('')
    
    try {
      const { data } = await axios.get('/api/rooms', {
        params: {
          ...filters,
          capacity: filters.capacity || undefined,
          available: filters.available === '' ? undefined : filters.available === 'true'
        }
      })
      console.log('Total rooms fetched:', data.length);
      console.log('Fetched rooms data:', data);
      setRooms(data || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch rooms. Please try again.';
      console.error('Error fetching rooms:', error);
      setError(errorMessage);
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    fetchRooms()
  }

  const clearFilters = () => {
    setFilters({
      hostelName: '',
      capacity: '',
      available: ''
    })
  }

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Rooms</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="hostelName" className="block text-sm font-medium text-gray-700">
                      Hostel Name
                    </label>
                    <input
                      type="text"
                      id="hostelName"
                      name="hostelName"
                      value={filters.hostelName}
                      onChange={handleFilterChange}
                      className="input mt-1"
                      placeholder="Search by hostel name"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                        Min Price (Ksh)
                      </label>
                      <input
                        type="number"
                        id="minPrice"
                        name="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="input mt-1"
                        placeholder="Min Ksh"
                        min="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                        Max Price (Ksh)
                      </label>
                      <input
                        type="number"
                        id="maxPrice"
                        name="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="input mt-1"
                        placeholder="Max Ksh"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                      Capacity
                    </label>
                    <select
                      id="capacity"
                      name="capacity"
                      value={filters.capacity}
                      onChange={handleFilterChange}
                      className="input mt-1"
                    >
                      <option value="">Any capacity</option>
                      <option value="1">Single (1 person)</option>
                      <option value="2">Double (2 people)</option>
                      <option value="3">Triple (3 people)</option>
                      <option value="4">Quad (4 people)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="available" className="block text-sm font-medium text-gray-700">
                      Availability
                    </label>
                    <select
                      id="available"
                      name="available"
                      value={filters.available}
                      onChange={handleFilterChange}
                      className="input mt-1"
                    >
                      <option value="">All rooms</option>
                      <option value="true">Available only</option>
                      <option value="false">Booked only</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="btn btn-primary flex-1"
                    >
                      Apply Filters
                    </button>
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 flex-1"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* Room List */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : rooms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {rooms.map(room => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No rooms found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomList






