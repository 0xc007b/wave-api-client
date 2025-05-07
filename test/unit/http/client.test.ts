// HTTP Client Tests
import axios from 'axios';
import { HttpClient } from '../../../src/http/client';
import { CONTENT_TYPES, HEADERS } from '../../../src/common/constants';

// Mock axios
jest.mock('axios');

describe('HttpClient', () => {
  const mockConfig = {
    apiKey: 'wave_test_api_key_12345',
    baseUrl: 'https://test-api.wave.com',
    timeout: 5000,
    debug: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up mocked axios
    (axios.create as jest.Mock).mockReturnValue({
      request: jest.fn().mockResolvedValue({ data: {} }),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    });
  });

  it('should initialize with correct configuration', () => {
    const httpClient = new HttpClient(mockConfig);
    
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: mockConfig.baseUrl,
      timeout: mockConfig.timeout,
      headers: {
        [HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
        [HEADERS.AUTHORIZATION]: `Bearer ${mockConfig.apiKey}`,
      },
    });
  });
  
  it('should make GET requests correctly', async () => {
    const httpClient = new HttpClient(mockConfig);
    const axiosInstance = axios.create();
    
    const mockResponse = { data: { id: '123', name: 'Test' } };
    (axiosInstance.request as jest.Mock).mockResolvedValueOnce(mockResponse);
    
    const result = await httpClient.get('/test', { param: 'value' });
    
    expect(axiosInstance.request).toHaveBeenCalled();
    expect(result).toBe(mockResponse.data);
  });
  
  it('should make POST requests correctly', async () => {
    const httpClient = new HttpClient(mockConfig);
    const axiosInstance = axios.create();
    
    const mockResponse = { data: { success: true } };
    (axiosInstance.request as jest.Mock).mockResolvedValueOnce(mockResponse);
    
    const result = await httpClient.post('/test', { name: 'Test' });
    
    expect(axiosInstance.request).toHaveBeenCalled();
    expect(result).toBe(mockResponse.data);
  });
});