# TruEstate Sales Management System - Architecture

## Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FastAPI Application                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Routes     │ → │  Controllers  │ → │   Services    │  │
│  │  (API URLs)  │    │  (Handlers)   │    │  (Logic)      │  │
│  └──────────────┘    └──────────────┘    └──────┬───────┘  │
│                                                  │           │
│                                          ┌──────▼───────┐   │
│                                          │    Models     │   │
│                                          │  (SQLAlchemy) │   │
│                                          └──────┬───────┘   │
│                                                  │           │
│                                          ┌──────▼───────┐   │
│                                          │    SQLite     │   │
│                                          │   Database    │   │
│                                          └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Directory | Responsibility |
|-------|-----------|----------------|
| **Routes** | `routes/` | URL path definitions |
| **Controllers** | `controllers/` | Request handling, response formatting |
| **Services** | `services/` | Business logic, database queries |
| **Models** | `models/` | SQLAlchemy ORM definitions |
| **Schemas** | `schemas/` | Pydantic validation models |
| **Utils** | `utils/` | Helper functions, data loading |

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/sales/search` | POST | Search, filter, sort, paginate sales |
| `/api/sales/filter-options` | GET | Get available filter dropdown options |
| `/health` | GET | Health check |

---

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 Application                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │    Pages     │ → │  Components   │ → │    Hooks      │  │
│  │  (app/)      │    │  (UI)         │    │  (Data)       │  │
│  └──────────────┘    └──────────────┘    └──────┬───────┘  │
│                                                  │           │
│                      ┌──────────────┐    ┌──────▼───────┐   │
│                      │   Stores     │ ←  │   Services    │   │
│                      │  (Zustand)   │     │  (API Client) │   │
│                      └──────────────┘    └──────┬───────┘   │
│                                                  │           │
│                                          ┌──────▼───────┐   │
│                                          │   FastAPI     │   │
│                                          │   Backend     │   │
│                                          └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | File | Purpose |
|-----------|------|---------|
| **SearchBar** | `SearchBar.tsx` | Debounced search input |
| **FilterPanel** | `FilterPanel.tsx` | Multi-select filter controls |
| **SortingDropdown** | `SortingDropdown.tsx` | Sort options selector |
| **TransactionTable** | `TransactionTable.tsx` | Data display table |
| **PaginationControls** | `PaginationControls.tsx` | Page navigation |

---

## Data Flow

```
User Action → Component → Zustand Store → React Query → API Service → Backend
    ↑                                                                    │
    └──────────────────────←  Response Data  ←──────────────────────────┘
```

1. User interacts with UI (search, filter, sort, paginate)
2. Component updates Zustand store
3. React Query detects filter change
4. API service sends request to backend
5. Backend queries database with filters
6. Response flows back, UI updates

---

## Folder Structure

```
truestate/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API handlers
│   │   │   └── sales_controller.py
│   │   ├── services/        # Business logic
│   │   │   └── sales_service.py
│   │   ├── models/          # Database models
│   │   │   └── sales.py
│   │   ├── schemas/         # Pydantic schemas
│   │   │   └── sales.py
│   │   ├── utils/           # Helpers
│   │   │   └── load_data.py
│   │   ├── database.py      # DB configuration
│   │   └── main.py          # App entry point
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API client
│   │   ├── stores/          # Zustand state
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Helpers
│   └── package.json
│
├── docs/
│   └── architecture.md      # This file
│
└── README.md
```

---

## Key Design Decisions

### Backend
- **SQLite**: Simple setup, portable, sufficient for this use case
- **Pydantic V2**: Fast validation, JSON schema support
- **Service Layer**: Separates business logic from route handlers
- **Indexed Columns**: Search (name, phone), filters, sorting fields indexed

### Frontend
- **Zustand**: Minimal boilerplate vs Redux, good TypeScript support
- **React Query**: Automatic caching, refetch on filter change
- **Debounced Search**: 300ms delay prevents excessive API calls
- **Server Components**: Reduced client bundle, better SEO
