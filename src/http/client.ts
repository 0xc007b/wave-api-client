import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { createErrorFromResponse } from '../common/errors';
import { ApiErrorResponse, WaveApiConfig, HttpMethod } from '../common/types';
import { CONTENT_TYPES, DEFAULT_BASE_URL, DEFAULT_TIMEOUT, HEADERS } from '../common/constants';

/**
 * HTTP client for making API requests
 */
export class HttpClient {
  private client: AxiosInstance;
  private config: WaveApiConfig;

  /**
   * Creates a new HTTP client instance
   */
  constructor(config: WaveApiConfig) {
    this.config = {
      baseUrl: DEFAULT_BASE_URL,
      timeout: DEFAULT_TIMEOUT,
      debug: false,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        [HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
        [HEADERS.AUTHORIZATION]: `Bearer ${this.config.apiKey}`,
      },
    });

    // Add request interceptor for logging
    if (this.config.debug) {
      this.client.interceptors.request.use((request) => {
        console.log('Request:', {
          method: request.method?.toUpperCase(),
          url: request.url,
          headers: request.headers,
          data: request.data,
        });
        return request;
      });

      // Add response interceptor for logging
      this.client.interceptors.response.use(
        (response) => {
          console.log('Response:', {
            status: response.status,
            headers: response.headers,
            data: response.data,
          });
          return response;
        },
        (error: AxiosError) => {
          console.error('Error:', {
            status: error.response?.status,
            data: error.response?.data,
          });
          return Promise.reject(error);
        },
      );
    }
  }

  /**
   * Makes a request to the API
   */
  async request<T>(
    method: HttpMethod,
    path: string,
    data?: any,
    config?: Partial<AxiosRequestConfig>,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.request({
        method,
        url: path,
        data: method === HttpMethod.POST ? data : undefined,
        params: method === HttpMethod.GET ? data : undefined,
        ...config,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        throw createErrorFromResponse(status, data as ApiErrorResponse);
      }

      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Makes a GET request
   */
  get<T>(
    path: string,
    params?: Record<string, any>,
    config?: Partial<AxiosRequestConfig>,
  ): Promise<T> {
    return this.request<T>(HttpMethod.GET, path, params, config);
  }

  /**
   * Makes a POST request
   */
  post<T>(path: string, data?: any, config?: Partial<AxiosRequestConfig>): Promise<T> {
    return this.request<T>(HttpMethod.POST, path, data, config);
  }
}
