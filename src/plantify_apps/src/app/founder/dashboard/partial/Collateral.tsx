import React from 'react';

import { Card } from '@/components/ui';

const Collateral: React.FC = () => {
  return (
    <Card className="bg-neutral-100">
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-gray-900 mb-2">$4,800</div>
          <div className="text-sm text-gray-500">Required Amount</div>
          <div className="text-xs text-gray-400 mt-1">
            Total collateral needed (ckUSDC)
          </div>
        </Card>

        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-gray-900 mb-2">$4,800</div>
          <div className="text-sm text-gray-500">Deposited Amount</div>
          <div className="text-xs text-gray-400 mt-1">
            Current deposits (ckUSDC)
          </div>
        </Card>

        <Card className="text-center p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
          <div className="text-sm text-gray-500">Progress</div>
          <div className="text-xs text-gray-400 mt-1">Completion status</div>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Collateral Progress: 100% Funded
          </span>
          <span className="text-sm font-medium text-gray-700">$0 remaining</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full"
            style={{ width: '100%' }}
          ></div>
        </div>
        <div className="text-sm text-gray-500 mt-1">100% complete</div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Top-Up History</h3>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">June 15, 2024</div>
                <div className="text-xs text-gray-500">ICP</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-green-600">
                  +$2,000 ckUSDC
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">June 20, 2024</div>
                <div className="text-xs text-gray-500">ckUSDC</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-green-600">
                  +$2,800 ckUSDC
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Collateral;
