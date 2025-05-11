import { CheckoutApi } from '../../../../src/api/checkout';
import { HttpClient } from '../../../../src/http/client';
import { ENDPOINTS } from '../../../../src/common/constants';
import {
  CreateCheckoutSessionRequest,
  CheckoutSession,
  CheckoutSessionStatus,
  PaymentStatus,
} from '../../../../src/api/checkout/types';
import * as utils from '../../../../src/common/utils';

// Mock HttpClient and formatAmount utility
jest.mock('../../../../src/http/client');
jest.mock('../../../../src/common/utils', () => ({
  formatAmount: jest.fn().mockReturnValue('1000.00'),
}));

describe('CheckoutApi', () => {
  let httpClient: jest.Mocked<HttpClient>;
  let checkoutApi: CheckoutApi;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test_key' }) as jest.Mocked<HttpClient>;
    checkoutApi = new CheckoutApi(httpClient);
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    it('should create a checkout session successfully', async () => {
      const mockRequest: CreateCheckoutSessionRequest = {
        amount: 1000,
        currency: 'XOF',
        success_url: 'https://example.com/success',
        error_url: 'https://example.com/error',
        client_reference: 'ref123',
      };

      const mockResponse: CheckoutSession = {
        id: 'sess_123',
        amount: '1000.00',
        checkout_status: CheckoutSessionStatus.OPEN,
        currency: 'XOF',
        error_url: 'https://example.com/error',
        business_name: 'Test Business',
        payment_status: PaymentStatus.PROCESSING,
        success_url: 'https://example.com/success',
        wave_launch_url: 'https://wave.com/launch/sess_123',
        when_created: '2023-05-15T10:00:00Z',
        when_expires: '2023-05-15T11:00:00Z',
        client_reference: 'ref123',
      };

      httpClient.post.mockResolvedValueOnce(mockResponse);

      const result = await checkoutApi.createSession(mockRequest);

      expect(utils.formatAmount).toHaveBeenCalledWith(1000, 'XOF');
      expect(httpClient.post).toHaveBeenCalledWith(ENDPOINTS.CHECKOUT_SESSIONS, {
        amount: '1000.00',
        currency: 'XOF',
        success_url: 'https://example.com/success',
        error_url: 'https://example.com/error',
        client_reference: 'ref123',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when required fields are missing', async () => {
      // Missing amount
      const invalidRequest1: CreateCheckoutSessionRequest = {
        amount: '',
        currency: 'XOF',
        success_url: 'https://example.com/success',
        error_url: 'https://example.com/error',
      };

      await expect(checkoutApi.createSession(invalidRequest1)).rejects.toThrow(
        'amount is required',
      );

      // Missing currency
      const invalidRequest2: CreateCheckoutSessionRequest = {
        amount: 1000,
        currency: '' as any,
        success_url: 'https://example.com/success',
        error_url: 'https://example.com/error',
      };

      await expect(checkoutApi.createSession(invalidRequest2)).rejects.toThrow(
        'currency is required',
      );

      // Missing success_url
      const invalidRequest3: CreateCheckoutSessionRequest = {
        amount: 1000,
        currency: 'XOF',
        success_url: '',
        error_url: 'https://example.com/error',
      };

      await expect(checkoutApi.createSession(invalidRequest3)).rejects.toThrow(
        'success_url is required',
      );

      // Missing error_url
      const invalidRequest4: CreateCheckoutSessionRequest = {
        amount: 1000,
        currency: 'XOF',
        success_url: 'https://example.com/success',
        error_url: '',
      };

      await expect(checkoutApi.createSession(invalidRequest4)).rejects.toThrow(
        'error_url is required',
      );

      expect(httpClient.post).not.toHaveBeenCalled();
    });
  });

  describe('getSession', () => {
    it('should get a checkout session by ID', async () => {
      const mockResponse: CheckoutSession = {
        id: 'sess_123',
        amount: '1000.00',
        checkout_status: CheckoutSessionStatus.COMPLETE,
        currency: 'XOF',
        error_url: 'https://example.com/error',
        business_name: 'Test Business',
        payment_status: PaymentStatus.SUCCEEDED,
        transaction_id: 'tx_123',
        success_url: 'https://example.com/success',
        wave_launch_url: 'https://wave.com/launch/sess_123',
        when_created: '2023-05-15T10:00:00Z',
        when_completed: '2023-05-15T10:15:00Z',
        when_expires: '2023-05-15T11:00:00Z',
      };

      httpClient.get.mockResolvedValueOnce(mockResponse);

      const result = await checkoutApi.getSession('sess_123');

      expect(httpClient.get).toHaveBeenCalledWith(`${ENDPOINTS.CHECKOUT_SESSIONS}/sess_123`);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when session ID is not provided', async () => {
      await expect(checkoutApi.getSession('')).rejects.toThrow('sessionId is required');
      expect(httpClient.get).not.toHaveBeenCalled();
    });
  });

  describe('getSessionByTransactionId', () => {
    it('should get a checkout session by transaction ID', async () => {
      const mockResponse: CheckoutSession = {
        id: 'sess_123',
        amount: '1000.00',
        checkout_status: CheckoutSessionStatus.COMPLETE,
        currency: 'XOF',
        error_url: 'https://example.com/error',
        business_name: 'Test Business',
        payment_status: PaymentStatus.SUCCEEDED,
        transaction_id: 'tx_123',
        success_url: 'https://example.com/success',
        wave_launch_url: 'https://wave.com/launch/sess_123',
        when_created: '2023-05-15T10:00:00Z',
        when_completed: '2023-05-15T10:15:00Z',
        when_expires: '2023-05-15T11:00:00Z',
      };

      httpClient.get.mockResolvedValueOnce(mockResponse);

      const result = await checkoutApi.getSessionByTransactionId('tx_123');

      expect(httpClient.get).toHaveBeenCalledWith(
        `${ENDPOINTS.CHECKOUT_SESSIONS}?transaction_id=tx_123`,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when transaction ID is not provided', async () => {
      await expect(checkoutApi.getSessionByTransactionId('')).rejects.toThrow(
        'transactionId is required',
      );
      expect(httpClient.get).not.toHaveBeenCalled();
    });
  });

  describe('searchSessions', () => {
    it('should search for checkout sessions by client reference', async () => {
      const mockResponse = {
        result: [
          {
            id: 'sess_123',
            amount: '1000.00',
            checkout_status: CheckoutSessionStatus.COMPLETE,
            currency: 'XOF',
            error_url: 'https://example.com/error',
            business_name: 'Test Business',
            payment_status: PaymentStatus.SUCCEEDED,
            transaction_id: 'tx_123',
            success_url: 'https://example.com/success',
            wave_launch_url: 'https://wave.com/launch/sess_123',
            when_created: '2023-05-15T10:00:00Z',
            when_completed: '2023-05-15T10:15:00Z',
            when_expires: '2023-05-15T11:00:00Z',
            client_reference: 'ref123',
          },
        ],
      };

      httpClient.get.mockResolvedValueOnce(mockResponse);

      const result = await checkoutApi.searchSessions('ref123');

      expect(httpClient.get).toHaveBeenCalledWith(
        `${ENDPOINTS.CHECKOUT_SESSIONS}/search?client_reference=ref123`,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when client reference is not provided', async () => {
      await expect(checkoutApi.searchSessions('')).rejects.toThrow('clientReference is required');
      expect(httpClient.get).not.toHaveBeenCalled();
    });
  });

  describe('refundSession', () => {
    it('should refund a checkout session', async () => {
      httpClient.post.mockResolvedValueOnce(undefined);

      await checkoutApi.refundSession('sess_123');

      expect(httpClient.post).toHaveBeenCalledWith(
        `${ENDPOINTS.CHECKOUT_SESSIONS}/sess_123/refund`,
      );
    });

    it('should throw error when session ID is not provided', async () => {
      await expect(checkoutApi.refundSession('')).rejects.toThrow('sessionId is required');
      expect(httpClient.post).not.toHaveBeenCalled();
    });
  });

  describe('expireSession', () => {
    it('should expire a checkout session', async () => {
      httpClient.post.mockResolvedValueOnce(undefined);

      await checkoutApi.expireSession('sess_123');

      expect(httpClient.post).toHaveBeenCalledWith(
        `${ENDPOINTS.CHECKOUT_SESSIONS}/sess_123/expire`,
      );
    });

    it('should throw error when session ID is not provided', async () => {
      await expect(checkoutApi.expireSession('')).rejects.toThrow('sessionId is required');
      expect(httpClient.post).not.toHaveBeenCalled();
    });
  });
});
