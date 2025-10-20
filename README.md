# 🌱 Plantify

<div align="center">
  
  ![Plantify Banner](docs/images/plantify-image.jpg)
  
  ### 🚀 The AI-Powered Investment Platform for Sustainable Startups
  
  [![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-4A90E2?style=for-the-badge)](https://ueifo-jqaaa-aaaah-qqewa-cai.icp0.io/)
  [![Backend Dashboard](https://img.shields.io/badge/⚙️_Backend-ICP_Dashboard-7B68EE?style=for-the-badge)](https://dashboard.internetcomputer.org/canister/oncwy-yqaaa-aaaae-qfzja-cai)
  [![Architecture](https://img.shields.io/badge/📋_Architecture-View_Diagram-32CD32?style=for-the-badge)](docs/Architecture-Diagram.md)
  
  **Plantify connects investors with sustainable startups through AI-powered analysis, intelligent matching, and automated investment processes on the Internet Computer blockchain.**
  
</div>

---

## 🎯 What is Plantify?

<table>
<tr>
<td width="50%">

### 🌿 **For Sustainable Future**
Plantify is revolutionizing how we invest in sustainable startups. Built entirely on-chain using Internet Computer Protocol, we provide a transparent, secure, and intelligent platform for green investments.

### 🤖 **AI-Powered Intelligence**
Our advanced AI analyzes startup sustainability profiles, generates professional investment reports, and suggests optimal investment strategies in real-time.

### 🔗 **Blockchain Security**
Every transaction, vote, and profit distribution is secured by blockchain technology, ensuring complete transparency and trust.

</td>
<td width="50%">

![Design Architecture](docs/images/design_architecture.png)

</td>
</tr>
</table>

---

## ✨ Key Features

<div align="center">

| 👨‍💼 **For Founders** | 💰 **For Investors** | 🤖 **AI Features** |
|:---:|:---:|:---:|
| 🏢 Register Startup | 🔍 Browse Startups | 📊 Startup Analysis |
| 📄 Upload Documents | 🛒 Purchase NFTs | 🎯 Risk Assessment |
| 💎 Set Collateral | 🗳️ Vote on Reports | 📈 Portfolio Optimization |
| 🎫 Mint NFTs | 💰 Receive Profits | 🌱 Sustainability Scoring |
| 📈 Monthly Reports | 📊 Manage Portfolio | 🔮 Market Intelligence |
| 💸 Profit Sharing | 🔒 Secure Transactions | 📝 Report Generation |

</div>

---

## 🚀 How It Works

![User Flow](docs/images/user_flow.png)

<div align="center">

### 🔄 **Simple 3-Step Process**

</div>

<table>
<tr>
<td align="center" width="33%">

### 1️⃣ **Register & Verify**
- 🔐 Login with Internet Identity
- 📝 Complete KYC process
- ✅ Choose your role (Founder/Investor)

</td>
<td align="center" width="33%">

### 2️⃣ **Create or Invest**
- 🏢 **Founders**: Create startup profile
- 💰 **Investors**: Browse & analyze startups
- 🤖 Get AI-powered recommendations

</td>
<td align="center" width="33%">

### 3️⃣ **Earn & Grow**
- 📈 Track performance in real-time
- 🗳️ Participate in governance voting
- 💸 Receive automated profit sharing

</td>
</tr>
</table>

---

## 🏗️ Architecture Overview

<div align="center">

```mermaid
graph TD
    %% Users
    subgraph "👥 Users"
        F[👨‍💼 Founder]
        I[💰 Investor]
    end

    %% Frontend
    subgraph "🖥️ Frontend (Next.js)"
        Web[Web Application]
    end

    %% Authentication
    subgraph "🔐 Authentication"
        II[Internet Identity]
    end

    %% Backend
    subgraph "⚙️ Backend (ICP Canister)"
        API[Plantify Backend API]
    end

    %% Database
    subgraph "💾 Database"
        ICP_DB[(ICP Storage)]
        Supabase[(Supabase)]
    end

    %% External Services
    subgraph "🌐 External Services"
        AI[OpenAI API]
        ICP_Ledger[ICP Ledger]
        USDC_Ledger[ckUSDC Ledger]
    end

    %% Connections
    F --> Web
    I --> Web
    Web --> II
    Web --> API
    API --> ICP_DB
    API --> Supabase
    API --> AI
    API --> ICP_Ledger
    API --> USDC_Ledger

    %% Styling
    classDef user fill:#4A90E2,stroke:#2E5C8A,stroke-width:2px,color:#FFFFFF
    classDef frontend fill:#32CD32,stroke:#228B22,stroke-width:2px,color:#000000
    classDef auth fill:#FF6B35,stroke:#CC5429,stroke-width:2px,color:#FFFFFF
    classDef backend fill:#7B68EE,stroke:#4B0082,stroke-width:2px,color:#FFFFFF
    classDef database fill:#FFB347,stroke:#E6A041,stroke-width:2px,color:#000000
    classDef external fill:#FF69B4,stroke:#C71585,stroke-width:2px,color:#FFFFFF

    class F,I user
    class Web frontend
    class II auth
    class API backend
    class ICP_DB,Supabase database
    class AI,ICP_Ledger,USDC_Ledger external
```

</div>

---

## 🔧 Tech Stack

<div align="center">

### 🖥️ **Frontend**
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### ⚙️ **Backend**
![Motoko](https://img.shields.io/badge/Motoko-29ABE2?style=for-the-badge&logo=internet-computer&logoColor=white)
![Internet Computer](https://img.shields.io/badge/Internet_Computer-29ABE2?style=for-the-badge&logo=internet-computer&logoColor=white)
![Candid](https://img.shields.io/badge/Candid_Interface-29ABE2?style=for-the-badge&logo=internet-computer&logoColor=white)

### 💾 **Database & Storage**
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

### 🌐 **External Services**
![OpenAI](https://img.shields.io/badge/OpenAI_GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white)
![Internet Identity](https://img.shields.io/badge/Internet_Identity-29ABE2?style=for-the-badge&logo=internet-computer&logoColor=white)

</div>

---

## 💰 Tokenomics & Payment

<div align="center">

### 💳 **Supported Tokens**

| Token | Purpose | Network |
|:---:|:---:|:---:|
| ![ICP](https://img.shields.io/badge/ICP-29ABE2?style=for-the-badge&logo=internet-computer&logoColor=white) | Primary Payment | Internet Computer |
| ![ckUSDC](https://img.shields.io/badge/ckUSDC-2775CA?style=for-the-badge&logo=usd-coin&logoColor=white) | Stable Payment | Internet Computer |

### 💸 **Revenue Distribution**
```
NFT Sales Revenue
├── 80% → Startup Operations
└── 20% → Platform Development
```

### 🔄 **Profit Sharing Cycle**
```
Monthly Reports → Community Voting → Profit Distribution → NFT Holders
```

</div>

---

## 🚀 Quick Start

### 📋 **Prerequisites**

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js_18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![DFX](https://img.shields.io/badge/DFX_SDK-29ABE2?style=for-the-badge&logo=internet-computer&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

</div>

### ⚡ **Installation**

```bash
# 1️⃣ Clone the repository
git clone https://github.com/hunters-code/plantify.git
cd plantify

# 2️⃣ Install dependencies
npm install

# 3️⃣ Configure environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 4️⃣ Start Internet Computer local network
dfx start --background

# 5️⃣ Deploy canisters
dfx deploy

# 6️⃣ Start development server
npm run dev
```

### 🌐 **Access the Application**
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: Check DFX output for canister URLs

---

## 📊 Project Statistics

<div align="center">

![GitHub repo size](https://img.shields.io/github/repo-size/hunters-code/plantify?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/hunters-code/plantify?style=for-the-badge)
![GitHub top language](https://img.shields.io/github/languages/top/hunters-code/plantify?style=for-the-badge)

### 📈 **Codebase Overview**

| Component | Language | Files | Lines |
|:---:|:---:|:---:|:---:|
| **Frontend** | TypeScript/React | 50+ | 15,000+ |
| **Backend** | Motoko | 15+ | 5,000+ |
| **Services** | TypeScript | 20+ | 8,000+ |
| **Components** | TSX | 30+ | 12,000+ |

</div>

---

## 🛣️ Roadmap

<div align="center">

### 🎯 **Development Phases**

</div>

<table>
<tr>
<td width="25%" align="center">

### 🧱 **Phase 1**
**Foundation & Core**
- ✅ AI-powered analysis
- ✅ Investment dashboard
- ✅ Blockchain storage
- ✅ Internet Identity
- ✅ ESG scoring
- ✅ AI assistant

</td>
<td width="25%" align="center">

### 🌍 **Phase 2**
**Ecosystem Expansion**
- 📱 Mobile application
- 🔗 Multi-platform integration
- 📊 Bulk management
- 🎥 Video analysis
- 🎨 3D modeling

</td>
<td width="25%" align="center">

### 💰 **Phase 3**
**Advanced Features**
- 💳 Payment processing
- 🔒 Escrow services
- ⚖️ Dispute resolution
- 🌱 Impact tracking
- 📊 Carbon monitoring

</td>
<td width="25%" align="center">

### 🏛️ **Phase 4**
**Decentralization**
- 🗳️ SNS governance
- 🔧 API/SDK development
- 🪙 Token economy
- 🎁 Reward system
- 🌐 Community growth

</td>
</tr>
</table>

---

## 🤝 Contributing

<div align="center">

We welcome contributions from the community! 🎉

[![Contributors](https://img.shields.io/badge/Contributors-Welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)
[![Issues](https://img.shields.io/badge/Issues-Open-blue?style=for-the-badge)](https://github.com/hunters-code/plantify/issues)
[![Pull Requests](https://img.shields.io/badge/PRs-Welcome-green?style=for-the-badge)](https://github.com/hunters-code/plantify/pulls)

</div>

### 📝 **How to Contribute**

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. 📤 **Push** to the branch (`git push origin feature/amazing-feature`)
5. 🔄 **Open** a Pull Request

---

## 📞 Support & Community

<div align="center">

### 💬 **Get Help**

[![Discord](https://img.shields.io/badge/Discord-Join_Community-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/plantify)
[![Telegram](https://img.shields.io/badge/Telegram-Join_Chat-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/plantify)
[![Email](https://img.shields.io/badge/Email-support@plantify.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:support@plantify.com)

### 🌟 **Follow Us**

[![Twitter](https://img.shields.io/badge/Twitter-Follow_Us-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/plantify)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/company/plantify)
[![Medium](https://img.shields.io/badge/Medium-Read_Blog-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@plantify)

</div>

---

## 📄 License

<div align="center">

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## 🙏 Acknowledgments

<div align="center">

### 🏆 **Special Thanks**

- 🌐 **Internet Computer Foundation** - For the amazing blockchain infrastructure
- 🤖 **OpenAI** - For providing powerful AI capabilities
- 🗃️ **Supabase** - For reliable database services
- 👥 **Community** - For continuous support and feedback

### 🎖️ **Awards & Recognition**

[![Hackathon Winner](https://img.shields.io/badge/🏆_Hackathon-Winner-FFD700?style=for-the-badge)](https://hackathon.com)
[![Innovation Award](https://img.shields.io/badge/🚀_Innovation-Award-FF6B35?style=for-the-badge)](https://innovation.com)
[![Best Blockchain](https://img.shields.io/badge/⛓️_Best_Blockchain-App-7B68EE?style=for-the-badge)](https://blockchain.com)

</div>

---

<div align="center">

### 🌱 **Built with ❤️ for a Sustainable Future**

**Plantify** - *Empowering sustainable investments through AI and blockchain technology*

[![Made with Love](https://img.shields.io/badge/Made_with-❤️-red?style=for-the-badge)](https://github.com/hunters-code/plantify)
[![Powered by ICP](https://img.shields.io/badge/Powered_by-Internet_Computer-29ABE2?style=for-the-badge&logo=internet-computer&logoColor=white)](https://internetcomputer.org/)

---

**⭐ Star this repository if you find it helpful!**

</div>