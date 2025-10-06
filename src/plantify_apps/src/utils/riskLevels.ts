import { STARTUP_SECTORS } from '@/constants/startupSectors';

/**
 * Risk level categories
 */
export const RISK_CATEGORIES = {
  HIGH: 'High Risk',
  MODERATE: 'Moderate Risk',
  LOW: 'Low Risk',
} as const;

/**
 * Risk level mapping for different startup sectors
 */
export const RISK_LEVELS: Record<string, string> = {
  [STARTUP_SECTORS.TECHNOLOGY.toLowerCase()]: RISK_CATEGORIES.HIGH,
  [STARTUP_SECTORS.HEALTHTECH.toLowerCase()]: RISK_CATEGORIES.MODERATE,
  [STARTUP_SECTORS.FINTECH.toLowerCase()]: RISK_CATEGORIES.HIGH,
  [STARTUP_SECTORS.EDTECH.toLowerCase()]: RISK_CATEGORIES.MODERATE,
  [STARTUP_SECTORS.AGRICULTURE.toLowerCase()]: RISK_CATEGORIES.LOW,
  [STARTUP_SECTORS.RETAIL.toLowerCase()]: RISK_CATEGORIES.MODERATE,
  [STARTUP_SECTORS.MANUFACTURING.toLowerCase()]: RISK_CATEGORIES.LOW,
  [STARTUP_SECTORS.SERVICES.toLowerCase()]: RISK_CATEGORIES.LOW,
};

/**
 * Get the risk level for a given sector
 * @param sector - The startup sector
 * @returns The risk level for the sector or 'Moderate Risk' as default
 */
export const getRiskLevel = (sector?: string): string => {
  if (!sector) return RISK_CATEGORIES.MODERATE;
  return RISK_LEVELS[sector.toLowerCase()] || RISK_CATEGORIES.MODERATE;
};
