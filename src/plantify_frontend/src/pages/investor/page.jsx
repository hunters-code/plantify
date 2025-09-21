import React from 'react';
import { Layout } from '../../components';
import { Button, Card, StatsCard } from '../../components/ui';

export default function InvestorDashboard() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Investor Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome to your investor dashboard</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Portfolio Overview */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Overview</h3>
              <div className="space-y-3">
                <StatsCard
                  label="Total Investments"
                  value="$0"
                />
                <StatsCard
                  label="Active Startups"
                  value="0"
                />
                <StatsCard
                  label="Total Returns"
                  value="$0"
                  className="text-green-600"
                />
              </div>
            </Card>

            {/* Recent Investments */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Investments</h3>
              <div className="text-center py-8">
                <p className="text-gray-500">No investments yet</p>
                <Button
                  variant='primary'
                  className="mt-4 bg-purple-500 hover:bg-purple-600"
                >
                  Browse Startups
                </Button>
              </div>
            </Card>

            {/* Investment History */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment History</h3>
              <div className="text-center py-8">
                <p className="text-gray-500">No history available</p>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant='primary'
                className="bg-purple-500 hover:bg-purple-600"
              >
                Explore Startups
              </Button>
              <Button
                variant='secondary'
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                View Portfolio
              </Button>
              <Button
                variant='primary'
                className="bg-green-500 hover:bg-green-600"
              >
                Investment History
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
