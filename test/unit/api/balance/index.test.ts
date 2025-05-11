import { BalanceApi } from '../../../../src/api/balance';
import { HttpClient } from '../../../../src/http/client';
import { ENDPOINTS } from '../../../../src/common/constants';
import { Balance, TransactionListResponse } from '../../../../src/api/balance/types';

// Mock HttpClient
jest.mock('../../../../src/http/client');

describe('BalanceApi', () => {
  let httpClient: jest.Mocked<HttpClient>;
  let balanceApi: BalanceApi;

  beforeEach(() => {
    httpClient = new HttpClient({ apiKey: 'test_key' }) as jest.Mocked<HttpClient>;
    balanceApi = new BalanceApi(httpClient);
    jest.clearAllMocks();
  });

  describe('getBalance', () => {
    it('should get balance without parameters', async () => {
      const mockResponse: Balance = {
        amount: '1000.50',
        currency: 'XOF',
      };

      httpClient.get.mockResolvedValueOnce(mockResponse);

      const result = await balanceApi.getBalance();

      expect(httpClient.get).toHaveBeenCalledWith(ENDPOINTS.BALANCE);
      expect(result).toEqual(mockResponse);
    });

    it('should get balance with parameters', async () => {
      const mockResponse: Balance = {
        amount: '2500.75',
        currency: 'GHS',
      };

      httpClient.get.mockResolvedValueOnce(mockResponse);

      const result = await balanceApi.getBalance({ include_subaccounts: true });

      expect(httpClient.get).toHaveBeenCalledWith(`${ENDPOINTS.BALANCE}?include_subaccounts=true`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('listTransactions', () => {
    it('should list transactions without parameters', async () => {
      const mockResponse: TransactionListResponse = {
        page_info: {
          start_cursor: null,
          end_cursor: 'cursor123',
          has_next_page: true,
        },
        date: '2023-05-15',
        items: [
          {
            timestamp: '2023-05-15T14:30:00Z',
            transaction_id: 'tx123',
            amount: '500.00',
            fee: '10.00',
            currency: 'XOF',
          },
        ],
      };

      httpClient.get.mockResolvedValueOnce(mockResponse);

      const result = await balanceApi.listTransactions();

      expect(httpClient.get).toHaveBeenCalledWith(ENDPOINTS.TRANSACTIONS);
      expect(result).toEqual(mockResponse);
    });

    it('should list transactions with parameters', async () => {
      const mockResponse: TransactionListResponse = {
        page_info: {
          start_cursor: 'prev-cursor',
          end_cursor: 'next-cursor',
          has_next_page: false,
        },
        date: '2023-05-14',
        items: [
          {
            timestamp: '2023-05-14T10:15:00Z',
            transaction_id: 'tx456',
            amount: '750.00',
            fee: '15.00',
            currency: 'GHS',
          },
        ],
      };

      httpClient.get.mockResolvedValueOnce(mockResponse);

      const params = {
        date: '2023-05-14',
        after: 'prev-cursor',
        include_subaccounts: true,
      };

      const result = await balanceApi.listTransactions(params);

      expect(httpClient.get).toHaveBeenCalledWith(
        `${ENDPOINTS.TRANSACTIONS}?date=2023-05-14&after=prev-cursor&include_subaccounts=true`,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('refundTransaction', () => {
    it('should refund a transaction successfully', async () => {
      const transactionId = 'tx789';

      httpClient.post.mockResolvedValueOnce(undefined);

      await balanceApi.refundTransaction(transactionId);

      expect(httpClient.post).toHaveBeenCalledWith(
        `${ENDPOINTS.TRANSACTIONS}/${transactionId}/refund`,
        {},
      );
    });

    it('should throw error when transaction ID is not provided', async () => {
      await expect(balanceApi.refundTransaction('')).rejects.toThrow('transactionId is required');
      expect(httpClient.post).not.toHaveBeenCalled();
    });
  });
});
