import { StatsCard } from '../../../../components/ui';

const items = [
  { label: "Total Funding Raised", value: "$40,000", sub: "ckUSDC" },
  { label: "NFT Hoders", value: "80", sub: "active investors" },
  { label: "Monthly Commitments", value: "$400", sub: "ckUSDC/month" },
  { label: "Active Startups", value: "2", sub: "of 3 total" },
  { label: "Pending Startups", value: "1", sub: "awaiting collateral" },
  { label: "Draft startups", value: "0", sub: "in development" },
];

export default function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {items.map((item, i) => (
        <StatsCard
          key={i}
          label={item.label}
          value={item.value}
          subtitle={item.sub}
        />
      ))}
    </div>
  );
}
