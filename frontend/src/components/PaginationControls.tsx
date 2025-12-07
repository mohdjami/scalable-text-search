'use client';

import { useFilterStore } from '@/stores/filterStore';
import { useSalesData } from '@/hooks/useSalesData';

/**
 * PaginationControls Component
 * 
 * Features:
 * - Page size: 10 items per page (fixed per requirements)
 * - Previous/Next navigation
 * - Page indicator
 * - Maintains filter/sort/search state
 */
export const PaginationControls = () => {
    const { page, setPage } = useFilterStore();
    const { data, isLoading } = useSalesData();

    if (isLoading || !data) {
        return null;
    }

    const { total_pages, has_next, has_previous, total_count, page_size } = data;

    // Calculate range
    const startItem = (page - 1) * page_size + 1;
    const endItem = Math.min(page * page_size, total_count);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (total_pages <= maxVisible) {
            return Array.from({ length: total_pages }, (_, i) => i + 1);
        }

        // Always show first page
        pages.push(1);

        if (page > 3) {
            pages.push('...');
        }

        // Show pages around current page
        for (let i = Math.max(2, page - 1); i <= Math.min(total_pages - 1, page + 1); i++) {
            pages.push(i);
        }

        if (page < total_pages - 2) {
            pages.push('...');
        }

        // Always show last page
        if (total_pages > 1) {
            pages.push(total_pages);
        }

        return pages;
    };

    if (total_count === 0) {
        return null;
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 
                    bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50">
            {/* Results Info */}
            <div className="text-sm text-slate-400">
                Showing <span className="text-slate-100 font-medium">{startItem}</span> to{' '}
                <span className="text-slate-100 font-medium">{endItem}</span> of{' '}
                <span className="text-slate-100 font-medium">{total_count}</span> results
            </div>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={!has_previous}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg 
                      transition-all duration-200 ${has_previous
                            ? 'bg-slate-700/50 text-slate-200 hover:bg-slate-600/50'
                            : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNum, index) => (
                        pageNum === '...' ? (
                            <span key={`dots-${index}`} className="px-2 text-slate-500">...</span>
                        ) : (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum as number)}
                                className={`min-w-[40px] h-10 flex items-center justify-center text-sm font-medium 
                           rounded-lg transition-all duration-200 ${page === pageNum
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        )
                    ))}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={!has_next}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg 
                      transition-all duration-200 ${has_next
                            ? 'bg-slate-700/50 text-slate-200 hover:bg-slate-600/50'
                            : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                        }`}
                >
                    <span className="hidden sm:inline">Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
