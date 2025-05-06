import { Currency } from '../../common/types';

/**
 * Status of a checkout session as defined in the Wave API
 */
export enum CheckoutSessionStatus {
  OPEN = 'open',
  COMPLETE = 'complete',
  EXPIRED = 'expired',
}

/**
 * Status of a payment in the Wave API
 */
export enum PaymentStatus {
  PROCESSING = 'processing',
  CANCELLED = 'cancelled',
  SUCCEEDED = 'succeeded',
}

/**
 * Last payment error structure
 */
export interface LastPaymentError {
  /** A short string indicating the error code */
  code: string;

  /** A human-readable description of the error */
  message: string;
}

/**
 * Parameters for creating a new checkout session
 */
export interface CreateCheckoutSessionRequest {
  /** Amount to be paid (gross of fees) */
  amount: string | number;

  /** Currency for the amount */
  currency: Currency;

  /** URL to redirect to after successful payment */
  success_url: string;

  /** URL to redirect to if there's an error */
  error_url: string;

  /** Optional URL to redirect to if the user cancels the checkout */
  cancel_url?: string;

  /** Optional unique string that you provide which can be used to correlate the checkout in your system */
  client_reference?: string;

  /** Optional ID for the aggregated merchant */
  aggregated_merchant_id?: string;

  /** Optional restriction to only allow payment from specific Wave account with this mobile number */
  restrict_payer_mobile?: string;
}

/**
 * Checkout session response as defined in the Wave API
 */
export interface CheckoutSession {
  /** Unique identifier for the checkout session */
  id: string;

  /** Total amount to collect from the customer (gross of fees) */
  amount: string;

  /** Status of the checkout: open, complete, or expired */
  checkout_status: CheckoutSessionStatus;

  /** A unique string that you provide which can be used to correlate the checkout */
  client_reference?: string | null;

  /** Currency for the amount */
  currency: Currency;

  /** URL to redirect to if there's an error */
  error_url: string;

  /** The reason for the last failed payment attempt */
  last_payment_error?: LastPaymentError | null;

  /** The name of the business as shown to the customer */
  business_name: string;

  /** Status of the associated payment */
  payment_status: PaymentStatus;

  /** A Wave transaction ID that is also visible in the user's app */
  transaction_id?: string;

  /** ID for the aggregated merchant, if applicable */
  aggregated_merchant_id?: string;

  /** This checkout session can only be paid by the Wave account with this number */
  restrict_payer_mobile?: string;

  /** URL to redirect to after successful payment */
  success_url: string;

  /** URL which will open the Wave app to initiate the checkout */
  wave_launch_url: string;

  /** UTC time at which the checkout session was completed or expired (not populated for open sessions) */
  when_completed?: string;

  /** UTC time that the checkout session was created */
  when_created: string;

  /** UTC time at which the checkout session will expire */
  when_expires: string;
}
