'use client';

import { Plus, TrendingUp, Shield, Clock, AlertTriangle } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Card, Button, Alert } from '@/components/ui';
import type {
  CollateralInfo,
  CollateralTopUp,
  CollateralTopUpSummary,
  CollateralProgress,
  CollateralStatus,
  CollateralDashboard,
} from '@/declarations/plantify_backend/plantify_backend.did';
import { CollateralService } from '@/services/founders/CollateralService';
import { formatCurrency } from '@/utils/formatCurrency';

interface CollateralProps {
  startupId?: string;
}

const Collateral: React.FC<CollateralProps> = ({ startupId }) => {
  const [collateralDashboard, setCollateralDashboard] =
    useState<CollateralDashboard | null>(null);
  const [topUpHistory, setTopUpHistory] = useState<CollateralTopUpSummary[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollateralData = async () => {
      if (!startupId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch collateral dashboard data
        const dashboardResult =
          await CollateralService.getCollateralDashboard(startupId);

        if (dashboardResult.success && dashboardResult.dashboard) {
          setCollateralDashboard(dashboardResult.dashboard);
          setTopUpHistory(dashboardResult.dashboard.topUpHistory || []);
        } else {
          setError(dashboardResult.error || 'Failed to load collateral data');
        }
      } catch (err) {
        console.error('Error fetching collateral data:', err);
        setError('Failed to load collateral data');
      } finally {
        setLoading(false);
      }
    };

    fetchCollateralData();
  }, [startupId]);

  // Get metrics from dashboard data
  const requiredAmount = collateralDashboard
    ? Number(collateralDashboard.requiredAmount) / 100
    : 0;
  const currentAmount = collateralDashboard
    ? Number(collateralDashboard.currentAmount) / 100
    : 0;
  const progressPercentage = collateralDashboard
    ? Number(collateralDashboard.progressPercentage)
    : requiredAmount > 0
      ? (currentAmount / requiredAmount) * 100
      : 0;
  const remainingAmount = collateralDashboard
    ? Number(collateralDashboard.remainingAmount) / 100
    : Math.max(0, requiredAmount - currentAmount);
  const isFullyFunded = collateralDashboard
    ? collateralDashboard.isFullyPaid
    : progressPercentage >= 100;

  if (loading) {
    return (
      <Card className='bg-neutral-100'>
        <div className='animate-pulse space-y-6'>
          <div className='grid grid-cols-3 gap-6'>
            {[1, 2, 3].map(i => (
              <div key={i} className='bg-white rounded-lg p-6'>
                <div className='h-8 bg-gray-300 rounded mb-2'></div>
                <div className='h-4 bg-gray-200 rounded mb-1'></div>
                <div className='h-3 bg-gray-200 rounded'></div>
              </div>
            ))}
          </div>
          <div className='h-6 bg-gray-200 rounded'></div>
          <div className='h-64 bg-gray-200 rounded'></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='bg-red-50 border border-red-200'>
        <div className='text-red-600 p-6'>
          <h2 className='text-xl font-semibold mb-2'>
            Error Loading Collateral
          </h2>
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  if (!startupId) {
    return (
      <Card className='bg-neutral-100'>
        <div className='text-center py-12'>
          <h2 className='text-xl font-semibold mb-2'>No Startup Selected</h2>
          <p className='text-gray-500'>
            Please select a startup to view collateral details.
          </p>
        </div>
      </Card>
    );
  }

  if (!collateralDashboard) {
    return (
      <Card className='bg-neutral-100'>
        <div className='text-center py-12'>
          <Shield size={48} className='mx-auto text-gray-400 mb-4' />
          <h2 className='text-xl font-semibold mb-2'>No Collateral Required</h2>
          <p className='text-gray-500'>
            This startup does not currently require collateral deposits.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className='bg-neutral-100'>
      {/* Status Alert */}
      {!isFullyFunded && (
        <Alert className='mb-6 bg-yellow-50 border-yellow-200'>
          <AlertTriangle className='h-4 w-4 text-yellow-600' />
          <div className='ml-2'>
            <h4 className='text-sm font-medium text-yellow-800'>
              Collateral Required
            </h4>
            <p className='text-sm text-yellow-700'>
              You need to deposit {formatCurrency(remainingAmount)} more to meet
              collateral requirements.
            </p>
          </div>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className='grid grid-cols-3 gap-6 mb-8'>
        <Card className='text-center p-6'>
          <div className='flex items-center justify-center mb-2'>
            <TrendingUp className='w-5 h-5 text-blue-500 mr-2' />
          </div>
          <div className='text-3xl font-bold text-gray-900 mb-2'>
            {formatCurrency(requiredAmount)}
          </div>
          <div className='text-sm text-gray-500'>Required Amount</div>
          <div className='text-xs text-gray-400 mt-1'>
            Total collateral needed ({collateralDashboard.tokenType})
          </div>
        </Card>

        <Card className='text-center p-6'>
          <div className='flex items-center justify-center mb-2'>
            <Shield className='w-5 h-5 text-green-500 mr-2' />
          </div>
          <div className='text-3xl font-bold text-gray-900 mb-2'>
            {formatCurrency(currentAmount)}
          </div>
          <div className='text-sm text-gray-500'>Deposited Amount</div>
          <div className='text-xs text-gray-400 mt-1'>
            Current deposits ({collateralDashboard.tokenType})
          </div>
        </Card>

        <Card className='text-center p-6'>
          <div className='flex items-center justify-center mb-2'>
            <Clock className='w-5 h-5 text-purple-500 mr-2' />
          </div>
          <div
            className={`text-3xl font-bold mb-2 ${isFullyFunded ? 'text-green-600' : 'text-orange-600'}`}
          >
            {Math.round(progressPercentage)}%
          </div>
          <div className='text-sm text-gray-500'>Progress</div>
          <div className='text-xs text-gray-400 mt-1'>
            {collateralDashboard.status}
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <div className='mb-8'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-sm font-medium text-gray-700'>
            Collateral Progress: {Math.round(progressPercentage)}%{' '}
            {isFullyFunded ? 'Funded' : 'Complete'}
          </span>
          <span className='text-sm font-medium text-gray-700'>
            {formatCurrency(remainingAmount)} remaining
          </span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-3'>
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              isFullyFunded ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(100, progressPercentage)}%` }}
          ></div>
        </div>
        <div className='text-sm text-gray-500 mt-1'>
          {Math.round(progressPercentage)}% complete
        </div>
      </div>

      {/* Action Button */}
      {!isFullyFunded && (
        <div className='mb-6'>
          <Button className='w-full' variant='primary'>
            <Plus size={16} className='mr-2' />
            Top Up Collateral
          </Button>
        </div>
      )}

      {/* Top-Up History */}
      <div>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold'>Top-Up History</h3>
          <span className='text-sm text-gray-500'>
            {topUpHistory.length} transaction
            {topUpHistory.length !== 1 ? 's' : ''}
          </span>
        </div>

        {topUpHistory.length > 0 ? (
          <div className='space-y-4'>
            {topUpHistory
              .sort((a, b) => Number(b.timestamp) - Number(a.timestamp))
              .map((topUp, index) => (
                <Card
                  key={index}
                  className='p-4 bg-white border border-gray-200'
                >
                  <div className='flex justify-between items-center'>
                    <div>
                      <div className='text-sm font-medium'>
                        {new Date(
                          Number(topUp.timestamp) / 1000000
                        ).toLocaleDateString()}
                      </div>
                      <div className='text-xs text-gray-500 capitalize'>
                        {collateralDashboard.tokenType}
                      </div>
                      {topUp.transactionId && topUp.transactionId[0] && (
                        <div className='text-xs text-gray-400 mt-1'>
                          TX: {topUp.transactionId[0].slice(0, 16)}...
                        </div>
                      )}
                    </div>
                    <div className='text-right'>
                      <div className='text-sm font-semibold text-green-600'>
                        +{formatCurrency(Number(topUp.amount) / 100)}
                      </div>
                      <div className='text-xs text-gray-500'>
                        {topUp.status}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        ) : (
          <Card className='p-6 bg-gray-50 border border-gray-200'>
            <div className='text-center'>
              <Shield size={32} className='mx-auto text-gray-400 mb-2' />
              <p className='text-gray-500 text-sm'>
                No top-up history available
              </p>
              <p className='text-gray-400 text-xs mt-1'>
                Collateral deposits will appear here once made
              </p>
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
};

export default Collateral;
