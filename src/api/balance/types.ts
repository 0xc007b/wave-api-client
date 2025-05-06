import { Currency } from '../../common/types';

/**
 * Balance information for a wallet as defined in the Wave API
 */
export interface Balance {
  /** Balance amount */
  amount: string;

  /** Currency of the balance */
  currency: Currency;
}

/**
 * Transaction type as defined in the Wave API documentation
 */
export enum TransactionType {
  MERCHANT_PAYMENT = 'merchant_payment',
  MERCHANT_PAYMENT_REFUND = 'merchant_payment_refund',
  API_CHECKOUT = 'api_checkout',
  API_CHECKOUT_REFUND = 'api_checkout_refund',
  API_PAYOUT = 'api_payout',
  API_PAYOUT_REVERSAL = 'api_payout_reversal',
  BULK_PAYMENT = 'bulk_payment',
  BULK_PAYMENT_REVERSAL = 'bulk_payment_reversal',
  B2B_PAYMENT = 'b2b_payment',
  B2B_PAYMENT_REVERSAL = 'b2b_payment_reversal',
  MERCHANT_SWEEP = 'merchant_sweep',
}

/**
 * Parameters for retrieving balance
 */
export interface BalanceParams {
  /** Whether to include subaccounts balance in the total */
  include_subaccounts?: boolean;
}

/**
 * Parameters for listing transactions
 */
export interface TransactionListParams {
  /** Which day to fetch transactions for. Returns the current day's transactions if not specified */
  date?: string;

  /** The pointer of the page to fetch. An opaque string received from the previous page response */
  after?: string;

  /** Whether to include subaccounts transactions as well */
  include_subaccounts?: boolean;
}

/**
 * Transaction item as returned by the Wave API
 */
export interface TransactionItem {
  /** The execution time and date of the transaction */
  timestamp: string;

  /** A unique identifier for a transaction. Up to 20 characters */
  transaction_id: string;

  /** Transaction type. Can be empty */
  transaction_type?: TransactionType;

  /** The amount difference that this transaction had on your account */
  amount: string;

  /** The fee for the transaction */
  fee: string;

  /** The wallet's balance after this transaction was executed */
  balance?: string;

  /** The 3-letter ISO 4217 currency code of the transaction amount */
  currency: Currency;

  /** Marked true if this is a reversal or refund of a previous transaction */
  is_reversal?: boolean;

  /** The name of the counterparty (sender or receiver) of the transaction */
  counterparty_name?: string;

  /** The mobile number of the counterparty (sender or receiver) of the transaction */
  counterparty_mobile?: string;

  /** The identifier of the counterparty in B2B payments */
  counterparty_id?: string;

  /** The name of the business user involved in the transaction */
  business_user_name?: string;

  /** The mobile number of the business user involved in the transaction */
  business_user_mobile?: string;

  /** The employee ID associated with the busienss user involved in the transaction */
  employee_id?: string;

  /** A unique string that you (optionally) provided when submitting the transaction */
  client_reference?: string;

  /** A payment reason or message that you (optionally) provided when submitting the transaction */
  payment_reason?: string;

  /** If this payment is linked to a Checkout API session, this is its ID */
  checkout_api_session_id?: string;

  /** The batch ID if this transaction is part of a bulk payment */
  batch_id?: string;

  /** The ID of the aggregated merchant this transaction is assigned to */
  aggregated_merchant_id?: string;

  /** The name of the aggregated merchant this transaction is assigned to */
  aggregated_merchant_name?: string;

  /** A key-value map of any custom fields related to this payment */
  custom_fields?: Record<string, string>;

  /** If the transaction belongs to a sub-account, this field denotes the ID of the account */
  submerchant_id?: string;

  /** If the transaction belongs to a sub-account, this field denotes the name of the account */
  submerchant_name?: string;
}

/**
 * Transaction list response
 */
export interface TransactionListResponse {
  /** Pagination information */
  page_info: {
    /** Cursor of the first item in the current page, null if first page */
    start_cursor: string | null;

    /** Cursor of the last item in the current page */
    end_cursor: string;

    /** Whether there are more pages after this one */
    has_next_page: boolean;
  };

  /** The date the transactions are for */
  date: string;

  /** The list of transactions */
  items: TransactionItem[];
}
