# TruEstate - Retail Sales Management System

A production-grade retail sales management system with advanced search, filtering, sorting, and pagination. Built with Next.js 15 and FastAPI following clean architecture principles.

## Overview

This application provides a comprehensive interface for managing retail sales data with powerful query capabilities. Users can search by customer name or phone, apply multi-select filters across 7 dimensions, sort results, and navigate through paginated results while maintaining state across all operations.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, TanStack Query, Zustand |
| Backend | FastAPI, Python 3.11+, SQLAlchemy, Pydantic |
| Database | SQLite |

## Search Implementation

- **Fields**: Customer Name, Phone Number
- **Type**: Case-insensitive full-text search using SQL LIKE
- **Performance**: Database indexes on searchable columns
- **UX**: 300ms debounce to prevent excessive API calls

## Filter Implementation

Multi-select filters with AND logic:

| Filter | Type |
|--------|------|
| Customer Region | Multi-select dropdown |
| Gender | Checkbox group |
| Age Range | Min/Max number inputs |
| Product Category | Multi-select dropdown |
| Tags | Multi-select chips |
| Payment Method | Checkbox group |
| Date Range | Date pickers |

All filters work independently and in combination. Changing any filter resets to page 1.

## Sorting Implementation

| Option | SQL |
|--------|-----|
| Date (Newest First) | `ORDER BY date DESC` |
| Date (Oldest First) | `ORDER BY date ASC` |
| Quantity (High to Low) | `ORDER BY quantity DESC` |
| Quantity (Low to High) | `ORDER BY quantity ASC` |
| Customer Name (A-Z) | `ORDER BY customer_name ASC` |
| Customer Name (Z-A) | `ORDER BY customer_name DESC` |

Sorting preserves active search and filter states.

## Pagination Implementation

- **Page Size**: Fixed at 10 items per page
- **Navigation**: Previous/Next buttons with page numbers
- **State Preservation**: Search, filters, and sort maintained across page changes
- **Metadata**: Shows "Showing X to Y of Z results"

## Setup Instructions

### Prerequisites
- Python 3.11+ with pip
- Node.js 18+ with npm

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Load data into database
cd src
python utils/load_data.py path/to/sales_data.csv

# Run server
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── backend/          # FastAPI application
│   ├── src/
│   │   ├── controllers/  # API route handlers
│   │   ├── services/     # Business logic
│   │   ├── models/       # SQLAlchemy models
│   │   └── schemas/      # Pydantic schemas
│   └── requirements.txt
│
├── frontend/         # Next.js application
│   └── src/
│       ├── components/   # React components
│       ├── hooks/        # Custom hooks
│       └── stores/       # Zustand state
│
└── docs/
    └── architecture.md   # Detailed architecture docs
```
