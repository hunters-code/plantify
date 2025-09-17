import React from 'react';
import { Layout } from '../../components';

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
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Investments</span>
                  <span className="font-semibold">$0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Startups</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Returns</span>
                  <span className="font-semibold text-green-600">$0</span>
                </div>
              </div>
            </div>

            {/* Recent Investments */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Investments</h3>
              <div className="text-center py-8">
                <p className="text-gray-500">No investments yet</p>
                <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition">
                  Browse Startups
                </button>
              </div>
            </div>

            {/* Investment History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment History</h3>
              <div className="text-center py-8">
                <p className="text-gray-500">No history available</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition">
                Explore Startups
              </button>
              <button className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition">
                View Portfolio
              </button>
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
                Investment History
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
