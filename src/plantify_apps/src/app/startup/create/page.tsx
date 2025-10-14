'use client';

import { AuthClient } from '@dfinity/auth-client';
import { Formik, FormikProps } from 'formik';
import {
  CircleArrowRight,
  CircleArrowLeft,
  CircleCheckBig,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Layout } from '@/components';
import {
  BasicInformationStep,
  BusinessDetailsStep,
  TeamBackgroundStep,
  FinancialProjectionsStep,
  CollateralSetupStep,
  ReviewSubmitStep,
} from '@/components/startup/steps';
import TabNavigation from '@/components/startup/TabNavigation';
import { StartupFormData } from '@/components/startup/types';
import { Button, LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import type {
  StartupCreationRequest,
  TeamMember,
} from '@/declarations/plantify_backend/plantify_backend.did';
import { uploadFile } from '@/lib/fileUpload';
import { validationSchemas } from '@/lib/validation/startupValidationSchemas';
import { FounderService } from '@/services/founders/FounderService';

export default function CreateStartupPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isNFTGenerated, setIsNFTGenerated] = useState(false);

  const initialValues: StartupFormData = {
    startupName: '',
    logo: null,
    companyImages: [],
    sector: '',
    foundedYear: '',
    companyType: '',
    location: '',
    description: '',
    website: '',
    builtByCaffeineAI: false,

    problemStatement: '',
    solution: '',
    targetMarket: '',
    competitiveAdvantage: '',
    marketingStrategy: '',
    operationalProcess: '',

    founderName: '',
    founderRole: '',
    founderEmail: '',
    founderLinkedIn: '',
    founderBackground: '',
    founderPhoto: null,
    teamMembers: [],
    advisors: '',

    fundingGoal: '',
    nftPrice: '',
    monthlyProfitSharing: '',
    expectedMonthlyRevenue: '',
    expectedMonthlyExpenses: '',
    breakEvenMonth: '',
    revenueModel: '',
    useOfFunds: '',

    businessPlan: null,
    financialProjectionsFile: null,
    legalDocuments: null,
  };

  const tabs = [
    {
      id: 1,
      label: 'Basic Information',
    },
    {
      id: 2,
      label: 'Business Details',
    },
    {
      id: 3,
      label: 'Team & Background',
    },
    {
      id: 4,
      label: 'Financial Projections',
    },
    {
      id: 5,
      label: 'Collateral Setup',
    },
    {
      id: 6,
      label: 'Review & Submit',
    },
  ];

  const nextStep = () => {
    if (step < tabs.length) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleEdit = (stepNumber: number) => {
    setStep(stepNumber);
  };

  const fileToString = async (
    file: File | null | string
  ): Promise<string | null> => {
    if (!file) return null;
    if (typeof file === 'string') return file;

    try {
      const fileUrl = await uploadFile(file, 'startup-files');

      if (fileUrl) {
        return fileUrl;
      } else {
        console.error(`Failed to upload file: ${file.name}`);

        return file.name;
      }
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);

      return file.name;
    }
  };

  const mapFormDataToBackend = async (
    formData: StartupFormData
  ): Promise<StartupCreationRequest> => {
    let logoUrl: string | null = null;
    if (formData.logoUrl) {
      logoUrl = formData.logoUrl;
    } else if (formData.logo) {
      logoUrl = await fileToString(formData.logo);
    }

    // Handle company images
    const companyImageUrls: string[] = [];
    if (formData.companyImagesUrls && formData.companyImagesUrls.length > 0) {
      companyImageUrls.push(...formData.companyImagesUrls);
    } else if (formData.companyImages && formData.companyImages.length > 0) {
      for (const image of formData.companyImages) {
        const imageUrl = await fileToString(image);
        if (imageUrl) {
          companyImageUrls.push(imageUrl);
        }
      }
    }

    let founderPhotoUrl: string | null = null;
    if (formData.founderPhotoUrl) {
      founderPhotoUrl = formData.founderPhotoUrl;
    } else if (formData.founderPhoto) {
      founderPhotoUrl = await fileToString(formData.founderPhoto);
    }

    const teamMemberPhotoUrls: (string | null)[] = [];
    for (let i = 0; i < formData.teamMembers.length; i++) {
      const member = formData.teamMembers[i];

      if (member.photoUrl) {
        teamMemberPhotoUrls[i] = member.photoUrl;
      } else if (member.photo) {
        teamMemberPhotoUrls[i] = await fileToString(member.photo);
      } else {
        teamMemberPhotoUrls[i] = null;
      }
    }

    let businessPlanUrl: string | null = null;
    if (formData.businessPlanUrl) {
      businessPlanUrl = formData.businessPlanUrl;
    } else if (formData.businessPlan) {
      businessPlanUrl = await fileToString(formData.businessPlan);
    }

    let financialProjectionsUrl: string | null = null;
    if (formData.financialProjectionsUrl) {
      financialProjectionsUrl = formData.financialProjectionsUrl;
    } else if (formData.financialProjectionsFile) {
      financialProjectionsUrl = await fileToString(
        formData.financialProjectionsFile
      );
    }

    let legalDocumentsUrl: string | null = null;
    if (formData.legalDocumentsUrl) {
      legalDocumentsUrl = formData.legalDocumentsUrl;
    } else if (formData.legalDocuments) {
      legalDocumentsUrl = await fileToString(formData.legalDocuments);
    }

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
      companyImages: companyImageUrls,
      nftImage: [] as [] | [string],
      builtByCaffeineAI: formData.builtByCaffeineAI
        ? [true]
        : ([false] as [] | [boolean]),
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
      status: 'pending',
    };
  };

  const handleSubmit = async (
    values: StartupFormData,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    if (!isAuthenticated) {
      setSubmitError('Please login to create a startup');
      router.push('/auth');
      return;
    }

    setIsSubmitting(true);

    try {
      try {
        const startupRequest = await mapFormDataToBackend(values);
        const result = await FounderService.createStartup(startupRequest);

        if (result.success) {
          setSubmitSuccess(
            'Startup submitted successfully! Your startup is now under review.'
          );
          setTimeout(() => {
            router.push('/founder');
          }, 2000);
        } else {
          console.error('Error from backend:', result.error);
          setSubmitError(`Error creating startup: ${result.error}`);
        }
      } catch (uploadError) {
        console.error('Error during file upload or data mapping:', uploadError);
        setSubmitError('Error uploading files. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting startup:', error);
      setSubmitError('Error submitting startup. Please try again.');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className='flex items-center justify-center min-h-[60vh]'>
          <div className='text-center'>
            <LoadingSpinner size='lg' />
            <p className='text-gray-600 mt-4'>Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='mt-8 mb-24'>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[step - 1]}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
            submitForm,
          }: FormikProps<StartupFormData>) => {
            const stepErrors: Record<string, string> = {};
            Object.keys(errors).forEach(key => {
              const error = errors[key as keyof typeof errors];
              if (typeof error === 'string') {
                stepErrors[key] = error;
              }
            });

            const stepTouched: Record<string, boolean> = {};
            Object.keys(touched).forEach(key => {
              const touch = touched[key as keyof typeof touched];
              if (typeof touch === 'boolean') {
                stepTouched[key] = touch;
              }
            });

            return (
              <div className='w-full'>
                <TabNavigation
                  tabs={tabs}
                  currentStep={step}
                  onStepChange={setStep}
                />

                <div className='w-full px-6'>
                  {submitError && (
                    <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
                      <p className='text-red-800'>{submitError}</p>
                      <button
                        onClick={() => setSubmitError(null)}
                        className='mt-2 text-red-600 hover:text-red-800 underline'
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {submitSuccess && (
                    <div className='mb-4 p-4 bg-green-50 border border-green-200 rounded-lg'>
                      <p className='text-green-800'>{submitSuccess}</p>
                    </div>
                  )}
                </div>

                <div
                  className='w-full bg-neutral-50 rounded-2xl shadow-sm p-8 mt-8'
                  style={{ width: '100%', maxWidth: 'none' }}
                >
                  {step === 1 && (
                    <BasicInformationStep
                      formData={values}
                      setFormData={setFieldValue}
                      errors={stepErrors}
                      touched={stepTouched}
                    />
                  )}

                  {step === 2 && (
                    <BusinessDetailsStep
                      formData={values}
                      setFormData={setFieldValue}
                      errors={stepErrors}
                      touched={stepTouched}
                    />
                  )}

                  {step === 3 && (
                    <TeamBackgroundStep
                      formData={values}
                      setFormData={setFieldValue}
                      errors={stepErrors}
                      touched={stepTouched}
                    />
                  )}

                  {step === 4 && (
                    <FinancialProjectionsStep
                      formData={values}
                      setFormData={setFieldValue}
                      errors={stepErrors}
                      touched={stepTouched}
                    />
                  )}

                  {step === 5 && (
                    <CollateralSetupStep
                      formData={values}
                      setFormData={setFieldValue}
                      errors={stepErrors}
                      touched={stepTouched}
                    />
                  )}

                  {step === 6 && (
                    <ReviewSubmitStep
                      formData={values}
                      onEdit={handleEdit}
                      onNFTGenerated={setIsNFTGenerated}
                    />
                  )}
                </div>

                <div className='flex justify-between items-center mt-12'>
                  {step > 1 ? (
                    <Button
                      onClick={prevStep}
                      variant='secondary'
                      className='flex items-center gap-2'
                      type='button'
                    >
                      <CircleArrowLeft size={16} /> Previous
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {step < tabs.length ? (
                    <Button
                      onClick={nextStep}
                      disabled={!isValid}
                      variant='primary'
                      className='flex items-center gap-2'
                      type='button'
                    >
                      Next <CircleArrowRight size={16} />
                    </Button>
                  ) : (
                    <div className='flex flex-col items-end space-y-2'>
                      {step === 6 && !isNFTGenerated && (
                        <p className='text-sm text-amber-600'>
                          Please generate an NFT image before submitting
                        </p>
                      )}
                      <Button
                        onClick={submitForm}
                        disabled={
                          isSubmitting || (step === 6 && !isNFTGenerated)
                        }
                        variant='primary'
                        className='flex items-center gap-2'
                        type='button'
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
                    </div>
                  )}
                </div>
              </div>
            );
          }}
        </Formik>
      </div>
    </Layout>
  );
}
