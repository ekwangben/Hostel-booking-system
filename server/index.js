import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

// User dashboard route
app.get('/api/users/dashboard', authenticate, async (req, res) => {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*, rooms(*)')
      .eq('user_id', req.user.id);

    if (error) throw error;

    const currentDate = new Date();

    const stats = {
      activeBookings: bookings.filter(b => new Date(b.check_out_date) >= currentDate).length,
      pastBookings: bookings.filter(b => new Date(b.check_out_date) < currentDate).length,
      upcomingCheckIn: bookings
        .find(b => new Date(b.check_in_date) >= currentDate)?.check_in_date,
      upcomingCheckOut: bookings
        .find(b => 
          new Date(b.check_out_date) >= currentDate && 
          new Date(b.check_in_date) <= currentDate
        )?.check_out_date
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
app.get('/api/users/me', authenticate, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;

    res.json({
      id: req.user.id,
      email: req.user.email,
      name: profile.name,
      studentId: profile.student_id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bookings
app.get('/api/bookings/my-bookings', authenticate, async (req, res) => {
  try {
    console.log('Fetching bookings for user:', req.user.id);
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        rooms (*)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Found bookings:', data?.length || 0);
    res.json(data || []);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch bookings',
      details: error.message 
    });
  }
});

// Auth routes
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password, studentId } = req.body;
    
    // Register user with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({ message: authError.message });
    }

    // Insert additional user data into profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          name,
          student_id: studentId,
          email
        }
      ]);

    if (profileError) {
      return res.status(400).json({ message: profileError.message });
    }

    res.status(201).json({
      token: authData.session.access_token,
      user: {
        id: authData.user.id,
        name,
        email,
        studentId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Get user profile data
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      token: data.session.access_token,
      user: {
        id: data.user.id,
        name: profileData.name,
        email: data.user.email,
        studentId: profileData.student_id
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Room routes - Main endpoint for all rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const { hostelName, minPrice, maxPrice, capacity, available } = req.query;
    
    let query = supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false });  // No limit here - shows all rooms
    
    // Apply filters if provided
    if (hostelName) {
      query = query.ilike('hostel_name', `%${hostelName}%`);
    }
    if (capacity) {
      query = query.eq('capacity', parseInt(capacity));
    }
    if (available !== undefined) {
      query = query.eq('available', available === 'true');
    }
    
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch rooms',
      details: error.message 
    });
  }
});

// Featured rooms endpoint - Keep limit for featured section
app.get('/api/rooms/featured', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('available', true)  // Only available rooms
      .order('created_at', { ascending: false })  // Newest first
      .limit(6);  // Shows only 6 rooms for featured section
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch featured rooms',
      details: error.message 
    });
  }
});

app.get('/api/rooms/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', req.params.id)
      .single();
      
    if (error) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Booking routes
app.post('/api/bookings', authenticate, async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, specialRequests, totalPrice } = req.body;
    
    // Start a transaction
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();
    
    if (roomError || !room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (!room.available) {
      return res.status(400).json({ message: 'Room is not available' });
    }
    
    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: req.user.id,
          room_id: roomId,
          check_in_date: checkInDate,
          check_out_date: checkOutDate,
          total_price: totalPrice,
          status: 'confirmed',
          special_requests: specialRequests
        }
      ])
      .select()
      .single();
      
    if (bookingError) {
      return res.status(400).json({ message: bookingError.message });
    }
    
    // Update room availability
    const { error: updateError } = await supabase
      .from('rooms')
      .update({ available: false })
      .eq('id', roomId);
      
    if (updateError) {
      return res.status(400).json({ message: updateError.message });
    }
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/bookings/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Attempting to cancel booking ${id} for user ${req.user.id}`);

    // First, verify the booking exists and belongs to the user
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, rooms(*)')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (bookingError) {
      console.error('Error fetching booking:', bookingError);
      return res.status(404).json({ 
        message: 'Booking not found',
        details: bookingError.message 
      });
    }

    if (!booking) {
      return res.status(404).json({ 
        message: 'Booking not found or does not belong to the user' 
      });
    }

    // Delete the booking
    const { error: deleteError } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting booking:', deleteError);
      return res.status(500).json({ 
        message: 'Failed to delete booking',
        details: deleteError.message 
      });
    }

    // Update room availability
    const { error: updateError } = await supabase
      .from('rooms')
      .update({ available: true })
      .eq('id', booking.room_id);

    if (updateError) {
      console.error('Error updating room availability:', updateError);
      return res.status(500).json({ 
        message: 'Failed to update room availability',
        details: updateError.message 
      });
    }

    res.json({ 
      success: true,
      message: 'Booking cancelled successfully',
      bookingId: id 
    });
  } catch (error) {
    console.error('Error in booking cancellation:', error);
    res.status(500).json({ 
      message: 'Failed to cancel booking',
      details: error.message 
    });
  }
});

// Add this endpoint to your Express server
app.put('/api/users/profile', authenticate, async (req, res) => {
  try {
    const { 
      name, 
      studentId, 
      emergencyContact, 
      emergencyPhone, 
      parentName, 
      parentPhone 
    } = req.body;

    console.log('Received update request:', {
      userId: req.user.id,
      updateData: req.body
    });

    // Validate required fields
    if (!name || !studentId) {
      return res.status(400).json({ 
        message: 'Name and Student ID are required' 
      });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        name,
        student_id: studentId,
        emergency_contact: emergencyContact,
        emergency_phone: emergencyPhone,
        parent_name: parentName,
        parent_phone: parentPhone,
        updated_at: new Date().toISOString() // Now this should work with the timestamp column
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ 
        message: error.message 
      });
    }

    if (!data) {
      return res.status(404).json({ 
        message: 'Profile not found' 
      });
    }

    // Return the updated user data
    const response = {
      id: req.user.id,
      email: req.user.email,
      name: data.name,
      studentId: data.student_id,
      emergencyContact: data.emergency_contact,
      emergencyPhone: data.emergency_phone,
      parentName: data.parent_name,
      parentPhone: data.parent_phone,
      updatedAt: data.updated_at
    };

    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: 'Failed to update profile',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Supabase URL configured:', !!process.env.SUPABASE_URL);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});




















