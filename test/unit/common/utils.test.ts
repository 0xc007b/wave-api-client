import { isEmpty, isValidApiKey, formatAmount, createQueryString } from '../../../src/common/utils';

describe('Utils', () => {
  describe('isEmpty', () => {
    it('should return true for empty strings, null and undefined', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('  ')).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty(' hello ')).toBe(false);
    });
  });

  describe('isValidApiKey', () => {
    it('should return true for valid API keys', () => {
      expect(isValidApiKey('wave_sn_prod_key_12345abcdef')).toBe(true);
      expect(isValidApiKey('wave_test_api_key_abcdefghijklmnopqrst')).toBe(true);
    });

    it('should return false for invalid API keys', () => {
      expect(isValidApiKey('')).toBe(false);
      expect(isValidApiKey('invalid_key')).toBe(false);
      expect(isValidApiKey('wave_')).toBe(false);
      expect(isValidApiKey('wave_abc')).toBe(false);
    });
  });

  describe('formatAmount', () => {
    it('should convert a number to string', () => {
      expect(formatAmount(1000, 'XOF')).toBe('1000');
      expect(formatAmount(1000.5, 'GHS')).toBe('1000.50');
    });

    it('should return string amounts as-is', () => {
      expect(formatAmount('1000', 'XOF')).toBe('1000');
      expect(formatAmount('1000.50', 'GHS')).toBe('1000.50');
    });

    it('should throw an error for invalid amount formats', () => {
      expect(() => formatAmount('abc', 'XOF')).toThrow('Invalid amount format: abc');
      expect(() => formatAmount('1,000.50', 'GHS')).toThrow('Invalid amount format: 1,000.50');
      expect(() => formatAmount('-100', 'XOF')).toThrow('Invalid amount format: -100');
    });
  });

  describe('createQueryString', () => {
    it('should create a query string from an object of parameters', () => {
      const params = {
        date: '2023-05-15',
        status: 'active',
        amount: 1000,
        include_subaccounts: true,
      };

      const queryString = createQueryString(params);

      expect(queryString).toBe(
        '?date=2023-05-15&status=active&amount=1000&include_subaccounts=true',
      );
    });

    it('should omit null and undefined values', () => {
      const params = {
        date: '2023-05-15',
        status: null,
        amount: undefined,
        include_subaccounts: true,
      };

      const queryString = createQueryString(params);

      expect(queryString).toBe('?date=2023-05-15&include_subaccounts=true');
    });

    it('should return an empty string for empty params', () => {
      expect(createQueryString({})).toBe('');
    });
  });
});
