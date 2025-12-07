from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qs, urlencode
import os

# Load environment variables from .env file
load_dotenv()

def clean_database_url(url: str) -> str:
    """Remove unsupported connection options like pgbouncer from URL"""
    if not url or url.startswith("sqlite"):
        return url
    
    parsed = urlparse(url)
    
    # Remove unsupported query params (pgbouncer, options, etc.)
    if parsed.query:
        query_params = parse_qs(parsed.query)
        # Remove params that psycopg2 doesn't support
        unsupported = ['pgbouncer', 'options', 'sslmode']
        for param in unsupported:
            query_params.pop(param, None)
        
        # Rebuild URL without unsupported params
        new_query = urlencode(query_params, doseq=True) if query_params else ""
        url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
        if new_query:
            url += f"?{new_query}"
    
    return url

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required. Set it in .env file or environment.")

# Clean the URL to remove unsupported options
DATABASE_URL = clean_database_url(DATABASE_URL)

# Create engine based on database type
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL settings
    engine = create_engine(
        DATABASE_URL,
        pool_size=3,
        max_overflow=5,
        pool_pre_ping=True,
        pool_recycle=300,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency for database sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables"""
    try:
        from models.sales import SalesTransaction
        # Only create tables for SQLite
        if os.getenv("DATABASE_URL", "").startswith("sqlite"):
            Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Database init: {e}")
