/**
 * Example usage of the StartupCard component
 * This file demonstrates how to use the reusable StartupCard component
 */

import { StartupCard, StartupCardProps } from './StartupCard';

// Example 1: Basic usage with minimal props
export function BasicStartupCard() {
  const startupData: StartupCardProps = {
    id: '1',
    image: '/assets/images/startup-example.jpg',
    title: 'EcoFarm Solutions',
    nftPrice: '$75 ckUSDC',
    periodicReturn: '$12',
    fundedText: '45% Funded',
    fundedPct: 0.45,
    totalFunded: 22500,
    fundingGoal: 50000,
  };

  return <StartupCard {...startupData} />;
}

// Example 2: Full featured card with all options
export function FullFeaturedStartupCard() {
  const startupData: StartupCardProps = {
    id: '2',
    image: '/assets/images/startup-example.jpg',
    title: 'TechInnovate',
    description:
      'Revolutionary technology solutions for sustainable agriculture and environmental conservation.',
    category: 'Technology',
    riskLevel: 'Low Risk',
    location: 'San Francisco, CA',
    employees: '25 employees',
    logo: '/assets/images/tech-logo.png',
    nftPrice: '$150 ckUSDC',
    periodicReturn: '$25',
    annualROI: '18.5%',
    availability: '89 NFT',
    fundedText: '78% Funded',
    fundedPct: 0.78,
    totalFunded: 78000,
    fundingGoal: 100000,
  };

  return <StartupCard {...startupData} />;
}

// Example 3: Customized card with specific visibility options
export function CustomizedStartupCard() {
  const startupData: StartupCardProps = {
    id: '3',
    image: '/assets/images/startup-example.jpg',
    title: 'GreenEnergy Corp',
    description: 'Clean energy solutions for a sustainable future.',
    category: 'Energy',
    nftPrice: '$200 ckUSDC',
    periodicReturn: '$35',
    fundedText: '92% Funded',
    fundedPct: 0.92,
    totalFunded: 92000,
    fundingGoal: 100000,
    // Customize visibility
    showLikeButton: false,
    showLocation: false,
    showDescription: true,
    showAnnualROI: false,
    showAvailability: false,
  };

  return <StartupCard {...startupData} />;
}

// Example 4: Card with custom event handlers
export function InteractiveStartupCard() {
  const handleViewDetails = (id: string | number) => {
    // Custom logic here
  };

  const handleInvest = (id: string | number) => {
    // Custom investment logic here
  };

  const startupData: StartupCardProps = {
    id: '4',
    image: '/assets/images/startup-example.jpg',
    title: 'AgriTech Solutions',
    nftPrice: '$100 ckUSDC',
    periodicReturn: '$15',
    fundedText: '60% Funded',
    fundedPct: 0.6,
    totalFunded: 60000,
    fundingGoal: 100000,
    onViewDetails: handleViewDetails,
    onInvest: handleInvest,
  };

  return <StartupCard {...startupData} />;
}
