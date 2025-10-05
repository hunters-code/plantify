import React from "react";
import { Lock, Sparkle, BanknoteArrowDown } from "lucide-react";
import { Button, Card, ProgressBar } from "@/components/ui";
import { formatCurrency, formatNumber } from "@/utils/formatCurrency";
import { CardSkeleton } from "@/components/ui";

function useFundingStatus(startupId: string) {
  const loading = true; // simulasi loading
  const error = null;
  const startup = { id: startupId, name: "Demo Startup" };

  const totalRaised = 80000;
  const fundingGoal = 100000;
  const fundingProgress = (totalRaised / fundingGoal) * 100;
  const availableFunds = totalRaised * 0.8;
  const platformReserve = totalRaised * 0.2;
  const collateralInfo = {
    currentAmount: 40000,
    requiredAmount: 50000,
    status: "active",
  };

  return {
    startup,
    totalRaised,
    fundingGoal,
    fundingProgress,
    availableFunds,
    platformReserve,
    collateralInfo,
    loading,
    error,
  };
}

interface FundingStatusProps {
  startupId: string;
}

export default function FundingStatus({ startupId }: FundingStatusProps) {
  const {
    startup,
    totalRaised,
    fundingGoal,
    fundingProgress,
    availableFunds,
    platformReserve,
    collateralInfo,
    loading,
    error,
  } = useFundingStatus(startupId);

  if (loading) {
    return <CardSkeleton withImage={false} textRows={4} />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-6 rounded-[16px]">
        <div className="text-red-600">
          <h2 className="text-xl font-semibold mb-2">Error Loading Funding Status</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!startupId) {
    return (
      <div className="bg-neutral-100 p-6 rounded-[16px]">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">No Startup Selected</h2>
          <p className="text-gray-500">Please select a startup from the dropdown above.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 p-6 rounded-[16px]">
      <h2 className="text-xl font-semibold mb-4">Funding Status</h2>

      {/* Progress Bar */}
      <div className="mb-6 flex gap-2">
        <Sparkle size={16} />
        <div className="w-full">
          <div className="flex gap-2 text-sm mb-2">
            <span className="text-gray-600">
              Overall Progress:{" "}
              <span className="text-orange-500 font-medium">
                {formatNumber(fundingProgress, 1)}% Funded
              </span>
            </span>
          </div>
          <ProgressBar value={fundingProgress} max={100} className="mb-2" color="orange" />
          <div className="flex justify-between text-sm mt-2">
            <span className="text-orange-600 font-medium">{formatCurrency(totalRaised)}</span>
            <span className="text-gray-500">{formatCurrency(fundingGoal)}</span>
          </div>
        </div>
      </div>

      {/* Funds Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Available Funds */}
        <Card className="flex flex-col justify-between">
          <div>
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(availableFunds)}</p>
            <p className="text-gray-500 text-sm">80% of raised funds (ckUSDC)</p>
          </div>
          <div className="flex justify-end">
            <Button
              variant="secondary"
              className="mt-4 flex items-center gap-2 w-fit"
              disabled={availableFunds === 0}
            >
              <BanknoteArrowDown size={16} />
              Request Withdrawal
            </Button>
          </div>
        </Card>

        {/* Platform Reserve */}
        <Card className="flex flex-col justify-between">
          <div>
            <p className="text-2xl font-semibold text-gray-900">{formatCurrency(platformReserve)}</p>
            <p className="text-gray-500 text-sm">20% platform reserve (ckUSDC)</p>
          </div>
          <div
            className="mt-4 flex justify-center items-center gap-2 px-4 py-3 
            rounded-xl border border-orange-200 bg-orange-50 text-sm font-medium text-orange-700"
          >
            <Lock size={16} />
            Locked for investor protection
          </div>
        </Card>
      </div>

      {/* Collateral Information */}
      {collateralInfo && (
        <div className="mt-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">Collateral Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Current Amount</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(Number(collateralInfo.currentAmount))}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Required Amount</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(Number(collateralInfo.requiredAmount))}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-semibold capitalize">{collateralInfo.status}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
