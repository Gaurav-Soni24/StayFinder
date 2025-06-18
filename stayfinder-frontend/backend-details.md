# StayFinder Backend Architecture & API Documentation

## Overview
This document describes the backend architecture required to power the StayFinder application. The backend is designed to be simple, robust, and scalable, using **Node.js/Express** (recommended), with **MongoDB** as the database. All image/file storage is handled via image URLs (no file uploads). Authentication is JWT-based.

---

## Data Models (MongoDB Collections)

### User
```json
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "passwordHash": String,
  "avatar": String, // Image URL
  "phone": String,
  "birthdate": String,
  "location": String,
  "rating": Number,
  "reviewCount": Number,
  "joinDate": String,
  "wishlist": [ObjectId], // Listing IDs
  "trips": [
    {
      "_id": ObjectId,
      "listingId": ObjectId,
      "location": String,
      "dates": String,
      "image": String, // Image URL
      "status": String
    }
  ]
}
```

### Listing
```json
{
  "_id": ObjectId,
  "title": String,
  "description": String,
  "price": Number,
  "location": String,
  "type": String, // e.g., "Entire place"
  "bedrooms": Number,
  "beds": Number,
  "bathrooms": Number,
  "guests": Number,
  "cleaningFee": Number,
  "serviceFee": Number,
  "images": [String], // Array of image URLs
  "rating": Number,
  "amenities": [String],
  "availableDates": String,
  "coordinates": { "lat": Number, "lng": Number },
  "host": ObjectId, // User ID
  "reviews": [ObjectId] // Review IDs
}
```

### Review
```json
{
  "_id": ObjectId,
  "listingId": ObjectId,
  "userId": ObjectId,
  "user": {
    "name": String,
    "avatar": String // Image URL
  },
  "rating": Number,
  "date": String,
  "comment": String
}
```

### Notification
```json
{
  "_id": ObjectId,
  "userId": ObjectId,
  "type": "message" | "booking" | "review" | "system",
  "title": String,
  "description": String,
  "date": String,
  "read": Boolean,
  "image": String // (optional, image URL)
}
```

---

## Authentication
- JWT-based authentication.
- Register/Login returns a JWT token.
- All protected routes require `Authorization: Bearer <token>` header.

### Endpoints

#### POST /api/auth/register
- **Request:** `{ name, email, password }`
- **Response:** `{ token, user }`

#### POST /api/auth/login
- **Request:** `{ email, password }`
- **Response:** `{ token, user }`

#### POST /api/auth/logout
- **Request:** _none_
- **Response:** `{ message: "Logged out" }`

---

## User Endpoints

#### GET /api/user/profile
- **Auth required**
- **Response:**
```json
{
  "_id": "...",
  "name": "...",
  "email": "...",
  "avatar": "...",
  "phone": "...",
  "birthdate": "...",
  "location": "...",
  "rating": 4.8,
  "reviewCount": 12,
  "joinDate": "...",
  "trips": [ ... ],
  "wishlist": [ ... ]
}
```

#### PUT /api/user/profile
- **Auth required**
- **Request:** `{ name, phone, birthdate, avatar, location }`
- **Response:** `{ message: "Profile updated", user }`

---

## Listings Endpoints

#### GET /api/listings
- **Query params:** `?search=...&location=...&type=...`
- **Response:** `[ Listing, ... ]`

#### GET /api/listings/:id
- **Response:** `Listing`

#### GET /api/listings/user
- **Auth required**
- **Response:** `[ Listing, ... ]` (listings created by the logged-in user)

#### POST /api/listings
- **Auth required**
- **Request:**
```json
{
  "title": "...",
  "description": "...",
  "price": 120,
  "location": "...",
  "type": "...",
  "bedrooms": 1,
  "beds": 1,
  "bathrooms": 1,
  "guests": 2,
  "cleaningFee": 50,
  "serviceFee": 30,
  "images": ["https://..."],
  "amenities": ["Wifi", "Kitchen"],
  "availableDates": "...",
  "coordinates": { "lat": 0, "lng": 0 }
}
```
- **Response:** `Listing`

#### PUT /api/listings/:id
- **Auth required, only host can update**
- **Request:** Partial fields to update (same as above)
- **Response:** `Listing`

#### DELETE /api/listings/:id
- **Auth required, only host can delete**
- **Response:** `{ message: "Listing deleted" }`

---

## Reviews Endpoints

#### POST /api/reviews
- **Auth required**
- **Request:** `{ listingId, rating, comment }`
- **Response:** `Review`

#### GET /api/reviews/:listingId
- **Response:** `[ Review, ... ]`

---

## Favorites / Wishlist Endpoints

#### GET /api/user/wishlist
- **Auth required**
- **Response:** `[ Listing, ... ]`

#### POST /api/user/wishlist
- **Auth required**
- **Request:** `{ listingId }`
- **Response:** `{ message: "Added to wishlist" }`

#### DELETE /api/user/wishlist/:listingId
- **Auth required**
- **Response:** `{ message: "Removed from wishlist" }`

---

## Notifications Endpoints

#### GET /api/notifications
- **Auth required**
- **Response:** `[ Notification, ... ]`

#### POST /api/notifications/read
- **Auth required**
- **Request:** `{ id }` (or empty for all)
- **Response:** `{ message: "Marked as read" }`

---

## Example API Responses

### Listing Example
```json
{
  "_id": "...",
  "title": "Modern Apartment with Ocean View",
  "description": "...",
  "price": 120,
  "location": "Miami Beach, FL",
  "type": "Entire place",
  "bedrooms": 1,
  "beds": 1,
  "bathrooms": 1,
  "guests": 2,
  "cleaningFee": 50,
  "serviceFee": 30,
  "images": ["https://images.unsplash.com/..."],
  "rating": 4.9,
  "amenities": ["Wifi", "Kitchen", "Free parking", "TV", "Pool"],
  "availableDates": "Available from Jun 10",
  "coordinates": { "lat": 25.7617, "lng": -80.1918 },
  "host": {
    "_id": "...",
    "name": "Sarah",
    "avatar": "https://i.pravatar.cc/150?img=1",
    "isSuperhost": true,
    "joinDate": "2018",
    "rating": 4.9
  },
  "reviews": [ /* ... */ ]
}
```

### Review Example
```json
{
  "_id": "...",
  "listingId": "...",
  "userId": "...",
  "user": {
    "name": "Michael",
    "avatar": "https://i.pravatar.cc/150?img=11"
  },
  "rating": 5,
  "date": "April 2023",
  "comment": "Amazing place with a stunning view. The host was very responsive and helpful."
}
```

---

## Notes
- All image fields are URLs. No file uploads are handled by the backend.
- All endpoints are RESTful and return JSON.
- Extend this architecture as needed for features like messaging, bookings, or payments.
- Use Mongoose (or similar ODM) for schema validation and data access.
- Secure all sensitive endpoints with JWT authentication.

---

**This backend architecture is designed to fully support all current StayFinder app features, with MongoDB as the data store and no file storage, only image URLs.**
