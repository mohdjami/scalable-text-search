from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Database configuration
# For deployment: Set DATABASE_URL environment variable to your Supabase PostgreSQL connection string
# For local dev: Uses SQLite if DATABASE_URL is not set

# Supabase PostgreSQL (default for deployment)

# Get DATABASE_URL from environment or use Supabase as default
DATABASE_URL = os.getenv("DATABASE_URL")

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
        pool_size=5,
        max_overflow=10,
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
    from models.sales import SalesTransaction
    Base.metadata.create_all(bind=engine)
