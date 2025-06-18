# StayFinder

StayFinder is a full-stack property rental platform inspired by Airbnb. It features a modern, responsive frontend built with Next.js and Tailwind CSS, and a robust backend powered by Node.js, Express, and MongoDB. The project supports browsing and managing property listings, user authentication, reviews, notifications, and more.

---

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
  - [Backend](#backend-setup)
  - [Frontend](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [License](#license)

---

## Tech Stack

### Frontend
- **Framework:** Next.js (React, App Router)
- **Styling:** Tailwind CSS
- **Forms & Validation:** React Hook Form, Zod
- **Notifications:** React Hot Toast
- **Date Handling:** date-fns
- **Icons:** Lucide React
- **Other:** Radix UI, Axios, Mapbox GL, Leaflet, Recharts, TypeScript

### Backend
- **Framework:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (jsonwebtoken), bcryptjs
- **Validation:** express-validator
- **Other:** dotenv, serverless-http, CORS

---

## Features

- User authentication (JWT-based)
- Browse, search, and filter property listings
- View detailed property information
- Host dashboard for managing listings
- CRUD operations for listings
- Reviews and ratings system
- User profiles, wishlist, and trip management
- Notifications system
- Responsive design for all devices
- Error handling and input validation

---

## Project Structure

```
/stayfinder-frontend    # Next.js frontend
/stayfinder-backend     # Express backend
```

**Frontend Highlights:**
- `app/`: Main pages (homepage, login, register, listing details, dashboard)
- `components/`: Reusable UI components
- `lib/`: Utility functions and API clients
- `hooks/`: Custom React hooks
- `types/`: TypeScript type definitions
- `public/`: Static assets

**Backend Highlights:**
- `models/`: Mongoose models for Users, Listings, Reviews, Notifications
- `routes/`: Express route handlers (auth, user, listings, reviews, notifications)
- `middleware/`: Custom middleware (auth, error handling)
- `api/`: API entry points

---

## Setup & Installation

### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd stayfinder-backend
   ```
2. **Copy environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start MongoDB** (locally or via cloud provider)
5. **Run the server:**
   - Development: `npm run dev`
   - Production: `npm start`
6. **API runs at:** `http://localhost:5000` (or as set in `.env`)

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd stayfinder-frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
yarn install
   ```
3. **Create `.env.local` in root:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
4. **Run the frontend:**
   ```bash
   npm run dev
   # or
yarn dev
   ```
5. **Visit:** [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

### Backend (`.env`)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: JWT secret key
- (See `.env.example` for all options)

### Frontend (`.env.local`)
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:5000`)

---

## Usage

- Register as a new user or log in
- Browse and search property listings
- View property details and reviews
- If logged in as a host, manage your own listings
- Add reviews, manage wishlist, and receive notifications

---

## How It Works

- The **frontend** communicates with the **backend** via REST APIs for authentication, listings, reviews, and user actions.
- The **backend** manages data with MongoDB, handles authentication, validation, and business logic.
- All sensitive routes require JWT in the `Authorization` header: `Bearer <token>`

---

## License

This project is licensed under the MIT License.
