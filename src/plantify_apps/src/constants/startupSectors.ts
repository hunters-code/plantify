/**
 * Available startup sectors with their display names
 */
export const STARTUP_SECTORS = {
  TECHNOLOGY: 'Technology',
  HEALTHTECH: 'HealthTech',
  FINTECH: 'FinTech',
  EDTECH: 'EdTech',
  AGRICULTURE: 'Agriculture',
  RETAIL: 'Retail',
  MANUFACTURING: 'Manufacturing',
  SERVICES: 'Services',
  AI: 'Artificial Intelligence',
  BLOCKCHAIN: 'Blockchain',
  SAAS: 'SaaS',
  ENERGY: 'Clean Energy',
  OTHER: 'Other',
} as const;

/**
 * Type for startup sectors (string values only)
 */
export type StartupSector =
  (typeof STARTUP_SECTORS)[keyof typeof STARTUP_SECTORS];

/**
 * Type for dropdown option objects
 */
export interface SectorOption {
  value: string;
  label: string;
}

/**
 * Array of startup sectors for dropdown options
 */
export const STARTUP_SECTOR_OPTIONS: SectorOption[] = Object.entries(
  STARTUP_SECTORS
).map(([key, label]) => ({
  value: key.toLowerCase(),
  label,
}));
