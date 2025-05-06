import { HttpClient } from '../../http/client';
import { ENDPOINTS } from '../../common/constants';
import { Currency } from '../../common/types';
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
}