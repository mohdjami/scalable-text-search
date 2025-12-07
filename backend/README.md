# TruEstate Sales Management - Backend

FastAPI backend for the Retail Sales Management System.

## Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Load data (place your CSV in the backend folder first)
cd src
python utils/load_data.py ../sales_data.csv

# Run server
uvicorn main:app --reload --port 8000
```

## API Endpoints

- `POST /api/sales/search` - Search, filter, sort, and paginate sales
- `GET /api/sales/filter-options` - Get available filter dropdown options
- `GET /docs` - Interactive API documentation
- `GET /health` - Health check

## Tech Stack

- **FastAPI** - Modern async web framework
- **SQLAlchemy 2.0** - ORM with type hints
- **Pydantic V2** - Data validation
- **SQLite** - Lightweight database
