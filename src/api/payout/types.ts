import { Currency } from '../../common/types';

/**
 * Status of a payout as defined in the Wave API
 */
export enum PayoutStatus {
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REVERSED = 'reversed',
}

/**
 * Payout error details as defined in the Wave API
 */
export interface PayoutError {
  /** Error code */
  error_code: string;

  /** Human-readable error message */
  error_message?: string;
}

/**
 * Parameters for creating a new payout
 */
export interface CreatePayoutRequest {
  /** The amount currency */
  currency: Currency;

  /** The amount to be paid out to the recipient, net of fees */
  receive_amount: string | number;

  /** The recipient mobile phone number */
  mobile: string;

  /** The recipient name, may be used for user verification */
  name?: string;

  /** An optional field to save the recipient's national ID */
  national_id?: string;

  /** An optional message with a payment reason shown to customers */
  payment_reason?: string;

  /** A unique string that you provide to correlate the payout in your system */
  client_reference?: string;

  /** The id of an aggregated merchant identity to use for this payout */
  aggregated_merchant_id?: string;
}

/**
 * Payout response
 */
export interface Payout {
  /** A unique identifier for the payout object */
  id: string;

  /** The amount currency */
  currency: Currency;

  /** The amount to be paid out to the recipient, net of fees */
  receive_amount: string;

  /** The fee for sending the payout */
  fee: string;

  /** The recipient mobile phone number */
  mobile: string;

  /** The recipient name */
  name?: string;

  /** An optional field to save the recipient's national ID */
  national_id?: string;

  /** A unique string that you provide to correlate the payout in your system */
  client_reference?: string;

  /** An optional message with a payment reason shown to customers */
  payment_reason?: string;

  /** The status of the payout */
  status: PayoutStatus;

  /** Details about the reason for a failed payout */
  payout_error?: PayoutError;

  /** The time and date that this payout request was recorded */
  timestamp: string;

  /** The id of an aggregated merchant identity used for this payout */
  aggregated_merchant_id?: string;

  /** ID of the batch this payout belongs to (if applicable) */
  batch_id?: string;
}

/**
 * Parameters for creating a batch of payouts
 */
export interface CreatePayoutBatchRequest {
  /** Array of payouts to create */
  payouts: Array<{
    /** The amount currency */
    currency: Currency;

    /** The amount to be paid out to the recipient, net of fees */
    receive_amount: string | number;

    /** The recipient mobile phone number */
    mobile: string;

    /** The recipient name, may be used for user verification */
    name?: string;

    /** An optional field to save the recipient's national ID */
    national_id?: string;

    /** An optional message with a payment reason shown to customers */
    payment_reason?: string;

    /** A unique string that you provide to correlate the payout in your system */
    client_reference?: string;

    /** The id of an aggregated merchant identity to use for this payout */
    aggregated_merchant_id?: string;
  }>;

  /** Client-provided ID to avoid duplicate batches */
  idempotency_key?: string;
}

/**
 * Status of a payout batch as defined in the Wave API
 */
export enum PayoutBatchStatus {
  PROCESSING = 'processing',
  COMPLETE = 'complete',
}

/**
 * Payout batch response
 */
export interface PayoutBatch {
  /** Unique identifier for the batch */
  id: string;

  /** Status of the batch */
  status: PayoutBatchStatus;

  /** Array of payout objects in this batch */
  payouts: Payout[];
}
