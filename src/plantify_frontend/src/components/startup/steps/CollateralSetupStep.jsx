import React from 'react';
import FileUpload from '../FileUpload';

const CollateralSetupStep = ({ formData, setFormData, errors = {} }) => {
  const handleBusinessPlanUpload = (file) => {
    setFormData(prev => ({
      ...prev,
      businessPlan: file
    }));
  };

  const handleFinancialProjectionsUpload = (file) => {
    setFormData(prev => ({
      ...prev,
      financialProjectionsFile: file
    }));
  };

  const handleLegalDocumentsUpload = (file) => {
    setFormData(prev => ({
      ...prev,
      legalDocuments: file
    }));
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold font-ibm text-gray-900 mb-2">Required Documentation</h2>
      </div>

      <div className="space-y-8">
        {/* Business Plan */}
        <div>
          <FileUpload
            label="Business plan"
            accept=".pdf"
            maxSize="10MB"
            description="(.pdf max 10MB)"
            onFileSelect={handleBusinessPlanUpload}
            required
          />
          <div className="mt-2 text-sm text-gray-600">
            <p className="font-medium">Must include:</p>
            <p>Executive summary, market analysis, competitive landscape, marketing strategy, operational plan, team information, and financial projections</p>
          </div>
        </div>

        {/* Financial Projections */}
        <div>
          <FileUpload
            label="Financial projections"
            accept=".csv,.pdf"
            maxSize="10MB"
            description="(.csv or .pdf max 10MB)"
            onFileSelect={handleFinancialProjectionsUpload}
            required
          />
          <div className="mt-2 text-sm text-gray-600">
            <p className="font-medium">36-month monthly projections in ckUSDC including:</p>
            <p>Revenue, expenses, cash flow, break-even analysis, and profit sharing commitments</p>
          </div>
        </div>

        {/* Legal Documents */}
        <div>
          <FileUpload
            label="Legal documents"
            accept=".zip"
            maxSize="10MB"
            description="(.zip max 10MB)"
            onFileSelect={handleLegalDocumentsUpload}
            required
          />
          <div className="mt-2 text-sm text-gray-600">
            <p className="font-medium">Articles of incorporation, business license, tax ID, founder ID</p>
          </div>
        </div>
      </div>

      {/* Information Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Document Requirements
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure all documents are in English or provide certified translations</li>
                <li>Financial projections must be realistic and well-researched</li>
                <li>Business plan should be comprehensive and professionally written</li>
                <li>All legal documents must be current and valid</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollateralSetupStep;
