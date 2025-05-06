import { ApiErrorResponse } from './types';

/**
 * Base class for all Wave API errors
 */
export class WaveApiError extends Error {
  /** HTTP status code */
  statusCode: number;

  /** Error code from the API */
  code: string;

  /** Detailed error information */
  details?: any;

  constructor(message: string, statusCode: number, code: string, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Creates an error instance from an API error response
   */
  static fromApiResponse(statusCode: number, errorResponse: ApiErrorResponse): WaveApiError {
    return new WaveApiError(
      errorResponse.message,
      statusCode,
      errorResponse.code,
      errorResponse.details,
    );
  }
}

/**
 * Error thrown when there's an authentication issue
 */
export class AuthenticationError extends WaveApiError {
  constructor(message: string, code: string, details?: any) {
    super(message, 401, code, details);
  }
}

/**
 * Error thrown when there's a permission issue
 */
export class PermissionError extends WaveApiError {
  constructor(message: string, code: string, details?: any) {
    super(message, 403, code, details);
  }
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends WaveApiError {
  constructor(message: string, code: string, details?: any) {
    super(message, 404, code, details);
  }
}

/**
 * Error thrown when there's a validation issue with the request
 */
export class ValidationError extends WaveApiError {
  constructor(message: string, code: string, details?: any) {
    super(message, 422, code, details);
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class RateLimitError extends WaveApiError {
  constructor(message: string, code: string, details?: any) {
    super(message, 429, code, details);
  }
}

/**
 * Error thrown when there's a server-side issue
 */
export class ServerError extends WaveApiError {
  constructor(message: string, code: string, details?: any) {
    super(message, 500, code, details);
  }
}

/**
 * Factory to create the appropriate error based on status code
 */
export function createErrorFromResponse(
  statusCode: number,
  errorResponse: ApiErrorResponse,
): WaveApiError {
  switch (statusCode) {
    case 401:
      return new AuthenticationError(
        errorResponse.message,
        errorResponse.code,
        errorResponse.details,
      );
    case 403:
      return new PermissionError(errorResponse.message, errorResponse.code, errorResponse.details);
    case 404:
      return new NotFoundError(errorResponse.message, errorResponse.code, errorResponse.details);
    case 422:
      return new ValidationError(errorResponse.message, errorResponse.code, errorResponse.details);
    case 429:
      return new RateLimitError(errorResponse.message, errorResponse.code, errorResponse.details);
    case 500:
    case 503:
      return new ServerError(errorResponse.message, errorResponse.code, errorResponse.details);
    default:
      return WaveApiError.fromApiResponse(statusCode, errorResponse);
  }
}
