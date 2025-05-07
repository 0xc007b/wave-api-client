import {
  Balance,
  BalanceParams,
  TransactionListParams,
  TransactionListResponse,
  TransactionType,
  TransactionItem,
} from '../../../../src/api/balance/types';
import { Currency } from '../../../../src/common/types';

describe('Balance API Types', () => {
  // Note: These tests mainly check that the types can be used as expected
  // and that the interfaces allow the correct properties

  describe('Balance Interface', () => {
    it('should create a valid Balance object', () => {
      const balance: Balance = {
        amount: '1000.50',
        currency: 'XOF',
      };

      expect(balance.amount).toBe('1000.50');
      expect(balance.currency).toBe('XOF');
    });

    it('should enforce required properties', () => {
      // This is a type test - it would fail at compile time if properties were missing
      // @ts-expect-error - amount is required
      const invalidBalance1: Balance = {
        currency: 'XOF',
      };

      // @ts-expect-error - currency is required
      const invalidBalance2: Balance = {
        amount: '1000.50',
      };

      // These assertions just make sure the test runs
      expect(true).toBe(true);
    });
  });

  describe('TransactionType Enum', () => {
    it('should have all the required transaction types', () => {
      expect(TransactionType.MERCHANT_PAYMENT).toBe('merchant_payment');
      expect(TransactionType.MERCHANT_PAYMENT_REFUND).toBe('merchant_payment_refund');
      expect(TransactionType.API_CHECKOUT).toBe('api_checkout');
      expect(TransactionType.API_CHECKOUT_REFUND).toBe('api_checkout_refund');
      expect(TransactionType.API_PAYOUT).toBe('api_payout');
      expect(TransactionType.API_PAYOUT_REVERSAL).toBe('api_payout_reversal');
      expect(TransactionType.BULK_PAYMENT).toBe('bulk_payment');
      expect(TransactionType.BULK_PAYMENT_REVERSAL).toBe('bulk_payment_reversal');
      expect(TransactionType.B2B_PAYMENT).toBe('b2b_payment');
      expect(TransactionType.B2B_PAYMENT_REVERSAL).toBe('b2b_payment_reversal');
      expect(TransactionType.MERCHANT_SWEEP).toBe('merchant_sweep');
    });
  });

  describe('BalanceParams Interface', () => {
    it('should create valid BalanceParams objects', () => {
      // Empty object is valid
      const params1: BalanceParams = {};
      expect(params1).toEqual({});

      // With include_subaccounts
      const params2: BalanceParams = {
        include_subaccounts: true,
      };
      expect(params2.include_subaccounts).toBe(true);
    });
  });

  describe('TransactionListParams Interface', () => {
    it('should create valid TransactionListParams objects', () => {
      // Empty object is valid
      const params1: TransactionListParams = {};
      expect(params1).toEqual({});

      // With all properties
      const params2: TransactionListParams = {
        date: '2023-05-15',
        after: 'cursor123',
        include_subaccounts: true,
      };
      expect(params2.date).toBe('2023-05-15');
      expect(params2.after).toBe('cursor123');
      expect(params2.include_subaccounts).toBe(true);
    });
  });

  describe('TransactionItem Interface', () => {
    it('should create a valid TransactionItem object with required properties', () => {
      const transaction: TransactionItem = {
        timestamp: '2023-05-15T10:00:00Z',
        transaction_id: 'tx123',
        amount: '100.00',
        fee: '1.50',
        currency: 'XOF',
      };

      expect(transaction.timestamp).toBe('2023-05-15T10:00:00Z');
      expect(transaction.transaction_id).toBe('tx123');
      expect(transaction.amount).toBe('100.00');
      expect(transaction.fee).toBe('1.50');
      expect(transaction.currency).toBe('XOF');
    });

    it('should create a valid TransactionItem object with all properties', () => {
      const transaction: TransactionItem = {
        timestamp: '2023-05-15T10:00:00Z',
        transaction_id: 'tx123',
        transaction_type: TransactionType.API_CHECKOUT,
        amount: '100.00',
        fee: '1.50',
        balance: '1000.00',
        currency: 'XOF',
        is_reversal: false,
        counterparty_name: 'John Doe',
        counterparty_mobile: '+221123456789',
        counterparty_id: 'cp123',
        business_user_name: 'Jane Smith',
        business_user_mobile: '+221987654321',
        employee_id: 'emp123',
        client_reference: 'client-ref-123',
        payment_reason: 'Product purchase',
        checkout_api_session_id: 'sess_123',
        batch_id: 'batch_123',
        aggregated_merchant_id: 'am_123',
        aggregated_merchant_name: 'Merchant Inc',
        custom_fields: {
          order_id: '12345',
          customer_id: '67890',
        },
        submerchant_id: 'sub_123',
        submerchant_name: 'Sub Merchant LLC',
      };

      expect(transaction.timestamp).toBe('2023-05-15T10:00:00Z');
      expect(transaction.transaction_id).toBe('tx123');
      expect(transaction.transaction_type).toBe(TransactionType.API_CHECKOUT);
      expect(transaction.custom_fields?.order_id).toBe('12345');
      // We don't need to check every property, as the type system ensures they're valid
    });
  });

  describe('TransactionListResponse Interface', () => {
    it('should create a valid TransactionListResponse object', () => {
      const response: TransactionListResponse = {
        page_info: {
          start_cursor: null,
          end_cursor: 'cursor123',
          has_next_page: true,
        },
        date: '2023-05-15',
        items: [
          {
            timestamp: '2023-05-15T10:00:00Z',
            transaction_id: 'tx123',
            amount: '100.00',
            fee: '1.50',
            currency: 'XOF',
          },
          {
            timestamp: '2023-05-15T11:00:00Z',
            transaction_id: 'tx124',
            transaction_type: TransactionType.API_CHECKOUT,
            amount: '200.00',
            fee: '2.50',
            currency: 'XOF',
          },
        ],
      };

      expect(response.page_info.start_cursor).toBeNull();
      expect(response.page_info.end_cursor).toBe('cursor123');
      expect(response.page_info.has_next_page).toBe(true);
      expect(response.date).toBe('2023-05-15');
      expect(response.items.length).toBe(2);
      expect(response.items[0].transaction_id).toBe('tx123');
      expect(response.items[1].transaction_id).toBe('tx124');
    });
  });

  describe('Type compatibility with Currency', () => {
    it('should ensure Balance uses the common Currency type', () => {
      const currencies: Currency[] = ['XOF', 'GHS', 'SLL', 'USD'];
      
      currencies.forEach(currency => {
        const balance: Balance = {
          amount: '1000.00',
          currency,
        };
        
        expect(balance.currency).toBe(currency);
      });
    });

    it('should ensure TransactionItem uses the common Currency type', () => {
      const currencies: Currency[] = ['XOF', 'GHS', 'SLL', 'USD'];
      
      currencies.forEach(currency => {
        const transaction: TransactionItem = {
          timestamp: '2023-05-15T10:00:00Z',
          transaction_id: 'tx123',
          amount: '100.00',
          fee: '1.50',
          currency,
        };
        
        expect(transaction.currency).toBe(currency);
      });
    });
  });
});