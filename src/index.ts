// Export main client
export { WaveClient } from './wave-client';

// Export API types
export * from './api/balance/types';
export * from './api/checkout/types';
export * from './api/payout/types';
export * from './api/merchants/types';

// Webhook types - export with care to avoid naming conflicts
// @deprecated All webhook types are being deprecated and will be removed in a future version
export {
  WebhookEvent,
  WebhookSecurityStrategy,
  WebhookStatus,
  WebhookListParams,
  CreateWebhookRequest,
  UpdateWebhookRequest,
  Webhook,
  VerifySignatureSecretParams,
  VerifySharedSecretParams,
  WebhookLastPaymentError,
  CheckoutSessionCompletedEventData,
  CheckoutSessionPaymentFailedEventData,
  MerchantPaymentReceivedEventData,
  B2BPaymentReceivedEventData,
  B2BPaymentFailedEventData,
  WebhookEventPayload,
} from './api/webhooks/types';

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
