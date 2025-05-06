/**
 * API constants
 */

/** Default API base URL */
export const DEFAULT_BASE_URL = 'https://api.wave.com';

/** Default request timeout in milliseconds */
export const DEFAULT_TIMEOUT = 30000;

/** API version prefix */
export const API_VERSION = 'v1';

/** HTTP headers */
export const HEADERS = {
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  IDEMPOTENCY_KEY: 'Idempotency-Key',
  WAVE_SIGNATURE: 'Wave-Signature',
};

/** Content types */
export const CONTENT_TYPES = {
  JSON: 'application/json',
};

/** API endpoints */
export const ENDPOINTS = {
  // Balance & Reconciliation API
  BALANCE: `/${API_VERSION}/balance`,
  TRANSACTIONS: `/${API_VERSION}/transactions`,

  // Checkout API
  CHECKOUT_SESSIONS: `/${API_VERSION}/checkout/sessions`,

  // Payout API
  PAYOUT: `/${API_VERSION}/payout`,
  PAYOUTS_SEARCH: `/${API_VERSION}/payouts/search`,
  PAYOUT_BATCH: `/${API_VERSION}/payout-batch`,

  // Aggregated Merchants API
  AGGREGATED_MERCHANTS: `/${API_VERSION}/aggregated_merchants`,

  // Webhooks
  WEBHOOKS: `/${API_VERSION}/webhooks`,
};
