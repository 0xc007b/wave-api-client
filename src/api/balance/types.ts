import { Currency, PaginationParams } from '../../common/types';

/**
 * Balance information for a wallet
 */
export interface Balance {
  /** Available balance amount */
  available: string;
  
  /** Currency of the balance */
  currency: Currency;
  
  /** Time when the balance was last updated */
  last_updated_at: string;
}

/**
 * Transaction type
 */
export enum TransactionType {
  DEPOSIT = 'deposit',
  PAYOUT = 'payout',
  CHECKOUT = 'checkout',
  FEE = 'fee',
  ADJUSTMENT = 'adjustment',
}

/**
 * Transaction status
 */
export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Parameters for listing transactions
 */
export interface TransactionListParams extends PaginationParams {
  /** Filter by transaction type */
  type?: TransactionType;
  
  /** Filter by transaction status */
  status?: TransactionStatus;
  
  /** Filter by start date (ISO format) */
  start_date?: string;
  
  /** Filter by end date (ISO format) */
  end_date?: string;
}

/**
 * Transaction details
 */
export interface Transaction {
  /** Unique identifier for the transaction */
  id: string;
  
  /** Type of transaction */
  type: TransactionType;
  
  /** Status of the transaction */
  status: TransactionStatus;
  
  /** Amount of the transaction */
  amount: string;
  
  /** Fee amount (if applicable) */
  fee?: string;
  
  /** Currency of the transaction */
  currency: Currency;
  
  /** Short description of the transaction */
  description: string;
  
  /** Time when the transaction was created */
  created_at: string;
  
  /** Time when the transaction was last updated */
  updated_at: string;
  
  /** Time when the transaction was completed (if applicable) */
  completed_at?: string;
  
  /** External transaction reference (if applicable) */
  external_reference?: string;
  
  /** Related checkout session ID (if applicable) */
  checkout_session_id?: string;
  
  /** Related payout ID (if applicable) */
  payout_id?: string;
  
  /** Optional metadata attached to the transaction */
  metadata?: Record<string, string>;
}