import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from '../declarations/plantify_backend';
import type {
  Founder,
  Investor,
  Startup,
  EnvironmentConfig,
  BalanceResponse,
  TransferAccount,
  TopUpRequest,
  CollateralInfo,
  CollateralProgressResponse,
  MintNFTRequest,
  NFTInfo,
  NFTAccount,
  NFTMetadata,
  NFTPurchaseInfo,
  FounderRegistrationRequest,
  InvestorRegistrationRequest,
  StartupCreationRequest,
  TransferResponse,
  TopUpResponse,
  MintNFTResponse,
  MonthlyReport,
  MonthlyReportRequest,
  MonthlyReportList,
  MonthlyReportStats,
  MonthlyReportStatus,
  InvestorVote,
  VoteRequest,
  VoteSummary,
  VotingStats,
} from '../declarations/plantify_backend/plantify_backend.did';

type NFTStats = {
  nextTokenId: number;
  totalStartups: number;
  totalSupply: number;
};

export interface BackendActor {
  registerFounder: (
    request: FounderRegistrationRequest
  ) => Promise<{ ok: Founder } | { err: string }>;
  registerInvestor: (
    request: InvestorRegistrationRequest
  ) => Promise<{ ok: Investor } | { err: string }>;
  createStartup: (
    request: StartupCreationRequest
  ) => Promise<{ ok: Startup } | { err: string }>;
  createStartupForFounder: (
    founderId: string,
    request: StartupCreationRequest
  ) => Promise<{ ok: Startup } | { err: string }>;
  whoami: () => Promise<Principal>;
  getEnvironmentConfig: () => Promise<EnvironmentConfig>;
  getEnvironment: () => Promise<string>;
  getICPBalance: (account: TransferAccount) => Promise<BalanceResponse>;
  getCkUSDCBalance: (account: TransferAccount) => Promise<BalanceResponse>;
  getICPBalanceByPrincipal: (principalText: string) => Promise<BalanceResponse>;
  getCkUSDCBalanceByPrincipal: (
    principalText: string
  ) => Promise<BalanceResponse>;
  transferICP: (
    toAccount: TransferAccount,
    amount: number,
    memo?: string
  ) => Promise<TransferResponse>;
  transferCkUSDC: (
    toAccount: TransferAccount,
    amount: number,
    memo?: string
  ) => Promise<TransferResponse>;
  initializeCollateral: (
    startupId: string,
    requiredAmount: number,
    tokenType: string
  ) => Promise<{ ok: string } | { err: string }>;
  topUpCollateral: (
    request: TopUpRequest
  ) => Promise<{ ok: TopUpResponse } | { err: string }>;
  getCollateralStatus: (
    startupId: string
  ) => Promise<{ ok: CollateralInfo } | { err: string }>;
  getCollateralProgress: (
    startupId: string
  ) => Promise<CollateralProgressResponse>;
  getAllCollateralInfo: () => Promise<CollateralInfo[]>;
  mintNFT: (
    request: MintNFTRequest
  ) => Promise<{ ok: MintNFTResponse } | { err: string }>;
  getNFTInfo: (tokenId: number) => Promise<{ ok: NFTInfo } | { err: string }>;
  getNFTsByStartup: (
    startupId: string
  ) => Promise<{ ok: NFTInfo[] } | { err: string }>;
  getAllNFTs: () => Promise<NFTInfo[]>;
  getAllPurchases: () => Promise<NFTPurchaseInfo[]>;
  getNFTStats: () => Promise<NFTStats>;
  getFounders: () => Promise<Founder[]>;
  getInvestors: () => Promise<Investor[]>;
  getFounderByPrincipal?: () => Promise<Founder | null>;
  getInvestorByPrincipal?: () => Promise<Investor | null>;
  getUserType?: () => Promise<'Founder' | 'Investor' | null>;
  isUserFounder?: () => Promise<boolean>;
  isUserInvestor?: () => Promise<boolean>;
  getAllStartups: () => Promise<Startup[]>;
  getStartupsPaginated: (params: { page: number; limit: number }) => Promise<{
    startups: Startup[];
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  getStartupsCount: () => Promise<number>;
  updateStartupStatus: (startupId: string, status: string) => Promise<boolean>;
  getStartupDetails: (startupId: string) => Promise<[] | [Startup]>;

  // Monthly Report Methods
  createMonthlyReport: (
    request: MonthlyReportRequest
  ) => Promise<{ ok: MonthlyReport } | { err: string }>;
  updateMonthlyReport: (
    reportId: string,
    request: MonthlyReportRequest
  ) => Promise<{ ok: MonthlyReport } | { err: string }>;
  submitMonthlyReport: (
    reportId: string
  ) => Promise<{ ok: MonthlyReport } | { err: string }>;
  approveMonthlyReport: (
    reportId: string
  ) => Promise<{ ok: MonthlyReport } | { err: string }>;
  rejectMonthlyReport: (
    reportId: string
  ) => Promise<{ ok: MonthlyReport } | { err: string }>;
  getMonthlyReport: (
    reportId: string
  ) => Promise<{ ok: MonthlyReport } | { err: string }>;
  getMonthlyReportsByStartup: (
    startupId: string
  ) => Promise<{ ok: MonthlyReportList } | { err: string }>;
  getAllMonthlyReports: () => Promise<MonthlyReport[]>;
  getMonthlyReportStats: () => Promise<MonthlyReportStats>;
  getMonthlyReportsByStatus: (
    status: MonthlyReportStatus
  ) => Promise<MonthlyReport[]>;

  // Voting Methods
  castVote: (
    request: VoteRequest
  ) => Promise<{ ok: InvestorVote } | { err: string }>;
  updateVote: (
    reportId: string,
    request: VoteRequest
  ) => Promise<{ ok: InvestorVote } | { err: string }>;
  getVoteSummary: (
    reportId: string
  ) => Promise<{ ok: VoteSummary } | { err: string }>;
  getReportVotes: (reportId: string) => Promise<InvestorVote[]>;
  getVotingStats: () => Promise<VotingStats>;
  canInvestorVote: (
    reportId: string
  ) => Promise<{ ok: boolean } | { err: string }>;
}

export class BackendService {
  private actor: BackendActor | null = null;
  private agent: HttpAgent | null = null;

  async initialize(identity: Identity) {
    const canisterId = 'a5ptu-ryaaa-aaaai-q32cq-cai';

    this.agent = new HttpAgent({
      host: 'https://ic0.app',
      identity: identity,
    });

    if (import.meta.env.MODE !== 'production') {
      await this.agent.fetchRootKey();
    }

    this.actor = Actor.createActor(idlFactory, {
      agent: this.agent,
      canisterId: canisterId,
    }) as BackendActor;
  }

  getActor(): BackendActor | null {
    return this.actor;
  }

  reset() {
    this.actor = null;
    this.agent = null;
  }

  async registerFounder(request: {
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
  }) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.registerFounder(request);
  }

  async registerInvestor(request: {
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
  }) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.registerInvestor(request);
  }

  async createStartup(request: StartupCreationRequest) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.createStartup(request);
  }

  async createStartupForFounder(
    founderId: string,
    request: StartupCreationRequest
  ) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.createStartupForFounder(founderId, request);
  }

  async whoami() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.whoami();
  }

  async getEnvironmentConfig() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getEnvironmentConfig();
  }

  async getICPBalance(account: TransferAccount) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getICPBalance(account);
  }

  async getCkUSDCBalance(account: TransferAccount) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getCkUSDCBalance(account);
  }

  async getICPBalanceByPrincipal(principalText: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getICPBalanceByPrincipal(principalText);
  }

  async getCkUSDCBalanceByPrincipal(principalText: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getCkUSDCBalanceByPrincipal(principalText);
  }

  async initializeCollateral(
    startupId: string,
    requiredAmount: number,
    tokenType: string
  ) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.initializeCollateral(
      startupId,
      requiredAmount,
      tokenType
    );
  }

  async topUpCollateral(request: TopUpRequest) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.topUpCollateral(request);
  }

  async getCollateralStatus(startupId: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getCollateralStatus(startupId);
  }

  async getCollateralProgress(startupId: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getCollateralProgress(startupId);
  }

  async getAllCollateralInfo() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getAllCollateralInfo();
  }

  async mintNFT(request: MintNFTRequest) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.mintNFT(request);
  }

  async getNFTInfo(tokenId: number) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getNFTInfo(tokenId);
  }

  async getNFTsByStartup(startupId: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getNFTsByStartup(startupId);
  }

  async getAllNFTs() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getAllNFTs();
  }

  async getAllPurchases() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getAllPurchases();
  }

  async getNFTStats() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getNFTStats();
  }

  async getFounders() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getFounders();
  }

  async getInvestors() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getInvestors();
  }

  async getFounderByPrincipal() {
    if (!this.actor) throw new Error('Backend not initialized');
    if (this.actor.getFounderByPrincipal) {
      const result = await this.actor.getFounderByPrincipal();
      return result || null;
    }
    // Fallback: find founder by principal
    const founders = await this.actor.getFounders();
    const currentPrincipal = await this.actor.whoami();
    const currentPrincipalText = currentPrincipal.toString();

    const founder = founders.find(
      (f: any) => f.principal.toString() === currentPrincipalText
    );
    return founder || null;
  }

  async getInvestorByPrincipal() {
    if (!this.actor) throw new Error('Backend not initialized');
    if (this.actor.getInvestorByPrincipal) {
      const result = await this.actor.getInvestorByPrincipal();
      return result || null;
    }
    // Fallback: find investor by principal
    const investors = await this.actor.getInvestors();
    const currentPrincipal = await this.actor.whoami();
    const currentPrincipalText = currentPrincipal.toString();

    const investor = investors.find(
      (i: any) => i.principal.toString() === currentPrincipalText
    );
    return investor || null;
  }

  async getUserType() {
    if (!this.actor) throw new Error('Backend not initialized');
    try {
      // Try to use the new function if available
      if (this.actor.getUserType) {
        const result = await this.actor.getUserType();
        return result || null;
      }
      throw new Error('getUserType not available');
    } catch (error) {
      // Fallback: check by getting all founders and investors
      const [founders, investors] = await Promise.all([
        this.actor.getFounders(),
        this.actor.getInvestors(),
      ]);

      const currentPrincipal = await this.actor.whoami();
      const currentPrincipalText = currentPrincipal.toString();

      // Check if current user is a founder
      const isFounder = founders.some(
        (founder: any) => founder.principal.toString() === currentPrincipalText
      );

      if (isFounder) return 'Founder';

      // Check if current user is an investor
      const isInvestor = investors.some(
        (investor: any) =>
          investor.principal.toString() === currentPrincipalText
      );

      if (isInvestor) return 'Investor';

      return null;
    }
  }

  async isUserFounder() {
    if (!this.actor) throw new Error('Backend not initialized');
    try {
      if (this.actor.isUserFounder) {
        return await this.actor.isUserFounder();
      }
      throw new Error('isUserFounder not available');
    } catch (error) {
      // Fallback: check by getting all founders
      const founders = await this.actor.getFounders();
      const currentPrincipal = await this.actor.whoami();
      const currentPrincipalText = currentPrincipal.toString();

      return founders.some(
        (founder: any) => founder.principal.toString() === currentPrincipalText
      );
    }
  }

  async isUserInvestor() {
    if (!this.actor) throw new Error('Backend not initialized');
    try {
      if (this.actor.isUserInvestor) {
        return await this.actor.isUserInvestor();
      }
      throw new Error('isUserInvestor not available');
    } catch (error) {
      // Fallback: check by getting all investors
      const investors = await this.actor.getInvestors();
      const currentPrincipal = await this.actor.whoami();
      const currentPrincipalText = currentPrincipal.toString();

      return investors.some(
        (investor: any) =>
          investor.principal.toString() === currentPrincipalText
      );
    }
  }

  async getAllStartups() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getAllStartups();
  }

  async getStartupsPaginated(params: { page: number; limit: number }) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getStartupsPaginated(params);
  }

  async getStartupsCount() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getStartupsCount();
  }

  async getStartupDetails(startupId: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    const result = await this.actor.getStartupDetails(startupId);
    // Handle Motoko optional type: [] means None, [value] means Some(value)
    return result.length > 0 ? result[0] : null;
  }

  async updateStartupStatus(startupId: string, status: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.updateStartupStatus(startupId, status);
  }

  async mintNFTForStartup(
    startupId: string,
    startup: Startup,
    toPrincipal: Principal
  ) {
    if (!this.actor) throw new Error('Backend not initialized');

    const nftAccount: NFTAccount = {
      owner: toPrincipal,
      subaccount: [],
    };

    const metadata: NFTMetadata = {
      tokenUri: `https://plantify.ic0.app/startup/${startupId}`,
      name: [startup.startupName || `Startup ${startupId}`],
      description: [startup.description || 'Plantify active startup NFT'],
      attributes: [
        [
          ['startup_id', startupId],
          ['status', startup.status || 'approved'],
          ['sector', startup.sector || 'Unknown'],
          ['founded_year', startup.foundedYear || 'Unknown'],
          ['funding_goal', startup.fundingGoal || '0'],
          ['company_type', startup.companyType || 'Startup'],
        ],
      ],
      image:
        startup.nftImage && startup.nftImage.length > 0
          ? startup.nftImage
          : startup.companyLogo && startup.companyLogo.length > 0
            ? startup.companyLogo
            : [],
    };

    const mintRequest: MintNFTRequest = {
      startupId: startupId,
      metadata: metadata,
      memo: [`Minted for active startup: ${startup.startupName || startupId}`],
      toAccount: nftAccount,
    };

    return await this.actor.mintNFT(mintRequest);
  }

  // Monthly Report Methods
  async createMonthlyReport(request: MonthlyReportRequest) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.createMonthlyReport(request);
  }

  async updateMonthlyReport(reportId: string, request: MonthlyReportRequest) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.updateMonthlyReport(reportId, request);
  }

  async submitMonthlyReport(reportId: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.submitMonthlyReport(reportId);
  }

  async approveMonthlyReport(reportId: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.approveMonthlyReport(reportId);
  }

  async rejectMonthlyReport(reportId: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.rejectMonthlyReport(reportId);
  }

  async getMonthlyReport(reportId: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getMonthlyReport(reportId);
  }

  async getMonthlyReportsByStartup(startupId: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getMonthlyReportsByStartup(startupId);
  }

  async getAllMonthlyReports() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getAllMonthlyReports();
  }

  async getMonthlyReportStats() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getMonthlyReportStats();
  }

  async getMonthlyReportsByStatus(status: MonthlyReportStatus) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getMonthlyReportsByStatus(status);
  }

  // Voting Methods
  async castVote(request: VoteRequest) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.castVote(request);
  }

  async updateVote(reportId: string, request: VoteRequest) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.updateVote(reportId, request);
  }

  async getVoteSummary(reportId: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getVoteSummary(reportId);
  }

  async getReportVotes(reportId: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getReportVotes(reportId);
  }

  async getVotingStats() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getVotingStats();
  }

  async canInvestorVote(reportId: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.canInvestorVote(reportId);
  }
}

export const backendService = new BackendService();
