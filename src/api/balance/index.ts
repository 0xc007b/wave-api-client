import { HttpClient } from '../../http/client';
import { ENDPOINTS } from '../../common/constants';
import { createQueryString } from '../../common/utils';
import { Balance, BalanceParams, TransactionListParams, TransactionListResponse } from './types';

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
   * @param params Optional parameters
   * @returns The current balance information
   */
  async getBalance(params?: BalanceParams): Promise<Balance> {
    const queryParams = params ? createQueryString(params) : '';
    return this.httpClient.get<Balance>(`${ENDPOINTS.BALANCE}${queryParams}`);
  }

  /**
   * Lists transactions for the wallet for a given day
   *
   * @param params Optional parameters for filtering transactions
   * @returns A paginated list of transactions
   */
  async listTransactions(params?: TransactionListParams): Promise<TransactionListResponse> {
    const queryParams = params ? createQueryString(params) : '';
    return this.httpClient.get<TransactionListResponse>(`${ENDPOINTS.TRANSACTIONS}${queryParams}`);
  }

  /**
   * Refunds a transaction
   *
   * @param transactionId ID of the transaction to refund
   * @returns No content on success
   */
  async refundTransaction(transactionId: string): Promise<void> {
    if (!transactionId) throw new Error('transactionId is required');

    return this.httpClient.post<void>(`${ENDPOINTS.TRANSACTIONS}/${transactionId}/refund`, {});
  }
}
