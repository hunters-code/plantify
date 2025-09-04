graph TD
%% Founder Journey Flowchart
subgraph "FOUNDER JOURNEY"
A[Founder Registration] --> B[Document Upload]
B --> C[Business Plan Submission]
C --> D[Financial Projections in ckUSDC]
D --> E[Platform Review Process]
E --> F{Review Result}
F -->|Approved| G[Collateral Assessment]
F -->|Conditional| H[Additional Requirements]
F -->|Rejected| I[Reapply after 6 months]
H --> E

        G --> J[Choose Collateral Payment]
        J --> K{Payment Method}
        K -->|ICP| L[ICP to ckUSDC Conversion]
        K -->|ckUSDC| M[Direct ckUSDC Transfer]
        L --> N[Lock ckUSDC Collateral 36 months]
        M --> N

        N --> O[NFT Creation & Configuration]
        O --> P[Marketplace Listing]
        P --> Q[NFT Sales Begin]

        Q --> R[Receive 80% Funding in ckUSDC]
        R --> S[Monthly Operations Begin]

        %% Monthly Operations Loop
        S --> T[Submit Monthly Report]
        T --> U[Community Voting Period]
        U --> V[AI Analysis Check]
        V --> W{AI Compliance Score}
        W -->|Pass| X{Community Vote Result}
        W -->|Fail| Y[Profit Sharing Withheld]

        X -->|≥50% Approve| Z[Pay Profit Sharing in ckUSDC]
        X -->|<50% Reject| Y

        Z --> AA[Successful Payment]
        Y --> BB[Improve & Resubmit]
        AA --> CC{Month < 36?}
        BB --> CC
        CC -->|Yes| T
        CC -->|No| DD[36 Months Complete]

        DD --> EE[Collateral Released]
        EE --> FF[Founder Journey Complete]
    end

graph TD
%% Investor Journey Flowchart
subgraph "INVESTOR JOURNEY"
A1[Investor Registration] --> B1[Setup IC Wallet]
B1 --> C1[Acquire ICP or ckUSDC]
C1 --> D1[Browse Marketplace]

        D1 --> E1[Select Startup]
        E1 --> F1[Due Diligence Research]
        F1 --> G1[Review Business Plan]
        G1 --> H1[Analyze ckUSDC Projections]
        H1 --> I1{Investment Decision}

        I1 -->|No| D1
        I1 -->|Yes| J1[Choose Payment Method]

        J1 --> K1{Payment Option}
        K1 -->|ICP| L1[ICP to ckUSDC Conversion with Timer]
        K1 -->|ckUSDC| M1[Direct ckUSDC Payment]

        L1 --> N1[Purchase NFT]
        M1 --> N1
        N1 --> O1[Receive NFT Certificate]
        O1 --> P1[Auto-enrolled in Voting]

        %% Monthly Monitoring Loop
        P1 --> Q1[Receive Monthly Report]
        Q1 --> R1[Review Founder Update]
        R1 --> S1[Community Discussion]
        S1 --> T1[Cast Vote: Approve/Reject]

        T1 --> U1[AI Analysis Processing]
        U1 --> V1{AI + Community Decision}
        V1 -->|Approved| W1[Receive ckUSDC Profit Sharing]
        V1 -->|Rejected| X1[No Profit Sharing This Month]

        W1 --> Y1[Update Portfolio Balance]
        X1 --> Y1
        Y1 --> Z1{Investment Period < 36 months?}

        Z1 -->|Yes| Q1
        Z1 -->|No| AA1[36 Months Complete]
        AA1 --> BB1[NFT Unlocked]
        BB1 --> CC1[Final Portfolio Settlement]
        CC1 --> DD1[Investment Complete]
    end

graph TD
%% Combined System Flow
subgraph "PLANTIFY ECOSYSTEM FLOW"
direction TB

        %% Platform Initialization
        START[Platform Launch] --> ADMIN[Platform Administrator Setup]

        %% Startup Onboarding
        ADMIN --> SF[Startup Registration Opens]
        SF --> DOC[Document Verification]
        DOC --> REVIEW[Business Plan Review]
        REVIEW --> APPROVE{Approval Status}

        APPROVE -->|Approved| COLLAT[Collateral Setup]
        APPROVE -->|Rejected| REJECT[Founder Rejection]
        REJECT --> SF

        %% Collateral Management
        COLLAT --> PAYMENT{Founder Payment Choice}
        PAYMENT -->|ICP| CONVERT[Auto-convert to ckUSDC]
        PAYMENT -->|ckUSDC| DIRECT[Direct ckUSDC Lock]
        CONVERT --> LOCK[Lock ckUSDC Collateral]
        DIRECT --> LOCK

        %% NFT Creation
        LOCK --> MINT[NFT Minting Process]
        MINT --> MARKET[List on Marketplace]

        %% Investor Journey
        MARKET --> INV[Investors Browse]
        INV --> RESEARCH[Due Diligence]
        RESEARCH --> BUY{Purchase Decision}
        BUY -->|No| INV
        BUY -->|Yes| PAY{Investor Payment Method}

        PAY -->|ICP| ICONVERT[ICP to ckUSDC Conversion]
        PAY -->|ckUSDC| IDIRECT[Direct ckUSDC Payment]
        ICONVERT --> PURCHASE[NFT Purchase Complete]
        IDIRECT --> PURCHASE

        %% Fund Distribution
        PURCHASE --> FUNDS[Fund Distribution]
        FUNDS --> STARTUP80[80% to Startup in ckUSDC]
        FUNDS --> RESERVE20[20% to Platform Reserve]

        %% Monthly Operations
        STARTUP80 --> OPS[Startup Operations Begin]
        OPS --> REPORT[Monthly Report Submission]
        REPORT --> VOTE[Community Voting]
        VOTE --> AI[AI Analysis Check]

        AI --> DECISION{Final Decision}
        DECISION -->|Approved| PROFIT[ckUSDC Profit Distribution]
        DECISION -->|Rejected| HOLD[Profit Sharing Held]

        PROFIT --> NEXT{Continue Operations?}
        HOLD --> IMPROVE[Founder Improvements]
        IMPROVE --> REPORT

        NEXT -->|Yes| REPORT
        NEXT -->|No| COMPLETE[36 Months Complete]

        COMPLETE --> RELEASE[Collateral Release]
        COMPLETE --> UNLOCK[NFT Unlock]
        RELEASE --> END1[Founder Journey Complete]
        UNLOCK --> END2[Investor Journey Complete]
    end

graph TD
%% Payment Flow Detailed
subgraph "PAYMENT FLOW DETAILS"
direction TB

        %% Collateral Payment Flow
        CF1[Founder Needs Collateral] --> CF2{Has ckUSDC?}
        CF2 -->|Yes| CF3[Direct ckUSDC Transfer]
        CF2 -->|No| CF4[Use ICP Conversion]

        CF4 --> CF5[Check ICP Balance]
        CF5 --> CF6[Display Conversion Rate]
        CF6 --> CF7[Start 60-second Timer]
        CF7 --> CF8{Timer Expired?}
        CF8 -->|Yes| CF6
        CF8 -->|No| CF9[Confirm Conversion]
        CF9 --> CF10[Execute ICP to ckUSDC]
        CF10 --> CF11[Lock ckUSDC Collateral]
        CF3 --> CF11

        %% Investment Payment Flow
        IF1[Investor Wants to Buy NFT] --> IF2{Has ckUSDC?}
        IF2 -->|Yes| IF3[Direct ckUSDC Payment]
        IF2 -->|No| IF4[Use ICP Conversion]

        IF4 --> IF5[Check ICP Balance]
        IF5 --> IF6[Display Conversion Rate & NFT Cost]
        IF6 --> IF7[Start 60-second Timer]
        IF7 --> IF8{Timer Expired?}
        IF8 -->|Yes| IF6
        IF8 -->|No| IF9[Confirm Purchase]
        IF9 --> IF10[Execute ICP to ckUSDC]
        IF10 --> IF11[Purchase NFT with ckUSDC]
        IF3 --> IF11

        %% Profit Sharing Flow
        PF1[Monthly Profit Due] --> PF2{Founder Has ckUSDC?}
        PF2 -->|Yes| PF3[Transfer ckUSDC to Platform]
        PF2 -->|No| PF4[Auto-deduct from Collateral]

        PF3 --> PF5[Platform Distributes to NFT Holders]
        PF4 --> PF5
        PF5 --> PF6[ckUSDC Sent to Investor Wallets]

        %% Withdrawal Flow
        WF1[User Requests Withdrawal] --> WF2[Check ckUSDC Balance]
        WF2 --> WF3[Verify Destination Address]
        WF3 --> WF4[Calculate Fees]
        WF4 --> WF5[User Confirms Transaction]
        WF5 --> WF6[Execute ckUSDC Transfer]
        WF6 --> WF7[Update User Balance]
    end
