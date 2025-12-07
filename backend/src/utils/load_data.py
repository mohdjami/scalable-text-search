"""
Data loading utility for importing CSV sales data into the database.

Usage:
    python load_data.py path/to/sales_data.csv

This script:
1. Initializes the database tables
2. Reads the CSV file with pandas
3. Cleans and transforms the data
4. Batch inserts records for efficiency
"""

import pandas as pd
from sqlalchemy.orm import Session
from datetime import datetime
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.sales import SalesTransaction
from database import SessionLocal, init_db, engine, Base


def parse_date(date_val):
    """Parse date from various formats"""
    if pd.isna(date_val):
        return None
    
    if isinstance(date_val, str):
        # Try common formats
        for fmt in ['%Y-%m-%d', '%d-%m-%Y', '%m/%d/%Y', '%d/%m/%Y']:
            try:
                return datetime.strptime(date_val, fmt).date()
            except ValueError:
                continue
    
    try:
        return pd.to_datetime(date_val).date()
    except:
        return None


def load_csv_data(csv_path: str):
    """
    Load sales data from CSV file into database.
    
    Args:
        csv_path: Path to the CSV file
    """
    print(f"Loading data from: {csv_path}")
    
    # Initialize database
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")
    
    # Read CSV
    df = pd.read_csv(csv_path)
    print(f"Read {len(df)} rows from CSV")
    
    # Display columns for debugging
    print(f"Columns found: {list(df.columns)}")
    
    # Create column mapping (handle variations in column names)
    column_map = {}
    for col in df.columns:
        col_lower = col.lower().strip().replace(' ', '_')
        column_map[col] = col_lower
    
    df.columns = [column_map[c] for c in df.columns]
    print(f"Normalized columns: {list(df.columns)}")
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Clear existing data (optional, comment out if you want to append)
        db.query(SalesTransaction).delete()
        db.commit()
        print("Cleared existing data.")
        
        # Process and insert records
        transactions = []
        errors = 0
        
        for idx, row in df.iterrows():
            try:
                # Handle date parsing
                date_val = parse_date(row.get('date'))
                
                transaction = SalesTransaction(
                    customer_id=str(row.get('customer_id', '')),
                    customer_name=str(row.get('customer_name', '')),
                    phone_number=str(row.get('phone_number', '')),
                    gender=str(row.get('gender', '')),
                    age=int(row.get('age', 0)) if pd.notna(row.get('age')) else 0,
                    customer_region=str(row.get('customer_region', '')),
                    customer_type=str(row.get('customer_type', '')),
                    product_id=str(row.get('product_id', '')),
                    product_name=str(row.get('product_name', '')),
                    brand=str(row.get('brand', '')),
                    product_category=str(row.get('product_category', '')),
                    tags=str(row.get('tags', '')),
                    quantity=int(row.get('quantity', 0)) if pd.notna(row.get('quantity')) else 0,
                    price_per_unit=float(row.get('price_per_unit', 0)) if pd.notna(row.get('price_per_unit')) else 0.0,
                    discount_percentage=float(row.get('discount_percentage', 0)) if pd.notna(row.get('discount_percentage')) else 0.0,
                    total_amount=float(row.get('total_amount', 0)) if pd.notna(row.get('total_amount')) else 0.0,
                    final_amount=float(row.get('final_amount', 0)) if pd.notna(row.get('final_amount')) else 0.0,
                    transaction_date=date_val,
                    payment_method=str(row.get('payment_method', '')),
                    order_status=str(row.get('order_status', '')),
                    delivery_type=str(row.get('delivery_type', '')),
                    store_id=str(row.get('store_id', '')),
                    store_location=str(row.get('store_location', '')),
                    salesperson_id=str(row.get('salesperson_id', '')),
                    employee_name=str(row.get('employee_name', ''))
                )
                transactions.append(transaction)
                
                # Batch commit every 1000 records
                if len(transactions) >= 1000:
                    db.bulk_save_objects(transactions)
                    db.commit()
                    print(f"Inserted {idx + 1} records...")
                    transactions = []
                    
            except Exception as e:
                errors += 1
                if errors <= 5:
                    print(f"Error on row {idx}: {e}")
        
        # Commit remaining records
        if transactions:
            db.bulk_save_objects(transactions)
            db.commit()
        
        final_count = db.query(SalesTransaction).count()
        print(f"\n✅ Successfully loaded {final_count} records")
        if errors > 0:
            print(f"⚠️  Skipped {errors} rows due to errors")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error loading data: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python load_data.py <path_to_csv>")
        print("Example: python load_data.py ../sales_data.csv")
        sys.exit(1)
    
    csv_path = sys.argv[1]
    if not os.path.exists(csv_path):
        print(f"❌ File not found: {csv_path}")
        sys.exit(1)
    
    load_csv_data(csv_path)
