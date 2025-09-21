"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { backendService } from "../../lib/backend";
import { AIService } from "../../lib/aiService";
import Layout from "../../components/Layout";
import {
  ProgressSteps,
  FounderForm,
  StartupForm,
  CollateralForm,
  StatusUpdateForm,
  DataOverview
} from "../../components/testing-data";
import type { Founder, Startup } from "../../declarations/plantify_backend/plantify_backend.did";

export default function TestingDataPage() {
  const { isAuthenticated, isLoading, principal } = useAuth();
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
  const [aiGeneratedNFTImage, setAiGeneratedNFTImage] = useState<string>("");

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
      setAiGeneratedNFTImage(aiData.nftImage);
    } catch (error) {
      console.error("Failed to generate startup AI data:", error);
      alert("Failed to generate startup AI data. Please check your API configuration.");
    } finally {
      setIsGeneratingStartupAI(false);
    }
  };

  const generateNFTImage = async () => {
    if (!startupFormData.description || !startupFormData.industry) {
      alert("Please fill in both description and industry fields before generating NFT image.");
      return;
    }

    try {
      const nftImage = await AIService.generateNFTImage(
        startupFormData.description,
        startupFormData.industry,
        startupFormData.companyName // Use company name as temp ID
      );
      setAiGeneratedNFTImage(nftImage);
    } catch (error) {
      console.error("Failed to generate NFT image:", error);
      alert("Failed to generate NFT image. Please try again.");
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
      // Use AI generated logo if available, otherwise use empty array
      const logoToUse = aiGeneratedLogo || "";
      
      // Use AI generated NFT image if available, otherwise use logo as fallback
      const nftImageToUse = aiGeneratedNFTImage || logoToUse;
      
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
        companyLogo: logoToUse ? [logoToUse] as [] | [string] : [] as [] | [string],
        nftImage: nftImageToUse ? [nftImageToUse] as [] | [string] : [] as [] | [string], // Use AI generated NFT image
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
        companyImages: [],
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
    
    const startup = startups.find(s => s.id === selectedStartup);
    const startupName = startup?.startupName || startup?.id || "Unknown Startup";
    
    const confirmed = window.confirm(
      `Are you sure you want to update the status of "${startupName}" to "${newStatus}"?\n\nThis action will be performed on the mainnet backend and cannot be undone.${
        newStatus === 'Active' ? '\n\nAn NFT will be automatically minted for this active startup.' : ''
      }`
    );
    
    if (!confirmed) {
      return;
    }
    
    setIsUpdatingStatus(true);
    try {
      const result = await backendService.updateStartupStatus(selectedStartup, newStatus);
      
      if (result) {
        let successMessage = `Startup "${startupName}" status updated to "${newStatus}" successfully!`;
        
        // If status is active, mint an NFT
        if (newStatus === 'Active' && startup && principal) {
          try {
            console.log('Minting NFT for active startup:', startupName);
            const nftResult = await backendService.mintNFTForStartup(selectedStartup, startup, principal);
            
            if ('ok' in nftResult) {
              const nftResponse = nftResult.ok;
              if ('Success' in nftResponse) {
                successMessage += `\n\nNFT minted successfully! Token ID: ${nftResponse.Success.tokenId}`;
                console.log('NFT minted successfully:', nftResponse.Success);
              } else {
                console.warn('NFT minting failed:', nftResponse.Error);
                successMessage += `\n\nNote: Status updated but NFT minting failed: ${nftResponse.Error}`;
              }
            } else {
              console.warn('NFT minting failed:', nftResult.err);
              successMessage += `\n\nNote: Status updated but NFT minting failed: ${nftResult.err}`;
            }
          } catch (nftError) {
            console.error('NFT minting error:', nftError);
            successMessage += `\n\nNote: Status updated but NFT minting failed: ${nftError instanceof Error ? nftError.message : 'Unknown error'}`;
          }
        }
        
        alert(successMessage);
      setNewStatus("");
        setSelectedStartup("");
        await loadData();
      setCurrentStep(1);
      } else {
        alert("Failed to update startup status. Please try again.");
      }
    } catch (error) {
      console.error("Failed to update startup status:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to update startup status: ${errorMessage}`);
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
        <ProgressSteps currentStep={currentStep} steps={steps} />

        {currentStep === 1 && (
          <FounderForm
            formData={formData}
            isGeneratingAI={isGeneratingAI}
            isRegistering={isRegistering}
            onInputChange={handleInputChange}
            onGenerateAI={generateAIData}
            onRegister={registerFounder}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <StartupForm
            formData={startupFormData}
            founders={founders}
            teamMembers={teamMembers}
            aiGeneratedLogo={aiGeneratedLogo}
            aiGeneratedNFTImage={aiGeneratedNFTImage}
            isGeneratingStartupAI={isGeneratingStartupAI}
            isCreatingStartup={isCreatingStartup}
            onInputChange={handleStartupInputChange}
            onGenerateAI={generateStartupAIData}
            onGenerateNFTImage={generateNFTImage}
            onCreate={createStartup}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
            onAddTeamMember={addTeamMember}
            onUpdateTeamMember={updateTeamMember}
            onRemoveTeamMember={removeTeamMember}
          />
        )}

        {currentStep === 3 && (
          <CollateralForm
            startups={startups}
            selectedStartup={selectedStartup}
            collateralAmount={collateralAmount}
            isToppingUp={isToppingUp}
            onStartupChange={setSelectedStartup}
            onAmountChange={setCollateralAmount}
            onTopUp={topUpCollateral}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <StatusUpdateForm
            startups={startups}
            selectedStartup={selectedStartup}
            newStatus={newStatus}
            isUpdatingStatus={isUpdatingStatus}
            onStartupChange={setSelectedStartup}
            onStatusChange={setNewStatus}
            onUpdate={updateStartupStatus}
            onBack={() => setCurrentStep(3)}
            onStartOver={() => setCurrentStep(1)}
          />
        )}

        <DataOverview founders={founders} startups={startups} />
      </div>
    </Layout>
  );
}