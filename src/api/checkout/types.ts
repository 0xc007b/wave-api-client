import { Currency } from '../../common/types';

/**
 * Status of a checkout session
 */
export enum CheckoutSessionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

/**
 * Parameters for creating a new checkout session
 */
export interface CreateCheckoutSessionRequest {
  /** Amount to be paid */
  amount: string | number;
  
  /** Currency for the amount */
  currency: Currency;
  
  /** URL to redirect to after successful payment */
  success_url: string;
  
  /** URL to redirect to if there's an error */
  error_url: string;
  
  /** Optional URL to redirect to if the user cancels the checkout */
  cancel_url?: string;
  
  /** Optional ID for the aggregated merchant */
  aggregated_merchant_id?: string;
  
  /** Optional metadata to attach to the checkout session */
  metadata?: Record<string, string>;
}

/**
 * Checkout session response
 */
export interface CheckoutSession {
  /** Unique identifier for the checkout session */
  id: string;
  
  /** Amount to be paid */
  amount: string;
  
  /** Currency for the amount */
  currency: Currency;
  
  /** URL to redirect to after successful payment */
  success_url: string;
  
  /** URL to redirect to if there's an error */
  error_url: string;
  
  /** URL to redirect to if the user cancels the checkout */
  cancel_url?: string;
  
  /** Status of the checkout session */
  status: CheckoutSessionStatus;
  
  /** URL to the Wave checkout page for this session */
  checkout_url: string;
  
  /** ID of the transaction (only set if status is completed) */
  transaction_id?: string;
  
  /** Time when the session was created */
  created_at: string;
  
  /** Time when the session expires */
  expires_at: string;
  
  /** ID for the aggregated merchant, if applicable */
  aggregated_merchant_id?: string;
  
  /** Optional metadata attached to the checkout session */
  metadata?: Record<string, string>;
}