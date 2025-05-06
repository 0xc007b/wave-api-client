import { HttpClient } from '../../http/client';
import { ENDPOINTS } from '../../common/constants';
import { createQueryString } from '../../common/utils';
import { 
  CreateWebhookRequest, 
  UpdateWebhookRequest,
  Webhook, 
  WebhookEvent, 
  WebhookListParams,
  VerifyWebhookSignatureParams 
} from './types';
import * as crypto from 'crypto';

/**
 * Webhooks API client
 */
export class WebhooksApi {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Lists webhooks
   * 
   * @param params Optional parameters for filtering webhooks
   * @returns A paginated list of webhooks
   */
  async listWebhooks(params?: WebhookListParams): Promise<{
    data: Webhook[];
    cursor?: string;
    has_more: boolean;
  }> {
    const queryString = params ? createQueryString(params) : '';
    return this.httpClient.get<{
      data: Webhook[];
      cursor?: string;
      has_more: boolean;
    }>(`${ENDPOINTS.WEBHOOKS}${queryString}`);
  }

  /**
   * Creates a new webhook
   * 
   * @param options Webhook creation options
   * @returns The created webhook
   */
  async createWebhook(options: CreateWebhookRequest): Promise<Webhook> {
    const { url, events, description, ...rest } = options;

    // Validate required fields
    if (!url) throw new Error('url is required');
    if (!events || !Array.isArray(events) || events.length === 0) {
      throw new Error('events array is required and must not be empty');
    }

    return this.httpClient.post<Webhook>(ENDPOINTS.WEBHOOKS, {
      url,
      events,
      description,
      ...rest,
    });
  }

  /**
   * Gets a webhook by ID
   * 
   * @param webhookId ID of the webhook to retrieve
   * @returns The webhook details
   */
  async getWebhook(webhookId: string): Promise<Webhook> {
    if (!webhookId) throw new Error('webhookId is required');
    
    return this.httpClient.get<Webhook>(`${ENDPOINTS.WEBHOOKS}/${webhookId}`);
  }

  /**
   * Updates a webhook
   * 
   * @param webhookId ID of the webhook to update
   * @param options Webhook update options
   * @returns The updated webhook
   */
  async updateWebhook(webhookId: string, options: UpdateWebhookRequest): Promise<Webhook> {
    if (!webhookId) throw new Error('webhookId is required');
    
    return this.httpClient.post<Webhook>(
      `${ENDPOINTS.WEBHOOKS}/${webhookId}`,
      options
    );
  }

  /**
   * Deletes a webhook
   * 
   * @param webhookId ID of the webhook to delete
   * @returns Confirmation of deletion
   */
  async deleteWebhook(webhookId: string): Promise<{ deleted: boolean }> {
    if (!webhookId) throw new Error('webhookId is required');
    
    return this.httpClient.post<{ deleted: boolean }>(
      `${ENDPOINTS.WEBHOOKS}/${webhookId}/delete`,
      {}
    );
  }

  /**
   * Verifies a webhook signature
   * 
   * @param params Parameters for verification
   * @returns Whether the signature is valid
   */
  verifyWebhookSignature(params: VerifyWebhookSignatureParams): boolean {
    const { payload, signature, secret } = params;
    
    if (!payload) throw new Error('payload is required');
    if (!signature) throw new Error('signature is required');
    if (!secret) throw new Error('secret is required');
    
    try {
      const hmac = crypto.createHmac('sha256', secret);
      const computed = hmac.update(payload).digest('hex');
      return crypto.timingSafeEqual(
        Buffer.from(computed, 'hex'),
        Buffer.from(signature, 'hex')
      );
    } catch (error) {
      return false;
    }
  }
}