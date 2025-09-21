export const idlFactory = ({ IDL }) => {
  const Result_17 = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  const TeamMember = IDL.Record({
    'id' : IDL.Nat,
    'linkedin' : IDL.Text,
    'background' : IDL.Text,
    'name' : IDL.Text,
    'role' : IDL.Text,
    'email' : IDL.Text,
    'isFounder' : IDL.Bool,
    'photo' : IDL.Opt(IDL.Text),
  });
  const StartupCreationRequest = IDL.Record({
    'status' : IDL.Text,
    'periodicProfitSharing' : IDL.Text,
    'foundedYear' : IDL.Text,
    'competitiveAdvantage' : IDL.Text,
    'businessPlan' : IDL.Opt(IDL.Text),
    'description' : IDL.Text,
    'sector' : IDL.Text,
    'useOfFunds' : IDL.Text,
    'website' : IDL.Text,
    'teamMembers' : IDL.Vec(TeamMember),
    'targetMarket' : IDL.Text,
    'revenueModel' : IDL.Text,
    'solution' : IDL.Text,
    'companyLogo' : IDL.Opt(IDL.Text),
    'companyType' : IDL.Text,
    'financialProjections' : IDL.Opt(IDL.Text),
    'marketingStrategy' : IDL.Text,
    'startupName' : IDL.Text,
    'fundingGoal' : IDL.Text,
    'legalDocuments' : IDL.Opt(IDL.Text),
    'monthlyRevenue' : IDL.Text,
    'operationalProcess' : IDL.Text,
    'companyImages' : IDL.Vec(IDL.Text),
    'nftImage' : IDL.Opt(IDL.Text),
    'advisors' : IDL.Text,
    'nftPrice' : IDL.Text,
    'location' : IDL.Text,
    'monthlyExpenses' : IDL.Text,
    'problemStatement' : IDL.Text,
    'founderBackground' : IDL.Text,
  });
  const Time = IDL.Int;
  const Startup = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Text,
    'periodicProfitSharing' : IDL.Text,
    'foundedYear' : IDL.Text,
    'competitiveAdvantage' : IDL.Text,
    'createdAt' : Time,
    'businessPlan' : IDL.Opt(IDL.Text),
    'description' : IDL.Text,
    'sector' : IDL.Text,
    'useOfFunds' : IDL.Text,
    'website' : IDL.Text,
    'teamMembers' : IDL.Vec(TeamMember),
    'targetMarket' : IDL.Text,
    'updatedAt' : Time,
    'revenueModel' : IDL.Text,
    'solution' : IDL.Text,
    'companyLogo' : IDL.Opt(IDL.Text),
    'founderId' : IDL.Text,
    'companyType' : IDL.Text,
    'financialProjections' : IDL.Opt(IDL.Text),
    'marketingStrategy' : IDL.Text,
    'startupName' : IDL.Text,
    'fundingGoal' : IDL.Text,
    'legalDocuments' : IDL.Opt(IDL.Text),
    'monthlyRevenue' : IDL.Text,
    'operationalProcess' : IDL.Text,
    'companyImages' : IDL.Vec(IDL.Text),
    'nftImage' : IDL.Opt(IDL.Text),
    'advisors' : IDL.Text,
    'nftPrice' : IDL.Text,
    'location' : IDL.Text,
    'monthlyExpenses' : IDL.Text,
    'problemStatement' : IDL.Text,
    'founderBackground' : IDL.Text,
  });
  const Result_16 = IDL.Variant({ 'ok' : Startup, 'err' : IDL.Text });
  const CollateralStatus = IDL.Variant({
    'Active' : IDL.Null,
    'Released' : IDL.Null,
    'Locked' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const CollateralTopUp = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Text,
    'startupId' : IDL.Text,
    'timestamp' : Time,
    'tokenType' : IDL.Text,
    'amount' : IDL.Nat,
    'transactionId' : IDL.Opt(IDL.Text),
  });
  const CollateralInfo = IDL.Record({
    'status' : CollateralStatus,
    'topUpHistory' : IDL.Vec(CollateralTopUp),
    'startupId' : IDL.Text,
    'lockEndTime' : IDL.Opt(Time),
    'createdAt' : Time,
    'updatedAt' : Time,
    'tokenType' : IDL.Text,
    'currentAmount' : IDL.Nat,
    'requiredAmount' : IDL.Nat,
    'lockStartTime' : IDL.Opt(Time),
  });
  const NFTAccount = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const NFTMetadata = IDL.Record({
    'tokenUri' : IDL.Text,
    'name' : IDL.Opt(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'attributes' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))),
    'image' : IDL.Opt(IDL.Text),
  });
  const NFTInfo = IDL.Record({
    'tokenId' : IDL.Nat,
    'startupId' : IDL.Text,
    'owner' : NFTAccount,
    'metadata' : NFTMetadata,
    'mintedAt' : Time,
  });
  const NFTPurchaseInfo = IDL.Record({
    'id' : IDL.Text,
    'status' : IDL.Text,
    'tokenId' : IDL.Nat,
    'startupId' : IDL.Text,
    'investorId' : IDL.Text,
    'timestamp' : Time,
    'change' : IDL.Nat,
    'amount' : IDL.Nat,
    'nftPrice' : IDL.Nat,
    'transactionId' : IDL.Text,
  });
  const TransferAccount = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const BalanceResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'balance' : IDL.Nat,
      'account' : TransferAccount,
      'tokenType' : IDL.Text,
    }),
  });
  const TokenConfig = IDL.Record({
    'fee' : IDL.Nat,
    'decimals' : IDL.Nat8,
    'ledgerId' : IDL.Text,
    'name' : IDL.Text,
    'symbol' : IDL.Text,
    'canisterId' : IDL.Text,
  });
  const CollateralProgress = IDL.Record({
    'status' : IDL.Text,
    'isFullyPaid' : IDL.Bool,
    'tokenType' : IDL.Text,
    'currentAmount' : IDL.Nat,
    'requiredAmount' : IDL.Nat,
    'percentage' : IDL.Nat,
  });
  const CollateralProgressResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : CollateralProgress,
  });
  const Result_15 = IDL.Variant({ 'ok' : CollateralInfo, 'err' : IDL.Text });
  const Result_14 = IDL.Variant({
    'ok' : IDL.Vec(CollateralTopUp),
    'err' : IDL.Text,
  });
  const NFTConfig = IDL.Record({
    'permittedDrift' : IDL.Nat,
    'logo' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'maxQueryBatchSize' : IDL.Opt(IDL.Nat),
    'description' : IDL.Text,
    'supplyCap' : IDL.Opt(IDL.Nat),
    'maxTakeValue' : IDL.Opt(IDL.Nat),
    'atomicBatchTransfers' : IDL.Opt(IDL.Bool),
    'maxUpdateBatchSize' : IDL.Opt(IDL.Nat),
    'defaultTakeValue' : IDL.Opt(IDL.Nat),
    'maxMemoSize' : IDL.Nat,
    'symbol' : IDL.Text,
    'txWindow' : IDL.Nat,
    'canisterId' : IDL.Text,
  });
  const EnvironmentConfig = IDL.Record({
    'nftToken' : NFTConfig,
    'ckUSDCToken' : TokenConfig,
    'environment' : IDL.Text,
    'plantifyAccount' : IDL.Text,
    'useTestTokens' : IDL.Bool,
    'icpToken' : TokenConfig,
  });
  const Founder = IDL.Record({
    'id' : IDL.Text,
    'linkedIn' : IDL.Text,
    'principal' : IDL.Principal,
    'createdAt' : Time,
    'fullName' : IDL.Text,
    'email' : IDL.Text,
    'experience' : IDL.Text,
    'updatedAt' : Time,
    'idNumber' : IDL.Text,
    'expertise' : IDL.Text,
    'taxNumber' : IDL.Text,
    'address' : IDL.Text,
    'phone' : IDL.Text,
    'previousBusinesses' : IDL.Text,
  });
  const NFTPurchaseHistory = IDL.Record({
    'totalNFTs' : IDL.Nat,
    'totalPurchases' : IDL.Nat,
    'totalSpent' : IDL.Nat,
    'purchases' : IDL.Vec(NFTPurchaseInfo),
  });
  const Result_7 = IDL.Variant({ 'ok' : NFTPurchaseHistory, 'err' : IDL.Text });
  const Investor = IDL.Record({
    'id' : IDL.Text,
    'principal' : IDL.Principal,
    'country' : IDL.Text,
    'riskTolerance' : IDL.Text,
    'monthlyBudget' : IDL.Text,
    'city' : IDL.Text,
    'createdAt' : Time,
    'fullName' : IDL.Text,
    'email' : IDL.Text,
    'updatedAt' : Time,
    'investmentGoals' : IDL.Text,
    'availableCapital' : IDL.Text,
    'phone' : IDL.Text,
    'investmentExperience' : IDL.Text,
  });
  const NFTBalanceResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({ 'balance' : IDL.Nat, 'account' : NFTAccount }),
  });
  const Result_13 = IDL.Variant({
    'ok' : NFTBalanceResponse,
    'err' : IDL.Text,
  });
  const Result_12 = IDL.Variant({ 'ok' : NFTInfo, 'err' : IDL.Text });
  const NFTOwnerResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'tokenId' : IDL.Nat,
      'owner' : IDL.Opt(NFTAccount),
    }),
  });
  const Result_11 = IDL.Variant({ 'ok' : NFTOwnerResponse, 'err' : IDL.Text });
  const Result_10 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result_9 = IDL.Variant({ 'ok' : IDL.Vec(NFTInfo), 'err' : IDL.Text });
  const Result_8 = IDL.Variant({ 'ok' : NFTPurchaseInfo, 'err' : IDL.Text });
  const NFTPurchaseStats = IDL.Record({
    'totalNFTsSold' : IDL.Nat,
    'totalPurchases' : IDL.Nat,
    'topStartup' : IDL.Opt(IDL.Text),
    'averagePurchaseAmount' : IDL.Nat,
    'totalRevenue' : IDL.Nat,
  });
  const TokenInfoResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'fee' : IDL.Nat,
      'decimals' : IDL.Nat8,
      'name' : IDL.Text,
      'tokenType' : IDL.Text,
      'symbol' : IDL.Text,
    }),
  });
  const Result_5 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const MintNFTRequest = IDL.Record({
    'startupId' : IDL.Text,
    'metadata' : NFTMetadata,
    'memo' : IDL.Opt(IDL.Text),
    'toAccount' : NFTAccount,
  });
  const MintNFTResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'tokenId' : IDL.Nat,
      'startupId' : IDL.Text,
      'transactionId' : IDL.Opt(IDL.Text),
    }),
  });
  const Result_6 = IDL.Variant({ 'ok' : MintNFTResponse, 'err' : IDL.Text });
  const NFTPurchaseRequest = IDL.Record({
    'startupId' : IDL.Text,
    'memo' : IDL.Opt(IDL.Text),
    'investorId' : IDL.Text,
    'amount' : IDL.Nat,
  });
  const NFTPurchaseResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'tokenId' : IDL.Nat,
      'startupId' : IDL.Text,
      'investorId' : IDL.Text,
      'change' : IDL.Nat,
      'amount' : IDL.Nat,
      'nftPrice' : IDL.Nat,
      'transactionId' : IDL.Text,
    }),
  });
  const Result_4 = IDL.Variant({
    'ok' : NFTPurchaseResponse,
    'err' : IDL.Text,
  });
  const FounderRegistrationRequest = IDL.Record({
    'linkedIn' : IDL.Text,
    'fullName' : IDL.Text,
    'email' : IDL.Text,
    'experience' : IDL.Text,
    'idNumber' : IDL.Text,
    'expertise' : IDL.Text,
    'taxNumber' : IDL.Text,
    'address' : IDL.Text,
    'phone' : IDL.Text,
    'previousBusinesses' : IDL.Text,
  });
  const Result_3 = IDL.Variant({ 'ok' : Founder, 'err' : IDL.Text });
  const InvestorRegistrationRequest = IDL.Record({
    'country' : IDL.Text,
    'riskTolerance' : IDL.Text,
    'monthlyBudget' : IDL.Text,
    'city' : IDL.Text,
    'fullName' : IDL.Text,
    'email' : IDL.Text,
    'investmentGoals' : IDL.Text,
    'availableCapital' : IDL.Text,
    'phone' : IDL.Text,
    'investmentExperience' : IDL.Text,
  });
  const Result_2 = IDL.Variant({ 'ok' : Investor, 'err' : IDL.Text });
  const TopUpRequest = IDL.Record({
    'startupId' : IDL.Text,
    'memo' : IDL.Opt(IDL.Text),
    'tokenType' : IDL.Text,
    'amount' : IDL.Nat,
  });
  const TopUpResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'remainingAmount' : IDL.Nat,
      'newTotal' : IDL.Nat,
      'isFullyPaid' : IDL.Bool,
      'tokenType' : IDL.Text,
      'amount' : IDL.Nat,
      'topUpId' : IDL.Text,
      'transactionId' : IDL.Text,
    }),
  });
  const Result_1 = IDL.Variant({ 'ok' : TopUpResponse, 'err' : IDL.Text });
  const TransferResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'blockIndex' : IDL.Nat,
      'tokenType' : IDL.Text,
      'toAccount' : TransferAccount,
      'amount' : IDL.Nat,
      'transactionId' : IDL.Text,
    }),
  });
  const TransferNFTRequest = IDL.Record({
    'tokenId' : IDL.Nat,
    'memo' : IDL.Opt(IDL.Text),
    'toAccount' : NFTAccount,
  });
  const TransferNFTResponse = IDL.Variant({
    'Error' : IDL.Text,
    'Success' : IDL.Record({
      'tokenId' : IDL.Nat,
      'transactionId' : IDL.Opt(IDL.Text),
    }),
  });
  const Result = IDL.Variant({ 'ok' : TransferNFTResponse, 'err' : IDL.Text });
  const TransferArgs = IDL.Record({
    'memo' : IDL.Opt(IDL.Text),
    'tokenType' : IDL.Text,
    'toAccount' : TransferAccount,
    'amount' : IDL.Nat,
  });
  return IDL.Service({
    'calculateRequiredCollateral' : IDL.Func(
        [IDL.Nat, IDL.Text],
        [IDL.Nat],
        [],
      ),
    'canMintNFT' : IDL.Func([IDL.Text], [Result_17], []),
    'canPurchaseNFT' : IDL.Func([IDL.Text, IDL.Text], [Result_17], []),
    'createStartup' : IDL.Func([StartupCreationRequest], [Result_16], []),
    'createStartupForFounder' : IDL.Func(
        [IDL.Text, StartupCreationRequest],
        [Result_16],
        [],
      ),
    'getAllCollateralInfo' : IDL.Func([], [IDL.Vec(CollateralInfo)], []),
    'getAllNFTs' : IDL.Func([], [IDL.Vec(NFTInfo)], []),
    'getAllPurchases' : IDL.Func([], [IDL.Vec(NFTPurchaseInfo)], []),
    'getAllStartups' : IDL.Func([], [IDL.Vec(Startup)], []),
    'getBalance' : IDL.Func([TransferAccount, IDL.Text], [BalanceResponse], []),
    'getCkUSDCBalance' : IDL.Func([TransferAccount], [BalanceResponse], []),
    'getCkUSDCTokenConfig' : IDL.Func([], [TokenConfig], []),
    'getCollateralProgress' : IDL.Func(
        [IDL.Text],
        [CollateralProgressResponse],
        [],
      ),
    'getCollateralStatus' : IDL.Func([IDL.Text], [Result_15], []),
    'getCollateralTopUpHistory' : IDL.Func([IDL.Text], [Result_14], []),
    'getCollectionInfo' : IDL.Func([], [NFTConfig], []),
    'getEnvironment' : IDL.Func([], [IDL.Text], []),
    'getEnvironmentConfig' : IDL.Func([], [EnvironmentConfig], []),
    'getFounders' : IDL.Func([], [IDL.Vec(Founder)], []),
    'getICPBalance' : IDL.Func([TransferAccount], [BalanceResponse], []),
    'getICPTokenConfig' : IDL.Func([], [TokenConfig], []),
    'getInvestorPurchaseHistory' : IDL.Func([IDL.Text], [Result_7], []),
    'getInvestors' : IDL.Func([], [IDL.Vec(Investor)], []),
    'getNFTBalance' : IDL.Func([NFTAccount], [Result_13], []),
    'getNFTInfo' : IDL.Func([IDL.Nat], [Result_12], []),
    'getNFTOwner' : IDL.Func([IDL.Nat], [Result_11], []),
    'getNFTPrice' : IDL.Func([IDL.Text], [Result_10], []),
    'getNFTStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'totalSupply' : IDL.Nat,
            'totalStartups' : IDL.Nat,
            'nextTokenId' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getNFTsByStartup' : IDL.Func([IDL.Text], [Result_9], []),
    'getPlantifyAccount' : IDL.Func([], [IDL.Text], []),
    'getPurchaseInfo' : IDL.Func([IDL.Text], [Result_8], []),
    'getPurchaseStats' : IDL.Func([], [NFTPurchaseStats], []),
    'getStartupDetails' : IDL.Func([IDL.Text], [IDL.Opt(Startup)], []),
    'getStartupPurchaseHistory' : IDL.Func([IDL.Text], [Result_7], []),
    'getTokenCanisterId' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], []),
    'getTokenInfo' : IDL.Func([IDL.Text], [TokenInfoResponse], []),
    'initializeCollateral' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Text],
        [Result_5],
        [],
      ),
    'isUsingTestTokens' : IDL.Func([], [IDL.Bool], []),
    'mintNFT' : IDL.Func([MintNFTRequest], [Result_6], []),
    'mintNFTForStartup' : IDL.Func([IDL.Text], [Result_5], []),
    'purchaseNFT' : IDL.Func([NFTPurchaseRequest], [Result_4], []),
    'registerFounder' : IDL.Func([FounderRegistrationRequest], [Result_3], []),
    'registerInvestor' : IDL.Func(
        [InvestorRegistrationRequest],
        [Result_2],
        [],
      ),
    'topUpCollateral' : IDL.Func([TopUpRequest], [Result_1], []),
    'transferCkUSDC' : IDL.Func(
        [TransferAccount, IDL.Nat, IDL.Opt(IDL.Text)],
        [TransferResponse],
        [],
      ),
    'transferICP' : IDL.Func(
        [TransferAccount, IDL.Nat, IDL.Opt(IDL.Text)],
        [TransferResponse],
        [],
      ),
    'transferNFT' : IDL.Func([TransferNFTRequest], [Result], []),
    'transferTokens' : IDL.Func([TransferArgs], [TransferResponse], []),
    'updateStartupStatus' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'whoami' : IDL.Func([], [IDL.Principal], []),
  });
};
export const init = ({ IDL }) => { return []; };
