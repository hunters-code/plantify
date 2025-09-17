import { useState } from 'react';

export default function InvestmentProfile({
  formData,
  handleInputChange,
}) {
  const handleChange = (field, value) => {
    if (handleInputChange) {
      handleInputChange(field, value);
    }
  };

  const inputStyle = `
    w-full flex items-center gap-2 px-4 py-3 
    rounded-xl border border-gray-200 bg-white 
    shadow-md text-gray-900 placeholder-gray-400
    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
    transition-all duration-200 text-[16px]
  `;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-8 font-ibm">
        Investment Profile
      </h2>

      <div className="space-y-6">
        {/* Investment Experience Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Experience Level <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.experienceLevel || ''}
            onChange={e => handleChange('experienceLevel', e.target.value)}
            className={inputStyle}
          >
            <option value="">Select your experience level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        {/* Risk Tolerance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Tolerance <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.riskTolerance || ''}
            onChange={e => handleChange('riskTolerance', e.target.value)}
            className={inputStyle}
          >
            <option value="">Select your risk tolerance</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Primary Investment Goals */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Investment Goals
          </label>
          <select
            value={formData.investmentGoals || ''}
            onChange={e => handleChange('investmentGoals', e.target.value)}
            className={inputStyle}
          >
            <option value="">Select your primary goal</option>
            <option value="growth">Growth</option>
            <option value="income">Income</option>
            <option value="preservation">Capital Preservation</option>
          </select>
        </div>

        {/* Available Investment Capital & Monthly Investment Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Investment Capital <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.investmentCapital || ''}
              onChange={e => handleChange('investmentCapital', e.target.value)}
              className={inputStyle}
            >
              <option value="">Select capital range</option>
              <option value="under_1k">Under $1,000</option>
              <option value="1k_10k">$1,000 - $10,000</option>
              <option value="10k_100k">$10,000 - $100,000</option>
              <option value="100k_plus">$100,000+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Investment Budget
            </label>
            <input
              type="text"
              placeholder="e.g. $100"
              value={formData.monthlyBudget || ''}
              onChange={e => handleChange('monthlyBudget', e.target.value)}
              className={inputStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
