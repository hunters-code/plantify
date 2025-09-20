import React, { useEffect } from 'react';

const FinancialProjectionsStep = ({ formData, setFormData, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const inputStyle = `w-full flex items-center gap-[6px] px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.16)] text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-[16px]`;

  // Auto-calculate NFT price based on funding goal
  useEffect(() => {
    if (formData.fundingGoal) {
      const fundingGoal = parseFloat(formData.fundingGoal) || 0;
      const nftPrice = fundingGoal / 100; // Assuming 100 NFTs
      setFormData(prev => ({
        ...prev,
        nftPrice: nftPrice.toString()
      }));
    }
  }, [formData.fundingGoal, setFormData]);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold font-ibm text-gray-900 mb-2">Financial Projections & Funding</h2>
      </div>

      <div className="space-y-6">
        {/* Funding Goal and NFT Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Funding goal (ckUSDC) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="fundingGoal"
              value={formData.fundingGoal || ''}
              onChange={handleChange}
              placeholder="0"
              min="1000"
              className={`${inputStyle} ${errors.fundingGoal ? 'border-red-500' : ''}`}
              required
            />
            <p className="mt-1 text-xs text-gray-500">Minimum: $1,000 ckUSDC</p>
            {errors.fundingGoal && (
              <p className="mt-1 text-sm text-red-600">{errors.fundingGoal}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NFT Price (ckUSDC) - auto calculated
            </label>
            <input
              type="number"
              name="nftPrice"
              value={formData.nftPrice || ''}
              readOnly
              placeholder="100"
              className="w-full px-4 py-3 rounded-[12px] border border-[#E5E5E5] bg-gray-50 text-gray-600 text-[16px]"
            />
            <p className="mt-1 text-xs text-gray-500">
              Auto-calculated based on funding goal. You can adjust manually.
            </p>
          </div>
        </div>

        {/* Monthly Profit Sharing and Revenue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly profit sharing commitment (ckUSDC per NFT) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="monthlyProfitSharing"
              value={formData.monthlyProfitSharing || ''}
              onChange={handleChange}
              placeholder="0"
              min="0"
              step="0.01"
              className={`${inputStyle} ${errors.monthlyProfitSharing ? 'border-red-500' : ''}`}
              required
            />
            <p className="mt-1 text-xs text-gray-500">Amount you commit to pay per NFT monthly</p>
            {errors.monthlyProfitSharing && (
              <p className="mt-1 text-sm text-red-600">{errors.monthlyProfitSharing}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected monthly revenue (ckUSDC) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="expectedMonthlyRevenue"
              value={formData.expectedMonthlyRevenue || ''}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className={`${inputStyle} ${errors.expectedMonthlyRevenue ? 'border-red-500' : ''}`}
              required
            />
            {errors.expectedMonthlyRevenue && (
              <p className="mt-1 text-sm text-red-600">{errors.expectedMonthlyRevenue}</p>
            )}
          </div>
        </div>

        {/* Expected Monthly Expenses and Break-even Month */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected monthly expenses (ckUSDC)
            </label>
            <input
              type="number"
              name="expectedMonthlyExpenses"
              value={formData.expectedMonthlyExpenses || ''}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className={inputStyle}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Break-even month <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="breakEvenMonth"
              value={formData.breakEvenMonth || ''}
              onChange={handleChange}
              placeholder="0"
              min="1"
              className={`${inputStyle} ${errors.breakEvenMonth ? 'border-red-500' : ''}`}
              required
            />
            <p className="mt-1 text-xs text-gray-500">Month when revenue exceeds expenses</p>
            {errors.breakEvenMonth && (
              <p className="mt-1 text-sm text-red-600">{errors.breakEvenMonth}</p>
            )}
          </div>
        </div>

        {/* Revenue Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Revenue model <span className="text-red-500">*</span>
          </label>
          <textarea
            name="revenueModel"
            value={formData.revenueModel || ''}
            onChange={handleChange}
            rows={4}
            placeholder="How will your startup generate revenue?"
            className={`${inputStyle} resize-none ${errors.revenueModel ? 'border-red-500' : ''}`}
            required
          />
          {errors.revenueModel && (
            <p className="mt-1 text-sm text-red-600">{errors.revenueModel}</p>
          )}
        </div>

        {/* Use of Funds */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Use of funds <span className="text-red-500">*</span>
          </label>
          <textarea
            name="useOfFunds"
            value={formData.useOfFunds || ''}
            onChange={handleChange}
            rows={4}
            placeholder="How will you use the raised funds?&#10;e.g. 40% marketing, 30% operations, 20% equipment, 10% working capital"
            className={`${inputStyle} resize-none ${errors.useOfFunds ? 'border-red-500' : ''}`}
            required
          />
          {errors.useOfFunds && (
            <p className="mt-1 text-sm text-red-600">{errors.useOfFunds}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialProjectionsStep;
