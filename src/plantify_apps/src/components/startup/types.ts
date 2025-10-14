export interface TeamMember {
  name?: string;
  role?: string;
  email?: string;
  linkedin?: string;
  background?: string;
  photo?: File | null;
  photoUrl?: string; // URL after upload
  isFounder?: boolean;
}

export interface StartupFormData {
  // Basic Information
  startupName: string;
  logo: File | null;
  logoUrl?: string; // URL after upload
  companyImages: File[];
  companyImagesUrls?: string[]; // URLs after upload
  sector: string;
  foundedYear: string;
  companyType: string;
  location: string;
  description: string;
  website: string;
  builtByCaffeineAI: boolean;

  // Business Details
  problemStatement: string;
  solution: string;
  targetMarket: string;
  competitiveAdvantage: string;
  marketingStrategy: string;
  operationalProcess: string;

  // Team & Background
  founderName: string;
  founderRole: string;
  founderEmail: string;
  founderLinkedIn: string;
  founderBackground: string;
  founderPhoto: File | null;
  founderPhotoUrl?: string; // URL after upload
  teamMembers: TeamMember[];
  teamMemberPhotosUrls?: (string | null)[]; // URLs after upload
  advisors: string;

  // Financial Projections
  fundingGoal: string;
  nftPrice: string;
  monthlyProfitSharing: string;
  expectedMonthlyRevenue: string;
  expectedMonthlyExpenses: string;
  breakEvenMonth: string;
  revenueModel: string;
  useOfFunds: string;

  // Documents
  businessPlan: File | null;
  businessPlanUrl?: string; // URL after upload
  financialProjectionsFile: File | null;
  financialProjectionsUrl?: string; // URL after upload
  legalDocuments: File | null;
  legalDocumentsUrl?: string; // URL after upload
}
