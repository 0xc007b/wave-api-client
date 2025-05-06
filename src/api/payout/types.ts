import { Currency } from '../../common/types';

/**
 * Status of a payout
 */
export enum PayoutStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Parameters for creating a new payout
 */
export interface CreatePayoutRequest {
  /** Amount to be paid out */
  amount: string | number;
  
  /** Currency for the amount */
  currency: Currency;
  
  /** Mobile number of the recipient */
  mobile: string;
  
  /** Name of the recipient */
  recipient_name?: string;
  
  /** Client-provided ID to avoid duplicate payouts */
  idempotency_key?: string;
  
  /** Optional metadata to attach to the payout */
  metadata?: Record<string, string>;
}

/**
 * Payout response
 */
export interface Payout {
  /** Unique identifier for the payout */
  id: string;
  
  /** Amount of the payout */
  amount: string;
  
  /** Fee amount (if applicable) */
  fee?: string;
  
  /** Currency for the amount */
  currency: Currency;
  
  /** Mobile number of the recipient */
  mobile: string;
  
  /** Name of the recipient */
  recipient_name?: string;
  
  /** Status of the payout */
  status: PayoutStatus;
  
  /** Client-provided ID to avoid duplicate payouts */
  idempotency_key?: string;
  
  /** ID of the batch this payout belongs to (if applicable) */
  batch_id?: string;
  
  /** Optional metadata attached to the payout */
  metadata?: Record<string, string>;
  
  /** Time when the payout was created */
  created_at: string;
  
  /** Time when the payout was last updated */
  updated_at: string;
  
  /** Time when the payout was completed (if applicable) */
  completed_at?: string;
}

/**
 * Parameters for creating a batch of payouts
 */
export interface CreatePayoutBatchRequest {
  /** Array of payouts to create */
  payouts: Array<{
    /** Amount to be paid out */
    amount: string | number;
    
    /** Currency for the amount */
    currency: Currency;
    
    /** Mobile number of the recipient */
    mobile: string;
    
    /** Name of the recipient */
    recipient_name?: string;
    
    /** Optional metadata to attach to the payout */
    metadata?: Record<string, string>;
  }>;
  
  /** Client-provided ID to avoid duplicate batches */
  idempotency_key?: string;
}

/**
 * Status of a payout batch
 */
export enum PayoutBatchStatus {
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  PARTIALLY_COMPLETED = 'partially_completed',
  FAILED = 'failed',
}

/**
 * Payout batch response
 */
export interface PayoutBatch {
  /** Unique identifier for the batch */
  id: string;
  
  /** Status of the batch */
  status: PayoutBatchStatus;
  
  /** Client-provided ID to avoid duplicate batches */
  idempotency_key?: string;
  
  /** IDs of payouts in this batch */
  payout_ids: string[];
  
  /** Count of payouts with status 'completed' */
  completed_count: number;
  
  /** Count of payouts with status 'failed' */
  failed_count: number;
  
  /** Count of payouts with status 'pending' or 'processing' */
  pending_count: number;
  
  /** Time when the batch was created */
  created_at: string;
  
  /** Time when the batch was last updated */
  updated_at: string;
}