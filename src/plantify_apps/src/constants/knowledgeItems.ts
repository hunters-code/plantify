/**
 * Knowledge assessment checkbox items constants
 */

export interface CheckboxItem {
  field: 'investmentRisks' | 'nftModel' | 'governance' | 'liquidity';
  title: string;
  description: string;
}

export const KNOWLEDGE_ITEMS: CheckboxItem[] = [
  {
    field: 'investmentRisks',
    title: 'I understand investment risks',
    description:
      'Startup investments are high-risk and I may lose some or all of my investment. Returns are not guaranteed and depend on startup performance.',
  },
  {
    field: 'nftModel',
    title: 'I understand NFT investment model',
    description:
      'Each NFT represents profit sharing rights in a specific startup. Profit sharing is distributed monthly based on startup performance and community voting.',
  },
  {
    field: 'governance',
    title: 'I understand community governance',
    description:
      'I must participate in monthly voting to approve/reject startup progress reports. My vote affects whether profit sharing is distributed that month.',
  },
  {
    field: 'liquidity',
    title: 'I understand liquidity restrictions',
    description:
      'NFTs are locked for 36 months and cannot be sold or transferred. I will not have access to my initial investment capital during this period.',
  },
] as const;
