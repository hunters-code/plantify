'use client';

import { Lock, BanknoteArrowDown } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button, Card, CardSkeleton } from '@/components/ui';
import FundingProgress from '@/components/ui/FundingProgress';
import type {
  Startup,
  NFTPurchaseHistory,
  CollateralInfo,
  CollateralProgress,
  FundingStatus,
  RecentInvestment,
  FundingMilestone,
} from '@/declarations/plantify_backend/plantify_backend.did';
import { CollateralService } from '@/services/founders/CollateralService';
import { StartupService } from '@/services/marketplace/StartupService';
import { formatCurrency } from '@/utils/formatCurrency';

function useFundingStatus(startupId: string) {
  const [startup, setStartup] = useState<Startup | null>(null);
  const [fundingStatus, setFundingStatus] = useState<FundingStatus | null>(
    null
  );
  const [collateralInfo, setCollateralInfo] = useState<CollateralInfo | null>(
    null
  );
  const [recentInvestments, setRecentInvestments] = useState<
    RecentInvestment[]
  >([]);
  const [fundingMilestones, setFundingMilestones] = useState<
    FundingMilestone[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFundingData = async () => {
      if (!startupId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch startup details, funding status, and collateral info in parallel
        const [startupResult, fundingResult, collateralResult] =
          await Promise.all([
            StartupService.getStartupDetails(startupId),
            StartupService.getFundingStatus(startupId),
            CollateralService.getCollateralStatus(startupId),
          ]);

        if (startupResult) {
          setStartup(startupResult);
          console.log('Startup details loaded:', startupResult);
        }

        if (fundingResult.success && fundingResult.data) {
          setFundingStatus(fundingResult.data);
          setRecentInvestments(fundingResult.data.recentInvestments || []);
          setFundingMilestones(fundingResult.data.fundingMilestones || []);
        }

        if (collateralResult.success && collateralResult.collateral) {
          setCollateralInfo(collateralResult.collateral);
          console.log('Collateral info loaded:', collateralResult.collateral);
        }
      } catch (err) {
        console.error('Error fetching funding data:', err);
        setError('Failed to load funding data');
      } finally {
        setLoading(false);
      }
    };

    fetchFundingData();
  }, [startupId]);

  // Get funding metrics from the new API or fall back to calculations
  const fundingGoal = fundingStatus
    ? Number(fundingStatus.fundingGoal)
    : startup
      ? Number(startup.fundingGoal?.replace(/[^0-9.]/g, '')) || 0
      : 0;

  const totalRaised = fundingStatus ? Number(fundingStatus.totalRaised) : 0;

  const fundingProgress = fundingStatus
    ? Number(fundingStatus.progressPercentage)
    : fundingGoal > 0
      ? (totalRaised / fundingGoal) * 100
      : 0;

  const availableFunds = totalRaised * 0.8; // 80% available to founder
  const platformReserve = totalRaised * 0.2; // 20% platform reserve
  const isFullyFunded = fundingStatus ? fundingStatus.isFullyFunded : false;
  const remainingAmount = fundingStatus
    ? Number(fundingStatus.remainingAmount)
    : fundingGoal - totalRaised;

  return {
    startup,
    fundingStatus,
    totalRaised,
    fundingGoal,
    fundingProgress,
    availableFunds,
    platformReserve,
    isFullyFunded,
    remainingAmount,
    recentInvestments,
    fundingMilestones,
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
    fundingStatus,
    totalRaised,
    fundingGoal,
    fundingProgress,
    availableFunds,
    platformReserve,
    isFullyFunded,
    remainingAmount,
    recentInvestments,
    fundingMilestones,
    collateralInfo,
    loading,
    error,
  } = useFundingStatus(startupId);

  if (loading) {
    return <CardSkeleton withImage={false} textRows={4} />;
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 p-6 rounded-[16px]'>
        <div className='text-red-600'>
          <h2 className='text-xl font-semibold mb-2'>
            Error Loading Funding Status
          </h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!startupId) {
    return (
      <div className='bg-white p-6 rounded-[16px]'>
        <div className='text-center py-8'>
          <h2 className='text-xl font-semibold mb-2'>No Startup Selected</h2>
          <p className='text-gray-500'>
            Please select a startup from the dropdown above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white p-6 rounded-[16px]'>
      <h2 className='text-xl font-semibold mb-4'>Funding Status</h2>

      {/* Reusable Progress Bar */}
      <FundingProgress
        progress={fundingProgress}
        totalRaised={totalRaised}
        fundingGoal={fundingGoal}
        color='orange'
      />

      {/* Funds Section */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Available Funds */}
        <Card className='flex flex-col justify-between'>
          <div>
            <p className='text-2xl font-semibold text-gray-900'>
              {formatCurrency(availableFunds)}
            </p>
            <p className='text-gray-500 text-sm'>
              80% of raised funds (ckUSDC)
            </p>
          </div>
          {/* <div className='flex justify-end'>
            <Button
              variant='secondary'
              className='mt-4 flex items-center gap-2 w-fit'
              disabled={availableFunds === 0}
            >
              <BanknoteArrowDown size={16} />
              Request Withdrawal
            </Button>
          </div> */}
        </Card>

        {/* Platform Reserve */}
        <Card className='flex flex-col justify-between'>
          <div>
            <p className='text-2xl font-semibold text-gray-900'>
              {formatCurrency(platformReserve)}
            </p>
            <p className='text-gray-500 text-sm'>
              20% platform reserve (ckUSDC)
            </p>
          </div>
          <div
            className='mt-4 flex justify-center items-center gap-2 px-4 py-3
            rounded-xl border border-orange-200 bg-orange-50 text-sm font-medium text-orange-700'
          >
            <Lock size={16} />
            Locked for investor protection
          </div>
        </Card>
      </div>

      {/* Recent Investments */}
      {recentInvestments && recentInvestments.length > 0 && (
        <div className='mt-6'>
          <Card className='p-4'>
            <h3 className='text-lg font-semibold mb-3'>Recent Investments</h3>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b'>
                    <th className='text-left py-2 px-2'>Investor</th>
                    <th className='text-left py-2 px-2'>Amount</th>
                    <th className='text-left py-2 px-2'>Date</th>
                    <th className='text-left py-2 px-2'>Token</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvestments.map((investment, index) => (
                    <tr key={index} className='border-b hover:bg-white'>
                      <td className='py-2 px-2'>{investment.investorName}</td>
                      <td className='py-2 px-2'>
                        {formatCurrency(Number(investment.amount))}
                      </td>
                      <td className='py-2 px-2'>
                        {new Date(
                          Number(investment.date) / 1000000
                        ).toLocaleDateString()}
                      </td>
                      <td className='py-2 px-2 uppercase'>
                        {investment.tokenType}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Funding Milestones */}
      {fundingMilestones && fundingMilestones.length > 0 && (
        <div className='mt-6'>
          <Card className='p-4'>
            <h3 className='text-lg font-semibold mb-3'>Funding Milestones</h3>
            <div className='space-y-4'>
              {fundingMilestones.map((milestone, index) => (
                <div
                  key={index}
                  className='border-l-4 border-blue-500 pl-4 py-1'
                >
                  <p className='font-medium'>{milestone.milestone}</p>
                  <p className='text-sm text-gray-500'>
                    Target: {formatCurrency(Number(milestone.targetAmount))}
                  </p>
                  <div className='w-full bg-gray-200 rounded-full h-2 mt-2'>
                    <div
                      className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                      style={{
                        width: `${Math.min(100, (totalRaised / Number(milestone.targetAmount)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Collateral Information */}
      {collateralInfo && (
        <div className='mt-6'>
          <Card className='p-4'>
            <h3 className='text-lg font-semibold mb-3'>Collateral Status</h3>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div>
                <p className='text-sm text-gray-500'>Current Amount</p>
                <p className='text-lg font-semibold'>
                  {formatCurrency(Number(collateralInfo.currentAmount))}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Required Amount</p>
                <p className='text-lg font-semibold'>
                  {formatCurrency(Number(collateralInfo.requiredAmount))}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Status</p>
                <p className='text-lg font-semibold capitalize'>
                  {typeof collateralInfo.status === 'object'
                    ? Object.keys(collateralInfo.status)[0].toLowerCase()
                    : collateralInfo.status}
                </p>
              </div>
              <div>
                <p className='text-sm text-gray-500'>Token Type</p>
                <p className='text-lg font-semibold uppercase'>
                  {collateralInfo.tokenType}
                </p>
              </div>
            </div>

            {/* Progress Bar for Collateral */}
            {collateralInfo.requiredAmount > 0 && (
              <div className='mt-4'>
                <div className='flex justify-between text-sm text-gray-600 mb-2'>
                  <span>Collateral Progress</span>
                  <span>
                    {Math.round(
                      (Number(collateralInfo.currentAmount) /
                        Number(collateralInfo.requiredAmount)) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div
                    className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                    style={{
                      width: `${Math.min(100, (Number(collateralInfo.currentAmount) / Number(collateralInfo.requiredAmount)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
