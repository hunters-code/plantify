'use client';

import {
  BadgeDollarSign,
  TrendingUp,
  Leaf,
  Users,
  BanknoteArrowUp,
  Eye,
  ThumbsUp,
  MapPin,
} from 'lucide-react';
import React, { useState } from 'react';

import Button from '@/components/ui/Button';
import InvestmentModal from '@/components/ui/InvestmentModal';

type ProductCardProps = {
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
};

export default function ProductCard({
  id,
  image,
  title,
  location,
  employees,
  category,
  risk,
  description,
  nftPrice,
  periodicReturns,
  annualROI,
  available,
  fundingProgress,
  fundedAmount,
  targetAmount,
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [investmentData, setInvestmentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dummy API
  const getInvestmentDetails = async (investmentId: string | number) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          id: investmentId,
          name: title,
          nftPrice: nftPrice || 75,
          monthlyReturns: Math.round((nftPrice || 75) * 0.16),
          expectedROI: annualROI || 192,
          availableNFTs: available || 1,
          totalNFTs: available || 1,
          soldNFTs: 0,
        });
      }, 500),
    );
  };

  const purchaseNFTs = async (investmentDetails: any) => {
    return new Promise<{ success: boolean; message?: string; error?: string }>(
      (resolve) =>
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Investment successful! 🚀',
          });
        }, 1000),
    );
  };

  const handleInvestClick = async () => {
    try {
      setIsLoading(true);
      const details = await getInvestmentDetails(id);
      setInvestmentData(details);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error getting investment details:', error);
      setInvestmentData({
        id,
        name: title,
        nftPrice: nftPrice || 75,
        monthlyReturns: Math.round((nftPrice || 75) * 0.16),
        expectedROI: annualROI || 192,
        availableNFTs: available || 1,
        totalNFTs: available || 1,
        soldNFTs: 0,
      });
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvest = async (investmentDetails: any) => {
    try {
      setIsLoading(true);
      const result = await purchaseNFTs(investmentDetails);

      if (result.success) {
        alert(result.message);
        setIsModalOpen(false);
      } else {
        alert(`Investment failed: ${result.error}`);
      }
    } catch (error: any) {
      console.error('Investment error:', error);
      alert(`Investment failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
      {/* Image */}
      <div className="relative h-60 w-full">
        <img src={image} alt={title} className="h-full w-full object-cover" />

        {/* Category & Risk badges */}
        <div className="absolute top-2 right-2 flex gap-2">
          <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-lg shadow">
            <ThumbsUp size={15} className="text-purple-600" />
          </span>
          <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-lg shadow">
            {category}
          </span>
          <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-lg shadow">
            {risk}
          </span>
        </div>

        {/* Location overlay */}
        <div className="absolute bottom-2 left-2 bg-white text-neutral-500 text-[11px] px-2 py-1 rounded-full flex items-center gap-1">
          <MapPin size={12} />
          {location} • {employees} employees
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title & Desc */}
        <h3 className="font-normal text-gray-900 text-[20px] font-ibm">
          {title}
        </h3>
        <p className="text-xs text-gray-600 mt-1 line-clamp-2 font-geist">
          {description}
        </p>

        <div className="mt-3 text-[13px] space-y-1 text-gray-700 font-geist">
          <p>
            <BadgeDollarSign className="inline mr-1 text-neutral-500" size={14} />
                        NFT Price: ${nftPrice} ckUSDC
          </p>
          <p>
            <TrendingUp className="inline mr-1 text-neutral-500" size={14} />
                        Periodic Returns: {periodicReturns}
          </p>
          <p>
            <Leaf className="inline mr-1 text-neutral-500" size={14} />
                        Annual ROI: {annualROI}%
          </p>
          <p>
            <Users className="inline mr-1 text-neutral-500" size={14} />
                        Available: {available} NFT
          </p>
        </div>

        <div className="mt-3">
          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-2 bg-orange-400 rounded-full"
              style={{ width: `${fundingProgress}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-orange-600 font-medium">
                        Funding Progress: {fundingProgress}% Funded
          </p>
        </div>

        <div className="mt-2 text-sm font-semibold">
          <span className="text-orange-600">
                        ${fundedAmount.toLocaleString()}
          </span>{' '}
          <span className="text-gray-400">
                        / ${targetAmount.toLocaleString()}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            as="a"
            href={`/explore/detail/${id || title.replace(/\s+/g, '-').toLowerCase()
            }`}
            variant="secondary"
            className="flex-1"
          >
            <Eye size={20} /> Details
          </Button>

          <Button
            onClick={handleInvestClick}
            disabled={isLoading}
            variant="primary"
            className="flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BanknoteArrowUp size={20} />
            {isLoading ? 'Loading...' : 'Invest'}
          </Button>
        </div>
      </div>

      {/* Investment Modal */}
      <InvestmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        startup={investmentData}
        onInvest={handleInvest}
        isLoading={isLoading}
      />
    </div>
  );
}
