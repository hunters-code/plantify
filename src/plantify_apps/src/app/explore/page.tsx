'use client';

import { useState, useEffect } from 'react';
import { Funnel, ListFilter, Search } from 'lucide-react';
import {
  Navbar,
  ProductCard,
  Pagination,
  WhyPlantify,
  Footer,
} from '@/components';
import { Button, Input, CardSkeleton } from '@/components/ui';

interface Startup {
  id: string | number;
  image: string;
  title: string;
  location: string;
  employees: number;
  category: string;
  risk: string;
  description: string;
  nftPrice: number;
  periodicReturns: string;
  annualROI: number;
  available: number;
  fundingProgress: number;
  fundedAmount: number;
  targetAmount: number;
  status: string;
}

type FilterType = 'all' | 'available' | 'featured';

export default function Explores() {
  // Dummy auth state
  const isAuthenticated = true;
  const authLoading = false;

  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  // Dummy startups data
  const dummyStartups: Startup[] = [
    {
      id: '1',
      image: '/assets/images/product.png',
      title: 'GreenTech Agriculture',
      location: 'California, USA',
      employees: 25,
      category: 'Agriculture',
      risk: 'Low Risk',
      description: 'Sustainable farming solutions using AI and IoT technology',
      nftPrice: 100,
      periodicReturns: '$8',
      annualROI: 96,
      available: 400,
      fundingProgress: 65,
      fundedAmount: 32500,
      targetAmount: 50000,
      status: 'active',
    },
    {
      id: '2',
      image: '/assets/images/product.png',
      title: 'HealthTech Solutions',
      location: 'New York, USA',
      employees: 40,
      category: 'HealthTech',
      risk: 'Moderate Risk',
      description: 'AI-powered health monitoring and diagnostic platform',
      nftPrice: 150,
      periodicReturns: '$12',
      annualROI: 96,
      available: 200,
      fundingProgress: 80,
      fundedAmount: 60000,
      targetAmount: 75000,
      status: 'active',
    },
    {
      id: '3',
      image: '/assets/images/product.png',
      title: 'FinTech Innovations',
      location: 'London, UK',
      employees: 35,
      category: 'FinTech',
      risk: 'High Risk',
      description: 'Blockchain-based payment solutions for businesses',
      nftPrice: 200,
      periodicReturns: '$15',
      annualROI: 90,
      available: 150,
      fundingProgress: 45,
      fundedAmount: 45000,
      targetAmount: 100000,
      status: 'active',
    },
  ];

  // Fetch startups (dummy delay)
  const fetchStartups = async () => {
    try {
      setLoading(true);
      setError(null);

      setTimeout(() => {
        setStartups(dummyStartups);
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error('Error fetching startups:', err);
      setError('Failed to load startups. Please try again.');
      setLoading(false);
    }
  };

  // Filter startups
  const filteredStartups = startups.filter((startup) => {
    const matchesSearch =
      searchTerm === '' ||
      startup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.location.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesFilter = true;
    if (filter === 'available') {
      matchesFilter = startup.status === 'active' && startup.available > 0;
    } else if (filter === 'featured') {
      matchesFilter = startup.fundingProgress > 50;
    }

    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    fetchStartups();
  }, [isAuthenticated, authLoading]);

  return (
    <div className='bg-gray-50 text-gray-900 min-h-screen'>
      <Navbar />

      <div className='max-w-7xl mx-auto px-6 py-10 mb-32'>
        <h1 className='text-3xl font-ibm'>All Startups</h1>
        <p className='text-gray-600 text-sm mb-6'>
          Discover investment opportunities across various sectors and risk
          levels
        </p>

        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
          <div className='w-full md:w-[450px]'>
            <Input
              type='text'
              placeholder='Search by name, sector, location, or tags...'
              className='w-full'
              icon={<Search size={20} className='text-gray-500' />}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className='flex items-center gap-2'>
            <Button variant='secondary' className='flex items-center gap-2'>
              <Funnel size={20} /> Filters
            </Button>
            <Button variant='secondary' className='flex items-center gap-2'>
              <ListFilter size={20} /> Sort
            </Button>
          </div>
        </div>

        <hr />

        <div className='flex items-center gap-3 mb-8 mt-8'>
          <Button
            onClick={() => setFilter('all')}
            variant='secondary'
            className='flex items-center gap-1'
          >
            All Startups
            <span className='ml-1 bg-purple-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center'>
              {startups.length}
            </span>
          </Button>
          <Button
            onClick={() => setFilter('available')}
            variant='secondary'
            className='flex items-center gap-1'
          >
            Available
            <span className='ml-1 bg-purple-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center'>
              {
                startups.filter((s) => s.status === 'active' && s.available > 0)
                  .length
              }
            </span>
          </Button>
          <Button
            onClick={() => setFilter('featured')}
            variant='secondary'
            className='flex items-center gap-1'
          >
            Featured
            <span className='ml-1 bg-purple-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center'>
              {startups.filter((s) => s.fundingProgress > 50).length}
            </span>
          </Button>
        </div>

        {/* ✅ Loading Skeleton Grid */}
        {loading && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 6 }).map((_, idx) => (
              <CardSkeleton key={idx} textRows={3} withImage />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-6 mb-6'>
            <div className='flex items-center'>
              <div className='text-red-600 mr-3'>⚠️</div>
              <div>
                <h3 className='text-red-800 font-medium'>
                  Error Loading Startups
                </h3>
                <p className='text-red-600 text-sm mt-1'>{error}</p>
                <button
                  onClick={fetchStartups}
                  className='mt-2 text-sm text-red-600 hover:text-red-800 underline'
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Startups Grid */}
        {!loading && !error && (
          <>
            {!isAuthenticated ? (
              <div className='text-center py-12'>
                <div className='text-gray-400 mb-4'>
                  <Search size={48} className='mx-auto' />
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Sign in to explore startups
                </h3>
                <p className='text-gray-600 mb-4'>
                  Please sign in to view and explore available startup
                  investment opportunities.
                </p>
                <button
                  onClick={() => (window.location.href = '/auth')}
                  className='inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-purple-700'
                >
                  Sign In
                </button>
              </div>
            ) : (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                  {filteredStartups.map((startup) => (
                    <ProductCard key={startup.id} {...startup} />
                  ))}
                </div>

                {/* No Results */}
                {filteredStartups.length === 0 && startups.length > 0 && (
                  <div className='text-center py-12'>
                    <div className='text-gray-400 mb-4'>
                      <Search size={48} className='mx-auto' />
                    </div>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>
                      No startups found
                    </h3>
                    <p className='text-gray-600'>
                      Try adjusting your search terms or filters.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilter('all');
                      }}
                      className='mt-4 text-purple-600 hover:text-purple-800 underline'
                    >
                      Clear filters
                    </button>
                  </div>
                )}

                {/* No startups available */}
                {filteredStartups.length === 0 && startups.length === 0 && (
                  <div className='text-center py-12'>
                    <div className='text-gray-400 mb-4'>
                      <Search size={48} className='mx-auto' />
                    </div>
                    <h3 className='text-lg font-medium text-gray-900 mb-2'>
                      No startups available
                    </h3>
                    <p className='text-gray-600'>
                      There are currently no startups available for investment.
                      Check back later for new opportunities.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <Pagination />
      </div>

      <div className='mb-12'>
        <WhyPlantify withoutCta />
      </div>
      <Footer />
    </div>
  );
}
