/**
 * Shared option type
 */
export interface Option {
  value: string;
  label: string;
}

/**
 * Investment experience levels
 */
export const INVESTMENT_EXPERIENCE_OPTIONS: Option[] = [
  { value: 'beginner', label: 'Beginner (Less than 1 year)' },
  { value: 'intermediate', label: 'Intermediate (1-5 years)' },
  { value: 'expert', label: 'Expert (5+ years)' },
];

/**
 * Risk tolerance levels
 */
export const RISK_TOLERANCE_OPTIONS: Option[] = [
  { value: 'low', label: 'Low - Prefer stable, lower returns' },
  { value: 'medium', label: 'Medium - Balanced risk and return' },
  { value: 'high', label: 'High - Comfortable with volatility' },
];

/**
 * Investment goals
 */
export const INVESTMENT_GOAL_OPTIONS: Option[] = [
  { value: 'growth', label: 'Growth - Long-term capital appreciation' },
  { value: 'income', label: 'Income - Regular returns' },
  { value: 'preservation', label: 'Capital Preservation - Protect principal' },
];

/**
 * Available capital ranges
 */
export const CAPITAL_OPTIONS: Option[] = [
  { value: 'under_1k', label: 'Under $1,000' },
  { value: '1k_10k', label: '$1,000 - $10,000' },
  { value: '10k_100k', label: '$10,000 - $100,000' },
  { value: '100k_plus', label: '$100,000+' },
];
