import { useState } from 'react';
import { Eye, Plus, AlertTriangle } from 'lucide-react';
import { Badge, Button, Card } from '@/components/ui';

type PaymentTab = {
  label: string;
};

export default function ProfitSharing() {
  const [activePaymentTab, setActivePaymentTab] = useState<number>(0);

  const paymentTabs: PaymentTab[] = [
    { label: 'Current payment' },
    { label: 'Payment history' },
    { label: 'Analytics' },
    { label: 'Investor feedback' }
  ];

  return (
    <Card className="bg-neutral-100">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">$3,000</div>
          <div className="text-sm text-gray-500">Total Paid</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
          <div className="text-sm text-gray-500">Payments Made</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">94%</div>
          <div className="text-sm text-gray-500">Avg Approval</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">80</div>
          <div className="text-sm text-gray-500">Active Investors</div>
        </Card>
      </div>

      {/* Payment Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">January 2025 Payment</h3>

        {/* Payment Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-8">
            <div>
              <div className="text-sm text-gray-500 mb-1">Amount Due</div>
              <div className="text-sm font-semibold">$1,000 ckUSDC</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Due Date</div>
              <div className="text-sm font-semibold">1/21/2025</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Days Remaining</div>
              <div className="text-sm font-semibold text-red-600">238 days</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">
              <Eye size={16} />
              View Details
            </Button>
            <Button variant="primary">
              <Plus size={16} />
              Make payment
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="flex border-b border-gray-200">
            {paymentTabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActivePaymentTab(index)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activePaymentTab === index
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activePaymentTab === 0 && (
          <div className="grid grid-cols-2 gap-8">
            {/* Payment Information */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Payment Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium">$1,000 ckUSDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Due Date:</span>
                  <span className="font-medium">1/21/2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <Badge variant="warning">Pending</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Investors:</span>
                  <span className="font-medium">80 active</span>
                </div>
              </div>
            </div>

            {/* Voting Status */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Voting status</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Approved:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rejected:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Abstained:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Participation:</span>
                  <span className="font-medium">0%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab lain tetap sama, tidak perlu diubah typing-nya */}
        {/* ... (History, Analytics, Feedback) */}
      </div>

      {/* Footer Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
        <AlertTriangle size={20} className="text-orange-500" />
        <div className="text-sm text-yellow-800">
          <strong>Payment Pending.</strong> Make your payment by 1/21/2025 to maintain good standing with investors.
        </div>
      </div>
    </Card>
  );
}
