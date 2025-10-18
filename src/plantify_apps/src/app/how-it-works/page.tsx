'use client';

import React from 'react';

import Image from 'next/image';

import {
  Users,
  TrendingUp,
  Shield,
  Coins,
  Target,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  BarChart3,
  DollarSign,
} from 'lucide-react';

import { Layout } from '@/components';
import { Button, Card } from '@/components/ui';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Users className='w-8 h-8 text-blue-600' />,
      title: 'Register Your Account',
      description:
        'Sign up as either a Founder or Investor using Internet Identity for secure authentication.',
      details: [
        'Choose your role: Founder or Investor',
        'Complete KYC verification',
        'Set up your profile and preferences',
      ],
    },
    {
      icon: <Lightbulb className='w-8 h-8 text-purple-600' />,
      title: 'For Founders: Create Your Startup',
      description:
        'Submit your startup details, business plan, and funding requirements to our platform.',
      details: [
        'Upload business plan and financial projections',
        'Set funding goals and NFT pricing',
        'Add team member information',
        'Submit for review and approval',
      ],
    },
    {
      icon: <Target className='w-8 h-8 text-green-600' />,
      title: 'For Investors: Explore Opportunities',
      description:
        'Browse verified startups, analyze their potential, and make informed investment decisions.',
      details: [
        'Filter startups by sector and risk level',
        'Use AI analysis tools for insights',
        'Review financial projections and team',
        'Access detailed startup information',
      ],
    },
    {
      icon: <Coins className='w-8 h-8 text-orange-600' />,
      title: 'Invest Through NFTs',
      description:
        'Purchase startup NFTs using ckUSDC to become a stakeholder in promising ventures.',
      details: [
        'Each NFT represents ownership stake',
        'Transparent pricing and availability',
        'Secure blockchain transactions',
        'Instant ownership verification',
      ],
    },
    {
      icon: <BarChart3 className='w-8 h-8 text-indigo-600' />,
      title: 'Track Performance',
      description:
        'Monitor your investments through detailed dashboards and regular startup reports.',
      details: [
        'Real-time portfolio tracking',
        'Monthly performance reports',
        'Voting rights on key decisions',
        'Direct communication with founders',
      ],
    },
    {
      icon: <DollarSign className='w-8 h-8 text-emerald-600' />,
      title: 'Earn Returns',
      description:
        'Receive periodic profit sharing and potential returns based on startup performance.',
      details: [
        'Monthly profit sharing distributions',
        'Potential for high ROI',
        'Exit opportunities through secondary markets',
        'Transparent revenue sharing model',
      ],
    },
  ];

  const features = [
    {
      icon: <Shield className='w-6 h-6 text-blue-600' />,
      title: 'Blockchain Security',
      description:
        'All transactions secured by Internet Computer blockchain technology.',
    },
    {
      icon: <TrendingUp className='w-6 h-6 text-green-600' />,
      title: 'AI-Powered Analysis',
      description:
        'Get intelligent insights and risk assessments for every startup.',
    },
    {
      icon: <CheckCircle className='w-6 h-6 text-purple-600' />,
      title: 'Verified Startups',
      description:
        'All startups undergo thorough verification and due diligence.',
    },
  ];

  return (
    <Layout>
      <div className='min-h-screen bg-gradient-to-br via-white to-purple-50'>
        {/* Hero Section */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16'>
          <div className='text-center mb-16'>
            <h1 className='text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-ibm'>
              How <span className='text-blue-600'>Plantify</span> Works
            </h1>
            <p className='text-lg text-gray-600 max-w-3xl mx-auto mb-8 font-geist'>
              Discover how our revolutionary platform connects innovative
              startups with smart investors through blockchain-powered NFT
              investments.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                variant='primary'
                className='px-8 py-3'
                onClick={() => (window.location.href = '/explore')}
              >
                Start Exploring
                <ArrowRight className='w-5 h-5 ml-2' />
              </Button>
              <Button
                variant='secondary'
                className='px-8 py-3'
                onClick={() => (window.location.href = '/auth')}
              >
                Join as Investor
              </Button>
            </div>
          </div>

          {/* Process Steps */}
          <div className='mb-20'>
            <h2 className='text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12 font-ibm'>
              Simple 6-Step Process
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {steps.map((step, index) => (
                <Card
                  key={index}
                  className='p-6 hover:shadow-lg transition-shadow'
                >
                  <div className='flex items-center mb-4'>
                    <div className='flex-shrink-0 mr-4'>{step.icon}</div>
                    <div className='flex-1'>
                      <div className='flex items-center mb-2'>
                        <span className='bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2'>
                          Step {index + 1}
                        </span>
                      </div>
                      <h3 className='text-lg font-semibold text-gray-900 font-ibm'>
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <p className='text-gray-600 mb-4 font-geist'>
                    {step.description}
                  </p>
                  <ul className='space-y-2'>
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className='flex items-start'>
                        <CheckCircle className='w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0' />
                        <span className='text-sm text-gray-600 font-geist'>
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className='mb-20'>
            <h2 className='text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12 font-ibm'>
              Why Choose Plantify?
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className='p-6 text-center hover:shadow-lg transition-shadow'
                >
                  <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-gray-50 rounded-full'>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-3 font-ibm'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600 font-geist'>
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Investment Flow Diagram */}
          <div className='mb-20'>
            <h2 className='text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12 font-ibm'>
              Investment Flow
            </h2>
            <div className='bg-white rounded-2xl p-8 shadow-lg'>
              <div className='flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-8'>
                <div className='flex-1 text-center'>
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Users className='w-8 h-8 text-blue-600' />
                  </div>
                  <h3 className='font-semibold text-gray-900 mb-2 font-ibm'>
                    Investor
                  </h3>
                  <p className='text-sm text-gray-600 font-geist'>
                    Browse and select startups
                  </p>
                </div>

                <ArrowRight className='w-6 h-6 text-gray-400 transform md:rotate-0 rotate-90' />

                <div className='flex-1 text-center'>
                  <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Coins className='w-8 h-8 text-purple-600' />
                  </div>
                  <h3 className='font-semibold text-gray-900 mb-2 font-ibm'>
                    NFT Purchase
                  </h3>
                  <p className='text-sm text-gray-600 font-geist'>
                    Buy NFTs with ckUSDC
                  </p>
                </div>

                <ArrowRight className='w-6 h-6 text-gray-400 transform md:rotate-0 rotate-90' />

                <div className='flex-1 text-center'>
                  <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Target className='w-8 h-8 text-green-600' />
                  </div>
                  <h3 className='font-semibold text-gray-900 mb-2 font-ibm'>
                    Startup
                  </h3>
                  <p className='text-sm text-gray-600 font-geist'>
                    Receives funding for growth
                  </p>
                </div>

                <ArrowRight className='w-6 h-6 text-gray-400 transform md:rotate-0 rotate-90' />

                <div className='flex-1 text-center'>
                  <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <TrendingUp className='w-8 h-8 text-orange-600' />
                  </div>
                  <h3 className='font-semibold text-gray-900 mb-2 font-ibm'>
                    Returns
                  </h3>
                  <p className='text-sm text-gray-600 font-geist'>
                    Profit sharing & growth
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className='text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white'>
            <h2 className='text-2xl md:text-3xl font-bold mb-4 font-ibm'>
              Ready to Start Your Investment Journey?
            </h2>
            <p className='text-lg mb-8 text-blue-100 font-geist'>
              Join thousands of investors and founders building the future
              together.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                variant='secondary'
                className='px-8 py-3 bg-white text-blue-600 hover:bg-gray-100'
                onClick={() => (window.location.href = '/auth')}
              >
                Get Started Now
              </Button>
              <Button
                // variant='outline'
                className='px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600'
                onClick={() => (window.location.href = '/explore')}
              >
                Explore Startups
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
