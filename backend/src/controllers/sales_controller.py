from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from services.sales_service import SalesService
from schemas.sales import SalesFilterRequest, PaginatedSalesResponse, FilterOptionsResponse
from database import get_db

router = APIRouter(prefix="/api/sales", tags=["Sales"])

@router.post("/search", response_model=PaginatedSalesResponse)
async def search_sales(
    filters: SalesFilterRequest,
    db: Session = Depends(get_db)
):
    """
    Main endpoint for searching, filtering, sorting, and paginating sales.
    
    - **search_query**: Case-insensitive search on customer_name and phone_number
    - **customer_regions, genders, etc.**: Multi-select filters (AND logic)
    - **sort_by**: date, quantity, or customer_name
    - **sort_order**: asc or desc
    - **page, page_size**: Pagination controls
    """
    try:
        service = SalesService(db)
        return service.get_sales_with_filters(filters)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/filter-options", response_model=FilterOptionsResponse)
async def get_filter_options(db: Session = Depends(get_db)):
    """
    Get all available filter options for dropdowns.
    
    Returns distinct values for:
    - customer_regions
    - genders
    - product_categories
    - payment_methods
    - tags
    """
    try:
        service = SalesService(db)
        return service.get_filter_options()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
