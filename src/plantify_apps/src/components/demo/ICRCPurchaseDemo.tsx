import React, { useState } from 'react';
import { Principal } from '@dfinity/principal';
import { useAuth } from '@/contexts/AuthContext';
import { ICRCServiceHelper } from '@/services/ICRCServiceHelper';
import {
  createPurchaseSteps,
  PurchaseStep,
} from '@/components/ui/PurchaseProgress';
import PurchaseProgress from '@/components/ui/PurchaseProgress';

interface ICRCPurchaseDemoProps {
  startupId: string;
  startupName: string;
  nftPrice: number;
  quantity: number;
}

export default function ICRCPurchaseDemo({
  startupId,
  startupName,
  nftPrice,
  quantity,
}: ICRCPurchaseDemoProps) {
  const { isAuthenticated, principal, identity } = useAuth();
  const [purchaseSteps, setPurchaseSteps] = useState<PurchaseStep[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = nftPrice * quantity;

  // Initialize ICRC service and get balance
  const initializeAndGetBalance = async () => {
    if (!isAuthenticated || !principal || !identity) {
      throw new Error('User must be authenticated');
    }

    try {
      // Initialize ICRC service with user identity
      await ICRCServiceHelper.initializeWithAuth(identity);

      // Get user balance
      const userPrincipal = Principal.fromText(principal);
      const userBalance = await ICRCServiceHelper.getUserBalance(userPrincipal);
      setBalance(userBalance);

      return userBalance;
    } catch (error) {
      console.error('Failed to initialize ICRC service:', error);
      throw error;
    }
  };

  // Simulate NFT purchase with real ICRC service
  const handlePurchase = async () => {
    if (!isAuthenticated || !principal || !identity) {
      alert('Please sign in to purchase NFTs');
      return;
    }

    try {
      setIsLoading(true);
      setShowProgress(true);

      // Initialize purchase steps
      const steps = createPurchaseSteps();
      setPurchaseSteps(steps);

      // Step 1: Validate purchase
      updatePurchaseStep('validate', 'in_progress');

      // Initialize ICRC service and check balance
      const userBalance = await initializeAndGetBalance();
      const requiredAmount = BigInt(totalAmount);

      if (userBalance < requiredAmount) {
        const balanceInDollars = Number(userBalance) / 100;
        const requiredInDollars = Number(requiredAmount) / 100;
        throw new Error(
          `Insufficient balance. Required: $${requiredInDollars.toFixed(2)}, Available: $${balanceInDollars.toFixed(2)}`
        );
      }

      updatePurchaseStep('validate', 'completed');
      updatePurchaseStep('transfer', 'in_progress');

      // Step 2: Transfer tokens
      const plantifyAccount = Principal.fromText('plantify-account'); // Replace with actual Plantify account
      const transferResult = await ICRCServiceHelper.purchaseNFT(
        plantifyAccount,
        requiredAmount,
        `Purchase of ${quantity} NFTs for ${startupName}`
      );

      if (!transferResult.success) {
        throw new Error(transferResult.error || 'Transfer failed');
      }

      updatePurchaseStep('transfer', 'completed');
      updatePurchaseStep('confirm', 'in_progress');

      // Step 3: Wait for confirmation (simulate)
      await new Promise(resolve => setTimeout(resolve, 2000));

      updatePurchaseStep('confirm', 'completed');
      updatePurchaseStep('mint', 'in_progress');

      // Step 4: Complete NFT purchase with backend (simulate)
      await new Promise(resolve => setTimeout(resolve, 1000));

      updatePurchaseStep('mint', 'completed');
      updatePurchaseStep('complete', 'completed');

      // Step 5: Complete
      setTimeout(() => {
        setShowProgress(false);
        setPurchaseSteps([]);
        alert('NFT purchase completed successfully!');
      }, 1000);
    } catch (error) {
      console.error('Error processing purchase:', error);
      // Mark current step as error
      const currentStepIndex = purchaseSteps.findIndex(
        step => step.status === 'in_progress'
      );
      if (currentStepIndex >= 0) {
        updatePurchaseStep(purchaseSteps[currentStepIndex].id, 'error');
      }
      alert(
        `Purchase failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
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

  // Load balance on component mount
  React.useEffect(() => {
    if (isAuthenticated && principal && identity) {
      initializeAndGetBalance().catch(console.error);
    }
  }, [isAuthenticated, principal, identity]);

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h2 className='text-2xl font-bold mb-6'>ICRC NFT Purchase Demo</h2>

      {/* Authentication Status */}
      <div className='mb-6 p-4 bg-gray-100 rounded-lg'>
        <h3 className='text-lg font-semibold mb-2'>Authentication Status</h3>
        <div className='space-y-2'>
          <p>
            <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
          </p>
          <p>
            <strong>Principal:</strong> {principal || 'Not available'}
          </p>
          <p>
            <strong>Identity:</strong>{' '}
            {identity ? 'Available' : 'Not available'}
          </p>
          {balance !== null && (
            <p>
              <strong>Balance:</strong> ${(Number(balance) / 100).toFixed(2)}{' '}
              ckUSDC
            </p>
          )}
        </div>
      </div>

      {/* Purchase Details */}
      <div className='mb-6 p-4 bg-blue-50 rounded-lg'>
        <h3 className='text-lg font-semibold mb-2'>Purchase Details</h3>
        <div className='space-y-2'>
          <p>
            <strong>Startup:</strong> {startupName}
          </p>
          <p>
            <strong>NFT Price:</strong> ${nftPrice}
          </p>
          <p>
            <strong>Quantity:</strong> {quantity}
          </p>
          <p>
            <strong>Total Amount:</strong> ${totalAmount}
          </p>
        </div>
      </div>

      {/* Purchase Button */}
      <div className='mb-6'>
        <button
          onClick={handlePurchase}
          disabled={!isAuthenticated || isLoading}
          className={`px-6 py-3 rounded-lg font-medium ${
            !isAuthenticated
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : isLoading
                ? 'bg-blue-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {!isAuthenticated
            ? 'Sign In to Purchase'
            : isLoading
              ? 'Processing...'
              : 'Purchase NFTs'}
        </button>
      </div>

      {/* Purchase Progress */}
      {showProgress && purchaseSteps.length > 0 && (
        <div className='p-4 bg-white border rounded-lg'>
          <h3 className='text-lg font-semibold mb-4'>Purchase Progress</h3>
          <PurchaseProgress
            steps={purchaseSteps}
            currentStep={purchaseSteps.findIndex(
              step => step.status === 'in_progress'
            )}
          />
        </div>
      )}

      {/* Instructions */}
      <div className='mt-6 p-4 bg-yellow-50 rounded-lg'>
        <h3 className='text-lg font-semibold mb-2'>Instructions</h3>
        <ol className='list-decimal list-inside space-y-1 text-sm'>
          <li>Make sure you're signed in to the application</li>
          <li>Ensure you have sufficient ckUSDC balance</li>
          <li>Click "Purchase NFTs" to start the process</li>
          <li>Watch the progress steps as they complete</li>
          <li>The demo will simulate the complete purchase flow</li>
        </ol>
      </div>
    </div>
  );
}
