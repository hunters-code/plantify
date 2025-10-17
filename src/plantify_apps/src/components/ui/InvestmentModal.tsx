'use client';

import { useState, useEffect, useCallback } from 'react';

import { Principal } from '@dfinity/principal';
import {
  X,
  Minus,
  Plus,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { icrcService } from '../../services/ICRCService';
import { InvestorService } from '../../services/investors/InvestorService';
import { NFTService } from '../../services/marketplace/NFTService';
import { CancelIcon, InvestIcon } from '../icons';

import Button from './Button';
import Stepper, { StepperStep } from './Stepper';

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
  onSuccess?: (payload: InvestmentPayload) => void;
}

export default function InvestmentModal({
  isOpen,
  onClose,
  startup,
  onSuccess,
}: InvestmentModalProps) {
  const [nftQuantity, setNftQuantity] = useState(1);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [availableNFTs, setAvailableNFTs] = useState<number>(0);

  // Currency formatter
  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const [transferStatus, setTransferStatus] = useState<
    'idle' | 'checking_balance' | 'transferring' | 'success' | 'error'
  >('idle');
  const [transferError, setTransferError] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [purchaseSteps, setPurchaseSteps] = useState<StepperStep[]>([]);
  const [showPurchaseProgress, setShowPurchaseProgress] = useState(false);
  const { principal } = useAuth();

  const loadAvailableNFTs = useCallback(async () => {
    if (!startup) return;

    try {
      const availableCountResult = await NFTService.getAvailableNFTCount(
        startup.id.toString()
      );
      if (availableCountResult.success) {
        setAvailableNFTs(Number(availableCountResult.count || 0));
      } else {
        console.error(
          'Failed to load available NFTs:',
          availableCountResult.error
        );
        setAvailableNFTs(0);
      }
    } catch (error) {
      console.error('Failed to load available NFTs:', error);
      setAvailableNFTs(0);
    }
  }, [startup]);

  const loadUserBalance = useCallback(async () => {
    if (!principal) return;

    try {
      setTransferStatus('checking_balance');
      const balance = await icrcService.getBalanceInUnits(
        Principal.fromText(principal),
        'ckUSDC'
      );
      setUserBalance(balance);
      setTransferStatus('idle');
    } catch (error) {
      console.error('Failed to load user balance:', error);
      setTransferError('Failed to load balance');
      setTransferStatus('error');
    }
  }, [principal]);

  // Load user balance and available NFTs when modal opens
  useEffect(() => {
    if (isOpen && principal) {
      loadUserBalance();
      loadAvailableNFTs();
    }
  }, [isOpen, principal, loadAvailableNFTs, loadUserBalance]);

  if (!isOpen || !startup) return null;

  const handleQuantityChange = (change: number) => {
    const newQuantity = nftQuantity + change;
    if (newQuantity >= 1 && newQuantity <= availableNFTs) {
      setNftQuantity(newQuantity);
    }
  };

  const handleInvest = async () => {
    if (!principal) {
      setTransferError('User not authenticated');
      setTransferStatus('error');
      return;
    }

    const totalAmount = nftQuantity * startup.nftPrice;
    // Get decimal places from token config
    const decimals = 8; // Default to 8 if config not found
    const decimalMultiplier = Math.pow(10, decimals);
    const totalAmountBigInt = BigInt(
      Math.floor(totalAmount * decimalMultiplier)
    );

    // Check if user has sufficient balance
    if (userBalance < totalAmount) {
      setTransferError('Insufficient balance');
      setTransferStatus('error');
      return;
    }

    // Check if requested quantity is available
    if (availableNFTs < nftQuantity) {
      setTransferError(`Only ${availableNFTs} NFTs are available for purchase`);
      setTransferStatus('error');
      return;
    }

    // Validate available NFT count before proceeding (double-check with server)
    try {
      const availableCountResult = await NFTService.getAvailableNFTCount(
        startup.id.toString()
      );
      if (!availableCountResult.success) {
        setTransferError(
          availableCountResult.error || 'Failed to check available NFTs'
        );
        setTransferStatus('error');
        return;
      }

      const availableCount = Number(availableCountResult.count || 0);
      if (availableCount < nftQuantity) {
        setTransferError(
          `Only ${availableCount} NFTs are available for purchase`
        );
        setTransferStatus('error');
        return;
      }
    } catch (error) {
      console.error('Error checking available NFT count:', error);
      setTransferError('Failed to validate available NFTs');
      setTransferStatus('error');
      return;
    }

    try {
      // Initialize purchase steps
      const steps: StepperStep[] = [
        {
          id: 'validate',
          title: 'Validate Purchase',
          description: 'Checking investor credentials and NFT availability',
          status: 'pending',
        },
        {
          id: 'transfer',
          title: 'Transfer Funds',
          description: 'Processing ckUSDC transfer to Plantify',
          status: 'pending',
        },
        {
          id: 'confirm',
          title: 'Confirm Transaction',
          description: 'Validating transaction and preparing NFT',
          status: 'pending',
        },
        {
          id: 'mint',
          title: 'Mint NFT',
          description: 'Creating your NFT tokens',
          status: 'pending',
        },
        {
          id: 'complete',
          title: 'Complete',
          description: 'Investment completed successfully',
          status: 'pending',
        },
      ];
      setPurchaseSteps(steps);
      setShowPurchaseProgress(true);

      // Step 1: Validate purchase
      updatePurchaseStep('validate', 'in_progress');

      // Get current investor information
      const investor = await InvestorService.getInvestorByPrincipal();
      if (!investor) {
        throw new Error(
          'Investor not found. Please register as an investor first.'
        );
      }

      updatePurchaseStep('validate', 'completed');
      updatePurchaseStep('transfer', 'in_progress');

      // Step 2: Transfer ckUSDC using ICRC service
      const plantifyAccount = Principal.fromText(
        'qzvg3-e2uko-chkzo-bpegv-vf6ev-hvbjc-bky6t-2t3ye-lf5lk-gw5rm-fqe'
      );
      const userAccount = Principal.fromText(principal);

      const transferResult = await icrcService.completeNFTPurchase(
        userAccount,
        plantifyAccount,
        totalAmountBigInt,
        `Purchase of ${nftQuantity} NFTs for ${startup.name}`,
        'ckUSDC'
      );

      if (!transferResult.success) {
        throw new Error(transferResult.error || 'Transfer failed');
      }

      updatePurchaseStep('transfer', 'completed');
      updatePurchaseStep('confirm', 'in_progress');

      // Step 3: Validate Transaction and Send NFT using backend
      const purchaseRequest = {
        startupId: startup.id.toString(),
        investorId: investor.id,
        quantity: BigInt(nftQuantity),
        memo: [`Purchase of ${nftQuantity} NFTs for ${startup.name}`] as
          | []
          | [string],
      };

      const result = await InvestorService.completeNFTPurchase(
        purchaseRequest,
        transferResult.blockIndex || BigInt(0)
      );

      if (!result.success) {
        throw new Error(result.error || 'NFT purchase failed');
      }

      updatePurchaseStep('confirm', 'completed');
      updatePurchaseStep('mint', 'completed');
      updatePurchaseStep('complete', 'completed');

      setTransferStatus('success');
      setTransactionId(
        result.data && 'Success' in result.data
          ? result.data.Success.transactionId
          : ''
      );

      // Call success callback
      if (onSuccess) {
        onSuccess({
          startupId: startup.id,
          quantity: nftQuantity,
          totalAmount,
        });
      }

      await loadUserBalance();
    } catch (error) {
      setTransferError(
        error instanceof Error ? error.message : 'Investment failed'
      );
      setTransferStatus('error');

      // Mark current step as error
      const currentStepIndex = purchaseSteps.findIndex(
        step => step.status === 'in_progress'
      );
      if (currentStepIndex >= 0) {
        updatePurchaseStep(purchaseSteps[currentStepIndex].id, 'error');
      }
    }
  };

  // Helper function to update purchase steps
  const updatePurchaseStep = (
    stepId: string,
    status: 'pending' | 'in_progress' | 'completed' | 'error'
  ) => {
    setPurchaseSteps(prev =>
      prev.map(step => (step.id === stepId ? { ...step, status } : step))
    );
  };

  const totalAmount = nftQuantity * startup.nftPrice;
  const monthlyReturns = nftQuantity * startup.monthlyReturns;
  const expectedROI = startup.expectedROI;

  // Check if user has sufficient balance and NFTs are available
  const hasSufficientBalance = userBalance >= totalAmount;
  const hasAvailableNFTs = availableNFTs >= nftQuantity;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 transition-opacity'
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-3xl border border-gray-200 shadow-xl w-full mx-4 overflow-hidden ${
          showPurchaseProgress ? 'max-w-6xl' : 'max-w-md'
        }`}
      >
        {/* Close Button */}
        <Button
          onClick={() => {
            onClose();
            setShowPurchaseProgress(false);
            setPurchaseSteps([]);
          }}
          className='absolute top-4 right-4 z-10 p-2 rounded-full'
          variant='secondary'
        >
          <X className='w-5 h-5 text-gray-500' />
        </Button>

        <div className='flex h-full'>
          {/* Left Section - Investment Form */}
          <div
            className={`${showPurchaseProgress ? 'w-1/2' : 'w-full'} p-6 border-r border-gray-200`}
          >
            <div className='flex flex-col gap-4 h-full'>
              {/* Header Section */}
              <div className='flex flex-col gap-1'>
                <p className='text-base text-gray-500'>Invest at</p>
                <h2 className='text-3xl font-serif text-gray-900 leading-tight'>
                  {startup.name}
                </h2>
              </div>

              {/* Divider */}
              <div>
                <hr className='border-gray-200' />
              </div>

              {/* Quantity Selector */}
              <div className='bg-gray-100 border border-gray-200 rounded-2xl p-2'>
                <div className='flex items-center justify-between gap-2 w-full'>
                  {/* Decrease Button */}
                  <Button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={nftQuantity <= 1}
                    className='w-12 h-12 rounded-xl'
                    variant='secondary'
                  >
                    <Minus className='w-5 h-5 text-gray-400' />
                  </Button>

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
                  <Button
                    onClick={() => handleQuantityChange(1)}
                    disabled={nftQuantity >= availableNFTs}
                    className='w-12 h-12 rounded-xl'
                    variant='primary'
                  >
                    <Plus className='w-5 h-5' />
                  </Button>
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
                    <span className='text-sm text-gray-900'>
                      Monthly Returns
                    </span>
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

              {/* Error Display */}
              {transferStatus === 'error' && transferError && (
                <div className='bg-red-50 border border-red-200 rounded-2xl p-3'>
                  <div className='flex items-center gap-2 text-red-800'>
                    <AlertCircle className='w-4 h-4' />
                    <span className='text-sm font-medium'>Transfer Error</span>
                  </div>
                  <p className='text-sm text-red-700 mt-1'>{transferError}</p>
                </div>
              )}

              {/* Success Display */}
              {transferStatus === 'success' && (
                <div className='bg-green-50 border border-green-200 rounded-2xl p-3'>
                  <div className='flex items-center gap-2 text-green-800'>
                    <CheckCircle className='w-4 h-4' />
                    <span className='text-sm font-medium'>
                      Transfer Successful
                    </span>
                  </div>
                  {transactionId && (
                    <p className='text-sm text-green-700 mt-1'>
                      Transaction ID: {transactionId}
                    </p>
                  )}
                </div>
              )}

              {/* Action Section */}
              <div className='bg-gray-100 border border-gray-200 rounded-2xl p-2'>
                {/* Total Row */}
                <div className='flex justify-between items-center px-2 pt-2'>
                  <span className='text-sm text-gray-900'>Total</span>
                  <span className='text-sm font-medium text-purple-500'>
                    ${totalAmount} ckUSDC
                  </span>
                </div>
                {/* Balance Row */}
                <div className='flex justify-between items-center px-2 pt-2'>
                  <span className='text-sm text-gray-900'>Your Balance</span>
                  <span className='text-sm font-medium text-gray-900'>
                    {transferStatus === 'checking_balance'
                      ? 'Loading...'
                      : usdFormatter.format(userBalance)}{' '}
                    ckUSDC
                  </span>
                </div>
                <div className='flex justify-between items-center px-2 pt-2'>
                  <span className='text-sm text-gray-900'>Balance Status</span>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      hasSufficientBalance ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transferStatus === 'checking_balance' ? (
                      <>
                        <div className='w-3 h-3 border border-current border-t-transparent rounded-full animate-spin'></div>
                        <span>Checking...</span>
                      </>
                    ) : hasSufficientBalance ? (
                      <>
                        <CheckCircle2 className='w-3 h-3' />
                        <span>Sufficient</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className='w-3 h-3' />
                        <span>Insufficient</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className='px-2 py-3'>
                  <hr className='border-gray-300' />
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col gap-2'>
                  {/* Invest Button */}
                  <Button
                    onClick={handleInvest}
                    disabled={
                      transferStatus === 'transferring' ||
                      transferStatus === 'checking_balance' ||
                      !hasSufficientBalance ||
                      !hasAvailableNFTs ||
                      transferStatus === 'success'
                    }
                    className='w-full'
                    variant='primary'
                  >
                    {transferStatus === 'checking_balance' ? (
                      <>
                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        <span className='text-base font-medium'>
                          Checking Balance...
                        </span>
                      </>
                    ) : transferStatus === 'transferring' ? (
                      <>
                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                        <span className='text-base font-medium'>
                          Processing Transfer...
                        </span>
                      </>
                    ) : transferStatus === 'success' ? (
                      <>
                        <CheckCircle size={20} />
                        <span className='text-base font-medium'>
                          Investment Complete
                        </span>
                      </>
                    ) : !hasSufficientBalance ? (
                      <>
                        <AlertCircle size={20} />
                        <span className='text-base font-medium'>
                          Insufficient Balance
                        </span>
                      </>
                    ) : !hasAvailableNFTs ? (
                      <>
                        <AlertCircle size={20} />
                        <span className='text-base font-medium'>
                          NFTs Not Available
                        </span>
                      </>
                    ) : (
                      <>
                        <InvestIcon />
                        <span className='text-base font-medium'>
                          Invest Now
                        </span>
                      </>
                    )}
                  </Button>

                  {/* Cancel Button */}
                  <Button
                    onClick={onClose}
                    className='w-full'
                    variant='secondary'
                  >
                    <CancelIcon />
                    <span className='text-base font-medium'>Cancel</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Stepper */}
          {showPurchaseProgress && purchaseSteps.length > 0 && (
            <div className='w-1/2 p-6 bg-gray-50'>
              <Stepper
                steps={purchaseSteps}
                currentStep={purchaseSteps.findIndex(
                  step => step.status === 'in_progress'
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
