import { HttpClient } from '../../http/client';
import { ENDPOINTS } from '../../common/constants';
import { formatAmount } from '../../common/utils';
import { CreateCheckoutSessionRequest, CheckoutSession } from './types';

/**
 * Checkout API client
 */
export class CheckoutApi {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Creates a new checkout session
   *
   * @param options Checkout session options
   * @returns The created checkout session
   */
  async createSession(options: CreateCheckoutSessionRequest): Promise<CheckoutSession> {
    const { amount, currency, success_url, error_url, ...rest } = options;

    // Validate required fields
    if (!amount) throw new Error('amount is required');
    if (!currency) throw new Error('currency is required');
    if (!success_url) throw new Error('success_url is required');
    if (!error_url) throw new Error('error_url is required');

    // Format the amount according to the currency
    const formattedAmount = formatAmount(amount, currency);

    return this.httpClient.post<CheckoutSession>(ENDPOINTS.CHECKOUT_SESSIONS, {
      amount: formattedAmount,
      currency,
      success_url,
      error_url,
      ...rest,
    });
  }

  /**
   * Retrieves a checkout session by ID
   *
   * @param sessionId The ID of the checkout session to retrieve
   * @returns The checkout session
   */
  async getSession(sessionId: string): Promise<CheckoutSession> {
    if (!sessionId) throw new Error('sessionId is required');

    return this.httpClient.get<CheckoutSession>(`${ENDPOINTS.CHECKOUT_SESSIONS}/${sessionId}`);
  }

  /**
   * Retrieves a checkout session by transaction ID
   *
   * @param transactionId The transaction ID associated with the checkout session
   * @returns The checkout session
   */
  async getSessionByTransactionId(transactionId: string): Promise<CheckoutSession> {
    if (!transactionId) throw new Error('transactionId is required');

    return this.httpClient.get<CheckoutSession>(
      `${ENDPOINTS.CHECKOUT_SESSIONS}?transaction_id=${transactionId}`,
    );
  }

  /**
   * Searches for checkout sessions by client reference
   *
   * @param clientReference The client reference to search for
   * @returns An array of matching checkout sessions
   */
  async searchSessions(clientReference: string): Promise<{ result: CheckoutSession[] }> {
    if (!clientReference) throw new Error('clientReference is required');

    return this.httpClient.get<{ result: CheckoutSession[] }>(
      `${ENDPOINTS.CHECKOUT_SESSIONS}/search?client_reference=${clientReference}`,
    );
  }

  /**
   * Refunds a checkout session
   *
   * @param sessionId The ID of the checkout session to refund
   * @returns An empty response upon success
   */
  async refundSession(sessionId: string): Promise<void> {
    if (!sessionId) throw new Error('sessionId is required');

    return this.httpClient.post<void>(`${ENDPOINTS.CHECKOUT_SESSIONS}/${sessionId}/refund`);
  }

  /**
   * Expires an open checkout session
   *
   * @param sessionId The ID of the checkout session to expire
   * @returns An empty response upon success
   */
  async expireSession(sessionId: string): Promise<void> {
    if (!sessionId) throw new Error('sessionId is required');

    return this.httpClient.post<void>(`${ENDPOINTS.CHECKOUT_SESSIONS}/${sessionId}/expire`);
  }
}
