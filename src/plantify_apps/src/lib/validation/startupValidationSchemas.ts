import * as Yup from 'yup';

// Validation schema for each step
export const validationSchemas = [
  // Step 1: Basic Information
  Yup.object().shape({
    startupName: Yup.string().required('Startup name is required'),
    sector: Yup.string().required('Business sector is required'),
    foundedYear: Yup.string().required('Founded year is required'),
    companyType: Yup.string().required('Company type is required'),
    location: Yup.string().required('Location is required'),
    description: Yup.string().required('Business description is required'),
  }),
  // Step 2: Business Details
  Yup.object().shape({
    problemStatement: Yup.string().required('Problem statement is required'),
    solution: Yup.string().required('Solution is required'),
    targetMarket: Yup.string().required('Target market is required'),
    competitiveAdvantage: Yup.string().required(
      'Competitive advantage is required'
    ),
    marketingStrategy: Yup.string().required('Marketing strategy is required'),
    operationalProcess: Yup.string().required(
      'Operational process is required'
    ),
  }),
  // Step 3: Team & Background
  Yup.object().shape({
    founderName: Yup.string().required('Founder name is required'),
    founderRole: Yup.string().required('Founder role is required'),
    founderEmail: Yup.string()
      .email('Invalid email')
      .required('Founder email is required'),
    founderLinkedIn: Yup.string().required('Founder LinkedIn is required'),
    founderBackground: Yup.string().required('Founder background is required'),
    advisors: Yup.string().required('Advisors information is required'),
  }),
  // Step 4: Financial Projections
  Yup.object().shape({
    fundingGoal: Yup.string().required('Funding goal is required'),
    monthlyProfitSharing: Yup.string().required(
      'Monthly profit sharing is required'
    ),
    expectedMonthlyRevenue: Yup.string().required(
      'Expected monthly revenue is required'
    ),
    breakEvenMonth: Yup.string().required('Break-even month is required'),
    revenueModel: Yup.string().required('Revenue model is required'),
    useOfFunds: Yup.string().required('Use of funds is required'),
  }),
  // Step 5: Collateral Setup (no validation required)
  Yup.object().shape({}),
  // Step 6: Review & Submit (no validation required)
  Yup.object().shape({}),
];
