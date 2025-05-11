import * as api from '../../../src/api';

describe('API Index', () => {
  it('should export all API classes', () => {
    expect(api.BalanceApi).toBeDefined();
    expect(api.CheckoutApi).toBeDefined();
    expect(api.PayoutApi).toBeDefined();
    expect(api.MerchantsApi).toBeDefined();
    expect(api.WebhooksApi).toBeDefined();
  });
});