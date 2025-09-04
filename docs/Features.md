# Plantify - Core Features Specifications

## Actors & Roles in Plantify

### 1. Founder/Startup Owner

- Mendaftarkan startup ke platform
- Upload dokumen dan business plan
- Menyetor collateral ckUSDC (dari ICP atau langsung ckUSDC)
- Submit laporan progress bulanan
- Melakukan profit sharing payments dalam ckUSDC
- Berkomunikasi dengan investor community

### 2. Investor/NFT Holder

- Browse dan research startup opportunities
- Purchase NFT dengan ckUSDC (dari ICP atau langsung ckUSDC)
- Vote pada monthly progress reports
- Menerima profit sharing payments dalam ckUSDC
- Berpartisipasi dalam community discussions
- Monitor portfolio performance

### 3. Platform Administrator

- Review dan approve startup registrations
- Moderate community discussions
- Handle dispute resolution
- Manage platform parameters dan settings
- Oversee platform treasury dan reserves
- Ensure compliance dengan regulations
- Process founder fund withdrawal approvals
- Handle all internal platform operations

### 4. System/Smart Contract

- Execute automatic transactions dalam ckUSDC
- Execute real-time ICP to ckUSDC conversions
- Enforce platform rules dan deadlines
- Manage ckUSDC collateral locks dan deductions
- Distribute ckUSDC profit sharing payments
- Track voting results dan governance
- Maintain transparent ledger

---

## Core Features

## 1. Startup Registration System

### Functionality Overview

Complete onboarding system untuk founders register startup mereka dengan document upload, business plan submission, dan verification process.

### UI Description

Multi-step wizard interface dengan progress indicator menunjukkan 6 tahap: Documents, Business Plan, Financials, Collateral, Review, dan Submit. Setiap step memiliki form fields yang relevant dengan real-time validation dan auto-save functionality. Interface menggunakan drag-and-drop file upload dengan preview capability dan progress bars untuk large files.

### User Flow

1. Founder creates account dan connects wallet
2. Fills basic startup information dan sector selection
3. Uploads required legal documents (Akta, SIUP, NPWP, KTP)
4. Completes comprehensive business plan dengan problem/solution description
5. Enters financial projections untuk 36 months
6. Reviews collateral requirements berdasarkan projections
7. Submits application untuk platform review
8. Waits untuk admin approval/rejection dengan feedback

### Required Data

- **Basic Info**: Startup name, founder name, company type, establishment date, sector
- **Contact**: Email, phone, address, website, social media
- **Legal Documents**: Akta pendirian, SIUP, NPWP perusahaan, NPWP founder, KTP founder
- **Business Plan**: Problem statement, solution description, target market, competitive analysis, marketing strategy
- **Team**: Founder background, key team members, advisors
- **Financials**: Revenue projections dalam ckUSDC (monthly untuk 36 months), cost breakdown, profit margins, break-even analysis
- **Funding**: Total ckUSDC funding required, use of funds, ckUSDC profit sharing commitment percentage
- **Operations**: Location, facilities, equipment needed, supply chain, operational processes

---

## 2. ckUSDC Collateral Management

### Functionality Overview

Smart contract system untuk manage dan lock founder collateral dalam ckUSDC dengan support untuk ICP auto-conversion atau direct ckUSDC deposit, automatic monitoring dan deduction capabilities untuk stable value preservation.

### UI Description

Dashboard interface menampilkan collateral requirements dalam ckUSDC dengan dual payment options. Real-time ICP to USD conversion display dengan countdown timer (30-60 seconds) untuk ICP users. Progress bars menunjukkan remaining lock period dan balance after deductions. Alert system untuk upcoming payment deadlines dan automatic notifications untuk any collateral deductions. Transaction history table showing original payment method (ICP converted atau direct ckUSDC) dengan searchable dan filterable records.

### User Flow

1. System calculates required ckUSDC collateral berdasarkan profit sharing commitment
2. Founder views collateral requirements dengan two payment options:
   - Option A: Pay dengan ICP (with real-time conversion rate dan countdown timer)
   - Option B: Pay directly dengan ckUSDC (no conversion needed)
3. If ICP selected: System displays current ICP/USD rate dengan countdown timer, founder confirms conversion
4. If ckUSDC selected: Founder proceeds directly tanpa conversion
5. System verifies payment dan locks ckUSDC collateral untuk 36 months
6. Monthly monitoring untuk ckUSDC profit sharing payments
7. Auto-deduction dari ckUSDC collateral jika payment missed >7 days
8. Real-time ckUSDC balance updates dan notifications ke founder
9. Complete release setelah 36 months dan all obligations met dalam ckUSDC

### Required Data

- **Collateral Requirements**: Required ckUSDC amount, calculation basis, lock duration
- **Payment Options**: ICP conversion option dengan rate display, direct ckUSDC option
- **Real-time Conversion**: Current ICP/USD rate, countdown timer duration, rate refresh intervals
- **Collateral Lock**: Founder wallet address, locked ckUSDC amount, original payment method (ICP/ckUSDC), conversion rate used, lock timestamp, release date
- **Payment Tracking**: Monthly ckUSDC profit sharing amounts, payment dates, late payment flags, deduction amounts
- **Balance Management**: Current locked ckUSDC balance, total deductions, remaining balance, transaction history
- **Notifications**: Payment reminders, deduction alerts, balance warnings, conversion confirmations, release confirmations

---

## 3. NFT Creation & Minting

### Functionality Overview

Automated system untuk generate unique NFTs yang represent profit sharing rights dalam specific startup dengan metadata dan smart contract integration.

### UI Description

Administrative interface untuk NFT configuration dengan preview functionality. Displays calculated values untuk total supply, individual pricing, dan expected returns. Batch processing interface untuk minting multiple NFTs efficiently dengan progress tracking. NFT gallery view dengan metadata preview dan validation checks before final minting.

### User Flow

1. Platform admin reviews approved startup application
2. System calculates optimal NFT supply berdasarkan funding target
3. Admin configures NFT parameters (supply, price, metadata)
4. System generates unique metadata untuk each NFT dalam collection
5. Batch minting process creates all NFTs untuk startup
6. NFTs published ke marketplace dengan availability status
7. Real-time tracking NFT sales dan remaining supply
8. Automatic updates ke startup dashboard dengan sales progress

### Required Data

- **NFT Configuration**: Total supply, individual ckUSDC price, ckUSDC profit sharing per NFT, metadata template
- **Startup Reference**: Startup ID, name, sector, founder info, business description
- **Financial Data**: Monthly ckUSDC return amount, total investment period, expected ROI dalam ckUSDC
- **Currency Data**: Original ICP amounts, ckUSDC conversion rates, conversion timestamps, total ckUSDC value
- **Metadata**: NFT name format, description template, image/logo, attributes (sector, risk, ckUSDC returns)
- **Smart Contract**: Minting parameters, ownership rules, transfer restrictions, ckUSDC payment settings
- **Marketplace**: ckUSDC listing price, availability status, featured placement, search tags

---

## 4. ckUSDC NFT Marketplace

### Functionality Overview

Comprehensive marketplace untuk investors browse, research, dan purchase startup NFTs dengan ckUSDC pricing dan support untuk ICP auto-conversion atau direct ckUSDC payment dengan detailed information dan filtering capabilities.

### UI Description

Grid layout marketplace dengan card-based startup displays featuring ckUSDC prices, key metrics, dan quick action buttons. Advanced filtering sidebar dengan ckUSDC-based criteria selection dan real-time result updates. Detailed startup pages dengan comprehensive information dalam ckUSDC values, founder profiles, financial projections. Streamlined purchase flow dengan dual payment options: ICP conversion (dengan real-time rate dan countdown timer) atau direct ckUSDC payment, wallet integration, dan transaction confirmation.

### User Flow

1. Investor browses marketplace homepage dengan featured startups (all prices dalam ckUSDC)
2. Uses filters untuk narrow down options by sector, ckUSDC price, returns, risk
3. Clicks pada startup card untuk view detailed information dengan ckUSDC metrics
4. Reviews business plan, financials dalam ckUSDC, founder background, community sentiment
5. Selects number of NFTs untuk purchase dengan total ckUSDC cost displayed
6. Choose payment method:
   - Option A: Pay dengan ICP (shows real-time ICP/USD rate dengan countdown timer)
   - Option B: Pay directly dengan ckUSDC (no conversion needed)
7. If ICP selected: Reviews conversion details dan confirms transaction
8. If ckUSDC selected: Proceeds directly ke payment confirmation
9. Receives NFT dalam wallet dengan automatic enrollment dalam voting
10. Gets access ke startup dashboard untuk monitoring progress dalam ckUSDC

### Required Data

- **Startup Listings**: Name, sector, ckUSDC price range, available NFTs, monthly ckUSDC returns, risk level
- **Payment Options**: ICP conversion option dengan rate display, direct ckUSDC option, total costs calculation
- **Real-time Conversion**: Current ICP/USD rate, countdown timer, rate refresh intervals, slippage protection
- **Search Filters**: Sector categories, ckUSDC price range, ckUSDC return range, risk levels, availability percentage
- **Startup Details**: Complete business plan, ckUSDC financial projections, founder profiles, track record
- **Community Data**: Ratings, reviews, discussion threads, voting history, investor count
- **Transaction Data**: Purchase history dalam ckUSDC, original payment method (ICP/ckUSDC), conversion records, confirmation receipts
- **Analytics**: View counts, favorite lists, conversion rates, popular searches, trending startups dengan ckUSDC metrics

---

## 5. Non-Transferable NFT Lock

### Functionality Overview

System untuk lock NFTs dan prevent transfers selama investment period untuk maintain community stability dan ensure committed long-term investors.

### UI Description

Clear visual indicators pada NFT cards dan detailed pages showing lock status dengan countdown timer ke unlock date. Information panels explaining non-transferability dengan reasons dan benefits. Portfolio view dengan locked status untuk each NFT dan projected unlock timeline. Educational tooltips dan help sections untuk user understanding.

### User Flow

1. Investor purchases NFT dengan clear understanding of lock period
2. NFT automatically locked upon purchase confirmation
3. Wallet shows NFT dengan lock indicator dan countdown
4. Platform prevents any transfer attempts dengan clear error messages
5. Lock status visible dalam portfolio dengan remaining time
6. Educational content explains benefits dari non-transferable model
7. Automatic unlock setelah 36 months investment period complete

### Required Data

- **Lock Configuration**: Lock duration (36 months), lock start date, projected unlock date
- **NFT Status**: Current lock status, remaining lock time, unlock conditions
- **Transfer Prevention**: Smart contract restrictions, error message templates, user education content
- **Portfolio Display**: Lock indicators, countdown timers, unlock projections, historical locks
- **User Education**: FAQ content, benefit explanations, community stability messaging

---

## 6. ckUSDC Fund Distribution System

### Functionality Overview

Automatic distribution dana dari NFT sales dalam ckUSDC dengan predetermined allocations ke startup operations dan platform reserves. System handles both ICP conversions dan direct ckUSDC payments untuk seamless fund management.

### UI Description

Real-time distribution dashboard showing ckUSDC fund flow dengan visual representations dari allocation percentages. Payment method indicators showing original payment sources (ICP converted/direct ckUSDC). Progress tracking untuk fund releases dengan milestone indicators. Transparent ledger display untuk all fund movements dalam ckUSDC dengan timestamps dan transaction hashes. Automated reporting untuk both founders dan investors tentang ckUSDC fund status dengan payment method breakdown.

### User Flow

1. NFT sales generate revenue dari multiple payment methods (ICP/ckUSDC)
2. System aggregates all payments dalam ckUSDC (ICP payments already converted during purchase)
3. System automatically splits total ckUSDC funds: 80% startup, 20% platform reserve
4. Startup portion (80% dalam ckUSDC) transferred ke founder's designated wallet
5. Reserve portion (20% dalam ckUSDC) locked dalam platform treasury smart contract
6. Real-time updates ke founder dashboard showing available ckUSDC operational funds
7. Platform maintains transparent record dari all ckUSDC fund movements
8. Periodic reporting ke investors tentang ckUSDC fund utilization dan source breakdown

### Required Data

- **Fund Sources**: ICP payment amounts converted, direct ckUSDC payments, total aggregated ckUSDC
- **Fund Allocation**: Total ckUSDC amount, startup share (80%), platform reserve (20%), transaction fees
- **Transfer Records**: Recipient addresses, ckUSDC transfer amounts, timestamps, transaction hashes
- **Startup Funds**: Available ckUSDC operational balance, withdrawal history, pending transfers, usage reporting
- **Platform Reserve**: ckUSDC reserve balance, purpose allocation, emergency fund status, governance controls
- **Payment Breakdown**: Source analysis (ICP vs ckUSDC ratios), conversion costs, net amounts received
- **Reporting**: ckUSDC fund utilization reports, payment source transparency, audit trails, investor notifications

---

## 7. Monthly Progress Reporting

### Functionality Overview

Template-based system untuk founders submit comprehensive monthly reports tentang financial performance dan operational updates dengan multimedia support.

### UI Description

Structured reporting interface dengan pre-defined sections dan guided input fields. Rich text editor dengan image/video upload capabilities. Auto-save functionality dengan draft management. Visual progress tracking dengan charts dan graphs untuk financial data. Deadline reminders dengan notification system.

### User Flow

1. Founder receives monthly reporting reminder via email/platform
2. Accesses reporting dashboard dengan current month template
3. Fills required sections: financials, operations, challenges, achievements
4. Uploads supporting images/videos dari business operations
5. Reviews dan previews report before submission
6. Submits report yang triggers investor notification
7. Report published untuk investor review dan voting
8. System tracks submission timeliness untuk founder rating

### Required Data

- **Financial Performance**: Monthly revenue, expenses breakdown, net profit, cash flow, variance analysis
- **Operational Updates**: Key achievements, milestones reached, challenges faced, solutions implemented
- **Visual Evidence**: Operational photos, progress videos, facility updates, product showcases
- **Market Conditions**: Competitive landscape, market changes, customer feedback, demand shifts
- **Forward Looking**: Next month plans, expected challenges, resource needs, growth projections
- **Communication**: Investor messages, community updates, partnership news, team changes

---

## 8. Community Voting System

### Functionality Overview

Democratic voting platform untuk NFT holders evaluate monthly startup reports dengan weighted voting berdasarkan NFT ownership dan community reputation.

### UI Description

Clean voting interface dengan report summary, key metrics visualization, dan simple approve/reject buttons. Discussion threads untuk community debate dengan threaded comments. Real-time vote counting dengan percentage displays dan participation rates. Historical voting records dengan trend analysis dan decision impacts.

### User Flow

1. NFT holders receive notification tentang new report available
2. Accesses report review page dengan comprehensive startup update
3. Reads report sections dan views supporting materials
4. Participates dalam community discussion if desired
5. Casts vote: Approve atau Reject dengan optional comments
6. Monitors real-time voting progress dan community sentiment
7. Receives notification tentang final voting result
8. Views impact pada profit sharing distribution

### Required Data

- **Voting Configuration**: Voting period (7 days), approval threshold (50%), eligible voters list
- **Ballot Information**: Report summary, financial highlights, key achievements, concerns raised
- **Vote Records**: Voter addresses, vote choices, timestamps, comments, NFT weight
- **Results Tracking**: Vote counts, percentages, participation rates, approval/rejection status
- **Community Discussion**: Comment threads, replies, upvotes, community sentiment analysis
- **Historical Data**: Past voting patterns, voter reliability, decision outcomes, impact analysis

---

## 9. ckUSDC Profit Sharing Distribution

### Functionality Overview

Smart contract automatic distribution sistem untuk profit sharing payments dalam ckUSDC kepada NFT holders berdasarkan voting results dan proportional ownership untuk stable return consistency.

### UI Description

Distribution dashboard dengan ckUSDC payment calendar, amount calculations, dan recipient lists. Real-time processing status dengan progress indicators for batch ckUSDC payments. Currency stability indicators showing consistent ckUSDC amounts. Transaction confirmation interface dengan ckUSDC payment receipts dan blockchain verification. Portfolio view dengan ckUSDC payment history dan projected future earnings dalam stable currency.

### User Flow

1. Community voting reaches approval threshold untuk monthly report
2. System calculates total ckUSDC profit sharing amount berdasarkan commitment
3. Verifies founder has sufficient ckUSDC balance atau collateral
4. Processes ckUSDC payment dari founder atau auto-deducts dari ckUSDC collateral
5. Distributes ckUSDC proportionally ke all NFT holders
6. Sends ckUSDC payment confirmations dengan transaction details
7. Updates portfolio balances dan ckUSDC payment history
8. Generates tax reporting data untuk recipients dalam ckUSDC

### Required Data

- **Payment Calculation**: Total ckUSDC profit sharing amount, NFT ownership percentages, individual ckUSDC payment amounts
- **Fund Sources**: Founder ckUSDC payment status, ckUSDC collateral deduction amounts, payment methods used
- **Distribution Records**: Recipient addresses, ckUSDC payment amounts, transaction hashes, processing timestamps
- **Payment Status**: Processing status, confirmation receipts, failed payment handling, retry mechanisms
- **Historical Tracking**: ckUSDC payment history, cumulative ckUSDC earnings, projected returns, tax implications
- **Reporting**: ckUSDC payment notifications, portfolio updates, performance analytics, audit trails

---

## 10. Auto-ckUSDC Collateral Deduction

### Functionality Overview

Automated system untuk deduct ckUSDC dari founder collateral ketika profit sharing payments missed lebih dari grace period dengan transparent notification system untuk stable value enforcement.

### UI Description

Alert system dengan clear warnings untuk approaching ckUSDC payment deadlines. Automated deduction interface dengan countdown timers dan ckUSDC amount calculations. Transaction log showing deduction history dalam ckUSDC dengan reasons dan amounts. Balance update notifications dengan remaining ckUSDC collateral status dan future implications.

### User Flow

1. System monitors monthly ckUSDC profit sharing payment deadlines
2. Sends reminder notifications 3 days before due date
3. Triggers grace period (7 days) setelah missed ckUSDC deadline
4. Issues final warning dengan automatic ckUSDC deduction notice
5. Executes ckUSDC collateral deduction untuk cover missed payment
6. Distributes deducted ckUSDC amount ke investors as profit sharing
7. Updates founder ckUSDC collateral balance dan sends notifications
8. Records ckUSDC deduction dalam permanent transaction history

### Required Data

- **Payment Monitoring**: ckUSDC due dates, payment amounts, grace periods, missed payment flags
- **Deduction Logic**: ckUSDC collateral balance checks, deduction amounts, processing fees, minimum balance requirements
- **Notification System**: Reminder schedules, warning messages, final notices, confirmation alerts
- **Transaction Processing**: ckUSDC deduction execution, fund distribution, blockchain confirmations, error handling
- **Balance Management**: Updated ckUSDC collateral amounts, remaining balance, depletion warnings, top-up requirements
- **Audit Trail**: ckUSDC deduction history, reasons, amounts, timestamps, affected parties, resolution status

---

## 11. ckUSDC Wallet Withdrawal System

### Functionality Overview

Secure withdrawal system yang memungkinkan investors dan founders untuk transfer ckUSDC dari platform balance ke external wallet addresses dengan verification dan security measures untuk stable value preservation.

### UI Description

Clean withdrawal interface dengan wallet address input field dan QR code scanner. Available ckUSDC balance display dengan minimum withdrawal requirements. Transaction preview dengan fees calculation dan confirmation steps. Progress tracking untuk withdrawal processing dengan estimated completion time dan transaction status updates. Simple ckUSDC-only interface tanpa currency conversion complexity.

### User Flow

1. User accesses withdrawal section dalam dashboard
2. Views available ckUSDC balance dan minimum withdrawal requirements
3. Enters destination ckUSDC wallet address atau scans QR code
4. Specifies withdrawal amount dalam ckUSDC dengan automatic fee calculation
5. Reviews transaction details dan confirms ckUSDC withdrawal
6. System validates wallet address dan available ckUSDC balance
7. Processes ckUSDC withdrawal dengan blockchain confirmation
8. Sends confirmation notification dengan transaction hash
9. Updates user ckUSDC balance dan transaction history

### Required Data

- **Balance Management**: Available ckUSDC balance, minimum withdrawal amounts, maximum daily limits, fee calculations
- **Wallet Validation**: Destination ckUSDC address format validation, address verification, blacklist checks
- **Transaction Processing**: ckUSDC withdrawal amounts, processing fees, transaction hashes, confirmation status
- **Security Controls**: Daily withdrawal limits dalam ckUSDC, multi-factor authentication, suspicious activity detection
- **History Tracking**: ckUSDC withdrawal records, timestamps, destination addresses, transaction fees, status updates
- **Notifications**: Confirmation emails, SMS alerts, transaction updates, completion notices

---

## 12. Founder ckUSDC Fund Withdrawal System

### Functionality Overview

Dedicated withdrawal system untuk founders access operational funds dalam ckUSDC dari NFT sales dengan approval workflow dan usage tracking untuk transparency, maintaining stable value for business operations.

### UI Description

Founder-specific dashboard menampilkan available operational ckUSDC funds dengan withdrawal request interface. Usage category selection dengan predefined business purposes. Approval workflow interface showing pending requests status. Transaction history with detailed ckUSDC fund usage reporting dan investor transparency features. Clear ckUSDC amount displays tanpa currency conversion complexity.

### User Flow

1. Founder views available operational ckUSDC funds dari NFT sales
2. Initiates withdrawal request dengan business purpose specification
3. Enters withdrawal amount dalam ckUSDC dan destination wallet address
4. Provides usage description dan supporting documentation
5. Submits request untuk platform administrator approval workflow
6. Platform admin reviews ckUSDC withdrawal request dan purpose
7. Upon approval, processes ckUSDC transfer ke founder wallet
8. Updates ckUSDC fund usage records untuk investor transparency
9. Generates ckUSDC usage report untuk community disclosure

### Required Data

- **Fund Allocation**: Available operational ckUSDC funds, reserved amounts, withdrawn balance, remaining ckUSDC funds
- **Withdrawal Requests**: ckUSDC request amounts, business purposes, usage descriptions, supporting documents
- **Approval Workflow**: Request status, admin reviews, approval/rejection reasons, processing timestamps
- **Usage Tracking**: ckUSDC fund utilization categories, expense reporting, transparency logs, investor disclosures
- **Documentation**: Business justifications, receipts, invoices, operational evidence, compliance records
- **Reporting**: ckUSDC usage summaries, fund allocation reports, transparency updates, community communications
