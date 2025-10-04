import { Eye, MapPin, Sparkles, ThumbsUp, WalletCards } from "lucide-react";
import { Badge, Button, Card, ProgressBar } from "@/components/ui";
// import { useStartupDetails } from "../../../../hooks/useStartupDetails";
// import { formatCurrency, formatNumber } from "../../../../utils/formatCurrency";

// Dummy helper functions
const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
const formatNumber = (value: number, decimals: number = 0) =>
  value.toFixed(decimals);

interface StartupOverviewProps {
  startupId: string;
}

export default function StartupOverview({ startupId }: StartupOverviewProps) {
  // const { startup, fundingProgress, nftSales, totalNFTs, loading, error } = useStartupDetails(startupId);

  // Dummy data
  const startup = {
    startupName: "CryptoKita",
    location: "Jakarta, Indonesia",
    teamMembers: ["Ali", "Budi", "Citra"],
    status: "approved",
    sector: "Fintech",
    companyType: "Startup",
    description: "A blockchain-based fintech platform to democratize investments.",
    fundingGoal: "50000",
  };

  const fundingProgress = 65; // %
  const nftSales = 120;
  const totalNFTs = 200;

  // const loading = false;
  // const error = null;

  const teamSize = startup.teamMembers ? startup.teamMembers.length : 0;
  const fundingGoal = parseFloat(startup.fundingGoal) || 0;
  const fundingRaised = (fundingProgress / 100) * fundingGoal;
  const nftSalesPercentage = totalNFTs > 0 ? (nftSales / totalNFTs) * 100 : 0;

  return (
    <Card className="bg-neutral-100">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-3 items-center">
            <h2 className="text-xl font-semibold">
              {startup.startupName || "Unnamed Startup"}
            </h2>
            <p className="text-sm text-gray-500 border border-neutral-200 px-2 py-1 rounded-lg flex gap-2">
              <MapPin size={16} />
              {startup.location || "Location not specified"} · {teamSize} employees
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="primary" icon={<ThumbsUp size={16} />}>
              {startup.status === "approved" ? "Active" : startup.status}
            </Badge>
            <Badge variant="success">{startup.sector || "Unknown Sector"}</Badge>
            <Badge variant="warning">{startup.companyType || "Startup"}</Badge>
          </div>
        </div>
        <Button variant="secondary">
          <Eye size={16} />
          View Public Page
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col gap-2 text-[16px]">
          <span className="text-black font-ibm">Description</span>
          <span className="text-neutral-500">
            {startup.description || "No description available for this startup."}
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card className="flex gap-2">
          <Sparkles size={16} className="text-gray-400 mt-1" />
          <div className="w-full">
            <p className="text-sm text-gray-500 mb-1">
              Funding Progress: {formatNumber(fundingProgress, 1)}% Funded
            </p>
            <ProgressBar
              value={fundingProgress}
              max={100}
              color="bg-purple-600"
              showValue={false}
            />
            <p className="text-sm text-gray-600 mt-1">
              {formatCurrency(fundingRaised)} / {formatCurrency(fundingGoal)}
            </p>
          </div>
        </Card>

        <Card className="flex gap-2">
          <WalletCards size={16} className="text-gray-400 mt-1" />
          <div className="w-full">
            <p className="text-sm text-gray-500 mb-1">
              NFT Sales: {formatNumber(nftSalesPercentage, 1)}%
            </p>
            <ProgressBar
              value={nftSalesPercentage}
              max={100}
              color="bg-orange-500"
              showValue={false}
            />
            <p className="text-sm text-gray-600 mt-1">
              {nftSales} / {totalNFTs}
            </p>
          </div>
        </Card>
      </div>
    </Card>
  );
}
