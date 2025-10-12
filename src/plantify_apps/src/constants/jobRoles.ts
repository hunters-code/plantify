/**
 * Available job roles with their display names
 */
export const JOB_ROLES = {
  CEO: 'CEO',
  CTO: 'CTO',
  CFO: 'CFO',
  COO: 'COO',
  CMO: 'CMO',
  CPO: 'CPO',
  VP_ENGINEERING: 'VP Engineering',
  VP_SALES: 'VP Sales',
  VP_MARKETING: 'VP Marketing',
  VP_PRODUCT: 'VP Product',
  HEAD_OF_ENGINEERING: 'Head of Engineering',
  HEAD_OF_SALES: 'Head of Sales',
  HEAD_OF_MARKETING: 'Head of Marketing',
  HEAD_OF_PRODUCT: 'Head of Product',
  SENIOR_DEVELOPER: 'Senior Developer',
  DEVELOPER: 'Developer',
  DESIGNER: 'Designer',
  PRODUCT_MANAGER: 'Product Manager',
  SALES_MANAGER: 'Sales Manager',
  MARKETING_MANAGER: 'Marketing Manager',
  BUSINESS_DEVELOPMENT: 'Business Development',
  DATA_ANALYST: 'Data Analyst',
  RESEARCHER: 'Researcher',
  ADVISOR: 'Advisor',
  CONSULTANT: 'Consultant',
  OTHER: 'Other',
} as const;

/**
 * Type for job roles (string values only)
 */
export type JobRole = (typeof JOB_ROLES)[keyof typeof JOB_ROLES];

/**
 * Type for dropdown option objects
 */
export interface JobRoleOption {
  value: string;
  label: string;
}

/**
 * Array of job roles for dropdown options
 */
export const JOB_ROLE_OPTIONS: JobRoleOption[] = Object.entries(JOB_ROLES).map(
  ([key, label]) => ({
    value: key.toLowerCase(),
    label,
  })
);
