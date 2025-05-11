import { PaginationParams } from '../../common/types';

/**
 * Webhook event types as defined in the Wave API documentation
 * @deprecated This enum is being deprecated and will be removed in a future version
 */
export enum WebhookEvent {
  CHECKOUT_SESSION_COMPLETED = 'checkout.session.completed',
  CHECKOUT_SESSION_PAYMENT_FAILED = 'checkout.session.payment_failed',
  B2B_PAYMENT_RECEIVED = 'b2b.payment_received',
  B2B_PAYMENT_FAILED = 'b2b.payment_failed',
  MERCHANT_PAYMENT_RECEIVED = 'merchant.payment_received',
}

/**
 * Security strategy for webhook verification
 * @deprecated This enum is being deprecated and will be removed in a future version
 */
export enum WebhookSecurityStrategy {
  SHARED_SECRET = 'shared_secret',
  SIGNING_SECRET = 'signing_secret',
}

/**
 * Webhook status
 * @deprecated This enum is being deprecated and will be removed in a future version
 */
export enum WebhookStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/**
 * Parameters for listing webhooks
 * @deprecated This interface is being deprecated and will be removed in a future version
 */
export interface WebhookListParams extends PaginationParams {
  /** Filter by event type */
  event?: WebhookEvent;

  /** Filter by webhook status */
  status?: WebhookStatus;
}

/**
 * Parameters for creating a webhook
 * @deprecated This interface is being deprecated and will be removed in a future version
 */
export interface CreateWebhookRequest {
  /** URL where webhook events will be sent */
  url: string;

  /** Array of event types to subscribe to */
  events: WebhookEvent[];

  /** Strategy for webhook security verification */
  security_strategy: WebhookSecurityStrategy;

  /** Optional description of the webhook */
  description?: string;
}

/**
 * Parameters for updating a webhook
 * @deprecated This interface is being deprecated and will be removed in a future version
 */
export interface UpdateWebhookRequest {
  /** URL where webhook events will be sent */
  url?: string;

  /** Array of event types to subscribe to */
  events?: WebhookEvent[];

  /** Description of the webhook */
  description?: string;

  /** Status of the webhook */
  status?: WebhookStatus;
}

/**
 * Webhook details
 * @deprecated This interface is being deprecated and will be removed in a future version
 */
export interface Webhook {
  /** Unique identifier for the webhook */
  id: string;

  /** URL where webhook events will be sent */
  url: string;

  /** Array of event types the webhook is subscribed to */
  events: WebhookEvent[];

  /** Strategy for webhook security verification */
  security_strategy: WebhookSecurityStrategy;

  /** Status of the webhook */
  status: WebhookStatus;

  /** Description of the webhook */
  description?: string;

  /** Secret used for webhook verification (only shown once after creation) */
  secret?: string;

  /** Time when the webhook was created */
  created_at: string;

  /** Time when the webhook was last updated */
  updated_at: string;
}

/**
 * Parameters for verifying a webhook signature
 * @deprecated This interface is being deprecated and will be removed in a future version
 */
export interface VerifySignatureSecretParams {
  /** The raw request payload (usually JSON string) */
  payload: string;

  /** The signature from the Wave-Signature header */
  signature: string;

  /** The webhook secret */
  secret: string;
}

/**
 * Parameters for verifying a shared secret
 * @deprecated This interface is being deprecated and will be removed in a future version
 */
export interface VerifySharedSecretParams {
  /** Authorization header from the webhook request */
  authHeader: string;

  /** The expected webhook secret */
  secret: string;
}

/**
 * Last payment error structure (for checkout.session.payment_failed events)
 * @deprecated This interface is being deprecated and will be removed in a future version
 */
export interface WebhookLastPaymentError {
  /** Error code */
  code: string;

  /** Error message */
  message: string;
}

/**
 * Checkout session completed event data
 * @deprecated This interface is being deprecated and will be removed in a future version
 */
export interface CheckoutSessionCompletedEventData {
  id: string;
  amount: string;
  checkout_status: string;
  client_reference: string | null;
  currency: string;
  error_url: string;
  last_payment_error: null;
  business_name: string;
  payment_status: string;
  transaction_id: string;
  aggregated_merchant_id?: string;
  success_url: string;
  wave_launch_url: string;
  when_completed: string;
  when_created: string;
  when_expires: string;
}

/**
 * Checkout session payment failed event data
 * @deprecated This interface is being deprecated and will be removed in a future version
 */
export interface CheckoutSessionPaymentFailedEventData {
  id: string;
  amount: string;
  checkout_status: string;
  client_reference: string | null;
  currency: string;
  error_url: string;
  last_payment_error: WebhookLastPaymentError;
  business_name: string;
  payment_status: string;
  success_url: string;
  wave_launch_url: string;
  when_created: string;
  when_expires: string;
}

/**
 * Merchant payment received event data
 * @deprecated This interface is being deprecated and will be removed in a future version
 */
export interface MerchantPaymentReceivedEventData {
  id: string;
  amount: string;
  currency: string;
  sender_mobile: string;
  merchant_id: string;
  merchant_name: string;
  custom_fields?: Record<string, string>;
  when_created: string;
}

/**
 * B2B payment received event data
 * @deprecated This interface is being deprecated and will be removed in a future version
 */
export interface B2BPaymentReceivedEventData {
  id: string;
  amount: string;
  client_reference?: string;
  currency: string;
  sender_id: string;
  when_created: string;
}

/**
 * B2B payment failed event data
 * @deprecated This interface is being deprecated and will be removed in a future version
 */
export interface B2BPaymentFailedEventData {
  id: string;
  amount: string;
  client_reference?: string;
  currency: string;
  last_payment_error: WebhookLastPaymentError;
  sender_id: string;
  when_created: string;
}

/**
 * Base webhook event structure
 * @deprecated This interface is being deprecated and will be removed in a future version
 */
export interface WebhookEventPayload<T = unknown> {
  /** Unique identifier for the event */
  id: string;

  /** The type of event */
  type: string;

  /** The event data */
  data: T;
}
