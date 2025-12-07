'use client';

import { useState } from 'react';
import { useFilterStore } from '@/stores/filterStore';
import { useFilterOptions } from '@/hooks/useFilterOptions';

/**
 * FilterPanel Component
 * 
 * Multi-select filters for:
 * - Customer Region
 * - Gender
 * - Age Range
 * - Product Category
 * - Tags
 * - Payment Method
 * - Date Range
 */
export const FilterPanel = () => {
    const { data: options, isLoading } = useFilterOptions();
    const [isExpanded, setIsExpanded] = useState(true);

    const {
        customer_regions,
        genders,
        age_min,
        age_max,
        product_categories,
        tags,
        payment_methods,
        date_start,
        date_end,
        setCustomerRegions,
        setGenders,
        setAgeRange,
        setProductCategories,
        setTags,
        setPaymentMethods,
        setDateRange,
        resetFilters,
    } = useFilterStore();

    // Toggle selection for multi-select filters
    const toggleSelection = (
        currentValues: string[] | undefined,
        value: string,
        setter: (values: string[]) => void
    ) => {
        const current = currentValues || [];
        if (current.includes(value)) {
            setter(current.filter((v) => v !== value));
        } else {
            setter([...current, value]);
        }
    };

    // Check if any filters are active
    const hasActiveFilters =
        customer_regions?.length || genders?.length || age_min || age_max ||
        product_categories?.length || tags?.length || payment_methods?.length ||
        date_start || date_end;

    if (isLoading) {
        return (
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-slate-700 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/20 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="font-semibold text-slate-100">Filters</span>
                    {hasActiveFilters && (
                        <span className="px-2 py-0.5 text-xs bg-indigo-500/20 text-indigo-300 rounded-full">
                            Active
                        </span>
                    )}
                </div>
                <svg
                    className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isExpanded && (
                <div className="p-4 pt-0 space-y-6">
                    {/* Customer Region */}
                    <FilterSection title="Customer Region">
                        <div className="flex flex-wrap gap-2">
                            {options?.customer_regions.map((region) => (
                                <FilterChip
                                    key={region}
                                    label={region}
                                    isSelected={customer_regions?.includes(region) || false}
                                    onClick={() => toggleSelection(customer_regions, region, setCustomerRegions)}
                                />
                            ))}
                        </div>
                    </FilterSection>

                    {/* Gender */}
                    <FilterSection title="Gender">
                        <div className="flex flex-wrap gap-2">
                            {options?.genders.map((gender) => (
                                <FilterChip
                                    key={gender}
                                    label={gender}
                                    isSelected={genders?.includes(gender) || false}
                                    onClick={() => toggleSelection(genders, gender, setGenders)}
                                />
                            ))}
                        </div>
                    </FilterSection>

                    {/* Age Range */}
                    <FilterSection title="Age Range">
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                placeholder="Min"
                                value={age_min || ''}
                                onChange={(e) => setAgeRange(e.target.value ? parseInt(e.target.value) : undefined, age_max)}
                                className="w-24 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg 
                           text-slate-100 placeholder-slate-500 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                min={0}
                                max={150}
                            />
                            <span className="text-slate-500">to</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={age_max || ''}
                                onChange={(e) => setAgeRange(age_min, e.target.value ? parseInt(e.target.value) : undefined)}
                                className="w-24 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg 
                           text-slate-100 placeholder-slate-500 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                min={0}
                                max={150}
                            />
                        </div>
                    </FilterSection>

                    {/* Product Category */}
                    <FilterSection title="Product Category">
                        <div className="flex flex-wrap gap-2">
                            {options?.product_categories.map((category) => (
                                <FilterChip
                                    key={category}
                                    label={category}
                                    isSelected={product_categories?.includes(category) || false}
                                    onClick={() => toggleSelection(product_categories, category, setProductCategories)}
                                />
                            ))}
                        </div>
                    </FilterSection>

                    {/* Tags */}
                    <FilterSection title="Tags">
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                            {options?.tags.slice(0, 20).map((tag) => (
                                <FilterChip
                                    key={tag}
                                    label={tag}
                                    isSelected={tags?.includes(tag) || false}
                                    onClick={() => toggleSelection(tags, tag, setTags)}
                                />
                            ))}
                        </div>
                    </FilterSection>

                    {/* Payment Method */}
                    <FilterSection title="Payment Method">
                        <div className="flex flex-wrap gap-2">
                            {options?.payment_methods.map((method) => (
                                <FilterChip
                                    key={method}
                                    label={method}
                                    isSelected={payment_methods?.includes(method) || false}
                                    onClick={() => toggleSelection(payment_methods, method, setPaymentMethods)}
                                />
                            ))}
                        </div>
                    </FilterSection>

                    {/* Date Range */}
                    <FilterSection title="Date Range">
                        <div className="flex items-center gap-3">
                            <input
                                type="date"
                                value={date_start || ''}
                                onChange={(e) => setDateRange(e.target.value, date_end)}
                                className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg 
                           text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                            <span className="text-slate-500">to</span>
                            <input
                                type="date"
                                value={date_end || ''}
                                onChange={(e) => setDateRange(date_start, e.target.value)}
                                className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg 
                           text-slate-100 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                    </FilterSection>

                    {/* Reset Button */}
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 
                         text-rose-400 rounded-lg transition-colors text-sm font-medium"
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

// Filter Section Wrapper
const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
        <h4 className="text-sm font-medium text-slate-400 mb-2">{title}</h4>
        {children}
    </div>
);

// Filter Chip Component
const FilterChip = ({
    label,
    isSelected,
    onClick
}: {
    label: string;
    isSelected: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${isSelected
                ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
                : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-600/50'
            }`}
    >
        {label}
    </button>
);
