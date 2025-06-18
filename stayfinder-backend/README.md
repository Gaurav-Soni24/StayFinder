# StayFinder Backend

A complete backend server for the StayFinder application built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: JWT-based authentication system
- **User Management**: User profiles, wishlist, and trip management
- **Listings**: CRUD operations for property listings
- **Reviews**: Review and rating system
- **Notifications**: User notification system
- **Search**: Search and filter listings

## Setup

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables**
   Copy `.env.example` to `.env` and update the values:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. **Start MongoDB**
   Make sure MongoDB is running on your system.

4. **Run the Server**
   \`\`\`bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/wishlist` - Get user wishlist
- `POST /api/user/wishlist` - Add to wishlist
- `DELETE /api/user/wishlist/:listingId` - Remove from wishlist

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `GET /api/listings/user` - Get user's listings
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/:listingId` - Get reviews for listing

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/read` - Mark notifications as read

## Data Models

The application uses the following MongoDB collections:
- **Users**: User accounts and profiles
- **Listings**: Property listings
- **Reviews**: User reviews and ratings
- **Notifications**: User notifications

## Authentication

All protected routes require a JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## Error Handling

The API returns appropriate HTTP status codes and error messages in JSON format.

## Development

The server includes:
- Input validation using express-validator
- Password hashing with bcryptjs
- JWT token authentication
- CORS support
- Error handling middleware
