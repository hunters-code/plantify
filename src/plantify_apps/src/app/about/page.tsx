'use client';

import React from 'react';

import Image from 'next/image';

import {
  Target,
  Eye,
  Heart,
  Users,
  TrendingUp,
  Shield,
  Globe,
  Lightbulb,
  Award,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

import { Layout } from '@/components';
import { Button, Card } from '@/components/ui';

export default function About() {
  const values = [
    {
      icon: <Shield className='w-8 h-8 text-blue-600' />,
      title: 'Transparency',
      description:
        'We believe in complete transparency in all our operations, from startup verification to investment tracking.',
    },
    {
      icon: <Users className='w-8 h-8 text-green-600' />,
      title: 'Community',
      description:
        "Building a strong community of entrepreneurs and investors who support each other's growth.",
    },
    {
      icon: <Lightbulb className='w-8 h-8 text-purple-600' />,
      title: 'Innovation',
      description:
        'Leveraging cutting-edge blockchain technology and AI to revolutionize startup funding.',
    },
    {
      icon: <Heart className='w-8 h-8 text-red-600' />,
      title: 'Impact',
      description:
        'Creating positive impact by enabling innovative startups to solve real-world problems.',
    },
  ];

  const team = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Co-Founder',
      image: '/assets/images/team-1.jpg',
      description:
        'Former startup founder with 10+ years in fintech and blockchain.',
    },
    {
      name: 'Sarah Chen',
      role: 'CTO & Co-Founder',
      image: '/assets/images/team-2.jpg',
      description:
        'Ex-Google engineer specializing in distributed systems and AI.',
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Investments',
      image: '/assets/images/team-3.jpg',
      description:
        'Former VC partner with expertise in early-stage startup evaluation.',
    },
    {
      name: 'Emily Watson',
      role: 'Head of Operations',
      image: '/assets/images/team-4.jpg',
      description:
        'Operations expert with background in scaling tech platforms.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Startups Funded' },
    { number: '$50M+', label: 'Total Funding Raised' },
    { number: '10K+', label: 'Active Investors' },
    { number: '25%', label: 'Average ROI' },
  ];

  return (
    <Layout>
      <div className='min-h-screen bg-white'>
        {/* Hero Section */}
        <div className='bg-gradient-to-br from-blue-50 via-white to-purple-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16'>
            <div className='text-center mb-16'>
              <h1 className='text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-ibm'>
                About <span className='text-blue-600'>Plantify</span>
              </h1>
              <p className='text-lg text-gray-600 max-w-3xl mx-auto mb-8 font-geist'>
                We&apos;re revolutionizing startup funding by connecting
                innovative entrepreneurs with smart investors through
                blockchain-powered NFT investments.
              </p>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mb-20'>
              {stats.map((stat, index) => (
                <div key={index} className='text-center'>
                  <div className='text-3xl md:text-4xl font-bold text-blue-600 mb-2'>
                    {stat.number}
                  </div>
                  <div className='text-gray-600 font-medium'>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20'>
            <Card className='p-8'>
              <div className='flex items-center mb-6'>
                <Target className='w-8 h-8 text-blue-600 mr-3' />
                <h2 className='text-xl font-bold text-gray-900 font-ibm'>
                  Our Mission
                </h2>
              </div>
              <p className='text-gray-600 leading-relaxed font-geist'>
                To democratize startup funding by creating a transparent,
                secure, and accessible platform where innovative entrepreneurs
                can connect with investors worldwide. We believe every great
                idea deserves the chance to flourish, regardless of geographical
                boundaries or traditional funding barriers.
              </p>
            </Card>

            <Card className='p-8'>
              <div className='flex items-center mb-6'>
                <Eye className='w-8 h-8 text-purple-600 mr-3' />
                <h2 className='text-xl font-bold text-gray-900 font-ibm'>
                  Our Vision
                </h2>
              </div>
              <p className='text-gray-600 leading-relaxed font-geist'>
                To become the world&apos;s leading blockchain-based startup
                funding platform, fostering a global ecosystem where innovation
                thrives, investors earn sustainable returns, and entrepreneurs
                have the resources they need to build solutions that make the
                world a better place.
              </p>
            </Card>
          </div>

          {/* Values */}
          <div className='mb-20'>
            <h2 className='text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12 font-ibm'>
              Our Core Values
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {values.map((value, index) => (
                <Card
                  key={index}
                  className='p-6 text-center hover:shadow-lg transition-shadow'
                >
                  <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-gray-50 rounded-full'>
                      {value.icon}
                    </div>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-3 font-ibm'>
                    {value.title}
                  </h3>
                  <p className='text-gray-600 font-geist'>
                    {value.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Our Story */}
          <div className='mb-20'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div>
                <h2 className='text-3xl font-bold text-gray-900 mb-6'>
                  Our Story
                </h2>
                <div className='space-y-4 text-gray-600'>
                  <p>
                    Plantify was born from the frustration of watching brilliant
                    startups struggle to find funding while investors missed out
                    on incredible opportunities due to geographical and network
                    limitations.
                  </p>
                  <p>
                    Founded in 2024 by a team of serial entrepreneurs and
                    blockchain experts, we set out to create a platform that
                    would level the playing field for both startups and
                    investors worldwide.
                  </p>
                  <p>
                    By leveraging the power of blockchain technology and NFTs,
                    we&apos;ve created a transparent, secure, and efficient way
                    for startups to raise capital and for investors to
                    participate in the next generation of innovative companies.
                  </p>
                </div>
              </div>
              <div className='relative'>
                <div className='bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='bg-white rounded-lg p-4 text-center'>
                      <Globe className='w-8 h-8 text-blue-600 mx-auto mb-2' />
                      <div className='text-sm font-semibold'>Global Reach</div>
                    </div>
                    <div className='bg-white rounded-lg p-4 text-center'>
                      <TrendingUp className='w-8 h-8 text-green-600 mx-auto mb-2' />
                      <div className='text-sm font-semibold'>High Returns</div>
                    </div>
                    <div className='bg-white rounded-lg p-4 text-center'>
                      <Shield className='w-8 h-8 text-purple-600 mx-auto mb-2' />
                      <div className='text-sm font-semibold'>
                        Secure Platform
                      </div>
                    </div>
                    <div className='bg-white rounded-lg p-4 text-center'>
                      <Award className='w-8 h-8 text-orange-600 mx-auto mb-2' />
                      <div className='text-sm font-semibold'>
                        Verified Startups
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          {/* <div className='mb-20'>
            <h2 className='text-3xl font-bold text-center text-gray-900 mb-12'>
              Meet Our Team
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {team.map((member, index) => (
                <Card key={index} className='p-6 text-center hover:shadow-lg transition-shadow'>
                  <div className='w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center'>
                    <Users className='w-12 h-12 text-blue-600' />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                    {member.name}
                  </h3>
                  <p className='text-blue-600 font-medium mb-3'>
                    {member.role}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {member.description}
                  </p>
                </Card>
              ))}
            </div>
          </div> */}

          {/* Technology */}
          <div className='mb-20'>
            <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center'>
              <h2 className='text-3xl font-bold mb-6'>
                Built on Internet Computer
              </h2>
              <p className='text-xl mb-8 text-blue-100 max-w-3xl mx-auto'>
                Our platform leverages the Internet Computer blockchain for
                unparalleled security, scalability, and decentralization. Every
                transaction is transparent, immutable, and verifiable.
              </p>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                <div>
                  <Shield className='w-12 h-12 mx-auto mb-4' />
                  <h3 className='font-semibold mb-2'>Secure</h3>
                  <p className='text-sm text-blue-100'>
                    End-to-end encryption and blockchain security
                  </p>
                </div>
                <div>
                  <TrendingUp className='w-12 h-12 mx-auto mb-4' />
                  <h3 className='font-semibold mb-2'>Scalable</h3>
                  <p className='text-sm text-blue-100'>
                    Handle millions of transactions efficiently
                  </p>
                </div>
                <div>
                  <Globe className='w-12 h-12 mx-auto mb-4' />
                  <h3 className='font-semibold mb-2'>Decentralized</h3>
                  <p className='text-sm text-blue-100'>
                    No single point of failure or control
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className='text-center'>
            <h2 className='text-3xl font-bold text-gray-900 mb-6'>
              Get in Touch
            </h2>
            <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
              Have questions about our platform? Want to learn more about
              investment opportunities? We&apos;d love to hear from you.
            </p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
              <div className='flex flex-col items-center'>
                <Mail className='w-8 h-8 text-blue-600 mb-3' />
                <h3 className='font-semibold text-gray-900 mb-1'>Email</h3>
                <p className='text-gray-600'>hello@plantify.com</p>
              </div>
              <div className='flex flex-col items-center'>
                <MapPin className='w-8 h-8 text-blue-600 mb-3' />
                <h3 className='font-semibold text-gray-900 mb-1'>Location</h3>
                <p className='text-gray-600'>Global, Decentralized</p>
              </div>
              <div className='flex flex-col items-center'>
                <Phone className='w-8 h-8 text-blue-600 mb-3' />
                <h3 className='font-semibold text-gray-900 mb-1'>Support</h3>
                <p className='text-gray-600'>24/7 Online Support</p>
              </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                variant='primary'
                className='px-8 py-3'
                onClick={() => (window.location.href = '/auth')}
              >
                Join Our Platform
                <ArrowRight className='w-5 h-5 ml-2' />
              </Button>
              <Button
                variant='secondary'
                className='px-8 py-3'
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
