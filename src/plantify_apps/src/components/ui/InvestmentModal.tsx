'use client';

import React, { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import Button from './Button';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gray-50 px-8 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="pr-12">
            <p className="text-sm text-gray-500 mb-1">Invest at</p>
            <h2 className="text-2xl font-bold text-gray-900">{startup.name}</h2>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-6">
          {/* NFT Quantity Selector */}
          <div className="mb-8">
            <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={nftQuantity <= 1}
                className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-5 h-5 text-gray-600" />
              </button>

              <div className="text-center">
                <span className="text-2xl font-bold text-gray-900">{nftQuantity}</span>
                <span className="text-lg text-gray-600 ml-2">NFTs</span>
              </div>

              <button
                onClick={() => handleQuantityChange(1)}
                disabled={nftQuantity >= startup.availableNFTs}
                className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Investment Details */}
          <div className="space-y-6 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-lg">NFTs</span>
              <span className="font-bold text-gray-900 text-xl">{nftQuantity}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-lg">NFT Price</span>
              <span className="font-bold text-gray-900 text-xl">${startup.nftPrice} ckUSDC</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-lg">Monthly Returns</span>
              <span className="font-bold text-gray-900 text-xl">${monthlyReturns}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-lg">Expected ROI</span>
              <span className="font-bold text-gray-900 text-xl">{expectedROI}%</span>
            </div>
          </div>

          {/* Total Section */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-purple-600">${totalAmount} ckUSDC</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleInvest}
              disabled={isLoading}
              variant="primary"
              className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <span className="text-xl">💰</span>
                  Invest Now
                </>
              )}
            </Button>

            <Button
              onClick={onClose}
              variant="secondary"
              className="w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 border-2"
            >
              <span className="text-xl">🚫</span>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
