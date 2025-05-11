import { validateConfig } from '../../src/config';
import { WaveApiConfig } from '../../src/common/types';
import { DEFAULT_BASE_URL, DEFAULT_TIMEOUT } from '../../src/common/constants';
import * as utils from '../../src/common/utils';

// Mock the utility functions
jest.mock('../../src/common/utils', () => ({
  isEmpty: jest.fn(),
  isValidApiKey: jest.fn(),
}));

describe('Config', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate and normalize config with defaults', () => {
    // Mock implementations for this test
    (utils.isEmpty as jest.Mock).mockReturnValueOnce(false);
    (utils.isValidApiKey as jest.Mock).mockReturnValueOnce(true);

    const config: WaveApiConfig = {
      apiKey: 'wave_test_key_12345',
    };

    const validatedConfig = validateConfig(config);

    expect(validatedConfig).toEqual({
      apiKey: 'wave_test_key_12345',
      baseUrl: DEFAULT_BASE_URL,
      timeout: DEFAULT_TIMEOUT,
      debug: false,
    });

    expect(utils.isEmpty).toHaveBeenCalledWith('wave_test_key_12345');
    expect(utils.isValidApiKey).toHaveBeenCalledWith('wave_test_key_12345');
  });

  it('should use provided values instead of defaults', () => {
    // Mock implementations for this test
    (utils.isEmpty as jest.Mock).mockReturnValueOnce(false);
    (utils.isValidApiKey as jest.Mock).mockReturnValueOnce(true);

    const config: WaveApiConfig = {
      apiKey: 'wave_test_key_12345',
      baseUrl: 'https://custom-api.wave.com',
      timeout: 5000,
      debug: true,
    };

    const validatedConfig = validateConfig(config);

    expect(validatedConfig).toEqual({
      apiKey: 'wave_test_key_12345',
      baseUrl: 'https://custom-api.wave.com',
      timeout: 5000,
      debug: true,
    });
  });

  it('should throw error if API key is empty', () => {
    // Mock implementation
    (utils.isEmpty as jest.Mock).mockReturnValueOnce(true);

    const config: WaveApiConfig = {
      apiKey: '',
    };

    expect(() => validateConfig(config)).toThrow('API key is required');
  });

  it('should throw error if API key format is invalid', () => {
    // Mock implementations
    (utils.isEmpty as jest.Mock).mockReturnValueOnce(false);
    (utils.isValidApiKey as jest.Mock).mockReturnValueOnce(false);

    const config: WaveApiConfig = {
      apiKey: 'invalid_key',
    };

    expect(() => validateConfig(config)).toThrow('Invalid API key format');
  });
});
