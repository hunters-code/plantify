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
} as const;

/**
 * Array of startup sectors for dropdown options
 */
export const STARTUP_SECTOR_OPTIONS = Object.values(STARTUP_SECTORS);

/**
 * Type for startup sectors
 */
export type StartupSector =
  (typeof STARTUP_SECTORS)[keyof typeof STARTUP_SECTORS];
