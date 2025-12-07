'use client';

import { useQuery } from '@tanstack/react-query';
import { salesAPI } from '@/services/api';

/**
 * Hook to fetch filter dropdown options
 * These options rarely change, so we cache them indefinitely
 */
export const useFilterOptions = () => {
    return useQuery({
        queryKey: ['filterOptions'],
        queryFn: () => salesAPI.getFilterOptions(),
        staleTime: Infinity, // Filter options rarely change
        gcTime: Infinity,
        refetchOnWindowFocus: false,
    });
};
