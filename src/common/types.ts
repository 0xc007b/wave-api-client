/**
 * Configuration options for the Wave API client
 */
export interface WaveApiConfig {
  /** API key used for authentication */
  apiKey: string;

  /** Base URL for API calls (default: https://api.wave.com) */
  baseUrl?: string;

  /** Timeout for API requests in milliseconds (default: 30000) */
  timeout?: number;

  /** Whether to enable request/response logging (default: false) */
  debug?: boolean;
}

/**
 * Supported currencies
 */
export type Currency = 'XOF' | 'GHS' | 'SLL' | 'USD';

/**
 * Common API error codes
 */
export enum ErrorCode {
  // Authentication/Authorization errors
  MISSING_AUTH_HEADER = 'missing-auth-header',
  INVALID_AUTH = 'invalid-auth',
  API_KEY_NOT_PROVIDED = 'api-key-not-provided',
  NO_MATCHING_API_KEY = 'no-matching-api-key',
  API_KEY_REVOKED = 'api-key-revoked',
  INVALID_WALLET = 'invalid-wallet',
  DISABLED_WALLET = 'disabled-wallet',

  // Checkout API errors
  AUTHORIZATION_ERROR = 'authorization-error',
  CHECKOUT_REFUND_FAILED = 'checkout-refund-failed',
  CHECKOUT_SESSION_NOT_FOUND = 'checkout-session-not-found',
  INTERNAL_SERVER_ERROR = 'internal-server-error',
  REQUEST_VALIDATION_ERROR = 'request-validation-error',
  SERVICE_UNAVAILABLE = 'service-unavailable',
  UNAUTHORIZED_WALLET = 'unauthorized-wallet',

  // Payment errors
  BLOCKED_ACCOUNT = 'blocked-account',
  CROSS_BORDER_PAYMENT_NOT_ALLOWED = 'cross-border-payment-not-allowed',
  CUSTOMER_AGE_RESTRICTED = 'customer-age-restricted',
  INSUFFICIENT_FUNDS = 'insufficient-funds',
  KYB_LIMITS_EXCEEDED = 'kyb-limits-exceeded',
  PAYER_MOBILE_MISMATCH = 'payer-mobile-mismatch',
  PAYMENT_FAILURE = 'payment-failure',

  // Payout API errors
  COUNTRY_MISMATCH = 'country-mismatch',
  CURRENCY_MISMATCH = 'currency-mismatch',
  IDEMPOTENCY_MISMATCH = 'idempotency-mismatch',
  INVALID_AGGREGATED_MERCHANT_ID = 'invalid-aggregated-merchant-id',
  NOT_FOUND = 'not-found',
  RECIPIENT_MINOR = 'recipient-minor',
  RECIPIENT_ACCOUNT_BLOCKED = 'recipient-account-blocked',
  RECIPIENT_ACCOUNT_INACTIVE = 'recipient-account-inactive',
  RECIPIENT_LIMIT_EXCEEDED = 'recipient-limit-exceeded',
  REQUEST_NOT_JSON = 'request-not-json',
  REQUEST_PARSING_ERROR = 'request-parsing-error',
  TOO_MANY_REQUESTS = 'too-many-requests',
  AGGREGATED_MERCHANT_REQUIRED = 'aggregated-merchant-required',

  // Payout reversal errors
  PAYOUT_REVERSAL_TIME_LIMIT_EXCEEDED = 'payout-reversal-time-limit-exceeded',
  PAYOUT_REVERSAL_ACCOUNT_TERMINATED = 'payout-reversal-account-terminated',

  // Aggregated Merchants API errors
  NO_PERMISSION = 'no-permission',
  RECORD_LOCKED = 'record-locked',
  DUPLICATE_AGGREGATED_MERCHANT_NAME = 'duplicate-aggregated-merchant-name',
}

/**
 * Standard error response from Wave API
 */
export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Array<{
    loc: (string | number)[];
    msg: string;
    type?: string;
    ctx?: Record<string, any>;
  }>;
}

/**
 * HTTP methods supported by the API
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  first?: number;
  after?: string;
}

/**
 * Standard paginated response according to Wave API documentation
 */
export interface PaginatedResponse<T> {
  page_info: {
    has_next_page: boolean;
    end_cursor?: string;
  };
  items: T[];
}
