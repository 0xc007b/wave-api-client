import { PaginationParams } from '../../common/types';

/**
 * Merchant status
 */
export enum MerchantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

/**
 * Parameters for listing merchants
 */
export interface MerchantListParams extends PaginationParams {
  /** Filter by merchant status */
  status?: MerchantStatus;

  /** Search term for merchant name */
  search?: string;
}

/**
 * Merchant details
 */
export interface MerchantDetails {
  /** Unique identifier for the merchant */
  id: string;

  /** Name of the merchant */
  name: string;

  /** Status of the merchant */
  status: MerchantStatus;

  /** Contact email for the merchant */
  email?: string;

  /** Contact phone number for the merchant */
  phone?: string;

  /** Business type or category */
  business_type?: string;

  /** Time when the merchant was created */
  created_at: string;

  /** Time when the merchant was last updated */
  updated_at: string;

  /** Additional merchant metadata */
  metadata?: Record<string, string>;
}
