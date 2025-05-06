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
  REQUEST_VALIDATION_ERROR = 'request-validation-error',
  MISSING_AUTH_HEADER = 'missing-auth-header',
  INVALID_AUTH = 'invalid-auth',
  API_KEY_NOT_PROVIDED = 'api-key-not-provided',
  NO_MATCHING_API_KEY = 'no-matching-api-key',
  API_KEY_REVOKED = 'api-key-revoked',
  INVALID_WALLET = 'invalid-wallet',
  DISABLED_WALLET = 'disabled-wallet',
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
  limit?: number;
  cursor?: string;
}

/**
 * Standard paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  cursor?: string;
  has_more: boolean;
}