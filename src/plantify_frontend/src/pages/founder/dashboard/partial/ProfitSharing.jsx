import { useState } from 'react';
import { Eye, Plus, AlertTriangle } from 'lucide-react';
import { Badge, Button, Card } from '../../../../components/ui';

export default function ProfitSharing() {
  const [activePaymentTab, setActivePaymentTab] = useState(0);

  const paymentTabs = [
    { label: 'Current payment' },
    { label: 'Payment history' },
    { label: 'Analytics' },
    { label: 'Investor feedback' }
  ];

  return (
    <Card className="bg-neutral-100">
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

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">January 2025 Payment</h3>
        
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

        <div className="mb-4">
          <div className="flex border-b border-gray-200">
            {paymentTabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActivePaymentTab(index)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activePaymentTab === index
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activePaymentTab === 0 && (
          <div className="grid grid-cols-2 gap-8">
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

        {activePaymentTab === 1 && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">December 2024</span>
                  <Badge variant="success">Paid</Badge>
                </div>
                <span className="text-sm text-gray-500">12/20/2024</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-sm">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium ml-2">$1,000</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Approval rate:</span>
                  <span className="font-medium ml-2">95%</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Votes:</span>
                  <span className="font-medium ml-2">76/80</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Transaction:</span>
                  <span className="font-medium ml-2">0x1234...5678</span>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-blue-800">Payment completed successfully with 95% approval rate</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">View Details</Button>
                <Button variant="secondary" size="sm">Download Receipt</Button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">November 2024</span>
                  <Badge variant="success">Paid</Badge>
                </div>
                <span className="text-sm text-gray-500">11/19/2024</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-sm">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium ml-2">$1,000</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Approval rate:</span>
                  <span className="font-medium ml-2">98%</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Votes:</span>
                  <span className="font-medium ml-2">78/80</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Transaction:</span>
                  <span className="font-medium ml-2">0x9876...5432</span>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-blue-800">Excellent performance this month</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">View Details</Button>
                <Button variant="secondary" size="sm">Download Receipt</Button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">October 2024</span>
                  <Badge variant="success">Paid</Badge>
                </div>
                <span className="text-sm text-gray-500">10/21/2024</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="text-sm">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-medium ml-2">$1,000</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Approval rate:</span>
                  <span className="font-medium ml-2">90%</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Votes:</span>
                  <span className="font-medium ml-2">72/80</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Transaction:</span>
                  <span className="font-medium ml-2">0xabcd...efgh</span>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-blue-800">On-time payment with good community feedback</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">View Details</Button>
                <Button variant="secondary" size="sm">Download Receipt</Button>
              </div>
            </div>
          </div>
        )}

        {activePaymentTab === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold mb-4">Payment Performance</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>On-time Payments</span>
                      <span className="font-medium">3/3 (100%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Approval Rate</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '94%'}}></div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Total Amount Paid:</span>
                    <span className="font-medium ml-2">$3,000</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-4">Trend Analysis</h4>
                <div className="space-y-4">
                  <div className="text-sm">
                    <div className="font-medium">Payment Trend</div>
                    <div className="text-gray-500">Stable</div>
                    <div className="text-xs text-gray-400">Consistent payments</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Investor Satisfaction</div>
                    <div className="text-gray-500">94%</div>
                    <div className="text-xs text-gray-400">High approval</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Community Health</div>
                    <div className="text-gray-500">95%</div>
                    <div className="text-xs text-gray-400">High engagement</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">Monthly Payment History</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">December 2024</span>
                    <Badge variant="success">Paid</Badge>
                  </div>
                  <div className="text-sm text-gray-500">$1,000 (98% approval)</div>
                  <div className="text-sm text-gray-500">10/21/2024</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">November 2024</span>
                    <Badge variant="success">Paid</Badge>
                  </div>
                  <div className="text-sm text-gray-500">$1,000 (98% approval)</div>
                  <div className="text-sm text-gray-500">11/19/2024</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">October 2024</span>
                    <Badge variant="success">Paid</Badge>
                  </div>
                  <div className="text-sm text-gray-500">$1,000 (90% approval)</div>
                  <div className="text-sm text-gray-500">10/21/2024</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activePaymentTab === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">95%</div>
                <div className="text-sm text-gray-500">Voting Participation</div>
                <div className="text-xs text-gray-400 mt-1">Average over last 3 months</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">94%</div>
                <div className="text-sm text-gray-500">Average Approval</div>
                <div className="text-xs text-gray-400 mt-1">Community satisfaction</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">23</div>
                <div className="text-sm text-gray-500">Active Comments</div>
                <div className="text-xs text-gray-400 mt-1">This month</div>
              </Card>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4">Recent Investor Feedback</h4>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-sm">
                      <span className="font-medium">Approval Rate: </span>
                      <span className="font-bold">95%</span>
                      <span className="text-gray-500"> (76/80 votes)</span>
                    </div>
                    <span className="text-sm text-gray-500">Dec 20, 2024</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm italic text-gray-700">
                      "Excellent performance this month. Revenue exceeded expectations and the team delivered on all milestones."
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-sm">
                      <span className="font-medium">Approval Rate: </span>
                      <span className="font-bold">97%</span>
                      <span className="text-gray-500"> (78/80 votes)</span>
                    </div>
                    <span className="text-sm text-gray-500">Nov 19, 2024</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm italic text-gray-700">
                      "Outstanding month! The new product launch was successful and customer feedback is very positive."
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-sm">
                      <span className="font-medium">Approval Rate: </span>
                      <span className="font-bold">90%</span>
                      <span className="text-gray-500"> (72/80 votes)</span>
                    </div>
                    <span className="text-sm text-gray-500">Oct 21, 2024</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm italic text-gray-700">
                      "Good progress despite market challenges. Looking forward to seeing the improvements mentioned in the forward-looking section."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
        <AlertTriangle size={20} className="text-orange-500" />
        <div className="text-sm text-yellow-800">
          <strong>Payment Pending.</strong> Make your payment by 1/21/2025 to maintain good standing with investors.
        </div>
      </div>
    </Card>
  );
}
