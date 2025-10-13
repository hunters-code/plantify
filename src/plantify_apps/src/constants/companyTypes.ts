/**
 * Available company types with their display names
 */
export const COMPANY_TYPES = {
  CORPORATION: 'Corporation',
  LLC: 'LLC',
  PARTNERSHIP: 'Partnership',
  SOLE_PROPRIETORSHIP: 'Sole Proprietorship',
  OTHER: 'Other',
} as const;

/**
 * Type for company types (string values only)
 */
export type CompanyType = (typeof COMPANY_TYPES)[keyof typeof COMPANY_TYPES];

/**
 * Type for dropdown option objects
 */
export interface CompanyTypeOption {
  value: string;
  label: string;
}

/**
 * Array of company types for dropdown options
 */
export const COMPANY_TYPE_OPTIONS: CompanyTypeOption[] = Object.entries(
  COMPANY_TYPES
).map(([key, label]) => ({
  value: key.toLowerCase(),
  label,
}));
