# TruEstate Sales Management - Frontend

Next.js 15 frontend for the Retail Sales Management System.

## Setup

```bash
# Install dependencies
npm install

# Create .env.local file (optional, defaults to localhost:8000)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Search**: Case-insensitive search by customer name or phone number
- **Filters**: Multi-select filters for region, gender, age, category, tags, payment, date
- **Sorting**: Sort by date, quantity, or customer name
- **Pagination**: 10 items per page with navigation controls

## Tech Stack

- **Next.js 15** - App Router with React Server Components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **TanStack Query** - Data fetching with caching
- **Zustand** - Lightweight state management
