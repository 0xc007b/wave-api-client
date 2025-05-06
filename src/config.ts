import { WaveApiConfig } from './common/types';
import { DEFAULT_BASE_URL, DEFAULT_TIMEOUT } from './common/constants';
import { isEmpty, isValidApiKey } from './common/utils';

/**
 * Validates and normalizes the Wave API client configuration
 */
export function validateConfig(config: WaveApiConfig): WaveApiConfig {
  // Validate API key
  if (isEmpty(config.apiKey)) {
    throw new Error('API key is required');
  }

  if (!isValidApiKey(config.apiKey)) {
    throw new Error('Invalid API key format');
  }

  // Apply defaults
  return {
    apiKey: config.apiKey,
    baseUrl: config.baseUrl || DEFAULT_BASE_URL,
    timeout: config.timeout || DEFAULT_TIMEOUT,
    debug: config.debug || false,
  };
}
