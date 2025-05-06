import { HttpClient } from '../../http/client';
import { ENDPOINTS } from '../../common/constants';
import { formatAmount } from '../../common/utils';
import { CreatePayoutRequest, Payout, PayoutBatch, CreatePayoutBatchRequest } from './types';

/**
 * Payout API client
 */
export class PayoutApi {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Creates a single payout
   * 
   * @param options Payout options
   * @returns The created payout
   */
  async createPayout(options: CreatePayoutRequest): Promise<Payout> {
    const { amount, currency, mobile, recipient_name, ...rest } = options;

    // Validate required fields
    if (!amount) throw new Error('amount is required');
    if (!currency) throw new Error('currency is required');
    if (!mobile) throw new Error('mobile is required');

    // Format the amount according to the currency
    const formattedAmount = formatAmount(amount, currency);

    return this.httpClient.post<Payout>(ENDPOINTS.PAYOUTS, {
      amount: formattedAmount,
      currency,
      mobile,
      recipient_name,
      ...rest,
    });
  }

  /**
   * Creates a batch of payouts
   * 
   * @param options Batch payout options
   * @returns The created payout batch
   */
  async createPayoutBatch(options: CreatePayoutBatchRequest): Promise<PayoutBatch> {
    const { payouts, idempotency_key } = options;

    // Validate required fields
    if (!payouts || !Array.isArray(payouts) || payouts.length === 0) {
      throw new Error('payouts array is required and must not be empty');
    }

    // Format each payout amount
    const formattedPayouts = payouts.map(payout => ({
      ...payout,
      amount: formatAmount(payout.amount, payout.currency),
    }));

    return this.httpClient.post<PayoutBatch>(`${ENDPOINTS.PAYOUTS}/batch`, {
      payouts: formattedPayouts,
      idempotency_key,
    });
  }

  /**
   * Gets a payout by ID
   * 
   * @param payoutId ID of the payout to retrieve
   * @returns The payout details
   */
  async getPayout(payoutId: string): Promise<Payout> {
    if (!payoutId) throw new Error('payoutId is required');
    
    return this.httpClient.get<Payout>(`${ENDPOINTS.PAYOUTS}/${payoutId}`);
  }

  /**
   * Gets a payout batch by ID
   * 
   * @param batchId ID of the payout batch to retrieve
   * @returns The payout batch details
   */
  async getPayoutBatch(batchId: string): Promise<PayoutBatch> {
    if (!batchId) throw new Error('batchId is required');
    
    return this.httpClient.get<PayoutBatch>(`${ENDPOINTS.PAYOUTS}/batch/${batchId}`);
  }
}