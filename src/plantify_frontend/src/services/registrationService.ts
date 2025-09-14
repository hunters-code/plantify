// import { useAuth } from '../hooks/useAuth';

// Types for registration data
export interface FounderRegistrationData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  previousBusinesses: string;
  expertise: string;
  linkedIn: string;
  idNumber: string;
  taxNumber: string;
}

export interface InvestorRegistrationData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  investmentExperience: string;
  riskTolerance: string;
  investmentGoals: string;
  availableCapital: string;
  monthlyBudget: string;
}

// Import generated types from backend declarations
import type {
  _SERVICE,
  Founder,
  Investor,
  FounderRegistrationRequest,
  InvestorRegistrationRequest,
  Result_2,
  Result_3,
} from '../declarations/plantify_backend/plantify_backend.did';
import { useAuth } from '../hooks/useAuth';

// Types for backend responses
export interface BackendResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Use the generated service interface as the backend actor type
type BackendActor = _SERVICE;

export class RegistrationService {
  private actor: BackendActor | null;
  private initializeBackendActor: () => Promise<boolean>;
  private getActor: () => BackendActor | null;

  constructor(
    actor: BackendActor | null,
    initializeBackendActor: () => Promise<boolean>,
    getActor: () => BackendActor | null
  ) {
    this.actor = actor;
    this.initializeBackendActor = initializeBackendActor;
    this.getActor = getActor;
  }

  // Register a founder
  async registerFounder(
    registrationData: FounderRegistrationRequest
  ): Promise<BackendResponse<Founder>> {
    try {
      if (!this.actor && this.initializeBackendActor && this.getActor) {
        // Try to initialize the backend actor
        const initialized = await this.initializeBackendActor();
        if (!initialized) {
          throw new Error(
            'Backend actor not available. Please ensure you are authenticated and backend is running.'
          );
        }
        // Get the newly initialized actor
        this.actor = this.getActor();
      }

      if (!this.actor) {
        throw new Error(
          'Backend actor is still not available after initialization attempt'
        );
      }

      const founderRequest = {
        fullName: registrationData.fullName || '',
        email: registrationData.email || '',
        phone: registrationData.phone || '',
        address: registrationData.address || '',
        experience: registrationData.experience || '',
        previousBusinesses: registrationData.previousBusinesses || '',
        expertise: registrationData.expertise || '',
        linkedIn: registrationData.linkedIn || '',
        idNumber: registrationData.idNumber || '',
        taxNumber: registrationData.taxNumber || '',
      };

      const result: Result_3 = await this.actor.registerFounder(founderRequest);

      // Handle the response using the generated Result type
      if ('ok' in result && result.ok) {
        return { success: true, data: result.ok };
      } else if ('err' in result && result.err) {
        return { success: false, error: result.err };
      } else {
        return {
          success: false,
          error: 'Unexpected response format from backend',
        };
      }
    } catch (error) {
      // Handle specific IC errors
      const errorMessage = (error as Error).message || '';
      if (
        errorMessage.includes('Canister') &&
        errorMessage.includes('does not belong to any subnet')
      ) {
        return {
          success: false,
          error:
            'Cannot connect to the backend canister. Please ensure you are using the correct canister ID.',
        };
      } else if (errorMessage.includes('Invalid principal')) {
        return {
          success: false,
          error:
            'Authentication error. Please sign in again and try once more.',
        };
      } else if (errorMessage.includes('timeout')) {
        return {
          success: false,
          error:
            'Connection to Internet Computer timed out. Please try again later.',
        };
      }

      return { success: false, error: errorMessage || 'Registration failed' };
    }
  }

  // Register an investor
  async registerInvestor(
    registrationData: InvestorRegistrationRequest
  ): Promise<BackendResponse<Investor>> {
    try {
      if (!this.actor) {
        throw new Error('Backend actor not initialized');
      }

      const investorRequest = {
        fullName: registrationData.fullName || '',
        email: registrationData.email || '',
        phone: registrationData.phone || '',
        country: registrationData.country || '',
        city: registrationData.city || '',
        investmentExperience: registrationData.investmentExperience || '',
        riskTolerance: registrationData.riskTolerance || '',
        investmentGoals: registrationData.investmentGoals || '',
        availableCapital: registrationData.availableCapital || '',
        monthlyBudget: registrationData.monthlyBudget || '',
      };

      const result: Result_2 =
        await this.actor.registerInvestor(investorRequest);

      // Handle the response using the generated Result type
      if ('ok' in result && result.ok) {
        return { success: true, data: result.ok };
      } else if ('err' in result && result.err) {
        return { success: false, error: result.err };
      } else {
        return {
          success: false,
          error: 'Unexpected response format from backend',
        };
      }
    } catch (error) {
      // Handle specific IC errors
      const errorMessage = (error as Error).message || '';
      if (
        errorMessage.includes('Canister') &&
        errorMessage.includes('does not belong to any subnet')
      ) {
        return {
          success: false,
          error:
            'Cannot connect to the backend canister. Please ensure you are using the correct canister ID.',
        };
      } else if (errorMessage.includes('Invalid principal')) {
        return {
          success: false,
          error:
            'Authentication error. Please sign in again and try once more.',
        };
      } else if (errorMessage.includes('timeout')) {
        return {
          success: false,
          error:
            'Connection to Internet Computer timed out. Please try again later.',
        };
      }

      return { success: false, error: errorMessage || 'Registration failed' };
    }
  }

  // Get all founders
  async getAllFounders(): Promise<BackendResponse<Founder[]>> {
    try {
      if (!this.actor) {
        throw new Error('Backend actor not initialized');
      }

      const founders = await this.actor.getFounders();
      return { success: true, data: founders };
    } catch (error) {
      // Handle specific IC errors
      const errorMessage = (error as Error).message || '';
      if (
        errorMessage.includes('Canister') &&
        errorMessage.includes('does not belong to any subnet')
      ) {
        return {
          success: false,
          error:
            'Cannot connect to the backend canister. Please ensure you are using the correct canister ID.',
        };
      } else if (errorMessage.includes('Invalid principal')) {
        return {
          success: false,
          error:
            'Authentication error. Please sign in again and try once more.',
        };
      } else if (errorMessage.includes('timeout')) {
        return {
          success: false,
          error:
            'Connection to Internet Computer timed out. Please try again later.',
        };
      }

      return {
        success: false,
        error: errorMessage || 'Failed to fetch founders',
      };
    }
  }

  // Validate founder registration data
  validateFounderData(data: Partial<FounderRegistrationData>): string[] {
    const errors = [];

    if (!data.fullName || data.fullName.trim() === '') {
      errors.push('Full name is required');
    }
    if (!data.email || data.email.trim() === '') {
      errors.push('Email is required');
    }
    if (!data.phone || data.phone.trim() === '') {
      errors.push('Phone number is required');
    }
    if (!data.address || data.address.trim() === '') {
      errors.push('Address is required');
    }
    if (!data.idNumber || data.idNumber.trim() === '') {
      errors.push('ID number is required');
    }
    if (!data.taxNumber || data.taxNumber.trim() === '') {
      errors.push('Tax number is required');
    }

    // Email validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address');
    }

    return errors;
  }

  // Validate investor registration data
  validateInvestorData(data: Partial<InvestorRegistrationData>): string[] {
    const errors = [];

    if (!data.fullName || data.fullName.trim() === '') {
      errors.push('Full name is required');
    }
    if (!data.email || data.email.trim() === '') {
      errors.push('Email is required');
    }
    if (!data.phone || data.phone.trim() === '') {
      errors.push('Phone number is required');
    }
    if (!data.country || data.country.trim() === '') {
      errors.push('Country is required');
    }
    if (!data.city || data.city.trim() === '') {
      errors.push('City is required');
    }

    // Email validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address');
    }

    return errors;
  }
}

// Hook to use registration service
export function useRegistrationService() {
  const {
    getActor,
    initializeBackendActor,
    isAuthenticated,
    isBackendDeclarationsAvailable,
    setBackendDeclarations,
  } = useAuth();
  const actor = getActor();

  const service = new RegistrationService(
    actor,
    initializeBackendActor,
    getActor
  );
  const isAvailable =
    !!actor && isAuthenticated && isBackendDeclarationsAvailable();

  // Load backend declarations if not available
  const loadDeclarations = async () => {
    if (!isBackendDeclarationsAvailable()) {
      const { idlFactory } = getActor()
        ? { idlFactory: null }
        : { idlFactory: null };
      if (idlFactory) {
        setBackendDeclarations(idlFactory);
      }
    }
  };

  return {
    service,
    isAvailable,
    initializeBackendActor,
    isAuthenticated,
    isBackendDeclarationsAvailable,
    loadDeclarations,
  };
}
