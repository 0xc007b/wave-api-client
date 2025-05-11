import { HttpClient } from '../../http/client';
import { ENDPOINTS, HEADERS } from '../../common/constants';
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
   * @param idempotencyKey A unique key to ensure idempotent requests
   * @returns The created payout
   */
  async createPayout(options: CreatePayoutRequest, idempotencyKey: string): Promise<Payout> {
    const { receive_amount, currency, mobile, ...rest } = options;

    // Validate required fields
    if (!receive_amount) throw new Error('receive_amount is required');
    if (!currency) throw new Error('currency is required');
    if (!mobile) throw new Error('mobile is required');
    if (!idempotencyKey) throw new Error('idempotencyKey is required');

    // Format the amount according to the currency
    const formattedAmount = formatAmount(receive_amount, currency);

    const headers = {
      [HEADERS.IDEMPOTENCY_KEY]: idempotencyKey,
    };

    return this.httpClient.post<Payout>(
      ENDPOINTS.PAYOUT,
      {
        receive_amount: formattedAmount,
        currency,
        mobile,
        ...rest,
      },
      { headers },
    );
  }

  /**
   * Creates a batch of payouts
   *
   * @param options Batch payout options
   * @param idempotencyKey A unique key to ensure idempotent requests
   * @returns The created payout batch
   */
  async createPayoutBatch(
    options: CreatePayoutBatchRequest,
    idempotencyKey: string,
  ): Promise<PayoutBatch> {
    const { payouts } = options;

    // Validate required fields
    if (!payouts || !Array.isArray(payouts) || payouts.length === 0) {
      throw new Error('payouts array is required and must not be empty');
    }
    if (!idempotencyKey) throw new Error('idempotencyKey is required');

    // Format each payout receive_amount
    const formattedPayouts = payouts.map((payout) => ({
      ...payout,
      receive_amount: formatAmount(payout.receive_amount, payout.currency),
    }));

    const headers = {
      [HEADERS.IDEMPOTENCY_KEY]: idempotencyKey,
    };

    return this.httpClient.post<PayoutBatch>(
      ENDPOINTS.PAYOUT_BATCH,
      { payouts: formattedPayouts },
      { headers },
    );
  }

  /**
   * Gets a payout by ID
   *
   * @param payoutId ID of the payout to retrieve
   * @returns The payout details
   */
  async getPayout(payoutId: string): Promise<Payout> {
    if (!payoutId) throw new Error('payoutId is required');

    return this.httpClient.get<Payout>(`${ENDPOINTS.PAYOUT}/${payoutId}`);
  }

  /**
   * Gets a payout batch by ID
   *
   * @param batchId ID of the payout batch to retrieve
   * @returns The payout batch details
   */
  async getPayoutBatch(batchId: string): Promise<PayoutBatch> {
    if (!batchId) throw new Error('batchId is required');

    return this.httpClient.get<PayoutBatch>(`${ENDPOINTS.PAYOUT_BATCH}/${batchId}`);
  }

  /**
   * Searches for payouts by client reference
   *
   * @param clientReference Client reference to search for
   * @returns List of matching payouts
   */
  async searchPayouts(clientReference: string): Promise<{ result: Payout[] }> {
    if (!clientReference) throw new Error('clientReference is required');

    return this.httpClient.get<{ result: Payout[] }>(
      `${ENDPOINTS.PAYOUTS_SEARCH}?client_reference=${clientReference}`,
    );
  }

  /**
   * Reverses a payout
   *
   * @param payoutId ID of the payout to reverse
   * @returns Empty response if successful
   */
  async reversePayout(payoutId: string): Promise<void> {
    if (!payoutId) throw new Error('payoutId is required');

    return this.httpClient.post<void>(`${ENDPOINTS.PAYOUT}/${payoutId}/reverse`);
  }
}
