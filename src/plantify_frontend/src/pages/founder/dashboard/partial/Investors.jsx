import { useState } from 'react';
import { Search, Filter, Eye, MessageCircle, Download, BarChart3, Users, TrendingUp } from 'lucide-react';
import { Badge, Button, Card } from '../../../../components/ui';

export default function Investors() {
  const [activeInvestorTab, setActiveInvestorTab] = useState(0);

  const investorTabs = [
    { label: 'Overview' },
    { label: 'Investor list' },
    { label: 'Analytics' },
    { label: 'Engagement' }
  ];

  const investors = [
    {
      name: 'David Kim',
      wallet: 'Oxdef0_1234',
      badges: ['VIP investors', 'Whale investor', 'Top supporter', 'Community leader'],
      investment: '$10,500',
      nftsOwned: '20',
      profitReceived: '$2,000',
      participation: '100%',
      location: 'Los Angeles, CA'
    },
    {
      name: 'Alex Chen',
      wallet: 'Ox1234_5678',
      badges: ['VIP investors', 'Early investor', 'Top supporter', 'Community leader'],
      investment: '$7,500',
      nftsOwned: '15',
      profitReceived: '$1,500',
      participation: '98%',
      location: 'San Francisco, CA'
    },
    {
      name: 'Sarah Johnson',
      wallet: '0x9876..efgh',
      badges: ['Active investors', 'Active voter', 'Long-term holder'],
      investment: '$6,000',
      nftsOwned: '12',
      profitReceived: '$1,200',
      participation: '92%',
      location: 'New York, NY'
    },
    {
      name: 'Mike Rodriguez',
      wallet: 'Oxabcd_efgh',
      badges: ['Active investors', 'Consistent investor'],
      investment: '$4,000',
      nftsOwned: '8',
      profitReceived: '$800',
      participation: '85%',
      location: 'Austin, TX'
    },
    {
      name: 'Emily Davis',
      wallet: '0x5678_9abc',
      badges: ['Active investors', 'New investor'],
      investment: '$2,500',
      nftsOwned: '5',
      profitReceived: '$500',
      participation: '78%',
      location: 'Seattle, WA'
    },
    {
      name: 'Lisa Wang',
      wallet: '0x5678_9abc',
      badges: ['Inactive investors', 'Small investor'],
      investment: '$1,500',
      nftsOwned: '3',
      profitReceived: '$300',
      participation: '45%',
      location: 'Chicago, IL'
    }
  ];

  const getBadgeVariant = (badge) => {
    if (badge.includes('VIP')) return 'primary';
    if (badge.includes('Active')) return 'success';
    if (badge.includes('Inactive')) return 'warning';
    return 'secondary';
  };

  return (
    <Card className="bg-neutral-100">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold">Investors</h2>
          <p className="text-sm text-gray-500">$1,000 (98% approval)</p>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500">10/21/2024</span>
          <Badge variant="success" className="ml-2">Paid</Badge>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">$40,000</div>
          <div className="text-sm text-gray-500">Total investment</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">80</div>
          <div className="text-sm text-gray-500">Total investors</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
          <div className="text-sm text-gray-500">Active investors</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">2</div>
          <div className="text-sm text-gray-500">VIP investors</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">83%</div>
          <div className="text-sm text-gray-500">Avg Participation</div>
        </Card>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search investors by name or wallet address"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <Button variant="secondary">
          <Filter size={16} />
          Filters
        </Button>
      </div>

      <div className="mb-4">
        <div className="flex border-b border-gray-200">
          {investorTabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveInvestorTab(index)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeInvestorTab === index
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeInvestorTab === 0 && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-4">Investment Distribution</h4>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-sm font-medium">VIP Investors</span>
                    <Badge variant="secondary" className="ml-2">Large holders</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">$17,500</div>
                    <div className="text-xs text-gray-500">2 investors</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-sm font-medium">Active Investors</span>
                    <Badge variant="secondary" className="ml-2">Regular participants</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">$12,500</div>
                    <div className="text-xs text-gray-500">3 investors</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-sm font-medium">Inactive Investors</span>
                    <Badge variant="secondary" className="ml-2">Low engagement</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">$1,500</div>
                    <div className="text-xs text-gray-500">1 investors</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Community Health</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Voting participation</span>
                  <span className="font-medium">83%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '83%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Profit Distribution</span>
                  <span className="font-medium">$6,300</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Community Growth</span>
                  <span className="font-medium">+12% this month</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Top Investors</h4>
            <div className="space-y-3">
              {investors.slice(0, 5).map((investor, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">#{index + 1}. {investor.name}</span>
                      <div className="flex gap-1">
                        {investor.badges.slice(0, 2).map((badge, badgeIndex) => (
                          <Badge key={badgeIndex} variant={getBadgeVariant(badge)} size="sm">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{investor.investment}</div>
                      <div className="text-gray-500">{investor.participation} participation</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeInvestorTab === 1 && (
        <div className="space-y-4">
          {investors.map((investor, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h5 className="font-medium">{investor.name}</h5>
                  <p className="text-sm text-gray-500">{investor.wallet}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    <Eye size={14} />
                    View
                  </Button>
                  <Button variant="secondary" size="sm">
                    <MessageCircle size={14} />
                    Message
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {investor.badges.map((badge, badgeIndex) => (
                  <Badge key={badgeIndex} variant={getBadgeVariant(badge)} size="sm">
                    {badge}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Investment:</span>
                  <div className="font-medium">{investor.investment}</div>
                </div>
                <div>
                  <span className="text-gray-500">NFTs owned:</span>
                  <div className="font-medium">{investor.nftsOwned}</div>
                </div>
                <div>
                  <span className="text-gray-500">Profit received:</span>
                  <div className="font-medium">{investor.profitReceived}</div>
                </div>
                <div>
                  <span className="text-gray-500">Participation:</span>
                  <div className="font-medium">{investor.participation}</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                📍 {investor.location}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeInvestorTab === 2 && (
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-4">Geographic Distribution</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                <span className="text-sm font-medium">North America</span>
                <div className="text-right">
                  <div className="text-sm font-semibold">45%</div>
                  <div className="text-xs text-gray-500">27 investors</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                <span className="text-sm font-medium">Europe</span>
                <div className="text-right">
                  <div className="text-sm font-semibold">32%</div>
                  <div className="text-xs text-gray-500">19 investors</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                <span className="text-sm font-medium">Asia Pacific</span>
                <div className="text-right">
                  <div className="text-sm font-semibold">23%</div>
                  <div className="text-xs text-gray-500">14 investors</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Investment Trends</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                <span className="text-sm font-medium">Average Investment</span>
                <div className="text-right">
                  <div className="text-sm font-semibold">$500</div>
                  <div className="text-xs text-green-600">+5% vs last month</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                <span className="text-sm font-medium">New Investors</span>
                <div className="text-right">
                  <div className="text-sm font-semibold">8</div>
                  <div className="text-xs text-green-600">+12% growth vs last month</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                <span className="text-sm font-medium">Retention rate</span>
                <div className="text-right">
                  <div className="text-sm font-semibold">94%</div>
                  <div className="text-xs text-green-600">Excellent</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Engagement Metrics</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Voting participation</span>
                  <span className="font-medium">83%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '83%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Community Growth</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '87%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Long-term Holders</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeInvestorTab === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-4">Communication</h4>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start">
                  <MessageCircle size={16} />
                  Send Community Update
                </Button>
                <div className="text-xs text-gray-500 ml-6">Broadcast message to all investors</div>
                
                <Button variant="secondary" className="w-full justify-start">
                  <Users size={16} />
                  Schedule Investor Call
                </Button>
                <div className="text-xs text-gray-500 ml-6">Organize monthly investor meetings</div>
                
                <Button variant="secondary" className="w-full justify-start">
                  <MessageCircle size={16} />
                  Send Thank You Messages
                </Button>
                <div className="text-xs text-gray-500 ml-6">Personalized appreciation messages</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4">Analytics & Reports</h4>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full justify-start">
                  <Download size={16} />
                  Export Investor List
                </Button>
                <div className="text-xs text-gray-500 ml-6">Download CSV with all investor data</div>
                
                <Button variant="secondary" className="w-full justify-start">
                  <BarChart3 size={16} />
                  Generate Engagement Report
                </Button>
                <div className="text-xs text-gray-500 ml-6">Detailed participation analytics</div>
                
                <Button variant="secondary" className="w-full justify-start">
                  <TrendingUp size={16} />
                  View Investor Feedback
                </Button>
                <div className="text-xs text-gray-500 ml-6">Comments and suggestions from community</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">Recent Community Activity</h4>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">Monthly Report Discussion</div>
                    <div className="text-xs text-gray-500">23 comments - 2 hours ago</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">95% approval</div>
                    <div className="text-xs text-gray-500">High engagement</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">Profit Sharing Payment</div>
                    <div className="text-xs text-gray-500">December payment completed - 1 day ago</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">$1,000 distributed</div>
                    <div className="text-xs text-gray-500">80 investors</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">New Investor Welcome</div>
                    <div className="text-xs text-gray-500">5 new investors joined - 3 days ago</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">+$2,500 investment</div>
                    <div className="text-xs text-gray-500">Community growth</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
