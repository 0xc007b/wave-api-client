import { HttpClient } from '../../http/client';
import { ENDPOINTS } from '../../common/constants';
import { MerchantDetails, MerchantListParams } from './types';
import { createQueryString } from '../../common/utils';

/**
 * Aggregated Merchants API client
 */
export class MerchantsApi {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Lists merchants
   *
   * @param params Optional parameters for filtering merchants
   * @returns A paginated list of merchants
   */
  async listMerchants(params?: MerchantListParams): Promise<{
    data: MerchantDetails[];
    cursor?: string;
    has_more: boolean;
  }> {
    const queryString = params ? createQueryString(params) : '';
    return this.httpClient.get<{
      data: MerchantDetails[];
      cursor?: string;
      has_more: boolean;
    }>(`${ENDPOINTS.AGGREGATED_MERCHANTS}${queryString}`);
  }

  /**
   * Gets a merchant by ID
   *
   * @param merchantId ID of the merchant to retrieve
   * @returns The merchant details
   */
  async getMerchant(merchantId: string): Promise<MerchantDetails> {
    if (!merchantId) throw new Error('merchantId is required');

    return this.httpClient.get<MerchantDetails>(`${ENDPOINTS.AGGREGATED_MERCHANTS}/${merchantId}`);
  }
}
