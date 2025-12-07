from sqlalchemy import Column, Integer, String, Float, Date, Index
from database import Base
from datetime import date

class SalesTransaction(Base):
    """
    Main model representing a sales transaction.
    Contains all 24 fields from the dataset with strategic indexing.
    """
    __tablename__ = "sales_transactions"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Customer Fields
    customer_id = Column(String(50), index=True)
    customer_name = Column(String(200), index=True)  # Indexed for search
    phone_number = Column(String(20), index=True)    # Indexed for search
    gender = Column(String(20), index=True)          # Indexed for filter
    age = Column(Integer, index=True)                # Indexed for filter
    customer_region = Column(String(100), index=True) # Indexed for filter
    customer_type = Column(String(50))
    
    # Product Fields
    product_id = Column(String(50))
    product_name = Column(String(200))
    brand = Column(String(100))
    product_category = Column(String(100), index=True)  # Indexed for filter
    tags = Column(String(500))  # Comma-separated
    
    # Sales Fields
    quantity = Column(Integer, index=True)  # Indexed for sorting
    price_per_unit = Column(Float)
    discount_percentage = Column(Float)
    total_amount = Column(Float)
    final_amount = Column(Float)
    
    # Operational Fields
    transaction_date = Column(Date, index=True)  # Indexed for sorting and filter
    payment_method = Column(String(50), index=True)  # Indexed for filter
    order_status = Column(String(50))
    delivery_type = Column(String(50))
    store_id = Column(String(50))
    store_location = Column(String(200))
    salesperson_id = Column(String(50))
    employee_name = Column(String(200))
    
    # Composite index for common query patterns
    __table_args__ = (
        Index('idx_search', 'customer_name', 'phone_number'),
        Index('idx_filter_combo', 'customer_region', 'gender', 'product_category'),
    )
