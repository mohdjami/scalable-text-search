export enum Gender {
    MALE = "Male",
    FEMALE = "Female",
    OTHER = "Other"
}

export enum PaymentMethod {
    CASH = "Cash",
    CARD = "Card",
    UPI = "UPI",
    WALLET = "Wallet"
}

export interface SalesTransaction {
    id: number;
    customer_id: string;
    customer_name: string;
    phone_number: string;
    gender: string;
    age: number;
    customer_region: string;
    customer_type: string;
    product_id: string;
    product_name: string;
    brand: string;
    product_category: string;
    tags: string[];
    quantity: number;
    price_per_unit: number;
    discount_percentage: number;
    total_amount: number;
    final_amount: number;
    date: string;
    payment_method: string;
    order_status: string;
    delivery_type: string;
    store_id: string;
    store_location: string;
    salesperson_id: string;
    employee_name: string;
}

export interface SalesFilters {
    search_query?: string;
    customer_regions?: string[];
    genders?: string[];
    age_min?: number;
    age_max?: number;
    product_categories?: string[];
    tags?: string[];
    payment_methods?: string[];
    date_start?: string;
    date_end?: string;
    sort_by: "date" | "quantity" | "customer_name";
    sort_order: "asc" | "desc";
    page: number;
    page_size: number;
}

export interface PaginatedResponse {
    data: SalesTransaction[];
    total_count: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}

export interface FilterOptions {
    customer_regions: string[];
    genders: string[];
    product_categories: string[];
    payment_methods: string[];
    tags: string[];
}

// Default filter state
export const defaultFilters: SalesFilters = {
    search_query: undefined,
    customer_regions: undefined,
    genders: undefined,
    age_min: undefined,
    age_max: undefined,
    product_categories: undefined,
    tags: undefined,
    payment_methods: undefined,
    date_start: undefined,
    date_end: undefined,
    sort_by: "date",
    sort_order: "desc",
    page: 1,
    page_size: 10,
};
