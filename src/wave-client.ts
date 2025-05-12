import { validateConfig } from './config';
import { HttpClient } from './http/client';
import { WaveApiConfig } from './common/types';
import { BalanceApi } from './api/balance';
import { CheckoutApi } from './api/checkout';
import { PayoutApi } from './api/payout';
import { MerchantsApi } from './api/merchants';

/**
 * Main Wave API client
 */
export class WaveClient {
  private config: WaveApiConfig;
  private httpClient: HttpClient;

  /** Balance & Reconciliation API */
  public readonly balance: BalanceApi;

  /** Checkout API */
  public readonly checkout: CheckoutApi;

  /** Payout API */
  public readonly payout: PayoutApi;

  /** Aggregated Merchants API */
  public readonly merchants: MerchantsApi;

  /**
   * Creates a new Wave API client instance
   * @param config Client configuration
   */
  constructor(config: WaveApiConfig) {
    this.config = validateConfig(config);
    this.httpClient = new HttpClient(this.config);

    // Initialize API modules
    this.balance = new BalanceApi(this.httpClient);
    this.checkout = new CheckoutApi(this.httpClient);
    this.payout = new PayoutApi(this.httpClient);
    this.merchants = new MerchantsApi(this.httpClient);
  }
}
