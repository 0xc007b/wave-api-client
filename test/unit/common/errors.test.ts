import {
  WaveApiError,
  AuthenticationError,
  PermissionError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
  createErrorFromResponse,
} from '../../../src/common/errors';
import { ApiErrorResponse } from '../../../src/common/types';

describe('Errors', () => {
  describe('WaveApiError', () => {
    it('should create a base error with the correct properties', () => {
      const error = new WaveApiError('Test error', 400, 'test-error', { field: 'value' });

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('WaveApiError');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('test-error');
      expect(error.details).toEqual({ field: 'value' });
    });

    it('should create an error from an API response', () => {
      const errorResponse: ApiErrorResponse = {
        code: 'api-error',
        message: 'API Error Message',
        details: [{ loc: ['body', 'field'], msg: 'Error details' }],
      };

      const error = WaveApiError.fromApiResponse(400, errorResponse);

      expect(error).toBeInstanceOf(WaveApiError);
      expect(error.message).toBe('API Error Message');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('api-error');
      expect(error.details).toEqual(errorResponse.details);
    });
  });

  describe('Specific error types', () => {
    const testErrorResponse: ApiErrorResponse = {
      code: 'test-error',
      message: 'Test error message',
      details: [{ loc: ['body', 'field'], msg: 'Field error' }],
    };

    it('should create AuthenticationError with correct status code', () => {
      const error = new AuthenticationError('Auth error', 'auth-error', { detail: 'info' });

      expect(error).toBeInstanceOf(WaveApiError);
      expect(error).toBeInstanceOf(AuthenticationError);
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Auth error');
      expect(error.code).toBe('auth-error');
      expect(error.details).toEqual({ detail: 'info' });
    });

    it('should create PermissionError with correct status code', () => {
      const error = new PermissionError('Permission error', 'permission-error');

      expect(error).toBeInstanceOf(WaveApiError);
      expect(error).toBeInstanceOf(PermissionError);
      expect(error.statusCode).toBe(403);
    });

    it('should create NotFoundError with correct status code', () => {
      const error = new NotFoundError('Not found error', 'not-found-error');

      expect(error).toBeInstanceOf(WaveApiError);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.statusCode).toBe(404);
    });

    it('should create ValidationError with correct status code', () => {
      const error = new ValidationError('Validation error', 'validation-error');

      expect(error).toBeInstanceOf(WaveApiError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.statusCode).toBe(422);
    });

    it('should create RateLimitError with correct status code', () => {
      const error = new RateLimitError('Rate limit error', 'rate-limit-error');

      expect(error).toBeInstanceOf(WaveApiError);
      expect(error).toBeInstanceOf(RateLimitError);
      expect(error.statusCode).toBe(429);
    });

    it('should create ServerError with correct status code', () => {
      const error = new ServerError('Server error', 'server-error');

      expect(error).toBeInstanceOf(WaveApiError);
      expect(error).toBeInstanceOf(ServerError);
      expect(error.statusCode).toBe(500);
    });
  });

  describe('createErrorFromResponse', () => {
    const errorResponse: ApiErrorResponse = {
      code: 'test-error',
      message: 'Test error message',
      details: undefined,
    };

    it('should create AuthenticationError for status 401', () => {
      const error = createErrorFromResponse(401, errorResponse);
      expect(error).toBeInstanceOf(AuthenticationError);
    });

    it('should create PermissionError for status 403', () => {
      const error = createErrorFromResponse(403, errorResponse);
      expect(error).toBeInstanceOf(PermissionError);
    });

    it('should create NotFoundError for status 404', () => {
      const error = createErrorFromResponse(404, errorResponse);
      expect(error).toBeInstanceOf(NotFoundError);
    });

    it('should create ValidationError for status 422', () => {
      const error = createErrorFromResponse(422, errorResponse);
      expect(error).toBeInstanceOf(ValidationError);
    });

    it('should create RateLimitError for status 429', () => {
      const error = createErrorFromResponse(429, errorResponse);
      expect(error).toBeInstanceOf(RateLimitError);
    });

    it('should create ServerError for status 500', () => {
      const error = createErrorFromResponse(500, errorResponse);
      expect(error).toBeInstanceOf(ServerError);
    });

    it('should create ServerError for status 503', () => {
      const error = createErrorFromResponse(503, errorResponse);
      expect(error).toBeInstanceOf(ServerError);
    });

    it('should create WaveApiError for other status codes', () => {
      const error = createErrorFromResponse(418, errorResponse);
      expect(error).toBeInstanceOf(WaveApiError);
      expect(error.constructor.name).toBe('WaveApiError');
    });
  });
});
