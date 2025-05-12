// Export main client
export { WaveClient } from './wave-client';

// Export API types
export * from './api/balance/types';
export * from './api/checkout/types';
export * from './api/payout/types';
export * from './api/merchants/types';

// Export common types
export { Currency, WaveApiConfig, ErrorCode } from './common/types';

// Export error classes
export {
  WaveApiError,
  AuthenticationError,
  PermissionError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
} from './common/errors';