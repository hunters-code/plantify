'use client';

import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';

import { StartupFormData } from '../types';

interface ReviewSubmitStepProps {
  formData: StartupFormData;
  onEdit: (step: number) => void;
}

const ReviewSubmitStep: React.FC<ReviewSubmitStepProps> = ({ formData, onEdit }) => {
  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  const formatFileInfo = (file: File | null | string) => {
    if (!file) return 'No file uploaded';
    if (typeof file === 'string') return file;
    return `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold font-ibm text-gray-900 mb-2">Review & Submit</h2>
      </div>

      {/* NFT Image Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">NFT Image</h3>
        <div className="flex items-start space-x-4">
          <div className="w-40 h-40 bg-gradient-to-br from-orange-300 to-pink-300 rounded-2xl flex items-center justify-center">
            {formData.logo ? (
              <img 
                src={typeof formData.logo === 'string' ? formData.logo : URL.createObjectURL(formData.logo)} 
                alt="NFT Image" 
                className="w-32 h-32 object-cover rounded-xl"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-pink-400 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-400 rounded-full relative">
                      <div className="absolute -top-1 left-1 w-3 h-3 bg-green-300 rounded-full"></div>
                      <div className="absolute -top-1 right-1 w-3 h-3 bg-green-300 rounded-full"></div>
                      <div className="absolute top-1 -left-1 w-3 h-3 bg-green-300 rounded-full"></div>
                      <div className="absolute top-1 -right-1 w-3 h-3 bg-green-300 rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-orange-600 rounded-full mx-auto"></div>
                </div>
              </div>
            )}
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Generate Image</span>
          </button>
        </div>
      </div>

      {/* Startup Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Startup information</h3>
          <button 
            onClick={() => onEdit(1)} 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-x-16 gap-y-4 text-sm">
          <div>
            <div className="text-gray-600 text-sm mb-1">Name</div>
            <div className="text-gray-900 font-semibold">{formData.startupName || 'EcoTech Solution'}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Sector</div>
            <div className="text-gray-900 font-semibold">{formData.sector || 'Technology & Digital'}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Company type</div>
            <div className="text-gray-900 font-semibold">{formData.companyType || 'LLC'}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Location</div>
            <div className="text-gray-900 font-semibold">{formData.location || 'San Francisco, USA'}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Founded Year</div>
            <div className="text-gray-900 font-semibold">{formData.foundedYear || '2023'}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Website</div>
            <div className="text-gray-900 font-semibold">{formData.website || 'https://ecotechsolutions.com'}</div>
          </div>
        </div>
      </div>

      {/* Business Model */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Business Model</h3>
          <button 
            onClick={() => onEdit(2)} 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        </div>
        <div className="space-y-4 text-sm">
          <div>
            <span className="text-gray-600">Problem Statement</span>
            <p className="text-gray-900 mt-1">{formData.problemStatement || 'Traditional energy systems are inefficient and contribute to environmental degradation.'}</p>
          </div>
          <div>
            <span className="text-gray-600">Solution</span>
            <p className="text-gray-900 mt-1">{formData.solution || 'AI-powered smart grid technology that optimizes energy distribution and reduces waste by 40%.'}</p>
          </div>
          <div>
            <span className="text-gray-600">Target Market</span>
            <p className="text-gray-900 mt-1">{formData.targetMarket || 'Smart cities, commercial buildings, and residential communities seeking sustainable energy solutions.'}</p>
          </div>
          <div>
            <span className="text-gray-600">Competitive Advantage</span>
            <p className="text-gray-900 mt-1">{formData.competitiveAdvantage || 'Proprietary AI algorithms and partnerships with major utility companies.'}</p>
          </div>
        </div>
      </div>

      {/* Team Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Team Information</h3>
          <button 
            onClick={() => onEdit(3)} 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
        </div>
        <div className="space-y-6">
          {/* Founder */}
          <div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
              <div>
                <span className="text-gray-600 text-sm">Full name</span>
                <p className="text-gray-900 font-semibold">{formData.founderName || 'Sarah Johnson'}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Role</span>
                <p className="text-gray-900 font-semibold">{formData.founderRole || 'CEO & Founder'}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Email</span>
                <p className="text-gray-900 font-semibold">{formData.founderEmail || 'sarah@ecotechsolutions.com'}</p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">LinkedIn</span>
                <p className="text-gray-900 font-semibold">{formData.founderLinkedIn || 'https://linkedin.com/in/sarahjohnson'}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-gray-600 text-sm">Professional background</span>
              <p className="text-gray-900 font-semibold text-sm mt-1">{formData.founderBackground || 'Former Tesla engineer with 8 years experience in renewable energy systems and AI'}</p>
            </div>
          </div>

          {/* Team Members */}
          {formData.teamMembers && formData.teamMembers.map((member, index) => (
            <div key={index} className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
                <div>
                  <span className="text-gray-600 text-sm">Full name</span>
                  <p className="text-gray-900 font-semibold">{member.name || 'Team Member'}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Role</span>
                  <p className="text-gray-900 font-semibold">{member.role || 'Role'}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Email</span>
                  <p className="text-gray-900 font-semibold">{member.email || 'email@example.com'}</p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">LinkedIn</span>
                  <p className="text-gray-900 font-semibold">{member.linkedin || 'https://linkedin.com/in/example'}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-gray-600 text-sm">Professional background</span>
                <p className="text-gray-900 font-semibold text-sm mt-1">{member.background || 'Professional background'}</p>
              </div>
            </div>
          ))}

          {/* Advisors */}
          <div className="pt-6 border-t border-gray-200">
            <span className="text-gray-600 text-sm">Advisors</span>
            <p className="text-gray-900 font-semibold text-sm mt-1">{formData.advisors || 'Dr. Lisa Wang (Former VP at Tesla), John Smith (Partner at GreenTech Ventures)'}</p>
          </div>
        </div>
      </div>

      {/* Financial Projections & Commitment */}
      <div className="grid grid-cols-2 gap-6">
        {/* Funding Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Funding Details</h3>
            <button 
              onClick={() => onEdit(4)} 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Funding goal</span>
              <span className="text-gray-900 font-semibold">{formatCurrency(formData.fundingGoal) || '$5,000 ckUSDC'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">NFT price</span>
              <span className="text-gray-900 font-semibold">{formatCurrency(formData.nftPrice) || '$500 ckUSDC'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Total NFTs</span>
              <span className="text-gray-900 font-semibold">100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Monthly revenue</span>
              <span className="text-gray-900 font-semibold">{formatCurrency(formData.expectedMonthlyRevenue) || '$15,000 ckUSDC'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Monthly expenses</span>
              <span className="text-gray-900 font-semibold">{formatCurrency(formData.expectedMonthlyExpenses) || '$10,000 ckUSDC'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Break-even month</span>
              <span className="text-gray-900 font-semibold">{formData.breakEvenMonth || '8'}</span>
            </div>
          </div>
        </div>

        {/* Profit Sharing Commitment */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Sharing Commitment</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Monthly per NFT</span>
              <span className="text-gray-900 font-semibold">{formatCurrency(formData.monthlyProfitSharing) || '$5 ckUSDC'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Total monthly</span>
              <span className="text-gray-900 font-semibold">$500 ckUSDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Annual total</span>
              <span className="text-gray-900 font-semibold">$6,000 ckUSDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">3-year total</span>
              <span className="text-gray-900 font-semibold">$18,000 ckUSDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Collateral required</span>
              <span className="text-gray-900 font-semibold">$6,000 ckUSDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Investment period</span>
              <span className="text-gray-900 font-semibold">36 months</span>
            </div>
          </div>
        </div>
      </div>

      {/* Collateral Setup & Document Status */}
      <div className="grid grid-cols-2 gap-6">
        {/* Collateral Setup */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Collateral Setup</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Payment method</span>
              <span className="text-gray-900 font-semibold">ckUSDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Available amount</span>
              <span className="text-gray-900 font-semibold">3,000 ckUSDC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 text-sm">Lock period</span>
              <span className="text-gray-900 font-semibold">36 months</span>
            </div>
          </div>
        </div>

        {/* Document Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Document Status</h3>
            <button 
              onClick={() => onEdit(5)} 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Edit
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-900 font-semibold">Business Plan</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-900 font-semibold">Financial Projections</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-900 font-semibold">Legal Documents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Before Submission */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Before submission
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Review all information for accuracy</li>
                <li>Ensure you have sufficient ckUSDC/ICP for collateral</li>
                <li>Understand 36-month commitment requirement</li>
                <li>Platform review may take 5-7 business days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmitStep;
