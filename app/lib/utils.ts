/**
 * Formats a number as currency with appropriate suffixes
 * - Very small numbers < 0.01: shown with up to 8 decimals (e.g., $0.00000123)
 * - Numbers 0.01-999: shown with 2 decimals (e.g., $0.52, $125.50)
 * - Numbers >= 1K: shown with K suffix (e.g., $1.25K)
 * - Numbers >= 1M: shown with M suffix (e.g., $1.25M)
 * - Numbers >= 1B: shown with B suffix (e.g., $1.25B)
 */
export const formatNumber = (num: string | number): string => {
  const value = typeof num === "string" ? parseFloat(num) : num;
  
  // Handle invalid numbers
  if (isNaN(value)) return "$0.00";
  
  // Handle zero
  if (value === 0) return "$0.00";
  
  // For numbers >= 1 billion
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  
  // For numbers >= 1 million
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  
  // For numbers >= 1 thousand
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  
  // For very small numbers (< 0.01), show up to 8 significant decimals to avoid scientific notation
  if (value < 0.01 && value > 0) {
    return `$${value.toFixed(8).replace(/\.?0+$/, '')}`;
  }
  
  // For negative very small numbers
  if (value > -0.01 && value < 0) {
    return `$${value.toFixed(8).replace(/\.?0+$/, '')}`;
  }
  
  // For all other numbers (0.01 to 999.99), show 2 decimals
  return `$${value.toFixed(2)}`;
};

