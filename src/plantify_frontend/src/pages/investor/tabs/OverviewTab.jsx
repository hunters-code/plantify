import React from 'react';
import { TrendingUp, DollarSign, Activity, Calendar, Vote } from 'lucide-react';
import { Button, Card } from '../../../components/ui';
import { ProductCard } from '../../../components/features';
import { useNavigate } from 'react-router-dom';

export default function OverviewTab({ dashboardData, matchingStartups, recentActivity }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Dashboard Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">
                ${dashboardData.totalInvested.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">ckUSDC</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Returns</p>
              <p className="text-2xl font-bold text-gray-900">
                +${dashboardData.totalReturns.toLocaleString()}
              </p>
              <p className="text-xs text-green-600">{dashboardData.returnPercentage}% overall</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Commitments</p>
              <p className="text-2xl font-bold text-gray-900">
                ${dashboardData.monthlyCommitments.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">this month</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Investments</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.activeInvestments}</p>
              <p className="text-xs text-gray-500">startups</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Voting Pending</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.votingPending}</p>
              <p className="text-xs text-gray-500">action needed</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Vote className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Startups Matching Your Profile */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Startups Matching Your Profile</h2>
          <Button 
            variant="secondary" 
            className="text-sm"
            onClick={() => navigate('/explore')}
          >
            View all startups
          </Button>
        </div>

        {matchingStartups.length === 0 ? (
          <Card className="p-8">
            <div className="text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Startups Available</h3>
              <p className="text-gray-600 mb-4">There are currently no active startups available for investment.</p>
              <Button variant="primary" onClick={() => navigate('/explore')}>
                Explore All Startups
              </Button>
            </div>
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
                employees="10-50"
                category={startup.sector}
                risk={startup.risk}
                description={startup.description}
                nftPrice={startup.nftPrice}
                periodicReturns={`$${startup.periodicReturns}`}
                annualROI={startup.annualROI}
                available={startup.available}
                fundingProgress={startup.fundingProgress || 0}
                fundedAmount={startup.fundedAmount || 0}
                targetAmount={startup.targetAmount || (startup.nftPrice * startup.available)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400 mt-1">Your investment activity will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'profit' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
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
                  <p className={`font-medium ${
                    activity.type === 'profit' ? 'text-green-600' : 'text-blue-600'
                  }`}>
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
