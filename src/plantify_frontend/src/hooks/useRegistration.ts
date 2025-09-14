import { useState, useCallback } from 'react';
import { useRegistrationService, BackendResponse } from '../services/registrationService';
import type { 
  Founder, 
  Investor, 
  FounderRegistrationRequest, 
  InvestorRegistrationRequest 
} from '../declarations/plantify_backend/plantify_backend.did';

interface UseRegistrationReturn {
  // State
  loading: boolean;
  error: string | null;
  success: boolean;
  isAvailable: boolean;
  isAuthenticated: boolean;
  isBackendDeclarationsAvailable: () => boolean;
  
  // Actions
  registerFounder: (formData: FounderRegistrationRequest) => Promise<BackendResponse<Founder>>;
  registerInvestor: (formData: InvestorRegistrationRequest) => Promise<BackendResponse<Investor>>;
  getAllFounders: () => Promise<BackendResponse<Founder[]>>;
  clearStates: () => void;
}

export function useRegistration(): UseRegistrationReturn {
  const { service, isAvailable, initializeBackendActor, isAuthenticated, isBackendDeclarationsAvailable, loadDeclarations } = useRegistrationService();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Register founder
  const registerFounder = useCallback(async (formData: FounderRegistrationRequest): Promise<BackendResponse<Founder>> => {
    if (!isAuthenticated) {
      setError('Please authenticate first before registering.');
      return { success: false, error: 'Authentication required' };
    }

    if (!isBackendDeclarationsAvailable()) {
      await loadDeclarations();
      if (!isBackendDeclarationsAvailable()) {
        setError('Backend declarations not found. Please run "dfx generate plantify_backend" first.');
        return { success: false, error: 'Backend declarations not available' };
      }
    }

    if (!service) {
      setError('Backend service not available. Please try again later.');
      return { success: false, error: 'Backend service not available' };
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Validate data
      const validationErrors = service.validateFounderData(formData);
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.join('; ');
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      // Register founder
      const result = await service.registerFounder(formData);
      
      if (result.success) {
        setSuccess(true);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Unknown error');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [service, isAuthenticated, isBackendDeclarationsAvailable, loadDeclarations]);

  // Register investor
  const registerInvestor = useCallback(async (formData: InvestorRegistrationRequest): Promise<BackendResponse<Investor>> => {
    if (!service) {
      return { success: false, error: 'Backend service not available' };
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Validate data
      const validationErrors = service.validateInvestorData(formData);
      if (validationErrors.length > 0) {
        const errorMessage = validationErrors.join('; ');
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      // Register investor
      const result = await service.registerInvestor(formData);
      
      if (result.success) {
        setSuccess(true);
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Unknown error');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [service]);

  // Get all founders
  const getAllFounders = useCallback(async (): Promise<BackendResponse<Founder[]>> => {
    if (!service) {
      return { success: false, error: 'Backend service not available' };
    }

    try {
      setLoading(true);
      setError(null);

      const result = await service.getAllFounders();
      
      if (result.success) {
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Unknown error');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to fetch founders';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [service]);

  // Clear error and success states
  const clearStates = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  // Initialize backend actor
  const initializeBackend = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await initializeBackendActor();
      if (!success) {
        setError('Failed to initialize backend connection');
      }
      return success;
    } catch (err) {
      setError('Failed to initialize backend connection');
      return false;
    } finally {
      setLoading(false);
    }
  }, [initializeBackendActor]);

  return {
    // State
    loading,
    error,
    success,
    isAvailable,
    isAuthenticated,
    isBackendDeclarationsAvailable,
    
    // Actions
    registerFounder,
    registerInvestor,
    getAllFounders,
    clearStates,
  };
}
