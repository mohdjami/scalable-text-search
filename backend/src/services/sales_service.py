from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from models.sales import SalesTransaction
from schemas.sales import SalesFilterRequest, PaginatedSalesResponse, SalesTransactionResponse, FilterOptionsResponse
from typing import List
import math

class SalesService:
    """
    Business logic layer for sales operations.
    Handles complex filtering, searching, sorting, and pagination.
    Works with both SQLite and PostgreSQL.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_sales_with_filters(self, filters: SalesFilterRequest) -> PaginatedSalesResponse:
        """
        Main method to retrieve sales with all filters applied.
        """
        
        # Start with base query
        query = self.db.query(SalesTransaction)
        
        # === SEARCH IMPLEMENTATION ===
        # Case-insensitive search (works for both SQLite and PostgreSQL)
        if filters.search_query:
            search_term = f"%{filters.search_query}%"
            # Use ILIKE for PostgreSQL (case-insensitive), LIKE for SQLite
            try:
                query = query.filter(
                    or_(
                        SalesTransaction.customer_name.ilike(search_term),
                        SalesTransaction.phone_number.ilike(search_term)
                    )
                )
            except:
                # Fallback for SQLite
                search_term_lower = f"%{filters.search_query.lower()}%"
                query = query.filter(
                    or_(
                        func.lower(SalesTransaction.customer_name).like(search_term_lower),
                        func.lower(SalesTransaction.phone_number).like(search_term_lower)
                    )
                )
        
        # === FILTERS IMPLEMENTATION ===
        filter_conditions = []
        
        # Customer Region Filter (Multi-select)
        if filters.customer_regions:
            filter_conditions.append(
                SalesTransaction.customer_region.in_(filters.customer_regions)
            )
        
        # Gender Filter (Multi-select)
        if filters.genders:
            filter_conditions.append(
                SalesTransaction.gender.in_(filters.genders)
            )
        
        # Age Range Filter
        if filters.age_min is not None:
            filter_conditions.append(SalesTransaction.age >= filters.age_min)
        if filters.age_max is not None:
            filter_conditions.append(SalesTransaction.age <= filters.age_max)
        
        # Product Category Filter (Multi-select)
        if filters.product_categories:
            filter_conditions.append(
                SalesTransaction.product_category.in_(filters.product_categories)
            )
        
        # Tags Filter (Multi-select)
        if filters.tags:
            tag_conditions = []
            for tag in filters.tags:
                tag_conditions.append(
                    SalesTransaction.tags.like(f"%{tag}%")
                )
            filter_conditions.append(or_(*tag_conditions))
        
        # Payment Method Filter (Multi-select)
        if filters.payment_methods:
            filter_conditions.append(
                SalesTransaction.payment_method.in_(filters.payment_methods)
            )
        
        # Date Range Filter
        if filters.date_start:
            filter_conditions.append(SalesTransaction.transaction_date >= filters.date_start)
        if filters.date_end:
            filter_conditions.append(SalesTransaction.transaction_date <= filters.date_end)
        
        # Apply all filters with AND condition
        if filter_conditions:
            query = query.filter(and_(*filter_conditions))
        
        # === GET COUNT EFFICIENTLY ===
        count_query = query.with_entities(func.count(SalesTransaction.id))
        total_count = count_query.scalar()
        
        # === SORTING IMPLEMENTATION ===
        sort_column = {
            "date": SalesTransaction.transaction_date,
            "quantity": SalesTransaction.quantity,
            "customer_name": SalesTransaction.customer_name
        }.get(filters.sort_by, SalesTransaction.transaction_date)
        
        if filters.sort_order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())
        
        # === PAGINATION IMPLEMENTATION ===
        total_pages = math.ceil(total_count / filters.page_size) if total_count > 0 else 1
        offset = (filters.page - 1) * filters.page_size
        
        # Apply pagination
        query = query.offset(offset).limit(filters.page_size)
        
        # Execute query
        results = query.all()
        
        # Transform results
        transformed_results = []
        for result in results:
            tags_list = [
                tag.strip() 
                for tag in (result.tags or "").split(',') 
                if tag.strip()
            ]
            transformed_results.append(SalesTransactionResponse(
                id=result.id,
                customer_id=result.customer_id or "",
                customer_name=result.customer_name or "",
                phone_number=result.phone_number or "",
                gender=result.gender or "",
                age=result.age or 0,
                customer_region=result.customer_region or "",
                customer_type=result.customer_type or "",
                product_id=result.product_id or "",
                product_name=result.product_name or "",
                brand=result.brand or "",
                product_category=result.product_category or "",
                tags=tags_list,
                quantity=result.quantity or 0,
                price_per_unit=float(result.price_per_unit) if result.price_per_unit else 0.0,
                discount_percentage=float(result.discount_percentage) if result.discount_percentage else 0.0,
                total_amount=float(result.total_amount) if result.total_amount else 0.0,
                final_amount=float(result.final_amount) if result.final_amount else 0.0,
                date=result.transaction_date,
                payment_method=result.payment_method or "",
                order_status=result.order_status or "",
                delivery_type=result.delivery_type or "",
                store_id=result.store_id or "",
                store_location=result.store_location or "",
                salesperson_id=result.salesperson_id or "",
                employee_name=result.employee_name or ""
            ))
        
        return PaginatedSalesResponse(
            data=transformed_results,
            total_count=total_count,
            page=filters.page,
            page_size=filters.page_size,
            total_pages=total_pages,
            has_next=filters.page < total_pages,
            has_previous=filters.page > 1
        )
    
    def get_filter_options(self) -> FilterOptionsResponse:
        """Get all unique values for filter dropdowns."""
        return FilterOptionsResponse(
            customer_regions=self._get_unique_values(SalesTransaction.customer_region),
            genders=self._get_unique_values(SalesTransaction.gender),
            product_categories=self._get_unique_values(SalesTransaction.product_category),
            payment_methods=self._get_unique_values(SalesTransaction.payment_method),
            tags=self._get_all_unique_tags()
        )
    
    def _get_unique_values(self, column) -> List[str]:
        """Helper to get distinct values from a column"""
        result = self.db.query(column).distinct().limit(100).all()
        return sorted([val[0] for val in result if val[0]])
    
    def _get_all_unique_tags(self) -> List[str]:
        """Parse all tags and return unique list"""
        all_tags_raw = self.db.query(SalesTransaction.tags).distinct().limit(200).all()
        unique_tags = set()
        for tags_row in all_tags_raw:
            if tags_row[0]:
                tags = [tag.strip() for tag in tags_row[0].split(',')]
                unique_tags.update(t for t in tags if t)
        return sorted(list(unique_tags))[:50]
