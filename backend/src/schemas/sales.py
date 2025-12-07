from pydantic import BaseModel, Field, field_validator
from datetime import date
from typing import Optional, List, Union

# Request Schema for Filters
class SalesFilterRequest(BaseModel):
    """
    Request schema for searching, filtering, sorting, and paginating sales.
    All fields are optional to allow flexible querying.
    """
    # Search
    search_query: Optional[str] = None
    
    # Filters (Multi-select)
    customer_regions: Optional[List[str]] = None
    genders: Optional[List[str]] = None
    age_min: Optional[int] = Field(None, ge=0, le=150)
    age_max: Optional[int] = Field(None, ge=0, le=150)
    product_categories: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    payment_methods: Optional[List[str]] = None
    date_start: Optional[Union[date, str]] = None
    date_end: Optional[Union[date, str]] = None
    
    # Sorting
    sort_by: str = Field("date", pattern="^(date|quantity|customer_name)$")
    sort_order: str = Field("desc", pattern="^(asc|desc)$")
    
    # Pagination
    page: int = Field(1, ge=1)
    page_size: int = Field(10, ge=1, le=100)
    
    @field_validator('date_start', 'date_end', mode='before')
    @classmethod
    def parse_date(cls, v):
        if v is None or v == '':
            return None
        if isinstance(v, date):
            return v
        if isinstance(v, str):
            try:
                return date.fromisoformat(v)
            except ValueError:
                return None
        return None
    
    @field_validator('age_min', 'age_max', mode='before')
    @classmethod
    def parse_age(cls, v):
        if v is None or v == '':
            return None
        if isinstance(v, int):
            return v
        if isinstance(v, str):
            try:
                return int(v)
            except ValueError:
                return None
        return None


# Response Schema for Single Transaction
class SalesTransactionResponse(BaseModel):
    """Response schema for a single sales transaction."""
    id: int
    customer_id: str
    customer_name: str
    phone_number: str
    gender: str
    age: int
    customer_region: str
    customer_type: str
    product_id: str
    product_name: str
    brand: str
    product_category: str
    tags: List[str]
    quantity: int
    price_per_unit: float
    discount_percentage: float
    total_amount: float
    final_amount: float
    date: date
    payment_method: str
    order_status: str
    delivery_type: str
    store_id: str
    store_location: str
    salesperson_id: str
    employee_name: str
    
    class Config:
        from_attributes = True


# Paginated Response
class PaginatedSalesResponse(BaseModel):
    """Paginated response with metadata for frontend pagination controls."""
    data: List[SalesTransactionResponse]
    total_count: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool


# Filter Options Response
class FilterOptionsResponse(BaseModel):
    """Available options for filter dropdowns."""
    customer_regions: List[str]
    genders: List[str]
    product_categories: List[str]
    payment_methods: List[str]
    tags: List[str]
