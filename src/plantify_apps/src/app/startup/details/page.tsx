'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import Layout from '@/components/layout/Layout';
import { Button, Card, Skeleton, CardSkeleton } from '@/components/ui';

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
    setLoading(true);
    // 🔹 Simulasi fetch data
    setTimeout(() => {
      const dummyStartup: Startup = {
        id: id || '1',
        startupName: 'Tech Innovators',
        sector: 'Technology',
        location: 'Jakarta, Indonesia',
        fundingGoal: 500000,
        equityOffering: 10,
        valuation: 5000000,
        description:
          'A cutting-edge AI startup focused on automation solutions.',
        problemStatement: 'Businesses struggle with repetitive manual tasks.',
        solution:
          'Provide AI-powered automation tools to streamline workflows.',
        businessModel: 'Subscription SaaS model with tiered pricing.',
        teamMembers: [
          { name: 'John Doe', role: 'Founder & CEO' },
          { name: 'Jane Smith', role: 'CTO' },
        ],
      };

      setStartup(dummyStartup);
      setLoading(false);
    }, 1500);
  }, [id]);

  return (
    <Layout>
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='max-w-6xl mx-auto px-4'>
          <Card className='overflow-hidden'>
            <div className='p-8'>
              {/* Header */}
              <div className='flex items-start justify-between mb-6'>
                <div>
                  {loading ? (
                    <>
                      <Skeleton height={28} width='240px' className='mb-2' />
                      <Skeleton width='180px' height={20} />
                    </>
                  ) : (
                    <>
                      <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                        {startup?.startupName}
                      </h1>
                      <p className='text-gray-600 text-lg'>
                        {startup?.sector} • {startup?.location}
                      </p>
                    </>
                  )}
                </div>
                <div className='text-right'>
                  {loading ? (
                    <>
                      <Skeleton height={24} width='120px' className='mb-2' />
                      <Skeleton height={16} width='80px' />
                    </>
                  ) : (
                    <>
                      <div className='text-2xl font-bold text-green-600'>
                        ${startup?.fundingGoal.toLocaleString()} Goal
                      </div>
                      <div className='text-sm text-gray-500'>
                        {startup?.equityOffering}% Equity
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Left side */}
                <div className='lg:col-span-2 space-y-6'>
                  {loading ? (
                    <>
                      <CardSkeleton textRows={4} />
                      <CardSkeleton textRows={3} />
                      <CardSkeleton textRows={3} />
                      <CardSkeleton textRows={2} />
                    </>
                  ) : (
                    <>
                      <div>
                        <h2 className='text-xl font-semibold text-gray-900 mb-3'>
                          About
                        </h2>
                        <p className='text-gray-700 leading-relaxed'>
                          {startup?.description}
                        </p>
                      </div>

                      <div>
                        <h2 className='text-xl font-semibold text-gray-900 mb-3'>
                          Problem Statement
                        </h2>
                        <p className='text-gray-700 leading-relaxed'>
                          {startup?.problemStatement}
                        </p>
                      </div>

                      <div>
                        <h2 className='text-xl font-semibold text-gray-900 mb-3'>
                          Solution
                        </h2>
                        <p className='text-gray-700 leading-relaxed'>
                          {startup?.solution}
                        </p>
                      </div>

                      <div>
                        <h2 className='text-xl font-semibold text-gray-900 mb-3'>
                          Business Model
                        </h2>
                        <p className='text-gray-700 leading-relaxed'>
                          {startup?.businessModel}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Right side */}
                <div className='space-y-6'>
                  <Card className='bg-gray-50'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                      Investment Details
                    </h3>
                    {loading ? (
                      <div className='space-y-3'>
                        <Skeleton height={20} width='80%' />
                        <Skeleton height={20} width='60%' />
                        <Skeleton height={20} width='70%' />
                      </div>
                    ) : (
                      <div className='space-y-3'>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Funding Goal:</span>
                          <span className='font-semibold'>
                            ${startup?.fundingGoal.toLocaleString()}
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>
                            Equity Offering:
                          </span>
                          <span className='font-semibold'>
                            {startup?.equityOffering}%
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-600'>Valuation:</span>
                          <span className='font-semibold'>
                            ${startup?.valuation.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </Card>

                  <Card className='bg-gray-50'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                      Team
                    </h3>
                    {loading ? (
                      <div className='space-y-3'>
                        <Skeleton height={40} width='100%' />
                        <Skeleton height={40} width='100%' />
                      </div>
                    ) : (
                      <div className='space-y-3'>
                        {startup?.teamMembers?.map((member, index) => (
                          <div
                            key={index}
                            className='flex items-center space-x-3'
                          >
                            <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                              <span className='text-blue-600 font-semibold'>
                                {member.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className='font-medium text-gray-900'>
                                {member.name}
                              </p>
                              <p className='text-sm text-gray-600'>
                                {member.role}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  <div className='space-y-3'>
                    {loading ? (
                      <>
                        <Skeleton height={40} width='100%' />
                        <Skeleton height={40} width='100%' />
                      </>
                    ) : (
                      <>
                        <Button variant='primary' className='w-full'>
                          Invest Now
                        </Button>
                        <Button variant='secondary' className='w-full'>
                          Contact Team
                        </Button>
                      </>
                    )}
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
