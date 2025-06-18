# StayFinder - Airbnb-inspired Frontend

StayFinder is a frontend-only project built with Next.js and Tailwind CSS, inspired by Airbnb. This project focuses on creating a clean, modern, and responsive UI for a property rental platform.

## Features

- Browse property listings
- View detailed property information
- Search and filter properties
- User authentication (mock)
- Host dashboard for managing listings
- Responsive design for all devices

## Tech Stack

- Next.js (App Router)
- Tailwind CSS
- React Hook Form + Zod
- React Hot Toast for notifications
- Date-fns for date handling
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/stayfinder-frontend.git
cd stayfinder-frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Create a `.env.local` file in the root directory with the following content:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

\`\`\`
/stayfinder-frontend
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── login/page.tsx      # Login page
│   ├── register/page.tsx   # Registration page
│   ├── listings/[id]/page.tsx # Property detail page
│   └── dashboard/page.tsx  # Host dashboard
├── components/             # Reusable UI components
├── lib/                    # Utility functions and API clients
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
\`\`\`

## Mock Data

Since this is a frontend-only project, all data is mocked. The mock data is located in the `lib` directory and simulates API responses.

## Authentication

Authentication is simulated using localStorage. When a user logs in or registers, `isLoggedIn` is set to `true` in localStorage.

## License

This project is licensed under the MIT License.
