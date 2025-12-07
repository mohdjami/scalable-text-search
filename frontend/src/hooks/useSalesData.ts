'use client';

import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { salesAPI } from '@/services/api';
import { useFilterStore } from '@/stores/filterStore';

/**
 * Hook to fetch sales data with current filter state
 * Automatically refetches when filters change
 * Uses useShallow to prevent infinite re-renders from object comparison
 */
export const useSalesData = () => {
    // Get all filter state from store using shallow comparison
    const {
        search_query,
        customer_regions,
        genders,
        age_min,
        age_max,
        product_categories,
        tags,
        payment_methods,
        date_start,
        date_end,
        sort_by,
        sort_order,
        page,
        page_size,
    } = useFilterStore(
        useShallow((state) => ({
            search_query: state.search_query,
            customer_regions: state.customer_regions,
            genders: state.genders,
            age_min: state.age_min,
            age_max: state.age_max,
            product_categories: state.product_categories,
            tags: state.tags,
            payment_methods: state.payment_methods,
            date_start: state.date_start,
            date_end: state.date_end,
            sort_by: state.sort_by,
            sort_order: state.sort_order,
            page: state.page,
            page_size: state.page_size,
        }))
    );

    // Create filters object for API call
    const filters = {
        search_query,
        customer_regions,
        genders,
        age_min,
        age_max,
        product_categories,
        tags,
        payment_methods,
        date_start,
        date_end,
        sort_by,
        sort_order,
        page,
        page_size,
    };

    return useQuery({
        queryKey: ['sales', search_query, customer_regions, genders, age_min, age_max,
            product_categories, tags, payment_methods, date_start, date_end,
            sort_by, sort_order, page, page_size],
        queryFn: () => salesAPI.searchSales(filters),
        staleTime: 30000, // Data fresh for 30 seconds
        gcTime: 5 * 60 * 1000, // Cache for 5 minutes
        refetchOnWindowFocus: false,
        retry: 2,
    });
};
