'use client';

import { Funnel, ListFilter, Search } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import {
  Navbar,
  ProductCard,
  Pagination,
  WhyPlantify,
  Footer,
} from '@/components';
import { Button, CardSkeleton, Input } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import type { Startup as BackendStartup } from '@/declarations/plantify_backend/plantify_backend.did';
import { StartupService } from '@/services/marketplace';
import { getRiskLevel } from '@/utils/riskLevels';

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
  const { isAuthenticated } = useAuth();

  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  // Function to map backend startup data to ProductCard props
  const mapStartupData = useCallback((startup: BackendStartup): Startup => {
    // Calculate some derived values
    const fundingGoal = parseFloat(startup.fundingGoal) || 50000;
    const nftPrice = parseFloat(startup.nftPrice) || 100;
    const totalNFTs = Math.floor(fundingGoal / nftPrice);
    const fundedAmount = Math.floor(fundingGoal * 0.6); // Mock funded amount (60%)
    const fundingProgress = Math.floor((fundedAmount / fundingGoal) * 100);
    const available = Math.floor(totalNFTs * 0.4); // Mock available NFTs (40%)

    // Calculate periodic returns and ROI
    const monthlyProfitSharing = parseFloat(startup.periodicProfitSharing) || 5;
    const annualReturns = monthlyProfitSharing * 12;
    const annualROI = ((annualReturns / nftPrice) * 100).toFixed(1);

    return {
      id: startup.id,
      image: startup.companyLogo?.[0] || '/assets/images/product.png',
      title: startup.startupName,
      location: startup.location,
      employees: startup.teamMembers?.length || 5,
      category: startup.sector,
      risk: getRiskLevel(startup.sector),
      description: startup.description,
      nftPrice,
      periodicReturns: `$${monthlyProfitSharing}`,
      annualROI: parseFloat(annualROI),
      available,
      fundingProgress,
      fundedAmount,
      targetAmount: fundingGoal,
      status: startup.status,
    };
  }, []);

  // Fetch startups from backend
  const fetchStartups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the StartupService to fetch all startups - no authentication required
      const result = await StartupService.getAllStartups();

      // Map the backend data to the UI format
      const mappedStartups = result.map(mapStartupData);
      setStartups(mappedStartups);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching startups:', err);
      setError('Failed to load startups. Please try again.');
      setLoading(false);
    }
  }, [mapStartupData]);

  // Filter startups
  const filteredStartups = startups.filter(startup => {
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

  // Load startups on component mount
  useEffect(() => {
    fetchStartups();
  }, [fetchStartups]);

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
              onChange={e => setSearchTerm(e.target.value)}
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
                startups.filter(s => s.status === 'active' && s.available > 0)
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
              {startups.filter(s => s.fundingProgress > 50).length}
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
                  {filteredStartups.map(startup => (
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
                      Try adjusting your search terms or filters to find what
                      you&apos;re looking for.
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
