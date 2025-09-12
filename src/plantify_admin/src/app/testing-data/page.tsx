"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { backendService } from "../../lib/backend";
import { AIService } from "../../lib/aiService";
import Layout from "../../components/Layout";
import type { Founder, Startup } from "../../declarations/plantify_backend/plantify_backend.did";

export default function TestingDataPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isGeneratingStartupAI, setIsGeneratingStartupAI] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCreatingStartup, setIsCreatingStartup] = useState(false);
  const [isToppingUp, setIsToppingUp] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    experience: "",
    previousBusinesses: "",
    expertise: "",
    linkedIn: "",
    idNumber: "",
    taxNumber: "",
  });

  const [startupFormData, setStartupFormData] = useState({
    founderId: "",
    companyName: "",
    description: "",
    industry: "",
    businessModel: "",
    targetMarket: "",
    fundingGoal: "",
    equityOffering: "",
    timeline: "",
    teamSize: "",
    revenue: "",
    website: "",
    pitchDeck: "",
  });

  const [teamMembers, setTeamMembers] = useState<Array<{
    name: string;
    role: string;
    background: string;
    linkedin: string;
    email: string;
    isFounder: boolean;
  }>>([]);

  const [aiGeneratedLogo, setAiGeneratedLogo] = useState<string>("");

  const [selectedStartup, setSelectedStartup] = useState<string>("");
  const [collateralAmount, setCollateralAmount] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>("");

  const loadData = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const foundersData = await backendService.getFounders();
        const startupsData = await backendService.getAllStartups();
        setFounders(foundersData);
        setStartups(startupsData);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    loadData();
  }, [isAuthenticated, loadData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStartupInputChange = (field: string, value: string) => {
    setStartupFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTeamMember = () => {
    setTeamMembers(prev => [...prev, {
      name: "",
      role: "",
      background: "",
      linkedin: "",
      email: "",
      isFounder: false,
    }]);
  };

  const updateTeamMember = (index: number, field: string, value: string | boolean) => {
    setTeamMembers(prev => prev.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    ));
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== index));
  };

  const generateAIData = async () => {
    setIsGeneratingAI(true);
    try {
      const aiData = await AIService.generateFounderData();
      setFormData(aiData);
    } catch (error) {
      console.error("Failed to generate AI data:", error);
      alert("Failed to generate AI data. Please check your API configuration.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const generateStartupAIData = async () => {
    setIsGeneratingStartupAI(true);
    try {
      const aiData = await AIService.generateStartupData();
      setStartupFormData({
        founderId: startupFormData.founderId,
        companyName: aiData.companyName,
        description: aiData.description,
        industry: aiData.industry,
        businessModel: aiData.businessModel,
        targetMarket: aiData.targetMarket,
        fundingGoal: aiData.fundingGoal,
        equityOffering: aiData.equityOffering,
        timeline: aiData.timeline,
        teamSize: aiData.teamSize,
        revenue: aiData.revenue,
        website: aiData.website,
        pitchDeck: aiData.pitchDeck,
      });
      setTeamMembers(aiData.teamMembers);
      setAiGeneratedLogo(aiData.companyLogo);
    } catch (error) {
      console.error("Failed to generate startup AI data:", error);
      alert("Failed to generate startup AI data. Please check your API configuration.");
    } finally {
      setIsGeneratingStartupAI(false);
    }
  };

  const registerFounder = async () => {
    setIsRegistering(true);
    try {
      await backendService.registerFounder(formData);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        experience: "",
        previousBusinesses: "",
        expertise: "",
        linkedIn: "",
        idNumber: "",
        taxNumber: "",
      });
      await loadData();
      setCurrentStep(2);
      alert("Testing founder registered successfully!");
    } catch (error) {
      console.error("Failed to register founder:", error);
      alert("Failed to register testing founder. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const createStartup = async () => {
    setIsCreatingStartup(true);
    try {
      // Use AI generated logo if available, otherwise use default
      const logoToUse = aiGeneratedLogo || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
      
      const startupRequest = {
        status: "pending",
        periodicProfitSharing: startupFormData.equityOffering || "0",
        foundedYear: new Date().getFullYear().toString(),
        competitiveAdvantage: startupFormData.businessModel || "Not specified",
        businessPlan: [] as [] | [string],
        description: startupFormData.description,
        sector: startupFormData.industry,
        useOfFunds: startupFormData.timeline || "Not specified",
        website: startupFormData.website,
        teamMembers: teamMembers.map((member, index) => ({
          id: BigInt(index + 1),
          name: member.name,
          role: member.role,
          background: member.background,
          photo: [] as [] | [string],
          linkedin: member.linkedin,
          email: member.email,
          isFounder: member.isFounder,
        })),
        targetMarket: startupFormData.targetMarket,
        revenueModel: "Not specified",
        solution: startupFormData.description,
        companyLogo: [logoToUse] as [] | [string],
        companyType: "Startup",
        financialProjections: [] as [] | [string],
        marketingStrategy: "Not specified",
        startupName: startupFormData.companyName,
        fundingGoal: startupFormData.fundingGoal || "0",
        legalDocuments: [] as [] | [string],
        monthlyRevenue: "0",
        operationalProcess: "Not specified",
        advisors: "Not specified",
        nftPrice: "0",
        location: "Not specified",
        monthlyExpenses: "0",
        problemStatement: startupFormData.description,
        founderBackground: "Not specified",
      };

      // Use admin function if founder is selected, otherwise use regular function
      let result;
      if (startupFormData.founderId && founders.length > 0) {
        result = await backendService.createStartupForFounder(startupFormData.founderId, startupRequest);
      } else {
        result = await backendService.createStartup(startupRequest);
      }

      // Check if the result is an error
      console.log(result);
      
      
      if ('err' in result) {
        throw new Error(result.err);
      }

      setStartupFormData({
        founderId: "",
        companyName: "",
        description: "",
        industry: "",
        businessModel: "",
        targetMarket: "",
        fundingGoal: "",
        equityOffering: "",
        timeline: "",
        teamSize: "",
        revenue: "",
        website: "",
        pitchDeck: "",
      });
      setTeamMembers([]);
      setAiGeneratedLogo("");
      await loadData();
      setCurrentStep(3);
      alert("Testing startup created successfully!");
    } catch (error) {
      console.error("Failed to create startup:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to create testing startup: ${errorMessage}`);
    } finally {
      setIsCreatingStartup(false);
    }
  };

  const topUpCollateral = async () => {
    if (!selectedStartup || !collateralAmount) {
      alert("Please select a startup and enter collateral amount");
      return;
    }
    
    setIsToppingUp(true);
    try {
      await backendService.topUpCollateral({
        startupId: selectedStartup,
        amount: BigInt(parseFloat(collateralAmount) * 1000000), // Convert to micro units
        tokenType: "ckUSDC",
        memo: [],
      });
      setCollateralAmount("");
      setCurrentStep(4);
      alert("Collateral topped up successfully!");
    } catch (error) {
      console.error("Failed to top up collateral:", error);
      alert("Failed to top up collateral. Please try again.");
    } finally {
      setIsToppingUp(false);
    }
  };

  const updateStartupStatus = async () => {
    if (!selectedStartup || !newStatus) {
      alert("Please select a startup and enter new status");
      return;
    }
    
    setIsUpdatingStatus(true);
    try {
      // This would need to be implemented in the backend
      // await backendService.updateStartupStatus(selectedStartup, newStatus);
      alert("Startup status updated successfully!");
      setNewStatus("");
      setCurrentStep(1);
    } catch (error) {
      console.error("Failed to update startup status:", error);
      alert("Failed to update startup status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading testing data...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const steps = [
    { number: 1, title: "Create Founder", description: "Register a testing founder (optional)" },
    { number: 2, title: "Create Startup", description: "Create a startup with AI or select founder" },
    { number: 3, title: "Top Up Collateral", description: "Simulate collateral top-up" },
    { number: 4, title: "Update Status", description: "Update startup status" },
  ];

  return (
    <Layout title="Testing Data Flow">
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Testing Data Flow</h2>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.number 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.number ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{step.number}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Create Founder */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Step 1: Create Testing Founder</h3>
              <button
                onClick={generateAIData}
                disabled={isGeneratingAI}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                {isGeneratingAI ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Founder Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                    placeholder="Enter founder name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Experience (years)</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                    placeholder="Years of experience"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Previous Businesses</label>
                  <input
                    type="text"
                    value={formData.previousBusinesses}
                    onChange={(e) => handleInputChange('previousBusinesses', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                    placeholder="Previous business experience"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formData.linkedIn}
                    onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                    placeholder="LinkedIn profile URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Expertise</label>
                  <textarea
                    rows={3}
                    value={formData.expertise}
                    onChange={(e) => handleInputChange('expertise', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                    placeholder="Enter founder expertise and skills"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span>Skip to Startup Creation</span>
              </button>
              <button
                onClick={registerFounder}
                disabled={isRegistering}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                {isRegistering ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Registering...</span>
                  </>
                ) : (
                  'Register Founder'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Create Startup */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-gray-900">Step 2: Create Testing Startup</h3>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back to Founder Creation</span>
                </button>
              </div>
              <button
                onClick={generateStartupAIData}
                disabled={isGeneratingStartupAI}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                {isGeneratingStartupAI ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Admin Notice */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-green-800">Admin Mode: Founder Selection Enabled</h4>
                  <p className="text-sm text-green-700 mt-1">
                    You can create startups for any founder by selecting them from the dropdown below. 
                    If no founder is selected, the startup will be created for the currently logged-in user.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Select Founder (Optional)</label>
                  <select
                    value={startupFormData.founderId}
                    onChange={(e) => handleStartupInputChange('founderId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                  >
                    <option value="">Select a founder (or leave empty for current user)</option>
                    {founders.length === 0 ? (
                      <option value="" disabled>No founders available - Create one first</option>
                    ) : (
                      founders.map((founder, index) => (
                        <option key={index} value={founder.id}>
                          {founder.fullName || "Unknown Founder"}
                        </option>
                      ))
                    )}
                  </select>
                  {founders.length === 0 && (
                    <p className="mt-2 text-sm text-amber-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      No founders available. You can still create a startup for the current user, or click &quot;Back to Founder Creation&quot; to create founders first.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Company Name</label>
                  <input
                    type="text"
                    value={startupFormData.companyName}
                    onChange={(e) => handleStartupInputChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Industry</label>
                  <input
                    type="text"
                    value={startupFormData.industry}
                    onChange={(e) => handleStartupInputChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                    placeholder="Enter industry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Business Model</label>
                  <input
                    type="text"
                    value={startupFormData.businessModel}
                    onChange={(e) => handleStartupInputChange('businessModel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                    placeholder="Enter business model"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Target Market</label>
                  <input
                    type="text"
                    value={startupFormData.targetMarket}
                    onChange={(e) => handleStartupInputChange('targetMarket', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                    placeholder="Enter target market"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Funding Goal</label>
                  <input
                    type="number"
                    value={startupFormData.fundingGoal}
                    onChange={(e) => handleStartupInputChange('fundingGoal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                    placeholder="Enter funding goal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Equity Offering (%)</label>
                  <input
                    type="number"
                    value={startupFormData.equityOffering}
                    onChange={(e) => handleStartupInputChange('equityOffering', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                    placeholder="Enter equity offering percentage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 form-label">Timeline</label>
                  <input
                    type="text"
                    value={startupFormData.timeline}
                    onChange={(e) => handleStartupInputChange('timeline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 form-input"
                    placeholder="Enter timeline"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={4}
                value={startupFormData.description}
                onChange={(e) => handleStartupInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter startup description"
              />
            </div>

            {/* Team Members Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">Team Members</label>
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Member</span>
                </button>
              </div>
              
              {teamMembers.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-sm">No team members added yet</p>
                  <p className="text-xs text-gray-400 mt-1">At least one team member is required</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-sm font-medium text-gray-900">Team Member {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                            placeholder="Enter name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                            placeholder="e.g., CEO, CTO, CMO"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            value={member.email}
                            onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                            placeholder="Enter email"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">LinkedIn</label>
                          <input
                            type="url"
                            value={member.linkedin}
                            onChange={(e) => updateTeamMember(index, 'linkedin', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                            placeholder="LinkedIn profile URL"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Background</label>
                          <textarea
                            rows={2}
                            value={member.background}
                            onChange={(e) => updateTeamMember(index, 'background', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                            placeholder="Brief background and experience"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={member.isFounder}
                              onChange={(e) => updateTeamMember(index, 'isFounder', e.target.checked)}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-xs font-medium text-gray-700">Founder</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {aiGeneratedLogo && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Image 
                      src={aiGeneratedLogo} 
                      alt="Generated Company Logo" 
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">AI Generated Company Logo</p>
                    <p className="text-xs text-green-600">This logo will be used for the startup</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span>Skip to Collateral</span>
              </button>
              <button
                onClick={createStartup}
                disabled={isCreatingStartup}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                {isCreatingStartup ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  'Create Startup'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Top Up Collateral */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Step 3: Top Up Collateral</h3>
              <button
                onClick={() => setCurrentStep(2)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Startup Creation</span>
              </button>
            </div>
            
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Startup</label>
                <select
                  value={selectedStartup}
                  onChange={(e) => setSelectedStartup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a startup</option>
                  {startups.map((startup, index) => (
                    <option key={index} value={startup.id}>
                        {startup.id || "Unknown Startup"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collateral Amount (ckUSDC)</label>
                <input
                  type="number"
                  value={collateralAmount}
                  onChange={(e) => setCollateralAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter collateral amount"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep(4)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span>Skip to Status Update</span>
              </button>
              <button
                onClick={topUpCollateral}
                disabled={isToppingUp}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                {isToppingUp ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Topping Up...</span>
                  </>
                ) : (
                  'Top Up Collateral'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Update Status */}
        {currentStep === 4 && (
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Step 4: Update Startup Status</h3>
              <button
                onClick={() => setCurrentStep(3)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Collateral</span>
              </button>
            </div>
            
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Startup</label>
                <select
                  value={selectedStartup}
                  onChange={(e) => setSelectedStartup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a startup</option>
                  {startups.map((startup, index) => (
                    <option key={index} value={startup.id}>
                        {startup.id || "Unknown Startup"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select status</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Start Over</span>
              </button>
              <button
                onClick={updateStartupStatus}
                disabled={isUpdatingStatus}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                {isUpdatingStatus ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Data Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registered Founders</h3>
            <div className="space-y-3">
              {founders.length === 0 ? (
                <p className="text-gray-500 text-sm">No founders registered yet</p>
              ) : (
                founders.map((founder, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900">{founder.fullName || "Unknown"}</h4>
                    <p className="text-sm text-gray-600">{founder.email || "No email"}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Startups ({startups.length})</h3>
            <div className="space-y-3">
              {startups.length === 0 ? (
                <p className="text-gray-500 text-sm">No startups found</p>
              ) : (
                startups.map((startup, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{startup.startupName || "Unknown Startup"}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        startup.status === 'approved' ? 'bg-green-100 text-green-800' :
                        startup.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        startup.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {startup.status || 'pending'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{startup.description || "No description"}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {startup.sector || "No sector"}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        Founded: {startup.foundedYear || "N/A"}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        Team: {startup.teamMembers?.length || 0} members
                      </span>
                      {startup.fundingGoal && (
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          Goal: ${startup.fundingGoal}
                        </span>
                      )}
                    </div>
                    {startup.website && (
                      <div className="mt-2">
                        <a 
                          href={startup.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          {startup.website}
                        </a>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}