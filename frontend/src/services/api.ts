import axios from 'axios';
import { SalesFilters, PaginatedResponse, FilterOptions } from '@/types/sales.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const salesAPI = {
    /**
     * Fetch sales data with filters, sorting, and pagination
     */
    async searchSales(filters: SalesFilters): Promise<PaginatedResponse> {
        // Clean up undefined/null values before sending
        // Keep valid numbers (including 0) and non-empty arrays/strings
        const cleanFilters: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(filters)) {
            // Skip undefined and null
            if (value === undefined || value === null) continue;

            // Skip empty strings
            if (value === '') continue;

            // Skip empty arrays
            if (Array.isArray(value) && value.length === 0) continue;

            // Keep everything else (including 0 for numbers)
            cleanFilters[key] = value;
        }

        const response = await apiClient.post<PaginatedResponse>(
            '/api/sales/search',
            cleanFilters
        );
        return response.data;
    },

    /**
     * Get available filter options for dropdowns
     */
    async getFilterOptions(): Promise<FilterOptions> {
        const response = await apiClient.get<FilterOptions>(
            '/api/sales/filter-options'
        );
        return response.data;
    },
};
