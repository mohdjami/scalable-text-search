"""
Data migration script for uploading CSV sales data to Supabase PostgreSQL.

Usage:
    python migrate_to_supabase.py path/to/sales_data.csv

This script:
1. Reads the CSV file with pandas
2. Cleans and transforms the data  
3. Batch inserts records into Supabase PostgreSQL
"""

import pandas as pd
from sqlalchemy import create_engine, text
from datetime import datetime
import sys
import os

# Supabase PostgreSQL connection
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:BWZ4Hw0GQC2faxRB@db.ohxczgfayekbkyurqxdb.supabase.co:5432/postgres"
)


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


def migrate_csv_to_supabase(csv_path: str, batch_size: int = 5000):
    """
    Load sales data from CSV file into Supabase PostgreSQL.
    Uses batch inserts for better performance.
    """
    print(f"Loading data from: {csv_path}")
    print(f"Connecting to Supabase...")
    
    # Create engine
    engine = create_engine(DATABASE_URL)
    
    # Read CSV
    print("Reading CSV file...")
    df = pd.read_csv(csv_path)
    print(f"Read {len(df)} rows from CSV")
    
    # Normalize column names
    df.columns = [col.lower().strip().replace(' ', '_') for col in df.columns]
    print(f"Columns: {list(df.columns)}")
    
    # Start migration
    print(f"\nMigrating {len(df)} records in batches of {batch_size}...")
    
    with engine.connect() as conn:
        # Clear existing data (optional)
        print("Clearing existing data...")
        conn.execute(text("TRUNCATE TABLE sales_transactions RESTART IDENTITY"))
        conn.commit()
        
        # Process in batches
        total_inserted = 0
        for i in range(0, len(df), batch_size):
            batch = df.iloc[i:i+batch_size]
            
            # Prepare batch data
            records = []
            for _, row in batch.iterrows():
                date_val = parse_date(row.get('date'))
                
                record = {
                    'customer_id': str(row.get('customer_id', '')),
                    'customer_name': str(row.get('customer_name', '')),
                    'phone_number': str(row.get('phone_number', '')),
                    'gender': str(row.get('gender', '')),
                    'age': int(row.get('age', 0)) if pd.notna(row.get('age')) else 0,
                    'customer_region': str(row.get('customer_region', '')),
                    'customer_type': str(row.get('customer_type', '')),
                    'product_id': str(row.get('product_id', '')),
                    'product_name': str(row.get('product_name', '')),
                    'brand': str(row.get('brand', '')),
                    'product_category': str(row.get('product_category', '')),
                    'tags': str(row.get('tags', '')),
                    'quantity': int(row.get('quantity', 0)) if pd.notna(row.get('quantity')) else 0,
                    'price_per_unit': float(row.get('price_per_unit', 0)) if pd.notna(row.get('price_per_unit')) else 0.0,
                    'discount_percentage': float(row.get('discount_percentage', 0)) if pd.notna(row.get('discount_percentage')) else 0.0,
                    'total_amount': float(row.get('total_amount', 0)) if pd.notna(row.get('total_amount')) else 0.0,
                    'final_amount': float(row.get('final_amount', 0)) if pd.notna(row.get('final_amount')) else 0.0,
                    'transaction_date': date_val,
                    'payment_method': str(row.get('payment_method', '')),
                    'order_status': str(row.get('order_status', '')),
                    'delivery_type': str(row.get('delivery_type', '')),
                    'store_id': str(row.get('store_id', '')),
                    'store_location': str(row.get('store_location', '')),
                    'salesperson_id': str(row.get('salesperson_id', '')),
                    'employee_name': str(row.get('employee_name', ''))
                }
                records.append(record)
            
            # Bulk insert using pandas to_sql for efficiency
            batch_df = pd.DataFrame(records)
            batch_df.to_sql('sales_transactions', engine, if_exists='append', index=False, method='multi')
            
            total_inserted += len(records)
            print(f"Inserted {total_inserted:,} / {len(df):,} records...")
        
        conn.commit()
    
    print(f"\n✅ Successfully migrated {total_inserted:,} records to Supabase!")
    print("Full-text search index is automatically applied.")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python migrate_to_supabase.py <path_to_csv>")
        print("Example: python migrate_to_supabase.py ../sales_data.csv")
        sys.exit(1)
    
    csv_path = sys.argv[1]
    if not os.path.exists(csv_path):
        print(f"❌ File not found: {csv_path}")
        sys.exit(1)
    
    migrate_csv_to_supabase(csv_path)
