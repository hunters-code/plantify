import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory } from '../declarations/plantify_backend';

export interface BackendActor {
  registerFounder: (request: any) => Promise<any>;
  registerInvestor: (request: any) => Promise<any>;
  createStartup: (request: any) => Promise<any>;
  whoami: () => Promise<Principal>;
  getEnvironmentConfig: () => Promise<any>;
  getEnvironment: () => Promise<string>;
  getICPBalance: (account: any) => Promise<any>;
  getCkUSDCBalance: (account: any) => Promise<any>;
  transferICP: (toAccount: any, amount: number, memo?: string) => Promise<any>;
  transferCkUSDC: (toAccount: any, amount: number, memo?: string) => Promise<any>;
  initializeCollateral: (startupId: string, requiredAmount: number, tokenType: string) => Promise<any>;
  topUpCollateral: (request: any) => Promise<any>;
  getCollateralStatus: (startupId: string) => Promise<any>;
  getCollateralProgress: (startupId: string) => Promise<any>;
  getAllCollateralInfo: () => Promise<any>;
  mintNFT: (request: any) => Promise<any>;
  getNFTInfo: (tokenId: number) => Promise<any>;
  getNFTsByStartup: (startupId: string) => Promise<any>;
  getAllNFTs: () => Promise<any>;
  getNFTStats: () => Promise<any>;
}

export class BackendService {
  private actor: BackendActor | null = null;
  private agent: HttpAgent | null = null;

  async initialize(identity: any) {
    const canisterId = 'a5ptu-ryaaa-aaaai-q32cq-cai'; // Mainnet canister ID from dfx.json
    
    this.agent = new HttpAgent({
      host: 'https://ic0.app',
      identity: identity,
    });

    // For mainnet, we don't need to fetch the root key
    if (process.env.NODE_ENV !== 'production') {
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
    console.log('Backend service sending request:', request);
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

  async createStartup(request: {
    startupName: string;
    sector: string;
    foundedYear: string;
    description: string;
    website: string;
    location: string;
    companyType: string;
    companyLogo?: string;
    problemStatement: string;
    solution: string;
    targetMarket: string;
    competitiveAdvantage: string;
    marketingStrategy: string;
    operationalProcess: string;
    founderBackground: string;
    teamMembers: any[];
    advisors: string;
    fundingGoal: string;
    nftPrice: string;
    periodicProfitSharing: string;
    revenueModel: string;
    monthlyRevenue: string;
    monthlyExpenses: string;
    useOfFunds: string;
    businessPlan?: string;
    financialProjections?: string;
    legalDocuments?: string;
    status: string;
  }) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.createStartup(request);
  }

  async whoami() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.whoami();
  }

  async getEnvironmentConfig() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getEnvironmentConfig();
  }

  async getICPBalance(account: { owner: Principal; subaccount?: Uint8Array }) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getICPBalance(account);
  }

  async getCkUSDCBalance(account: { owner: Principal; subaccount?: Uint8Array }) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getCkUSDCBalance(account);
  }

  async initializeCollateral(startupId: string, requiredAmount: number, tokenType: string) {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.initializeCollateral(startupId, requiredAmount, tokenType);
  }

  async topUpCollateral(request: {
    startupId: string;
    amount: number;
    tokenType: string;
    memo?: string;
  }) {
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

  async mintNFT(request: {
    startupId: string;
    toAccount: { owner: Principal; subaccount?: Uint8Array };
    metadata: {
      tokenUri: string;
      name?: string;
      description?: string;
      image?: string;
      attributes?: [string, string][];
    };
    memo?: string;
  }) {
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

  async getNFTStats() {
    if (!this.actor) throw new Error('Backend not initialized');
    return await this.actor.getNFTStats();
  }
}

export const backendService = new BackendService();
