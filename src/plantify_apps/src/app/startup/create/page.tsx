'use client';

import { AuthClient } from '@dfinity/auth-client';
import {
  Building2,
  Briefcase,
  Users,
  DollarSign,
  FileText,
  CheckCircle,
  CircleArrowRight,
  CircleArrowLeft,
  CircleCheckBig,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import {
  BasicInformationStep,
  BusinessDetailsStep,
  TeamBackgroundStep,
  FinancialProjectionsStep,
  CollateralSetupStep,
  ReviewSubmitStep,
} from '@/components/startup/steps';
import { StartupFormData } from '@/components/startup/types';
import { Button, LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import type {
  StartupCreationRequest,
  TeamMember,
} from '@/declarations/plantify_backend/plantify_backend.did';
import { uploadFile } from '@/lib/fileUpload';
import { FounderService } from '@/services/founders/FounderService';

// Import step components

// Import shared types

export default function CreateStartupPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<StartupFormData>({
    // Basic Information
    startupName: '',
    logo: null,
    sector: '',
    foundedYear: '',
    companyType: '',
    location: '',
    description: '',
    website: '',

    // Business Details
    problemStatement: '',
    solution: '',
    targetMarket: '',
    competitiveAdvantage: '',
    marketingStrategy: '',
    operationalProcess: '',

    // Team & Background
    founderName: '',
    founderRole: '',
    founderEmail: '',
    founderLinkedIn: '',
    founderBackground: '',
    founderPhoto: null,
    teamMembers: [],
    advisors: '',

    // Financial Projections
    fundingGoal: '',
    nftPrice: '',
    monthlyProfitSharing: '',
    expectedMonthlyRevenue: '',
    expectedMonthlyExpenses: '',
    breakEvenMonth: '',
    revenueModel: '',
    useOfFunds: '',

    // Documents
    businessPlan: null,
    financialProjectionsFile: null,
    legalDocuments: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is authenticated and is a founder
  //   useEffect(() => {
  //     if (!authLoading && !isAuthenticated) {
  //       router.push('/auth');
  //     } else if (!authLoading && isAuthenticated && userType !== 'founder') {
  //       router.push('/register/founder');
  //     }
  //   }, [isAuthenticated, authLoading, userType, router]);

  const tabs = [
    {
      id: 1,
      label: 'Basic Information',
      icon: <Building2 className='w-4 h-4' />,
    },
    {
      id: 2,
      label: 'Business Details',
      icon: <Briefcase className='w-4 h-4' />,
    },
    {
      id: 3,
      label: 'Team & Background',
      icon: <Users className='w-4 h-4' />,
    },
    {
      id: 4,
      label: 'Financial Projections',
      icon: <DollarSign className='w-4 h-4' />,
    },
    {
      id: 5,
      label: 'Collateral Setup',
      icon: <FileText className='w-4 h-4' />,
    },
    {
      id: 6,
      label: 'Review & Submit',
      icon: <CheckCircle className='w-4 h-4' />,
    },
  ];

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.startupName)
          newErrors.startupName = 'Startup name is required';
        if (!formData.sector) newErrors.sector = 'Business sector is required';
        if (!formData.foundedYear)
          newErrors.foundedYear = 'Founded year is required';
        if (!formData.companyType)
          newErrors.companyType = 'Company type is required';
        if (!formData.location) newErrors.location = 'Location is required';
        if (!formData.description)
          newErrors.description = 'Business description is required';
        break;
      case 2:
        if (!formData.problemStatement)
          newErrors.problemStatement = 'Problem statement is required';
        if (!formData.solution) newErrors.solution = 'Solution is required';
        if (!formData.targetMarket)
          newErrors.targetMarket = 'Target market is required';
        if (!formData.competitiveAdvantage)
          newErrors.competitiveAdvantage = 'Competitive advantage is required';
        if (!formData.marketingStrategy)
          newErrors.marketingStrategy = 'Marketing strategy is required';
        if (!formData.operationalProcess)
          newErrors.operationalProcess = 'Operational process is required';
        break;
      case 3:
        if (!formData.founderName)
          newErrors.founderName = 'Founder name is required';
        if (!formData.founderRole)
          newErrors.founderRole = 'Founder role is required';
        if (!formData.founderEmail)
          newErrors.founderEmail = 'Founder email is required';
        if (!formData.founderLinkedIn)
          newErrors.founderLinkedIn = 'Founder LinkedIn is required';
        if (!formData.founderBackground)
          newErrors.founderBackground = 'Founder background is required';
        if (!formData.advisors)
          newErrors.advisors = 'Advisors information is required';
        break;
      case 4:
        if (!formData.fundingGoal)
          newErrors.fundingGoal = 'Funding goal is required';
        if (!formData.monthlyProfitSharing)
          newErrors.monthlyProfitSharing = 'Monthly profit sharing is required';
        if (!formData.expectedMonthlyRevenue)
          newErrors.expectedMonthlyRevenue =
            'Expected monthly revenue is required';
        if (!formData.breakEvenMonth)
          newErrors.breakEvenMonth = 'Break-even month is required';
        if (!formData.revenueModel)
          newErrors.revenueModel = 'Revenue model is required';
        if (!formData.useOfFunds)
          newErrors.useOfFunds = 'Use of funds is required';
        break;
      case 5:
        // File validations would be handled by the file upload components
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < tabs.length) setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleEdit = (stepNumber: number) => {
    setStep(stepNumber);
  };

  // Function to handle file uploads to Supabase and return the URL
  const fileToString = async (
    file: File | null | string
  ): Promise<string | null> => {
    if (!file) return null;
    if (typeof file === 'string') return file;

    try {
      console.log(`Processing file upload for: ${file.name}`);

      // Upload file to Supabase storage and get the URL
      const fileUrl = await uploadFile(file, 'startup-files');

      if (fileUrl) {
        console.log(
          `Successfully uploaded file: ${file.name}, URL: ${fileUrl}`
        );
        return fileUrl;
      } else {
        console.error(`Failed to upload file: ${file.name}`);
        // Fallback to filename if upload fails
        return file.name;
      }
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      // Fallback to filename if upload fails
      return file.name;
    }
  };

  // Function to convert form data to backend format
  const mapFormDataToBackend = async (
    formData: StartupFormData
  ): Promise<StartupCreationRequest> => {
    console.log('Preparing data for backend submission...');

    // Use already uploaded files URLs if available, otherwise upload them now

    // Logo
    let logoUrl: string | null = null;
    if (formData.logoUrl) {
      // Use already uploaded URL
      logoUrl = formData.logoUrl;
      console.log('Using pre-uploaded logo URL:', logoUrl);
    } else if (formData.logo) {
      // Upload now
      console.log('Uploading logo now...');
      logoUrl = await fileToString(formData.logo);
    }

    // Founder photo
    let founderPhotoUrl: string | null = null;
    if (formData.founderPhotoUrl) {
      // Use already uploaded URL
      founderPhotoUrl = formData.founderPhotoUrl;
      console.log('Using pre-uploaded founder photo URL:', founderPhotoUrl);
    } else if (formData.founderPhoto) {
      // Upload now
      console.log('Uploading founder photo now...');
      founderPhotoUrl = await fileToString(formData.founderPhoto);
    }

    // Team member photos
    const teamMemberPhotoUrls: (string | null)[] = [];
    for (let i = 0; i < formData.teamMembers.length; i++) {
      const member = formData.teamMembers[i];

      if (member.photoUrl) {
        // Use already uploaded URL
        teamMemberPhotoUrls[i] = member.photoUrl;
        console.log(
          `Using pre-uploaded team member ${i} photo URL:`,
          member.photoUrl
        );
      } else if (member.photo) {
        // Upload now
        console.log(`Uploading team member ${i} photo now...`);
        teamMemberPhotoUrls[i] = await fileToString(member.photo);
      } else {
        teamMemberPhotoUrls[i] = null;
      }
    }

    // Business plan
    let businessPlanUrl: string | null = null;
    if (formData.businessPlanUrl) {
      // Use already uploaded URL
      businessPlanUrl = formData.businessPlanUrl;
      console.log('Using pre-uploaded business plan URL:', businessPlanUrl);
    } else if (formData.businessPlan) {
      // Upload now
      console.log('Uploading business plan now...');
      businessPlanUrl = await fileToString(formData.businessPlan);
    }

    // Financial projections
    let financialProjectionsUrl: string | null = null;
    if (formData.financialProjectionsUrl) {
      // Use already uploaded URL
      financialProjectionsUrl = formData.financialProjectionsUrl;
      console.log(
        'Using pre-uploaded financial projections URL:',
        financialProjectionsUrl
      );
    } else if (formData.financialProjectionsFile) {
      // Upload now
      console.log('Uploading financial projections now...');
      financialProjectionsUrl = await fileToString(
        formData.financialProjectionsFile
      );
    }

    // Legal documents
    let legalDocumentsUrl: string | null = null;
    if (formData.legalDocumentsUrl) {
      // Use already uploaded URL
      legalDocumentsUrl = formData.legalDocumentsUrl;
      console.log('Using pre-uploaded legal documents URL:', legalDocumentsUrl);
    } else if (formData.legalDocuments) {
      // Upload now
      console.log('Uploading legal documents now...');
      legalDocumentsUrl = await fileToString(formData.legalDocuments);
    }

    // Map team members to backend format
    const teamMembers: TeamMember[] = formData.teamMembers.map(
      (member, index) => {
        const photoArray: [] | [string] = teamMemberPhotoUrls[index]
          ? [teamMemberPhotoUrls[index] as string]
          : [];

        return {
          id: BigInt(index + 1),
          name: member.name || '',
          role: member.role || '',
          background: member.background || '',
          photo: photoArray,
          linkedin: member.linkedin || '',
          email: member.email || '',
          isFounder: member.isFounder || false,
        };
      }
    );

    // Add founder as first team member if not already included
    const founderPhotoArray: [] | [string] = founderPhotoUrl
      ? [founderPhotoUrl]
      : [];
    const founderAsMember: TeamMember = {
      id: BigInt(0),
      name: formData.founderName || '',
      role: formData.founderRole || '',
      background: formData.founderBackground || '',
      photo: founderPhotoArray,
      linkedin: formData.founderLinkedIn || '',
      email: formData.founderEmail || '',
      isFounder: true,
    };

    const allTeamMembers = [founderAsMember, ...teamMembers];

    // Process file data to match the expected types
    const logoFile: [] | [string] = logoUrl ? [logoUrl] : [];
    const businessPlanFile: [] | [string] = businessPlanUrl
      ? [businessPlanUrl]
      : [];
    const financialProjectionsFile: [] | [string] = financialProjectionsUrl
      ? [financialProjectionsUrl]
      : [];
    const legalDocumentsFile: [] | [string] = legalDocumentsUrl
      ? [legalDocumentsUrl]
      : [];

    return {
      startupName: formData.startupName || '',
      sector: formData.sector || '',
      foundedYear: formData.foundedYear || '',
      description: formData.description || '',
      website: formData.website || '',
      location: formData.location || '',
      companyType: formData.companyType || '',
      companyLogo: logoFile,
      companyImages: [] as string[], // Array of text - empty for now
      nftImage: [] as [] | [string], // Optional text - empty for now
      problemStatement: formData.problemStatement || '',
      solution: formData.solution || '',
      targetMarket: formData.targetMarket || '',
      competitiveAdvantage: formData.competitiveAdvantage || '',
      marketingStrategy: formData.marketingStrategy || '',
      operationalProcess: formData.operationalProcess || '',
      founderBackground: formData.founderBackground || '',
      teamMembers: allTeamMembers,
      advisors: formData.advisors || '',
      fundingGoal: formData.fundingGoal || '',
      nftPrice: formData.nftPrice || '',
      periodicProfitSharing: formData.monthlyProfitSharing || '',
      revenueModel: formData.revenueModel || '',
      monthlyRevenue: formData.expectedMonthlyRevenue || '',
      monthlyExpenses: formData.expectedMonthlyExpenses || '',
      useOfFunds: formData.useOfFunds || '',
      businessPlan: businessPlanFile,
      financialProjections: financialProjectionsFile,
      legalDocuments: legalDocumentsFile,
      status: 'pending', // Default status for new startups
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication
    if (!isAuthenticated) {
      alert('Please login to create a startup');
      router.push('/auth');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if we have files to upload
      console.log('Files to upload:');
      if (formData.logo) console.log(`Logo: ${formData.logo.name}`);
      if (formData.founderPhoto)
        console.log(`Founder photo: ${formData.founderPhoto.name}`);
      if (formData.businessPlan)
        console.log(`Business plan: ${formData.businessPlan.name}`);
      if (formData.financialProjectionsFile)
        console.log(
          `Financial projections: ${formData.financialProjectionsFile.name}`
        );
      if (formData.legalDocuments)
        console.log(`Legal documents: ${formData.legalDocuments.name}`);

      // Team members photos
      formData.teamMembers.forEach((member, index) => {
        if (member.photo) {
          console.log(`Team member ${index} photo: ${member.photo.name}`);
        }
      });

      // Initialize auth client
      const authClient = await AuthClient.create();
      console.log('Auth client created');

      // Initialize backend service with auth client
      await FounderService.initialize(authClient);
      console.log('Founder service initialized');

      // Show file upload status
      console.log('Starting file uploads to Supabase...');

      try {
        // Map form data to backend format (this now includes file uploads to Supabase)
        const startupRequest = await mapFormDataToBackend(formData);
        console.log('Files uploaded successfully, submitting startup data...');

        // Submit to backend
        const result = await FounderService.createStartup(startupRequest);

        if (result.success) {
          // Success
          console.log('Startup created successfully!');
          alert(
            'Startup submitted successfully! Your startup is now under review.'
          );

          // Redirect to dashboard
          router.push('/founder/dashboard');
        } else {
          // Error from backend
          console.error('Error from backend:', result.error);
          alert(`Error creating startup: ${result.error}`);
        }
      } catch (uploadError) {
        console.error('Error during file upload or data mapping:', uploadError);
        alert('Error uploading files. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting startup:', error);
      alert('Error submitting startup. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className='bg-gray-50 text-gray-900 min-h-screen'>
        <Navbar />
        <div className='flex items-center justify-center min-h-[60vh]'>
          <div className='text-center'>
            <LoadingSpinner size='lg' />
            <p className='text-gray-600 mt-4'>Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Components are imported from @/components/startup/steps

  return (
    <div className='bg-gray-50 text-gray-900 min-h-screen'>
      <Navbar />

      <div className='max-w-7xl mx-auto mt-8 mb-8'>
        {/* Progress Steps */}
        <div className='flex justify-center mb-8'>
          <div className='flex items-center space-x-2 bg-white rounded-full p-2 shadow-sm max-w-7xl w-full'>
            {tabs.map((tab, index) => (
              <div key={tab.id} className='flex items-center w-full'>
                <button
                  className={`
                    flex justify-center items-center gap-[6px] flex-1
                    px-4 py-2 rounded-[12px] text-sm font-medium transition-all duration-200
                    ${
                      step === tab.id
                        ? 'bg-[#F5F5F5] shadow-[inset_0_3px_3px_rgba(255,255,255,0.4),inset_0_-2px_1px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.16)] text-gray-900'
                        : step > tab.id
                          ? 'bg-gray-100 text-gray-600'
                          : 'text-gray-400'
                    }`}
                  onClick={() => setStep(tab.id)}
                >
                  {tab.icon}
                  <span className='hidden sm:inline'>{tab.label}</span>
                </button>
                {index < tabs.length - 1 && (
                  <div className='w-8 h-px bg-gray-200 mx-1'></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className='bg-neutral-100 rounded-2xl shadow-sm p-8'>
          {step === 1 && (
            <BasicInformationStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}

          {step === 2 && (
            <BusinessDetailsStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}

          {step === 3 && (
            <TeamBackgroundStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}

          {step === 4 && (
            <FinancialProjectionsStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}

          {step === 5 && (
            <CollateralSetupStep
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}

          {step === 6 && (
            <ReviewSubmitStep formData={formData} onEdit={handleEdit} />
          )}
        </div>

        {/* Navigation */}
        <div className='flex justify-between mt-2 pt-6 border-t border-gray-100'>
          {/* Previous Button */}
          {step > 1 ? (
            <Button
              onClick={prevStep}
              variant='secondary'
              className='flex items-center gap-2'
            >
              <CircleArrowLeft size={16} /> Previous
            </Button>
          ) : (
            <div></div>
          )}

          {/* Next / Submit Button */}
          {step < tabs.length ? (
            <Button
              onClick={nextStep}
              disabled={isSubmitting}
              variant='primary'
              className='flex items-center gap-2'
            >
              Next <CircleArrowRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              variant='primary'
              className='flex items-center gap-2'
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className='animate-spin' />
                  Submitting...
                </>
              ) : (
                <>
                  <CircleCheckBig size={16} /> Submit Startup
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
