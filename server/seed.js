import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const rooms = [
  {
    name: 'Single Room',
    hostel_name: 'Maraga Hostel',
    description: 'A comfortable single room with all basic amenities. Perfect for students who prefer privacy and a quiet study environment.',
    price: 16000,
    capacity: 1,
    room_type: 'Single',
    floor: '2nd Floor',
    available: true,
    amenities: ['Wi-Fi', 'Study Desk', 'Wardrobe', 'Attached Bathroom', 'Air Conditioning'],
    image: 'https://zicurqqjsjfmrcbmltkm.supabase.co/storage/v1/object/public/website-images//young-friends-hostel%20-%20Copy.jpg'
  },
  {
    name: 'Standard Double Room',
    hostel_name: 'Sunrise Hostel',
    description: 'A spacious room designed for two students with separate beds and study areas.',
    price: 16000,
    capacity: 2,
    room_type: 'Double',
    floor: '1st Floor',
    available: true,
    amenities: ['Wi-Fi', 'Study Desks', 'Wardrobes', 'Shared Bathroom', 'Ceiling Fan'],
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf'
  },
  {
    name: 'Premium Room',
    hostel_name: 'Aggreves Hostel',
    description: 'Premium accommodation with enhanced amenities and comfort.',
    price: 16000,
    capacity: 1,
    room_type: 'Premium',
    floor: '3rd Floor',
    available: true,
    amenities: ['Wi-Fi', 'Private Bathroom', 'Study Area', 'Air Conditioning'],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5'
  },
  {
    name: 'Standard Room',
    hostel_name: 'Tana Hostel',
    description: 'Comfortable standard room with essential amenities.',
    price: 16000,
    capacity: 2,
    room_type: 'Standard',
    floor: '2nd Floor',
    available: true,
    amenities: ['Wi-Fi', 'Shared Bathroom', 'Study Desk'],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f'
  },
  {
    name: 'Deluxe Room',
    hostel_name: 'Mboya Hostel',
    description: 'Spacious deluxe room with premium furnishings.',
    price: 16000,
    capacity: 1,
    room_type: 'Deluxe',
    floor: '4th Floor',
    available: true,
    amenities: ['Wi-Fi', 'Private Bathroom', 'Air Conditioning', 'Mini Fridge'],
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c'
  },
  {
    name: 'Standard Room',
    hostel_name: 'Amugistsi Hostel',
    description: 'Well-maintained standard room with basic amenities.',
    price: 16000,
    capacity: 2,
    room_type: 'Standard',
    floor: '1st Floor',
    available: true,
    amenities: ['Wi-Fi', 'Shared Bathroom', 'Study Area'],
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf'
  },
  {
    name: 'Single Room',
    hostel_name: 'Riverside Hostel',
    description: 'Cozy single room with scenic views.',
    price: 16000,
    capacity: 1,
    room_type: 'Single',
    floor: '3rd Floor',
    available: true,
    amenities: ['Wi-Fi', 'Study Desk', 'Shared Bathroom'],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f'
  },
  {
    name: 'Double Room',
    hostel_name: 'Greenview Hostel',
    description: 'Spacious double room with garden view.',
    price: 16000,
    capacity: 2,
    room_type: 'Double',
    floor: '2nd Floor',
    available: true,
    amenities: ['Wi-Fi', 'Study Area', 'Shared Kitchen'],
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf'
  },
  {
    name: 'Premium Suite',
    hostel_name: 'Parklands Hostel',
    description: 'Luxury suite with modern amenities.',
    price: 16000,
    capacity: 1,
    room_type: 'Premium',
    floor: '4th Floor',
    available: true,
    amenities: ['Wi-Fi', 'Private Bathroom', 'Air Conditioning', 'Study Room'],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5'
  },
  {
    name: 'Standard Room',
    hostel_name: 'Hillside Hostel',
    description: 'Comfortable room with hill views.',
    price: 16000,
    capacity: 2,
    room_type: 'Standard',
    floor: '1st Floor',
    available: true,
    amenities: ['Wi-Fi', 'Shared Facilities', 'Study Desk'],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f'
  },
  {
    name: 'Single Room',
    hostel_name: 'Sunshine Hostel',
    description: 'Bright and airy single room.',
    price: 16000,
    capacity: 1,
    room_type: 'Single',
    floor: '2nd Floor',
    available: true,
    amenities: ['Wi-Fi', 'Study Area', 'Shared Bathroom'],
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c'
  },
  {
    name: 'Double Room',
    hostel_name: 'Lakeside Hostel',
    description: 'Spacious room with lake view.',
    price: 16000,
    capacity: 2,
    room_type: 'Double',
    floor: '3rd Floor',
    available: true,
    amenities: ['Wi-Fi', 'Study Desks', 'Shared Kitchen'],
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf'
  },
  {
    name: 'Premium Room',
    hostel_name: 'Central Hostel',
    description: 'Centrally located premium room.',
    price: 16000,
    capacity: 1,
    room_type: 'Premium',
    floor: '4th Floor',
    available: true,
    amenities: ['Wi-Fi', 'Private Bathroom', 'Air Conditioning'],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5'
  },
  {
    name: 'Standard Room',
    hostel_name: 'Campus View Hostel',
    description: 'Room with campus view.',
    price: 16000,
    capacity: 2,
    room_type: 'Standard',
    floor: '2nd Floor',
    available: true,
    amenities: ['Wi-Fi', 'Shared Bathroom', 'Study Area'],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f'
  },
  {
    name: 'Single Room',
    hostel_name: 'Gateway Hostel',
    description: 'Convenient single room near campus entrance.',
    price: 16000,
    capacity: 1,
    room_type: 'Single',
    floor: '1st Floor',
    available: true,
    amenities: ['Wi-Fi', 'Study Desk', 'Shared Facilities'],
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c'
  },
  {
    name: 'Double Room',
    hostel_name: 'Skyline Hostel',
    description: 'Room with city skyline view.',
    price: 16000,
    capacity: 2,
    room_type: 'Double',
    floor: '4th Floor',
    available: true,
    amenities: ['Wi-Fi', 'Study Areas', 'Shared Kitchen'],
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf'
  },
  {
    name: 'Premium Suite',
    hostel_name: 'Royal Hostel',
    description: 'Luxury suite with premium amenities.',
    price: 16000,
    capacity: 1,
    room_type: 'Premium',
    floor: '3rd Floor',
    available: true,
    amenities: ['Wi-Fi', 'Private Bathroom', 'Air Conditioning', 'Mini Fridge'],
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5'
  },
  {
    name: 'Standard Room',
    hostel_name: 'Garden Hostel',
    description: 'Room overlooking garden area.',
    price: 16000,
    capacity: 2,
    room_type: 'Standard',
    floor: '2nd Floor',
    available: true,
    amenities: ['Wi-Fi', 'Shared Bathroom', 'Study Desk'],
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f'
  },
  {
    name: 'Single Room',
    hostel_name: 'Harmony Hostel',
    description: 'Peaceful single room in quiet area.',
    price: 16000,
    capacity: 1,
    room_type: 'Single',
    floor: '1st Floor',
    available: true,
    amenities: ['Wi-Fi', 'Study Area', 'Shared Facilities'],
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c'
  },
  {
    name: 'Double Room',
    hostel_name: 'Unity Hostel',
    description: 'Spacious double room with modern furnishings.',
    price: 16000,
    capacity: 2,
    room_type: 'Double',
    floor: '3rd Floor',
    available: true,
    amenities: ['Wi-Fi', 'Study Desks', 'Shared Kitchen'],
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf'
  }
];

const seedRooms = async () => {
  try {
    console.log('Starting to seed rooms...');
    console.log(`Attempting to seed ${rooms.length} rooms`);
    
    const { data, error } = await supabase
      .from('rooms')
      .upsert(rooms)
      .select();

    if (error) {
      console.error('Error seeding rooms:', error);
      return;
    }

    console.log(`Successfully seeded ${data.length} rooms`);
  } catch (error) {
    console.error('Error in seed operation:', error);
  }
};

seedRooms();

