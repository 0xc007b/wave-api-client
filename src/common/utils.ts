/**
 * Utility functions
 */

/**
 * Validates if a string is empty
 */
export function isEmpty(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === '';
}

/**
 * Validates a Wave API key format
 */
export function isValidApiKey(apiKey: string): boolean {
  // Wave API keys start with wave_* and are sufficiently long
  return /^wave_[a-zA-Z0-9_-]{20,}$/.test(apiKey);
}

/**
 * Formats an amount to handle decimal places according to currency
 */
export function formatAmount(amount: number | string, currency: string): string {
  // Convert to string if it's a number
  const amountStr = typeof amount === 'number' ? amount.toString() : amount;

  // Validate that the amount string only contains digits and optionally a decimal point
  if (!/^\d+(\.\d+)?$/.test(amountStr)) {
    throw new Error(`Invalid amount format: ${amount}`);
  }

  // Parse the amount
  const parsedAmount = parseFloat(amountStr);

  // Format based on currency
  switch (currency) {
    case 'XOF': // CFA Franc BCEAO - no decimal places
    case 'JPY': // Japanese Yen - no decimal places
    case 'KRW': // South Korean Won - no decimal places
      return Math.round(parsedAmount).toString();

    case 'BHD': // Bahraini Dinar - 3 decimal places
    case 'IQD': // Iraqi Dinar - 3 decimal places
    case 'KWD': // Kuwaiti Dinar - 3 decimal places
    case 'OMR': // Omani Rial - 3 decimal places
      return parsedAmount.toFixed(3);

    default: // Most currencies use 2 decimal places (USD, EUR, etc.)
      return parsedAmount.toFixed(2);
  }
}

/**
 * Creates a query string from an object of parameters
 */
export function createQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}
