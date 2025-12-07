'use client';

import { useFilterStore } from '@/stores/filterStore';

/**
 * SortingDropdown Component
 * 
 * Sort options:
 * - Date (Newest First) - default
 * - Quantity (High to Low / Low to High)
 * - Customer Name (A-Z)
 */
export const SortingDropdown = () => {
    const { sort_by, sort_order, setSorting } = useFilterStore();

    const sortOptions = [
        { label: 'Date (Newest First)', sortBy: 'date' as const, sortOrder: 'desc' as const },
        { label: 'Date (Oldest First)', sortBy: 'date' as const, sortOrder: 'asc' as const },
        { label: 'Quantity (High to Low)', sortBy: 'quantity' as const, sortOrder: 'desc' as const },
        { label: 'Quantity (Low to High)', sortBy: 'quantity' as const, sortOrder: 'asc' as const },
        { label: 'Customer Name (A-Z)', sortBy: 'customer_name' as const, sortOrder: 'asc' as const },
        { label: 'Customer Name (Z-A)', sortBy: 'customer_name' as const, sortOrder: 'desc' as const },
    ];

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-slate-400 mb-2">Sort By</label>
            <div className="relative">
                <select
                    value={`${sort_by}-${sort_order}`}
                    onChange={(e) => {
                        const [sortBy, sortOrder] = e.target.value.split('-') as [typeof sort_by, typeof sort_order];
                        setSorting(sortBy, sortOrder);
                    }}
                    className="w-full appearance-none px-4 py-3 pr-10 bg-slate-800/50 border border-slate-700/50 
                     rounded-xl text-slate-100 text-sm
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
                     transition-all duration-200 cursor-pointer"
                >
                    {sortOptions.map((option) => (
                        <option
                            key={`${option.sortBy}-${option.sortOrder}`}
                            value={`${option.sortBy}-${option.sortOrder}`}
                            className="bg-slate-800"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Dropdown Arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
