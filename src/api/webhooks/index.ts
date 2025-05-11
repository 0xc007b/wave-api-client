import { HttpClient } from '../../http/client';
import { ENDPOINTS } from '../../common/constants';
import { createQueryString } from '../../common/utils';
import {
  CreateWebhookRequest,
  UpdateWebhookRequest,
  Webhook,
  WebhookListParams,
  VerifySignatureSecretParams,
  VerifySharedSecretParams,
} from './types';
import * as crypto from 'crypto';

/**
 * Webhooks API client
 * @deprecated This API is being deprecated and will be removed in a future version
 */
export class WebhooksApi {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
    console.warn('WebhooksApi is deprecated and will be removed in a future version');
  }

  /**
   * Lists webhooks
   *
   * @deprecated This method is being deprecated and will be removed in a future version
   * @param params Optional parameters for filtering webhooks
   * @returns A paginated list of webhooks
   */
  async listWebhooks(params?: WebhookListParams): Promise<{
    page_info: {
      has_next_page: boolean;
      end_cursor?: string;
    };
    items: Webhook[];
  }> {
    const queryString = params ? createQueryString(params) : '';
    return this.httpClient.get<{
      page_info: {
        has_next_page: boolean;
        end_cursor?: string;
      };
      items: Webhook[];
    }>(`${ENDPOINTS.WEBHOOKS}${queryString}`);
  }

  /**
   * Creates a new webhook
   *
   * @deprecated This method is being deprecated and will be removed in a future version
   * @param options Webhook creation options
   * @returns The created webhook
   */
  async createWebhook(options: CreateWebhookRequest): Promise<Webhook> {
    const { url, events, security_strategy, description } = options;

    // Validate required fields
    if (!url) throw new Error('url is required');
    if (!events || !Array.isArray(events) || events.length === 0) {
      throw new Error('events array is required and must not be empty');
    }
    if (!security_strategy) throw new Error('security_strategy is required');

    return this.httpClient.post<Webhook>(ENDPOINTS.WEBHOOKS, {
      url,
      events,
      security_strategy,
      description,
    });
  }

  /**
   * Gets a webhook by ID
   *
   * @deprecated This method is being deprecated and will be removed in a future version
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
   * @deprecated This method is being deprecated and will be removed in a future version
   * @param webhookId ID of the webhook to update
   * @param options Webhook update options
   * @returns The updated webhook
   */
  async updateWebhook(webhookId: string, options: UpdateWebhookRequest): Promise<Webhook> {
    if (!webhookId) throw new Error('webhookId is required');

    return this.httpClient.post<Webhook>(`${ENDPOINTS.WEBHOOKS}/${webhookId}`, options);
  }

  /**
   * Deletes a webhook
   *
   * @deprecated This method is being deprecated and will be removed in a future version
   * @param webhookId ID of the webhook to delete
   * @returns Confirmation of deletion
   */
  async deleteWebhook(webhookId: string): Promise<void> {
    if (!webhookId) throw new Error('webhookId is required');

    return this.httpClient.post<void>(`${ENDPOINTS.WEBHOOKS}/${webhookId}/delete`, {});
  }

  /**
   * Verifies a webhook signature
   *
   * @deprecated This method is being deprecated and will be removed in a future version
   * @param params Parameters for verification
   * @returns Whether the signature is valid
   */
  verifySignatureSecret(params: VerifySignatureSecretParams): boolean {
    const { payload, signature, secret } = params;

    if (!payload) throw new Error('payload is required');
    if (!signature) throw new Error('signature is required');
    if (!secret) throw new Error('secret is required');

    try {
      // Parse the Wave-Signature header
      const parts = signature.split(',');
      const timestampPart = parts.find((part) => part.startsWith('t='));

      if (!timestampPart) return false;

      const timestamp = timestampPart.substring(2); // Remove 't=' prefix
      const signatureParts = parts.filter((part) => part.startsWith('v1='));
      const signatureValues = signatureParts.map((part) => part.substring(3)); // Remove 'v1=' prefix

      // Compute the HMAC using the timestamp and payload
      const hmac = crypto.createHmac('sha256', secret);
      const calculatedSignature = hmac.update(timestamp + payload).digest('hex');

      // Check if our computed signature matches any of the provided signatures
      return signatureValues.includes(calculatedSignature);
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifies a shared secret from Authorization header
   *
   * @deprecated This method is being deprecated and will be removed in a future version
   * @param params Parameters for verification
   * @returns Whether the shared secret is valid
   */
  verifySharedSecret(params: VerifySharedSecretParams): boolean {
    const { authHeader, secret } = params;

    if (!authHeader) throw new Error('authHeader is required');
    if (!secret) throw new Error('secret is required');

    try {
      // Authorization header should be in format 'Bearer {secret}'
      const parts = authHeader.split(' ');
      if (parts.length !== 2 || parts[0] !== 'Bearer') return false;

      const providedSecret = parts[1];
      return providedSecret === secret;
    } catch (error) {
      return false;
    }
  }

  /**
   * Sends a test event to a webhook endpoint
   *
   * @deprecated This method is being deprecated and will be removed in a future version
   * @param webhookId ID of the webhook to test
   * @returns Confirmation of the test event being sent
   */
  async testWebhook(webhookId: string): Promise<{ success: boolean }> {
    if (!webhookId) throw new Error('webhookId is required');

    return this.httpClient.post<{ success: boolean }>(
      `${ENDPOINTS.WEBHOOKS}/${webhookId}/test`,
      {},
    );
  }
}
