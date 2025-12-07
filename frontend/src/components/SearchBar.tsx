'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFilterStore } from '@/stores/filterStore';

/**
 * SearchBar Component
 * 
 * Features:
 * - Debounced search (300ms delay)
 * - Case-insensitive (handled by backend)
 * - Searches across customer_name and phone_number
 * - Clear button to reset search
 */
export const SearchBar = () => {
    const { search_query, setSearchQuery } = useFilterStore();
    const [localValue, setLocalValue] = useState(search_query || '');

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(localValue);
        }, 300);

        return () => clearTimeout(timer);
    }, [localValue, setSearchQuery]);

    const handleClear = useCallback(() => {
        setLocalValue('');
        setSearchQuery('');
    }, [setSearchQuery]);

    return (
        <div className="relative w-full max-w-md">
            {/* Search Icon */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
            </div>

            {/* Search Input */}
            <input
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder="Search by customer name or phone..."
                className="w-full pl-12 pr-10 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl 
                   text-slate-100 placeholder-slate-500 
                   focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
                   transition-all duration-200"
            />

            {/* Clear Button */}
            {localValue && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 
                     hover:text-slate-200 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};
