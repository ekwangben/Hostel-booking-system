import { Link } from 'react-router-dom'
import ViewDetailsButton from './ViewDetailsButton'

const RoomCard = ({ room }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <img 
        src={room.image} 
        alt={room.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="card-title mb-1">{room.name}</h3>
        <p className="card-subtitle">{room.hostelName}</p>
        <div className="flex items-center mt-2">
          <span className="font-display font-bold text-lg text-primary">Ksh 16,000</span>
          <span className="font-body text-gray-500 ml-1">/semester</span>
        </div>
        <div className="flex items-center mt-3 text-sm text-gray-500">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
          {room.capacity} {room.capacity === 1 ? 'Person' : 'People'}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full ${room.available ? 'bg-green-500' : 'bg-red-500'} mr-1`}></span>
            <span className="text-sm text-gray-500">{room.available ? 'Available' : 'Booked'}</span>
          </div>
          <ViewDetailsButton to={`/rooms/${room.id}`} />
        </div>
      </div>
    </div>
  )
}

export default RoomCard

