import { create } from 'zustand';
import { SalesFilters, defaultFilters } from '@/types/sales.types';

interface FilterState extends SalesFilters {
    // Actions
    setSearchQuery: (query: string) => void;
    setCustomerRegions: (regions: string[]) => void;
    setGenders: (genders: string[]) => void;
    setAgeRange: (min?: number, max?: number) => void;
    setProductCategories: (categories: string[]) => void;
    setTags: (tags: string[]) => void;
    setPaymentMethods: (methods: string[]) => void;
    setDateRange: (start?: string, end?: string) => void;
    setSorting: (sortBy: SalesFilters['sort_by'], sortOrder: SalesFilters['sort_order']) => void;
    setPage: (page: number) => void;
    resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    ...defaultFilters,

    setSearchQuery: (query) =>
        set({ search_query: query || undefined, page: 1 }),

    setCustomerRegions: (regions) =>
        set({ customer_regions: regions.length ? regions : undefined, page: 1 }),

    setGenders: (genders) =>
        set({ genders: genders.length ? genders : undefined, page: 1 }),

    setAgeRange: (min, max) =>
        set({ age_min: min, age_max: max, page: 1 }),

    setProductCategories: (categories) =>
        set({ product_categories: categories.length ? categories : undefined, page: 1 }),

    setTags: (tags) =>
        set({ tags: tags.length ? tags : undefined, page: 1 }),

    setPaymentMethods: (methods) =>
        set({ payment_methods: methods.length ? methods : undefined, page: 1 }),

    setDateRange: (start, end) =>
        set({ date_start: start || undefined, date_end: end || undefined, page: 1 }),

    setSorting: (sortBy, sortOrder) =>
        set({ sort_by: sortBy, sort_order: sortOrder, page: 1 }),

    setPage: (page) =>
        set({ page }),

    resetFilters: () =>
        set(defaultFilters),
}));
