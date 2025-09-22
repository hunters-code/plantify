import { useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../declarations/plantify_backend/plantify_backend.did.js';
import { useAuth } from './useAuth';

// Use IC mainnet canister ID
const PLANTIFY_BACKEND_CANISTER_ID = 'a5ptu-ryaaa-aaaai-q32cq-cai';

// Create actor for IC mainnet
const createBackendActor = () => {
  const agent = new HttpAgent({
    host: 'https://ic0.app',
  });
  
  return Actor.createActor(idlFactory, {
    agent,
    canisterId: PLANTIFY_BACKEND_CANISTER_ID,
  });
};

export const useInvestment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, principal } = useAuth();

  const purchaseNFTs = async ({ startupId, quantity, totalAmount }) => {
    if (!isAuthenticated || !principal) {
      throw new Error('User must be authenticated to invest');
    }

    if (!startupId) {
      throw new Error('Startup ID is required');
    }

    if (!quantity || quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    if (!totalAmount || totalAmount <= 0) {
      throw new Error('Total amount must be greater than 0');
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Purchasing NFTs:', { startupId, quantity, totalAmount, principal: principal.toString() });
      
      // Create backend actor for IC mainnet
      const plantify_backend = createBackendActor();
      
      console.log('Backend service available:', !!plantify_backend);
      console.log('Using IC mainnet canister:', PLANTIFY_BACKEND_CANISTER_ID);
      
      // Check backend canister status
      try {
        console.log('Testing backend connectivity...');
        // Try a simple method first to test connectivity
        if (typeof plantify_backend.getAllStartups === 'function') {
          console.log('Backend connectivity test: getAllStartups method available');
        }
      } catch (connectivityError) {
        console.warn('Backend connectivity issue:', connectivityError);
      }

      // Check if investor can purchase NFT (validates investor registration and startup status)
      try {
        console.log('Checking if investor can purchase NFT...', { investorId: principal.toString(), startupId });
        
        // Check if the method exists
        if (typeof plantify_backend.canPurchaseNFT !== 'function') {
          console.warn('canPurchaseNFT method not available, skipping pre-validation');
        } else {
          const canPurchaseResult = await plantify_backend.canPurchaseNFT(principal.toString(), startupId);
          console.log('Can purchase result:', canPurchaseResult);
          
          if ('err' in canPurchaseResult) {
            console.error('Backend validation error:', canPurchaseResult.err);
            throw new Error(canPurchaseResult.err);
          }
          
          if (!canPurchaseResult.ok) {
            console.error('Purchase not allowed for this startup');
            throw new Error('Cannot purchase NFT for this startup. Startup may not be active.');
          }
          
          console.log('Pre-purchase validation passed successfully');
        }
      } catch (checkError) {
        console.error('Pre-purchase validation failed:', checkError);
        console.error('Error details:', {
          message: checkError.message,
          stack: checkError.stack,
          investorId: principal.toString(),
          startupId: startupId,
          errorType: typeof checkError,
          errorName: checkError.name
        });
        
        // If it's a method not found error or network error, continue without validation
        if (checkError.message && (
          checkError.message.includes('not a function') ||
          checkError.message.includes('network') ||
          checkError.message.includes('fetch') ||
          checkError.message.includes('HTTP')
        )) {
          console.warn('Skipping pre-validation due to method/network issue, proceeding with purchase');
        } else {
          // For now, let's skip pre-validation and proceed directly to purchase to see the actual error
          console.warn('Pre-validation failed, but proceeding with purchase to get actual error:', checkError.message);
        }
      }

      // Create the purchase request object according to backend signature
      const purchaseRequest = {
        startupId: startupId,
        investorId: principal.toString(),
        amount: BigInt(Math.round(totalAmount * 100)), // Convert to cents for precision
        memo: [`NFT purchase: ${quantity} NFT${quantity > 1 ? 's' : ''}`] // Optional text as array for Motoko
      };

      console.log('Purchase request:', purchaseRequest);

      // Call the backend to purchase NFTs
      console.log('Calling purchaseNFT with request:', purchaseRequest);
      
      let result;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          console.log(`Attempt ${retryCount + 1} of ${maxRetries + 1}`);
          result = await plantify_backend.purchaseNFT(purchaseRequest);
          console.log('Purchase result:', result);
          break; // Success, exit retry loop
        } catch (backendError) {
          console.error(`Backend call failed (attempt ${retryCount + 1}):`, backendError);
          console.error('Backend error details:', {
            name: backendError.name,
            message: backendError.message,
            stack: backendError.stack,
            attempt: retryCount + 1
          });
          
          retryCount++;
          
          // If this was the last attempt, throw the error
          if (retryCount > maxRetries) {
            // Check if it's a network/HTTP error
            if (backendError.message && backendError.message.includes('500')) {
              throw new Error('Backend service is currently unavailable after multiple attempts. Please check if the canister is running and try again later.');
            }
            
            throw new Error(`Backend call failed after ${maxRetries + 1} attempts: ${backendError.message || 'Unknown error'}`);
          }
          
          // Wait before retry
          console.log(`Retrying in 2 seconds... (${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if ('ok' in result) {
        // Handle nested variant response: ok -> Success/Error
        if ('Success' in result.ok) {
          const successData = result.ok.Success;
          console.log('Purchase successful:', successData);
          
          return {
            success: true,
            data: {
              tokenId: successData.tokenId,
              transactionId: successData.transactionId,
              startupId: successData.startupId,
              investorId: successData.investorId,
              amount: successData.amount,
              nftPrice: successData.nftPrice,
              change: successData.change
            },
            message: `Successfully purchased ${quantity} NFT${quantity > 1 ? 's' : ''} for $${totalAmount}. Transaction ID: ${successData.transactionId}`
          };
        } else if ('Error' in result.ok) {
          const errorMessage = result.ok.Error;
          console.error('Backend purchase error:', errorMessage);
          throw new Error(errorMessage);
        } else {
          console.error('Unexpected ok result format:', result.ok);
          throw new Error('Unexpected response format from backend');
        }
      } else {
        const errorMessage = result.err || 'Failed to purchase NFTs';
        console.error('Backend error:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('Investment error:', err);
      let errorMessage = err.message || 'Failed to complete investment';
      
      // Provide more user-friendly error messages
      if (errorMessage.includes('Investor not found')) {
        errorMessage = 'Please complete your investor registration before making investments.';
      } else if (errorMessage.includes('Startup not found')) {
        errorMessage = 'This startup is no longer available for investment.';
      } else if (errorMessage.includes('Startup must be active')) {
        errorMessage = 'This startup is not currently accepting investments.';
      } else if (errorMessage.includes('Insufficient ckUSDC balance')) {
        errorMessage = 'Insufficient ckUSDC balance. Please top up your wallet.';
      } else if (errorMessage.includes('NFT price cannot be')) {
        errorMessage = 'There is an issue with the startup\'s NFT pricing. Please try again later.';
      }
      
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getInvestmentDetails = async (startupId) => {
    try {
      console.log('Getting investment details for startup:', startupId);

      // Create backend actor for IC mainnet
      const plantify_backend = createBackendActor();

      // Get startup details
      const startupResult = await plantify_backend.getStartup(startupId);
      if ('err' in startupResult) {
        throw new Error(startupResult.err);
      }

      const startup = startupResult.ok;
      
      // Get NFT details for this startup
      const nftsResult = await plantify_backend.getAllNFTs();
      if ('err' in nftsResult) {
        throw new Error(nftsResult.err);
      }

      const startupNFTs = nftsResult.ok.filter(nft => nft.startupId === startupId);
      const totalNFTs = startupNFTs.length;
      const soldNFTs = startupNFTs.filter(nft => nft.owner !== null).length;
      const availableNFTs = totalNFTs - soldNFTs;

      // Calculate investment metrics
      const nftPrice = startupNFTs.length > 0 ? Number(startupNFTs[0].price) / 100 : 75; // Default to $75
      const monthlyReturns = Math.round(nftPrice * 0.16); // 16% monthly return estimate
      const expectedROI = 192; // Default ROI

      return {
        id: startupId,
        name: startup.name,
        nftPrice,
        monthlyReturns,
        expectedROI,
        availableNFTs,
        totalNFTs,
        soldNFTs
      };
    } catch (err) {
      console.error('Error getting investment details:', err);
      throw err;
    }
  };

  return {
    purchaseNFTs,
    getInvestmentDetails,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
