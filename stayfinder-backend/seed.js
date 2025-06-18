// Script to seed mock data into the database
const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/stayfinder';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Remove existing listings
  await Listing.deleteMany({});

  // Create a mock user (host)
  let host = await User.findOne();
  if (!host) {
    host = await User.create({
      name: 'Demo Host',
      email: 'host@example.com',
      password: 'password123',
      avatar: '',
      rating: 4.8,
    });
  }

  // Mock listings data
  const listings = [
    {
      title: 'Modern Apartment in City Center',
      description: 'A beautiful apartment in the heart of the city, close to all attractions.',
      price: 120,
      location: 'New Delhi',
      type: 'Apartment',
      bedrooms: 2,
      beds: 2,
      bathrooms: 2,
      guests: 4,
      cleaningFee: 15,
      serviceFee: 10,
      images: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd',
      ],
      rating: 4.7,
      amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'Washer'],
      availableDates: '2025-07-01,2025-07-10',
      coordinates: { lat: 28.6139, lng: 77.209 },
      host: host._id,
      reviews: [],
    },
    {
      title: 'Cozy Mountain Cabin',
      description: 'Escape to the mountains in this cozy and rustic cabin.',
      price: 90,
      location: 'Manali',
      type: 'Cabin',
      bedrooms: 1,
      beds: 2,
      bathrooms: 1,
      guests: 3,
      cleaningFee: 10,
      serviceFee: 8,
      images: [
        'https://images.unsplash.com/photo-1464983953574-0892a716854b',
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
      ],
      rating: 4.9,
      amenities: ['Fireplace', 'Parking', 'Mountain View'],
      availableDates: '2025-07-15,2025-07-25',
      coordinates: { lat: 32.2396, lng: 77.1887 },
      host: host._id,
      reviews: [],
    },
    {
      title: 'Beachside Villa with Pool',
      description: 'Luxury villa right on the beach with a private pool and garden.',
      price: 250,
      location: 'Goa',
      type: 'Villa',
      bedrooms: 3,
      beds: 4,
      bathrooms: 3,
      guests: 6,
      cleaningFee: 30,
      serviceFee: 20,
      images: [
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
        'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
      ],
      rating: 4.95,
      amenities: ['Pool', 'Beach Access', 'Breakfast', 'WiFi'],
      availableDates: '2025-08-01,2025-08-15',
      coordinates: { lat: 15.2993, lng: 74.124 },
      host: host._id,
      reviews: [],
    },
  ];

  await Listing.insertMany(listings);

  console.log('Database seeded with mock listings!');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding error:', err);
  mongoose.disconnect();
});
