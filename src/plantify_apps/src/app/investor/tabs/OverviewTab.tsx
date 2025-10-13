'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Activity, Calendar, Vote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InvestorService } from '@/services/investors/InvestorService';
import { ProductCard } from '@/components/features';
import { Button, Card, LoadingSpinner } from '@/components/ui';

interface DashboardData {
  totalInvested: number;
  totalReturns: number;
  returnPercentage: number;
  monthlyCommitments: number;
  activeInvestments: number;
  votingPending: number;
}

interface Startup {
  id: string | number;
  image: string;
  name: string;
  sector: string;
  risk: string;
  description: string;
  nftPrice: number;
  employees: number;
  periodicReturns: string | number;
  annualROI: string | number;
  available: number;
  fundingProgress?: number;
  fundedAmount?: number;
  targetAmount?: number;
}

interface ActivityItem {
  type: 'profit' | 'investment';
  company: string;
  amount: number;
  date: string;
}

export default function OverviewTab() {
  const navigate = useRouter();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [matchingStartups, setMatchingStartups] = useState<Startup[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const investor = await InvestorService.getInvestorByPrincipal();

        if (!investor) {
          setError('Investor not registered or not found.');
          setLoading(false);
          return;
        }

        const investorId = investor.id?.toString() ?? investor.id?.toString();

        const historyRes = await InvestorService.getInvestorPurchaseHistory(investorId);
        const purchaseHistory = historyRes.success ? historyRes.history : [];

        const totalInvested = Array.isArray(purchaseHistory)
          ? purchaseHistory.reduce((sum, item: any) => sum + Number(item.amount || 0), 0)
          : 0;

        const totalReturns = totalInvested * 0.15;
        const activeInvestments = Array.isArray(purchaseHistory)
          ? purchaseHistory.length
          : 0;

        const data: DashboardData = {
          totalInvested,
          totalReturns,
          returnPercentage: 15,
          monthlyCommitments: Math.round(totalInvested / 12),
          activeInvestments,
          votingPending: Math.floor(Math.random() * 3),
        };

        setDashboardData(data);

        const mockStartups: Startup[] = [
          {
            id: 1,
            image: '/images/startup1.jpg',
            name: 'EcoGrow',
            sector: 'Agritech',
            risk: 'Moderate Risk',
            description: 'Sustainable farming with AI integration.',
            nftPrice: 150,
            employees: 20,
            periodicReturns: 8,
            annualROI: 12,
            available: 100,
            fundingProgress: 70,
            fundedAmount: 7000,
            targetAmount: 10000,
          },
          {
            id: 2,
            image: '/images/startup2.jpg',
            name: 'SolarEase',
            sector: 'Renewable Energy',
            risk: 'Low Risk',
            description: 'Affordable solar energy for rural areas.',
            nftPrice: 200,
            employees: 40,
            periodicReturns: 10,
            annualROI: 18,
            available: 150,
            fundingProgress: 80,
            fundedAmount: 12000,
            targetAmount: 15000,
          },
        ];
        setMatchingStartups(mockStartups);

        const mockActivity: ActivityItem[] = [
          {
            type: 'investment',
            company: 'EcoGrow',
            amount: 300,
            date: 'Oct 2, 2025',
          },
          {
            type: 'profit',
            company: 'SolarEase',
            amount: 45,
            date: 'Oct 7, 2025',
          },
        ];
        setRecentActivity(mockActivity);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch investor data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" />
          <p className="text-gray-600">Loading investor dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-500 mb-3">{error}</p>
        <Button variant="secondary" onClick={() => location.reload()}>
          Retry
        </Button>
      </Card>
    );
  }

  return (
    <>
      {/* === Dashboard Overview === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[
          {
            label: 'Total Invested',
            value: `$${dashboardData.totalInvested.toLocaleString()}`,
            sub: 'ckUSDC',
            icon: <DollarSign className="w-6 h-6 text-blue-600" />,
            color: 'bg-blue-100',
          },
          {
            label: 'Total Returns',
            value: `+$${dashboardData.totalReturns.toLocaleString()}`,
            sub: `${dashboardData.returnPercentage}% overall`,
            icon: <TrendingUp className="w-6 h-6 text-green-600" />,
            color: 'bg-green-100',
          },
          {
            label: 'Monthly Commitments',
            value: `$${dashboardData.monthlyCommitments.toLocaleString()}`,
            sub: 'this month',
            icon: <Calendar className="w-6 h-6 text-purple-600" />,
            color: 'bg-purple-100',
          },
          {
            label: 'Active Investments',
            value: dashboardData.activeInvestments,
            sub: 'startups',
            icon: <Activity className="w-6 h-6 text-orange-600" />,
            color: 'bg-orange-100',
          },
          {
            label: 'Voting Pending',
            value: dashboardData.votingPending,
            sub: 'action needed',
            icon: <Vote className="w-6 h-6 text-red-600" />,
            color: 'bg-red-100',
          },
        ].map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p
                  className={`text-xs ${stat.label === 'Total Returns' ? 'text-green-600' : 'text-gray-500'
                    }`}
                >
                  {stat.sub}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* === Matching Startups === */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Startups Matching Your Profile</h2>
          <Button variant="secondary" className="text-sm" onClick={() => navigate.push('/explore')}>
            View all startups
          </Button>
        </div>

        {matchingStartups.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No startups available for now.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingStartups.map((startup) => (
              <ProductCard
                key={startup.id}
                id={startup.id}
                image={startup.image}
                title={startup.name}
                location="Indonesia"
                employees={startup.employees}
                category={startup.sector}
                risk={startup.risk}
                description={startup.description}
                nftPrice={startup.nftPrice}
                periodicReturns={`$${startup.periodicReturns}`}
                annualROI={Number(startup.annualROI)}
                available={startup.available}
                fundingProgress={startup.fundingProgress || 0}
                fundedAmount={startup.fundedAmount || 0}
                targetAmount={startup.targetAmount || startup.nftPrice * startup.available}
              />
            ))}
          </div>
        )}
      </div>

      {/* === Recent Activity === */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.type === 'profit' ? 'bg-green-100' : 'bg-blue-100'
                      }`}
                  >
                    {activity.type === 'profit' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.type === 'profit' ? 'Profit sharing' : 'Investment'}
                    </p>
                    <p className="text-sm text-gray-600">{activity.company}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${activity.type === 'profit' ? 'text-green-600' : 'text-blue-600'
                      }`}
                  >
                    {activity.type === 'profit' ? '+' : ''}${activity.amount}
                  </p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
