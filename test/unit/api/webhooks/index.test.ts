import { WebhooksApi } from '../../../../src/api/webhooks';
import { HttpClient } from '../../../../src/http/client';
import { ENDPOINTS } from '../../../../src/common/constants';
import {
  WebhookEvent,
  WebhookSecurityStrategy,
  WebhookStatus,
  Webhook,
} from '../../../../src/api/webhooks/types';
import * as crypto from 'crypto';

// Mock HttpClient and crypto
jest.mock('../../../../src/http/client');
jest.mock('crypto');

describe('WebhooksApi', () => {
  let httpClient: jest.Mocked<HttpClient>;
  let webhooksApi: WebhooksApi;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    httpClient = new HttpClient({ apiKey: 'test_key' }) as jest.Mocked<HttpClient>;
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    webhooksApi = new WebhooksApi(httpClient);
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it('should show a deprecation warning when instantiated', () => {
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'WebhooksApi is deprecated and will be removed in a future version',
    );
  });

  describe('listWebhooks', () => {
    it('should list webhooks without parameters', async () => {
      const mockResponse = {
        page_info: {
          has_next_page: false,
        },
        items: [
          {
            id: 'webhook-123',
            url: 'https://example.com/webhook',
            events: [WebhookEvent.CHECKOUT_SESSION_COMPLETED],
            security_strategy: WebhookSecurityStrategy.SIGNING_SECRET,
            status: WebhookStatus.ACTIVE,
            created_at: '2023-05-15T10:00:00Z',
            updated_at: '2023-05-15T10:00:00Z',
          },
        ],
      };

      httpClient.get.mockResolvedValueOnce(mockResponse);

      const result = await webhooksApi.listWebhooks();

      expect(httpClient.get).toHaveBeenCalledWith(ENDPOINTS.WEBHOOKS);
      expect(result).toEqual(mockResponse);
    });

    it('should list webhooks with parameters', async () => {
      const mockResponse = {
        page_info: {
          has_next_page: true,
          end_cursor: 'next-cursor',
        },
        items: [
          {
            id: 'webhook-123',
            url: 'https://example.com/webhook',
            events: [WebhookEvent.CHECKOUT_SESSION_COMPLETED],
            security_strategy: WebhookSecurityStrategy.SIGNING_SECRET,
            status: WebhookStatus.ACTIVE,
            created_at: '2023-05-15T10:00:00Z',
            updated_at: '2023-05-15T10:00:00Z',
          },
        ],
      };

      httpClient.get.mockResolvedValueOnce(mockResponse);

      const params = {
        event: WebhookEvent.CHECKOUT_SESSION_COMPLETED,
        status: WebhookStatus.ACTIVE,
        after: 'cursor-123',
      };

      const result = await webhooksApi.listWebhooks(params);

      expect(httpClient.get).toHaveBeenCalledWith(
        `${ENDPOINTS.WEBHOOKS}?event=checkout.session.completed&status=active&after=cursor-123`,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createWebhook', () => {
    it('should create a webhook successfully', async () => {
      const mockRequest = {
        url: 'https://example.com/webhook',
        events: [WebhookEvent.CHECKOUT_SESSION_COMPLETED],
        security_strategy: WebhookSecurityStrategy.SIGNING_SECRET,
        description: 'Test webhook',
      };

      const mockResponse: Webhook = {
        id: 'webhook-123',
        url: 'https://example.com/webhook',
        events: [WebhookEvent.CHECKOUT_SESSION_COMPLETED],
        security_strategy: WebhookSecurityStrategy.SIGNING_SECRET,
        status: WebhookStatus.ACTIVE,
        description: 'Test webhook',
        secret: 'webhook-secret-123',
        created_at: '2023-05-15T10:00:00Z',
        updated_at: '2023-05-15T10:00:00Z',
      };

      httpClient.post.mockResolvedValueOnce(mockResponse);

      const result = await webhooksApi.createWebhook(mockRequest);

      expect(httpClient.post).toHaveBeenCalledWith(ENDPOINTS.WEBHOOKS, mockRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when required fields are missing', async () => {
      // Missing URL
      const invalidRequest1 = {
        url: '',
        events: [WebhookEvent.CHECKOUT_SESSION_COMPLETED],
        security_strategy: WebhookSecurityStrategy.SIGNING_SECRET,
      };

      await expect(webhooksApi.createWebhook(invalidRequest1)).rejects.toThrow(
        'url is required',
      );

      // Missing events
      const invalidRequest2 = {
        url: 'https://example.com/webhook',
        events: [],
        security_strategy: WebhookSecurityStrategy.SIGNING_SECRET,
      };

      await expect(webhooksApi.createWebhook(invalidRequest2)).rejects.toThrow(
        'events array is required and must not be empty',
      );

      // Missing security strategy
      const invalidRequest3 = {
        url: 'https://example.com/webhook',
        events: [WebhookEvent.CHECKOUT_SESSION_COMPLETED],
        security_strategy: '' as WebhookSecurityStrategy,
      };

      await expect(webhooksApi.createWebhook(invalidRequest3)).rejects.toThrow(
        'security_strategy is required',
      );

      expect(httpClient.post).not.toHaveBeenCalled();
    });
  });

  describe('getWebhook', () => {
    it('should get a webhook by ID', async () => {
      const mockResponse: Webhook = {
        id: 'webhook-123',
        url: 'https://example.com/webhook',
        events: [WebhookEvent.CHECKOUT_SESSION_COMPLETED],
        security_strategy: WebhookSecurityStrategy.SIGNING_SECRET,
        status: WebhookStatus.ACTIVE,
        description: 'Test webhook',
        created_at: '2023-05-15T10:00:00Z',
        updated_at: '2023-05-15T10:00:00Z',
      };

      httpClient.get.mockResolvedValueOnce(mockResponse);

      const result = await webhooksApi.getWebhook('webhook-123');

      expect(httpClient.get).toHaveBeenCalledWith(`${ENDPOINTS.WEBHOOKS}/webhook-123`);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when webhook ID is not provided', async () => {
      await expect(webhooksApi.getWebhook('')).rejects.toThrow('webhookId is required');
      expect(httpClient.get).not.toHaveBeenCalled();
    });
  });

  describe('updateWebhook', () => {
    it('should update a webhook', async () => {
      const updateRequest = {
        url: 'https://example.com/updated-webhook',
        events: [WebhookEvent.CHECKOUT_SESSION_COMPLETED, WebhookEvent.B2B_PAYMENT_RECEIVED],
        description: 'Updated webhook',
        status: WebhookStatus.INACTIVE,
      };

      const mockResponse: Webhook = {
        id: 'webhook-123',
        url: 'https://example.com/updated-webhook',
        events: [WebhookEvent.CHECKOUT_SESSION_COMPLETED, WebhookEvent.B2B_PAYMENT_RECEIVED],
        security_strategy: WebhookSecurityStrategy.SIGNING_SECRET,
        status: WebhookStatus.INACTIVE,
        description: 'Updated webhook',
        created_at: '2023-05-15T10:00:00Z',
        updated_at: '2023-05-16T10:00:00Z',
      };

      httpClient.post.mockResolvedValueOnce(mockResponse);

      const result = await webhooksApi.updateWebhook('webhook-123', updateRequest);

      expect(httpClient.post).toHaveBeenCalledWith(
        `${ENDPOINTS.WEBHOOKS}/webhook-123`,
        updateRequest,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when webhook ID is not provided', async () => {
      await expect(
        webhooksApi.updateWebhook('', { url: 'https://example.com/updated-webhook' }),
      ).rejects.toThrow('webhookId is required');
      expect(httpClient.post).not.toHaveBeenCalled();
    });
  });

  describe('deleteWebhook', () => {
    it('should delete a webhook', async () => {
      httpClient.post.mockResolvedValueOnce(undefined);

      await webhooksApi.deleteWebhook('webhook-123');

      expect(httpClient.post).toHaveBeenCalledWith(
        `${ENDPOINTS.WEBHOOKS}/webhook-123/delete`,
        {},
      );
    });

    it('should throw error when webhook ID is not provided', async () => {
      await expect(webhooksApi.deleteWebhook('')).rejects.toThrow('webhookId is required');
      expect(httpClient.post).not.toHaveBeenCalled();
    });
  });

  describe('verifySignatureSecret', () => {
    it('should verify a valid signature', () => {
      const payload = JSON.stringify({ id: 'event-123', type: 'checkout.session.completed' });
      const signature = 't=1623158400,v1=abc123';
      const secret = 'webhook-secret';

      // Mock crypto.createHmac
      const mockHmac = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('abc123'),
      };
      (crypto.createHmac as jest.Mock).mockReturnValue(mockHmac);

      const result = webhooksApi.verifySignatureSecret({
        payload,
        signature,
        secret,
      });

      expect(result).toBe(true);
      expect(crypto.createHmac).toHaveBeenCalledWith('sha256', secret);
      expect(mockHmac.update).toHaveBeenCalledWith('1623158400' + payload);
      expect(mockHmac.digest).toHaveBeenCalledWith('hex');
    });

    it('should return false for invalid signature', () => {
      const payload = JSON.stringify({ id: 'event-123', type: 'checkout.session.completed' });
      const signature = 't=1623158400,v1=abc123';
      const secret = 'webhook-secret';

      // Mock crypto.createHmac
      const mockHmac = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('invalid-signature'),
      };
      (crypto.createHmac as jest.Mock).mockReturnValue(mockHmac);

      const result = webhooksApi.verifySignatureSecret({
        payload,
        signature,
        secret,
      });

      expect(result).toBe(false);
    });

    it('should return false for invalid signature format', () => {
      const payload = JSON.stringify({ id: 'event-123', type: 'checkout.session.completed' });
      const signature = 'invalid-format';
      const secret = 'webhook-secret';

      const result = webhooksApi.verifySignatureSecret({
        payload,
        signature,
        secret,
      });

      expect(result).toBe(false);
      expect(crypto.createHmac).not.toHaveBeenCalled();
    });

    it('should throw error for missing parameters', () => {
      expect(() => webhooksApi.verifySignatureSecret({ payload: '', signature: 'sig', secret: 'sec' })).toThrow(
        'payload is required',
      );
      expect(() => webhooksApi.verifySignatureSecret({ payload: 'payload', signature: '', secret: 'sec' })).toThrow(
        'signature is required',
      );
      expect(() => webhooksApi.verifySignatureSecret({ payload: 'payload', signature: 'sig', secret: '' })).toThrow(
        'secret is required',
      );
    });
  });

  describe('verifySharedSecret', () => {
    it('should verify a valid shared secret', () => {
      const authHeader = 'Bearer webhook-secret-123';
      const secret = 'webhook-secret-123';

      const result = webhooksApi.verifySharedSecret({
        authHeader,
        secret,
      });

      expect(result).toBe(true);
    });

    it('should return false for invalid shared secret', () => {
      const authHeader = 'Bearer incorrect-secret';
      const secret = 'webhook-secret-123';

      const result = webhooksApi.verifySharedSecret({
        authHeader,
        secret,
      });

      expect(result).toBe(false);
    });

    it('should return false for invalid auth header format', () => {
      const authHeader = 'Invalid-Format webhook-secret-123';
      const secret = 'webhook-secret-123';

      const result = webhooksApi.verifySharedSecret({
        authHeader,
        secret,
      });

      expect(result).toBe(false);
    });

    it('should throw error for missing parameters', () => {
      expect(() => webhooksApi.verifySharedSecret({ authHeader: '', secret: 'sec' })).toThrow(
        'authHeader is required',
      );
      expect(() => webhooksApi.verifySharedSecret({ authHeader: 'Bearer secret', secret: '' })).toThrow(
        'secret is required',
      );
    });
  });

  describe('testWebhook', () => {
    it('should send a test event to a webhook', async () => {
      const mockResponse = { success: true };
      httpClient.post.mockResolvedValueOnce(mockResponse);

      const result = await webhooksApi.testWebhook('webhook-123');

      expect(httpClient.post).toHaveBeenCalledWith(
        `${ENDPOINTS.WEBHOOKS}/webhook-123/test`,
        {},
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when webhook ID is not provided', async () => {
      await expect(webhooksApi.testWebhook('')).rejects.toThrow('webhookId is required');
      expect(httpClient.post).not.toHaveBeenCalled();
    });
  });
});