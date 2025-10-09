'use client';

import { AuthClient } from '@dfinity/auth-client';
import { Formik, Form, FormikProps } from 'formik';
import {
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
import TabNavigation from '@/components/startup/TabNavigation';
import { StartupFormData } from '@/components/startup/types';
import { Button, LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import type {
  StartupCreationRequest,
  TeamMember,
} from '@/declarations/plantify_backend/plantify_backend.did';
import { uploadFile } from '@/lib/fileUpload';
import { validationSchemas } from '@/lib/validationSchemas';
import { FounderService } from '@/services/founders/FounderService';

export default function CreateStartupPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const initialValues: StartupFormData = {
    startupName: '',
    logo: null,
    sector: '',
    foundedYear: '',
    companyType: '',
    location: '',
    description: '',
    website: '',

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
      console.log(`Processing file upload for: ${file.name}`);

      const fileUrl = await uploadFile(file, 'startup-files');

      if (fileUrl) {
        console.log(
          `Successfully uploaded file: ${file.name}, URL: ${fileUrl}`
        );
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
    console.log('Preparing data for backend submission...');

    let logoUrl: string | null = null;
    if (formData.logoUrl) {
      logoUrl = formData.logoUrl;
      console.log('Using pre-uploaded logo URL:', logoUrl);
    } else if (formData.logo) {
      console.log('Uploading logo now...');
      logoUrl = await fileToString(formData.logo);
    }

    let founderPhotoUrl: string | null = null;
    if (formData.founderPhotoUrl) {
      founderPhotoUrl = formData.founderPhotoUrl;
      console.log('Using pre-uploaded founder photo URL:', founderPhotoUrl);
    } else if (formData.founderPhoto) {
      console.log('Uploading founder photo now...');
      founderPhotoUrl = await fileToString(formData.founderPhoto);
    }

    const teamMemberPhotoUrls: (string | null)[] = [];
    for (let i = 0; i < formData.teamMembers.length; i++) {
      const member = formData.teamMembers[i];

      if (member.photoUrl) {
        teamMemberPhotoUrls[i] = member.photoUrl;
        console.log(
          `Using pre-uploaded team member ${i} photo URL:`,
          member.photoUrl
        );
      } else if (member.photo) {
        console.log(`Uploading team member ${i} photo now...`);
        teamMemberPhotoUrls[i] = await fileToString(member.photo);
      } else {
        teamMemberPhotoUrls[i] = null;
      }
    }

    let businessPlanUrl: string | null = null;
    if (formData.businessPlanUrl) {
      businessPlanUrl = formData.businessPlanUrl;
      console.log('Using pre-uploaded business plan URL:', businessPlanUrl);
    } else if (formData.businessPlan) {
      console.log('Uploading business plan now...');
      businessPlanUrl = await fileToString(formData.businessPlan);
    }

    let financialProjectionsUrl: string | null = null;
    if (formData.financialProjectionsUrl) {
      financialProjectionsUrl = formData.financialProjectionsUrl;
      console.log(
        'Using pre-uploaded financial projections URL:',
        financialProjectionsUrl
      );
    } else if (formData.financialProjectionsFile) {
      console.log('Uploading financial projections now...');
      financialProjectionsUrl = await fileToString(
        formData.financialProjectionsFile
      );
    }

    let legalDocumentsUrl: string | null = null;
    if (formData.legalDocumentsUrl) {
      legalDocumentsUrl = formData.legalDocumentsUrl;
      console.log('Using pre-uploaded legal documents URL:', legalDocumentsUrl);
    } else if (formData.legalDocuments) {
      console.log('Uploading legal documents now...');
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
      companyImages: [] as string[],
      nftImage: [] as [] | [string],
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
      console.log('Files to upload:');
      if (values.logo) console.log(`Logo: ${values.logo.name}`);
      if (values.founderPhoto)
        console.log(`Founder photo: ${values.founderPhoto.name}`);
      if (values.businessPlan)
        console.log(`Business plan: ${values.businessPlan.name}`);
      if (values.financialProjectionsFile)
        console.log(
          `Financial projections: ${values.financialProjectionsFile.name}`
        );
      if (values.legalDocuments)
        console.log(`Legal documents: ${values.legalDocuments.name}`);

      values.teamMembers.forEach((member, index) => {
        if (member.photo) {
          console.log(`Team member ${index} photo: ${member.photo.name}`);
        }
      });

      const authClient = await AuthClient.create();
      console.log('Auth client created');

      await FounderService.initialize(authClient);
      console.log('Founder service initialized');

      console.log('Starting file uploads to Supabase...');

      try {
        const startupRequest = await mapFormDataToBackend(values);
        console.log('Files uploaded successfully, submitting startup data...');

        const result = await FounderService.createStartup(startupRequest);

        if (result.success) {
          console.log('Startup created successfully!');
          setSubmitSuccess(
            'Startup submitted successfully! Your startup is now under review.'
          );
          setTimeout(() => {
            router.push('/founder/dashboard');
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

  return (
    <div className='bg-gray-50 text-gray-900 min-h-screen'>
      <Navbar />

      <div className='max-w-7xl mx-auto mt-8 mb-8'>
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
            // Convert Formik errors to simple string errors for step components
            const stepErrors: Record<string, string> = {};
            Object.keys(errors).forEach(key => {
              const error = errors[key as keyof typeof errors];
              if (typeof error === 'string') {
                stepErrors[key] = error;
              }
            });

            // Convert Formik touched to simple boolean object for step components
            const stepTouched: Record<string, boolean> = {};
            Object.keys(touched).forEach(key => {
              const touch = touched[key as keyof typeof touched];
              if (typeof touch === 'boolean') {
                stepTouched[key] = touch;
              }
            });

            return (
              <Form>
                {/* Progress Steps */}
                <TabNavigation
                  tabs={tabs}
                  currentStep={step}
                  onStepChange={setStep}
                />

                {/* Error/Success Messages */}
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

                {/* Form Content */}
                <div className='bg-neutral-100 rounded-2xl shadow-sm p-8'>
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
                    <ReviewSubmitStep formData={values} onEdit={handleEdit} />
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
                      type='button'
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
                      disabled={!isValid}
                      variant='primary'
                      className='flex items-center gap-2'
                      type='button'
                    >
                      Next <CircleArrowRight size={16} />
                    </Button>
                  ) : (
                    <Button
                      onClick={submitForm}
                      disabled={isSubmitting}
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
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>

      <Footer />
    </div>
  );
}
