import { Link } from 'react-router-dom'

const ViewDetailsButton = ({ to }) => {
  return (
    <Link 
      to={to} 
      className="btn-view-details group"
    >
      <span>View Details</span>
      <svg 
        className="ml-2 -mr-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M9 5l7 7-7 7" 
        />
      </svg>
    </Link>
  )
}

export default ViewDetailsButton
