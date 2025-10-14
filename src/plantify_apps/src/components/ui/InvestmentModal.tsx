'use client';

import { X, Minus, Plus, Banknote } from 'lucide-react';
import React, { useState } from 'react';

interface Startup {
  id: string | number;
  name: string;
  availableNFTs: number;
  nftPrice: number;
  monthlyReturns: number;
  expectedROI: number;
}

interface InvestmentPayload {
  startupId: string | number;
  quantity: number;
  totalAmount: number;
}

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  startup?: Startup;
  onInvest: (payload: InvestmentPayload) => void;
  isLoading?: boolean;
}

export default function InvestmentModal({
  isOpen,
  onClose,
  startup,
  onInvest,
  isLoading = false,
}: InvestmentModalProps) {
  const [nftQuantity, setNftQuantity] = useState(1);

  if (!isOpen || !startup) return null;

  const handleQuantityChange = (change: number) => {
    const newQuantity = nftQuantity + change;
    if (newQuantity >= 1 && newQuantity <= startup.availableNFTs) {
      setNftQuantity(newQuantity);
    }
  };

  const handleInvest = () => {
    onInvest({
      startupId: startup.id,
      quantity: nftQuantity,
      totalAmount: nftQuantity * startup.nftPrice,
    });
  };

  const totalAmount = nftQuantity * startup.nftPrice;
  const monthlyReturns = nftQuantity * startup.monthlyReturns;
  const expectedROI = startup.expectedROI;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 transition-opacity'
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className='relative bg-white rounded-3xl border border-gray-200 shadow-xl w-full max-w-md mx-4 overflow-hidden'>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors'
        >
          <X className='w-5 h-5 text-gray-500' />
        </button>

        <div className='flex flex-col gap-2 p-2'>
          {/* Header Section */}
          <div className='flex flex-col gap-1 px-2 pt-2'>
            <p className='text-base text-gray-500'>Invest at</p>
            <h2 className='text-3xl font-serif text-gray-900 leading-tight'>
              {startup.name}
            </h2>
          </div>

          {/* Divider */}
          <div className='px-2'>
            <hr className='border-gray-200' />
          </div>

          {/* Quantity Selector */}
          <div className='bg-gray-100 border border-gray-200 rounded-2xl p-2 mx-0'>
            <div className='flex items-center justify-between gap-2 w-full'>
              {/* Decrease Button */}
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={nftQuantity <= 1}
                className='w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors'
              >
                <Minus className='w-5 h-5 text-gray-400' />
              </button>

              {/* Quantity Display */}
              <div className='flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm'>
                <div className='flex items-center justify-center gap-2'>
                  <span className='text-base font-semibold text-gray-900'>
                    {nftQuantity}
                  </span>
                  <span className='text-base text-gray-500'>NFTs</span>
                </div>
              </div>

              {/* Increase Button */}
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={nftQuantity >= startup.availableNFTs}
                className='w-12 h-12 bg-purple-500 border border-purple-400 rounded-xl flex items-center justify-center text-white hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
              >
                <Plus className='w-5 h-5' />
              </button>
            </div>
          </div>

          {/* Price Information */}
          <div className='bg-gray-100 border border-gray-200 rounded-2xl p-3'>
            <div className='space-y-1.5'>
              {/* NFTs Row */}
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-900'>NFTs</span>
                <span className='text-sm font-medium text-gray-900'>
                  {nftQuantity}
                </span>
              </div>

              {/* NFT Price Row */}
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-900'>NFT Price</span>
                <span className='text-sm font-medium text-gray-900'>
                  ${startup.nftPrice} ckUSDC
                </span>
              </div>

              {/* Monthly Returns Row */}
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-900'>Monthly Returns</span>
                <span className='text-sm font-medium text-gray-900'>
                  ${monthlyReturns}
                </span>
              </div>

              {/* Expected ROI Row */}
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-900'>Expected ROI</span>
                <span className='text-sm font-medium text-gray-900'>
                  {expectedROI}%
                </span>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className='bg-gray-100 border border-gray-200 rounded-2xl p-2'>
            {/* Total Row */}
            <div className='flex justify-between items-center px-2 pt-2'>
              <span className='text-sm text-gray-900'>Total</span>
              <span className='text-sm font-medium text-purple-500'>
                ${totalAmount} ckUSDC
              </span>
            </div>

            {/* Divider */}
            <div className='px-2 py-3'>
              <hr className='border-gray-300' />
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col gap-2'>
              {/* Invest Button */}
              <button
                onClick={handleInvest}
                disabled={isLoading}
                className='w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-1.5 border border-white/20 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.16),inset_0px_-2px_1px_0px_rgba(0,0,0,0.25),inset_0px_3px_3px_0px_rgba(255,255,255,0.4)]'
                style={{
                  background: isLoading
                    ? '#6B46C1'
                    : 'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%), #7A5AF8',
                }}
              >
                {isLoading ? (
                  <>
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    <span className='text-base font-medium'>Processing...</span>
                  </>
                ) : (
                  <>
                    <Banknote size={20} />
                    <span className='text-base font-medium'>Invest Now</span>
                  </>
                )}
              </button>

              {/* Cancel Button */}
              <button
                onClick={onClose}
                className='w-full bg-gray-100 hover:bg-gray-200 border text-gray-900 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-1.5 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.16),inset_0px_-2px_1px_0px_rgba(0,0,0,0.25),inset_0px_3px_3px_0px_rgba(255,255,255,0.4)]'
                style={{
                  background:
                    'linear-gradient(180deg, rgba(229, 229, 229, 1) 0%, rgba(255, 255, 255, 1) 100%), #F5F5F5',
                }}
              >
                <X size={20} />
                <span className='text-base font-medium'>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
