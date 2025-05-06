import { PaginationParams } from '../../common/types';

/**
 * Webhook event types
 */
export enum WebhookEvent {
  CHECKOUT_COMPLETED = 'checkout.completed',
  PAYOUT_COMPLETED = 'payout.completed',
  PAYOUT_FAILED = 'payout.failed',
  TRANSACTION_CREATED = 'transaction.created',
  TRANSACTION_UPDATED = 'transaction.updated',
}

/**
 * Webhook status
 */
export enum WebhookStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/**
 * Parameters for listing webhooks
 */
export interface WebhookListParams extends PaginationParams {
  /** Filter by event type */
  event?: WebhookEvent;
  
  /** Filter by webhook status */
  status?: WebhookStatus;
}

/**
 * Parameters for creating a webhook
 */
export interface CreateWebhookRequest {
  /** URL where webhook events will be sent */
  url: string;
  
  /** Array of event types to subscribe to */
  events: WebhookEvent[];
  
  /** Optional description of the webhook */
  description?: string;
  
  /** Secret used to sign the webhook payload */
  secret?: string;
}

/**
 * Parameters for updating a webhook
 */
export interface UpdateWebhookRequest {
  /** URL where webhook events will be sent */
  url?: string;
  
  /** Array of event types to subscribe to */
  events?: WebhookEvent[];
  
  /** Description of the webhook */
  description?: string;
  
  /** Secret used to sign the webhook payload */
  secret?: string;
  
  /** Status of the webhook */
  status?: WebhookStatus;
}

/**
 * Webhook details
 */
export interface Webhook {
  /** Unique identifier for the webhook */
  id: string;
  
  /** URL where webhook events will be sent */
  url: string;
  
  /** Array of event types the webhook is subscribed to */
  events: WebhookEvent[];
  
  /** Status of the webhook */
  status: WebhookStatus;
  
  /** Description of the webhook */
  description?: string;
  
  /** Time when the webhook was created */
  created_at: string;
  
  /** Time when the webhook was last updated */
  updated_at: string;
}

/**
 * Parameters for verifying a webhook signature
 */
export interface VerifyWebhookSignatureParams {
  /** The raw request payload (usually JSON string) */
  payload: string;
  
  /** The signature from the X-Wave-Signature header */
  signature: string;
  
  /** The webhook secret */
  secret: string;
}

/**
 * Base webhook payload
 */
export interface WebhookPayload {
  /** The type of event */
  event: WebhookEvent;
  
  /** When the event occurred */
  created_at: string;
  
  /** The webhook ID */
  webhook_id: string;
  
  /** The event data */
  data: unknown;
}