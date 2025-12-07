/**
 * Format currency value
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
};

/**
 * Format date string to readable format
 */
export const formatDate = (dateString: string): string => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }).format(date);
    } catch {
        return dateString;
    }
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
};
