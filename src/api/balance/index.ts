import { HttpClient } from '../../http/client';
import { ENDPOINTS } from '../../common/constants';
import { PaginationParams } from '../../common/types';
import { createQueryString } from '../../common/utils';
import { Balance, Transaction, TransactionListParams } from './types';

/**
 * Balance & Reconciliation API client
 */
export class BalanceApi {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Gets the current balance of the wallet
   * 
   * @returns The current balance information
   */
  async getBalance(): Promise<Balance> {
    return this.httpClient.get<Balance>(ENDPOINTS.BALANCE);
  }

  /**
   * Lists transactions for the wallet
   * 
   * @param params Optional parameters for filtering transactions
   * @returns A paginated list of transactions
   */
  async listTransactions(params?: TransactionListParams): Promise<{
    data: Transaction[];
    cursor?: string;
    has_more: boolean;
  }> {
    const queryString = params ? createQueryString(params) : '';
    return this.httpClient.get<{
      data: Transaction[];
      cursor?: string;
      has_more: boolean;
    }>(`${ENDPOINTS.TRANSACTIONS}${queryString}`);
  }

  /**
   * Gets a single transaction by ID
   * 
   * @param transactionId ID of the transaction to retrieve
   * @returns The transaction details
   */
  async getTransaction(transactionId: string): Promise<Transaction> {
    if (!transactionId) throw new Error('transactionId is required');
    
    return this.httpClient.get<Transaction>(
      `${ENDPOINTS.TRANSACTIONS}/${transactionId}`
    );
  }
}