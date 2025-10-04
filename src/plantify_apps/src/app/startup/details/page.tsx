import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button, Card, LoadingSpinner } from '@/components/ui';

type TeamMember = {
  name: string;
  role: string;
};

type Startup = {
  id: string;
  startupName: string;
  sector: string;
  location: string;
  fundingGoal: number;
  equityOffering: number;
  valuation: number;
  description: string;
  problemStatement: string;
  solution: string;
  businessModel: string;
  teamMembers: TeamMember[];
};

export default function StartupDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // TODO: Fetch startup details from backend
    // Dummy data sementara
    const dummyStartup: Startup = {
      id: id || '1',
      startupName: 'Tech Innovators',
      sector: 'Technology',
      location: 'Jakarta, Indonesia',
      fundingGoal: 500000,
      equityOffering: 10,
      valuation: 5000000,
      description: 'A cutting-edge AI startup focused on automation solutions.',
      problemStatement: 'Businesses struggle with repetitive manual tasks.',
      solution: 'Provide AI-powered automation tools to streamline workflows.',
      businessModel: 'Subscription SaaS model with tiered pricing.',
      teamMembers: [
        { name: 'John Doe', role: 'Founder & CEO' },
        { name: 'Jane Smith', role: 'CTO' },
      ],
    };

    setStartup(dummyStartup);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="xl" />
            <p className="mt-4 text-gray-600">Loading startup details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="overflow-hidden">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {startup?.startupName || 'Startup Name'}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {startup?.sector || 'Technology'} • {startup?.location || 'Location'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ${startup?.fundingGoal?.toLocaleString() || '0'} Goal
                  </div>
                  <div className="text-sm text-gray-500">
                    {startup?.equityOffering || '0'}% Equity
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {startup?.description || 'No description available.'}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Problem Statement</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {startup?.problemStatement || 'No problem statement available.'}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Solution</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {startup?.solution || 'No solution description available.'}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Business Model</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {startup?.businessModel || 'No business model information available.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Funding Goal:</span>
                        <span className="font-semibold">
                          ${startup?.fundingGoal?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Equity Offering:</span>
                        <span className="font-semibold">{startup?.equityOffering || '0'}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valuation:</span>
                        <span className="font-semibold">
                          ${startup?.valuation?.toLocaleString() || '0'}
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Team</h3>
                    <div className="space-y-3">
                      {startup?.teamMembers?.length ? (
                        startup.teamMembers.map((member, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {member.name?.charAt(0) || '?'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {member.name || 'Team Member'}
                              </p>
                              <p className="text-sm text-gray-600">{member.role || 'Role'}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No team information available.</p>
                      )}
                    </div>
                  </Card>

                  <div className="space-y-3">
                    <Button variant="primary" className="w-full">
                      Invest Now
                    </Button>
                    <Button variant="secondary" className="w-full">
                      Contact Team
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
