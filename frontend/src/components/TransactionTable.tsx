'use client';

import { useSalesData } from '@/hooks/useSalesData';
import { formatCurrency, formatDate, formatPercentage } from '@/utils/formatters';
import { SalesTransaction } from '@/types/sales.types';

/**
 * TransactionTable Component
 * 
 * Displays sales data in a responsive table format with:
 * - Loading skeleton
 * - Empty state
 * - Error state
 * - Row hover effects
 */
export const TransactionTable = () => {
    const { data, isLoading, isError, error } = useSalesData();

    // Loading State
    if (isLoading) {
        return <TableSkeleton />;
    }

    // Error State
    if (isError) {
        return (
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 mb-4">
                    <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">Failed to load data</h3>
                <p className="text-slate-400">{(error as Error)?.message || 'An error occurred'}</p>
            </div>
        );
    }

    // Empty State
    if (!data?.data?.length) {
        return (
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-700/50 mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">No transactions found</h3>
                <p className="text-slate-400">Try adjusting your search or filter criteria</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
            {/* Results Count */}
            <div className="px-6 py-4 border-b border-slate-700/50">
                <p className="text-sm text-slate-400">
                    Showing <span className="text-slate-100 font-medium">{data.data.length}</span> of{' '}
                    <span className="text-slate-100 font-medium">{data.total_count}</span> transactions
                </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-900/50">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Qty</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Payment</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                        {data.data.map((transaction) => (
                            <TransactionRow key={transaction.id} transaction={transaction} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Transaction Row Component
const TransactionRow = ({ transaction }: { transaction: SalesTransaction }) => {
    const statusColors: Record<string, string> = {
        'Completed': 'bg-emerald-500/10 text-emerald-400',
        'Pending': 'bg-amber-500/10 text-amber-400',
        'Cancelled': 'bg-rose-500/10 text-rose-400',
    };

    return (
        <tr className="hover:bg-slate-700/20 transition-colors">
            {/* Customer */}
            <td className="px-4 py-4">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-100">{transaction.customer_name}</span>
                    <span className="text-xs text-slate-500">{transaction.phone_number}</span>
                    <span className="text-xs text-slate-500">{transaction.customer_region}</span>
                </div>
            </td>

            {/* Product */}
            <td className="px-4 py-4">
                <div className="flex flex-col">
                    <span className="text-sm text-slate-200">{transaction.product_name}</span>
                    <span className="text-xs text-slate-500">{transaction.brand}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {transaction.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 text-xs bg-slate-700/50 text-slate-400 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </td>

            {/* Quantity */}
            <td className="px-4 py-4">
                <span className="text-sm text-slate-200">{transaction.quantity}</span>
            </td>

            {/* Amount */}
            <td className="px-4 py-4">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-100">{formatCurrency(transaction.final_amount)}</span>
                    {transaction.discount_percentage > 0 && (
                        <span className="text-xs text-emerald-400">
                            -{formatPercentage(transaction.discount_percentage)} off
                        </span>
                    )}
                </div>
            </td>

            {/* Payment Method */}
            <td className="px-4 py-4">
                <span className="text-sm text-slate-300">{transaction.payment_method}</span>
            </td>

            {/* Date */}
            <td className="px-4 py-4">
                <span className="text-sm text-slate-300">{formatDate(transaction.date)}</span>
            </td>

            {/* Status */}
            <td className="px-4 py-4">
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full 
                         ${statusColors[transaction.order_status] || 'bg-slate-500/10 text-slate-400'}`}>
                    {transaction.order_status}
                </span>
            </td>
        </tr>
    );
};

// Table Skeleton
const TableSkeleton = () => (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
            <div className="h-4 w-48 bg-slate-700 rounded animate-pulse"></div>
        </div>
        <div className="divide-y divide-slate-700/30">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="px-4 py-4 flex gap-4">
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-slate-700 rounded w-1/2 animate-pulse"></div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-2/3 animate-pulse"></div>
                        <div className="h-3 bg-slate-700 rounded w-1/3 animate-pulse"></div>
                    </div>
                    <div className="w-16">
                        <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
                    </div>
                    <div className="w-24">
                        <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
