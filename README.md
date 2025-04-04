# KAFU Hostels - Student Hostel Booking System

A modern web application for student hostel booking and management.

## Features

- User authentication and registration
- Room browsing and booking
- Profile management
- Real-time room availability
- Secure payment integration
- Admin dashboard for hostel management

## Tech Stack

- Frontend: React.js with Vite
- Styling: Tailwind CSS
- Backend: Express.js
- Database: Supabase
- Authentication: Supabase Auth

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server
   ```bash
   npm run dev:all
   ```

## Environment Variables

Make sure to set up the following environment variables:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `PORT`: Backend server port (default: 5001)

## Scripts

- `npm run dev` - Start the frontend development server
- `npm run server` - Start the backend server
- `npm run dev:all` - Start both frontend and backend servers
- `npm run build` - Build the frontend for production

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details