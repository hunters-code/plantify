import { Eye, MapPin, Sparkles, ThumbsUp, WalletCards } from "lucide-react";
import { Badge, Button, Card, ProgressBar } from "../../../../components/ui";
import { useStartupDetails } from "../../../../hooks/useStartupDetails";
import { formatCurrency, formatNumber } from "../../../../utils/formatCurrency";

export default function StartupOverview({ startupId }) {
  const { startup, fundingProgress, nftSales, totalNFTs, loading, error } = useStartupDetails(startupId);

  if (loading) {
    return (
      <Card className="bg-neutral-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4 w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-20 bg-gray-300 rounded"></div>
            <div className="h-20 bg-gray-300 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border border-red-200">
        <div className="text-red-600">
          <h2 className="text-xl font-semibold mb-2">Error Loading Startup</h2>
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  if (!startup) {
    return (
      <Card className="bg-neutral-100">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">No Startup Selected</h2>
          <p className="text-gray-500">Please select a startup from the dropdown above.</p>
        </div>
      </Card>
    );
  }
  const teamSize = startup.teamMembers ? startup.teamMembers.length : 0;
  const fundingGoal = parseFloat(startup.fundingGoal) || 0;
  const fundingRaised = (fundingProgress / 100) * fundingGoal;
  const nftSalesPercentage = totalNFTs > 0 ? (nftSales / totalNFTs) * 100 : 0;

  return (
    <Card className="bg-neutral-100">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex gap-3 items-center">
            <h2 className="text-xl font-semibold">{startup.startupName || 'Unnamed Startup'}</h2>
            <p className="text-sm text-gray-500 border border-neutral-200 px-2 py-1 rounded-lg flex gap-2">
              <MapPin size={16} />
              {startup.location || 'Location not specified'} · {teamSize} employees
            </p>
          </div>
          <div className='flex gap-2'>
            <Badge variant="primary" icon={<ThumbsUp size={16} />}>
              {startup.status === 'approved' ? 'Active' : startup.status}
            </Badge>
            <Badge variant="success">
              {startup.sector || 'Unknown Sector'}
            </Badge>
            <Badge variant="warning">
              {startup.companyType || 'Startup'}
            </Badge>
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
            {startup.description || 'No description available for this startup.'}
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card className="flex gap-2">
          <Sparkles size={16} className="text-gray-400 mt-1" />
          <div className="w-full">
            <p className="text-sm text-gray-500 mb-1">Funding Progress: {formatNumber(fundingProgress, 1)}% Funded</p>
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
            <p className="text-sm text-gray-500 mb-1">NFT Sales: {formatNumber(nftSalesPercentage, 1)}%</p>
            <ProgressBar
              value={nftSalesPercentage}
              max={100}
              color="bg-orange-500"
              showValue={false}
            />
            <p className="text-sm text-gray-600 mt-1">{nftSales} / {totalNFTs}</p>
          </div>
        </Card>
      </div>
    </Card>
  );
}
